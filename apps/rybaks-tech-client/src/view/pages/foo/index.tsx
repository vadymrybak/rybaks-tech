import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react';
import { t } from '@biorate/i18n';
import { Hello } from '../../components';
import { Store } from '../../../store';
import './index.less';

export const Foo: FC = observer(() => {
  const { hello, i18n } = Store.useStore();
  return (
    <div className="center">
      <Hello
        onClick={() => hello.toBar()}
        title={`${t`Привет мир`} (${i18n.language} foo-${hello.counter}-${hello.id})`}
        buttonTitle="bar"
        i18n={i18n}
      />
    </div>
  );
});