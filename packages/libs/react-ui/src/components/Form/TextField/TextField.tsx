import { useObjectRef } from '@react-aria/utils';
import React, { forwardRef } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useTextField } from 'react-aria';
import type { FormFieldStatus } from '../Form.css';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';
import type { IInputProps } from '../Input/Input';
import { Input } from '../Input/Input';

export interface ITextFieldProps
  extends Omit<
      IInputProps,
      | 'children'
      | 'label'
      | 'id'
      | 'disabled'
      | 'defaultValue'
      | 'onBlur'
      | 'onChange'
      | 'onFocus'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'type'
      | 'value'
    >,
    Omit<
      AriaTextFieldProps,
      | 'children'
      | 'label'
      | 'defaultValue'
      | 'onBlur'
      | 'onChange'
      | 'onFocus'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'type'
      | 'value'
    > {
  status?: FormFieldStatus;
  disabled?: boolean;
  label?: string;
  tag?: string;
  info?: string;
  helperText?: string;
  id: string;
}

export const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
  function TextField(props, forwardedRef) {
    const {
      disabled = false,
      status,
      id,
      label,
      info,
      tag,
      leadingText,
      outlined,
      startIcon,
      className,
      fontFamily,
      helperText,
    } = props;

    const ref = useObjectRef<HTMLInputElement>(forwardedRef);

    const {
      labelProps,
      inputProps: ariaInputProps,
      descriptionProps,
      errorMessageProps,
      isInvalid,
    } = useTextField(
      {
        isInvalid: status === 'negative',
        ...props,
      },
      ref,
    );

    const statusVal = disabled === true ? 'disabled' : status;

    return (
      <div className={statusVal ? statusVariant[statusVal] : undefined}>
        {label !== undefined && (
          <FormFieldHeader
            label={label}
            tag={tag}
            info={info}
            {...labelProps}
          />
        )}
        <Input
          {...ariaInputProps}
          ref={ref}
          disabled={disabled}
          id={id}
          leadingText={leadingText}
          startIcon={startIcon}
          outlined={outlined}
          status={status}
          className={className}
          fontFamily={fontFamily}
        />
        {Boolean(helperText) && !isInvalid && (
          <FormFieldHelper {...descriptionProps}>{helperText}</FormFieldHelper>
        )}
        {Boolean(helperText) && isInvalid && (
          <FormFieldHelper {...errorMessageProps}>{helperText}</FormFieldHelper>
        )}
      </div>
    );
  },
);
