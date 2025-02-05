import React, { FC } from 'react';
import { HelloWorld } from './hello';
import { I18n } from '../../../store';
import './index.less';

export const Hello: FC<{
  onClick: () => void;
  buttonTitle: string;
  title: string;
  i18n: I18n;
}> = ({ onClick, buttonTitle, title, i18n }) => {
  return (
    <>
      <div className="react"></div>
      <HelloWorld size={20}>{title}</HelloWorld>
      <div style={{ marginTop: 300, position: 'absolute', marginLeft: -115 }}>Div</div>
    </>
  );
};
