<?php
include_once("conexao.php");
if (isset($_POST['save'])) {
    $_user = $_POST['user'];
    $_senha = md5($_POST['senha']);

    $_sql = "SELECT id_user FROM usuarios WHERE usuario = '$_user' and senha = '$_senha'";
    $_query = mysqli_query($_conexao, $_sql);
    $_rows = mysqli_num_rows($_query);

    mysqli_close($_conexao);

    if ($_rows > 0) {
        echo 'sucesso';
    } else {
        echo 'Usuario não cadastrado';
    }
}
