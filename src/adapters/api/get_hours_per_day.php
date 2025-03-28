<?php declare(strict_types=1);

require_once '../database/connexion.php';
require_once 'header.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id_projet'])) {
        $json["status"] = "error";
        $json["message"] = "ID du projet manquant.";
        echo json_encode($json);
        exit();
    }

    $id_projet = $_POST['id_projet'];

    try {
        // Requête pour récupérer les heures de travail par jour
        $query = $db->prepare("
            SELECT DATE(date_tache) AS jour, SUM(duree_tache) AS total_heures
            FROM TACHES
            WHERE id_projet = :id_projet
            GROUP BY DATE(date_tache)
        ");
        $query->bindParam(':id_projet', $id_projet, PDO::PARAM_INT);
        $query->execute();

        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        $json["status"] = "success";
        $json["data"] = $result;
    } catch (Exception $e) {
        $json["status"] = "error";
        $json["message"] = "Erreur lors de la récupération des heures : " . $e->getMessage();
    }

    echo json_encode($json);
}
?>