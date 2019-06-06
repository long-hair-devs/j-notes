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
        return $(".box-painel-eventos");
    }

    get botaoAvancaMes() {
        return $("#avanca-mes");
    }

    get botaoVoltaMes() {
        return $("#volta-mes");
    }

    get divCrud() {
        return $("#box-painel-crud");
    }

    /*--- Métodos ---*/
    encheListaAnos(calendario) {
        for (let i = calendario.anoAtual - 4; i < calendario.anoAtual + 4; i++) {
            this.listaAnos.children().append('<span>' + i + '</span>');
        }
    }

    abreOuFechaListaAnos() {
        this.listaAnos.addClass("wrapper-lista-anos--animacao");
        this.botaoLista.addClass("ano--animacao");

        if (!this.listaAnos.hasClass("wrapper-lista-anos--visivel")) {
            this.listaAnos.addClass("wrapper-lista-anos--visivel");
            this.botaoLista.addClass("ano--girado");
        } else {
            this.listaAnos.removeClass("wrapper-lista-anos--visivel");
            this.botaoLista.removeClass("ano--girado");
        }
        this.listaAnos.one("transitionend", (e) => {
            this.listaAnos.removeClass("wrapper-lista-anos--animacao");
            this.botaoLista.removeClass("ano--animacao");
        });
    }

    fechaListaAnos() {
        if (this.listaAnos.hasClass("wrapper-lista-anos--visivel")) {
            this.listaAnos.addClass("wrapper-lista-anos--animacao");
            this.botaoLista.addClass("ano--animacao");
            this.listaAnos.removeClass("wrapper-lista-anos--visivel");
            this.botaoLista.removeClass("ano--girado");
        }
        this.listaAnos.one("transitionend", (e) => {
            this.listaAnos.removeClass("wrapper-lista-anos--animacao");
            this.botaoLista.removeClass("ano--animacao");
        });
    }

    abreOuFechaTarefa(item) {
        this.todasTarefas.addClass("box-painel-eventos-item--animacao");
        if (Secundario.transformaPxEmRem(item.innerHeight()) == 5) {
            this.todasTarefas.css('height', '');
            item.css('height', Secundario.descobreTamanho(item) + "rem");
        } else {
            item.css('height', '');
        }
        this.todasTarefas.one("transitionend", (e) => {
            this.todasTarefas.removeClass("box-painel-eventos-item--animacao");
        });
    }

    atualizar() {
        this.todasTarefas.remove();
    }
}