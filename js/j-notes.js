//Atributos

//Main
$(function () {
    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    calcTamanhoFonte();
    $(window).resize(function () { calcTamanhoFonte() });

    /* Listener para abrir o menu principal */
    $(".btn-menu").click(function () { abreFechaMenuPrincipal() });

    /* Ativa o scrollSpy e caso a tela seja redimensionada, ele chama a fução para o spy ficar correto */
    ativaScrollSpy();
    $(window).resize(function () { ativaScrollSpy() });
});

//Secundários
function calcTamanhoFonte() {
    let tamanho = Math.round(6 + ($(this).width() / 100) * 0.5);
    $("html").css('font-size', tamanho);
}

function abreFechaMenuPrincipal() {
    $(".div-menu-movel").addClass("div-menu-movel--animacao");
    if (!$(".div-menu-movel").hasClass("div-menu-movel--visivel")) {
        $(".div-menu-movel").addClass("div-menu-movel--visivel");
    } else {
        $(".div-menu-movel").removeClass("div-menu-movel--visivel");
    }
    $(".div-menu-movel").one("transitionend", function (e) {
        $(".div-menu-movel").removeClass("div-menu-movel--animacao");
    });
}

function ativaScrollSpy() {
    $("#menu-fixo").unbind();
    $("#menu-movel").unbind();
    if ($(window).width() <= 720) {
        $("#menu-movel").scrollspy({ offset: -5.75 * parseInt($("html").css('font-size')) });
    } else {
        $("#menu-fixo").scrollspy();
        $("#menu-movel").scrollspy();
    }
}