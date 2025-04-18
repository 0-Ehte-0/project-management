<?php
require_once 'includes/config.php';

// Redirect to dashboard if logged in
if (isLoggedIn()) {
    header("Location: dashboard.php");
    exit;
}

// Include header
include_once 'includes/header.php';
?>

<div class="welcome-section">
    <h1>Welcome to Project Manager</h1>
    <p>A simple tool to manage your projects and tasks</p>
    <div class="welcome-buttons">
        <a href="login.php" class="btn btn-primary">Login</a>
        <a href="register.php" class="btn btn-secondary">Register</a>
    </div>
</div>

<div class="features-section">
    <h2>Features</h2>
    <div class="features-grid">
        <div class="feature-card">
            <i class="fas fa-tasks"></i>
            <h3>Project Management</h3>
            <p>Create and manage multiple projects</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-check-circle"></i>
            <h3>Task Tracking</h3>
            <p>Track tasks within each project</p>
        </div>
        <div class="feature-card">
            <i class="fas fa-chart-line"></i>
            <h3>Progress Monitoring</h3>
            <p>Monitor project and task status</p>
        </div>
    </div>
</div>

<?php include_once 'includes/footer.php'; ?>
