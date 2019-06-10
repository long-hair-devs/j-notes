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

    get divData() {
        return $(".box-nova-data");
    }

    get divDeletar() {
        return this._divDeletar;
    }

    set divDeletar(valor) {
        this._divDeletar = valor;
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
            if (dia == Tarefas.pegaDia(1, i)) {
                if (Tarefas.pegaTotal(i) != null) {
                    this.addTarefa(2, i);
                } else {
                    this.addTarefa(1, i);
                }
            }
        }
        this.addOuRemoveDivData();
    }

    addTarefa(tipo, i) {
        let comando;
        if (tipo == 1) {
            comando = `<div class="box-painel-eventos-item">
            <span class="id">${Tarefas.pegaId(1, i)}</span>
            <span class="nome">${Tarefas.pegaNome(1, i)}</span>
            <span class="tel1">${Tarefas.pegaTel1(1, i)}</span>
            ${Tarefas.pegaTel2(1, i) != "" ? `<span class="tel2">${Tarefas.pegaTel2(1, i)}</span>` : ``}
            <span class="endereco">${Tarefas.pegaEndereco(1, i)}</span>
            <span class="periodo">${Tarefas.pegaPeriodo(1, i)}</span>
            ${Tarefas.pegaProblema(1, i) != "" ? `<span class="problema">${Tarefas.pegaProblema(1, i)}</span>` : ``}
            ${Tarefas.pegaInfo(1, i) != "" ? `<span class="info">${Tarefas.pegaInfo(1, i)}</span>` : ``}
            <div class="box-painel-crud">
                <div class="wrapper-painel-crud editar-tarefa">
                    <img src="../img/svg/edit.svg" alt="botao-editar"><span>Editar</span></div>
                <div class="wrapper-painel-crud deletar-tarefa">
                    <img src="../img/svg/delete.svg" alt="botao-deletar"><span>Deletar</span>
            </div></div></div>`;
        } else if (tipo = 2) {
            comando = `<div class="box-painel-eventos-item concluida">
            <span></span>
            <span>${Tarefas.pegaNome(1, i)}</span>
            <span>${Tarefas.pegaTel1(1, i)}</span>
            ${Tarefas.pegaTel2(1, i) != "" ? `<span>${Tarefas.pegaTel2(1, i)}</span>` : ``}
            <span>${Tarefas.pegaEndereco(1, i)}</span>
            <span>${Tarefas.pegaPeriodo(1, i)}</span>
            ${Tarefas.pegaProblema(1, i) != "" ? `<span>${Tarefas.pegaProblema(1, i)}</span>` : ``}
            ${Tarefas.pegaInfo(1, i) != "" ? `<span>${Tarefas.pegaInfo(1, i)}</span>` : ``}
            <span>Total Recebido: R$ ${Tarefas.pegaTotal(i)}</span>
            ${Tarefas.pegaTotalGasto(i) != 0.00 ? `<span>${Tarefas.pegaTotalGasto(i)}</span>` : ``}
            ${Tarefas.pegaObsercacoes(i) != "" ? `<span>${Tarefas.pegaObsercacoes(i)}</span>` : ``}`;
        }
        this.div.prepend(comando);
    }

    addOuRemoveDivData() {
        if (this.d.calendario.dataSelecionada.getTime() < this.d.calendario.hoje.getTime()) {
            this.divData.addClass("box-nova-data--invisivel");
        } else {
            this.divData.removeClass("box-nova-data--invisivel");
        }
    }

    passaValores(item) {
        Tarefas.id = item.find(".id").text();
        this.d.novaTarefa.tel1 = item.find(".tel1").text();
        this.d.novaTarefa.nome = item.find(".nome").text();
        this.d.novaTarefa.tel2 = item.find(".tel2").text();
        this.d.novaTarefa.endereco = item.find(".endereco").text();
        this.d.novaTarefa.periodo = item.find(".periodo").text();
        this.d.novaTarefa.problema = item.find(".problema").text();
        this.d.novaTarefa.info = item.find(".info").text();
    }

    deletarTarefa() {
        Tarefas.id = this.divDeletar.find(".id").text();

        this.d.ajuda.mostrar(this.d.ajuda.loading);
        Tarefas.deletar((dados) => {
            if (dados == 1) {
                this.divDeletar.fadeOut(() => {
                    this.divDeletar.remove();
                });
                this.d.ajuda.mostrar("<span>Tarefa deletada com sucesso!</span>");

                Tarefas.atualizarMes(this.d.calendario.mesAtual, this.d.calendario.anoAtual, () => {
                    Tarefas.id = undefined
                    this.d.calendario.colocaIndicadorNosDias();
                    this.d.notificacoes.atualizar();
                });
                Tarefas.atualizarNaoConcluidas(this.d.calendario.dataSelecionadaString("-"), () => {
                    this.d.notificacoes.atualizar();
                    this.d.concluir.atualizar();
                });
            }
        });
    }
}