class PainelCalendario {
    constructor(dono) {
        this._d = dono;
    }
    /*--- Getters e Setters ---*/
    get d() {
        return this._d;
    }

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
            item.css('height', (Secundario.descobreTamanho(item) + 1) + "rem");
        } else {
            item.css('height', '');
        }
        this.todasTarefas.one("transitionend", (e) => {
            this.todasTarefas.removeClass("box-painel-eventos-item--animacao");
        });
    }

    atualizar(dia) {
        this.todasTarefas.remove();
        for (let i = 0; i < Tarefas.mes.length; i++) {
            if (dia == Tarefas.pegaDia(i)) {
                if (Tarefas.pegaTotal(i) != null) {
                    this.addTarefa(2, i);
                } else {
                    this.addTarefa(1, i);
                }
            }
        }
    }

    addTarefa(tipo, i) {
        let comando;
        if (tipo == 1) {
            comando = `<div class="box-painel-eventos-item">
            <span>${Tarefas.pegaId(i)}</span>
            <span>${Tarefas.pegaNome(i)}</span>
            <span>${Tarefas.pegaTel1(i)}</span>
            ${Tarefas.pegaTel2(i) != "" ? `<span>${Tarefas.pegaTel2(i)}</span>` : ``}
            <span>${Tarefas.pegaEndereco(i)}</span>
            <span>${Tarefas.pegaPeriodo(i)}</span>
            ${Tarefas.pegaProblema(i) != "" ? `<span>${Tarefas.pegaProblema(i)}</span>` : ``}
            ${Tarefas.pegaInfo(i) != "" ? `<span>${Tarefas.pegaInfo(i)}</span>` : ``}
            <div id="box-painel-crud">
            <div class="wrapper-painel-crud editar-tarefa">
            <img src="../img/svg/edit.svg" alt="botao-editar"><span>Editar</span></div>
            <div class="wrapper-painel-crud deletar-tarefa">
            <img src="../img/svg/delete.svg" alt="botao-deletar"><span>Deletar</span></div></div></div>`;
        } else if (tipo = 2) {
            comando = `<div class="box-painel-eventos-item concluida">
            <span></span>
            <span>${Tarefas.pegaNome(i)}</span>
            <span>${Tarefas.pegaTel1(i)}</span>
            ${Tarefas.pegaTel2(i) != "" ? `<span>${Tarefas.pegaTel2(i)}</span>` : ``}
            <span>${Tarefas.pegaEndereco(i)}</span>
            <span>${Tarefas.pegaPeriodo(i)}</span>
            ${Tarefas.pegaProblema(i) != "" ? `<span>${Tarefas.pegaProblema(i)}</span>` : ``}
            ${Tarefas.pegaInfo(i) != "" ? `<span>${Tarefas.pegaInfo(i)}</span>` : ``}
            <span>Total Recebido: R$ ${Tarefas.pegaTotal(i)}</span>
            ${Tarefas.pegaTotalGasto(i) != "" ? `<span>${Tarefas.pegaTotalGasto(i)}</span>` : ``}
            ${Tarefas.pegaObsercacoes(i) != "" ? `<span>${Tarefas.pegaObsercacoes(i)}</span>` : ``}`;
        }
        this.div.prepend(comando);
    }
}