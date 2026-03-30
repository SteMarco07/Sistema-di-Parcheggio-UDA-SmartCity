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

    public function addPark(string $name, int $total_spots, float $latitude, float $longitude) {
        $stmt = $this->pdo->prepare('INSERT INTO parking_lot (name, total_spots, latitude, longitude) 
                                            VALUES (:name, :total_spots, :latitude, :longitude)');
        $stmt->execute([
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude
        ]);

        return [
            'name' => $name,
            'total_spots' => $total_spots,
            'latitude' => $latitude,
            'longitude' => $longitude
        ];
    }
}