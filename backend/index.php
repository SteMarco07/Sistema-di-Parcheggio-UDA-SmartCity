<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Exception\HttpException;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';
require './Controller/ParcheggiController.php';
require './Controller/AuthController.php';
require './Controller/AdminController.php';
require './Middleware/JWTMiddleware.php';
require './Middleware/JWTAdminMiddleware.php';

use Controller\AuthController;
use Controller\ParcheggiController;
use Controller\AdminController;
use Middleware\JWTMiddleware;
use Middleware\JWTAdminMiddleware;
use DI\Container as Container;

//Istruzione super importante per il deployment
//Include il file di configurazione con le credenziali di accesso al database
$config = require 'conf/config.php';

$container = new Container();
$container->set('config', $config);
AppFactory::setContainer($container);

$app = AppFactory::create();
$app->setBasePath($config['BASEPATH']);

// Funzione condivisa per applicare sempre gli header CORS
$addCorsHeaders = function (Request $request, Response $response): Response {
    $origin = $request->getHeaderLine('Origin');

    if ($origin !== '') {
        $response = $response
            ->withHeader('Access-Control-Allow-Origin', $origin)
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Vary', 'Origin');
    } else {
        $response = $response->withHeader('Access-Control-Allow-Origin', '*');
    }

    return $response
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Max-Age', '3600');
};

// CORS middleware
$CORSMiddleware = function (Request $request, RequestHandler $handler) use ($addCorsHeaders) {
    $response = $handler->handle($request);
    return $addCorsHeaders($request, $response);
};

// Preflight handler (short-circuit OPTIONS)
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
});

$app->addBodyParsingMiddleware();

// Gestione errori centralizzata con risposta JSON + CORS
$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app, $addCorsHeaders) {
    $status = 500;
    if ($exception instanceof HttpUnauthorizedException) {
        $status = 401;
    } elseif ($exception instanceof HttpException) {
        $status = $exception->getCode();
    }

    $payload = [
        'error' => $displayErrorDetails ? $exception->getMessage() : 'Errore interno del server'
    ];

    if ($displayErrorDetails) {
        $payload['type'] = get_class($exception);
    }

    $response = $app->getResponseFactory()->createResponse();
    $response = $addCorsHeaders($request, $response)
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($status > 0 ? $status : 500);

    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response;
};

$displayErrorDetails = !$config['PRODUCTION'];
$errorMiddleware = $app->addErrorMiddleware($displayErrorDetails, true, true);
$errorMiddleware->setDefaultErrorHandler($customErrorHandler);

// In Slim l'ultimo middleware aggiunto viene eseguito per primo:
// CORS deve stare all'esterno per aggiungere header anche alle risposte d'errore.
$app->add($CORSMiddleware);

$app->get('/', function (Request $request, Response $response): Response {
    $response->getBody()->write("rotta default");
    return $response;
});

// Rotta per la registrazione
$app->post('/register', [AuthController::class, 'register']);

// Rotta per il login
$app->post('/login', [AuthController::class, 'login']);

// Restituisce tutti i parcheggi presenti
$app->get('/park', [ParcheggiController::class, 'getAllParcheggi']);

// Restituisce un parcheggio specifico
$app->get('/park/{id}',  [ParcheggiController::class, 'getParcheggioById']);

// Restituisce tutti i parcheggi con almeno un posto libero nell'intervallo richiesto
$app->get('/park/available/{start_time}/{end_time}', [ParcheggiController::class, 'getAvailableParcheggi']);

// Verifica se un parcheggio specifico ha almeno un posto libero nell'intervallo richiesto
$app->get('/park/{id}/available/{start_time}/{end_time}', [ParcheggiController::class, 'isParkingLotAvailable']);

// Funzione per le rotte protette da autenticazione
$app->group('', function ($group) {
    // Restituisce i dati dell'utente
    $group->get('/profile', [AuthController::class, 'profile']);

    // Effettua il logout (elimina token JWT da lato client)
    $group->post('/logout', [AuthController::class, 'logout']);

    // Restituisce una prenotazione specifica (per id)
    $group->get('/reservation/search-id/{uuid}',  [ParcheggiController::class, 'getReservationById']);

    // Restituisce una prenotazione specifica (per id utente)
    $group->get('/reservation/search-user',  [ParcheggiController::class, 'getReservationByUserId']);

    // Crea una nuova prenotazione, l'ID del parcheggio e le date di inizio e fine sono nel body
    $group->put('/reservation', [ParcheggiController::class, 'userCreateReservation']);

    // Modifica una prenotazione esistente, l'ID e le date di inizio e fine sono nel body
    $group->post('/reservation', [ParcheggiController::class, 'userEditReservation']);

    // Elimina una prenotazione, dal lato utente (id nel body)
    $group->delete('/reservation', [ParcheggiController::class, 'userDeleteReservation']);
})->add(new JWTMiddleware());

// Funzione per le rotte protette da autenticazione e da privilegi amministrativi
$app->group('', function ($group) {
    // Restituisce i dati dell'utente specificato dall'id
    $group->get('/profile/{id}', [AuthController::class, 'profileById']);

    // L'amministratore deve poter creare un parcheggio
    $group->put('/park', [AdminController::class, 'addPark']);

    // L'amministratore deve poter modificare un parcheggio
    $group->post('/park', [AdminController::class, 'modifyPark']);

    // L'amministratore deve poter eliminare un parcheggio
    $group->delete('/park', [AdminController::class, 'deletePark']);

    // Ritorna tutte le prenotazioni all'amministratore
    $group->get('/reservation', [ParcheggiController::class, 'getAllReservations']);
})->add(new JWTAdminMiddleware());

$app->run();
