<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';
require_once 'get_user.php';

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
}while(getUserById($id)!=[]);


$query =
"INSERT INTO USERS
(`id_user`, `email`, `password_hash`)
VALUES
($id,'email','password_hash')";

$res = $db->prepare($query);

$res->bindParam(':email', $_POST['email']);
$res->bindParam(':password_hash', $_POST['password_hash']);


try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Insertion réussie";

} catch(Exception $exception) {
    $json["status"] = "error";
    $json["message"] = $exception->getMessage();
}


echo json_encode($json);