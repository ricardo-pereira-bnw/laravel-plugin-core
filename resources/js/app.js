
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import PanelHandler from './panel-handler.js'
import PagesHandler from './pages-handler.js'
import AssetsHandler from './assets-handler.js'
import axios from 'axios';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// Componentes padrões
Vue.component('core-admin-full', require('./components/layout/CoreAdminFull.vue').default)
Vue.component('core-admin-header', require('./components/layout/CoreAdminHeader.vue').default)
Vue.component('core-admin-footer', require('./components/layout/CoreAdminFooter.vue').default)
Vue.component('core-sidebar-left', require('./components/layout/CoreSidebarLeft.vue').default)
Vue.component('core-sidebar-mobile', require('./components/layout/CoreSidebarMobile.vue').default)
Vue.component('core-sidebar-right', require('./components/layout/CoreSidebarRight.vue').default)
Vue.component('core-page-header', require('./components/layout/CorePageHeader.vue').default)
Vue.component('core-page', require('./components/widgets/CorePageContent.vue').default)
Vue.component('sidebar-right-content', require('./components/widgets/CoreSidebarRightContent.vue').default)

Vue.component('core-modal-message', require('./components/widgets/CoreModalMessage.vue').default)
Vue.component('core-modal-confirm', require('./components/widgets/CoreModalConfirm.vue').default)

window.app = new Vue({
  el: '#vue-app',
  methods: {
    request() {
      return axios;
    },
    urlPath(){
      return this.current_url
    },
    urlNodes(){
      return this.current_url.match(/[^/]+/g)
    },
    panel() {
      return new PanelHandler(this);
    },
    pages() {
      return new PagesHandler(this);
    },
    assets() {
      return new AssetsHandler(this);
    },
    message(title, message){
      this.$refs['modal-message'].title = title
      this.$refs['modal-message'].message = message
      this.$refs['modal-message'].$refs['modal-message-widget'].show()
    },
    confirm(title, message, callback){
      this.$refs['modal-confirm'].title = title
      this.$refs['modal-confirm'].message = message
      this.$refs['modal-confirm'].callback = callback
      this.$refs['modal-confirm'].$refs['modal-confirm-widget'].show()
    },
    toast(message, params) {
      this.$bvToast.toast(message, params)
    }
  },
  data: {
    // componentes dinâmicos substituíveis
    aheader: 'core-admin-header',
    afooter: 'core-admin-footer',
    lsidebar: 'core-sidebar-left',
    msidebar: 'core-sidebar-mobile',
    rsidebar: 'core-sidebar-right',
    pheader: 'core-page-header',
    page: 'core-page',

    current_url: null
  }

});

app.pages().fetchHomePage()
