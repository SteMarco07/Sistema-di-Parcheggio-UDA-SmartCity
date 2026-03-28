<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Factory\AppFactory;

require './vendor/autoload.php';
require './Controller/ParcheggiController.php';

use League\Plates\Engine;
use Controller\ParcheggiController;
use App\Middleware\JwtMiddleware;
use App\Controller\AuthController;
use DI\Container as Container;

//Istruzione super importante per il deployment
//Include il file di configurazione con le credenziali di accesso al database
$config = require 'conf/config.php';

$container = new Container();
$container->set('config', $config);

AppFactory::setContainer($container);

$app = AppFactory::create();

$app->setBasePath($config['BASEPATH']);
$app->addBodyParsingMiddleware();

// CORS middleware
$corsMiddleware = function (Request $request, RequestHandler $handler) use ($app) {
    $response = $handler->handle($request);

    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Allow-Credentials', 'true');
};

$app->add($corsMiddleware);

// Global preflight route (matches any route) like Slim v3 cookbook
$app->options('/{routes:.+}', function (Request $request, Response $response, $args) { return $response; });

$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app) {
    $payload = ['error' => $exception->getMessage()];
    $response = $app->getResponseFactory()->createResponse();
    $engine = $app->getContainer()->get('template');

    if ($exception instanceof \Slim\Exception\HttpNotFoundException) { $response ->getBody()->write($engine->render('404', $payload)); }
    else if ($exception instanceof HttpUnauthorizedException) { $response ->getBody()->write($engine->render('401', $payload)); }

    $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_UNICODE));

    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(500);
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
$app->post('/sign-in', [AuthController::class, 'login']);

// Restituisce tutti i parcheggi presenti
$app->get('/park', ParcheggiController::class . ':getAllParcheggi');

// Restituisce un parcheggio specifico
$app->get('/park/{park_id}',  ParcheggiController::class . ':getParcheggioById' );

// Restituisce una prenotazione specifica (per id)
$app->get('/reservation/search-id/{uuid}',  ParcheggiController::class . ':getReservationByUuid' );

// Restituisce una prenotazione specifica (per id utente)
$app->get('/reservation/search-user/{uuid}',  ParcheggiController::class . ':getReservationByUserId' );

// Crea una nuova prenotazione, l'ID del parcheggio e le date di inizio e fine sono nel body
$app->put('/reservation', ParcheggiController::class . ':userCreateReservation' );

// Modifica una prenotazione esistente, l'ID e le date di inizio e fine sono nel body
$app->post('/reservation', ParcheggiController::class . ':userEditReservation' );

// Elimina una prenotazione, dal lato utente (id nel body)
$app->delete('/reservation', ParcheggiController::class . ':deleteReservation');

// L'amministratore deve poter creare un parcheggio
$app->put('/park', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $park_id = $request->getParsedBody()['park_id'];

    //Logica di creazione

    return $response->withStatus(201);
});

// L'amministratore deve poter modificare un parcheggio
$app->post('/park', function (Request $request, Response $response, $args): Response {

    $park_id = $request->getParsedBody()['park_id'];

    //Logica di modifica

    return $response->withStatus(204);
});

// L'amministratore deve poter eliminare un parcheggio
$app->delete('/park/{park_id}', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $park_id = $args['park_id'];

    // Logica di eliminazione

    $response = $response->withStatus(204);
    return $response;
});

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

$app->run();
