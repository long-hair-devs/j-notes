class ScrollSpy {
    constructor() {}
    /*--- Getters ---*/
    get menus() {
        return $('#menu-movel, #menu-fixo');
    }

    get linkMenus() {
        return $('#menu-movel li a, #menu-fixo li a');
    }

    get listaMenus() {
        return $('#menu-fixo ul, #menu-movel ul');
    }

    get todasSections() {
        return $('.section-principal');
    }
    /*--- Métodos ---*/
    clickMenu(item, e) {
        e.preventDefault();
        let i = item.index();

        if (i > 0 && i < 5) {
            this.linkMenus.removeClass("active");
            this.listaMenus.eq(0).find("a").eq(i).addClass("active");
            this.listaMenus.eq(1).find("a").eq(i).addClass("active");

            let alvo = $(this.listaMenus.eq(0).find("a").eq(i).attr('href')).offset().top;
            if (Secundario.tela.width() <= 720) {
                Secundario.html.scrollTop(alvo - Secundario.transformaRemEmPx(5.5));
            } else {
                Secundario.html.scrollTop(alvo);
            }
        }
    }

    ativar() {
        this.todasSections.each(function () {
            let id = $(this).attr('id'),
                areaHeight = $(this).outerHeight(),
                offset = $(this).offset().top,
                ajuste = Secundario.tela.innerHeight() / 3,
                maxArea = offset + areaHeight,
                documentTop = Secundario.document.scrollTop() + ajuste;
            if (documentTop > offset && documentTop < maxArea) {
                $('a[href="#' + id + '"]').addClass('active');
            } else {
                $('a[href="#' + id + '"]').removeClass('active')
            }
        });
    }
}