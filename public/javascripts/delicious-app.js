import '../sass/style.scss';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autoComplete';

autoComplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));

makeMap($('#map'));
