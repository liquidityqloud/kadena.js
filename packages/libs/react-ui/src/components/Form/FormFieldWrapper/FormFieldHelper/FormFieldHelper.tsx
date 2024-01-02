import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';
import { helperClass, helperIconClass } from './FormFieldHelper.css';

interface IFormFieldHelperProps {
  children: React.ReactNode;
}

export const FormFieldHelper: FC<IFormFieldHelperProps> = ({
  children,
  ...rest
}) => {
  return (
    <span className={helperClass} {...rest}>
      <span className={helperIconClass}>
        <SystemIcon.AlertBox size="sm" />
      </span>
      {children}
    </span>
  );
};
