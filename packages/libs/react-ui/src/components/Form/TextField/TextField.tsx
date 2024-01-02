import type { FormFieldStatus, IInputProps } from '@components/Form';
import { Input } from '@components/Form';
import type { FC, FunctionComponentElement, RefObject } from 'react';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
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
      | 'id'
      | 'defaultValue'
      | 'onBlur'
      | 'onChange'
      | 'onFocus'
      | 'onKeyDown'
      | 'onKeyUp'
      | 'type'
      | 'value'
    > {
  children:
    | FunctionComponentElement<IInputProps>
    | FunctionComponentElement<IInputProps>[];
  status?: FormFieldStatus;
  disabled?: boolean;
  helperText?: string;
  label?: string;
  tag?: string;
  info?: string;
}

export const TextField: FC<ITextFieldProps> = forwardRef<
  HTMLInputElement,
  ITextFieldProps
>(function TextField(props, forwardedRef) {
  const {
    disabled = false,
    status,
    id,
    label,
    info,
    tag,
    helperText,
    ...inputProps
  } = props;

  const localRef = useRef<HTMLInputElement>(null);
  const ref = forwardedRef ?? localRef;

  const {
    labelProps,
    inputProps: ariaInputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
  } = useTextField(
    {
      id,
      validationState: status === 'negative' ? 'invalid' : 'valid',
      isDisabled: disabled,
      ...inputProps,
    },
    ref as RefObject<HTMLInputElement>,
  );

  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader label={label} tag={tag} info={info} {...labelProps} />
      )}
      <Input
        ref={ref}
        disabled={disabled}
        id={id}
        {...inputProps}
        {...ariaInputProps}
      />
      {Boolean(helperText) && !isInvalid && (
        <FormFieldHelper {...descriptionProps}>{helperText}</FormFieldHelper>
      )}
      {Boolean(helperText) && isInvalid && (
        <FormFieldHelper {...errorMessageProps}>
          {helperText}lolo
        </FormFieldHelper>
      )}
    </div>
  );
});
