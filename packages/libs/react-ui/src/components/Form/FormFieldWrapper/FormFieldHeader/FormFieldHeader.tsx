import type { FC, ReactNode } from 'react';
import React from 'react';
import { AlertCircleOutline } from '../../../Icon/System/SystemIcon';
import { Label } from '../../../Typography/Label/Label';
import { headerClass, infoClass, tagClass } from './FormFieldHeader.css';

export interface IFormFieldHeaderProps {
  label: ReactNode;
  tag?: string;
  info?: string;
  htmlFor?: string;
}

export const FormFieldHeader: FC<IFormFieldHeaderProps> = ({
  label,
  tag,
  info,
  ...rest
}) => {
  return (
    <div className={headerClass}>
      {Boolean(label) && <Label {...rest}>{label}</Label>}
      {Boolean(tag) && <span className={tagClass}>{tag}</span>}
      {Boolean(info) && (
        <span className={infoClass}>
          {info}
          <AlertCircleOutline size="sm" />
        </span>
      )}
    </div>
  );
};
