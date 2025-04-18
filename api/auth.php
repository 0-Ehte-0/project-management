<?php
require_once '../includes/config.php';
require_once '../includes/db.php';

// Handle login, register, and logout actions
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'register':
        handleRegister();
        break;
    case 'logout':
        handleLogout();
        break;
    default:
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Invalid action']);
}

function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $email = sanitizeInput($_POST['email']);
        $password = $_POST['password'];
        
        // Validate input
        if (empty($email) || empty($password)) {
            header("Location: ../login.php?error=Please fill in all fields");
            exit;
        }
        
        // Check if user exists
        $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($password, $user['password'])) {
                // Password is correct, start a new session
                session_start();
                
                // Store data in session variables
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                
                // Redirect to dashboard
                header("Location: ../dashboard.php");
            } else {
                header("Location: ../login.php?error=Invalid email or password");
            }
        } else {
            header("Location: ../login.php?error=Invalid email or password");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../login.php");
    }
}

function handleRegister() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $conn = getConnection();
        
        $username = sanitizeInput($_POST['username']);
        $email = sanitizeInput($_POST['email']);
        $password = $_POST['password'];
        $confirm_password = $_POST['confirm_password'];
        
        // Validate input
        if (empty($username) || empty($email) || empty($password) || empty($confirm_password)) {
            header("Location: ../register.php?error=Please fill in all fields");
            exit;
        }
        
        if ($password !== $confirm_password) {
            header("Location: ../register.php?error=Passwords do not match");
            exit;
        }
        
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            header("Location: ../register.php?error=Email already exists");
            exit;
        }
        
        // Check if username already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            header("Location: ../register.php?error=Username already exists");
            exit;
        }
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $hashed_password);
        
        if ($stmt->execute()) {
            header("Location: ../login.php?success=Registration successful. Please login.");
        } else {
            header("Location: ../register.php?error=Registration failed. Please try again.");
        }
        
        $stmt->close();
        closeConnection($conn);
    } else {
        header("Location: ../register.php");
    }
}

function handleLogout() {
    // Initialize the session
    session_start();
    
    // Unset all session variables
    $_SESSION = array();
    
    // Destroy the session
    session_destroy();
    
    // Redirect to login page
    header("Location: ../login.php");
    exit;
}
?>
