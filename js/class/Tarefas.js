const IDTAREFA = 0,
    DIA = 1,
    PERIODO = 2,
    PROBLEMA = 3,
    INFORMACOES = 4,
    NOME = 5,
    TELEFONE1 = 6,
    TELEFONE2 = 7,
    ENDERECO = 8,
    TOTAL = 9,
    TOTALGASTO = 10,
    OBSERVACOES = 11;

class Tarefas {
    /*--- Getters e Setters ---*/
    static get mes() {
        return this._mes;
    }

    static set mes(valor) {
        this._mes = valor;
    }

    static get naoConcluidas() {
        return this._naoConcluidas;
    }

    static set naoConcluidas(valor) {
        this._naoConcluidas = valor;
    }

    static get id() {
        return this._id;
    }

    static set id(valor) {
        this._id = parseInt(valor);
    }

    /*--- Métodos ---*/
    static cadastrar(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional, callback) {
        $.post('j-notes.php', {
            'cadastra-nova-tarefa': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
            'data': data,
            'periodo': periodo,
            'problema': problema,
            'infoAdicional': infoAdicional,
        }, () => {
            callback();
        });
    }

    static atualizar(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional, callback) {
        $.post('j-notes.php', {
            'atualiza-tarefa': 1,
            'id': this.id,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
            'data': data,
            'periodo': periodo,
            'problema': problema,
            'infoAdicional': infoAdicional,
        }, () => {
            callback();
        });
    }

    static deletar(callback) {
        $.post('j-notes.php', {
            'deleta-tarefa': 1,
            'id': this.id,
        }, (dados) => {
            callback(dados);
        });
    }

    static concluir(total, totalGasto, obs, callback) {
        $.post('j-notes.php', {
            'concluir-tarefa': 1,
            'id': this.id,
            'tRecebido': total,
            'tGasto': totalGasto,
            'obs': obs,
        }, (dados) => {
            callback(dados);
        });
    }

    static atualizarMes(mesAtual, anoAtual, callback) {
        $.post('j-notes.php', {
            'pega-eventos-mes': 1,
            'mes': mesAtual,
            'ano': anoAtual,
        }, (dados) => {
            this.mes = dados;
            callback();
        }, "json");
    }

    static atualizarNaoConcluidas(hoje, callback) {
        $.post('j-notes.php', {
            'pega-nao-concluidas': 1,
            'hoje': hoje.split("-").reverse().join("-"),
        }, (dados) => {
            this.naoConcluidas = dados;
            callback();
        }, "json");
    }

    static pegaId(tipo, i) {
        return tipo == 1 ? this.mes[i][IDTAREFA] : this.naoConcluidas[i][IDTAREFA];
    }

    static pegaDia(tipo, i) {
        return tipo == 1 ? this.mes[i][DIA].split("-")[2] : this.naoConcluidas[i][DIA].split("-")[2];
    }

    static pegaData(tipo, i) {
        return tipo == 1 ? this.mes[i][DIA].split("-").reverse().join("/") : this.naoConcluidas[i][DIA].split("-").reverse().join("/");
    }

    static pegaNome(tipo, i) {
        return tipo == 1 ? this.mes[i][NOME] : this.naoConcluidas[i][NOME];
    }

    static pegaTel1(tipo, i) {
        return tipo == 1 ? this.mes[i][TELEFONE1] : this.naoConcluidas[i][TELEFONE1];
    }

    static pegaTel2(tipo, i) {
        return tipo == 1 ? this.mes[i][TELEFONE2] : this.naoConcluidas[i][TELEFONE2];
    }

    static pegaEndereco(tipo, i) {
        return tipo == 1 ? this.mes[i][ENDERECO] : this.naoConcluidas[i][ENDERECO];
    }

    static pegaPeriodo(tipo, i) {
        return tipo == 1 ? this.mes[i][PERIODO] : this.naoConcluidas[i][PERIODO];
    }

    static pegaProblema(tipo, i) {
        return tipo == 1 ? this.mes[i][PROBLEMA] : this.naoConcluidas[i][PROBLEMA];
    }

    static pegaInfo(tipo, i) {
        return tipo == 1 ? this.mes[i][INFORMACOES] : this.naoConcluidas[i][INFORMACOES];
    }

    static pegaTotal(i) {
        return this.mes[i][TOTAL];
    }

    static pegaObsercacoes(i) {
        return this.mes[i][OBSERVACOES];
    }

    static pegaTotalGasto(i) {
        return this.mes[i][TOTALGASTO];
    }
}