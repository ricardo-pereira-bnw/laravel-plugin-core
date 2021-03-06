<?php

use App\Plugin\Core\Libraries\Plugins\Handler;
use Illuminate\Http\JsonResponse;

if (function_exists('dummy_core_helpers') === false) {

    // Funções não possuem escopo.
    // Por esse motivo, usa-se o artifício de verificar a existência da função 
    // da invocação do arquivo com helpers
    function dummy_core_helpers()
    {
    }

    /**
     * Invoca um arquivo do vue para a respostas a ser compilada pelo vuejs.
     * Os arquivos do vue devem estar em resources/js/pages. 
     * Por exemplo: a tag 'core::example' irá invocar o arquivo 'resources/js/pages/example.vue'
     * 
     * @param string $name
     */
    function vue(string $name): array
    {
        $target = explode('::', $name);
        $plugin = null;

        // sem namespace
        if (isset($target[1]) === false) {
            $target = ['main', $target[0]];
        }

        $filePath = str_replace('.', '/', $target[1]);

        if ($target[0] === 'main') {

            // procura no resources/vue do laravel
            $vueFile = resource_path("vue/{$filePath}");
        } else {

            // procura no resources/vue do plugin
            $plugin = Handler::instance()->plugin($target[0]);
            if ($plugin === null) {
                $plugin = Handler::instance()->theme($target[0]);
            }

            if ($plugin === null) {
                throw new InvalidArgumentException("O namespace {$target[0]} não foi registrado");
            }

            $vueFile = implode(DIRECTORY_SEPARATOR, [$plugin->path(), 'resources', 'vue', $filePath]);
        }

        if (is_file($vueFile . '.vue') === false) {
            throw new InvalidArgumentException("A arquivo {$vueFile}.vue não foi encontrado");
        }

        return [
            'meta' => Handler::instance()->metadata(),
            'vuefile' => file_get_contents($vueFile . '.vue')
        ];
    }

    /**
     * Devolve uma resposta para uma requisição abortada.
     * 
     * @param int $httpStatus
     * @param string $message
     * @param array $data
     */
    function vueAbort(int $httpStatus, string $message = null, array $data = []): JsonResponse
    {
        return response()->json([
            'meta'    => Handler::instance()->metadata(),
            'message' => $message ?? 'Requisição abortada',
            'data'    => $data
        ], $httpStatus);
    }
}
