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

    public function getAvailableParcheggi(string $start_time, string $end_time) : array {
        $this->validateTimeRange($start_time, $end_time);

        $stmt = $this->pdo->prepare('SELECT p.id,
                                            p.name,
                                            p.total_spots,
                                            p.latitude,
                                            p.longitude,
                                            p.description,
                                            p.hour_tax,
                                            COUNT(r.uuid) AS occupied_spots,
                                            (p.total_spots - COUNT(r.uuid)) AS free_spots
                                     FROM parking_lot p
                                     LEFT JOIN reservation r
                                       ON r.id_parking_lot = p.id
                                      AND r.status = :status
                                      AND :start_time < r.end_time
                                      AND :end_time > r.start_time
                                     GROUP BY p.id, p.name, p.total_spots, p.latitude, p.longitude, p.description, p.hour_tax
                                     HAVING free_spots > 0');
        $stmt->execute([
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE'
        ]);

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
                                     WHERE r.id_user = :user_id AND
                                        r.status = "ACTIVE"');
        $stmt->execute([ 'user_id' => $user_id ]);

        return $stmt->fetchAll();
    }

    public function userCreateReservation(string $start_time, string $end_time, string $id_parking_lot, string $id_user) : array {
        $this->validateTimeRange($start_time, $end_time);

        if (!$this->isParkingLotAvailable($id_parking_lot, $start_time, $end_time)) {
            throw new \RuntimeException('Parcheggio non disponibile nell\'intervallo selezionato', 409);
        }

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
            'uuid' => $id,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'status' => 'ACTIVE',
            'id_parking_lot' => $id_parking_lot,
            'parking_name' => $this->getParkingNameById($id_parking_lot),
            'id_user' => $id_user
        ];
    }

    public function editUserReservation(string $id, string $start_time, string $end_time, string $id_parking_lot) : array {
        $this->validateTimeRange($start_time, $end_time);

        if (!$this->isParkingLotAvailable($id_parking_lot, $start_time, $end_time)) {
            throw new \RuntimeException('Parcheggio non disponibile nell\'intervallo selezionato', 409);
        }

        //Logica di modifica
        $stmt = $this->pdo->prepare('UPDATE reservation 
                                    SET start_time = :start_time, end_time = :end_time, id_parking_lot = :id_parking_lot
                                    WHERE uuid = :id');
        $stmt->execute([
            'id' => $id,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'id_parking_lot' => $id_parking_lot
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

    public function isParkingLotAvailable(string $id_parking_lot, string $start_time, string $end_time): bool {
        $this->validateTimeRange($start_time, $end_time);

        $stmt = $this->pdo->prepare('SELECT COUNT(*)
                  FROM reservation r
                  WHERE r.id_parking_lot = :id_parking_lot
                    AND r.status = :status
                    AND :start_time < r.end_time
                    AND :end_time > r.start_time');
        $stmt->execute([
            'id_parking_lot' => $id_parking_lot,
            'status' => 'ACTIVE',
            'start_time' => $start_time,
            'end_time' => $end_time
        ]);

        return (int) $stmt->fetchColumn() === 0;
    }

    private function validateTimeRange(string $start_time, string $end_time): void {
        $start = strtotime($start_time);
        $end = strtotime($end_time);

        if ($start === false || $end === false || $start >= $end) {
            throw new \RuntimeException('Intervallo orario non valido', 422);
        }
    }

    public function deleteReservation(string $id) : string {
        //Logica di eliminazione
        $stmt = $this->pdo->prepare('UPDATE reservation 
                                    SET status = "CANCELLED"
                                    WHERE uuid = :id');
        $stmt->execute([ 'id' => $id ]);

        return $id;
    }

}