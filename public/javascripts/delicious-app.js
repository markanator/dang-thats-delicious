import '../sass/style.scss';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/hearts';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autoComplete';

autoComplete($('#address'), $('#lat'), $('#lng'));
typeAhead($('.search'));

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);

makeMap($('#map'));
