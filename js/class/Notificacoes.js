class Notificacoes {
    constructor() {}
    /*--- Getters e Setters ---*/
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
    atualizaNotificacoes(concluir, calendario, painel) {
        if (concluir.todasTarefas.length > 0) {
            concluir.todasTarefas.length == 1 ?
                this.textoConcluir = "Há somente uma tarefa para concluir." :
                this.textoConcluir = "Há " + concluir.todasTarefas.length + " tarefas para concluir.";
        } else {
            this.textoConcluir = "Não há nada para concluir.";
        }
        if (calendario.dataSelecionada.getTime() == calendario.hoje.getTime()) {
            if (painel.todasTarefas.length > 0) {
                painel.todasTarefas.length == 1 ?
                    this.textoTarefa = "Você tem apenas uma tarefa para fazer hoje!" :
                    this.textoTarefa = "Você tem " + painel.todasTarefas.length + " tarefas para fazer hoje!";
            } else {
                this.textoTarefa = "Nenhuma tarefa para fazer hoje!";
            }
        }
    }
}