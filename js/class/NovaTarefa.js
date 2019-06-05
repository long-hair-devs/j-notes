const mascara = ['(00) 00000-0000', '(00) 0000-00009'];

class NovaTarefa {
    constructor() {
        $(".data").mask("00/00/0000");

        // Retirado da internet
        $(".telefone").mask(mascara[1], {
            onKeyPress: function (val, e, field, options) {
                field.mask(val.length > 14 ? mascara[0] : mascara[1], options);
            }
        });
    }
    /*--- Getters e Setters ---*/
    get tel1() {
        return $("#tel1");
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

    get problema() {
        return $("#problema");
    }

    get info() {
        return $("#info");
    }

    get botaoConcluir() {
        return $("#botao-concluir");
    }

    autoCompleta(tel1, clientes) {
        if (tel1.val().length > 13 && tel1.val().length < 16) {
            clientes.pegarDados(tel1.val(), (saida) => {
                this.nome = saida[0];
                this.endereco = saida[1];
                this.tel2 = saida[2];
            });
        }
    }

    validaDados(hoje) {
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

        if (!(this.dataConvertida.getTime() >= hoje.getTime())) {
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

    acaoConcluir(tipo) {
        if (this.validaDados()) {
            if (tipo == 1) { // Criar
                // if (fezAutoComplete) {
                //     aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                //     fezAutoComplete = false;
                // } else {
                //     cadastraNovoCliente(tel1, nome, endereco, tel2);
                // }
                // $.when(cadastraNovaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                //     diaParaMarcar = parseInt(data.split("/")[0]);
                //     mesAtual = (parseInt(data.split("/")[1]) - 1);
                //     anoAtual = parseInt(data.split("/")[2]);
                //     mostrarCalendario(mesAtual, anoAtual);
                // });
            } else if (tipo == 2) { // Editar
                // aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                // $.when(atualizaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                //     fechaEditarTarefa();
                //     mostrarCalendario(mesAtual, anoAtual);
                //     $.when(pegaTarefasQueFaltaConcluir()).done(function () {
                //         verificaTarefasConcluir();
                //         atualizaNotificacoes();
                //     });
                // });
            }
        }
    }
}