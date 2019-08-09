class Clientes {
    constructor() {}
    /*--- Métodos ---*/
    static cadastrar(tel1, nome, endereco, tel2) {
        $.post('./lib/process-j-notes.php', {
            'cadastra-novo-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        });
    }

    static atualizar(tel1, nome, endereco, tel2) {
        $.post('./lib/process-j-notes.php', {
            'aplica-update-no-cliente': 1,
            'tel1': tel1,
            'nome': nome,
            'endereco': endereco,
            'tel2': tel2,
        });
    }

    static pegarDados(tel1, callback) {
        $.post('./lib/process-j-notes.php', {
            'verifica_tel_no_banco': 1,
            'tel1': tel1,
        }, (dados) => {
            callback(dados);
        }, "json").fail(() => {
            callback(1);
        });
    }
}