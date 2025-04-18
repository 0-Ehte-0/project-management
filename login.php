<?php
require_once 'includes/config.php';

// Redirect if already logged in
redirectIfLoggedIn();

// Include header
include_once 'includes/header.php';
?>

<div class="auth-container">
    <h2>Login</h2>
    
    <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger"><?php echo $_GET['error']; ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success"><?php echo $_GET['success']; ?></div>
    <?php endif; ?>
    
    <form action="api/auth.php?action=login" method="post">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <p>Don't have an account? <a href="register.php">Register</a></p>
</div>

<?php include_once 'includes/footer.php'; ?>
