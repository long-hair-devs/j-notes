class Tarefas {
    constructor() {}
    /*--- Getters e Setters ---*/
    static get mes() {
        return this._mes;
    }

    static set mes(valor) {
        this._mes = valor;
    }

    get tarefaParaEditar() {
        return this._tarefaParaEditar;
    }

    set tarefaParaEditar(valor) {
        this._tarefaParaEditar = valor;
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
            'cadastra-nova-tarefa': 1,
            'id': this.tarefaParaEditar,
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

    static atualizarMes(mesAtual, anoAtual, callback) {
        Tarefas.mes = 0;
        $.post('j-notes.php', {
            'pega-eventos-mes': 1,
            'mes': mesAtual,
            'ano': anoAtual,
        }, (dados) => {
            Tarefas.mes = dados;
            callback();
        }, "json");
    }

    static pegaDia(i) {
        return this.mes[i][1].split("-")[2];
    }
}