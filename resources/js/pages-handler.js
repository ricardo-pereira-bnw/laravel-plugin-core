
import axios from 'axios';
import Vue from 'vue';
const compiler = require('vue-template-compiler');

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default class PagesHandler {

  constructor(app) {
    this.app = app;
  }

  setPageTitle(title) {
    this.app.$refs.pheader.title = title;
  }

  setBreadcrumbItems(items) {
    this.app.$refs.pheader.items = items;
  }

  fetchHomePage() {

    let app = this.app;

    axios.get('/core/meta')
      .then(function (response) {
        let home = response.data.meta.home_url;
        let version = response.data.meta.version;

        app.pages().fetchPage(home);
        console.log("-------------------------------")
        console.log("Plugin Core " + version)
        console.log("-------------------------------")

      })
      .catch(function (error) {
        app.pages().showError(error);
      })
      .then(function () {

      });
  }

  /**
   * Faz a requisição de uma página .vue e efetua a compilação do componente da página.
   * 
   * @param {String} url 
   */
  fetchPage(url) {

    let pattern = new RegExp(
      '^(https?:\\/\\/)?'+ // protocolo
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domínio
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //porta
      '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'
    );

    if (pattern.test(url)) {
      location.href = url
      return
    }

    let self = this
    let app = this.app

    app.panel().loadingStart();

    // Normalmente o carregamento de módulos seria feito através do webpack.
    // Mas, para prover uma comunicação mais previsível com o Laravel,
    // faz-se chamadas ajax e posteriormente compila-se o componente
    axios.get(url)
      .then(function (response) {

        app.current_url = url

        app.panel().restartSidebarRight()

        // Usa o 'vue-template-compiler' para 
        // interpretar do arquivo .vue e compilar os componentes
        // Isso extrai os mesmos parâmetros presentes em componentes SingleFile
        // Mais info: https://br.vuejs.org/v2/guide/components.html
        let parsed = compiler.parseComponent(response.data.vuefile)

        // ----------------------------------
        // Metadados provenientes do Laravel
        // ----------------------------------
        self.applyMetaData(response.data.meta)

        // ----------------------------------
        // Executa o script para sobrescrever os metadados
        // O templeate tem precedência em relação aos metadados
        // ----------------------------------

        if (parsed.script !== null
          && undefined !== parsed.script.content
          && parsed.script.content
        ) {

          // Remove o 'export default', pois o 'import' não será usado aqui
          let scoped = parsed.script.content.replace(/.*export.*default/, '')

          // Adiciona o script ao DOM, para dar visibilidade ao pageScoped
          app.assets().replacePageScript('page-script', 'pageScoped = ' + scoped)

        } else {

          // se o arquivo .vue não contiver scripts
          pageScoped = {}
        }

        // Adiciona o template compilado no escopo do componente dinâmico
        pageScoped.template = parsed.template.content

        // Cria o novo componente e disponibiliza sua referência na tag 'page'
        // Sempre existirá apenas uma referência para page: a página atual!
        let component = Vue.component('dynamic-component', Object.assign(pageScoped))
        app.$refs.page = component

        // Substitui o componente dinâmico atual da página
        Vue.component('core-page', component)

        // Aplica os estilos do escopo da página
        if (undefined !== parsed.styles[0]) {
          app.assets().replacePageStyle('page-style', parsed.styles[0].content)
        }

        // Pede para o Vue atualizar a árvore de componentes
        app.$forceUpdate()

        // Dispara o evento de montagem
        if (typeof pageScoped.mount === "function") { 
          pageScoped.mount()
        }

      })
      .catch(function (error) {

        if (error.response === undefined) {
          app.pages().fail('unknown', 'Um erro inesperado aconteceu')
          return; 
        }

        let type = 'server_error';
        switch(error.response.status){
          case 401: type = 'unauthorized'; break;
          case 403: type = 'forbidden'; break;
        }

        app.pages().fail(
          type, 
          error.response.data.message, 
          error.response.data.data,
          error.response.headers
        )
        
      })
      .then(function () {
        app.panel().loadingEnd()
      });
  }

  urlPath() {
    return this.app.current_url
  }

  urlNodes() {
    return this.app.current_url.match(/[^/]+/g)
  }

  applyMetaData(meta){

    // Aplica os assets do tema no DOM
    app.assets().applyAppStyles(meta.styles)
    app.assets().applyAppScripts(meta.scripts)

    // Atualiza os componentes reativos do painel
    app.panel().changeSidebarLeftStatus(meta.sidebar_left_status)
    app.panel().changeSidebarRightStatus(meta.sidebar_right_status)
    app.panel().updateSidebarLeftAndMobile(meta.sidebar_left)
    app.panel().updateHeaderMenu(meta.header_menu)
    app.panel().updateUserData(meta.user_data)

    // Atualiza as informações da página atual
    app.pages().setPageTitle(meta.page_title)
    app.pages().setBreadcrumbItems(meta.breadcrumb)
}

  fail(type, message, data, headers) {

    data = data ?? []
    headers = headers ?? []

    if (type === 'unauthorized' ) {
      this.app.message('Autenticação', message)
      return;
    }
    
    if (type === 'forbidden' ) {
      this.app.message('Acesso proibido', message)
      return;
    }

  }
}