import React from 'react';
import { observer } from 'mobx-react';
import { inject, Types } from '@biorate/inversion';
import { RouterProvider } from 'react-router-dom';
import { Hello as HelloStore, Preloader } from '../../../store';
import { Layout } from '../';
import { Spinner, Slot } from '../../components';
import { router } from '../../../router';
import { SLOTS } from '../../consts';
import './index.less';

@observer
export class App extends React.Component<unknown, unknown> {
  @inject(Types.Hello) protected hello: HelloStore;

  @inject(Types.Preloader) protected preloader: Preloader;

  public render() {
    return this.preloader.loaded ? (
        <React.Suspense fallback={<Spinner visible={true} />}>
          <Layout>
            <Slot name={SLOTS.HEADER}></Slot>
            <Slot name={SLOTS.CONTENT}>
              <RouterProvider router={router} />
            </Slot>
            <Slot name={SLOTS.FOOTER}></Slot>
          </Layout>
        </React.Suspense>
    ) : (
      <Spinner visible={!this.preloader.loaded} />
    );
  }
}
