<?php

namespace Controller;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use Model\ParcheggiRepository;
use RuntimeException;

class ParcheggiController {

    private ContainerInterface $container;
    private ParcheggiRepository $parcheggiRepository;

    // constructor receives a container instance

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
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
            $response->getBody()->write(json_encode(['message' => 'Parcheggio non trovato']));
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

    public function getAvailableParcheggi(Request $request, Response $response, array $args) : Response {
        try {
            $parking_lots = $this->parcheggiRepository->getAvailableParcheggi($args['start_time'], $args['end_time']);
            $response->getBody()->write(json_encode($parking_lots));

            return $response
                ->withHeader('Content-Type', 'application/json');
        } catch (RuntimeException $e) {
            $status = $e->getCode() === 422 ? 422 : 400;
            $response->getBody()->write(json_encode(['message' => $e->getMessage()]));

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus($status);
        }
    }

    public function getAllReservations(Request $request, Response $response, array $args): Response {
        $reservations = $this->parcheggiRepository->getAllReservations();
        $response->getBody()->write(json_encode($reservations));

        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function getReservationById(Request $request, Response $response): Response {
        $reservation = $this->parcheggiRepository->getReservationById($request->getParsedBody()['id']);
        if ($reservation) {
            $response->getBody()->write(json_encode($reservation));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['message' => 'Prenotazione non trovata']));
            $response->withStatus(404);
        }

        return $response
            ->withHeader('Content-Type', 'application/json');
    }


    public function getReservationByUserId(Request $request, Response $response): Response {
        $reservation = $this->parcheggiRepository->getReservationByUserId(json_decode(json_encode($request->getAttribute('utente')), true)['id']);
        if ($reservation) {
            $response->getBody()->write(json_encode($reservation));
            $response->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['message' => 'Prenotazione non trovata']));
            $response->withStatus(404);
        }

        return $response
            ->withHeader('Content-Type', 'application/json');
    }


    public function userCreateReservation(Request $request, Response $response, array $args) : Response {
        $prenotazione = $this->parcheggiRepository->userCreateReservation(
            $request->getParsedBody()['start_time'],
            $request->getParsedBody()['end_time'],
            $request->getParsedBody()['id_parking_lot'],
            json_decode(json_encode($request->getAttribute('utente')), true)['id']
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
