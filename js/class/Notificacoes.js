class Notificacoes {
    constructor() {}
    /*--- Getters e Setters ---*/
    get main() {
        return this._main;
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
        if (main.concluir.todasTarefas.length > 0) {
            main.concluir.todasTarefas.length == 1 ?
                this.textoConcluir = "Há somente uma tarefa para concluir." :
                this.textoConcluir = "Há " + main.concluir.todasTarefas.length + " tarefas para concluir.";
        } else {
            this.textoConcluir = "Não há nada para concluir.";
        }
        if (main.calendario.dataSelecionada.getTime() == main.calendario.hoje.getTime()) {
            if (main.painel.todasTarefas > 0) {
                main.painel.todasTarefas == 1 ?
                    this.textoTarefa = "Você tem apenas uma tarefa para fazer hoje!" :
                    this.textoTarefa = "Você tem " + main.painel.todasTarefas + " tarefas para fazer hoje!";
            } else {
                this.textoTarefa = "Nenhuma tarefa para fazer hoje!";
            }
        }
    }
}