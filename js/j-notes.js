//Atributos

//Main
$(function () {
    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    calcTamanhoFonte();
    $(window).resize(function () { calcTamanhoFonte() });
});

//Secundários
function calcTamanhoFonte() {
    let tamanho = Math.round(6 + ($(this).width() / 100) * 0.5);
    $("html").css('font-size', tamanho);
}