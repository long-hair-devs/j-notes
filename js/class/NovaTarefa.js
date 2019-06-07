const mascara = ['(00) 00000-0000', '(00) 0000-00009'];

class NovaTarefa {
    constructor(dono) {
        $(".data").mask("00/00/0000");

        // Retirado da internet
        $(".telefone").mask(mascara[1], {
            onKeyPress: (val, e, field, options) => {
                field.mask(val.length > 14 ? mascara[0] : mascara[1], options);
            }
        });
        this._d = dono;
    }
    /*--- Getters e Setters ---*/
    get d() {
        return this._d;
    }

    get tel1() {
        return $("#tel1");
    }

    set tel1(valor) {
        $("#tel1").val(valor);
    }

    get nome() {
        return $("#nome");
    }

    set nome(valor) {
        $("#nome").val(valor);
    }

    get tel2() {
        return $("#tel2");
    }

    set tel2(valor) {
        $("#tel2").val(valor);
    }

    get endereco() {
        return $("#endereco");
    }

    set endereco(valor) {
        $("#endereco").val(valor);
    }

    get data() {
        return $(".data");
    }

    get dataConvertida() {
        return new Date(this.data.val().split("/")[2], this.data.val().split("/")[1] - 1, this.data.val().split("/")[0]);
    }

    set data(valor) {
        $(".data").val(valor);
    }

    get periodo() {
        return $("input[name=periodo]:checked").siblings(".radio-texto");
    }

    set periodo(valor) {
        if (valor == "Manhã") {
            $("input[name=periodo][value='M']").prop("checked", true);
        } else if (valor == "Tarde") {
            $("input[name=periodo][value='T']").prop("checked", true);
        } else {
            $("input[name=periodo][value='N']").prop("checked", true);
        }
    }

    get problema() {
        return $("#problema");
    }

    set problema(valor) {
        $("#problema").val(valor);
    }

    get info() {
        return $("#info");
    }

    set info(valor) {
        $("#info").val(valor);
    }

    get botaoConcluir() {
        return $("#botao-concluir");
    }

    get botaoCancelar() {
        return $("#botao-cancelar");
    }

    get fezAutoComplete() {
        return this._fezAutoComplete;
    }

    set fezAutoComplete(valor) {
        this._fezAutoComplete = valor;
    }

    get form() {
        return $("#box-nova-tarefa");
    }

    set titulo(valor) {
        $("#nova-tarefa").find("h1").text(valor);
    }

    get section() {
        return $("#nova-tarefa");
    }
    /*--- Métodos ---*/
    autoCompleta() {
        if (this.tel1.val().length > 13 && this.tel1.val().length < 16) {
            Clientes.pegarDados(this.tel1.val(), (saida) => {
                this.nome = saida[0];
                this.endereco = saida[1];
                this.tel2 = saida[2];

                this.fezAutoComplete = true;
            });
        }
    }

    validaDados() {
        // Se não satisfazer a condição, mostra erro e cancela a execução do método
        if (!(this.tel1.val().length > 13 && this.tel1.val().length < 16)) {
            this.tel1.parent().addClass("label--erro");
            this.tel1.focus();
            return false;
        }
        // Se satisfez a condição, remove o erro caso esteja ativo e continua para o proximo item
        this.tel1.parent().removeClass();

        if (!(this.nome.val().length > 0 && this.nome.val().length < 50)) {
            this.nome.parent().addClass("label--erro");
            this.nome.focus();
            return false;
        }
        this.nome.parent().removeClass();

        if (this.tel2.val().length != 0) {
            if (!(this.tel2.val().length > 13 && this.tel2.val().length < 16)) {
                this.tel2.parent().addClass("label--erro");
                this.tel2.focus();
                return false;
            }
        }
        this.tel2.parent().removeClass();

        if (!(this.endereco.val().length > 0 && this.endereco.val().length < 245)) {
            this.endereco.parent().addClass("label--erro");
            this.endereco.focus();
            return false;
        }
        this.endereco.parent().removeClass();

        if (!(this.data.val().length == 10)) {
            this.data.parent().addClass("label--erro");
            this.data.focus();
            return false;
        }
        this.data.parent().removeClass();

        if (!(this.dataConvertida.getTime() >= this.d.calendario.hoje.getTime())) {
            this.data.parent().addClass("label--erro");
            this.data.focus();
            return false;
        }
        this.data.parent().removeClass();

        if (!(this.problema.val().length <= 245)) {
            this.problema.parent().addClass("label--erro");
            this.problema.focus();
            return false;
        }
        this.problema.parent().removeClass();

        if (!(this.info.val().length <= 245)) {
            this.info.parent().addClass("label--erro");
            this.info.focus();
            return false;
        }
        this.info.parent().removeClass();

        return true;
    }

    verificaSeTemDados() {
        return this.tel1.val() == "" &&
            this.nome.val() == "" &&
            this.tel2.val() == "" &&
            this.endereco.val() == "" &&
            this.problema.val() == "" &&
            this.info.val() == "";
    }

    abreModoEditar() {
        if (!this.section.hasClass("modo-editar")) {
            this.titulo = "Editar Tarefa";
            this.section.addClass("modo-editar");
            this.botaoCancelar.css('display', 'block');
            this.botaoConcluir.addClass("editar");
            this.tel1.prop("readonly", true);
            return true;
        } else {
            this.d.ajuda.mostrar("<span>Você já está editando uma tarefa, termine ou cancele antes de continuar</span>");
            return false;
        }
    }

    fechaModoEditar() {
        Tarefas.id = undefined;
        if (this.section.hasClass("modo-editar")) {
            this.titulo = "Nova Tarefa";
            this.section.removeClass("modo-editar");
            this.botaoCancelar.css('display', 'none');
            this.botaoConcluir.removeClass("editar");
            this.tel1.prop("readonly", false);
            this.form.trigger("reset");
        }
    }

    acaoConcluir(tipo) {
        if (this.validaDados()) {
            if (tipo == 1) { // Criar
                if (this.fezAutoComplete) {
                    Clientes.atualizar(this.tel1.val(), this.nome.val(), this.endereco.val(), this.tel2.val());
                    this.fezAutoComplete = false;
                } else {
                    Clientes.cadastrar(this.tel1.val(), this.nome.val(), this.endereco.val(), this.tel2.val());
                }
                Tarefas.cadastrar(this.tel1.val(),
                    this.nome.val(),
                    this.endereco.val(),
                    this.tel2.val(),
                    this.data.val(),
                    this.periodo.text(),
                    this.problema.val(),
                    this.info.val(),
                    () => {
                        this.d.calendario.dataAtual(this.dataConvertida.getDate(), this.dataConvertida.getMonth(), this.dataConvertida.getFullYear());
                        this.d.calendario.construir();

                        this.form.trigger("reset");
                        this.d.ajuda.mostrar("<span>Tarefa cadastrada com sucesso!</span>");
                    });
            } else if (tipo == 2) { // Editar
                Clientes.atualizar(this.tel1.val(), this.nome.val(), this.endereco.val(), this.tel2.val());

                Tarefas.atualizar(this.tel1.val(),
                    this.nome.val(),
                    this.endereco.val(),
                    this.tel2.val(),
                    this.data.val(),
                    this.periodo.text(),
                    this.problema.val(),
                    this.info.val(),
                    () => {
                        this.d.calendario.dataAtual(this.dataConvertida.getDate(), this.dataConvertida.getMonth(), this.dataConvertida.getFullYear());
                        this.d.calendario.construir();

                        this.fechaModoEditar();
                        this.d.ajuda.mostrar("<span>Tarefa editada com sucesso!</span>");
                    });
                Tarefas.atualizarNaoConcluidas(this.d.calendario.dataSelecionadaString("-"), () => {
                    // verifica concluir 
                });
            }
        }
    }
}