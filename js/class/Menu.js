class Menu {
    constructor() {}
    /*--- Getters ---*/
    static get botaoInicio() {
        return $("#link-inicio");
    }

    static get botaoNova() {
        return $("#link-nova");
    }

    static get botaoCalendario() {
        return $("#link-calendario");
    }

    static get botaoConcluir() {
        return $("#link-concluir");
    }

    get menuMovel() {
        return $(".div-menu-movel");
    }

    get botao() {
        return $(".btn-menu");
    }
    /*--- Métodos ---*/
    abreOuFecha() {
        this.menuMovel.addClass("div-menu-movel--animacao");
        if (!this.menuMovel.hasClass("div-menu-movel--visivel")) {
            this.menuMovel.addClass("div-menu-movel--visivel");
        } else {
            this.menuMovel.removeClass("div-menu-movel--visivel");
        }
        this.menuMovel.one("transitionend", (e) => {
            this.menuMovel.removeClass("div-menu-movel--animacao");
        });
    }

    fecha() {
        if (this.menuMovel.hasClass("div-menu-movel--visivel")) {
            this.menuMovel.addClass("div-menu-movel--animacao");
            this.menuMovel.removeClass("div-menu-movel--visivel");
        }
        this.menuMovel.one("transitionend", (e) => {
            this.menuMovel.removeClass("div-menu-movel--animacao");
        });
    }
}