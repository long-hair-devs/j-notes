class PainelCalendario {
    constructor() {}
    /*--- Getters e Setters ---*/
    get listaAnos() {
        return $(".wrapper-lista-anos");
    }

    get botaoLista() {
        return $("#mostra-lista-ano");
    }

    get todasTarefas() {
        return $(".box-painel-eventos-item");
    }

    get div() {
        return $(".box-concluir-tarefa>div");
    }

    get botaoAvancaMes() {
        return $("#avanca-mes");
    }

    get botaoVoltaMes() {
        return $("#volta-mes");
    }

    /*--- Métodos ---*/
    encheListaAnos(calendario) {
        for (let i = calendario.anoAtual - 4; i < calendario.anoAtual + 4; i++) {
            this.listaAnos.children().append('<span>' + i + '</span>');
        }
    }

    abreFechaListaAnos() {
        let listaAnos = this.listaAnos;
        let botaoLista = this.botaoLista;
        listaAnos.addClass("wrapper-lista-anos--animacao");
        botaoLista.addClass("ano--animacao");

        if (!listaAnos.hasClass("wrapper-lista-anos--visivel")) {
            listaAnos.addClass("wrapper-lista-anos--visivel");
            botaoLista.addClass("ano--girado");
        } else {
            listaAnos.removeClass("wrapper-lista-anos--visivel");
            botaoLista.removeClass("ano--girado");
        }
        listaAnos.one("transitionend", function (e) {
            listaAnos.removeClass("wrapper-lista-anos--animacao");
            botaoLista.removeClass("ano--animacao");
        });
    }

    fechaListaAnos() {
        if (this.listaAnos.hasClass("wrapper-lista-anos--visivel")) {
            this.listaAnos.addClass("wrapper-lista-anos--animacao");
            this.botaoLista.addClass("ano--animacao");
            this.listaAnos.removeClass("wrapper-lista-anos--visivel");
            this.botaoLista.removeClass("ano--girado");
        }
        this.listaAnos.one("transitionend", function (e) {
            this.listaAnos.removeClass("wrapper-lista-anos--animacao");
            this.iconeAno.removeClass("ano--animacao");
        });
    }

    abreFechaTarefa(item) {
        this.todasTarefas.addClass("box-painel-eventos-item--animacao");
        if (Secundario.transformaPxEmRem(item.innerHeight()) == 5) {
            this.todasTarefas.css('height', '');
            item.css('height', Secundario.transformaPxEmRem(Secundario.descobreTamanho(item)) + "rem");
        } else {
            item.css('height', '');
        }
        this.todasTarefas.one("transitionend", function (e) {
            this.todasTarefas.removeClass("box-painel-eventos-item--animacao");
        });
    }
}