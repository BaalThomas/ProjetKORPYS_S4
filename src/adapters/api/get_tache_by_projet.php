<?php

require_once '../database/connexion.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_projet'])) {
    $id_projet = $_POST['id_projet'];
    

    $query = "SELECT * FROM TACHES WHERE id_projet = :id_projet";
    $res = $db->prepare($query);
    $res->bindParam(':id_projet', $id_projet, PDO::PARAM_STR);

    try {
        $res->execute();
        if ($res->rowCount() > 0) {
            $projets = $res->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["status" => "success", "data" => $projets]);
        } else {
            echo json_encode(["status" => "error", "message" => "Aucune tache trouvé"]);
        }
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Veuillez vous connecter"]);
}
?>