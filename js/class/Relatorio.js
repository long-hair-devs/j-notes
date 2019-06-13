class Relatorio {
    constructor(dono) {
        this._d = dono;
    }
    /*--- Getters e Setters ---*/
    get d() {
        return this._d;
    }

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
        if (this.titulo == "Customizado") {
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
        } else {
            return '<input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">';
        }
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
                </div>
                <span class="texto">Escolha a maneira para ordenar</span>
                <div class="box-relatorio">
                    <label class="box-radio">
                        <input name="ordem" type="radio" checked>
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Crescente</span>
                    </label>
                    <label class="box-radio">
                        <input name="ordem" type="radio">
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Decrescente</span>
                    </label>
                </div>
                <input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">`;
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
                </div>
                <span class="texto">Escolha a maneira para ordenar</span>
                <div class="box-relatorio">
                    <label class="box-radio">
                        <input name="ordem" type="radio" checked>
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Crescente</span>
                    </label>
                    <label class="box-radio">
                        <input name="ordem" type="radio">
                        <span class="radio-novo"></span>
                        <span class="radio-texto">Decrescente</span>
                    </label>
                </div>
                <input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">`
        } else {
            return '<input class="botao" value="Gerar" name="botao-gerar" id="botao-gerar" type="button">';
        }
    }

    get campoData() {
        return $(".datar");
    }

    get campoDinheiro() {
        return $(".dinheiror");
    }

    get tipoMarcado() {
        return $("input[name=tipo]:checked").siblings(".radio-texto").text();
    }

    get filtroMarcado() {
        return $("input[name=filtro]:checked").siblings(".radio-texto").text();
    }

    get ordem() {
        if ($("input[name=ordem]:checked").siblings(".radio-texto").text() == "Crescente")
            return "ORDER BY $_tabela.dia ASC";
        else {
            return "ORDER BY $_tabela.dia DESC";
        }
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

    get filtro() {
        if (this.filtroMarcado == "Data") {
            return `AND (tarefa.dia BETWEEN STR_TO_DATE('${this.campoData.eq(0).val()}', 'd%/%m/%y') AND STR_TO_DATE('${this.campoData.eq(1).val()}', '%d/%m/%y'))`;
        } else {
            return `AND (total_recebido-total_gasto BETWEEN ${this.pegaDinheiro(0)} AND ${this.pegaDinheiro(1)})`;
        }
    }
    /*--- Métodos ---*/
    dataConvertida(i) {
        return new Date(this.campoData.eq(i).val().split("/")[2], this.campoData.eq(i).val().split("/")[1] - 1, this.campoData.eq(i).val().split("/")[0]);
    }

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

        if (!this.lista.hasClass("wrapper-lista-relatorio--visivel")) {
            this.lista.addClass("wrapper-lista-relatorio--visivel");
            this.lista.find("img").addClass("img--girada");
        } else {
            this.lista.removeClass("wrapper-lista-relatorio--visivel");
            this.lista.find("img").removeClass("img--girada");
        }
        this.lista.one("transitionend", (e) => {
            this.lista.removeClass("wrapper-lista-relatorio--animacao");
        });
    }

    fechaLista() {
        if (this.lista.hasClass("wrapper-lista-relatorio--visivel")) {
            this.lista.addClass("wrapper-lista-relatorio--animacao");
            this.lista.removeClass("wrapper-lista-relatorio--visivel");
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

        this.div.parent().append(this.textoCustomizado1);

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

        if (pai.next().next().find("input").hasClass("datar")) {
            this.campoData.mask("00/00/0000");
        } else {
            this.campoDinheiro.mask('00.000.000,00', {
                reverse: true
            });
        }

        this.calcTamanho();
    }

    pegaDinheiro(i) {
        return this.campoDinheiro.eq(i).val() != 0 ? this.campoDinheiro.eq(i).val().split(".").join("").split(",").join(".") : "0.00";
    }

    validaDados() {
        if (this.div.find("input[type=text]").hasClass("datar")) {
            if (!(this.campoData.eq(0).val().length == 10)) {
                this.campoData.eq(0).parent().addClass("label--erro");
                this.campoData.eq(0).focus();
                return false;
            }
            this.campoData.eq(0).parent().removeClass();

            if (!(this.campoData.eq(1).val().length == 10)) {
                this.campoData.eq(1).parent().addClass("label--erro");
                this.campoData.eq(1).focus();
                return false;
            }
            this.campoData.eq(1).parent().removeClass();

            if (!(this.dataConvertida(0).getTime() < this.d.calendario.hoje.getTime())) {
                this.campoData.eq(0).parent().addClass("label--erro");
                this.campoData.eq(0).focus();
                return false;
            }
            this.campoData.eq(0).parent().removeClass();

            if (!(this.dataConvertida(1) > this.dataConvertida(0))) {
                this.campoData.eq(1).parent().addClass("label--erro");
                this.campoData.eq(1).focus();
                return false;
            }
            this.campoData.eq(1).parent().removeClass();
        } else {
            if (!(this.campoDinheiro.eq(0).val().length > 3)) {
                this.campoDinheiro.eq(0).parent().addClass("label--erro");
                this.campoDinheiro.eq(0).focus();
                return false;
            }
            this.campoDinheiro.eq(0).parent().removeClass("label--erro");

            if (!(this.campoDinheiro.eq(1).val().length > 3)) {
                this.campoDinheiro.eq(1).parent().addClass("label--erro");
                this.campoDinheiro.eq(1).focus();
                return false;
            }
            this.campoDinheiro.eq(1).parent().removeClass("label--erro");
        }
        return true;
    }

    acaoConcluir() {
        if (this.div.length == 1) { // Pré-definido

        } else if (this.div.length == 2 || this.div.length == 3) { // Sem filtro 
            this.geraForm("Tabela de " + this.tipoMarcado.toLowerCase(), "Nenhum", this.tipoMarcado.toLowerCase(), this.ordem, "");
        } else if (this.validaDados()) { // Com filtro
            this.geraForm("Tabela de " + this.tipoMarcado.toLowerCase(), this.filtroMarcado, this.tipoMarcado.toLowerCase(), this.ordem, this.filtro);
            console.log(this.filtro);
        }
    }

    geraForm(tipo, nomeFiltro, nomeTabela, ordem, comandoFiltro) {
        this.div.parent().append(`<form class="pdf" method="post" action="./lib/pdf.php">
                <input name="tipo" value="${tipo}">
                <input name="nome-filtro" value="${nomeFiltro}">
                <input name="nome-tabela" value="${nomeTabela}">
                <input name="ordem" value="${ordem}">
                <input name="filtro" value="${comandoFiltro}">
            </form>`);
        this.enviaDados();
    }

    enviaDados() {
        this.div.siblings("form").submit();
    }
}