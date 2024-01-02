import { SystemIcon } from '@components/Icon';
import { Label } from '@components/Typography/Label/Label';
import type { FC } from 'react';
import React from 'react';
import { headerClass, infoClass, tagClass } from './FormFieldHeader.css';

export interface IFormFieldHeaderProps {
  label: string;
  tag?: string;
  info?: string;
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
          <SystemIcon.AlertCircleOutline size="sm" />
        </span>
      )}
    </div>
  );
};
