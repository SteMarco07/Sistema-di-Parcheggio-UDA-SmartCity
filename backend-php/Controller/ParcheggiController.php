<?php

namespace Controller;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

require_once 'Model/ParcheggiRepository.php';
use Model\ParcheggiRepository;

class ParcheggiController {

    private $container;
    private $parcheggiRepository;

    // constructor receives container instance
    public function __construct(ContainerInterface $container) {
        $this->container = $container;
        $this->parcheggiRepository = new ParcheggiRepository($this->container->get('config'));
    }

    public function getParcheggioById(Request $request, Response $response, array $args): Response {
        $parking_lots = $this->parcheggiRepository->getParcheggioById($args['id']);
        if ($parking_lots) {
            $response->getBody()->write(json_encode($parking_lots));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['error' => 'Parcheggio non trovato']));
            $response->withStatus(404);
        }

        return $response
            ->withHeader('Content-type', 'application/json');
    }

    public function getAllParcheggi(Request $request, Response $response, array $args) : Response {
        $parking_lots = $this->parcheggiRepository->getAllParcheggi();
        $response->getBody()->write(json_encode($parking_lots));

        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function getReservatonById(Request $request, Response $response, array $args): Response {
        $reservation = $this->parcheggiRepository->getReservationById($args['uuid']);
        if ($reservation) {
            $response->getBody()->write(json_encode($reservation));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['error' => 'Prenotazione non trovata']));
            $response->withStatus(404);
        }

        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function getReservatonByUserId(Request $request, Response $response, array $args): Response {
        $reservation = $this->parcheggiRepository->getReservationByUserId($args['uuid']);
        if ($reservation) {
            $response->getBody()->write(json_encode($reservation));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['error' => 'Prenotazione non trovata']));
            $response->withStatus(404);
        }

        return $response
            ->withHeader('Content-Type', 'application/json');
    }


    public function userCreateReservation(Request $request, Response $response, array $args) : Response {
        $prenotazione = $this->parcheggiRepository->userCreateReservation(
            $request->getParsedBody()['id'],
            $request->getParsedBody()['first_name'],
            $request->getParsedBody()['last_name'],
            $request->getParsedBody()['license_plate'],
            $request->getParsedBody()['start_time'],
            $request->getParsedBody()['end_time'],
            $request->getParsedBody()['id_parking_lot']
        );

        $response->getBody()->write(json_encode($prenotazione));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    public function userEditReservation(Request $request, Response $response, array $args) : Response {
        $prenotazione = $this->parcheggiRepository->editUserReservation(
            $request->getParsedBody()['id'],
            $request->getParsedBody()['license_plate'],
            $request->getParsedBody()['start_time'],
            $request->getParsedBody()['end_time'],
            $request->getParsedBody()['id_parking_lot']
        );

        $response->getBody()->write(json_encode($prenotazione));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    public function userDeleteReservation(Request $request, Response $response, array $args) : Response {
        $id = $request->getParsedBody()['id'];
        $this->parcheggiRepository->deleteReservation($id);

        $response->getBody()->write(json_encode(['id' => $id]));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }
}
