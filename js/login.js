$(function () {
    let contador = 0;
    $(".link").click(function () {
        removerClasses("#id-user", "#ajuda-user");
        removerClasses("#id-mail", "#ajuda-mail");
        removerClasses("#id-senha", "#ajuda-senha");
        removerClasses("#id-senha-verificada", "#ajuda-senha-verificada");

        if (contador == 0) {
            $("#login").trigger("reset");
            $("#fundo").css('height', '27rem');
            $("#registrar").css('transform', 'translateX(22rem)');
            $("#login").css('transform', 'translateX(22rem)');
            contador++;
        } else {
            $("#registrar").trigger("reset");
            $("#fundo").css('height', '17rem');
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


    $("#id-registro").click(function (event) {
        event.preventDefault();
        verificandoUsuario();
        verificandoEmail();
        verificandoSenha();
        verificandoVerificarSenha();
        user = $("#registrar #id-user").val();
        mail = $("#registrar #id-mail").val();
        senha_verificada = $("#id-senha-verificada").val();
        senha = $('#registrar #id-senha').val();

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

    $("#id-entrar").click(function (event) {
        event.preventDefault();
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
                } else {
                    alert(response);
                }
            }
        });

    });


    //////////////////////////////////////// Funções basicas //////////////////////////////////////////
    function removerClasses(identificadorID, identificadorAjuda) {
        $("#registrar " + identificadorID).removeClass("form-erro");
        $("#registrar " + identificadorID).removeClass("form-sucesso");
        $("#registrar " + identificadorAjuda).removeClass("ajuda-erro");
    }

    function adicionarErro(identificadorID, identificadorAjuda, texto) {
        $("#registrar " + identificadorID).addClass("form-erro");
        $("#registrar " + identificadorAjuda).text(texto);
        $("#registrar " + identificadorAjuda).addClass("ajuda-erro");
    }

    function campoCorreto(identificadorID, identificadorAjuda) {
        $("#registrar " + identificadorID).addClass("form-sucesso");
        $("#registrar " + identificadorAjuda).removeClass("ajuda-erro");
        $("#registrar " + identificadorAjuda).text("");
    }

    ///////////////////////////////////////////// Validando Usuario /////////////////////////////////////////////////////
    function verificandoUsuario() {
        removerClasses("#id-user", "#ajuda-user");
        user = $('#registrar #id-user').val();
        if (user == '') {
            removerClasses("#id-user", "#ajuda-user");
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
                    adicionarErro("#id-user", "#ajuda-user", "Usuário já cadastrado");
                    verificação[0] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#id-user", "#ajuda-user");
                    verificação[0] = true;
                }
            }
        });
    }

    ///////////////////////////////////////////// Validando Email /////////////////////////////////////////////////////
    function verificandoEmail() {
        removerClasses("#id-mail", "#ajuda-mail");
        mail = $('#registrar #id-mail').val();
        if (mail == '') {
            removerClasses("#id-mail", "#ajuda-mail");
            verificação[1] = false;
            return;
        } else if (mail.indexOf("@") <= 0 || mail.indexOf(".") == -1) {
            adicionarErro("#id-mail", "#ajuda-mail", "Email inválido");
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
                    adicionarErro("#id-mail", "#ajuda-mail", "Email já cadastrado");
                    verificação[1] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#id-mail", "#ajuda-mail");
                    verificação[1] = true;
                }
            }
        });
    }

    ///////////////////////////////////////////// Validando Senha /////////////////////////////////////////////////////
    function verificandoSenha() {
        removerClasses("#id-senha", "#ajuda-senha");
        verificação[2] = false;
        senha = $('#registrar #id-senha').val();
        if (senha == '') {
            removerClasses("#id-senha", "#ajuda-senha");
            return;
        } else if (senha.length < 8) {
            adicionarErro("#id-senha", "#ajuda-senha", "Utilize no minimo 8 caracteres");
            return;
        } else {
            campoCorreto("#id-senha", "#ajuda-senha");
            verificação[2] = true;
        }
    }

    ///////////////////////////////////////////// Validando Verificar Senha /////////////////////////////////////////////////////
    function verificandoVerificarSenha() {
        removerClasses("#id-senha-verificada", "#ajuda-senha-verificada");
        verificação[3] = false;
        senha_verificada = $('#registrar #id-senha-verificada').val();
        senha = $('#registrar #id-senha').val();
        if (senha_verificada == '') {
            removerClasses("#id-senha-verificada", "#ajuda-senha-verificada");
            return;
        } else if (senha != senha_verificada) {
            adicionarErro("#id-senha-verificada", "#ajuda-senha-verificada", "Senhas não correspondem");
            return;
        } else {
            campoCorreto("#id-senha-verificada", "#ajuda-senha-verificada");
            verificação[3] = true;
        }
    }
});