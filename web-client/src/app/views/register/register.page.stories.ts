import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InputMaskModule } from '@ngneat/input-mask';
import { Story } from '@storybook/angular';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ionicStoryMeta } from 'src/stories/storybook.helpers';
import { RegisterPage } from './register.page';

export default ionicStoryMeta<RegisterPage>(
  {
    title: 'Views/RegisterPage',
    component: RegisterPage,
  },
  {
    imports: [
      HttpClientTestingModule,
      SharedModule,
      InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    ],
    controls: {
      shown: ['nonValidSubmit', 'onSubmit'],
      outputs: ['onSubmit'],
    },
    layoutType: 'page',
  }
);

const Template: Story<RegisterPage> = (args: RegisterPage) => ({
  props: args,
});

export const Default = Template.bind({});
