class Secundario {
    /*--- Getters ---*/
    static get html() {
        return $("html");
    }

    static get tela() {
        return $(window);
    }

    static get document() {
        return $(document);
    }

    static get larguraTela() {
        return this.tela.width();
    }

    static get main() {
        return $("main");
    }

    /*--- Métodos ---*/
    static calcTamanhoFonte() {
        this.html.css('font-size', Math.round(6 + (this.larguraTela / 100) * 0.5));
    }

    static transformaRemEmPx(valorEmRem) {
        return valorEmRem * parseInt(this.html.css('font-size'));
    }

    static transformaPxEmRem(valorEmPx) {
        return valorEmPx / parseInt(this.html.css('font-size'));
    }

    static pad(valor) {
        return ('0' + valor).substr(-2);
    }

    static descobreTamanho(item) {
        let tamanho = 0;
        for (let i = 0; i < item.children().length; i++) {
            tamanho += item.children().eq(i).outerHeight(true);
        }
        return tamanho;
    }
}