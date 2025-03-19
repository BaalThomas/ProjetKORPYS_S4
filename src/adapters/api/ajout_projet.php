<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';
function getProjetById(int $id_projet): array {

    global $db;  // Assurez-vous que $db est accessible à l'intérieur de la fonction


    $res = $db->prepare("SELECT * FROM PROJET WHERE id_projet = :autrement");


    $res->bindParam(':autrement', $id_projet);
 
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


if (!isset($_POST['nom_projet']) || !isset($_POST['description_projet']) || !isset($_POST['date_max'])) {
    $json["status"] = "error";
    $json["message"] = "Donnée(s) manquante(s).";
    echo json_encode($json);
    exit();
}

$id_user = $_POST['id_user'];
$nom_projet = $_POST['nom_projet'];
$description_projet = $_POST['description_projet'];
$status_projet = "En cours";
$date_debut = date_create()->format('Y-m-d');
$date_max = $_POST['date_max'];

do{
    $id_projet = generateRandomId();
}while(getProjetById($id)[0]);



$res = $db->prepare("INSERT INTO PROJET (`id_projet`,`id_user`, `nom_projet`, `desription_projet`, `status_projet`, `date_debut`, `date_max`) VALUES (:id_projet, :id_user, :description_projet, :status_projet, :date_debut, :date_max)");


$res->bindParam(':id_projet', $id_projet);
$res->bindParam(':id_user', $id_user);
$res->bindParam(':nom_projet', $nom_projet);
$res->bindParam(':description_projet', $description_projet);
$res->bindParam(':status_projet', $status_projet);
$res->bindParam(':date_debut', $date_debut);
$res->bindParam(':date_max', $date_max);

try {

    $res->execute();
    $json["status"] = "success";
    $json["message"] = "Insertion réussie";
} catch (Exception $exception) {

    $json["status"] = "error";
    $json["message"] = "Erreur lors de l'insertion : " . $exception->getMessage();
}


echo json_encode($json);
