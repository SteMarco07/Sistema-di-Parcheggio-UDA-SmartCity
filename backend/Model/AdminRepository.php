<?php

namespace Model;
use Util\Connection;
use PDOException;

class AdminRepository{

    private $config;
    private $pdo;

    public function __construct($config) {
        $this->config = $config;
        $this->pdo = Connection::getInstance($this->config);
    }

    public function addPark(string $name, int $total_spots, float $latitude, float $longitude, float $hour_tax, string $description) {
        $name = trim($name);

        if ($this->existsByName($name)) {
            throw new \RuntimeException("Nome parcheggio gia' esistente", 409);
        }

        $stmt = $this->pdo->prepare('INSERT INTO parking_lot (name, total_spots, latitude, longitude, description, hour_tax) 
                                    VALUES (:name, :total_spots, :latitude, :longitude, :description, :hour_tax)');

        $stmt->execute([
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'description' => $description,
            'hour_tax' => $hour_tax
        ]);

        $id = (int) $this->pdo->lastInsertId();

        return [
            'id' => $id,
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'description' => $description,
            'hour_tax' => $hour_tax
        ];
    }

    private function existsByName(string $name): bool {
        $stmt = $this->pdo->prepare('SELECT 1 FROM parking_lot WHERE name = :name LIMIT 1');
        $stmt->execute([ 'name' => $name ]);

        return (bool) $stmt->fetchColumn();
    }

    public function modifyPark(int $id, string $name, int $total_spots, float $latitude, float $longitude, float $hour_tax, string $description) {
        $stmt = $this->pdo->prepare('UPDATE parking_lot 
                                    SET name = :name, total_spots = :total_spots, latitude = :latitude, longitude = :longitude, hour_tax = :hour_tax, description = :description
                                    WHERE id = :id');

        $stmt->execute([
            'id' => $id,
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'hour_tax' => $hour_tax,
            'description' => $description,

        ]);

        return [
            'id' => $id,
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'description' => $description,
            'hour_tax' => $hour_tax
        ];
    }

    public function deletePark(int $id) {
        $stmt = $this->pdo->prepare('DELETE FROM parking_lot WHERE id = :id');
        $stmt->execute([ 'id' => $id ]);

        return [ 'id' => $id, 'message' => 'Parcheggio eliminato', 'success' => true ];
    }
}