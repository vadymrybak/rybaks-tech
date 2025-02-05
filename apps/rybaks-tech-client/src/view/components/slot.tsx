import React, { FC, ReactElement } from 'react';

export const Slot: FC<{
  name?: string;
  children?: ReactElement[] | ReactElement | string;
}> = ({ children }) => <>{children}</>;
