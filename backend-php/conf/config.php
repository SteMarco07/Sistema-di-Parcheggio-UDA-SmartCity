<?php

define('JWT_SECRET', 'una_stringa_segreta_lunga_e_difficile');
define('JWT_ALGO', 'HS256');
define('JWT_EXPIRE_MINUTES', 60);

define('DB_HOST', $_ENV['MYSQL_HOST']     ?? 'database');
define('DB_NAME', $_ENV['MYSQL_DATABASE'] ?? '');
define('DB_USER', $_ENV['MYSQL_USER']     ?? '');
define('DB_PASSWORD', $_ENV['MYSQL_PASSWORD'] ?? '');
define('DB_CHAR', 'utf8mb4');