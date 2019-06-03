<?php
include_once('./lib/process-j-notes.php');

$user = $_SESSION['nome'];
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>J-Notes</title>
    <link rel="icon" href="../img/agenda.png">
    <link rel="stylesheet" type="text/css" href="../css/style-j-notes.css" />
    <script type="text/javascript" src="../js/lib/jquery-3.4.0.min.js"></script>
    <script type="text/javascript" src="../js/lib/jquery.mask.min.js"></script>
    <script type="text/javascript" src="../js/lib/jquery.ba-throttle-debounce.min.js"></script>

    <script type="text/javascript" src="../js/class/Secundario.js"></script>
    <script type="text/javascript" src="../js/class/Main.js"></script>
    <script type="text/javascript" src="../js/class/Menu.js"></script>
    <script type="text/javascript" src="../js/class/Ajuda.js"></script>
    <script type="text/javascript" src="../js/class/ScrollSpy.js"></script>
    <script type="text/javascript" src="../js/class/Notificacoes.js"></script>
    <script type="text/javascript" src="../js/class/Calendario.js"></script>
    <script type="text/javascript" src="../js/class/PainelCalendario.js"></script>
    <script type="text/javascript" src="../js/class/Concluir.js"></script>
    <script type="text/javascript" src="../js/j-notes.js"></script>
</head>

<body>
    <nav id="menu-fixo" class="menu-fixo">
        <ul>
            <li class="click-scrollspy">
                <a class="btn-menu">
                    <img src="../img/svg/menu.svg" alt="icone menu">
                    <span>Menu</span>
                </a>
            </li>
            <li class="click-scrollspy">
                <a class="active" href="#inicio">
                    <img src="../img/svg/home.svg" alt="icone casa">
                </a>
            </li>
            <li class="click-scrollspy">
                <a href="#nova-tarefa">
                    <img src="../img/svg/plus.svg" alt="icone nova tarefa">
                </a>
            </li>
            <li class="click-scrollspy">
                <a href="#calendario">
                    <img src="../img/svg/calendar.svg" alt="icone calendario">
                </a>
            </li>
            <li class="click-scrollspy">
                <a href="#concluir-tarefa">
                    <img src="../img/svg/check.svg" alt="icone concluir-tarefa">
                </a>
            </li>
            <li class="final">
                <a>
                    <img src="../img/svg/user.svg" alt="icone usuário">
                    <span><?php echo $user; ?></span>
                </a>
            </li>
            <li class="final">
                <a href="./lib/logout.php">
                    <img src="../img/svg/exit.svg" alt=" icone sair">
                    <span>Sair</span>
                </a>
            </li>
        </ul>
    </nav>
    <div class="div-menu-movel">
        <nav id="menu-movel">
            <ul>
                <li class="click-scrollspy">
                    <a class="btn-menu"><span>Menu</span></a>
                </li>
                <li class="click-scrollspy">
                    <a id="link-inicio" href="#inicio"><span>Página Inicial</span></a>
                </li>
                <li class="click-scrollspy">
                    <a id="link-nova" href="#nova-tarefa"><span>Nova Tarefa</span></a>
                </li>
                <li class="click-scrollspy">
                    <a id="link-calendario" href="#calendario"><span>Calendário</span></a>
                </li>
                <li class="click-scrollspy">
                    <a id="link-concluir" href="#concluir-tarefa"><span>Concluir Tarefa</span></a>
                </li>
                <li class="final">
                    <a><span><?php echo $user; ?></span></a>
                </li>
                <li class="final">
                    <a href="./lib/logout.php"><span>Sair</span></a>
                </li>
            </ul>
        </nav>
    </div>
    <main>
        <section id="inicio" class="claro section-principal">
            <div>
                <header>
                    <h1>Página Inicial</h1>
                    <span class="ajuda inicio">?</span>
                </header>
                <div class="wrapper-section">
                    <div class="box-inicio">
                        <span class="tira"></span>
                        <span class="tira"></span>
                        <span class="bolinha"></span>
                        <span class="bolinha"></span>
                        <header>
                            <h2>Notificações</h2>
                        </header>
                        <div>
                            <div class="notificacao-item tarefa">

                            </div>
                            <div class="notificacao-item concluir">

                            </div>
                        </div>
                    </div>
                </div>
        </section>

        <section id="nova-tarefa" class="escuro section-principal">
            <div>
                <header>
                    <h1>Nova Tarefa</h1>
                    <span class="ajuda nova-tarefa">?</span>
                </header>
                <div class="wrapper-section">
                    <form id="box-nova-tarefa" class="box-nova-tarefa">
                        <div class="box-argolas">
                            <script>
                                for (let i = 0; i < 15; i++) {
                                    $(".box-argolas").append('<span></span>');
                                }
                            </script>
                        </div>
                        <label id="l-tel1">
                            <span class="required">Telefone 1:</span>
                            <input class="telefone" id="tel1" name="tel1" type="text" placeholder="Ex: (99) 99999-9999" autocomplete="off">
                        </label>
                        <label id="l-nome">
                            <span class="required">Nome:</span>
                            <input id="nome" name="nome" type="text" placeholder="Ex: João" autocomplete="off">
                        </label>
                        <label id="l-tel2">
                            <span>Telefone 2:</span>
                            <input class="telefone" id="tel2" name="tel2" type="text" placeholder="Ex: (99) 99999-9999" autocomplete="off">
                        </label>
                        <label id="l-endereco">
                            <span class="required">Endereço:</span>
                            <textarea name="endereco" id="endereco" placeholder="Ex: Rua Maio, 58, Jd. das Rosas, Americana"></textarea>
                        </label>
                        <label id="l-data">
                            <span class="required">Data:</span>
                            <input class="data" id="data" name="data" type="text" placeholder="Ex: dd/mm/aa" autocomplete="off">
                            <img id="desce-para-calendario" src="../img/svg/down.svg">
                        </label>
                        <div id="wrapper-radio" class="wrapper-radio">
                            <label id="l-radio1" class="box-radio">
                                <input name="periodo" type="radio" value="M" checked>
                                <span class="radio-novo"></span>
                                <span class="radio-texto">Manhã</span>
                            </label>
                            <label id="l-radio2" class="box-radio">
                                <input name="periodo" type="radio" value="T">
                                <span class="radio-novo"></span>
                                <span class="radio-texto">Tarde</span>
                            </label>
                            <label id="l-radio3" class="box-radio">
                                <input name="periodo" type="radio" value="N">
                                <span class="radio-novo"></span>
                                <span class="radio-texto">Noite</span>
                            </label>
                        </div>
                        <label id="l-problema">
                            <span>Problema Encontrado:</span>
                            <textarea class="textarea--grande" name="problema" id="problema" placeholder="Ex: Problema na placa"></textarea>
                        </label>
                        <label id="l-info-adicional">
                            <span>Informações Adicionais:</span>
                            <textarea class="textarea--grande" name="info" id="info" placeholder="Ex: Ir depois das 16hrs"></textarea>
                        </label>
                        <div id="wrapper-botao">
                            <input class="botao" value="Cancelar" name="botao-cancelar" id="botao-cancelar" type="button">
                            <input class="botao" value="Concluir" name="botao-concluir" id="botao-concluir" type="button">
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <section id="calendario" class="claro section-principal">
            <div>
                <header>
                    <h1>Calendário</h1>
                    <span class="ajuda calendario">?</span>
                </header>
                <div class="wrapper-section">
                    <table class="box-calendario">
                        <thead>
                            <td>Dom<span class="argola"></span></td>
                            <td>Seg</td>
                            <td>Ter</td>
                            <td>Qua</td>
                            <td>Qui</td>
                            <td>Sex</td>
                            <td>Sab<span class="argola"></span></td>
                        </thead>
                        <tbody id="corpo-calendario">
                            <!-- Código gerado via javaScript -->
                        </tbody>
                    </table>
                    <div class="box-painel-calendario">
                        <header>
                            <span class="argola"></span>
                            <span class="argola"></span>
                            <div class="wrapper-mes">
                                <img id="volta-mes" src="../img/svg/previous.svg">
                                <span id="mes"></span>
                                <img id="avanca-mes" src="../img/svg/next.svg">
                            </div>
                            <div class="wrapper-ano">
                                <span id="ano"></span>
                                <img id="mostra-lista-ano" src="../img/svg/down.svg">
                                <div class="wrapper-lista-anos">
                                    <div class="box-lista-anos">
                                        <!-- Código gerado via javaScript -->
                                    </div>
                                </div>
                            </div>
                        </header>
                        <div>
                            <div id="box-painel-eventos" class="box-painel-eventos">
                                <div class="box-nova-data"><img src="../img/svg/plus.svg"><span>Nova Tarefa</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="concluir-tarefa" class="escuro section-principal">
            <div>
                <header>
                    <h1>Concluir Tarefa</h1>
                    <span href="#concluir-tarefa" class="ajuda concluir-tarefa">?</span>
                </header>
                <div class="wrapper-section">
                    <div class="box-bolinhas">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="box-concluir-tarefa">
                        <div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <section class="overlay-ajuda">
        <div></div>
    </section>
</body>

</html>