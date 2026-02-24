<?php

namespace Model;
use Util\Connection;

class ParcheggiRepository{

    private $config;
    private $pdo;

    public function __construct($config){
        $this->config = $config;
        $this->pdo = Connection::getInstance($this->config);
    }

    public function getParcheggioById(string $id) : array {
        $stmt = $this->pdo->prepare('SELECT * FROM parcheggi WHERE parcheggio_id = :id');
        $stmt->execute([
            'id' => $id
        ]);
        return $stmt->fetch();
    }

    public function getAllParcheggi() : array {
        $stmt = $this->pdo->prepare('SELECT * FROM parcheggi');
        $stmt->execute([]);
        return $stmt->fetch();
    }

    public function editUserReservation(string $id, Date $data_inizio, Date $data_fine) : array
    {
        //Logica di modifica
        $stmt = $this->pdo->prepare('UPDATE prenotazioni 
                                            SET orario_inizio = :orario_inizio , orario_fine = :orario_fine 
                                            WHERE id = :id');
        $stmt->execute([
            'id' => $id,
            'orario_inizio' => $data_inizio,
            'orario_fine' => $data_fine
        ]);
        return $this->getParcheggioById($id);
    }

    public function deleteReservation(string $id) : string
    {
        //Logica di modifica
        $stmt = $this->pdo->prepare('DELETE * FROM prenotazioni
                                     WHERE id = :id');
        $stmt->execute([
            'id' => $id
        ]);
        return $id;
    }

}