class Clientes {
    constructor() {}
    /*--- Getters e Setters ---*/

    /*--- Métodos ---*/
    cadastrar() {

    }

    atualizar() {}

    pegarDados(tel1, callback) {
        $.post('j-notes.php', {
            'verifica_tel_no_banco': 1,
            'tel1': tel1,
        }, (dados) => {
            callback(dados);
        }, "json");
    }
}