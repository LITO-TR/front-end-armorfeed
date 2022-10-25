import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Dropdown from "primevue/dropdown";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import TabMenu from "primevue/tabmenu";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Toolbar from "primevue/toolbar";
import Avatar from "primevue/avatar";
import Steps from "primevue/steps";
import ToastService from "primevue/toastservice";
import InputNumber from "primevue/inputnumber";
import Rating from "primevue/rating";
import Toast from "primevue/toast";
import InputMask from "primevue/inputmask";
import VueGoogleMaps from '@fawmi/vue-google-maps'

//PrimeVue Styles
import "/node_modules/primeflex/primeflex.css";

import "primevue/resources/themes/mdc-dark-indigo/theme.css";
import "primevue/resources/themes/md-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import Password from "primevue/password";
import Divider from "primevue/divider";
import Checkbox from "primevue/checkbox";
import OverlayPanel from "primevue/overlaypanel";
import Timeline from "primevue/timeline";
import ScrollPanel from "primevue/scrollpanel";
import $dataTransfer from "./shared/services/data-transfer.service";

const app = createApp(App);

app.config.globalProperties.$dataTransfer = $dataTransfer;

app.use(router);

//PrimeVue Configuration
app.use(PrimeVue, { ripple: true });

app.use(ToastService);

app.use(VueGoogleMaps, {
  load: {
    key: '',
  },
})

//PrimeVue Components
app.component("pv-drop-down", Dropdown);
app.component("pv-tab-view", TabView);
app.component("pv-tab-panel", TabPanel);
app.component("pv-tab-menu", TabMenu);
app.component("pv-data-table", DataTable);
app.component("pv-column", Column);
app.component("pv-row", Row);
app.component("pv-button", Button);
app.component("pv-dialog", Dialog);
app.component("pv-calendar", Calendar);
app.component("pv-input-text", InputText);
app.component("pv-card", Card);
app.component("pv-tool-bar", Toolbar);
app.component("pv-toast", Toast);
app.component("pv-rating", Rating);
app.component("pv-step", Steps);
app.component("pv-input-number", InputNumber);
app.component("pv-input-mask", InputMask);
app.component("pv-dropdown", Dropdown);
app.component("pv-avatar", Avatar);
app.component("pv-password", Password);
app.component("pv-divider", Divider);
app.component("pv-checkbox", Checkbox);
app.component("pv-overlay-panel", OverlayPanel);
app.component("pv-timeline", Timeline);
app.component("pv-scroll-panel", ScrollPanel);
app.mount("#app");
