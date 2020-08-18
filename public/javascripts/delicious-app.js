import '../sass/style.scss';
import typeAhead from './modules/typeAhead';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autoComplete';

autoComplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));
