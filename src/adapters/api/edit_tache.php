<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id_tache'], $_POST['nom_tache'], $_POST['description_tache'], $_POST['date_tache'], $_POST['duree_tache'])) {
        $json["status"] = "error";
        $json["message"] = "Données manquantes.";
        echo json_encode($json);
        exit();
    }

    // Récupérer les données
    $id_tache = $_POST['id_tache'];
    $nom_tache = $_POST['nom_tache'];
    $description_tache = $_POST['description_tache'];
    $date_tache = $_POST['date_tache'];
    $duree_tache = $_POST['duree_tache'];

    // Préparer la requête de mise à jour
    $res = $db->prepare("UPDATE TACHES SET nom_tache = :nom_tache, description_tache = :description_tache, date_tache = :date_tache, duree_tache = :duree_tache WHERE id_tache = :id_tache");
    $res->bindParam(':id_tache', $id_tache, PDO::PARAM_INT);
    $res->bindParam(':nom_tache', $nom_tache, PDO::PARAM_STR);
    $res->bindParam(':description_tache', $description_tache, PDO::PARAM_STR);
    $res->bindParam(':date_tache', $date_tache, PDO::PARAM_STR);
    $res->bindParam(':duree_tache', $duree_tache, PDO::PARAM_INT);

    try {
        $res->execute();
        if ($res->rowCount() > 0) {
            $json["status"] = "success";
            $json["message"] = "Tâche modifiée avec succès.";
        } else {
            $json["status"] = "error";
            $json["message"] = "Aucune modification effectuée.";
        }
    } catch (Exception $exception) {
        $json["status"] = "error";
        $json["message"] = "Erreur lors de la modification : " . $exception->getMessage();
    }

    echo json_encode($json);
}
?>