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

// Get project counts by status
$stmt = $conn->prepare("SELECT status, COUNT(*) as count FROM projects WHERE user_id = ? GROUP BY status");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$project_stats = $stmt->get_result();

$project_counts = [
    'Not Started' => 0,
    'In Progress' => 0,
    'Completed' => 0
];

while ($row = $project_stats->fetch_assoc()) {
    $project_counts[$row['status']] = $row['count'];
}

// Get total tasks
$stmt = $conn->prepare("SELECT COUNT(*) as total_tasks FROM tasks t JOIN projects p ON t.project_id = p.id WHERE p.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$total_tasks = $result->fetch_assoc()['total_tasks'];

// Include header
include_once 'includes/header.php';
?>

<div class="dashboard">
    <h2>Dashboard</h2>
    <p>Welcome, <?php echo $_SESSION['username']; ?>!</p>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success"><?php echo $_GET['success']; ?></div>
    <?php endif; ?>
    
    <div class="stats-container">
        <div class="stat-card">
            <h3>Total Projects</h3>
            <p class="stat-number"><?php echo $projects->num_rows; ?></p>
        </div>
        <div class="stat-card">
            <h3>In Progress</h3>
            <p class="stat-number"><?php echo $project_counts['In Progress']; ?></p>
        </div>
        <div class="stat-card">
            <h3>Completed</h3>
            <p class="stat-number"><?php echo $project_counts['Completed']; ?></p>
        </div>
        <div class="stat-card">
            <h3>Total Tasks</h3>
            <p class="stat-number"><?php echo $total_tasks; ?></p>
        </div>
    </div>
    
    <div class="recent-projects">
        <div class="section-header">
            <h3>Recent Projects</h3>
            <a href="projects.php" class="btn btn-sm">View All</a>
        </div>
        
        <?php if ($projects->num_rows > 0): ?>
            <div class="project-list">
                <?php 
                $count = 0;
                while ($project = $projects->fetch_assoc()): 
                    if ($count >= 3) break; // Show only 3 recent projects
                    $count++;
                ?>
                    <div class="project-card">
                        <h4><?php echo $project['name']; ?></h4>
                        <p><?php echo $project['description']; ?></p>
                        <div class="project-footer">
                            <span class="status-badge status-<?php echo strtolower(str_replace(' ', '-', $project['status'])); ?>">
                                <?php echo $project['status']; ?>
                            </span>
                            <a href="tasks.php?project_id=<?php echo $project['id']; ?>" class="btn btn-sm">View Tasks</a>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
        <?php else: ?>
            <p>No projects found. <a href="projects.php">Create your first project</a>.</p>
        <?php endif; ?>
    </div>
    
    <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
            <a href="projects.php?action=new" class="btn btn-primary">New Project</a>
        </div>
    </div>
</div>

<?php 
$stmt->close();
closeConnection($conn);
include_once 'includes/footer.php'; 
?>
