<?php
// Seta o conteúdo como JS
header('Content-type: text/javascript');

// Inclui os arquivos dos diretórios
foreach (glob("../../js/lib/*.js") as $file) {
    readfile($file);
}
