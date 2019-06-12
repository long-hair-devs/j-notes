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

    get md5Passado() {
        return this._md5Passado;
    }

    set md5Passado(valor) {
        return this._md5Passado = valor;
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
            <span class="id texto">${Tarefas.pegaId(1, i)}</span>
            <span class="nome texto">${Tarefas.pegaNome(1, i)}</span>
            <span class="tel1 texto">${Tarefas.pegaTel1(1, i)}</span>
            ${Tarefas.pegaTel2(1, i) != "" ? `<span class="tel2 texto">${Tarefas.pegaTel2(1, i)}</span>` : ``}
            <span class="endereco texto">${Tarefas.pegaEndereco(1, i)}</span>
            <span class="periodo texto">${Tarefas.pegaPeriodo(1, i)}</span>
            ${Tarefas.pegaProblema(1, i) != "" ? `<span class="problema texto">${Tarefas.pegaProblema(1, i)}</span>` : ``}
            ${Tarefas.pegaInfo(1, i) != "" ? `<span class="info texto">${Tarefas.pegaInfo(1, i)}</span>` : ``}
            <div class="box-painel-crud">
                <div class="wrapper-painel-crud editar-tarefa">
                    <img src="../img/svg/edit.svg" alt="botao-editar"><span>Editar</span></div>
                <div class="wrapper-painel-crud deletar-tarefa">
                    <img src="../img/svg/delete.svg" alt="botao-deletar"><span>Deletar</span>
            </div></div></div>`;
        } else if (tipo = 2) {
            comando = `<div class="box-painel-eventos-item concluida">
            <span></span>
            <span class="texto">${Tarefas.pegaNome(1, i)}</span>
            <span class="texto">${Tarefas.pegaTel1(1, i)}</span>
            ${Tarefas.pegaTel2(1, i) != "" ? `<span class="texto">${Tarefas.pegaTel2(1, i)}</span>` : ``}
            <span class="texto">${Tarefas.pegaEndereco(1, i)}</span>
            <span class="texto">${Tarefas.pegaPeriodo(1, i)}</span>
            ${Tarefas.pegaProblema(1, i) != "" ? `<span class="texto">${Tarefas.pegaProblema(1, i)}</span>` : ``}
            ${Tarefas.pegaInfo(1, i) != "" ? `<span class="texto">${Tarefas.pegaInfo(1, i)}</span>` : ``}
            <span class="texto">Total Recebido: R$ ${Tarefas.pegaTotal(i)}</span>
            ${Tarefas.pegaTotalGasto(i) != 0.00 ? `<span class="texto">${Tarefas.pegaTotalGasto(i)}</span>` : ``}
            ${Tarefas.pegaObsercacoes(i) != "" ? `<span class="texto">${Tarefas.pegaObsercacoes(i)}</span>` : ``}`;
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

        this.md5Passado = md5(item.find(".tel1").text() +
            item.find(".nome").text() +
            item.find(".tel2").text() +
            item.find(".endereco").text() +
            item.find(".periodo").text() +
            item.find(".problema").text() +
            item.find(".info").text());
    }

    deletarTarefa() {
        Tarefas.id = this.divDeletar.find(".id").text();

        this.divDeletar.append(this.d.ajuda.loading);

        Tarefas.deletar((saida) => {
            this.divDeletar.find(".loading").remove();
            if (saida == 1) {
                this.d.ajuda.mostrar("<span class='texto'>Não foi possível deletar a tarefa</span>");
                return;
            }
            this.divDeletar.addClass("box-painel-eventos-item--animacao-deletar");
            this.divDeletar.one("animationend", (e) => {
                this.divDeletar.remove();
            });

            Tarefas.atualizarMes(this.d.calendario.mesAtual, this.d.calendario.anoAtual, () => {
                Tarefas.id = undefined
                this.d.calendario.colocaIndicadorNosDias();

                Tarefas.atualizarNaoConcluidas(this.d.calendario.dataSelecionadaString("-"), () => {
                    this.d.concluir.atualizar();
                    this.d.notificacoes.atualizar();
                });
            });
        });
    }
}