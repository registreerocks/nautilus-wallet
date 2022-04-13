import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import { componentWrapperDecorator, moduleMetadata } from "@storybook/angular";
import { NgxPrinterModule } from "ngx-printer";
// Generated by the docs:json / storybook npm run commands:
import docJson from "../documentation/documentation.json";
import { TranslocoRootModule } from "../src/app/transloco/transloco-root.module";

setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },

  docs: {
    // Docs: https://storybook.js.org/docs/angular/writing-docs/docs-page#inline-stories-vs-iframe-stories
    inlineStories: true,
  },
};

// Provide context for Ionic components
export const decorators = [
  // See AppModule:
  moduleMetadata({
    imports: [
      IonicModule.forRoot(),
      RouterTestingModule,
      HttpClientModule,
      TranslocoRootModule,
      NgxPrinterModule.forRoot({ printOpenWindow: false }),
    ],
  }),
  // See AppComponent's template:
  componentWrapperDecorator(
    (story) => `
      <ion-app color="primary">
        <ion-router-outlet class="sm:max-w-md max-w-full m-auto">${story}</ion-router-outlet>
      </ion-app>
    `
  ),
];
