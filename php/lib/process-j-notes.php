<?php
    $db = mysqli_connect('localhost', 'root', '', 'jbanco');

    $endereco_banco = "";
    $nome_banco = "";
    $tel2_banco = "";

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
?>