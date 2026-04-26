<?php

namespace Model;
use Util\Connection;
use PDO;

class ParcheggiRepository{

    private $config;
    private PDO $pdo;

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

    public function getAllReservations() : array {
        $stmt = $this->pdo->prepare('SELECT r.uuid, r.start_time, r.end_time, r.status, r.id_user, r.id_parking_lot, p.name AS parking_name
                                     FROM reservation r
                                     INNER JOIN parking_lot p ON p.id = r.id_parking_lot');
        $stmt->execute([  ]);

        return $stmt->fetchAll();
    }

    public function getReservationById(string $id) : array {
        $stmt = $this->pdo->prepare('SELECT r.uuid, r.start_time, r.end_time, r.status, r.id_user, r.id_parking_lot, p.name AS parking_name
                                     FROM reservation r
                                     INNER JOIN parking_lot p ON p.id = r.id_parking_lot
                                     WHERE r.uuid = :id');
        $stmt->execute([ 'id' => $id ]);

        return $stmt->fetchAll();
    }

    //da sistemare con l'autenitcazione
    public function getReservationByUserId($user_id) : array {
        $stmt = $this->pdo->prepare('SELECT r.uuid, r.start_time, r.end_time, r.status, r.id_user, r.id_parking_lot, p.name AS parking_name
                                     FROM reservation r
                                     INNER JOIN parking_lot p ON p.id = r.id_parking_lot
                                     WHERE r.id_user = :user_id');
        $stmt->execute([ 'user_id' => $user_id ]);

        return $stmt->fetchAll();
    }

    public function userCreateReservation(string $start_time, string $end_time, string $id_parking_lot, string $id_user) : array {
        //Logica di creazione
        $stmt = $this->pdo->prepare('INSERT INTO reservation (uuid, start_time, end_time, status, id_parking_lot, id_user) 
                                    VALUES (UUID(), :start_time, :end_time, :status, :id_parking_lot, :id_user)');
        $stmt->execute([
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE',
            'id_parking_lot' => $id_parking_lot,
            'id_user' => $id_user
        ]);

        $id = $this->pdo->lastInsertId();

        return [
            'id' => $id,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE',
            'id_parking_lot' => $id_parking_lot,
            'parking_name' => $this->getParkingNameById($id_parking_lot),
            'id_user' => $id_user
        ];
    }

    public function editUserReservation(string $id, string $license_plate, string $start_time, string $end_time, string $id_parking_lot) : array {
        //Logica di modifica
        $stmt = $this->pdo->prepare('UPDATE reservation 
                                    SET start_time = :start_time, end_time = :end_time 
                                    WHERE uuid = :id');
        $stmt->execute([
            'id' => $id,
            'start_time' => $start_time,
            'end_time' => $end_time
        ]);

        return [
            'id' => $id,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'id_parking_lot' => $id_parking_lot,
            'parking_name' => $this->getParkingNameById($id_parking_lot)
        ];
    }

    private function getParkingNameById(string $id_parking_lot): ?string {
        $stmt = $this->pdo->prepare('SELECT name FROM parking_lot WHERE id = :id LIMIT 1');
        $stmt->execute([ 'id' => $id_parking_lot ]);

        $parkingName = $stmt->fetchColumn();

        return $parkingName === false ? null : $parkingName;
    }

    public function deleteReservation(string $id) : string {
        //Logica di eliminazione
        $stmt = $this->pdo->prepare('DELETE FROM reservation WHERE uuid = :id');
        $stmt->execute([ 'id' => $id ]);

        return $id;
    }

}