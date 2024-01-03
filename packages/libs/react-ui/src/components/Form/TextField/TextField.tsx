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
    console.log(validationErrors, props.errorMessage);

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
          ref={ref}
          disabled={disabled}
          id={id}
          leadingText={leadingText}
          startIcon={startIcon}
          outlined={outlined}
          status={status}
          className={className}
          fontFamily={fontFamily}
          {...ariaInputProps}
        />
        {Boolean(props.description) && !isInvalid && (
          <FormFieldHelper {...descriptionProps}>
            {props.description}
          </FormFieldHelper>
        )}
        {isInvalid && (
          <FormFieldHelper {...errorMessageProps}>
            {props.errorMessage}
          </FormFieldHelper>
        )}
      </div>
    );
  },
);
