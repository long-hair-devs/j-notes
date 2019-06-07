class Ajuda {
    constructor() {}
    /*--- Getters e Setters ---*/
    get textoInicio() {
        return `<span>Nesta seção é possível ter uma noção prévia das atividades do dia atual, e também de todas atividades que não foram concluídas nos dias anteriores.</span>
        <span>Ao clicar em alguma notificação, a página será redirecionada ao local indicado pela notificação.</span>`;
    }

    get textoNovaTarefa() {
        return `<span>Nesta seção pode-se editar uma tarefa ja criada, ou criar uma nova tarefa, que será mostrada no calendário.</span>
        <span>Os itens com o indicador * são de preenchimento obrigatório.</span>
        <span>Ao clicar na seta que esta na compo da data, você será redirecionado para o calendario.</span>
        <span>Caso tenha aberto a opção de editar por engano, clique no botão cancelar.</span>`;
    }

    get textoCalendario() {
        return `<span>Nesta parte do site, o usuário tem acesso ao Calendário, local onde ele consegue ter controle sobre as tarefas que devem ser feitas, e as tarefas já concluidas.</span>
        <span>Os dias com marcas amarelas indicam que há tarefas a serem feitas.</span>
        <span>Os dias com marcas cinzas indicam que alguma tarefa foi concluída.</span>
        <span>Ao clicar em uma tarefa é possível obter mais informações sobre a mesma.</span>
        <span>Ao clicar no item azul 'nova tarefa', você será redirecionado para o calendário que estará com a data preenchida.</span>
        <span>Caso queira deletar ou editar uma tarefa, use os controladores que aparecem ao expandir uma.</span>`;
    }

    get textoConcluir() {
        return `<span>Com essa seção, o usuário pode concluir uma tarefa informando dados essênciais para a geração de formulários do site.</span>
        <span>Nenhum dos dados são divulgados externamente, são de uso exclusivo apenas para a criação dos formulários.</span>
        <span>Os itens com o indicador * são de preenchimento obrigatório.</span>`;
    }

    get textoLimparForm() {
        return `<span>Você possui dados preenchidos no formulário, deseja continuar ?</span>
        <div class="box-confirmacao"><div class="wrapper confirmacao-limpar">
            <img src="../img/svg/check-white.svg" alt="icone para confirmacao sim">        
            <span>Sim</span></div>
        <div class="wrapper confirmacao-limpar">
            <img src="../img/svg/close-cross.svg" alt="icone para confirmacao sim">        
            <span>Não</span></div></div>`;
    }

    get textoConfirmar() {
        return `<span>Você realmente deseja deletar esta tarefa ?</span>
        <div class="box-confirmacao"><div class="wrapper confirmacao-deletar">
            <img src="../img/svg/check-white.svg" alt="icone para confirmacao sim">        
            <span>Sim</span></div>
        <div class="wrapper confirmacao-deletar">
            <img src="../img/svg/close-cross.svg" alt="icone para confirmacao sim">        
            <span>Não</span></div></div>`;
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
        this.div.empty();
        this.overlay.fadeIn().css('display', 'flex');
        this.div.append(texto);
        this.div.css('height', (Secundario.descobreTamanho(this.div) + 2) + "rem");
    }

    fechar() {
        this.overlay.fadeOut();
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