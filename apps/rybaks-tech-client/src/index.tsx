import { container } from '@biorate/inversion';
import { Root } from './config';

container.get(Root).$run();

import('./view');
