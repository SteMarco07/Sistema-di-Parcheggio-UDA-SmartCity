<?php

namespace Middleware;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Slim\Psr7\Response;

class JWTAdminMiddleware implements MiddlewareInterface {
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface {
        // 1. Leggo l'header Authorization
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader)) { return $this->errorResponse(401, 'Token mancante'); }

        // 2. L'header deve avere il formato "Bearer <token>"
        if (!preg_match('/^Bearer\s+(.+)$/', $authHeader, $matches)) {
            return $this->errorResponse(401, 'Formato token non valido');
        }

        $token = $matches[1];

        try {
            // 3. Verifico e decodifico il token
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGO));

            // 4. Controllo che l'utente sia un admin
            if ($decoded->data->role !== 'ADMIN') { return $this->errorResponse(401, 'Non autorizzato'); }

            // 5. Passo i dati dell'utente alla request,
            //    così i controller li trovano nell'attributo 'utente'
            $request = $request->withAttribute('utente', $decoded->data);


            return $handler->handle($request);

        } catch (ExpiredException $e) {
            return $this->errorResponse(401, 'Token scaduto');
        } catch (SignatureInvalidException $e) {
            return $this->errorResponse(401, 'Firma del token non valida');
        } catch (\Exception $e) {
            return $this->errorResponse(401, 'Token non valido');
        }
    }

    private function errorResponse(int $status, string $messaggio): ResponseInterface
    {
        $response = new Response();
        $response->getBody()->write(json_encode([
            'error' => $messaggio
        ]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}