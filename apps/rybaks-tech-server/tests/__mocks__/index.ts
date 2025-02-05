import { container, Types } from '@biorate/inversion';

import { Test } from './test';

container.unbind(Types.Test);
container.bind(Types.Test).to(Test).inSingletonScope();
