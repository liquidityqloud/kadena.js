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
  extends Pick<
      IInputProps,
      'leadingText' | 'outlined' | 'startIcon' | 'className' | 'fontFamily'
    >,
    AriaTextFieldProps {
  status?: FormFieldStatus;
  disabled?: boolean;
  label?: string;
  tag?: string;
  info?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
  function TextField(props, forwardedRef) {
    const {
      disabled = false,
      status,
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
      validationErrors,
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
          <FormFieldHelper {...errorMessageProps}>
            {validationErrors.join(' ')}
          </FormFieldHelper>
        )}
      </div>
    );
  },
);
