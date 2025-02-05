import React, { FC, ReactElement, Children } from 'react';
import { observer } from 'mobx-react';
import { Wrapper } from './wrapper';
import { Content } from './content';
import { Header } from './header';
import { Footer } from './footer';
import { Version } from '../../components';
import { Store } from '../../../store';
import { COMMON, SLOTS } from '../../consts';

export const Layout: FC<{
  headerHeight?: number;
  footerHeight?: number;
  children?: ReactElement[];
}> = observer(
  ({
    headerHeight = COMMON.HEADER_HEIGHT,
    footerHeight = COMMON.FOOTER_HEIGHT,
    children,
  }) => {
    const { config } = Store.useStore();
    const slots = Children.toArray(children) as ReactElement[];
    const header = slots.find((item) => item.props.name === SLOTS.HEADER) ?? null;
    const content = slots.find((item) => item.props.name === SLOTS.CONTENT) ?? null;
    const footer = slots.find((item) => item.props.name === SLOTS.FOOTER) ?? null;
    return (
      <Wrapper $offsetTop={headerHeight} $offsetBottom={footerHeight}>
        <Header $height={headerHeight}>{header}</Header>
        <Content>{content}</Content>
        <Footer $height={footerHeight}>{footer}</Footer>
        <Version>v{config.get<string>('version', '0.0.0')}</Version>
      </Wrapper>
    );
  },
);
