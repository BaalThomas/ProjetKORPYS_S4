<?php
// Inclure la connexion à la base de données
require_once '../database/connexion.php';

// Vérifier si une requête POST avec l'email a été envoyée
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $email = $_POST['email'];
    
    // Exécuter la requête SQL pour récupérer l'utilisateur par son email
    $query = "SELECT * FROM USERS WHERE email = :email";
    $res = $db->prepare($query);
    $res->bindParam(':email', $email, PDO::PARAM_STR);

    try {
        $res->execute();
        if ($res->rowCount() > 0) {
            $user = $res->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Utilisateur non trouvé"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Email non fourni"]);
}
?>
