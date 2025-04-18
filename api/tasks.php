<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Check if user is logged in
requireLogin();

// Handle task CRUD operations
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'create':
        createTask();
        break;
    case 'update':
        updateTask();
        break;
    case 'delete':
        deleteTask();
        break;
    default:
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Invalid action']);
}

function createTask() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $title = sanitizeInput($_POST['title']);
        $description = sanitizeInput($_POST['description']);
        $status = sanitizeInput($_POST['status']);
        $project_id = sanitizeInput($_POST['project_id']);
        $user_id = $_SESSION['user_id'];
        
        // Validate input
        if (empty($title) || empty($project_id)) {
            header("Location: ../tasks.php?project_id=$project_id&error=Task title is required");
            exit;
        }
        
        // Check if project belongs to user
        $stmt = $conn->prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $project_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header("Location: ../projects.php?error=Project not found or access denied");
            exit;
        }
        
        // Insert new task
        $stmt = $conn->prepare("INSERT INTO tasks (title, description, status, project_id) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $title, $description, $status, $project_id);
        
        if ($stmt->execute()) {
            header("Location: ../tasks.php?project_id=$project_id&success=Task created successfully");
        } else {
            header("Location: ../tasks.php?project_id=$project_id&error=Failed to create task");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}

function updateTask() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $id = sanitizeInput($_POST['id']);
        $title = sanitizeInput($_POST['title']);
        $description = sanitizeInput($_POST['description']);
        $status = sanitizeInput($_POST['status']);
        $project_id = sanitizeInput($_POST['project_id']);
        $user_id = $_SESSION['user_id'];
        
        // Validate input
        if (empty($title) || empty($id) || empty($project_id)) {
            header("Location: ../tasks.php?project_id=$project_id&error=Task title and ID are required");
            exit;
        }
        
        // Check if project belongs to user
        $stmt = $conn->prepare("SELECT p.id FROM projects p JOIN tasks t ON p.id = t.project_id WHERE t.id = ? AND p.user_id = ?");
        $stmt->bind_param("ii", $id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header("Location: ../projects.php?error=Task not found or access denied");
            exit;
        }
        
        // Update task
        $stmt = $conn->prepare("UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?");
        $stmt->bind_param("sssi", $title, $description, $status, $id);
        
        if ($stmt->execute()) {
            header("Location: ../tasks.php?project_id=$project_id&success=Task updated successfully");
        } else {
            header("Location: ../tasks.php?project_id=$project_id&error=Failed to update task");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}

function deleteTask() {
    if (isset($_GET['id']) && isset($_GET['project_id'])) {
        $conn = getConnection();
        
        $id = sanitizeInput($_GET['id']);
        $project_id = sanitizeInput($_GET['project_id']);
        $user_id = $_SESSION['user_id'];
        
        // Check if task belongs to user's project
        $stmt = $conn->prepare("SELECT t.id FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ? AND p.user_id = ?");
        $stmt->bind_param("ii", $id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            header("Location: ../tasks.php?project_id=$project_id&error=Task not found or access denied");
            exit;
        }
        
        // Delete task
        $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            header("Location: ../tasks.php?project_id=$project_id&success=Task deleted successfully");
        } else {
            header("Location: ../tasks.php?project_id=$project_id&error=Failed to delete task");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../projects.php");
    }
}
?>
