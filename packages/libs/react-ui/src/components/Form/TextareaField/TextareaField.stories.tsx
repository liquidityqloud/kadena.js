import type { ITextareaFieldProps } from '@components/Form';
import { TextareaField } from '@components/Form';
import { onLayer2, withContentWidth } from '@storyDecorators';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<ITextareaFieldProps> = {
  title: 'Form/TextareaField',
  component: TextareaField,
  decorators: [withContentWidth, onLayer2],
  parameters: {
    status: { type: 'inDevelopment' },
    docs: {
      description: {
        component:
          'The TextareaField component is a wrapper around the native textarea element that provides the ability to add additional information.',
      },
    },
  },
  argTypes: {
    disabled: {
      description: 'Disables the input and applies visual styling.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;

type Story = StoryObj<ITextareaFieldProps>;

export const TextFieldStory: Story = {
  name: 'TextField config',
  args: {
    disabled: false,
    tag: 'tag',
    helperText: 'This is helper text',
    info: '(optional)',
    label: 'Label',
    id: 'TextFieldStory',
    fontFamily: 'codeFont',
    placeholder: 'This is a placeholder',
    value: '',
    onChange: () => {},
  },
  render: ({ disabled, ...rest }) => {
    const [value, setValue] = useState<string>('');

    return (
      <TextareaField
        disabled={disabled}
        {...rest}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
    );
  },
};
