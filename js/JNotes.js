class JNotes {
    constructor() {
        this._menu = new Menu();
        this._ajuda = new Ajuda();
        this._scrollSpy = new ScrollSpy();
        this._notificacoes = new Notificacoes(this);
        this._novaTarefa = new NovaTarefa(this);
        this._calendario = new Calendario(this);
        this._painel = new PainelCalendario(this);
        this._concluir = new Concluir(this);
    }
    /*--- Getters e Setters ---*/
    get tarefas() {
        return this._tarefas;
    }

    get clientes() {
        return this._clientes;
    }

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

    get novaTarefa() {
        return this._novaTarefa;
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
        Secundario.document.on('scroll', $.debounce(200, () => {
            scrollSpy.ativar();
        }));
    }

    ativaMenu(menu, painel) {
        // Clicar no icone do menu abre ou fecha o menu
        menu.botao.click(() => {
            menu.abreOuFecha();
        });

        // Fecha o menu ou lista de anos, do painel do calendário, caso clique fora de um deles
        Secundario.main.click(() => {
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
        ajuda.overlay.click(() => {
            ajuda.fechar();
        });

        // Previne a ajuda de ser fechada caso clique dentro da mesma 
        ajuda.div.click((e) => {
            e.stopPropagation();
        });
    }

    ativaNotificacoes(notificacoes) {
        // Quando clicar na notificação levar para o local desejado 
        notificacoes.itemTarefa.click(() => {
            calendario.dataAtual(calendario.hoje.getDate(), calendario.hoje.getMonth(), calendario.hoje.getFullYear());

            calendario.construir();
            Menu.botaoCalendario.click();
        });
        notificacoes.itemConcluir.click(() => {
            Menu.botaoConcluir.click();
        });
    }

    ativaNovaTarefa(novaTarefa) {
        novaTarefa.fezAutoComplete = false;
        // Quando está digitando o telefone, verifica se o telefone já foi cadastrado no banco
        novaTarefa.tel1.keyup($.debounce(250, () => {
            novaTarefa.autoCompleta();
        }));

        // Listener para o botão concluir do formuláiro 
        novaTarefa.botaoConcluir.click(() => {
            novaTarefa.acaoConcluir(novaTarefa.botaoConcluir.hasClass("editar") ? 2 : 1);
        });

        // Listener para o botão cancelar do formuláiro 
        novaTarefa.botaoCancelar.click(() => {
            novaTarefa.fechaModoEditar();
        });

        // Listener para levar ao calendário quando clicar na seta do campo da data 
        novaTarefa.data.siblings("img").click(() => {
            Menu.botaoCalendario.click();
        });
    }

    ativaCalendario(calendario) {
        // Listener para mudar o dia selecionado 
        calendario.corpo.on("click", ".box-dia", function () {
            calendario.mudaDiaSelecionado($(this));
        });
    }

    ativaPainel(painel, calendario, novaTarefa, ajuda) {
        painel.encheListaAnos(calendario);

        // Listeners para quando clicar nos botões de voltar e avançar mês 
        painel.botaoAvancaMes.click(() => {
            calendario.avancaMes();
        });
        painel.botaoVoltaMes.click(() => {
            calendario.voltaMes();
        });

        // Listener para mostrar a lista de anos 
        painel.botaoLista.click(() => {
            painel.abreOuFechaListaAnos();
        });

        // Impede da lista ser fechada caso clique dentro da mesma
        painel.listaAnos.parent().click((e) => {
            e.stopPropagation();
        });

        // Listener para mudar o ano, e voltar a lista de anos 
        painel.listaAnos.children().on("click", "span", function () {
            calendario.mudaAno($(this).text());
            painel.abreFechaListaAnos();
        });

        // Listener para expandir a tarefa que for clicada
        painel.div.on("click", ".box-painel-eventos-item", function () {
            painel.abreOuFechaTarefa($(this));
        });

        // Listener para evitar que o evento seja fechado ao clicar na barra de opções
        painel.divCrud.click((e) => {
            e.stopPropagation();
        });

        // Listener para colocar data selecionada no formulário 
        painel.div.on("click", ".box-nova-data", () => {
            novaTarefa.data = calendario.dataSelecionadaString;
            Menu.botaoNova.click();
        });

        /* Listeners para o editar tarefa e deletar tarefa da barra de opções */
        painel.div.on("click", ".editar-tarefa", function () {
            novaTarefa.abreModoEditar();
            painel.passaValores($($(this).parent().parent()));
        });


        painel.div.on("click", ".deletar-tarefa", function () {
            ajuda.mostar(ajuda.textoConfirmar);
            divTarefaDeletar = $(this).parent().parent();
        });

        /* Listener que confirma se vai ou não deletar a tarefa */
        ajuda.div.on('click', '.confirmacao', function () {
            if ($(this).text() == "Sim") {
                deletarTarefa(divTarefaDeletar);
            }
            ajuda.fechar();
        });
    }
}

$(function () {
    jnotes = new JNotes();

    // Variável vh para mobile, problema do autohide da barra de pesquisa solucionado 
    let vh = Secundario.tela.innerHeight() * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches
    Secundario.calcTamanhoFonte();
    Secundario.tela.resize(function () {
        Secundario.calcTamanhoFonte();
    });

    jnotes.ativaScrollSpy(jnotes.scrollSpy);

    jnotes.ativaMenu(jnotes.menu, jnotes.painel);

    jnotes.ativaAjuda(jnotes.ajuda);

    jnotes.ativaNotificacoes(jnotes.notificacoes);

    jnotes.ativaNovaTarefa(jnotes.novaTarefa);

    jnotes.ativaCalendario(jnotes.calendario);

    jnotes.ativaPainel(jnotes.painel, jnotes.calendario, jnotes.novaTarefa, jnotes.ajuda);
});