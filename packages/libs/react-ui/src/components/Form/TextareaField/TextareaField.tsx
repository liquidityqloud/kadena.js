import { useObjectRef } from '@react-aria/utils';
import React, { forwardRef } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useTextField } from 'react-aria';
import type { FormFieldStatus } from '../Form.css';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';
import type { ITextareaProps } from '../Textarea/Textarea';
import { Textarea } from '../Textarea/Textarea';

export interface ITextareaFieldProps
  extends Pick<ITextareaProps, 'outlined' | 'fontFamily'>,
    Omit<AriaTextFieldProps, 'children'> {
  status?: FormFieldStatus;
  disabled?: boolean;
  label?: string;
  tag?: string;
  info?: string;
  helperText?: string;
  id: string;
}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  ITextareaFieldProps
>(function TextareaField(props, forwardedRef) {
  const {
    disabled = false,
    id,
    status,
    tag,
    info,
    helperText,
    label,
    outlined,
    fontFamily,
  } = props;

  const ref = useObjectRef<HTMLTextAreaElement>(forwardedRef);

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
  } = useTextField(
    {
      isInvalid: status === 'negative',
      inputElementType: 'textarea',
      ...props,
    },
    ref,
  );

  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader label={label} tag={tag} info={info} {...labelProps} />
      )}

      <Textarea
        {...inputProps}
        ref={ref}
        disabled={disabled}
        id={id}
        outlined={outlined}
        status={status}
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
});
