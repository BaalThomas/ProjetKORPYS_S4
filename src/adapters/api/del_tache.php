<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("Données reçues : " . print_r($_POST, true)); // Enregistre les données dans le journal PHP
    if (!isset($_POST['id_tache'])) {
        $json["status"] = "error";
        $json["message"] = "ID de la tâche manquant.";
        echo json_encode($json);
        exit();
    }
}

// Récupérer l'ID de la tâche
$id_tache = $_POST['id_tache'];

// Préparer la requête de suppression
$res = $db->prepare("DELETE FROM TACHES WHERE id_tache = :id_tache");
$res->bindParam(':id_tache', $id_tache, PDO::PARAM_INT);

try {
    $res->execute();
    if ($res->rowCount() > 0) {
        $json["status"] = "success";
        $json["message"] = "Tâche supprimée avec succès.";
    } else {
        $json["status"] = "error";
        $json["message"] = "Aucune tâche trouvée avec cet ID.";
    }
} catch (Exception $exception) {
    $json["status"] = "error";
    $json["message"] = "Erreur lors de la suppression : " . $exception->getMessage();
}

echo json_encode($json);
?>