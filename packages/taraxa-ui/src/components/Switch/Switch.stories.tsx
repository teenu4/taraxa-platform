import React from 'react';
import { Story, Meta } from '@storybook/react';
import Switch, { SwitchProps } from './Switch';

export default {
  title: 'Components/Switch',
  component: Switch,
} as Meta;

const Template: Story<SwitchProps> = (args) => <Switch {...args} />;

export const Primary = Template.bind({});
Primary.args = { name: 'Test' };
