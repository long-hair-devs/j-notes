//Atributos
/*--- Funções Básicas do Site ---*/
let ajudaInicio = "<span>Nesta seção é possível ter uma noção prévia das atividades do dia atual, e também de todas atividades que não foram concluídas nos dias anteriores.</span>";
ajudaInicio += "<span>Ao clicar em alguma notificação, a página será redirecionada ao local indicado pela notificação.</span>";

let ajudaNova = "<span>Nesta seção pode-se editar uma tarefa ja criada, ou criar uma nova tarefa, que será mostrada no calendário.</span>";
ajudaNova += '<span>Os itens com o indicador * são de preenchimento obrigatório.</span>';
ajudaNova += "<span>Ao clicar na seta que esta na compo da data, você será redirecionado para o calendario.</span>";
ajudaNova += '<span>Caso tenha aberto a opção de editar por engano, clique no botão cancelar.</span>';

let ajudaCaledario = "<span>Nesta parte do site, o usuário tem acesso ao Calendário, local onde ele consegue ter controle sobre as tarefas que devem ser feitas, e as tarefas já concluidas.</span>";
ajudaCaledario += "<span>Os dias com marcas amarelas indicam que há tarefas a serem feitas.</span>";
ajudaCaledario += "<span>Os dias com marcas cinzas indicam que alguma tarefa foi concluída.</span>";
ajudaCaledario += "<span>Ao clicar em uma tarefa é possível obter mais informações sobre a mesma.</span>";
ajudaCaledario += "<span>Ao clicar no item azul 'nova tarefa', você será redirecionado para o calendário que estará com a data preenchida.</span>";
ajudaCaledario += "<span>Caso queira deletar ou editar uma tarefa, use os controladores que aparecem ao expandir uma.</span>";

let ajudaConcluir = "<span>Com essa seção, o usuário pode concluir uma tarefa informando dados essênciais para a geração de formulários do site.</span>";
ajudaConcluir += "<span>Nenhum dos dados são divulgados externamente, são de uso exclusivo apenas para a criação dos formulários.</span>";
ajudaConcluir += "<span>Os itens com o indicador * são de preenchimento obrigatório.</span>";

let textoConfirmação = "<span>Você realmente deseja deletar esse item ?</span>";
textoConfirmação += "<div><span class='confirmacao'>Sim</span><span class='confirmacao'>Não</span></div>";

/*--- Nova Tarefa ---*/
const mascara = ['(00) 00000-0000', '(00) 0000-00009'];

let fezAutoComplete = false;
let vaiEditarTarefa = false;

let idTarefaSelecionada;
let divTarefaDeletar;

/*--- Calendário ---*/
let hoje = new Date();
hoje.setHours(0, 0, 0, 0);

let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let tarefasDoMes = 0;

const IDTAREFA = 0,
    DIA = 1,
    PERIODO = 2,
    PROBLEMA = 3,
    INFORMACOES = 4,
    NOME = 5,
    TELEFONE1 = 6,
    TELEFONE2 = 7,
    ENDERECO = 8,
    TOTAL = 9,
    TOTALGASTO = 10,
    OBSERVACOES = 11;

let podeCriarDivNovaData = false;

let diaParaMarcar = hoje.getDate();
/*--- Concluir Tarefa ---*/
let tarefasNaoConcluidas = 0;

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
        scrollSpy();
    }));

    /* Clicar no icone do menu abre ou fecha o menu */
    $(".btn-menu").click(function () {
        abreFechaMenuPrincipal();
    });

    /* Fecha o menu e a lista de anos, do painel do calendário, caso clique fora de um deles */
    $("main").click(function () {
        fechaMenuPrincipal();
        fechaListaAnos();
    });

    /* Mostra a ajuda ao clicar no botão de ajuda */
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

    /*--- Página Inicial ---*/

    /* Listener para quando clicar na notificação levar para o local desejado */
    $(".notificacao-item.tarefa").click(function () {
        diaParaMarcar = hoje.getDate();
        mesAtual = hoje.getMonth();
        anoAtual = hoje.getFullYear();
        mostrarCalendario(mesAtual, anoAtual);
        $("#link-calendario").click();
    });

    $(".notificacao-item.concluir").click(function () {
        $("#link-concluir").click();
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

    /* Quando está digitando o telefone, verifica se o telefone já foi cadastrado no banco */
    $("#tel1").keyup($.debounce(250, function () {
        autoCompletaTelExistente();
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

            if (vaiEditarTarefa) {
                aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                $.when(atualizaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                    fechaEditarTarefa();
                    mostrarCalendario(mesAtual, anoAtual);
                    $.when(pegaTarefasQueFaltaConcluir()).done(function () {
                        verificaTarefasConcluir();
                        atualizaNotificacoes();
                    });
                });
            } else {
                if (fezAutoComplete) {
                    aplicaUpdateNoCliente(tel1, nome, endereco, tel2);
                    fezAutoComplete = false;
                } else {
                    cadastraNovoCliente(tel1, nome, endereco, tel2);
                }
                $.when(cadastraNovaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional)).done(function () {
                    diaParaMarcar = parseInt(data.split("/")[0]);
                    mesAtual = (parseInt(data.split("/")[1]) - 1);
                    anoAtual = parseInt(data.split("/")[2]);
                    mostrarCalendario(mesAtual, anoAtual);
                });
            }
        }
    });

    /* Listener para o botão cancelar do formuláiro */
    $("#botao-cancelar").click(function () {
        fechaEditarTarefa();
    });

    /* Listener para levar ao calendário quando clicar na seta do campo da data */
    $("#desce-para-calendario").click(function () {
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

    /* Impede da lista ser fechada caso clique dentro da mesma */
    $(".wrapper-ano").click(function (e) {
        e.stopPropagation();
    });

    /* Listener para mudar o dia selecionado */
    $("#corpo-calendario").on("click", ".box-dia", function () {
        mudaDiaSelecionado(this);
    });

    /* Listener para expandir o evento que for clicado */
    $("#box-painel-eventos").on("click", ".box-painel-eventos-item", function () {
        abreFechaTarefaPainel(this);
    });

    /* Listener para evitar que o evento seja fechado ao clicar na barra de opções */
    $("#box-painel-crud").click(function (e) {
        e.stopPropagation();
    });

    /* Listener para colocar nova data no formulário */
    $(".box-painel-eventos").on("click", ".box-nova-data", function () {
        addDataCalendarioNoNovaTerfa();
    });

    /* Listeners para o editar tarefa e deletar tarefa da barra de opções */
    $(".box-painel-eventos").on("click", ".editar-tarefa", function () {
        ativaEditarTarefa();
        passaValoresParaNovaTarefa($(this).parent().parent());
    });

    $(".box-painel-eventos").on("click", ".deletar-tarefa", function () {
        mostraAjuda(textoConfirmação);
        divTarefaDeletar = $(this).parent().parent();
    });

    /* Listener que confirma se vai ou não deletar a tarefa */
    $(".overlay-ajuda div").on('click', '.confirmacao', function () {
        if ($(this).text() == "Sim") {
            deletarTarefa(divTarefaDeletar);
        }
        fechaAjuda();
    });

    /*--- Concluir Tarefa ---*/

    /* Listener para expandir ou fechar a tarefa do concluir tarefa */
    $(".box-concluir-tarefa").on('click', '.box-concluir-tarefa-item', function () {
        abreFechaItemConcluir(this);
    });

    /* Listener para impedir de fechar a tarefa quando clicar na label da tarefa */
    $(".box-concluir-tarefa").on('click', '.box-concluir-tarefa-item label', function (e) {
        e.stopPropagation();
    });

    /* Listener para impedir de fechar a tarefa quando clicar no icone de concluir, e concluir a tarefa */
    $(".box-concluir-tarefa").on('click', '.botao-concluir-tarefa', function (e) {
        if (transformaPxEmRem($(".box-concluir-tarefa-item").height()) > 10) {
            e.stopPropagation();

            if (validaDadosConcluirTarefa($(this).siblings("form"))) {
                let id = $(this).siblings(".info").children().eq(0);
                let tRecebido = $(this).siblings("form").find("input").eq(0).val();
                let tGasto = $(this).siblings("form").find("input").eq(1).val();
                let obs = $(this).siblings("form").find("textarea").val();

                $.when(concluirTarefa(id.text(), tRecebido, tGasto, obs)).done(function () {
                    id.parent().parent().fadeOut(function () {
                        id.parent().parent().remove();
                        atualizaNotificacoes();
                    });
                    mostrarCalendario(mesAtual, anoAtual);
                });
            }
        }
    });

    /* Ajax para verificar se tem tarefas a serem concluidas, cria um vetor com as mesmas caso existam */
    $.when(pegaTarefasQueFaltaConcluir()).done(function () {
        verificaTarefasConcluir();
        atualizaNotificacoes();
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

function scrollSpy() {
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
    $(".overlay-ajuda div").css('height', descobreTamanhoElemento - transformaRemEmPx(1));
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

// Função retirada da internet, para adicionar 0 ao dia ou mês caso seja menor que 10
Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
}

/*--- Tela Inicial ---*/
function atualizaNotificacoes() {
    if ($(".box-concluir-tarefa>div").children().length > 0) {
        $(".box-concluir-tarefa>div").children().length == 1 ? $(".notificacao-item.concluir").text("Há somente uma tarefa para concluir.") :
            $(".notificacao-item.concluir").text("Há " + $(".box-concluir-tarefa>div").children().length + " tarefas para concluir.");
    } else {
        $(".notificacao-item.concluir").text("Não há nada para concluir.");
    }

    if ($(".dia-selecionado").text() == hoje.getDate() && hoje.getMonth() == mesAtual && hoje.getFullYear() == anoAtual) {
        if ($(".box-painel-eventos").find(".box-painel-eventos-item").length > 0) {
            $(".box-painel-eventos").find(".box-painel-eventos-item").length == 1 ? $(".notificacao-item.tarefa").text("Você tem apenas uma tarefa para fazer hoje!") :
                $(".notificacao-item.tarefa").text("Você tem " + $(".box-painel-eventos").find(".box-painel-eventos-item").length + " tarefas para fazer hoje!");
        } else {
            $(".notificacao-item.tarefa").text("Nenhuma tarefa para fazer hoje!");
        }
    }
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

function autoCompletaTelExistente() {
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

function cadastraNovaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional) {
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
            mostraAjuda("<span>Tarefa cadastrada com sucesso!</span>");
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

    if (mes == hoje.getMonth()) {
        diaParaMarcar = hoje.getDate();
    } else if (diaParaMarcar > totalDiasMes) {
        diaParaMarcar = 1;
    }

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
                if (data == diaParaMarcar) {
                    linha += "dia-selecionado ";
                }
                linha += "'>" + data + "</span></td>";
                data++;
            }
        }
        linha += "</tr>"
        $("#corpo-calendario").append(linha);
    }
    $.when(pegaTarefasDoMes()).done(function () { //Só executa a função após o Ajax terminar
        addOuTiraNovaData();
        addIndicadorAosDias();
        verificaSeDiaTemTarefa(diaParaMarcar);
        atualizaNotificacoes();
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

function abreFechaTarefaPainel(item) {
    $(".box-painel-eventos-item").addClass("box-painel-eventos-item--animacao");
    if (transformaPxEmRem($(item).innerHeight()) == 5) {
        $(".box-painel-eventos-item").css('height', '5rem');
        $(item).css('height', transformaPxEmRem(descobreTamanhoElemento(item)) + "rem");
    } else {
        $(item).css('height', '5rem');
    }
    $(".box-painel-eventos-item").one("transitionend", function (e) {
        $(".box-painel-eventos-item").removeClass("box-painel-eventos-item--animacao");
    });
}

function descobreTamanhoElemento(item) {
    let tamanho = 0;
    for (let i = 0; i < $(item).children().length; i++) {
        tamanho += $(item).children().eq(i).outerHeight(true);
    }
    return tamanho + transformaRemEmPx(1);
}

function mudaDiaSelecionado(item) {
    $(".box-dia").removeClass("dia-selecionado");
    $(item).addClass("dia-selecionado");
    diaParaMarcar = parseInt($(item).text());

    addOuTiraNovaData();
    verificaSeDiaTemTarefa(parseInt($(item).text()).pad(2));
}

function pegaTarefasDoMes() {
    tarefasDoMes = 0;
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
                tarefasDoMes = JSON.parse(dados);
            }
        }
    });
}

function addIndicadorAosDias() {
    $(".dia-normal").removeClass("dia-evento-ativo dia-evento-passado");
    if (tarefasDoMes != 0) {
        let dias = $("#corpo-calendario").find("span");
        for (let i = 0; i < dias.length; i++) {
            for (let j = 0; j < tarefasDoMes.length; j++) {
                if (parseInt($(dias[i]).text()).pad(2) == tarefasDoMes[j][DIA].split("-")[2]) {
                    let dataSelecionada = new Date(anoAtual, mesAtual, $(dias[i]).text());
                    if (dataSelecionada.getTime() < hoje.getTime()) {
                        tarefasDoMes[j][TOTAL] != null ? $(dias[i]).addClass("dia-evento-concluido") : $(dias[i]).addClass("dia-evento-passado");
                    } else {
                        $(dias[i]).addClass("dia-evento-ativo");
                        break;
                    }
                }
            }
        }
    }
}

function verificaSeDiaTemTarefa(dia) {
    $(".box-painel-eventos-item").remove();
    for (let i = 0; i < tarefasDoMes.length; i++) {
        if (dia == tarefasDoMes[i][DIA].split("-")[2]) {
            let tipo;
            if (tarefasDoMes[i][TOTAL] != null) {
                tipo = "concluida";
            } else {
                tipo = "normal";
            }
            colocaTarefaNoPainel(tipo, i);
        }
    }
}

function colocaTarefaNoPainel(tipo, i) {
    let comando = "";
    if (tipo == "normal") {
        comando = '<div class="box-painel-eventos-item">';
        comando += '<span>' + tarefasDoMes[i][IDTAREFA] + '</span>';
        comando += '<span>' + tarefasDoMes[i][NOME] + '</span>';
        comando += '<span>' + tarefasDoMes[i][TELEFONE1] + '</span>';
        tarefasDoMes[i][TELEFONE2] != "" ? (comando += '<span class="opcional">' + tarefasDoMes[i][TELEFONE2] + '</span>') : (comando += "");
        comando += '<span>' + tarefasDoMes[i][ENDERECO] + '</span>';
        comando += '<span>' + tarefasDoMes[i][PERIODO] + '</span>';
        tarefasDoMes[i][PROBLEMA] != "" ? (comando += '<span>' + tarefasDoMes[i][PROBLEMA] + '</span>') : (comando += "");
        tarefasDoMes[i][INFORMACOES] != "" ? (comando += '<span>' + tarefasDoMes[i][INFORMACOES] + '</span>') : (comando += "");

        comando += '<div id="box-painel-crud">';
        comando += '<div class="wrapper-painel-crud editar-tarefa">';
        comando += '<img src="../img/svg/edit.svg" alt="botao-editar"><span>Editar</span></div>';
        comando += '<div class="wrapper-painel-crud deletar-tarefa">';
        comando += '<img src="../img/svg/delete.svg" alt="botao-deletar"><span>Deletar</span></div></div></div>';
    } else if (tipo = "concluida") {
        comando = '<div class="box-painel-eventos-item concluida">';
        comando += '<span></span>';
        comando += '<span>' + tarefasDoMes[i][NOME] + '</span>';
        comando += '<span>' + tarefasDoMes[i][TELEFONE1] + '</span>';
        tarefasDoMes[i][TELEFONE2] != "" ? (comando += '<span>' + tarefasDoMes[i][TELEFONE2] + '</span>') : (comando += "");
        comando += '<span>' + tarefasDoMes[i][ENDERECO] + '</span>';
        comando += '<span>' + tarefasDoMes[i][PERIODO] + '</span>';
        tarefasDoMes[i][PROBLEMA] != "" ? (comando += '<span>' + tarefasDoMes[i][PROBLEMA] + '</span>') : (comando += "");
        tarefasDoMes[i][INFORMACOES] != "" ? (comando += '<span>' + tarefasDoMes[i][INFORMACOES] + '</span>') : (comando += "");
        comando += '<span>Total Recebido: R$ ' + tarefasDoMes[i][TOTAL] + '</span>';
        tarefasDoMes[i][TOTALGASTO] != "" ? (comando += '<span>Total Gasto: R$ ' + tarefasDoMes[i][TOTALGASTO] + '</span>') : (comando += "");
        tarefasDoMes[i][OBSERVACOES] != "" ? (comando += '<span>' + tarefasDoMes[i][OBSERVACOES] + '</span>') : (comando += "");
    }
    $("#box-painel-eventos").prepend(comando);
}

function addOuTiraNovaData() {
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

function addDataCalendarioNoNovaTerfa() {
    $("#data").val(parseInt($(".dia-selecionado").text()).pad(2) + "/" + (mesAtual + 1).pad(2) + "/" + anoAtual);
    $("#link-nova").click();
}

function ativaEditarTarefa() {
    $("#nova-tarefa").find("h1").text("Editar Tarefa");
    $("#botao-cancelar").css('display', 'block');
    $("#link-nova").click();
    vaiEditarTarefa = true;
}

function passaValoresParaNovaTarefa(div) {
    idTarefaSelecionada = $(div).children().eq(0).text();
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
    addDataCalendarioNoNovaTerfa();
    $("#problema").val(problema);
    $("#info").val(info);
}

function atualizaTarefa(tel1, nome, endereco, tel2, data, periodo, problema, infoAdicional) {
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'atualiza-tarefa': 1,
            'id': idTarefaSelecionada,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
            'data': data,
            'periodo': periodo,
            'problema': problema,
            'infoAdicional': infoAdicional,
        },
        success: function (dados) {
            mostraAjuda("<span>Tarefa editada com sucesso!</span>");
        }
    });
}

function fechaEditarTarefa() {
    $("#nova-tarefa").find("h1").text("Nova Tarefa");
    $("#botao-cancelar").css('display', 'none');
    $("#box-nova-tarefa").trigger("reset");
    $("#tel1").prop("readonly", false);
    vaiEditarTarefa = false;
}

function deletarTarefa(div) {
    idTarefaSelecionada = $(div).children().eq(0).text();

    $.when($.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'deleta-tarefa': 1,
            'id': parseInt(idTarefaSelecionada),
        },
        success: function (dados) {
            if (dados == "certo") {
                $(div).fadeOut(function () {
                    $(div).remove();
                });
            }
        }
    })).done(function () {
        $.when(pegaTarefasDoMes()).done(function () {
            addIndicadorAosDias();
        });
        $.when(pegaTarefasQueFaltaConcluir()).done(function () {
            verificaTarefasConcluir();
            atualizaNotificacoes();
        });
    });
}

/*--- Concluir Tarefa ---*/
function abreFechaItemConcluir(item) {
    $(".box-concluir-tarefa-item").addClass("box-concluir-tarefa-item--animacao");
    if (transformaPxEmRem($(item).innerHeight()) == 10) {
        $(".box-concluir-tarefa-item").css('height', '10rem');
        $(".box-concluir-tarefa-item").one("transitionend", function (e) {
            $(".box-concluir-tarefa-item .info").css('height', '8rem');
            $(item).find('.info').css('height', (transformaPxEmRem(descobreTamanhoElemento($(item).find('.info'))) - 1) + "rem");
        });

        $(item).find('.info').css('height', (transformaPxEmRem(descobreTamanhoElemento($(item).find('.info'))) - 1) + "rem");
        $(item).css('height', (transformaPxEmRem(descobreTamanhoElemento(item)) - 3.6) + "rem");
    } else {
        $(item).css('height', '10rem');
        $(item).one("transitionend", function (e) {
            $(".box-concluir-tarefa-item .info").css('height', '8rem');
            $(".box-concluir-tarefa-item form").trigger('reset');
        });
    }
    $(".box-concluir-tarefa-item").one("transitionend", function (e) {
        $(".box-concluir-tarefa-item").removeClass("box-concluir-tarefa-item--animacao");
    });
}

function pegaTarefasQueFaltaConcluir() {
    tarefasNaoConcluidas = 0;
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'pega-nao-concluidas': 1,
            'hoje': hoje.getFullYear() + "-" + (hoje.getMonth() + 1).pad(2) + "-" + hoje.getDate().pad(2),
        },
        success: function (dados) {
            if (dados != "") {
                tarefasNaoConcluidas = JSON.parse(dados);
            }
        }
    });
}

function verificaTarefasConcluir() {
    $(".box-concluir-tarefa-item").remove();
    for (let i = 0; i < tarefasNaoConcluidas.length; i++) {
        colocaTarefaParaConcluir(i);
    }
    $(".dinheiro").mask('#,##0.00', {
        reverse: true
    });
}

function colocaTarefaParaConcluir(i) {
    let dia = tarefasNaoConcluidas[i][DIA].split("-")[2] + "/" + tarefasNaoConcluidas[i][DIA].split("-")[1] + "/" + tarefasNaoConcluidas[i][DIA].split("-")[0];

    let comando = '<div class="box-concluir-tarefa-item"><div class="info">';
    comando += '<span>' + tarefasNaoConcluidas[i][IDTAREFA] + '</span>';
    comando += '<span>' + tarefasNaoConcluidas[i][NOME] + '</span>';
    comando += '<span>' + tarefasNaoConcluidas[i][TELEFONE1] + '</span>';
    tarefasNaoConcluidas[i][TELEFONE2] != "" ? (comando += '<span class="opcional">' + tarefasNaoConcluidas[i][TELEFONE2] + '</span>') : (comando += "");
    comando += '<span>' + dia + '</span>';
    comando += '<span>' + tarefasNaoConcluidas[i][PERIODO] + '</span>';
    comando += '<span>' + tarefasNaoConcluidas[i][ENDERECO] + '</span>';
    tarefasNaoConcluidas[i][PROBLEMA] != "" ? (comando += '<span>' + tarefasNaoConcluidas[i][PROBLEMA] + '</span>') : (comando += "");
    tarefasNaoConcluidas[i][INFORMACOES] != "" ? (comando += '<span>' + tarefasNaoConcluidas[i][INFORMACOES] + '</span>') : (comando += "");
    comando += '</div><form><label id="l-total-recebido">';
    comando += '<span class="required">Total Recebido:</span>';
    comando += '<input class="dinheiro" id="total-recebido" name="total-recebido" type="text" placeholder="Ex: 000.00" autocomplete="off">';
    comando += '</label><label id="l-total-gasto">';
    comando += '<span>Total Gasto:</span>';
    comando += '<input class="dinheiro" id="total-gasto" name="total-gasto" type="text" placeholder="Ex: 000.00" autocomplete="off">';
    comando += '</label><label id="l-observacoes">';
    comando += '<span>Observações :</span>';
    comando += '<textarea id="observacoes" name="observacoes" placeholder="Ex: Componente x trocado" autocomplete="off"></textarea>';
    comando += '</label></form><img class="botao-concluir-tarefa" src="../img/svg/check-white.svg" alt="botao concluir tarefa"></div>';

    $(".box-concluir-tarefa>div").append(comando);
}

function validaDadosConcluirTarefa(form) {
    let tRecebido = $(form).find("input").eq(0);
    let obs = $(form).find("textarea");

    if (!(tRecebido.val().length > 2)) {
        tRecebido.parent().addClass("label--erro");
        return false;
    }

    if (!(obs.val().length <= 245)) {
        obs.parent().addClass("label--erro");
        return false;
    }
    obs.parent().removeClass();

    return true;
}

function concluirTarefa(id, tRecebido, tGasto, obs) {
    return $.ajax({
        url: 'j-notes.php',
        type: 'post',
        data: {
            'concluir-tarefa': 1,
            'id': parseInt(id),
            'tRecebido': tRecebido,
            'tGasto': tGasto,
            'obs': obs,
        },
        success: function (dados) {
            if (dados == "certo") {
                mostraAjuda("<span>Tarefa concluída com sucesso!</span>");
            }
        }
    });
}