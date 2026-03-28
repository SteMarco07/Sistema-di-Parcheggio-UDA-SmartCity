<?php

namespace App\Model;

use App\Util\Connection;
use Firebase\JWT\JWT;

class UserRepository
{
    /**
     * Verifica le credenziali e restituisce i dati dell'utente, o null se non valide.
     * La password è confrontata con password_verify(), quindi nel db va memorizzato
     * l'hash prodotto da password_hash().
     */
    public static function verifyCredentials(string $username, string $password): ?string
    {
        $pdo = Connection::getInstance();
        $stmt = $pdo->prepare('SELECT * FROM user WHERE username = :username');
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return self::generateToken($user['id'], $username);
        }
        return null;
    }
    private static function generateToken(int $id, string $username): string
    {
        $emissione = new \DateTimeImmutable();
        $scadenza = $emissione->modify('+' . JWT_EXPIRE_MINUTES . ' minutes');

        $payload = [
            'iat'  => $emissione->getTimestamp(),   // Issued at: quando è stato emesso
            'exp'  => $scadenza->getTimestamp(),    // Expiration: quando scade
            'data' => [                             // Dati applicativi
                'id'       => $id,
                'username' => $username,
            ]
        ];

        return JWT::encode($payload, JWT_SECRET, JWT_ALGO);
    }
}
