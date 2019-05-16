<?php
    $db = mysqli_connect('localhost', 'root', '', 'jbanco');

    if(isset($_POST['verifica_tel_no_banco'])) {
        $tel1 = $_POST['tel1'];
        $sql = "SELECT nome, endereco, telefone2 FROM cliente WHERE telefone1='$tel1'";
        $results = mysqli_query($db, $sql);

        if(mysqli_num_rows($results) > 0){
            $results = mysqli_fetch_array($results, MYSQLI_NUM);
            $dados = [$results[0], $results[1], $results[2]];
            echo json_encode($dados);
        } else {
            echo "";
        }
        exit();
    }

    if(isset($_POST['aplica-update-no-cliente'])) {
        $tel1 = $_POST['tel1'];
        $nome = $_POST['nome'];
        $endereco = $_POST['endereco'];
        $tel2 = $_POST['tel2'];

        $sql = "UPDATE cliente SET nome = '$nome', endereco = '$endereco', telefone2 = '$tel2' WHERE telefone1='$tel1'";
        mysqli_query($db, $sql);
        exit();
    }

    if(isset($_POST['cadastra-novo-cliente'])) {
        $tel1 = $_POST['tel1'];
        $nome = $_POST['nome'];
        $endereco = $_POST['endereco'];
        $tel2 = $_POST['tel2'];

        $sql = "INSERT INTO cliente (nome, endereco, telefone1, telefone2) 
                    VALUES ('$nome', '$endereco', '$tel1', '$tel2')";
        mysqli_query($db, $sql);
        exit();
    }

    if(isset($_POST['cadastra-nova-tarefa'])) {
        $tel1 = $_POST['tel1'];
        $nome = $_POST['nome'];
        $endereco = $_POST['endereco'];
        $tel2 = $_POST['tel2'];
        $data =  $_POST['data'];
        $periodo = $_POST['periodo'];
        $problema = $_POST['problema'];
        $infoAdicional = $_POST['infoAdicional'];

        $sql = "INSERT INTO tarefas (telefone1, nome, endereco, telefone2, dia, periodo, problema, informacoes) 
                    VALUES ('$tel1', '$nome', '$endereco', '$tel2', str_to_date('$data', '%d/%m/%Y %h:%i'), '$periodo', '$problema', '$infoAdicional')";
        mysqli_query($db, $sql);
        exit();
    }
?>