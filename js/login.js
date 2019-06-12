$(function () {
    let contador = 0;
    $(".link").click(function () {
        removerClasses("#registrar", "#id-user", "#ajuda-user");
        removerClasses("#registrar", "#id-mail", "#ajuda-mail");
        removerClasses("#registrar", "#id-senha", "#ajuda-senha");
        removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");

        if (contador == 0) {
            $("#login").trigger("reset");
            $("#fundo").css('height', '27rem');
            $("#registrar").css('transform', 'translateX(22rem)');
            $("#login").css('transform', 'translateX(22rem)');
            contador++;
        } else {
            $("#registrar").trigger("reset");
            $("#fundo").css('height', '18rem');
            $("#registrar").css('transform', 'translateX(0)');
            $("#login").css('transform', 'translateX(0)');
            contador--;
        }
    });

    let user;
    let mail;
    let senha;
    let senha_verificada;
    let verificação = [false, false, false, false];

    ////////////////////////////////////// Usuario /////////////////////////////////////////////////////////
    $("#registrar #id-user").keyup($.debounce(250, function () {
        verificandoUsuario();
    }));

    ////////////////////////////////////// Email /////////////////////////////////////////////////////////
    $("#registrar #id-mail").keyup($.debounce(250, function () {
        verificandoEmail();
    }));

    ////////////////////////////////////// Senha /////////////////////////////////////////////////////////
    $("#registrar #id-senha").keyup($.debounce(250, function () {
        verificandoSenha();
    }));

    ////////////////////////////////////// Verficar Senha /////////////////////////////////////////////////////////
    $("#registrar #id-senha-verificada, #registrar #id-senha").keyup($.debounce(250, function () {
        verificandoVerificarSenha();
    }));

    ////////////////////////////////////// Botão registrar usuario /////////////////////////////////////////////////////////
    $("#id-registro").click(function (event) {
        event.preventDefault();
        verificandoUsuario();
        verificandoEmail();
        verificandoSenha();
        verificandoVerificarSenha();
        user = $("#registrar #id-user").val();
        mail = $("#registrar #id-mail").val();
        senha = $('#registrar #id-senha').val();
        senha_verificada = $("#id-senha-verificada").val();

        erroCampoVazio("#registrar", "#id-user", "#ajuda-user", user, 0, "Usuário não pode estar vazio");
        erroCampoVazio("#registrar", "#id-mail", "#ajuda-mail", mail, 1, "Email não pode estar vazio");
        erroCampoVazio("#registrar", "#id-senha", "#ajuda-senha", senha, 2, "Senha não pode estar vazio");
        erroCampoVazio("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada", senha_verificada, 3, "Verificar senha não pode estar vazio");

        for (let i = 0; i <= 4; i++) {
            if (verificação[i] == false) {
                return;
            }
        }


        $.ajax({
            url: '../php/lib/cadastrar-user.php',
            type: 'POST',
            data: {
                'save': 1,
                'mail': mail,
                'user': user,
                'senha': senha_verificada,
            },
            success: function (response) {
                if (response == "sucesso") {
                    $("#registrar").submit();
                } else {
                    alert(response);
                }

            }
        });

    });

    ////////////////////////////////////// Botão Login /////////////////////////////////////////////////////////
    $("#id-entrar").click(function (event) {
        event.preventDefault();
        removerClasses("#login", "#id-login-user", "#ajuda-login-user");
        removerClasses("#login", "#id-login-senha", "#ajuda-login-senha");
        user = $("#login #id-login-user").val();
        senha = $("#login #id-login-senha").val();
        $.ajax({
            url: '../php/lib/autenticar-login.php',
            type: 'POST',
            data: {
                'save': 1,
                'user': user,
                'senha': senha,
            },
            success: function (response) {
                if (response == "sucesso") {
                    $("#login").submit();
                } else if (response == "Senha incorreta") {
                    adicionarErro("#login", "#id-login-senha", "#ajuda-login-senha", response);
                } else if (response == "Usuario não cadastrado") {
                    adicionarErro("#login", "#id-login-user", "#ajuda-login-user", response);
                } else {
                    alert("Error");
                }
            }
        });

    });

    $("#login #id-login-senha, #login #id-login-user").click(function () {
        removerClasses("#login", "#id-login-user", "#ajuda-login-user");
        removerClasses("#login", "#id-login-senha", "#ajuda-login-senha");
    });


    //////////////////////////////////////// Funções basicas //////////////////////////////////////////
    function removerClasses(fonte, identificadorID, identificadorAjuda) {
        $(fonte + " " + identificadorID).removeClass("form-erro");
        $(fonte + " " + identificadorID).removeClass("form-sucesso");
        $(fonte + " " + identificadorAjuda).removeClass("ajuda-erro");
    }

    function adicionarErro(fonte, identificadorID, identificadorAjuda, texto) {
        $(fonte + " " + identificadorID).addClass("form-erro");
        $(fonte + " " + identificadorAjuda).text(texto);
        $(fonte + " " + identificadorAjuda).addClass("ajuda-erro");
    }

    function campoCorreto(fonte, identificadorID, identificadorAjuda) {
        $(fonte + " " + identificadorID).addClass("form-sucesso");
        $(fonte + " " + identificadorAjuda).removeClass("ajuda-erro");
        $(fonte + " " + identificadorAjuda).text("");
    }

    function erroCampoVazio(fonte, identificadorID, identificadorAjuda, campo, numEquivalente, texto) {
        if (campo == '') {
            removerClasses(fonte, identificadorID, identificadorAjuda);
            verificação[numEquivalente] = false;
            adicionarErro(fonte, identificadorID, identificadorAjuda, texto);
        }
    }

    ///////////////////////////////////////////// Validando Usuario /////////////////////////////////////////////////////
    function verificandoUsuario() {
        removerClasses("#registrar", "#id-user", "#ajuda-user");
        user = $('#registrar #id-user').val();
        if (user == '') {
            removerClasses("#registrar", "#id-user", "#ajuda-user");
            verificação[0] = false;
            return;
        }

        $.ajax({
            url: '../php/login.php',
            type: 'POST',
            data: {
                'user_check': 1,
                'user': user,
            },
            success: function (response) {
                if (response == 'taken') {
                    adicionarErro("#registrar", "#id-user", "#ajuda-user", "Usuário já cadastrado");
                    verificação[0] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#registrar", "#id-user", "#ajuda-user");
                    verificação[0] = true;
                }
            }
        });
    }

    ///////////////////////////////////////////// Validando Email /////////////////////////////////////////////////////
    function verificandoEmail() {
        removerClasses("#registrar", "#id-mail", "#ajuda-mail");
        mail = $('#registrar #id-mail').val();
        if (mail == '') {
            removerClasses("#registrar", "#id-mail", "#ajuda-mail");
            verificação[1] = false;
            return;
        } else if (mail.indexOf("@") <= 0 || mail.indexOf(".") == -1) {
            adicionarErro("#registrar", "#id-mail", "#ajuda-mail", "Email inválido");
            verificação[1] = false;
            return;
        }
        $.ajax({
            url: '../php/login.php',
            type: 'POST',
            data: {
                'mail_check': 1,
                'mail': mail,
            },
            success: function (response) {

                if (response == 'taken') {
                    adicionarErro("#registrar", "#id-mail", "#ajuda-mail", "Email já cadastrado");
                    verificação[1] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#registrar", "#id-mail", "#ajuda-mail");
                    verificação[1] = true;
                }
            }
        });
    }

    ///////////////////////////////////////////// Validando Senha /////////////////////////////////////////////////////
    function verificandoSenha() {
        removerClasses("#registrar", "#id-senha", "#ajuda-senha");
        verificação[2] = false;
        senha = $('#registrar #id-senha').val();
        if (senha == '') {
            removerClasses("#registrar", "#id-senha", "#ajuda-senha");
            return;
        } else if (senha.length < 5) {
            adicionarErro("#registrar", "#id-senha", "#ajuda-senha", "Utilize no minimo 5 caracteres");
            return;
        } else {
            campoCorreto("#registrar", "#id-senha", "#ajuda-senha");
            verificação[2] = true;
        }
    }

    ///////////////////////////////////////////// Validando Verificar Senha /////////////////////////////////////////////////////
    function verificandoVerificarSenha() {
        removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
        verificação[3] = false;
        senha_verificada = $('#registrar #id-senha-verificada').val();
        senha = $('#registrar #id-senha').val();
        if (senha_verificada == '') {
            removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
            return;
        } else if (senha != senha_verificada) {
            adicionarErro("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada", "Senhas não correspondem");
            return;
        } else {
            campoCorreto("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
            verificação[3] = true;
        }
    }
});