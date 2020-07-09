
export default class AssetsHandler {

  constructor(app) {
    this.app = app
  }

  appendScriptUrl(url) {

    let scripts = document.createElement("script")
    scripts.setAttribute('class', 'state-script')
    scripts.setAttribute('src', url + '?v=' + (new Date().getTime()))
    document.body.appendChild(scripts)
    
  }

  appendStyleUrl(url) {

    let style = document.createElement("link")
    style.setAttribute('rel', 'stylesheet')
    style.setAttribute('class', 'state-class')
    style.setAttribute('href', url + '?v=' + (new Date().getTime()))
    document.head.appendChild(style)

  }

  replacePageScript(id, content) {

    let currentScript = document.getElementById(id)
    if (currentScript) {
      currentScript.parentElement.removeChild(currentScript)
    }

    let script = document.createElement("script")
    script.text = content
    script.setAttribute('id', id)
    document.body.appendChild(script)

    // persiste o controle de métodos no escopo da página
    window['scopeds'] = window['scopeds'] ?? [];

    // remove os métodos registrados no ultimo carregamento 
    window['scopeds'].forEach(function(item){
      window[item] = null
      delete window[item]
    })

    // registra os métodos da página
    if (pageScoped.methods !== undefined) { 
      
      Object.keys(pageScoped.methods).forEach(function (item) {
        window['scopeds'].push(item)
        window[item] = pageScoped.methods[item];
      });

    }

  }

  replacePageStyle(id, content) {

    let currentStyle = document.getElementById(id)
    if (currentStyle) {
      currentStyle.parentElement.removeChild(currentStyle)
    }

    let style = document.createElement("style")
    style.appendChild(document.createTextNode(content))
    style.setAttribute('id', id)
    style.setAttribute('type', 'text/css')
    document.body.appendChild(style)
  }

  /**
   * Remove os estilos aplicados pelo escopo da página anterior 
   * e aplica os estilos no escopo da nova página.
   * 
   * @param {array} styles 
   */
  applyAppStyles(styles) {

    if (styles === undefined) {
      return
    }

    // Cada vez que uma nova página é carregada, o backend envia metadados 
    // para alterar o comportamento do painel. 
    // Nesses dados se encontra o tema atualmente em uso!
    // É preciso identificar se o tema pedido é o mesmo já existente no DOM 
    // para evitar recarregamentos do mesmo tema e não piscar a tela

    // Mapeia os já existentes no DOM
    let oldStyles = []
    document.querySelectorAll('.state-class').forEach(item => { 
      oldStyles.push(item.getAttribute('href').replace(/\?.*/, ''))
    })

    // Remove os desnecessários e mantém os já existentes
    // Para a tela não piscar quando o tema for igual.
    document.querySelectorAll('.state-class').forEach(item => { 

      let href = item.getAttribute('href').replace(/\?.*/, '')
      if (styles.includes(href) === false) {
        item.remove()
      }
      
    })

    // Adiciona novos estilos no DOM
    styles.forEach(href => {

      if (oldStyles.includes(href) === false) {

        let style = document.createElement("link")
        style.setAttribute('rel', 'stylesheet')
        style.setAttribute('class', 'state-class')
        style.setAttribute('href', href + '?v=' + (new Date().getTime()))
        document.head.appendChild(style)
      }
    });

  }

  /**
   * Remove os scripts aplicados pelo escopo da página anterior 
   * e aplica os scripts no escopo da nova página.
   * 
   * @param {array} scripts 
   */
  applyAppScripts(scripts) {

    if (scripts === undefined) {
      return
    }

    var elements = document.querySelectorAll('.state-script')
    elements.forEach(item => { item.remove(); })

    scripts.forEach(src => {

      let scripts = document.createElement("script")
      scripts.setAttribute('class', 'state-script')
      scripts.setAttribute('src', src + '?v=' + (new Date().getTime()))
      document.body.appendChild(scripts)
    });
  }
}