import * as React from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from '@biorate/i18n';
import { routes } from '../../../router';
import { Hello } from '../../components';
import { Store } from '../../../store';
import './index.less';

export const Bar: FC = observer(() => {
  const { hello, i18n } = Store.useStore();
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="center">
      <Hello
        onClick={() => void navigate(routes.foo)}
        title={`${t`Привет мир`} (${i18n.language} bar-${hello.counter}-${id})`}
        buttonTitle="foo"
        i18n={i18n}
      />
    </div>
  );
});
