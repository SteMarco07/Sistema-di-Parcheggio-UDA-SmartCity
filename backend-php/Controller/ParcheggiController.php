<?php

namespace Controller;

use Psr\Container\ContainerInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

require_once 'Model/ParcheggiRepository.php';
use Model\ParcheggiRepository;

class ParcheggiController{

    private $container;
    private $parcheggiRepository;

    // constructor receives container instance
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->parcheggiRepository = new ParcheggiRepository($this->container->get('config'));
    }

    public function getParcheggioById(Request $request, Response $response, array $args): Response
    {
        $parcheggio = $this->parcheggiRepository->getParcheggioById($args['id']);
        if ($parcheggio) {
            $response->getBody()->write(json_encode($parcheggio));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['error' => 'Parcheggio non trovato']));
            $response->withStatus(404);
        }


        return $response
            ->withHeader('Content-type', 'application/json');
    }

    public function getAllParcheggi(Request $request, Response $response, array $args) : Response {
        $parcheggi = $this->parcheggiRepository->getAllParcheggi();
        $response->getBody()->write(json_encode($parcheggi));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function getReservatonById(Request $request, Response $response, array $args): Response {
        $pren_id = $args['pren_id'];
        $prenotazioni = $this->parcheggiRepository->getReservationById($pren_id);
        $response->getBody()->write(json_encode($prenotazioni));
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function getReservatonByUserId(Request $request, Response $response, array $args): Response {
        $user_id = $args['user_id'];
        $prenotazioni = $this->parcheggiRepository->getReservationByUserId($user_id);
        $response->getBody()->write(json_encode($prenotazioni));
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
        $response->withStatus(201);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function userEditReservation(Request $request, Response $response, array $args) : Response {
        $prenotazione = $this->parcheggiRepository->editUserReservation(
            $request->getParsedBody()['id'],
            $request->getParsedBody()['license_plate'],
            $request->getParsedBody()['start_time'],
            $request->getParsedBody()['end_time']
        );
        $response->getBody()->write(json_encode($prenotazione));
        $response->withStatus(200);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function deleteReservation(Request $request, Response $response, array $args) : Response {
        $id = $request->getParsedBody()['id'];
        $this->parcheggiRepository->deleteReservation(
            $id
        );
        $response->getBody()->write(json_encode(['id' => $id]));
        $response->withStatus(200);
        return $response
                ->withHeader('Content-Type', 'application/json');
    }


}
