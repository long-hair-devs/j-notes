$(function () {
    let contador = 0;
    $(".link").click(function () {
        $("#registrar #id-texto-user").removeClass("form-user-erro");
        $("#registrar #id-texto-user").removeClass("form-user-sucesso");
        $("#registrar #id-texto-mail").removeClass("form-mail-erro");
        $("#registrar #id-texto-mail").removeClass("form-mail-sucesso");
        if (contador == 0) {
            $("#login").trigger("reset");
            $("#interno").css('height', '28rem');
            $("#registrar").css('transform', 'translateX(23.625rem)');
            $("#login").css('transform', 'translateX(23.625rem)');
            contador++;
        } else {
            $("#registrar").trigger("reset");
            $("#interno").css('height', '18rem');
            $("#registrar").css('transform', 'translateX(0)');
            $("#login").css('transform', 'translateX(0)');
            contador--;
        }
    });

    var user_estado = false;
    var mail_estado = false;
    var mail_estado_error = false;

    //Verificando se o usuario ja esta cadastrado no banco junto do "cadastrarUser.php" atraves do AJAX
    $("#registrar #id-user").keyup($.debounce(250, function () {
        $("#registrar #id-texto-user").removeClass("form-user-erro");
        $("#registrar #id-texto-user").removeClass("form-user-sucesso");
        var user = $('#registrar #id-user').val();
        if (user == '') {
            user_estado = false;
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
                    user_estado = false;
                    $("#registrar #id-texto-user").addClass("form-user-erro");
                } else if (response == 'not_taken') {
                    user_estado = true;
                    $("#registrar #id-texto-user").addClass("form-user-sucesso");
                }
            }
        });
    }));

    //Verificando se o email ja esta cadastrado no banco junto do "cadastrarUser.php" atraves do AJAX
    $("#registrar #id-mail").keyup($.debounce(250, function () {
        $("#registrar #id-texto-mail").removeClass("form-mail-erro");
        $("#registrar #id-texto-mail").removeClass("form-mail-sucesso");
        var mail = $('#registrar #id-mail').val();

        if (mail == '') {
            mail_estado = false;
            return;
        }
        if (mail.indexOf("@") == -1) {
            mail_estado = false;
            $("#registrar #id-texto-mail").addClass("form-mail-erro");
            mail_estado_error = true;
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
                mail_estado_error = false;

                if (response == 'taken') {
                    mail_estado = false;
                    $("#registrar #id-texto-mail").addClass("form-mail-erro");
                } else if (response == 'not_taken') {
                    mail_estado = true;
                    $("#registrar #id-texto-mail").addClass("form-mail-sucesso");
                }
            }
        });
    }));

    $("#id-registro").click(function (event) {
        event.preventDefault();
        var user = $("#registrar #id-user").val();
        var mail = $("#registrar #id-mail").val();
        var senha_verificada = $("#id-senha-verificada").val();
        var senha = $("#id-senha").val();
        if (!user_estado) {
            alert("Nome de usuario não está disponível")
        } else if (!mail_estado && mail_estado_error) {
            alert("Email inválido")
        } else if (!mail_estado && !mail_estado_error) {
            alert("Email ja está sendo utilizado")
        } else if (senha != senha_verificada) {
            alert("Senhas diferentes");
        } else {
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