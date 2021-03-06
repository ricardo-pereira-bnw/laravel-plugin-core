# Api Javascript

A API Javascript pode ser acessada dentro das páginas .vue dinâmicas:

```javascript
<script>
    export default {

        data() {

            app.request().get(...)

            return {
            }
        },

        mount() {

            app.panel().loadingStart()
            app.request().get(...)
            app.panel().loadingEnd()

        },

        methods: {
            sidebarOff: function (message) {

                app.panel().disableSidebarLeft()
            }
        }
    }
</script>
```

## # app.assets() 

Este método devolve o gerenciador de scripts e styles. As funcionalidades disponíveis são:

### - app.assets().appendScriptUrl(url)

Adiciona no DOM uma tag script apontando para um arquivo javascript externo. Esse script estará em execução apenas no contexto da página atual. Ao carregar uma nova página, um novo escopo será executado.

### - app.assets().appendStyleUrl(url)

Adiciona no DOM uma tag link apontando para um arquivo de estilos css externo. Esse link estará em vigor apenas no contexto da página atual. Ao carregar uma nova página, um novo escopo será executado.

## # app.pages() 

Este método devolve o gerenciador do páginas .vue. As funcionalidades disponíveis são:

### - app.pages().fetchHomePage() 

Carrega a página inicial definida para o sistema. Para mias informações sobre como definir a página inicial, acesse a [API PHP](api-php.md).

### - app.pages().fetchPage(route)

Carrega uma página .vue existente na rota especificada. 

Ex: '/example/pagina'

### - app.pages().setPageTitle(title)

Muda o nome da página que paarece no topo da área de páginas do painel.

### - app.pages().setBreadcrumbItems(items)

Define a lista de links de navegação para a página atual.

```javascript 

app.pages().setBreadcrumbItems({
    "home": {
        "label":"Home",
        "slug":"home",
        "icon":"",
        "url":"\/example\/home",
        "status":"common",
        "type":"item"
    },
    "boas-vindas": {
        "label":"Boas Vindas",
        "slug":"boas-vindas",
        "icon":"",
        "url":"\/core\/welcome",
        "status":"common",
        "type":"item"
    }
})

```

### - app.pages().urlNodes() 

Devolve um array contendo os nós do caminho atual da url

Ex: ['example', 'pagina', '3']

### - app.pages().urlPath() 

Devolve uma string contendo o caminho atual da url

Ex: '/example/pagina/3'


## # app.panel() 

Este método devolve o gerenciador do painel administrativo. As funcionalidades disponíveis são:

### - app.panel().changeComponent(changeable, componentName)

Permite trocar dinamicamente os componentes no layout do painel. Os parâmetros aceitos são:  

- *changeable*: é a referência de um componente dinâmico do painel; 
- *componentName*: deve ser o nome do componente que será aplicado como substituto.  
 
As referências de componentes dinâmicos disponiveis para substituição são:

- **aheader**: o cabeçalho do painel
- **afooter**: o rodapé do painel
- **lsidebar**: a barra lateral esquerda
- **msidebar**: a barra lateral para dispositivos móveis
- **rsidebar**: a barra lateral direita
- **pheader**: o cabeçalho da página
- **page**: a área onde a página será aplicada

### - app.panel().confirm(title, message, callback)

Exibe uma janela de confirmação, executado uma função de callback quando o usuário selecionar uma opção.

```javascript
app.confirm('Confirmação', 'Você confirma que está confirmando isso?', function(response){

    if(response === 'yes') {
        app.message('Ok', 'Confirmado')
    } else if(response === 'no') {
        app.message('Que pena!', 'Quem sabe na próxima')
    }
        
})
```

### - app.panel().enableSidebarLeft() e app.panel().disableSidebarLeft()

Permite controlar a exibição da barra lateral esquerda do painel.

### - app.panel().enableSidebarRight() e app.panel().disableSidebarRight()

Permite controlar a exibição da barra lateral direita do painel.


### - app.panel().loadingStart() e app.panel().loadingEnd()

Exibe e oculta o carregador na página

```javascript
app.panel().loadingStart()
app.request().get(...)
app.panel().loadingEnd()
```

### - app.panel().message(title, message)

Exibe uma janela modal com uma mensagem de notificação simples.

### - app.panel().toast(message, params)

Dispara uma caixa de mensagem em forma de pilha no topo direito do painel.
Os mesmos parâmetros de configuração podem ser conferidos em [BootstrapVue Components Toast](https://bootstrap-vue.org/docs/components/toast).

## # app.request() 

Este método devolve a instancia da biblioteca [Axios](https://github.com/axios/axios), utilizada para chamadas AJAX dentro do sistema.

Permite efetuar chamadas personalizadas (POST, PUT, DELETE etc).


## Mais informações

### Usando em um projeto Laravel
- [Instalando em um projeto Laravel](instalacao-laravel.md)
- [Criando páginas no painel](paginas.md)
- [Manipulando o painel](painel.md)
- [API Javascript](api-js.md)
- [API PHP](api-php.md)

### Usando em um plugin isolado
- [Instalando em um plugin isolado](instalacao-plugin.md)
- [Implementando um plugin](plugin.md)

[Voltar para o início](../readme.md)