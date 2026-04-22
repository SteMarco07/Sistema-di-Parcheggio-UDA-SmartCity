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
        if (empty($data['email']) || empty($data['password'])) {
            return $this->JSONResponse($response, [
                'message' => 'Email e password sono obbligatori',
                'context' => $data
            ], 400);
        }

        $userData = $this->userRepository->verifyCredentials($data['email'], $data['password']);

        if (!isset($userData['token'])) {
            return $this->JSONResponse($response, [
                'message' => 'Credenziali non valide'
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
            $request->getParsedBody()['password']
        );

        if($utente['success']) { return $this->JSONResponse($response, $utente, 201); }

        return $this->JSONResponse($response, $utente, 409);
    }

    public function profile(Request $request, Response $response): Response {
        $utente = $this->userRepository->getUser($request->getParsedBody()['email']);

        return $this->JSONResponse($response, $utente);
    }

    public function logout(Request $request, Response $response): Response {
        return $this->JSONResponse($response, [ 'message' => 'Logout effettuato. Elimina il token lato client.' ]);
    }
}