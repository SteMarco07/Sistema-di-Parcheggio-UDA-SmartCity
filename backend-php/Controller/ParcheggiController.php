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
            $response->getBody()->write([]);
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

    public function userEditReservation(Request $request, Response $response, array $args) : Response {
        $prenotazione = $this->parcheggiRepository->editUserReservation(
            $request->getParsedBody()['park_id'],
            $request->getParsedBody()['data_inizio'],
            $request->getParsedBody()['data_fine']
        );
        $response->getBody()->write(json_encode($prenotazione));
        $response->withStatus(200);
        return $response
            ->withHeader('Content-Type', 'application/json');
    }

    public function deleteReservation(Request $request, Response $response, array $args) : Response {
        $id = $request->getParsedBody()['park_id'];
        $this->parcheggiRepository->deleteReservation(
            $id
        );
        $response->getBody()->write('park_id');
        $response->withStatus(204);
        return $response
                ->withHeader('Content-Type', 'application/json');
    }
}   