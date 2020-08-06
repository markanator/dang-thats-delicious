import "../sass/style.scss";

import { $, $$ } from "./modules/bling";
import autoComplete from "./modules/autoComplete";

autoComplete($("#address"), $("#lat"), $("#lng"));
