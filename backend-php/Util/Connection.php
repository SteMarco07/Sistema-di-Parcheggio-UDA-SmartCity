<?php

namespace App\Util;

use PDO;

/**
 * Singleton per la connessione al database.
 * Le costanti DB_* sono definite in conf/config.php e caricate da index.php.
 */
class Connection
{
    private static ?PDO $pdo = null;

    private function __construct()
    {
    }

    public static function getInstance(): PDO
    {
        if (self::$pdo === null) {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHAR;
            self::$pdo = new PDO($dsn, DB_USER, DB_PASSWORD, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        }
        return self::$pdo;
    }
}
