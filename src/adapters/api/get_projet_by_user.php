<?php
// Inclure la connexion à la base de données
require_once '../database/connexion.php';

// Vérifier si une requête POST avec l'email a été envoyée
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_user'])) {
    $id_user = $_POST['id_user'];
    
    // Exécuter la requête SQL pour récupérer l'utilisateur par son email
    $query = "SELECT * FROM PROJET WHERE id_user = :id_user";
    $res = $db->prepare($query);
    $res->bindParam(':id_user', $id_user, PDO::PARAM_STR);

    try {
        $res->execute();
        if ($res->rowCount() > 0) {
            $projet = $res->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $projet]);
        } else {
            echo json_encode(["status" => "error", "message" => "Projet non trouver"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Veuillez vous connecter"]);
}
?>
