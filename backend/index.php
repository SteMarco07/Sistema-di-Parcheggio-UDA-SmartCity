<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;
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

// CORS middleware
$CORSMiddleware = function (Request $request, RequestHandler $handler) {
    // Always add CORS headers to the response
    $response = $handler->handle($request);

    $origin = $request->getHeaderLine('Origin');
    $allowedOrigin = $origin ?: '*'; // In production, validate against a whitelist

    return $response
        ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Access-Control-Max-Age', '3600'); // Cache preflight
};

// Preflight handler (short-circuit OPTIONS)
$app->options('/{routes:.+}', function (Request $request, Response $response) {
    return $response;
})->add($CORSMiddleware);

// Then add CORS middleware globally (must be added **first**)
$app->add($CORSMiddleware);

$app->addBodyParsingMiddleware();

// Da disattivare in PROD
$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app) {
    // Build the error payload
    $payload = ['error' => $exception->getMessage()];
    $response = $app->getResponseFactory()->createResponse();

    // Apply CORS headers to the error response
    $origin = $request->getHeaderLine('Origin');
    $allowedOrigin = $origin ?: '*';

    $response = $response
        ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
        ->withHeader('Access-Control-Allow-Credentials', 'true')
        ->withHeader('Content-Type', 'application/json')
        ->withStatus($exception instanceof HttpUnauthorizedException ? 401 : 500);

    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));
    return $response;
};

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
if ($config['PRODUCTION']) { $errorMiddleware->setDefaultErrorHandler($customErrorHandler); }

$app->get('/', function (Request $request, Response $response, $args): Response {
    $response->getBody()->write("rotta default");
    return $response;
});

// Rotta per il login
$app->post('/login', [AuthController::class, 'login']);

// Rotta per la registrazione
$app->post('/register', [AuthController::class, 'register']);

// Restituisce tutti i parcheggi presenti
$app->get('/park', [ParcheggiController::class, 'getAlSlParcheggi']);

// Restituisce un parcheggio specifico
$app->get('/park/{park_id}',  [ParcheggiController::class, 'getParcheggioById']);

// Restituisce i posti disponibili prima che l'utente ne faccia una
$app->get('/reservation/available/{start}/{end}', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $data_inizio = $args['start'];
    $data_fine = $args['end'];

    // Logica per verificare la disponibilità delle prenotazioni
    $disponibili = []; // Array di prenotazioni disponibili

    $response->getBody()->write(json_encode($disponibili));
    return $response->withHeader('Content-Type', 'application/json');
});

// Funzione per le rotte protette da autenticazione
$app->group('', function ($group) {
    // Restituisce i dati dell'utente
    $group->get('/profile', [AuthController::class, 'profile']);

    // Effettua il logout (elimina token JWT da lato client)
    $group->post('/logout', [AuthController::class, 'logout']);

    // Restituisce una prenotazione specifica (per id)
    $group->get('/reservation/search-id/{uuid}',  [ParcheggiController::class, 'getReservationByUuid']);

    // Restituisce una prenotazione specifica (per id utente)
    $group->get('/reservation/search-user/{uuid}',  [ParcheggiController::class, 'getReservationByUserId']);

    // Crea una nuova prenotazione, l'ID del parcheggio e le date di inizio e fine sono nel body
    $group->put('/reservation', [ParcheggiController::class, 'userCreateReservation']);

    // Modifica una prenotazione esistente, l'ID e le date di inizio e fine sono nel body
    $group->post('/reservation', [ParcheggiController::class, 'userEditReservation']);

    // Elimina una prenotazione, dal lato utente (id nel body)
    $group->delete('/reservation', [ParcheggiController::class, 'userDeleteReservation']);
})->add(new JWTMiddleware());

// Funzione per le rotte protette da autenticazione e da privilegi amministrativi
$app->group('', function ($group) {
    // L'amministratore deve poter creare un parcheggio
    $group->put('/park', [AdminController::class, 'addPark']);

    // L'amministratore deve poter modificare un parcheggio
    $group->post('/park', [AdminController::class, 'modifyPark']);

    // L'amministratore deve poter eliminare un parcheggio
    $group->delete('/park', [AdminController::class, 'deletePark']);
})->add(new JWTAdminMiddleware());

$app->run();
