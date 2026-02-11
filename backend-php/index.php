<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Util\Connection;

require './vendor/autoload.php';
require './conf/config.php';

$pdo = Connection::getInstance();

$app = AppFactory::create();

$app->get('/', function (Request $request, Response $response, $args): Response {
    global $pdo;

    $pagina = $templates->render('routes', []);
    $response->getBody()->write($pagina);

    return $response;
});

// Restituisce tutti i parcheggi presenti
$app->get('/park', function (Request $request, Response $response, $args): Response {
    global $pdo;

    //Restituisce le rotte in JSON, che verranno poi interpretate dal frontend
    $response->getBody()->write($pagina)->withHeader('Content-Type', 'application/json');

    return $response;
});

// Restituisce un parcheggio specifico
$app->get('/park/{park_id}', function (Request $request, Response $response, $args): Response {

    $park_id = $args['park_id'];

    // Logica di selezione

    if ($park) {
        $response->getBody()->write(json_encode($park));
    } else {
        $response = $response->withStatus(404);
    }

    return $response;
});

// Modifica una nuova prenotazione
$app->post('/reservation', function (Request $request, Response $response, $args): Response {
    global $pdo;

    // Prende l'ID dal body
    $park_id = $request->getParsedBody()['park_id'];

    // Logica di modifica

    return $response;
});

// L'amministratore deve poter modificare un parcheggio
$app->put('/park', function (Request $request, Response $response, $args): Response {
    global $pdo;

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
