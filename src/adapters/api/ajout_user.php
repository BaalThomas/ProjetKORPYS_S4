<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';
function getUserById(int $id_user): array {

    global $db;  // Assurez-vous que $db est accessible à l'intérieur de la fonction


    $res = $db->prepare("SELECT * FROM USERS WHERE id_user = :autrement");


    $res->bindParam(':autrement', $id_user);
 
    try {

        $res->execute();
        $json["status"] = "success";
        $json["message"] = "Sélection réussie";
        $json["data"] = $res->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $exception) {

        $json["status"] = "error";
        $json["message"] = $exception->getMessage();
        $json["data"] = [];
    }



    return $json;  // Retourne la réponse sous forme de tableau associatif
}

function generateRandomId($length = 8){
    $id = '';
    for($i=0; $i < $length; $i++){
        $id .= rand(0,9);
    }
    return (int)$id;
}


if (!isset($_POST['email']) || !isset($_POST['mdp'])) {
    $json["status"] = "error";
    $json["message"] = "Email ou mot de passe manquant.";
    echo json_encode($json);
    exit();
}


$mail = $_POST['email'];
$mdp = $_POST['mdp'];

do{
    $id = generateRandomId();
}while(getUserById($id)[0]);






$res = $db->prepare("INSERT INTO USERS (`id_user`, `email`, `password_hash`) VALUES (:id, :email, :mdp)");


$res->bindParam(':id', $id);
$res->bindParam(':email', $mail);
$res->bindParam(':mdp', $mdp);

try {

    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Insertion réussie";
} catch (Exception $exception) {

    $json["status"] = "error";
    $json["message"] = "Erreur lors de l'insertion : " . $exception->getMessage();
}


echo json_encode($json);
