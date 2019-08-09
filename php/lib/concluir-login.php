<?php
include_once("conexao.php");

$_usuario = $_POST['nome'];
$_senha = md5($_POST['senha']);

$_sql = "SELECT id_user FROM usuarios WHERE usuario = '$_usuario' and senha = '$_senha'";
$_query = mysqli_query($_conexao, $_sql);
$_id = mysqli_fetch_array($_query);
$_rows = mysqli_num_rows($_query);

mysqli_close($_conexao);


if ($_rows > 0) {
    session_start();
    $_SESSION['nome'] = $_usuario;
    $_SESSION['id'] = $_id[0];
    header("location:../j-notes.php");
} else {
    header("location:../login.php");
}
