<?php
include_once('conexao.php');

session_start();

if (!isset($_SESSION['id'])) {
    header("location: ../index.php");
    exit();
}
$user_id = $_SESSION['id'];

if (isset($_POST['verifica_tel_no_banco'])) {
    $tel1 = $_POST['tel1'];
    $sql = "SELECT nome, endereco, telefone2 FROM cliente WHERE telefone1='$tel1' AND id_user='$user_id'";
    $results = mysqli_query($_conexao, $sql) or die($_conexao->error);

    if (mysqli_num_rows($results) > 0) {
        $results = mysqli_fetch_array($results, MYSQLI_NUM);
        echo json_encode($results);
    } else {
        echo "";
    }
    exit();
}

if (isset($_POST['aplica-update-no-cliente'])) {
    $tel1 = $_POST['tel1'];
    $nome = $_POST['nome'];
    $endereco = $_POST['endereco'];
    $tel2 = $_POST['tel2'];

    $sql = "UPDATE cliente SET nome = '$nome', endereco = '$endereco', telefone2 = '$tel2' WHERE telefone1='$tel1' AND id_user='$user_id'";
    mysqli_query($_conexao, $sql) or die($_conexao->error);
    exit();
}

if (isset($_POST['cadastra-novo-cliente'])) {
    $tel1 = $_POST['tel1'];
    $nome = $_POST['nome'];
    $endereco = $_POST['endereco'];
    $tel2 = $_POST['tel2'];

    $sql = "INSERT INTO cliente (id_user, nome, endereco, telefone1, telefone2) 
                    VALUES ('$user_id', '$nome', '$endereco', '$tel1', '$tel2')";
    mysqli_query($_conexao, $sql) or die($_conexao->error);
    exit();
}

if (isset($_POST['cadastra-nova-tarefa'])) {
    $tel1 = $_POST['tel1'];
    $nome = $_POST['nome'];
    $endereco = $_POST['endereco'];
    $tel2 = $_POST['tel2'];
    $data =  $_POST['data'];
    $periodo = $_POST['periodo'];
    $problema = $_POST['problema'];
    $infoAdicional = $_POST['infoAdicional'];

    $sql = "INSERT INTO tarefas (telefone1, id_user, nome, endereco, telefone2, dia, periodo, problema, informacoes) 
                    VALUES ('$tel1', '$user_id', '$nome', '$endereco', '$tel2', str_to_date('$data', '%d/%m/%Y'), '$periodo', '$problema', '$infoAdicional')";
    mysqli_query($_conexao, $sql) or die($_conexao->error);
    exit();
}

if (isset($_POST['pega-eventos-mes'])) {
    $mes = $_POST['mes'] + 1;
    $ano = $_POST['ano'];

    $sql = "SELECT id_tarefa, dia, periodo, problema, informacoes, nome, telefone1, telefone2, endereco, total_recebido, total_gasto, observacoes_servico 
                    FROM tarefas WHERE MONTH(dia) = '$mes' AND YEAR(dia) = '$ano' AND id_user ='$user_id'";
    $results = mysqli_query($_conexao, $sql) or die($_conexao->error);

    if (mysqli_num_rows($results) > 0) {
        $results = mysqli_fetch_all($results, MYSQLI_NUM);
        echo json_encode($results);
    } else {
        echo 0;
    }
    exit();
}

if (isset($_POST['atualiza-tarefa'])) {
    $id = $_POST['id'];
    $tel1 = $_POST['tel1'];
    $nome = $_POST['nome'];
    $endereco = $_POST['endereco'];
    $tel2 = $_POST['tel2'];
    $data =  $_POST['data'];
    $periodo = $_POST['periodo'];
    $problema = $_POST['problema'];
    $infoAdicional = $_POST['infoAdicional'];

    $sql = "UPDATE tarefas SET nome='$nome', endereco='$endereco', telefone2='$tel2', dia=str_to_date('$data', '%d/%m/%Y'), periodo='$periodo', problema='$problema', informacoes='$infoAdicional'
                WHERE id_tarefa='$id' AND id_user ='$user_id'";
    mysqli_query($_conexao, $sql) or die($_conexao->error);
    exit();
}

if (isset($_POST['deleta-tarefa'])) {
    $id = $_POST['id'];

    if (is_numeric($id)) {
        $sql = "SELECT * FROM tarefas WHERE id_tarefa='$id' AND id_user='$user_id'";
        $results = mysqli_query($_conexao, $sql) or die($_conexao->error);

        if (mysqli_num_rows($results) > 0) {
            $sql = "DELETE FROM tarefas WHERE id_tarefa='$id'";
            mysqli_query($_conexao, $sql) or die($_conexao->error);
            echo 1;
        }
    }
    exit();
}

if (isset($_POST['pega-nao-concluidas'])) {
    $hoje = $_POST['hoje'];

    $sql = "SELECT id_tarefa, dia, periodo, problema, informacoes, nome, telefone1, telefone2, endereco
                    FROM tarefas WHERE DATE(dia) < '$hoje' AND id_user ='$user_id' AND total_recebido IS NULL";
    $results = mysqli_query($_conexao, $sql) or die($_conexao->error);

    if (mysqli_num_rows($results) > 0) {
        $results = mysqli_fetch_all($results, MYSQLI_NUM);
        echo json_encode($results);
    } else {
        echo 0;
    }
    exit();
}

if (isset($_POST['concluir-tarefa'])) {
    $id = $_POST['id'];
    $total = $_POST['tRecebido'];
    $totalGasto = $_POST['tGasto'];
    $obs = $_POST['obs'];

    if (is_numeric($id)) {
        $sql = "UPDATE tarefas SET total_recebido=CAST($total as DECIMAL(8,2)), total_gasto=CAST($totalGasto as DECIMAL(8,2)), observacoes_servico='$obs'
                WHERE id_tarefa='$id' AND id_user='$user_id'";
        mysqli_query($_conexao, $sql) or die($_conexao->error);
        echo 1;
    }
    exit();
}
