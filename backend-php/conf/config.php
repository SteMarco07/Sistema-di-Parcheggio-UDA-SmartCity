<?php

const DB_HOST = 'database'; //può essere un indirizzo IP o un nome DNS

const DB_NAME = 'smartcity'; 

const DB_USER = 'root';

const DB_PASS = 'rootpassword';

const BASEPATH = '/api';

const JWT_SECRET = 'aa1ec7a2a8ff7768ea28cfa05709fb70806136622d33c0e123acc1fffbbabda0';

const JWT_EXPIRE_MINUTES = 60;

const JWT_ALGO = 'HS256';

return [
    'DB_HOST' => DB_HOST,
    'DB_NAME' => DB_NAME,
    'DB_USER' => DB_USER,
    'DB_PASS' => DB_PASS,
    'BASEPATH' => BASEPATH,
    'JWT_SECRET' => JWT_SECRET,
    'JWT_EXPIRE_MINUTES' => JWT_EXPIRE_MINUTES,
    'JWT_ALGO' => JWT_ALGO,
    'PRODUCTION' => false
];