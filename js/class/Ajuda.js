class Ajuda {
    constructor() {}
    /*--- Getters e Setters ---*/
    get textoInicio() {
        return `<span class="texto">Nesta seção é possível ter uma noção prévia das atividades do dia atual, e também de todas atividades que não foram concluídas nos dias anteriores.</span>
        <span class="texto">Ao clicar em alguma notificação, a página será redirecionada ao local indicado pela notificação.</span>`;
    }

    get textoNovaTarefa() {
        return `<span class="texto">Nesta seção pode-se editar uma tarefa ja criada, ou criar uma nova tarefa, que será mostrada no calendário.</span>
        <span class="texto">Os itens com o indicador * são de preenchimento obrigatório.</span>
        <span class="texto">Ao clicar na seta que esta na compo da data, você será redirecionado para o calendario.</span>
        <span class="texto">Caso tenha aberto a opção de editar por engano, clique no botão cancelar.</span>`;
    }

    get textoCalendario() {
        return `<span class="texto">Nesta parte do site, o usuário tem acesso ao Calendário, local onde ele consegue ter controle sobre as tarefas que devem ser feitas, e as tarefas já concluidas.</span>
        <span class="texto">Os dias com marcas amarelas indicam que há tarefas a serem feitas.</span>
        <span class="texto">Os dias com marcas cinzas indicam que alguma tarefa foi concluída.</span>
        <span class="texto">Ao clicar em uma tarefa é possível obter mais informações sobre a mesma.</span>
        <span class="texto">Ao clicar no item azul 'nova tarefa', você será redirecionado para o calendário que estará com a data preenchida.</span>
        <span class="texto">Caso queira deletar ou editar uma tarefa, use os controladores que aparecem ao expandir uma.</span>`;
    }

    get textoConcluir() {
        return `<span class="texto">Com essa seção, o usuário pode concluir uma tarefa informando dados essênciais para a geração de formulários do site.</span>
        <span class="texto">Nenhum dos dados são divulgados externamente, são de uso exclusivo apenas para a criação dos formulários.</span>
        <span class="texto">Os itens com o indicador * são de preenchimento obrigatório.</span>`;
    }

    get textoLimparForm() {
        return `<span class="texto">Você possui dados preenchidos no formulário, deseja continuar ?</span>
        <div class="box-confirmacao"><div class="wrapper confirmacao-limpar">
            <img src="../img/svg/check-white.svg" alt="icone para confirmacao sim">        
            <span>Sim</span></div>
        <div class="wrapper confirmacao-limpar">
            <img src="../img/svg/close-cross.svg" alt="icone para confirmacao sim">        
            <span>Não</span></div></div>`;
    }

    get textoConfirmar() {
        return `<span class="texto">Você realmente deseja deletar esta tarefa ?</span>
        <div class="box-confirmacao"><div class="wrapper confirmacao-deletar">
            <img src="../img/svg/check-white.svg" alt="icone para confirmacao sim">        
            <span>Sim</span></div>
        <div class="wrapper confirmacao-deletar">
            <img src="../img/svg/close-cross.svg" alt="icone para confirmacao sim">        
            <span>Não</span></div></div>`;
    }

    get loading() {
        return "<span class='loading'></span>"
    }

    get overlay() {
        return $(".overlay-ajuda");
    }

    get div() {
        return $(".overlay-ajuda>div");
    }

    get botaoAjuda() {
        return $(".ajuda");
    }
    /*--- Métodos ---*/
    mostrar(texto) {
        if (texto == this.loading) {
            this.overlay.off("click");
        } else {
            this.overlay.click(() => {
                this.fechar();
            });
        }
        this.div.empty();
        this.overlay.fadeIn().css('display', 'flex');
        this.div.append(texto)
    }

    fechar() {
        this.overlay.fadeOut(() => {
            this.div.removeClass("relatorio");
            this.div.css('height', '');
        });
    }

    escolheTextoCerto(item) {
        if (item.hasClass("inicio")) {
            Menu.botaoInicio.click();
            this.mostrar(this.textoInicio);
        } else if (item.hasClass("nova-tarefa")) {
            Menu.botaoNova.click();
            this.mostrar(this.textoNovaTarefa);
        } else if (item.hasClass("calendario")) {
            Menu.botaoCalendario.click();
            this.mostrar(this.textoCalendario);
        } else {
            Menu.botaoConcluir.click();
            this.mostrar(this.textoConcluir);
        }
    }
}