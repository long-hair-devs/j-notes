//Atributos
/*--- Funções Básicas do Site ---*/
let ajudaInicio = "<span>Nesta seção é possível ter uma noção prévia das atividades do dia atual, e também de todas atividades que não foram concluídas nos dias anteriores.</span>";
ajudaInicio += "<span>Ao clicar em alguma notificação, a página será redirecionada ao local indicado pela notificação.</span>";

let ajudaNova = "<span>Nesta seção pode-se criar uma nova tarefa, que será mais tarde mostrada no calendário, ou editar alguma já criada.</span>";
ajudaNova += '<span>Os itens com o indicador * são de preenchimento obrigatório.</span>';
ajudaNova += '<span>Caso tenha aberto a opção de editar por engano, clique no botão cancelar.</span>';

let ajudaCaledario = "<span>Nesta parte do site, o usuário tem acesso ao Calendário, local onde ele consegue ter controle sobre as tarefas que devem ser feitas, e as tarefas já concluidas.</span>";
ajudaCaledario += "<span>Os dias com marcas amarelas indicam que há tarefas a serem feitas.</span>";
ajudaCaledario += "<span>Os dias com marcas cinzas indicam que alguma tarefa foi concluída.</span>";
ajudaCaledario += "<span>Ao clicar em uma tarefa é possível obter mais informações sobre a mesma.</span>";
ajudaCaledario += "<span>Caso queira deletar ou editar uma tarefa, use os controladores que aparecem ao expandir uma.</span>";

let ajudaConcluir = "<span>Com essa seção, o usuário pode concluir uma tarefa informando dados essênciais para a geração de formulários do site.</span>";
ajudaConcluir += "<span>Nenhum dos dados são divulgados externamente, são de uso exclusivo apenas para a criação dos formulários.</span>";
ajudaConcluir += "<span>Os itens com o indicador * são de preenchimento obrigatório.<span>";

/*--- Nova Tarefa ---*/
let mascara = ['(00) 00000-0000', '(00) 0000-00009'];

let fezAutoComplete = false;
let editarTarefa = false;
let idTarefaEditada;
/*--- Calendário ---*/
let hoje = new Date();
hoje.setHours(0, 0, 0, 0);
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let eventosDoMes;

let IDTAREFA = 0,
    DIA = 1,
    PERIODO = 2,
    PROBLEMA = 3,
    INFORMACOES = 4,
    NOME = 5,
    TELEFONE1 = 6,
    TELEFONE2 = 7,
    ENDERECO = 8;

let podeCriarDivNovaData = false;
//Main
$(function () {
    /* Variável vh para mobile, problema do autohide da barra de pesquisa solucionado */
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    /*--- Funções Básicas do Site ---*/

    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    calcTamanhoFonte();
    $(window).resize(function () {
        calcTamanhoFonte();
    });

    /* Adiciona a classe active aos itens dos dois menus, quando clicar em algum deles, além de levar a página ao local desejado */
    $('#menu-movel, #menu-fixo').on('click', '.click-scrollspy', function (e) {
        scrollSpyClick(this, e);
    });

    /* Muda a classe active de acordo com o scroll da página */
    $(document).on('scroll', $.debounce(200, function () {
        scrollSpyNormal();
    }));

    /* Clicar no icone do menu abre ou fecha o menu */
    $(".btn-menu").click(function () {
        abreFechaMenuPrincipal();
    });

    /* Fecha o menu, lista de anos caso clique fora dele */
    $("main").click(function () {
        fechaMenuPrincipal();
        fechaListaAnos();
    });

    /* Mostra a ajuda */
    $(".ajuda").click(function () {
        if ($(this).hasClass("inicio")) {
            $("#link-inicio").click();
            mostraAjuda(ajudaInicio);
        } else if ($(this).hasClass("nova-tarefa")) {
            $("#link-nova").click();
            mostraAjuda(ajudaNova);
        } else if ($(this).hasClass("calendario")) {
            $("#link-calendario").click();
            mostraAjuda(ajudaCaledario);
        } else {
            $("#link-concluir").click();
            mostraAjuda(ajudaConcluir);
        }
    });

    /* Fecha a ajuda quando clica fora dela */
    $(".overlay-ajuda").click(function () {
        fechaAjuda();
    });

    /* Previne a ajuda de ser fechada caso clique dentro da mesma */
    $(".overlay-ajuda div").click(function (e) {
        e.stopPropagation();
    });

    /*--- Nova Terfa ---*/

    /* Mascara para o telefone, usando o modelo brasileiro para celulares e telefones fixos */
    $(".telefone").mask(mascara[1], { //retirado da internet
        onKeyPress: function (val, e, field, options) {
            field.mask(val.length > 14 ? mascara[0] : mascara[1], options);
        }
    });

    /* Mascara para data */
    $(".data").mask("00/00/0000");

    /* Função quando clica no botão concluir */
    $("#tel1").keyup($.debounce(250, function () {
        aplicaDadosTelExistente();
    }));

    /* Listener para o botão concluir do formuláiro */
    $("#botao-concluir").click(function () {
        if (validaDadosNovaTarefa()) {
            let tel1 = $("#tel1").val();
            let nome = $("#nome").val();
            let endereco = $("#endereco").val();
            let tel2 = $("#tel2").val();
            let data = $("#data").val();
            let periodo = $("input[name=periodo]:checked").siblings(".radio-texto").text();
            let problema = $("#problema").val();
            let infoAdicional = $("#info").val();

            if (editarTarefa) {
                aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                $.when(atualizaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                    fechaEditarTarefa();
                    mostrarCalendario(mesAtual, anoAtual);
                });
            } else {
                if (fezAutoComplete) {
                    aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                    fezAutoComplete = false;
                } else {
                    cadastraNovoCliente(tel1, nome, endereco, tel2);
                }
                $.when(cadastraNovatarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                    mostrarCalendario(mesAtual, anoAtual);
                });
            }
        }
    });

    /* Listener para o botão cancelar do formuláiro */
    $("#botao-cancelar").click(function () {
        fechaEditarTarefa();
    });

    /* Listener para levar ao calendário quando clicar em nova tarefa */
    $("#data").click(function () {
        $("#link-calendario").click();
    });

    /*--- Calendário ---*/

    /* Listeners para quando clicar nos botões de voltar e avançar mês */
    $("#volta-mes").click(function () {
        voltaMes();
    });
    $("#avanca-mes").click(function () {
        avancaMes();
    });

    /* Listener para mostrar a lista de anos */
    $("#mostra-lista-ano").click(function () {
        abreFechaListaAnos();
    });

    /* Listener para mudar o ano, e voltar a lista de anos */
    $(".box-lista-anos").on("click", "span", function () {
        mudaAno(this);
        abreFechaListaAnos();
    });

    /* Impede da lista ser fechada caso clique fora da mesma */
    $(".wrapper-ano").click(function (e) {
        e.stopPropagation();
    });

    /* Listener para mudar o dia selecionado */
    $("#corpo-calendario").on("click", ".box-dia", function () {
        mudaDiaSelecionado(this);
    });

    /* Listener para expandir o evento que for clicado */
    $("#box-painel-eventos").on("click", ".box-painel-eventos-item", function () {
        abreFechaItemPainel(this);
    });

    /* Listener para evitar que o evento seja fechado ao clicar na barra de opções ou no texto */
    $("#box-painel-crud").click(function (e) {
        e.stopPropagation();
    });

    /* Listener para colocar nova data no formulário */
    $(".box-painel-eventos").on("click", ".box-nova-data", function () {
        pegaDataCalendario();
    });

    $(".box-painel-eventos").on("click", ".editar-tarefa", function () {
        ativaEditarTarefa();
        passaValoresFormulario($(this).parent().parent());
    });

    $(".box-painel-eventos").on("click", ".deletar-tarefa", function () {
        deletarTarefa($(this).parent().parent());
    });

    /*--- Concluir Tarefa ---*/
    $(".box-concluir-tarefa-item").click(function () {
        abreFechaItemConcluir(this);
    });
});

//Secundários
/*--- Funções Básicas do Site ---*/
function calcTamanhoFonte() {
    let tamanho = Math.round(6 + ($(window).width() / 100) * 0.5);
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

function fechaMenuPrincipal() {
    if ($(".div-menu-movel").hasClass("div-menu-movel--visivel")) {
        $(".div-menu-movel").addClass("div-menu-movel--animacao");
        $(".div-menu-movel").removeClass("div-menu-movel--visivel");
    }
    $(".div-menu-movel").one("transitionend", function (e) {
        $(".div-menu-movel").removeClass("div-menu-movel--animacao");
    });
}

function scrollSpyClick(item, e) {
    e.preventDefault();
    let i = $(item).index();

    if (i > 0 && i < 5) {
        $('#menu-movel li a, #menu-fixo li a').removeClass("active");
        $('#menu-fixo ul').children().eq(i).children().addClass("active");
        $('#menu-movel ul').children().eq(i).children().addClass("active");

        let id = $('#menu-fixo ul').children().eq(i).children().attr('href');
        let alvo = $(id).offset().top;
        if ($(window).width() <= 720) {
            $("html").scrollTop(alvo - transformaRemEmPx(5.5));
        } else {
            $("html").scrollTop(alvo);
        }
    }
}

function scrollSpyNormal() {
    $('.section-principal').each(function () {
        let id = $(this).attr('id'),
            areaHeight = $(this).outerHeight(),
            offset = $(this).offset().top,
            ajuste = window.innerHeight / 3,
            maxArea = offset + areaHeight,
            documentTop = $(document).scrollTop() + ajuste;
        if (documentTop > offset && documentTop < maxArea) {
            $('a[href="#' + id + '"]').addClass('active');
        } else {
            $('a[href="#' + id + '"]').removeClass('active')
        }
    });
}

function mostraAjuda(texto) {
    $(".overlay-ajuda div").empty();
    $(".overlay-ajuda").fadeIn().css('display', 'flex');
    $(".overlay-ajuda div").append(texto);
    $(".overlay-ajuda div").css('height', descobreTamanho - transformaRemEmPx(1));
}

function fechaAjuda() {
    $(".overlay-ajuda").fadeOut();
}

function transformaRemEmPx(valorEmRem) {
    return valorEmRem * parseInt($("html").css('font-size'));
}

function transformaPxEmRem(valorEmPx) {
    return valorEmPx / parseInt($("html").css('font-size'));
}

/*--- Nova Tarefa ---*/
function validaDadosNovaTarefa() {
    let tel1 = $("#tel1");
    let nome = $("#nome");
    let tel2 = $("#tel2");
    let endereco = $("#endereco");
    let data = $("#data");
    let problema = $("#problema");
    let info = $("#info");

    // Se não satisfazer a condição, mostra erro e cancela a execução do método
    if (!(tel1.val().length >= 14 && tel1.val().length <= 15)) {
        tel1.parent().addClass("label--erro");
        tel1.focus();
        return false;
    }
    // Se satisfez a condição, remove o erro caso esteja ativo e continua para o proximo item
    tel1.parent().removeClass();

    if (!(nome.val().length > 0 && nome.val().length <= 50)) {
        nome.parent().addClass("label--erro");
        nome.focus();
        return false;
    }
    nome.parent().removeClass();

    if (tel2.val().length != 0) {
        if (!(tel2.val().length >= 14 && tel2.val().length <= 15)) {
            tel2.parent().addClass("label--erro");
            tel2.focus();
            return false;
        }
    }
    tel2.parent().removeClass();

    if (!(endereco.val().length > 0 && endereco.val().length <= 245)) {
        endereco.parent().addClass("label--erro");
        endereco.focus();
        return false;
    }
    endereco.parent().removeClass();

    if (!(data.val().length == 10)) {
        data.parent().addClass("label--erro");
        data.focus();
        return false;
    }
    data.parent().removeClass();


    let data_array = data.val().split("/");
    let data_date = new Date(data_array[2], data_array[1] - 1, data_array[0]);

    if (!(data_date.getTime() >= hoje.getTime())) {
        data.parent().addClass("label--erro");
        data.focus();
        return false;
    }
    data.parent().removeClass();

    if (!(problema.val().length <= 245)) {
        problema.parent().addClass("label--erro");
        problema.focus();
        return false;
    }
    problema.parent().removeClass();

    if (!(info.val().length <= 245)) {
        info.parent().addClass("label--erro");
        info.focus();
        return false;
    }
    info.parent().removeClass();

    return true;
}

function aplicaDadosTelExistente() {
    let tel1 = $("#tel1");
    if (tel1.val().length >= 14 && tel1.val().length <= 15) {
        $.ajax({
            url: 'j-notes.php',
            type: 'post',
            data: {
                'verifica_tel_no_banco': 1,
                'tel1': tel1.val(),
            },
            success: function (dados) {
                if (dados != "") {
                    let dados_array = JSON.parse(dados);
                    $("#nome").val(dados_array[0]);
                    $("#endereco").val(dados_array[1]);
                    $("#tel2").val(dados_array[2]);
                    fezAutoComplete = true;
                }
            }
        });
    }
}

function aplicaUpdateNoCliente(tel1, nome, endereco, tel2) {
    $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'aplica-update-no-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        }
    });
}

function cadastraNovoCliente(tel1, nome, endereco, tel2) {
    $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'cadastra-novo-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        }
    });
}

function cadastraNovatarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional) {
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'cadastra-nova-tarefa': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
            'data': data,
            'periodo': periodo,
            'problema': problema,
            'infoAdicional': infoAdicional,
        },
        success: function () {
            $("#box-nova-tarefa").trigger("reset");
        }
    });
}

/*--- Calendário ---*/
function mostrarCalendario(mes, ano) {
    let primeiroDia = new Date(ano, mes).getDay();
    let totalDiasMes = new Date(ano, mes + 1, 0).getDate();
    $("#corpo-calendario").empty();
    $("#mes").text(meses[mes]);
    $("#ano").text(ano);
    let data = 1;
    let data_sel = 0;
    for (let i = 0; i < 6; i++) {
        let linha = "<tr>";
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < primeiroDia) || (data > totalDiasMes)) {
                //caso esteja na primeira semana e o dia for menor que o primeiro dia, colocar td vazio
                //caso esteja na ultima semana, e o mês já tiver acabado, coloca o td vazio para dar o tamanho certo
                linha += "<td></td>";
            } else {
                linha += "<td><span class='box-dia dia-normal ";
                if (j === 0 || j === 6) {
                    linha += "dia-final-semana ";
                }
                if (data === 1) {
                    data_sel = data;
                    linha += "dia-selecionado";
                } else if (data === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                    data_sel = data;
                    linha = linha.replace('dia-selecionado', '');
                    $(".dia-normal").removeClass("dia-selecionado");
                    linha += "dia-selecionado";
                }
                linha += "'>" + data + "</span></td>";
                data++;
            }
        }
        linha += "</tr>"
        $("#corpo-calendario").append(linha);
    }
    $.when(pegaEventosDoMes()).done(function () { //Só executa a função após o Ajax terminar
        verificaDiaMenorQueAtual();
        verificaSeDiaTemEvento(data_sel);
    });
}

function avancaMes() {
    anoAtual = (mesAtual === 11) ? anoAtual + 1 : anoAtual;
    mesAtual = (mesAtual + 1) % 12;
    mostrarCalendario(mesAtual, anoAtual);
}

function voltaMes() {
    anoAtual = (mesAtual === 0) ? anoAtual - 1 : anoAtual;
    mesAtual = (mesAtual === 0) ? 11 : mesAtual - 1;
    mostrarCalendario(mesAtual, anoAtual);
}

function abreFechaListaAnos() {
    $(".wrapper-lista-anos").addClass("wrapper-lista-anos--animacao");
    $("#mostra-lista-ano").addClass("ano--animacao");

    if (!$(".wrapper-lista-anos").hasClass("wrapper-lista-anos--visivel")) {
        $(".wrapper-lista-anos").addClass("wrapper-lista-anos--visivel");
        $("#mostra-lista-ano").css('transform', 'rotate(-180deg)');
    } else {
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--visivel");
        $("#mostra-lista-ano").css('transform', 'none');
    }
    $(".wrapper-lista-anos").one("transitionend", function (e) {
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--animacao");
        $("#mostra-lista-ano").removeClass("ano--animacao");
    });
}

function fechaListaAnos() {
    if ($(".wrapper-lista-anos").hasClass("wrapper-lista-anos--visivel")) {
        $(".wrapper-lista-anos").addClass("wrapper-lista-anos--animacao");
        $("#mostra-lista-ano").addClass("ano--animacao");
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--visivel");
        $("#mostra-lista-ano").css('transform', 'none');
    }
    $(".wrapper-lista-anos").one("transitionend", function (e) {
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--animacao");
        $("#mostra-lista-ano").removeClass("ano--animacao");
    });
}

function mudaAno(ano) {
    anoAtual = parseInt($(ano).text());
    mostrarCalendario(mesAtual, anoAtual);
}

function abreFechaItemPainel(item) {
    $(".box-painel-eventos-item").addClass("box-painel-eventos-item--animacao");
    if (transformaPxEmRem($(item).innerHeight()) == 5) {
        $(".box-painel-eventos-item").css('height', '5rem');
        $(item).css('height', descobreTamanho(item));
    } else {
        $(item).css('height', '5rem');
    }
    $(".box-painel-eventos-item").one("transitionend", function (e) {
        $(".box-painel-eventos-item").removeClass("box-painel-eventos-item--animacao");
    });
}

function descobreTamanho(item) {
    let tamanho = 0;
    for (let i = 0; i < $(item).children().length; i++) {
        tamanho += $(item).children().eq(i).outerHeight(true);
    }
    return tamanho + transformaRemEmPx(1);
}

function mudaDiaSelecionado(item) {
    $(".box-dia").removeClass("dia-selecionado");
    $(item).addClass("dia-selecionado");

    verificaDiaMenorQueAtual();
    verificaSeDiaTemEvento($(item).text());
}

function pegaEventosDoMes() {
    eventosDoMes = 0;
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'pega-eventos-mes': 1,
            'mes': mesAtual,
            'ano': anoAtual,
        },
        success: function (dados) {
            if (dados != "") {
                eventosDoMes = JSON.parse(dados);
            }
        }
    });
}

function verificaSeDiaTemEvento(dia) {
    $(".box-painel-eventos-item").remove();
    for (let i = 0; i < eventosDoMes.length; i++) {
        if (eventosDoMes[i][DIA].split("-")[2] == dia) {
            criaEventoCalendario(eventosDoMes[i][IDTAREFA], eventosDoMes[i][NOME],
                eventosDoMes[i][TELEFONE1], eventosDoMes[i][TELEFONE2],
                eventosDoMes[i][ENDERECO], eventosDoMes[i][PERIODO],
                eventosDoMes[i][PROBLEMA], eventosDoMes[i][INFORMACOES]);
        }
    }
}

function criaEventoCalendario(id, nome, tel1, tel2, endereco, periodo, problema, info) {
    let comando = '<div class="box-painel-eventos-item">';
    comando += '<span>' + id + '</span>';
    comando += '<span>' + nome + '</span>';
    comando += '<span>' + tel1 + '</span>';
    tel2 != "" ? (comando += '<span class="opcional">' + tel2 + '</span>') : (comando += "");
    comando += '<span>' + endereco + '</span>';
    comando += '<span>' + periodo + '</span>';
    problema != "" ? (comando += '<span>' + problema + '</span>') : (comando += "");
    info != "" ? (comando += '<span>' + info + '</span>') : (comando += "");

    comando += '<div id="box-painel-crud">';
    comando += '<div class="wrapper-painel-crud editar-tarefa">';
    comando += '<img src="../img/svg/edit.svg" alt="botao-editar"><span>Editar</span></div>';
    comando += '<div class="wrapper-painel-crud deletar-tarefa">';
    comando += '<img src="../img/svg/delete.svg" alt="botao-deletar"><span>Deletar</span></div></div></div>';

    $("#box-painel-eventos").prepend(comando);
}

function verificaDiaMenorQueAtual() {
    let dataSelecionada = new Date(anoAtual, mesAtual, $(".dia-selecionado").text());
    if (dataSelecionada.getTime() >= hoje.getTime()) {
        mostraDivNovaData();
        podeCriarDivNovaData = false;
    } else {
        $(".box-nova-data").remove();
        podeCriarDivNovaData = true;
    }
}

function mostraDivNovaData() {
    if (podeCriarDivNovaData) {
        let comando = '<div class="box-nova-data"><img src="../img/svg/plus.svg"><span>Nova Tarefa</span></div>';
        $("#box-painel-eventos").append(comando);
    }
}

// Função retirada da internet, para adicionar 0 ao dia ou mês caso seja menor que 10
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

function pegaDataCalendario() {
    $("#data").val(parseInt($(".dia-selecionado").text()).pad(2) + "/" + (mesAtual + 1).pad(2) + "/" + anoAtual);
    $("#link-nova").click();
}

function ativaEditarTarefa() {
    $("#nova-tarefa").find("h1").text("Editar Tarefa");
    $("#botao-cancelar").css('display', 'block');
    $("#link-nova").click();
    editarTarefa = true;
}

function passaValoresFormulario(div) {
    idTarefaEditada = $(div).children().eq(0).text();
    let nome = $(div).children().eq(1).text();
    let tel1 = $(div).children().eq(2).text();

    let tel2, endereco, periodo, problema, info;

    if ($(div).children().eq(3).hasClass("opcional")) {
        tel2 = $(div).children().eq(3).text();
        endereco = $(div).children().eq(4).text();

        problema = $(div).children().eq(6).text() != "EditarDeletar" ? $(div).children().eq(6).text() : "";
        info = $(div).children().eq(7).text() != "EditarDeletar" ? $(div).children().eq(7).text() : "";
    } else {
        tel2 = "";
        endereco = $(div).children().eq(3).text();

        problema = $(div).children().eq(5).text() != "EditarDeletar" ? $(div).children().eq(5).text() : "";
        info = $(div).children().eq(6).text() != "EditarDeletar" ? $(div).children().eq(6).text() : "";
    }
    $("#tel1").val(tel1);
    $("#tel1").prop("readonly", true);
    $("#nome").val(nome);
    $("#endereco").val(endereco);
    $("#tel2").val(tel2);
    pegaDataCalendario();
    $("#problema").val(problema);
    $("#info").val(info);
}

function atualizaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional) {
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'atualiza-tarefa': 1,
            'id': idTarefaEditada,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
            'data': data,
            'periodo': periodo,
            'problema': problema,
            'infoAdicional': infoAdicional,
        }
    });
}

function fechaEditarTarefa() {
    $("#nova-tarefa").find("h1").text("Nova Tarefa");
    $("#botao-cancelar").css('display', 'none');
    $("#box-nova-tarefa").trigger("reset");
    $("#tel1").prop("readonly", false);
    editarTarefa = false;
}

function deletarTarefa(div) {
    idTarefaEditada = $(div).children().eq(0).text();
    $(div).fadeOut(function () {
        $(div).remove();
    });

    $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'deleta-tarefa': 1,
            'id': idTarefaEditada,
        }
    });
}

/*--- Concluir Tarefa ---*/
function abreFechaItemConcluir(item) {
    $(".box-concluir-tarefa-item").addClass("box-concluir-tarefa-item--animacao");
    if (transformaPxEmRem($(item).innerHeight()) == 10) {
        $(".box-concluir-tarefa-item").css('height', '10rem');
        $(item).css('height', '20rem');
    } else {
        $(item).css('height', '10rem');
    }
    $(".box-concluir-tarefa-item").one("transitionend", function (e) {
        $(".box-concluir-tarefa-item").removeClass("box-concluir-tarefa-item--animacao");
    });
}