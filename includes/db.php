<?php
require_once 'config.php';

// Create database connection
function getConnection() {
    $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Close database connection
function closeConnection($conn) {
    $conn->close();
}

// Sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Getting project progress
function getProjectProgress($project_id, $conn) {
    $totalQuery = $conn->prepare("SELECT COUNT(*) FROM tasks WHERE project_id = ?");
    $totalQuery->bind_param("i", $project_id);
    $totalQuery->execute();
    $totalQuery->bind_result($totalTasks);
    $totalQuery->fetch();
    $totalQuery->close();

    $completedQuery = $conn->prepare("SELECT COUNT(*) FROM tasks WHERE project_id = ? AND status = 'Done'");
    $completedQuery->bind_param("i", $project_id);
    $completedQuery->execute();
    $completedQuery->bind_result($completedTasks);
    $completedQuery->fetch();
    $completedQuery->close();

    if ($totalTasks == 0) return 0; // Prevent division by zero

    return round(($completedTasks / $totalTasks) * 100);
}

?>
