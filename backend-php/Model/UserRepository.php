<?php

namespace Model;

use Util\Connection;
use Firebase\JWT\JWT;

class UserRepository
{

    private $config;
    private $pdo;

    public function __construct($config) {
        $this->config = $config;
        $this->pdo = Connection::getInstance($this->config);
    }
    /**
     * Verifica le credenziali e restituisce i dati dell'utente, o null se non valide.
     * La password è confrontata con password_verify(), quindi nel db va memorizzato
     * l'hash prodotto da password_hash().
     */
    public function verifyCredentials(string $username, string $password): ?array {
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE username = :username');
        $stmt->execute([ 'username' => $username ]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $token = self::generateToken($user['uuid'], $username, $user['role']);
            return [
                'token' => $token,
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'license_plate' => $user['license_plate'],
                'email' => $user['email'],
                'username' => $username,
                'role' => $user['role']
            ];
        }
        return null;
    }

    private function generateToken(string $id, string $username, string $role): string {
        $emission = new \DateTimeImmutable();
        $expiration = $emission->modify('+' . $this->config['JWT_EXPIRE_MINUTES'] . ' minutes');

        $payload = [
            'iat'  => $emission->getTimestamp(),   // Issued at: quando è stato emesso
            'exp'  => $expiration->getTimestamp(),    // Expiration: quando scade
            'data' => [                             // Dati applicativi
                'id' => $id,
                'username' => $username,
                'role' => $role
            ]
        ];

        return JWT::encode($payload, $this->config['JWT_SECRET'], $this->config['JWT_ALGO']);
    }

    public function getUser(string $username) {
        $stmt = $this->pdo->prepare('SELECT * FROM user WHERE username = :username');
        $stmt->execute([ 'username' => $username ]);
        $user = $stmt->fetch();

        return [
            'username' => $user['username'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'license_plate' => $user['license_plate'],
            'email' => $user['email'],
            'role' => $user['role']
        ];
    }

    public function createUser(string $nome, string $cognome, string $targa, string $email, string $username, string $password) {
        // Normalizza input
        $username = trim((string)$username);
        $email = trim((string)$email);
        $targa = trim((string)$targa);

        $stmt = $this->pdo->prepare('INSERT INTO user (uuid, first_name, last_name, license_plate, email, username, password, role) 
                                    VALUES (UUID(), :first_name, :last_name, :license_plate, :email, :username, :password, "USER")');

        try {
            $stmt->execute([
                'first_name' => $nome,
                'last_name' => $cognome,
                'license_plate' => $targa,
                'email' => $email,
                'username' => $username,
                'password' => password_hash($password, PASSWORD_DEFAULT)
            ]);
        } catch (\PDOException $e) { return [ 'error' => 'duplicate', 'messaggio' => 'Email o username già presente' ]; }

        return [ 'messaggio' => 'Account creato con successo' ];
    }
}
