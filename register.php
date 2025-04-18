<?php
require_once 'includes/config.php';

// Redirect if already logged in
redirectIfLoggedIn();

// Include header
include_once 'includes/header.php';
?>

<div class="auth-container">
    <h2>Register</h2>
    
    <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger"><?php echo $_GET['error']; ?></div>
    <?php endif; ?>
    
    <form action="api/auth.php?action=register" method="post">
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>
        <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <input type="password" id="confirm_password" name="confirm_password" required>
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <p>Already have an account? <a href="login.php">Login</a></p>
</div>

<?php include_once 'includes/footer.php'; ?>
