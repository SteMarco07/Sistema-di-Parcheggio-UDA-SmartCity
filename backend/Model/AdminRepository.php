<?php

namespace Model;
use Util\Connection;

class AdminRepository{

    private $config;
    private $pdo;

    public function __construct($config) {
        $this->config = $config;
        $this->pdo = Connection::getInstance($this->config);
    }

    public function addPark(string $name, int $total_spots, float $latitude, float $longitude, float $hour_tax, string $description) {
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

        return [
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'description' => $description,
            'hour_tax' => $hour_tax
        ];
    }

    public function modifyPark(int $id, string $name, int $total_spots, float $latitude, float $longitude) {
        $stmt = $this->pdo->prepare('UPDATE parking_lot 
                                    SET name = :name, total_spots = :total_spots, latitude = :latitude, longitude = :longitude
                                    WHERE id = :id');

        $stmt->execute([
            'id' => $id,
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude
        ]);

        return [
            'id' => $id,
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude
        ];
    }

    public function deletePark(int $id) {
        $stmt = $this->pdo->prepare('DELETE FROM parking_lot WHERE id = :id');
        $stmt->execute([ 'id' => $id ]);

        return [ 'id' => $id ];
    }
}