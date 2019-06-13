class Relatorio {
    constructor() {}
    /*--- Getters e Setters ---*/
    get botao() {
        return $(".wrapper");
    }

    get div() {
        return $(".box-relatorio");
    }

    get lista() {
        return $(".wrapper-lista-relatorio");
    }

    get titulo() {
        return $(".wrapper-lista-relatorio .titulo").text();
    }

    set titulo(valor) {
        $(".wrapper-lista-relatorio .titulo").text(valor);
    }

    get textoCustomizado1() {
        return `<span class="texto">Selecione o tipo de relatório</span>
        <div class="box-relatorio">
            <label class="box-radio">
                <input name="tipo" type="radio">
                <span class="radio-novo"></span>
                <span class="radio-texto">Tarefas</span>
            </label>
            <label class="box-radio">
                <input name="tipo" type="radio">
                <span class="radio-novo"></span>
                <span class="radio-texto">Clientes</span>
            </label>
            <label class="box-radio">
                <input name="tipo" type="radio">
                <span class="radio-novo"></span>
                <span class="radio-texto">Geral</span>
            </label>
        </div>`;
    }

    get textoCustomizado2() {
        if (this.tipoMarcado == "Tarefas") {
            return `<span class="texto">Escolha o filtro</span>
                <div class="box-relatorio">
                    <label class="box-radio">
                        <input name="filtro" type="radio">
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Data</span>
                    </label>
                    <label class="box-radio">
                        <input name="filtro" type="radio">
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Dinheiro</span>
                    </label>
                    <label class="box-radio">
                        <input name="filtro" type="radio">
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Nenhum</span>
                    </label>
                </div>`;
        } else {
            return '<input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">';
        }
    }

    get textoCustomizado3() {
        if (this.filtroMarcado == "Data") {
            return `<span class="texto">Coloque os dados necessários</span>
                <div class="box-relatorio opcoes">
                    <label>
                        <span>De</span>
                        <input class="datar" name="datar1" type="text" placeholder="Ex: dd/mm/aaaa" autocomplete="off">
                    </label>        
                    <label>
                        <span>Até</span>
                        <input class="datar" name="datar2" type="text" placeholder="Ex: dd/mm/aaaa" autocomplete="off">
                    </label>         
                </div>`;
        } else if (this.filtroMarcado == "Dinheiro") {
            return `<span class="texto">Coloque os dados necessários</span>
                <div class="box-relatorio opcoes">
                    <label>
                        <span>De</span>
                        <input class="dinheiror" name="dinheiror1" type="text" placeholder="Ex: R$ 000,00" autocomplete="off">
                    </label>        
                    <label>
                        <span>Até</span>
                        <input class="dinheiror" name="dinheiror2" type="text" placeholder="Ex: R$ 000,00" autocomplete="off">
                    </label>         
                </div>`
        } else {
            return '<input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">';
        }
    }

    get tipoMarcado() {
        return $("input[name=tipo]:checked").siblings(".radio-texto").text();
    }

    get filtroMarcado() {
        return $("input[name=filtro]:checked").siblings(".radio-texto").text();
    }

    get textoDiv() {
        return `<span class="texto">O que deseja no seu relatório?</span>
        <div class="box-relatorio">
            <div class="wrapper-lista-relatorio">
                <span class="texto titulo">Quanto de lucro o mês gerou</span>
                <span class="barra"></span>
                <span class="texto">Customizado</span>
                <img id="desce-lista-relatorio" src="../img/svg/down-white.svg">
            </div>
        </div>`;
    }
    /*--- Métodos ---*/
    calcTamanho() {
        if (Secundario.transformaPxEmRem(this.div.parent().innerHeight()) != Secundario.descobreTamanho(this.div.parent()) + 2) {
            this.div.parent().addClass("animacao");
            this.div.parent().css('height', (Secundario.descobreTamanho(this.div.parent()) + 2) + "rem");
            this.div.parent().one("transitionend", (e) => {
                this.div.parent().removeClass("animacao");
            });
        }
    }

    abreOuFechaLista() {
        this.lista.addClass("wrapper-lista-relatorio--animacao");

        if (Secundario.transformaPxEmRem(this.lista.height()) == 3.4) {
            this.lista.css('height', (Secundario.descobreTamanho(this.lista) - 4) + "rem");
            this.lista.find("img").addClass("img--girada");
        } else {
            this.lista.css('height', '');
            this.lista.find("img").removeClass("img--girada");
        }
        this.lista.one("transitionend", (e) => {
            this.lista.removeClass("wrapper-lista-relatorio--animacao");
        });
    }

    fechaLista() {
        if (Secundario.transformaPxEmRem(this.lista.height()) != 3.4) {
            this.lista.addClass("wrapper-lista-relatorio--animacao");
            this.lista.css('height', '');
            this.lista.find("img").removeClass("img--girada");

            this.lista.one("transitionend", (e) => {
                this.lista.removeClass("wrapper-lista-relatorio--animacao");
            });
        }
    }

    acaoLista(item) {
        let temp = this.titulo;
        this.titulo = item.text();
        item.text(temp);

        this.fechaLista();

        item.parent().parent().nextAll().remove();

        if (this.titulo == "Customizado") {
            this.div.parent().append(this.textoCustomizado1);
        }
        this.calcTamanho();
    }

    colocaFiltros(pai) {
        pai.nextAll().remove();

        pai.parent().append(this.textoCustomizado2);

        this.calcTamanho();
    }

    colocaOpcoes(pai) {
        pai.nextAll().remove();

        pai.parent().append(this.textoCustomizado3);

        this.calcTamanho();
    }
}