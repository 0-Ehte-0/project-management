<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in
requireLogin();

// Handle project CRUD operations
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'create':
        createProject();
        break;
    case 'update':
        updateProject();
        break;
    case 'delete':
        deleteProject();
        break;
    default:
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Invalid action']);
}

function createProject() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $name = sanitizeInput($_POST['name']);
        $description = sanitizeInput($_POST['description']);
        $status = sanitizeInput($_POST['status']);
        $user_id = $_SESSION['user_id'];
        
        // Validate input
        if (empty($name)) {
            header("Location: ../projects.php?error=Project name is required");
            exit;
        }
        
        // Insert new project
        $stmt = $conn->prepare("INSERT INTO projects (name, description, status, user_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $name, $description, $status, $user_id);
        
        if ($stmt->execute()) {
            header("Location: ../projects.php?success=Project created successfully");
        } else {
            header("Location: ../projects.php?error=Failed to create project");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}

function updateProject() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $id = sanitizeInput($_POST['id']);
        $name = sanitizeInput($_POST['name']);
        $description = sanitizeInput($_POST['description']);
        $status = sanitizeInput($_POST['status']);
        $user_id = $_SESSION['user_id'];
        
        // Validate input
        if (empty($name) || empty($id)) {
            header("Location: ../projects.php?error=Project name and ID are required");
            exit;
        }
        
        // Check if project belongs to user
        $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header("Location: ../projects.php?error=Project not found or access denied");
            exit;
        }
        
        // Update project
        $stmt = $conn->prepare("UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ? AND user_id = ?");
        $stmt->bind_param("sssii", $name, $description, $status, $id, $user_id);
        
        if ($stmt->execute()) {
            header("Location: ../projects.php?success=Project updated successfully");
        } else {
            header("Location: ../projects.php?error=Failed to update project");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}

function deleteProject() {
    if (isset($_GET['id'])) {
        $conn = getConnection();
        
        $id = sanitizeInput($_GET['id']);
        $user_id = $_SESSION['user_id'];
        
        // Check if project belongs to user
        $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header("Location: ../projects.php?error=Project not found or access denied");
            exit;
        }
        
        // Delete project (tasks will be deleted automatically due to ON DELETE CASCADE)
        $stmt = $conn->prepare("DELETE FROM projects WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $user_id);
        
        if ($stmt->execute()) {
            header("Location: ../projects.php?success=Project deleted successfully");
        } else {
            header("Location: ../projects.php?error=Failed to delete project");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}
?>
