<?php
define('FPDF_FONTPATH', 'font/');
include_once('conexao.php');

require_once("fpdf/fpdf.php");
date_default_timezone_set('America/Sao_Paulo');
session_start();

$_linhaOne = array(
    "Tabela de clientes" => array(array("nome", "NOME", 6), array("telefone1", "TELEFONE 1", 5), array("telefone2", "TELEFONE 2", 5), array("telefone1", "QUANTIDADE DE TAREFAS", 8.7)),
    "Tabela de tarefas" => array(array("dia", "DATA", 3.5), array("periodo", utf8_decode("PERÍODO"), 3), array("nome", "CLIENTE", 6.5), array("telefone1", "TELEFONE", 5), array("total_recebido", utf8_decode("LUCRO"), 6.7))
);

$_IDuser = $_SESSION['id'];
$_user = $_SESSION['nome'];
$_tipo = $_POST['tipo'];
$_filtroTipo = $_POST['nome-filtro'];
$_tabela = $_POST['nome-tabela'];
$_order = $_POST['ordem'];
$_filtro =  $_POST['filtro'];

if ($_tipo == "Tabela de tarefas" || $_tipo == "Tabela de clientes") {
    $_orientacao_pag = "L";
} else {
    $_orientacao_pag = "P";
}
//L = Horizontal ///// P = Vertical
$_orientacao_pag == "L" ? $_height = 24.7 : $_height = 16;

$_pdf = new FPDF($_orientacao_pag, 'cm', 'A4');
$_pdf->Open();
$_pdf->SetMargins(2.5, 2);
$_pdf->AddPage();
$_pdf->AddFont('helvetica', '', 'helvetica.php');

//Configurando o cabeçalho da pagina
construirCabecalho($_pdf, $_height, $_user, $_tipo, $_filtroTipo);

//////////////////////////////////////////////////////////////////// Gerando a tabela de CLIENTES //////////////////////////////////////////////////////////////////////
if ($_tabela == "cliente") {

    $_pdf->Ln(0.5);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->SetTextColor(74, 74, 74);

    for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
        if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 1, 'C', false);
            $_pdf->Cell($_height, 0.05, '', 0, 1, 'C', true);
        } else {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 0, 'C', false);
        }
    }
    //
    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->SetFillColor(230, 230, 230);
    $_fundo = 1;

    //Conexão com o banco
    $_string_connection = "mysql:host=localhost;
                                dbname=jbanco";

    $_pdo = new PDO($_string_connection, "root", "");
    $_sql = $_pdo->prepare("SELECT * FROM $_tabela WHERE id_user=$_IDuser "); // ORDER BY $_tabela.dia DESC
    $_sql->execute();
    $_resultset = $_sql->fetchAll(PDO::FETCH_ASSOC);


    foreach ($_resultset as $_line) {
        for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
            if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
                $_where = $_line["telefone1"];
                $_somaTarefas = "SELECT * FROM tarefas WHERE telefone1 = '$_where' AND id_user='$_line[id_user]'";
                $_qtsLinhas = mysqli_num_rows(mysqli_query($_conexao, $_somaTarefas));
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_qtsLinhas, 0, 1, 'C', true);
            } else {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, utf8_decode($_line[$_linhaOne[$_tipo][$_i][0]]), 0, 0, 'C', true);
            }
        }
        $_fundo++;
        if (($_fundo % 2) == 0) {
            $_pdf->SetFillColor(255, 255, 255);
        } else {
            $_pdf->SetFillColor(230, 230, 230);
        }
    }
}


//////////////////////////////////////////////////////////////////// Gerando a tabela de TAREFAS //////////////////////////////////////////////////////////////////////
else if ($_tabela == "tarefas") {
    $_pdf->Ln(0.5);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->SetTextColor(74, 74, 74);

    for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
        if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 1, 'C', false);
            $_pdf->Cell($_height, 0.05, '', 0, 1, 'C', true);
        } else {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 0, 'C', false);
        }
    }

    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->SetFillColor(230, 230, 230);
    $_fundo = 1;
    $_lucro = 0;


    $_string_connection = "mysql:host=localhost; dbname=jbanco";

    $_pdo = new PDO($_string_connection, "root", "");
    $_sql = $_pdo->prepare("SELECT nome, dia, periodo, telefone1, total_recebido-total_gasto AS 'lucro' FROM $_tabela  WHERE id_user=$_IDuser" . $_filtro . " " . $_order);
    $_sql->execute();
    $_resultset = $_sql->fetchAll(PDO::FETCH_ASSOC);

    foreach ($_resultset as $_line) {
        for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
            if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, utf8_decode($_line['lucro']), 0, 1, 'C', true);
                $_lucro += $_line['lucro'];
            } else if (0 == $_i) {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, implode("/", array_reverse(explode("-", $_line[$_linhaOne[$_tipo][$_i][0]]))), 0, 0, 'C', true);
            } else {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, utf8_decode($_line[$_linhaOne[$_tipo][$_i][0]]), 0, 0, 'C', true);
            }
        }
        $_fundo++;
        if (($_fundo % 2) == 0) {
            $_pdf->SetFillColor(255, 255, 255);
        } else {
            $_pdf->SetFillColor(230, 230, 230);
        }
    }
    $_pdf->Cell($_height, 1, "", 0, 1, 'C', false);
    $_pdf->SetFillColor(200, 200, 200);
    $_pdf->Cell(13, 1, "", 0, 0, 'C', false);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->Cell(5, 1, "Lucro total: ", 0, 0, 'R', true);
    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->Cell(6.7, 1, $_lucro, 0, 1, 'C', true);
}

//////////////////////////////////////////////////////////////////// Gerando a tabela de GERAL //////////////////////////////////////////////////////////////////////
else if ($_tabela == "geral") {
    $_pdf->Ln(0.5);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->SetTextColor(74, 74, 74);

    $_lucro = 0;
    $_totalTarefas = 0;

    $_string_connection = "mysql:host=localhost;
                                dbname=jbanco";

    $_pdo = new PDO($_string_connection, "root", "");
    $_sql = $_pdo->prepare("SELECT nome, dia, periodo, telefone1, total_recebido-total_gasto AS 'lucro' FROM tarefas  WHERE id_user=$_IDuser" . $_filtro . " " . $_order);
    $_sql->execute();
    $_resultset = $_sql->fetchAll(PDO::FETCH_ASSOC);

    foreach ($_resultset as $_line) {
        for ($_i = 0; $_i < count($_linhaOne["Tabela de tarefas"]); $_i++) {
            if ((count($_linhaOne["Tabela de tarefas"]) - 1) == $_i) {
                $_lucro += $_line['lucro'];
            }
        }
        $_totalTarefas += 1;
    }

    $_pdf->SetFillColor(200, 200, 200);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->Cell(2.4, 1.5, "Lucro total: ", 0, 0, 'L', false);
    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->Cell(4, 1.5, $_lucro, 0, 1, 'L', false);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->Cell(3.4, 1.5, "Total de tarefas: ", 0, 0, 'L', false);
    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->Cell(4, 1.5, $_totalTarefas, 0, 1, 'L', false);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->Cell(5.7, 1.5, "Total de tarefas concluidas: ", 0, 0, 'L', false);
    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->Cell(4, 1.5, $_totalTarefas, 0, 1, 'L', false);
}


$_pdf->Output();
$_pdf->Close();

//--------------------------------------- FUNÇÕES ----------------------------------------------//
function construirCabecalho($_pdf, $_height, $_user, $_tipo, $_filtroTipo)
{
    $_pdf->SetFont('helvetica', 'B', 16);
    $_pdf->SetTextColor(0, 0, 0);
    $_pdf->SetFillColor(109, 168, 214);
    $_pdf->SetTextColor(74, 74, 74);

    $_pdf->Cell($_height, 0.9, utf8_decode("Relatório gerado por J-Notes"), 0, 1, 'C', false);
    $_pdf->Ln(0.2);
    $_pdf->Cell($_height, 0.05, '', 0, 1, 'C', true);
    $_pdf->Ln(0.2);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->SetTextColor(109, 168, 214);
    $_pdf->Cell(2.3, 0.6, utf8_decode("USUÁRIO:"), 0, 0, 'L', false);
    $_pdf->SetTextColor(120, 120, 120);
    $_pdf->Cell(11.8, 0.6, utf8_decode($_user), 0, 1, 'L', false);
    $_pdf->SetTextColor(109, 168, 214);
    $_pdf->Cell(6, 0.6, utf8_decode("DATA E HORA DE EMISSÃO:"), 0, 0, 'L', false);
    $_pdf->SetTextColor(120, 120, 120);
    $_pdf->Cell(3.8, 0.6, utf8_decode(date('d/m/Y \- H\hi\m\i\\n')), 0, 1, 'L', false);
    $_pdf->SetTextColor(109, 168, 214);
    $_pdf->Cell(1.3, 0.6, utf8_decode("TIPO:"), 0, 0, 'L', false);
    $_pdf->SetTextColor(120, 120, 120);
    $_pdf->Cell(4.8, 0.6, utf8_decode($_tipo), 0, 1, 'L', false);
    $_pdf->SetTextColor(109, 168, 214);
    $_pdf->Cell(1.8, 0.6, utf8_decode("FILTRO:"), 0, 0, 'L', false);
    $_pdf->SetTextColor(120, 120, 120);
    $_pdf->Cell(4.8, 0.6, utf8_decode($_filtroTipo), 0, 1, 'L', false);
    $_pdf->Ln(0.2);
    $_pdf->Cell($_height, 0.05, '', 0, 1, 'C', true);
    $_pdf->Ln(0.2);
}

function gerarTabela($_pdf, $_height, $_tipo, $_linhaOne, $_tabela, $_IDuser)
{
    $_pdf->Ln(0.5);
    $_pdf->SetFont('helvetica', 'B', 12);
    $_pdf->SetTextColor(74, 74, 74);

    for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
        if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 1, 'C', false);
            $_pdf->Cell($_height, 0.05, '', 0, 1, 'C', true);
        } else {
            $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, $_linhaOne[$_tipo][$_i][1], 0, 0, 'C', false);
        }
    }

    $_pdf->SetFont('helvetica', '', 11);
    $_pdf->SetFillColor(230, 230, 230);
    $_fundo = 1;
    //Conexão com o banco
    include_once("bd/conexao.php");
    $_sql = $_pdo->prepare("SELECT * FROM $_tabela WHERE id_user=$_IDuser");
    $_sql->execute();
    $_resultset = $_sql->fetchAll(PDO::FETCH_ASSOC);


    foreach ($_resultset as $_line) {
        for ($_i = 0; $_i < count($_linhaOne[$_tipo]); $_i++) {
            if ((count($_linhaOne[$_tipo]) - 1) == $_i) {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, utf8_decode($_line[$_linhaOne[$_tipo][$_i][0]]), 0, 1, 'C', true);
            } else {
                $_pdf->Cell($_linhaOne[$_tipo][$_i][2], 1, utf8_decode($_line[$_linhaOne[$_tipo][$_i][0]]), 0, 0, 'C', true);
            }
        }
        $_fundo++;
        if (($_fundo % 2) == 0) {
            $_pdf->SetFillColor(255, 255, 255);
        } else {
            $_pdf->SetFillColor(230, 230, 230);
        }
    }
}
