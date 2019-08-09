<?php
include_once("conexao.php");
if (isset($_POST['save'])) {
    $_user = $_POST['user'];
    $_senha = md5($_POST['senha']);

    $_usuarioValido = "SELECT * FROM usuarios WHERE usuario = '$_user'";
    $_rowsUser = mysqli_num_rows(mysqli_query($_conexao, $_usuarioValido));

    $_sql = "SELECT * FROM usuarios WHERE usuario = '$_user' AND senha = '$_senha'";
    $_query = mysqli_query($_conexao, $_sql);
    $_rows = mysqli_num_rows($_query);

    mysqli_close($_conexao);

    if ($_rows > 0) {
        echo 'sucesso';
    } else if ($_rowsUser > 0) {
        echo 'Usuario ou senha incorreta';
    } else {
        echo 'Usuario incorreto';
    }
}
