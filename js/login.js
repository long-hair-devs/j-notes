$(function () {
    calcTamanhoFonte();
    if (getCookie("jNotesUser") != "") {
        $("#login #id-login-user").val(getCookie("jNotesUser"));
        $("#login #lembrar").attr('checked', true)
    } else {
        $("#login #id-login-user").val(getCookie(""));
    }
    let contador = 0;
    $(".link").click(function () {
        removerClasses("#registrar", "#id-user", "#ajuda-user");
        removerClasses("#registrar", "#id-mail", "#ajuda-mail");
        removerClasses("#registrar", "#id-senha", "#ajuda-senha");
        removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
        removerClasses("#login", "#id-login-user", "#ajuda-login-user");
        removerClasses("#login", "#id-login-senha", "#ajuda-login-senha");
        $("#fundo, #registrar, #login").addClass("animacao");
        console.log("" + $(window).width());
        if ($("html").width() <= 980) {
            if (contador == 0) {
                $("#login").trigger("reset");
                $("#fundo").css('height', '60rem');
                $("#registrar").css('transform', 'translateX(44rem)');
                $("#login").css('transform', 'translateX(44rem)');
                contador++;
            } else {
                $("#registrar").trigger("reset");
                $("#fundo").css('height', '40rem');
                $("#registrar").css('transform', 'translateX(0)');
                $("#login").css('transform', 'translateX(0)');
                contador--;
            }
        } else {
            if (contador == 0) {
                $("#login").trigger("reset");
                $("#fundo").css('height', '30rem');
                $("#registrar").css('transform', 'translateX(22rem)');
                $("#login").css('transform', 'translateX(22rem)');
                contador++;
            } else {
                $("#registrar").trigger("reset");
                $("#fundo").css('height', '20rem');
                $("#registrar").css('transform', 'translateX(0)');
                $("#login").css('transform', 'translateX(0)');
                contador--;
            }
        }


        $("#fundo").one("transitionend", (e) => {
            $("#fundo, #registrar, #login").removeClass("animacao");
        });
    });

    let user;
    let mail;
    let senha;
    let senha_verificada;
    let verificacaoRegistro = [false, false];

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
        user = $("#registrar #id-user").val();
        mail = $("#registrar #id-mail").val();
        senha = $('#registrar #id-senha').val();
        senha_verificada = $("#id-senha-verificada").val();
        $.when(verificandoUsuario(), verificandoEmail()).done(function () {
            if (user == '') {
                removerClasses("#registrar", "#id-user", "#ajuda-user");
                adicionarErro("#registrar", "#id-user", "#ajuda-user", "Digite um nome de usuário");
                return false;
            } else if (mail == '') {
                removerClasses("#registrar", "#id-mail", "#ajuda-mail");
                adicionarErro("#registrar", "#id-mail", "#ajuda-mail", "Digite um email");
                return false;
            } else if (senha == '') {
                removerClasses("#registrar", "#id-senha", "#ajuda-senha");
                adicionarErro("#registrar", "#id-senha", "#ajuda-senha", "Digite uma senha");
                return false;
            } else if (senha_verificada == '') {
                removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
                adicionarErro("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada", "Confirme sua senha");
                return false;
            } else if (verificacaoRegistro[0] && verificacaoRegistro[1] && verificandoSenha() && verificandoVerificarSenha()) {
                user = $("#registrar #id-user").val();
                mail = $("#registrar #id-mail").val();
                senha = $('#registrar #id-senha').val();
                senha_verificada = $("#id-senha-verificada").val();

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
                    setCookie("jNotesUser", user, 30);
                    $("#login").submit();
                } else if (response == "Usuario ou senha incorreta") {
                    adicionarErro("#login", "#id-login-senha", "#ajuda-login-senha", response);
                    adicionarErro("#login", "#id-login-user", "#ajuda-login-user", null)
                } else if (response == "Usuario incorreto") {
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
        $(fonte + " " + identificadorAjuda).text("");
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

    ///////////////////////////////////////////// Validando Usuario /////////////////////////////////////////////////////
    function verificandoUsuario() {
        removerClasses("#registrar", "#id-user", "#ajuda-user");
        user = $('#registrar #id-user').val();
        if (user == '') {
            removerClasses("#registrar", "#id-user", "#ajuda-user");
            verificacaoRegistro[0] = false;
            return;
        }

        return $.ajax({
            url: '../php/login.php',
            type: 'POST',
            data: {
                'user_check': 1,
                'user': user,
            },
            success: function (response) {
                if (response == 'taken') {
                    adicionarErro("#registrar", "#id-user", "#ajuda-user", "Usuário já cadastrado");
                    verificacaoRegistro[0] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#registrar", "#id-user", "#ajuda-user");
                    verificacaoRegistro[0] = true;
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
            verificacaoRegistro[1] = false;
            return;
        } else if (mail.indexOf("@") <= 0 || mail.indexOf(".") == -1) {
            adicionarErro("#registrar", "#id-mail", "#ajuda-mail", "Email inválido");
            verificacaoRegistro[1] = false;
            return;
        }
        return $.ajax({
            url: '../php/login.php',
            type: 'POST',
            data: {
                'mail_check': 1,
                'mail': mail,
            },
            success: function (response) {

                if (response == 'taken') {
                    adicionarErro("#registrar", "#id-mail", "#ajuda-mail", "Email já cadastrado");
                    verificacaoRegistro[1] = false;
                } else if (response == 'not_taken') {
                    campoCorreto("#registrar", "#id-mail", "#ajuda-mail");
                    verificacaoRegistro[1] = true;
                }
            }
        });
    }

    ///////////////////////////////////////////// Validando Senha /////////////////////////////////////////////////////
    function verificandoSenha() {
        removerClasses("#registrar", "#id-senha", "#ajuda-senha");
        senha = $('#registrar #id-senha').val();
        if (senha == '') {
            removerClasses("#registrar", "#id-senha", "#ajuda-senha");
            return false;
        } else if (senha.length < 5) {
            adicionarErro("#registrar", "#id-senha", "#ajuda-senha", "Utilize no minimo 5 caracteres");
            return false;
        } else {
            campoCorreto("#registrar", "#id-senha", "#ajuda-senha");
            return true;
        }
    }

    ///////////////////////////////////////////// Validando Verificar Senha /////////////////////////////////////////////////////
    function verificandoVerificarSenha() {
        removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
        senha_verificada = $('#registrar #id-senha-verificada').val();
        senha = $('#registrar #id-senha').val();
        if (senha_verificada == '') {
            removerClasses("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
            return false;
        } else if (senha != senha_verificada) {
            adicionarErro("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada", "Senhas não correspondem");
            return false;
        } else {
            campoCorreto("#registrar", "#id-senha-verificada", "#ajuda-senha-verificada");
            return true;
        }
    }

    ///////////////////////////////////////////// Usando Cookie /////////////////////////////////////////////////////
    function setCookie(nomeLogin, valorLogin, dias) {
        var d = new Date();
        d.setTime(d.getTime() + (dias * 24 * 60 * 60 * 1000));
        var expiracao = "expires=" + d.toUTCString();
        if ($("#login #lembrar").prop('checked')) {
            document.cookie = nomeLogin + "=" + valorLogin + ";" + expiracao + ";path=/";
        } else if (!($("#login #lembrar").prop('checked'))) {
            document.cookie = nomeLogin + "=" + "" + ";" + expiracao + ";path=/";
        }
    }

    function getCookie(nome) {
        var cod = nome + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cod) == 0) {
                return c.substring(cod.length, c.length);
            }
        }
        return "";
    }


    ////////////////////////////////////////////////////////////// Calculando a fonte /////////////////////////////////////////////////////////////////////////
    $(window).resize(function () {
        calcTamanhoFonte();
    });


    function calcTamanhoFonte() {
        $("html").css("font-size", Math.round(6 + ($(window).width() / 100) * 0.5));
    }
});