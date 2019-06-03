class Main {
    constructor() {
        this._menu = new Menu();
        this._ajuda = new Ajuda();
        this._scrollSpy = new ScrollSpy();
        this._notificacoes = new Notificacoes();
        this._calendario = new Calendario();
        this._painel = new PainelCalendario();
        this._concluir = new Concluir();
    }
    /*--- Getters e Setters ---*/

    get menu() {
        return this._menu;
    }

    get ajuda() {
        return this._ajuda;
    }

    get scrollSpy() {
        return this._scrollSpy;
    }

    get notificacoes() {
        return this._notificacoes;
    }

    get calendario() {
        return this._calendario;
    }

    get painel() {
        return this._painel;
    }

    get concluir() {
        return this._concluir;
    }
    /*--- Métodos ---*/

    ativaScrollSpy(scrollSpy) {
        // Adiciona a classe active aos itens dos dois menus, quando clicar em algum deles, além de levar a página ao local desejado
        scrollSpy.menus.on('click', '.click-scrollspy', function (e) {
            scrollSpy.clickMenu($(this), e);
        });

        // Muda a classe active de acordo com o scroll da página
        Secundario.document.on('scroll', $.debounce(200, function () {
            scrollSpy.ativar();
        }));
    }

    ativaMenu(menu) {
        // Clicar no icone do menu abre ou fecha o menu
        menu.botao.click(function () {
            menu.abreOuFecha();
        });

        // Fecha o menu ou lista de anos, do painel do calendário, caso clique fora de um deles
        Secundario.main.click(function () {
            menu.fecha();
            painel.fechaListaAnos();
        });
    }

    ativaAjuda(ajuda) {
        // Mostra a ajuda ao clicar no botão de ajuda 
        ajuda.botaoAjuda.click(function () {
            ajuda.escolheTextoCerto($(this));
        });

        // Fecha a ajuda quando clica fora dela 
        ajuda.overlay.click(function () {
            ajuda.fechar();
        });

        // Previne a ajuda de ser fechada caso clique dentro da mesma 
        ajuda.div.click(function (e) {
            e.stopPropagation();
        });
    }

    ativaNotificacoes(notificacoes, calendario) {
        // Quando clicar na notificação levar para o local desejado 
        notificacoes.itemTarefa.click(function () {
            calendario.diaParaMarcar = calendario.hoje.getDate();
            calendario.mesAtual = calendario.hoje.getMonth();
            calendario.anoAtual = calendario.hoje.getFullYear();

            calendario.construirCalendario();
            Menu.botaoCalendario.click();
        });
        notificacoes.itemConcluir.click(function () {
            Menu.botaoConcluir.click();
        });
    }

    ativaCalendario(calendario, painel) {
        // Listeners para quando clicar nos botões de voltar e avançar mês 
        painel.botaoAvancaMes.click(function () {
            calendario.avancaMes();
        });
        painel.botaoVoltaMes.click(function () {
            calendario.voltaMes();
        });

        // Listener para mudar o ano, e voltar a lista de anos 
        painel.listaAnos.children().on("click", "span", function () {
            calendario.mudaAno($(this).text());
            painel.abreFechaListaAnos();
        });

        // Listener para mudar o dia selecionado 
        calendario.corpo.on("click", ".box-dia", function () {
            calendario.mudaDiaSelecionado($(this));
        });
    }

    ativaPainel(painel, calendario) {
        painel.encheListaAnos(calendario);

        // Listener para mostrar a lista de anos 
        painel.botaoLista.click(function () {
            painel.abreFechaListaAnos();
        });

        // Impede da lista ser fechada caso clique dentro da mesma
        painel.listaAnos.parent().click(function (e) {
            e.stopPropagation();
        });

    }
}