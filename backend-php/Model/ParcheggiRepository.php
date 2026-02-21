<?php

namespace Model;
use Util\Connection;

class ParcheggiRepository{

    private $config;

    public function __construct($config){
        $this->config = $config;
    }

    public function getParcheggiById(string $id) : array {
        $pdo = Connection::getInstance($this->config);
        $stmt = $pdo->prepare('SELECT * FROM parcheggi WHERE parcheggio_id = :id');
        $stmt->execute([
            'id' => $id
        ]);
        return $stmt->fetch();
    }
}