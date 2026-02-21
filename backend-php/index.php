<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require '../vendor/autoload.php';
require 'Controller/TennistaController.php';

use League\Plates\Engine;
use Util\Connection;
use Controller\TennistaController;
use DI\Container as Container;

//Istruzione super importante per il deployment
//Include il file di configurazione con le credenziali di accesso al database
$config = require 'conf/config.php';

$container = new Container();

AppFactory::setContainer($container);


$app = AppFactory::create();
$app->setBasePath($config['BASEPATH']);


$app->get('/', function (Request $request, Response $response, $args): Response {

    $response->getBody()->write("rotta default");

    return $response;
});

// Restituisce tutti i parcheggi presenti
$app->get('/park', );

// Restituisce un parcheggio specifico
$app->get('/park/{park_id}',  ParcheggiController::class . ':getParcheggioById');

// Modifica una nuova prenotazione
$app->post('/reservation', function (Request $request, Response $response, $args): Response {

    // Prende l'ID dal body
    $park_id = $request->getParsedBody()['park_id'];

    // Logica di modifica

    return $response;
});

// L'amministratore deve poter modificare un parcheggio
$app->put('/park', function (Request $request, Response $response, $args): Response {

    $park_id = $request->getParsedBody()['park_id'];

    //Logica di modifica

    return $response->withStatus(204);
});

// Crea una nuova presentazione (sia utente che admin)
$app->put('/reservation', function (Request $request, Response $response, $args): Response {
    global $templates, $pdo;

    $reservation_id = $request->getParsedBody()['reservation_id'];

    $pagina = $templates->render('park', []);
    $response->getBody()->write($pagina);

    return $response->withStatus(201);
});

// L'amministratore deve poter creare un parcheggio
$app->put('/park', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $park_id = $request->getParsedBody()['park_id'];

    //Logica di creazione

    return $response->withStatus(201);
});

// Elimina una prenotazione, dal lato utente
$app->delete('/reservation/{reservation_id}', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $reservation_id = $args['reservation_id'];

    // Logica di eliminazione

    $response = $response->withStatus(204);
    return $response;
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
