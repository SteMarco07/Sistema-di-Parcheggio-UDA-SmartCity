<?php

namespace Controller;

use Model\UserRepository;
use Psr\Container\ContainerInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class AuthController{

    private $container;
    private $userRepository;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
        $this->userRepository = new UserRepository($this->container->get('config'));
    }

    private function JSONResponse(Response $response, array $dati, int $status = 200): Response {
        $response->getBody()->write(json_encode($dati));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public function login(Request $request, Response $response): Response {
        $data = $request->getParsedBody();
                

        // Validazione minima: i campi devono esserci
        if (empty($data['username']) || empty($data['password'])) {
            return $this->JSONResponse($response, [
                'errore' => 'Username e password sono obbligatori',
                'contesto' => $data
            ], 400);
        }

        $repository = new UserRepository($this->container->get('config'));
        $userData = $repository->verifyCredentials($data['username'], $data['password']);

        if ($userData['token'] === null) {
            return $this->JSONResponse($response, [
                'errore' => 'Credenziali non valide'
            ], 401);
        }

        return $this->JSONResponse($response, $userData);
    }

    public function register(Request $request, Response $response): Response {
        $utente = $this->userRepository->createUser(
            $request->getParsedBody()['nome'],
            $request->getParsedBody()['cognome'],
            $request->getParsedBody()['targa'],
            $request->getParsedBody()['email'],
            $request->getParsedBody()['email'],
            $request->getParsedBody()['password']
        );

        return $this->JSONResponse($response, $utente, 201);
    }

    public function profilo(Request $request, Response $response): Response {
        $utente = $this->userRepository->getUser($request->getParsedBody()['username']);

        return $this->JSONResponse($response, $utente);
    }

    public function logout(Request $request, Response $response): Response
    {
        // JWT è stateless: il backend non ha nulla da invalidare.
        // Il client dovrà semplicemente eliminare il token in suo possesso.
        return $this->JSONResponse($response, [
            'messaggio' => 'Logout effettuato. Elimina il token lato client.'
        ]);
    }
}