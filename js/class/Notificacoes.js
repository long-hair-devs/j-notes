class Notificacoes {
    constructor(dono) {
        this._d = dono;
    }
    /*--- Getters e Setters ---*/
    get d() {
        return this._d;
    }

    get itemConcluir() {
        return $(".notificacao-item.concluir");
    }

    get itemTarefa() {
        return $(".notificacao-item.tarefa");
    }

    set textoConcluir(valor) {
        $(".notificacao-item.concluir").text(valor);
    }

    set textoTarefa(valor) {
        $(".notificacao-item.tarefa").text(valor);
    }
    /*--- Métodos ---*/
    atualizaNotificacoes() {
        if (this.d.concluir.todasTarefas.length > 0) {
            this.d.concluir.todasTarefas.length == 1 ?
                this.textoConcluir = "Há somente uma tarefa para concluir." :
                this.textoConcluir = "Há " + this.d.concluir.todasTarefas.length + " tarefas para concluir.";
        } else {
            this.textoConcluir = "Não há nada para concluir.";
        }
        if (this.d.calendario.dataSelecionada.getTime() == this.d.calendario.hoje.getTime()) {
            if (this.d.painel.todasTarefas.length > 0) {
                this.d.painel.todasTarefas.length == 1 ?
                    this.textoTarefa = "Você tem apenas uma tarefa para fazer hoje!" :
                    this.textoTarefa = "Você tem " + this.d.painel.todasTarefas.length + " tarefas para fazer hoje!";
            } else {
                this.textoTarefa = "Nenhuma tarefa para fazer hoje!";
            }
        }
    }
}