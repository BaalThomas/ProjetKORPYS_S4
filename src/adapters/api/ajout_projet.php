<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';
require_once 'get_projet.php';

// on fera le cryptage du mdp à la fin si on a le temp
function get_random_chaine(): string {

    $salt = "";
    $chars_possibles = ' !?#$%&0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for($i = 0; $i < 20; $i++) {
        $salt .= $chars_possibles[rand(0, strlen($chars_possibles)-1)];
    }
    return $salt;
}

$id;
do {
    $id = get_random_chaine();
}while(getProjetbyId($id)!=[]);


$query =
"INSERT INTO PROJET
(`id_projet`, `id_user`, `nom_projet`, `description_projet`, `status_projet`, `date_debut`, `date_max`)
VALUES
($id, `id_user`, `nom_projet`, `description_projet`, `status_projet`, `date_debut`, `date_max`)";

$res = $db->prepare($query);

$res->bindParam(param: ':id_user', var: $_POST['id_user']);
$res->bindParam(':nom_projet', $_POST['nom_projet']);
$res->bindParam(param: ':description_projet', var: $_POST['description_projet']);
$res->bindParam(param: ':status_projet', var: $_POST['status_projet']);
$res->bindParam(param: ':date_debut', var: $_POST['date_debut']);
$res->bindParam(param: ':date_max', var: $_POST['date_max']);



try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Insertion réussie";

} catch(Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}


echo json_encode($json);