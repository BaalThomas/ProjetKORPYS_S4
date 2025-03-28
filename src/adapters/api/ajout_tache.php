<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';

function getTacheById(int $id_tache): array
{
    global $db;

    $res = $db->prepare("SELECT * FROM TACHES WHERE id_tache = :id_tache");
    $res->bindParam(':id_tache', $id_tache);

    try {
        $res->execute();
        return $res->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $exception) {
        return [];
    }
}

function generateRandomId($length = 8): int
{
    $id = '';
    for ($i = 0; $i < $length; $i++) {
        $id .= rand(0, 9);
    }
    return (int) $id;
}

// Vérifier que toutes les données nécessaires sont présentes
if (!isset($_POST['id_projet']) || !isset($_POST['date_tache']) || !isset($_POST['nom_tache']) || !isset($_POST['description_tache']) || !isset($_POST['duree_tache'])) {
    $json["status"] = "error";
    $json["message"] = "Donnée(s) manquante(s).";
    echo json_encode($json);
    exit();
}

// Récupérer les données de la requête POST
$id_projet = $_POST['id_projet'];
$date_tache = $_POST['date_tache'];
$nom_tache = $_POST['nom_tache'];
$description_tache = $_POST['description_tache'];
$duree_tache = $_POST['duree_tache'];

// Vérifier si l'ID de la tâche existe déjà
do {
    $id_tache = generateRandomId();
} while (!empty(getTacheById($id_tache)));

// Préparer la requête d'insertion
$res = $db->prepare("INSERT INTO TACHES (`id_tache`, `id_projet`, `date_tache`, `nom_tache`, `description_tache`, `duree_tache`) VALUES (:id_tache, :id_projet, :date_tache, :nom_tache, :description_tache, :duree_tache)");

$res->bindParam(':id_tache', $id_tache);
$res->bindParam(':id_projet', $id_projet);
$res->bindParam(':date_tache', $date_tache);
$res->bindParam(':nom_tache', $nom_tache);
$res->bindParam(':description_tache', $description_tache);
$res->bindParam(':duree_tache', $duree_tache);


try {
    $res->execute();
    $json["status"] = "success";
    $json["message"] = $id_tache;
} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = "Erreur lors de l'insertion : " . $exception->getMessage();
}




echo json_encode($json);
?>