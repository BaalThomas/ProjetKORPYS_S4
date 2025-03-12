<?php
// Votre code de connexion à la base de données
$db_config['SGBD'] = 'mysql';
$db_config['HOST'] = 'devbdd.iutmetz.univ-lorraine.fr';
$db_config['DB_NAME'] = 'baillar14u_korpys';
$db_config['USER'] = 'baillar14u_appli';
$db_config['PASSWORD'] = 'Polikujj100!';

try {
    $db = new PDO(
        $db_config['SGBD'] . ':host=' . $db_config['HOST'] . ';dbname=' . $db_config['DB_NAME'],
        $db_config['USER'],
        $db_config['PASSWORD'],
        [
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4',
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, 
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ] 
    );
    // Détruire la variable de configuration pour éviter toute fuite de données sensibles
    unset($db_config);
} catch (Exception $exception) {
    die("Erreur de connexion : " . $exception->getMessage());
}
?>
