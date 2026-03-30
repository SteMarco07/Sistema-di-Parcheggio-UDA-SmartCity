<?php

namespace Controller;

use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

require_once 'Model/AdminRepository.php';
use Model\AdminRepository;

class AdminController {

    private $container;
    private $adminRepository;

    // constructor receives a container instance
    public function __construct(ContainerInterface $container) {
        $this->container = $container;
        $this->adminRepository = new AdminRepository($this->container->get('config'));
    }

    public function addPark(Request $request, Response $response, array $args): Response {
        $parcheggio = $this->adminRepository->addPark(
            $request->getParsedBody()['name'],
            $request->getParsedBody()['total_spots'],
            $request->getParsedBody()['latitude'],
            $request->getParsedBody()['longitude']
        );

        $response->getBody()->write(json_encode($parcheggio));

        return $response
            ->withHeader('Content-type', 'application/json');
    }
}
