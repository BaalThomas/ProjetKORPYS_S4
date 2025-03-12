<?php declare(strict_types=1);

//------------La prochaine chose à faire : à réfactorer !


// Inclure la connexion à la base de données
require_once '../database/connexion.php';

// Fonction pour obtenir un utilisateur par son ID
function getProjetbyId(int $id_projet): array {
    global $db;  // Assurez-vous que $db est accessible à l'intérieur de la fonction

    $json = [];

    $query = "SELECT * FROM USERS WHERE id_user = :id_user";

    $res = $db->prepare($query);
    $res->bindParam(":id_projet", $id_projet, PDO::PARAM_INT);

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
?>
