import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';
import { ScannerPage, ScanResult } from 'src/app/views/scanner/scanner.page';

export type ModalSpies = {
  modalCreateSpy: jasmine.Spy<ModalController['create']>;
  modalSpy: jasmine.SpyObj<HTMLIonModalElement>;
};

/** Stub {@link ModalController.create} with a modal that returns `dismissResult` on dismiss.  */
export const stubModalResult = <R>(
  modalCtrl: ModalController,
  dismissResult: R
): ModalSpies => {
  const modalSpy = jasmine.createSpyObj<HTMLIonModalElement>('Modal', {
    present: Promise.resolve(),
    onDidDismiss: Promise.resolve({ data: dismissResult }),
  });
  const modalCreateSpy = spyOn(modalCtrl, 'create').and.resolveTo(modalSpy);
  return { modalCreateSpy, modalSpy };
};

/** Expect a modal with the given component to have been presented. */
export const expectModalComponentPresented = (
  spies: ModalSpies,
  expectedCreateOpts: ModalOptions
): void => {
  expect(spies.modalCreateSpy).toHaveBeenCalledOnceWith(expectedCreateOpts);
  expect(spies.modalSpy.present).toHaveBeenCalledOnceWith();
};

/**
 * Wrap `f` with the given stubbed modal component and result.
 */
export const withStubbedModal = async <R>(
  modalCtrl: ModalController,
  expectedCreateOpts: ModalOptions,
  dismissResult: R,
  f: () => Promise<void>
): Promise<void> => {
  const modalSpies = stubModalResult(modalCtrl, dismissResult);
  await f();
  expectModalComponentPresented(modalSpies, expectedCreateOpts);
};

/**
 * Convenience helper: `withStubbedModal` for `ScannerPage`.
 */
export const withStubbedModalScanner = async (
  modalCtrl: ModalController,
  dismissResult: ScanResult,
  f: () => Promise<void>
): Promise<void> => {
  await withStubbedModal<ScanResult>(
    modalCtrl,
    { component: ScannerPage },
    dismissResult,
    async () => {
      await f();
    }
  );
};
