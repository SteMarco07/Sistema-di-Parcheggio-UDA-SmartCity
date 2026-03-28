<?php

namespace Controller;

use Model\UserRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Container\ContainerInterface;

class AuthController
{

    private $container;
    private $userRepository;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
        $this->userRepository = new UserRepository($this->container->get('config'));
    }

    private function JSONResponse(Response $response, array $dati, int $status = 200): Response
    {
        $response->getBody()->write(json_encode($dati));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public function login(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();

        // Validazione minima: i campi devono esserci
        if (empty($data['username']) || empty($data['password'])) {
            return $this->JSONResponse($response, [
                'errore' => 'Username e password sono obbligatori'
            ], 400);
        }

        $repository = new UserRepository();
        $token = $repository->verifyCredentials($data['username'], $data['password']);

        if ($token === null) {
            return $this->JSONResponse($response, [
                'errore' => 'Credenziali non valide'
            ], 401);
        }

        return $this->JSONResponse($response, [
            'token' => $token
        ]);
    }

    public function register(Request $request, Response $response): Response {
        $utente = $this->userRepository->createUser(
            $request->getParsedBody()['nome'],
            $request->getParsedBody()['cognome'],
            $request->getParsedBody()['targa'],
            $request->getParsedBody()['email'],
            $request->getParsedBody()['password']
        );

        $response->getBody()->write(json_encode($utente));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    public function profilo(Request $request, Response $response): Response
    {
        // I dati dell'utente sono stati iniettati dal JwtMiddleware
        $utente = $request->getAttribute('utente');

        return $this->JSONResponse($response, [
            'id'       => $utente->id,
            'username' => $utente->username,
        ]);
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