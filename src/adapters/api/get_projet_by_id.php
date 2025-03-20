<?php
// Inclure la connexion à la base de données
require_once '../database/connexion.php';

// Vérifier si une requête POST avec l'id_user a été envoyée
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_projet'])) {
    $id_projet = $_POST['id_projet'];
    
    // Exécuter la requête SQL pour récupérer les projets par id_projet
    $query = "SELECT * FROM PROJET WHERE id_projet = :id_projet";
    $res = $db->prepare($query);
    $res->bindParam(':id_projet', $id_projet, PDO::PARAM_STR);

    try {
        $res->execute();
        if ($res->rowCount() > 0) {
            $projets = $res->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $projets]);
        } else {
            echo json_encode(["status" => "error", "message" => "Aucun projet trouvé"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Veuillez vous connecter"]);
}
?>