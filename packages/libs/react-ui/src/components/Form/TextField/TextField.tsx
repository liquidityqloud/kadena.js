import type { FormFieldStatus, IInputProps } from '@components/Form'; // import from components
import { Input } from '@components/Form';
import { useObjectRef } from '@react-aria/utils';
import type { FunctionComponentElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useTextField } from 'react-aria';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';

// do i wanna just extend FormFieldWrapperProps?
export interface ITextFieldProps
  extends Omit<
      IInputProps,
      | 'children'
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
      // | 'id'
      // | 'defaultValue'
      // | 'onBlur'
      | 'onChange'
      // | 'onFocus'
      // | 'onKeyDown'
      // | 'onKeyUp'
      // | 'type'
      // | 'value'
    > {
  status?: FormFieldStatus;
  disabled?: boolean;
  helperText?: string;
  label?: string;
  tag?: string;
  info?: string;
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
      // helperText,
      // leadingText,
      // outlined,
      // startIcon,
      ...inputProps
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
        validationState: status === 'negative' ? 'invalid' : 'valid',
        isInvalid: status === 'negative',
        ...props,
      },
      ref,
    );
    console.log(validationErrors);

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
          {...inputProps}
          {...ariaInputProps}
        />
        {Boolean(props.description) && !isInvalid && (
          <FormFieldHelper {...descriptionProps}>
            {props.description}
          </FormFieldHelper>
        )}
        {isInvalid && (
          <FormFieldHelper {...errorMessageProps}>
            {validationErrors.join(' ')}
          </FormFieldHelper>
        )}
      </div>
    );
  },
);
