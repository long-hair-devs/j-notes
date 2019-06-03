//Atributos
/*--- Nova Tarefa ---*/
const mascara = ['(00) 00000-0000', '(00) 0000-00009'];

let fezAutoComplete = false;
let vaiEditarTarefa = false;

let idTarefaSelecionada;
let divTarefaDeletar;

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
/*--- Concluir Tarefa ---*/
let tarefasNaoConcluidas = 0;

$(function () {
    main = new Main();

    // Variável vh para mobile, problema do autohide da barra de pesquisa solucionado 
    let vh = Secundario.tela.innerHeight() * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches
    Secundario.calcTamanhoFonte();
    Secundario.tela.resize(function () {
        Secundario.calcTamanhoFonte();
    });

    main.ativaScrollSpy(main.scrollSpy);

    main.ativaMenu(main.menu);

    main.ativaAjuda(main.ajuda);

    main.ativaNotificacoes(main.notificacoes, main.calendario);

    main.ativaCalendario(main.calendario, main.painel);

    main.ativaPainel(main.painel, main.calendario);


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

    /* Listener para expandir o evento que for clicado */
    $("#box-painel-eventos").on("click", ".box-painel-eventos-item", function () {
        abreFechaTarefaPainel($(this));
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

/*--- Tela Inicial ---*/

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