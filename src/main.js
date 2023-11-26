import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PortalVue from "portal-vue";

import "./fonts/B612-Regular.woff";
import "./fonts/B612-Bold.woff";
import "./fonts/B612-BoldItalic.woff";
import "./fonts/B612-Italic.woff";

const app = createApp(App);

app.use(router);
app.use(PortalVue);

app.mount("#app");
