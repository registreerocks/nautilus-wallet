import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import {
  Algos,
  AssetHolding,
  convertToAlgos,
  extractAlgorandAssetBalance,
  MicroAlgos,
} from 'src/app/services/algosdk.utils';
import { assetAmountAlgo } from 'src/app/utils/assets/assets.algo';
import { convertFromLedgerToAssetAmountAsa } from 'src/app/utils/assets/assets.algo.asa';
import { AssetAmount } from 'src/app/utils/assets/assets.common';
import { defined } from 'src/app/utils/errors/panic';
import { allDefinedOrNone, ifDefined } from 'src/helpers/helpers';
import { WalletDisplay } from 'src/schema/entities';
import { SessionState, SessionStore } from './session.store';

/**
 * Application code should use this interface to query the session store.
 */
@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {
  wallet: Observable<SessionState['wallet']> = this.select('wallet');
  pin: Observable<SessionState['pin']> = this.select('pin');
  algorandAccountData: Observable<SessionState['algorandAccountData']> =
    this.select('algorandAccountData');

  // Wallet field queries:

  walletId: Observable<WalletDisplay['wallet_id'] | undefined> = this.select(
    ({ wallet }) => wallet?.wallet_id
  );
  name: Observable<WalletDisplay['owner_name'] | undefined> = this.select(
    ({ wallet }) => wallet?.owner_name
  );
  algorandAddressBase32: Observable<
    WalletDisplay['algorand_address_base32'] | undefined
  > = this.select(({ wallet }) => wallet?.algorand_address_base32);

  // Algorand account field queries:

  algorandBalanceInMicroAlgos: Observable<MicroAlgos | undefined> = this.select(
    ({ algorandAccountData }) => algorandAccountData?.amount
  );

  algorandBalanceInAlgos: Observable<Algos | undefined> = this.select(
    ({ algorandAccountData }) =>
      ifDefined(algorandAccountData?.amount, convertToAlgos)
  );

  algorandAlgoBalance: Observable<AssetAmount | undefined> = this.select(
    ({ algorandAccountData }) =>
      ifDefined(algorandAccountData?.amount, (amount: MicroAlgos) =>
        assetAmountAlgo(convertToAlgos(amount))
      )
  );

  algorandAssetBalances: Observable<AssetAmount[] | undefined> = this.select(
    ({ algorandAccountData, algorandAssetParams }) =>
      ifDefined(algorandAccountData?.assets, (assetHoldings) =>
        allDefinedOrNone(
          // Look up each asset holding's info in algorandAssetParams.
          assetHoldings.map(({ amount, 'asset-id': assetId }: AssetHolding) =>
            ifDefined(algorandAssetParams?.[assetId], (assetParams) =>
              ifDefined(
                assetParams?.['unit-name'],
                (unitName): AssetAmount =>
                  convertFromLedgerToAssetAmountAsa({
                    amount,
                    assetId,
                    unitName,
                    decimals: assetParams.decimals,
                  })
              )
            )
          )
        )
      )
  );

  algorandBalances: Observable<AssetAmount[]> = combineLatest([
    this.algorandAlgoBalance,
    this.algorandAssetBalances,
  ]).pipe(
    map(
      ([algoBalance, assetBalances]: [
        AssetAmount | undefined,
        AssetAmount[] | undefined
      ]) => [
        ...(algoBalance !== undefined ? [algoBalance] : []),
        ...(assetBalances ?? []),
      ]
    ),
    distinctUntilChanged()
  );

  constructor(protected store: SessionStore) {
    super(store);
  }

  // Non-observable accessors:

  getAlgorandBalanceInMicroAlgos(): MicroAlgos | undefined {
    return this.getValue().algorandAccountData?.amount;
  }

  getAlgorandBalanceInAlgos(): Algos | undefined {
    return ifDefined(
      this.getValue().algorandAccountData?.amount,
      convertToAlgos
    );
  }

  getAlgorandAssetHoldings(): AssetHolding[] | undefined {
    return this.getValue().algorandAccountData?.assets;
  }

  hasAlgorandBalance() {
    return 0 < (this.getAlgorandBalanceInMicroAlgos() ?? 0);
  }

  /**
   * Get the current Algorand account's balance for the given ASA.
   *
   * @return 0 if a zero-balance asset holding exists (account is opted-in to the ASA)
   * @return null if no asset holding exists (account is not opted-in to the ASA)
   *
   * @throws Error if `sessionStore.algorandAccountData` is not defined
   */
  getAlgorandAssetBalance(assetId: number): null | number {
    return extractAlgorandAssetBalance(
      defined(this.getValue().algorandAccountData),
      assetId
    );
  }

  hasAlgorandAssetBalance(assetId: number): boolean {
    return this.getAlgorandAssetBalance(assetId) !== null;
  }

  /**
   * Helper: True if the store contains an active user session.
   */
  isActiveSession() {
    const { wallet, pin } = this.getValue();
    return wallet !== undefined && pin !== undefined;
  }

  /**
   * Helper: Return the current session's wallet + PIN, assuming it's active.
   *
   * @throws {Error} if a session isn't active.
   */
  assumeActiveSession(): Required<Pick<SessionState, 'wallet' | 'pin'>> {
    const prefix = 'SessionAlgorandService.assumeSession: invalid state';
    const { wallet, pin } = this.getValue();
    return {
      wallet: defined(wallet, `${prefix}: wallet not defined`),
      pin: defined(pin, `${prefix}: pin not defined`),
    };
  }
}
