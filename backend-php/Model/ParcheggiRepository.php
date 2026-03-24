<?php

namespace Model;
use Util\Connection;

class ParcheggiRepository{

    private $config;
    private $pdo;

    public function __construct($config) {
        $this->config = $config;
        $this->pdo = Connection::getInstance($this->config);
    }

    public function getParcheggioById(string $id) : array {
        $stmt = $this->pdo->prepare('SELECT * FROM parking_lot WHERE id = :id');
        $stmt->execute([ 'id' => $id ]);

        return $stmt->fetch();
    }

    public function getAllParcheggi() : array {
        $stmt = $this->pdo->prepare('SELECT * FROM parking_lot');
        $stmt->execute([  ]);

        return $stmt->fetchAll();
    }

    public function getReservationById(string $id) : array {
        $stmt = $this->pdo->prepare('SELECT * FROM reservation WHERE uuid = :id');
        $stmt->execute([ 'id' => $id ]);

        return $stmt->fetchAll();
    }

    //da sistemare con l'autenitcazione
    public function getReservationByUserId($user_id) : array {
        $stmt = $this->pdo->prepare('SELECT * FROM reservation WHERE user_id = :user_id');
        $stmt->execute([ 'user_id' => $user_id ]);

        return $stmt->fetchAll();
    }

    public function userCreateReservation(string $id, string $first_name, string $last_name, string $license_plate, string $start_time, string $end_time, string $id_parking_lot) : array {
        //Logica di creazione
        $stmt = $this->pdo->prepare('INSERT INTO reservation (uuid, first_name, last_name, license_plate, start_time, end_time, status, id_parking_lot) 
                                    VALUES (:id,:first_name, :last_name, :license_plate, :start_time, :end_time, :status, :id_parking_lot)');
        $stmt->execute([
            'id' => $id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'license_plate' => $license_plate,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE',
            'id_parking_lot' => $id_parking_lot
        ]);

        return [
            'id' => $id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'license_plate' => $license_plate,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE',
            'id_parking_lot' => $id_parking_lot
        ];
    }

    public function editUserReservation(string $id, string $license_plate, string $start_time, string $end_time, string $id_parking_lot) : array {
        //Logica di modifica
        $stmt = $this->pdo->prepare('UPDATE reservation 
                                    SET license_plate = :license_plate, start_time = :start_time , end_time = :end_time 
                                    WHERE uuid = :id');
        $stmt->execute([
            'id' => $id,
            'license_plate' => $license_plate,
            'start_time' => $start_time,
            'end_time' => $end_time
        ]);

        return [
            'id' => $id,
            'license_plate' => $license_plate,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'id_parking_lot' => $id_parking_lot
        ];
    }

    public function deleteReservation(string $id) : string {
        //Logica di eliminazione
        $stmt = $this->pdo->prepare('DELETE FROM reservation WHERE uuid = :id');
        $stmt->execute([ 'id' => $id ]);

        return $id;
    }

}