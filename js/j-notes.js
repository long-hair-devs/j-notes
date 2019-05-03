//Atributos
/*--- Calendário ---*/
let hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

//Main
$(function () {
    /*--- Funções Básicas do Site ---*/

    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    /* Ativa o scrollSpy e caso a tela seja redimensionada, ele chama a fução para o spy ficar correto */
    calcTamanhoFonte();
    ativaScrollSpy();
    $(window).resize(function () { calcTamanhoFonte(); ativaScrollSpy() });

    /* Listener para abrir o menu principal */
    $(".btn-menu").click(function () { abreFechaMenuPrincipal() });

    /* Ao clicar em item do menu móvel, fecha o mesmo */
    $(".div-menu-movel a.click").click(function () { abreFechaMenuPrincipal() });

    /*--- Calendário ---*/
    /* Inicia o calendário após a pagina ser carregada */
    mostrarCalendario(mesAtual, anoAtual);
});

//Secundários
/*--- Funções Básicas do Site ---*/
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
        $("#menu-movel").scrollspy({ offset: -5.5 * parseInt($("html").css('font-size')) });
    } else {
        $("#menu-fixo").scrollspy();
        $("#menu-movel").scrollspy();
    }
}

/*--- Calendário ---*/
function mostrarCalendario(mes, ano) {
    let primeiroDia = new Date(ano, mes).getDay();
    let totalDiasMes = new Date(ano, mes + 1, 0).getDate();
    $("#corpo-calendario").empty();
    // $("#mes").text(meses[mes]);
    // $("#ano").text(ano);
    let data = 1;
    for (let i = 0; i < 5; i++) {
        let tabela = "<tr>";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < primeiroDia) {
                tabela += "<td></td>";
            } else if (data > totalDiasMes) {
                break;
            } else {
                if (j === 0 || j === 6) {
                    tabela += "<td><span class='box-dia dia-normal dia-final-semana'>" + data + "</span></td>";
                } else {
                    tabela += "<td><span class='box-dia dia-normal'>" + data + "</span></td>";
                }
                data++;
            }
        }
        tabela += "</tr>"
        $("#corpo-calendario").append(tabela);
    }
}
