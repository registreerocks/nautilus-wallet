import { Story } from '@storybook/angular';
import { ionicStoryMeta } from 'src/stories/storybook.helpers';
import { ProfileCardHorizontalComponent } from './profile-card-horizontal.component';

export default ionicStoryMeta<ProfileCardHorizontalComponent>({
  title: 'Components/ProfileCardHorizontalComponent',
  component: ProfileCardHorizontalComponent,
});

const Template: Story<ProfileCardHorizontalComponent> = (
  args: ProfileCardHorizontalComponent
) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  title: 'Dr.',
  fullName: 'Nautilus Wallet',
  cellphone: '+27 (12) 456-7890',
  avatar: 'assets/img/logo.svg',
};
