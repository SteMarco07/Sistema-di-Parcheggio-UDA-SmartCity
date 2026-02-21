<?php

namespace Controller;

use Psr\Container\ContainerInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

require_once 'Model/ParcheggiRepository.php';
use Model\ParcheggiRepository;

class ParcheggiController{

    private $container;

    // constructor receives container instance
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function parcheggioById(Request $request, Response $response, array $args): Response
    {
        $parcheggiRepository = new ParcheggiRepository($this->container->get('config'));
        $parcheggio = $parcheggiRepository->getParcheggioById($args['id']);
        if ($parcheggio) {
            $response->getBody()->write($parcheggio);
        } else {
            $response->getBody()->write([]);
        }
        return $response->withHeader('application/json');
    }
}   