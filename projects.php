<?php
require_once 'includes/config.php';
require_once 'includes/db.php';

// Check if user is logged in
requireLogin();

// Get user's projects
$conn = getConnection();
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$projects = $stmt->get_result();

// Check if we're editing a project
$editing = false;
$edit_project = null;

if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $project_id = sanitizeInput($_GET['id']);
    
    $stmt = $conn->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $project_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $editing = true;
        $edit_project = $result->fetch_assoc();
    }
}

// Include header
include_once 'includes/header.php';
?>

<div class="projects-container">
    <div class="section-header">
        <h2>Projects</h2>
        <?php if (!$editing): ?>
            <a href="projects.php?action=new" class="btn btn-primary">New Project</a>
        <?php endif; ?>
    </div>
    
    <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger"><?php echo $_GET['error']; ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success"><?php echo $_GET['success']; ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['action']) && $_GET['action'] === 'new' || $editing): ?>
        <div class="form-container">
            <h3><?php echo $editing ? 'Edit Project' : 'New Project'; ?></h3>
            <form action="api/projects.php?action=<?php echo $editing ? 'update' : 'create'; ?>" method="post">
                <?php if ($editing): ?>
                    <input type="hidden" name="id" value="<?php echo $edit_project['id']; ?>">
                <?php endif; ?>
                
                <div class="form-group">
                    <label for="name">Project Name</label>
                    <input type="text" id="name" name="name" value="<?php echo $editing ? $edit_project['name'] : ''; ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3"><?php echo $editing ? $edit_project['description'] : ''; ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status">
                        <option value="Not Started" <?php echo $editing && $edit_project['status'] === 'Not Started' ? 'selected' : ''; ?>>Not Started</option>
                        <option value="In Progress" <?php echo $editing && $edit_project['status'] === 'In Progress' ? 'selected' : ''; ?>>In Progress</option>
                        <option value="Completed" <?php echo $editing && $edit_project['status'] === 'Completed' ? 'selected' : ''; ?>>Completed</option>
                    </select>
                </div>
                
                <div class="form-buttons">
                    <a href="projects.php" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary"><?php echo $editing ? 'Update Project' : 'Create Project'; ?></button>
                </div>
            </form>
        </div>
    <?php endif; ?>
    
    <div class="project-list">
        <?php if ($projects->num_rows > 0): ?>
            <?php while ($project = $projects->fetch_assoc()): ?>
                <?php
                    // Calculate the project progress
                    $progress = getProjectProgress($project['id'], $conn);
                ?>
                <div class="project-card">
                    <h3><?php echo $project['name']; ?></h3>
                    <p><?php echo $project['description']; ?></p>
                    <?php
                        // Conditional class for progress bar
                        $progressClass = 'progress-bar';
                        if ($progress == 0) {
                            $progressClass .= ' zero'; // Red for 0% progress
                        } elseif ($progress == 100) {
                            $progressClass .= ' complete'; // Green for 100% progress
                        }
                    ?>

                    <!-- Display Progress Bar -->
                    <div class="progress-bar-wrapper">
                        <div class="<?php echo $progressClass; ?>" style="width: <?php echo max($progress, 5); ?>%;">
                            <?php echo $progress; ?>%
                        </div>
                    </div>

                    <div class="project-footer">
                        <span class="status-badge status-<?php echo strtolower(str_replace(' ', '-', $project['status'])); ?>">
                            <?php echo $project['status']; ?>
                        </span>
                        <div class="project-actions">
                            <a href="tasks.php?project_id=<?php echo $project['id']; ?>" class="btn btn-sm">Tasks</a>
                            <a href="projects.php?action=edit&id=<?php echo $project['id']; ?>" class="btn btn-sm btn-secondary">Edit</a>
                            <a href="api/projects.php?action=delete&id=<?php echo $project['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this project?')">Delete</a>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <p>No projects found. Create your first project using the button above.</p>
        <?php endif; ?>
    </div>
</div>

<?php 
$stmt->close();
closeConnection($conn);
include_once 'includes/footer.php'; 
?>
