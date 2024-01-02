import type { IFormFieldWrapperProps, ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';
import React, { forwardRef } from 'react';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'>,
    Omit<ITextareaProps, 'disabled'> {}

export const TextareaField = forwardRef<
  HTMLTextAreaElement,
  ITextareaFieldProps
>(function TextareaField(
  { disabled = false, id, status, tag, info, helperText, label, ...rest },
  ref,
) {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader label={label} tag={tag} info={info} />
      )}

      <Textarea ref={ref} disabled={disabled} id={id} {...rest} />

      {Boolean(helperText) && status !== 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
      {Boolean(helperText) && status === 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
    </div>
  );
});
