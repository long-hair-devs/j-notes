//Atributos

//Main
$(function () {
    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    calcTamanhoFonte();
    $(window).resize(function () { calcTamanhoFonte() });

    /* Listener para abrir o menu principal */
    $("#icone-menu").click(function () {
        $(".menu-movel").addClass("menu-movel--animacao");
        if (!$(".menu-movel").hasClass("menu-movel--visivel")) {
            $(".menu-movel").addClass("menu-movel--visivel");
        } else {
            $(".menu-movel").removeClass("menu-movel--visivel");
        }
        $(".menu-movel").one("transitionend", function (e) {
            $(".menu-movel").removeClass("menu-movel--animacao");
        });
    });
});

//Secundários
function calcTamanhoFonte() {
    let tamanho = Math.round(6 + ($(this).width() / 100) * 0.5);
    $("html").css('font-size', tamanho);
}