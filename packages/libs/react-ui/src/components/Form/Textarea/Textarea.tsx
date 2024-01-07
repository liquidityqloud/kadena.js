import { atoms } from '@theme/atoms.css';
import classNames from 'classnames';
import type { FC, TextareaHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import type { FormFieldStatus } from '../Form.css';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';
import {
  buttonContainerClass,
  disabledClass,
  textAreaClass,
  textAreaContainerClass,
} from './Textarea.css';

export interface ITextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'as' | 'disabled' | 'className' | 'id'
  > {
  id: string;
  fontFamily?: 'primaryFont' | 'codeFont';
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  outlined?: boolean;
  status?: FormFieldStatus;
}

/**
 * @deprecated Use `TextareaField` instead.
 */
export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea(
  { outlined = false, disabled = false, fontFamily, children, status, ...rest },
  ref,
) {
  return (
    <div
      className={classNames(baseContainerClass, textAreaContainerClass, {
        [baseOutlinedClass]: outlined || status,
        [disabledClass]: disabled,
      })}
    >
      <textarea
        ref={ref}
        className={classNames(textAreaClass, atoms({ fontFamily }))}
        disabled={disabled}
        {...rest}
      />
      {children && <div className={buttonContainerClass}>{children}</div>}
    </div>
  );
});
