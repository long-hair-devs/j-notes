<?php include('lib/cadastrar-user.php');?>
<html>

<head>
    <meta charset="utf-8">
    <title>Login</title>
    <link rel="icon" href="../img/agenda.png">
    <link type="text/css" rel="stylesheet" href="../css/style-login.css">
    <script type="text/javascript" src="../js/lib/jquery-3.4.0.min.js"></script>
    <script type="text/javascript" src="../js/lib/jquery.ba-throttle-debounce.min.js"></script>
    <script type="text/javascript" src="../js/login.js"></script>
</head>

<body>
    <div class="fundo">
        <div id="interno" class="interno">
            <form id="login" class="box login" method="post" action="./lib/autenticar-login.php">
                <span class="texto">Nome de Usuário ou E-mail</span>
                <input name="nome" type="text" class="textoinput" autocomplete="off">

                <span class="texto">Senha</span>
                <input name="senha" type="password" class="textoinput" autocomplete="off">

                <span class="flex-box-salvar">
                    <label><input type="checkbox" name="salvar" value="salvar" class="save">
                        <span class="texto">Lembrar-me</span></label>
                </span>

                <span class="flex-box-botoes">
                    <a href="#" class="texto link">Registrar</a>
                    <input name="entrar" type="submit" class="botao" value="entrar">
                </span>
            </form>
            <form id="registrar" class="box registrar" method="post" action="./lib/autenticar-login.php">
            
                <span class="texto" id="id-texto-user">Nome de Usuário</span>
                <input name="nome" type="text" class="textoinput" id="id-user" required autocomplete="off">

                <span class="texto" id="id-texto-mail">E-Mail</span>
                <input name="mail" type="email" class="textoinput" id="id-mail" required autocomplete="off">

                <span class="texto">Senha</span>
                <input name="senha" type="password" class="textoinput" id="id-senha" required autocomplete="off">

                <span class="texto">Verificar Senha</span>
                <input name="senha-verificada" type="password" class="textoinput" id="id-senha-verificada" required autocomplete="off">

                <span class="flex-box-botoes ">
                    <a href="#" class="texto link">Voltar</a>
                    <input name="registro" type="submit" class="botao" value="registrar" id="id-registro">
                </span>
            </form>
        </div>
    </div>
    <a href="../index.php" class="xis">X</a>
    <span class="xis bolinha"></span>
    <span class="xis bolinha"></span>
</body>
</html>