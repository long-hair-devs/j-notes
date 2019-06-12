class Concluir {
    constructor(dono) {
        this._d = dono;
    }
    /*--- Getters e Setters ---*/
    get d() {
        return this._d;
    }

    get div() {
        return $(".box-concluir-tarefa");
    }

    get todasTarefas() {
        return $(".box-concluir-tarefa-item");
    }

    get todosForm() {
        return $(".box-concluir-tarefa-item form");
    }

    get todasLabel() {
        return $(".box-concluir-tarefa-item label");
    }

    get camposDinheiro() {
        return $(".dinheiro");
    }
    /*--- Métodos ---*/
    abreOuFechaTarefa(item) {
        this.todasTarefas.addClass("box-concluir-tarefa-item--animacao");
        if (Secundario.transformaPxEmRem(item.innerHeight()) == 9) {
            this.todasTarefas.css('height', '');
            item.css('height', (Secundario.descobreTamanho(item) - 3) + "rem");
        } else {
            item.css('height', '');
        }
        this.todasTarefas.one("transitionend", (e) => {
            this.todasTarefas.removeClass("box-concluir-tarefa-item--animacao");
            this.todasLabel.removeClass('tem-valor');
            this.todosForm.trigger('reset');
        });
    }

    atualizar() {
        this.todasTarefas.remove();
        for (let i = 0; i < Tarefas.naoConcluidas.length; i++) {
            this.addTarefa(i);
        }
        this.camposDinheiro.mask('00.000.000,00', {
            reverse: true
        });
    }

    addTarefa(i) {
        let comando = `<div class="box-concluir-tarefa-item"><div class="info">
        <span class="id texto">${Tarefas.pegaId(2, i)}</span>
        <span class="texto">${Tarefas.pegaNome(2, i)}</span>
        <span class="texto">${Tarefas.pegaData(2, i)}</span>
        <span class="texto">${Tarefas.pegaPeriodo(2, i)}</span>
        <span class="texto">${Tarefas.pegaTel1(2, i)}</span>
        ${Tarefas.pegaTel2(2, i) != "" ? `<span class="tel2 texto">${Tarefas.pegaTel2(2, i)}</span>` : ``}
        <span class="texto">${Tarefas.pegaEndereco(2, i)}</span>
        ${Tarefas.pegaProblema(2, i) != "" ? `<span class="problema texto">${Tarefas.pegaProblema(2, i)}</span>` : ``}
        ${Tarefas.pegaInfo(2, i) != "" ? `<span class="info texto">${Tarefas.pegaInfo(2, i)}</span>` : ``}
        </div><form><label class="l-total-recebido"><span class="required">Total Recebido:</span>
        <input class="dinheiro" name="total-recebido" type="text" placeholder="Ex: R$ 000,00" autocomplete="off">
        </label><label class="l-total-gasto"><span>Total Gasto:</span>
        <input class="dinheiro" name="total-gasto" type="text" placeholder="Ex: R$ 000,00" autocomplete="off">
        </label><label class="l-observacoes"><span>Observações :</span>
        <textarea name="observacoes" placeholder="Ex: Componente x trocado" autocomplete="off"></textarea>
        </label></form><img class="botao-concluir-tarefa" src="../img/svg/check-white.svg" alt="botao concluir tarefa">`;

        this.div.children().append(comando);
    }

    validaDados(form) {
        if (!(form.find("input").eq(0).val().length > 3)) {
            form.find("input").eq(0).parent().addClass("label--erro");
            form.find("input").eq(0).focus();
            return false;
        }
        form.find("input").eq(0).parent().removeClass("label--erro");

        if (form.find("input").eq(1).val().length != 0) {
            if (!(form.find("input").eq(1).val().length > 3)) {
                form.find("input").eq(1).parent().addClass("label--erro");
                form.find("input").eq(1).focus();
                return false;
            }
        }
        form.find("input").eq(1).parent().removeClass("label--erro");

        if (!(form.find("textarea").val().length < 255)) {
            form.find("textarea").parent().addClass("label--erro");
            form.find("textarea").focus();
            return false;
        }
        form.find("textarea").parent().removeClass("label--erro");

        return true;
    }

    pegaDinheiro(form, i) {
        return form.find("input").eq(i).val() != 0 ? form.find("input").eq(i).val().split(".").join("").split(",").join(".") : "0.00";
    }

    acaoConcluir(form) {
        if (this.validaDados(form)) {
            form.siblings("img").prop("disabled", true);
            Tarefas.id = form.siblings(".info").find(".id").text();

            form.parent().append(this.d.ajuda.loading);

            Tarefas.concluir(this.pegaDinheiro(form, 0), this.pegaDinheiro(form, 1), form.find("textarea").val(), (dados) => {
                if (dados == 1) {
                    form.parent().find(".loading").remove();

                    form.parent().addClass("box-concluir-tarefa-item--animacao-deletar");
                    form.parent().one("animationend", (e) => {
                        form.parent().remove();
                    });

                    Tarefas.atualizarNaoConcluidas(this.d.calendario.dataSelecionadaString("-"), () => {
                        this.d.notificacoes.atualizar();
                        this.d.calendario.construir();
                    });
                }
            });
        }
    }
}