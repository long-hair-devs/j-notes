class Clientes {
    constructor() {}
    /*--- Métodos ---*/
    cadastrar(tel1, nome, endereco, tel2) {
        $.post('j-notes.php', {
            'cadastra-novo-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        });
    }

    atualizar(tel1, nome, endereco, tel2) {
        $.post('j-notes.php', {
            'aplica-update-no-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        });
    }

    pegarDados(tel1, callback) {
        $.post('j-notes.php', {
            'verifica_tel_no_banco': 1,
            'tel1': tel1,
        }, (dados) => {
            callback(dados);
        }, "json");
    }
}