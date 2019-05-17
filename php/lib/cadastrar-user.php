<?php
include_once("conexao.php");

if (isset($_POST['user_check'])) {
  $_usuario = $_POST['user'];
  $_sql = "SELECT * FROM usuarios WHERE usuario ='$_usuario'";
  $_query = mysqli_query($_conexao, $_sql);
  $_rows = mysqli_num_rows($_query);
  if ($_rows > 0) {
    echo 'taken';
  } else {
    echo 'not_taken';
  }
  exit();
}

if (isset($_POST['mail_check'])) {
  $_mail = $_POST['mail'];
  $_sql = "SELECT * FROM usuarios WHERE email ='$_mail'";
  $_query = mysqli_query($_conexao, $_sql);
  $_rows = mysqli_num_rows($_query);
  if ($_rows > 0) {
    echo 'taken';
  } else {
    echo 'not_taken';
  }
  exit();
}

if (isset($_POST['save'])) {
  $_user = $_POST['user'];
  $_mail = $_POST['mail'];
  $_senha = md5($_POST['senha']);

  //verifica se o usuario esta disponivel
  $_sql = "SELECT * FROM usuarios WHERE usuario = '$_user'";
  $_query = mysqli_query($_conexao, $_sql);
  if (mysqli_num_rows($_query) > 0) {
    echo ("Nome de usuario não está disponível");
    exit();
  }

  //Verifica se o email é valido
  if (strpos($_mail, '@') == NULL) {
    echo ("Email inválido");
    exit();
  }

  //verifica se o email esta disponivel
  $_sql = "SELECT * FROM usuarios WHERE email = '$_mail'";
  $_query = mysqli_query($_conexao, $_sql);
  if (mysqli_num_rows($_query) > 0) {
    echo ("Email ja está sendo utilizado");
    exit();
  }

  $_sql = "INSERT INTO usuarios(usuario, email, senha) VALUES ('$_user', '$_mail', '$_senha')";
  mysqli_query($_conexao, $_sql);
  echo ("sucesso");
  exit();
}
