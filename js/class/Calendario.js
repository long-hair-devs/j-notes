class Calendario {
    constructor() {
        this.mesAtual = this.hoje.getMonth();
        this.anoAtual = this.hoje.getFullYear();
        this.diaParaMarcar = this.hoje.getDate();


        this.construirCalendario();
    }
    /*--- Getters e Setters ---*/
    get hoje() {
        let hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return hoje;
    }

    get mesAtual() {
        return this._mesAtual;
    }

    set mesAtual(valor) {
        this._mesAtual = parseInt(valor);
    }

    get anoAtual() {
        return this._anoAtual;
    }

    set anoAtual(valor) {
        this._anoAtual = parseInt(valor);
    }

    get meses() {
        return ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
    }

    get diaParaMarcar() {
        return this._diaParaMarcar;
    }

    set diaParaMarcar(valor) {
        this._diaParaMarcar = parseInt(valor);
    }

    set textoMes(texto) {
        $("#mes").text(texto);
    }

    set textoAno(texto) {
        $("#ano").text(texto);
    }

    get corpo() {
        return $("#corpo-calendario");
    }

    get todosDias() {
        return $(".box-dia");
    }

    get diaSelecionado() {
        return parseInt($(".dia-selecionado").text());
    }

    get dataSelecionada() {
        return new Date(this.anoAtual, this.mesAtual, this.diaSelecionado);
    }

    get dataSelecionadaString() {
        return (`${Secundario.pad(this.diaSelecionado)}/${Secundario.pad(this.mesAtual + 1)}/${this.anoAtual}`);
    }

    /*--- Métodos ---*/
    construirCalendario() {
        let diaPrimeiro = new Date(this.anoAtual, this.mesAtual).getDay();
        let diaUltimo = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();
        let diaAtual = 1;

        this.corpo.empty();
        this.textoMes = this.meses[this.mesAtual];
        this.textoAno = this.anoAtual;

        if (this.mesAtual == this.hoje.getMonth()) {
            this.diaParaMarcar = this.hoje.getDate();
        } else if (this.diaParaMarcar > diaUltimo) {
            this.diaParaMarcar = 1;
        }

        for (let i = 0; i < 6; i++) {
            let comando = "<tr>";
            for (let j = 0; j < 7; j++) {
                if ((i == 0 && j < diaPrimeiro) || (diaAtual > diaUltimo)) {
                    //caso esteja na primeira semana e o dia for menor que o primeiro dia, colocar td vazio
                    //caso esteja na ultima semana, e o mês já tiver acabado, coloca o td vazio para dar o tamanho certo
                    comando += "<td></td>";
                } else {
                    comando += "<td><span class='box-dia dia-normal ";
                    if (j == 0 || j == 6) {
                        comando += "dia-final-semana ";
                    }
                    if (diaAtual == this.diaParaMarcar) {
                        comando += "dia-selecionado ";
                    }
                    comando += "'>" + diaAtual + "</span></td>";
                    diaAtual++;
                }
            }
            comando += "</tr>"
            this.corpo.append(comando);
        }
        // $.when(pegaTarefasDoMes()).done(function () { //Só executa a função após o Ajax terminar
        //     addOuTiraNovaData();
        //     addIndicadorAosDias();
        //     verificaSeDiaTemTarefa(diaParaMarcar);
        //     atualizaNotificacoes();
        // });
    }

    avancaMes() {
        this.anoAtual = (this.mesAtual == 11) ? this.anoAtual + 1 : this.anoAtual;
        this.mesAtual = (this.mesAtual + 1) % 12;
        this.construirCalendario(this.mesAtual, this.anoAtual);
    }

    voltaMes() {
        this.anoAtual = (this.mesAtual == 0) ? this.anoAtual - 1 : this.anoAtual;
        this.mesAtual = (this.mesAtual == 0) ? 11 : this.mesAtual - 1;
        this.construirCalendario(this.mesAtual, this.anoAtual);
    }

    mudaAno(valor) {
        this.anoAtual = valor;
        this.construirCalendario(this.mesAtual, this.anoAtual);
    }

    mudaDiaSelecionado(item) {
        this.todosDias.removeClass("dia-selecionado");
        item.addClass("dia-selecionado");
        this.diaParaMarcar = item.text();

        //addOuTiraNovaData();
        //verificaSeDiaTemTarefa(parseInt($(item).text()).pad(2));
    }
}