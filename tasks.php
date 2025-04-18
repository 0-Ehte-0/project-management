<?php
require_once 'includes/config.php';
require_once 'includes/db.php';

// Check if user is logged in
requireLogin();

// Check if project_id is provided
if (!isset($_GET['project_id'])) {
    header("Location: projects.php");
    exit;
}

$project_id = sanitizeInput($_GET['project_id']);
$user_id = $_SESSION['user_id'];
$conn = getConnection();

// Check if project belongs to user
$stmt = $conn->prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $project_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    header("Location: projects.php?error=Project not found or access denied");
    exit;
}

$project = $result->fetch_assoc();

// Get tasks for this project
$stmt = $conn->prepare("SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $project_id);
$stmt->execute();
$tasks = $stmt->get_result();

// Check if we're editing a task
$editing = false;
$edit_task = null;

if (isset($_GET['action']) && $_GET['action'] === 'edit' && isset($_GET['id'])) {
    $task_id = sanitizeInput($_GET['id']);
    
    $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ? AND project_id = ?");
    $stmt->bind_param("ii", $task_id, $project_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $editing = true;
        $edit_task = $result->fetch_assoc();
    }
}

// Include header
include_once 'includes/header.php';
?>

<div class="tasks-container">
    <div class="section-header">
        <div>
            <h2>Tasks for: <?php echo $project['name']; ?></h2>
            <p class="project-description"><?php echo $project['description']; ?></p>
        </div>
        <div>
            <a href="projects.php" class="btn btn-secondary">Back to Projects</a>
            <?php if (!$editing): ?>
                <a href="tasks.php?project_id=<?php echo $project_id; ?>&action=new" class="btn btn-primary">New Task</a>
            <?php endif; ?>
        </div>
    </div>
    
    <?php if (isset($_GET['error'])): ?>
        <div class="alert alert-danger"><?php echo $_GET['error']; ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success"><?php echo $_GET['success']; ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['action']) && $_GET['action'] === 'new' || $editing): ?>
        <div class="form-container">
            <h3><?php echo $editing ? 'Edit Task' : 'New Task'; ?></h3>
            <form action="api/tasks.php?action=<?php echo $editing ? 'update' : 'create'; ?>" method="post">
                <?php if ($editing): ?>
                    <input type="hidden" name="id" value="<?php echo $edit_task['id']; ?>">
                <?php endif; ?>
                <input type="hidden" name="project_id" value="<?php echo $project_id; ?>">
                
                <div class="form-group">
                    <label for="title">Task Title</label>
                    <input type="text" id="title" name="title" value="<?php echo $editing ? $edit_task['title'] : ''; ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="3"><?php echo $editing ? $edit_task['description'] : ''; ?></textarea>
                </div>
                
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id="status" name="status">
                        <option value="To Do" <?php echo $editing && $edit_task['status'] === 'To Do' ? 'selected' : ''; ?>>To Do</option>
                        <option value="In Progress" <?php echo $editing && $edit_task['status'] === 'In Progress' ? 'selected' : ''; ?>>In Progress</option>
                        <option value="Done" <?php echo $editing && $edit_task['status'] === 'Done' ? 'selected' : ''; ?>>Done</option>
                    </select>
                </div>
                
                <div class="form-buttons">
                    <a href="tasks.php?project_id=<?php echo $project_id; ?>" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary"><?php echo $editing ? 'Update Task' : 'Create Task'; ?></button>
                </div>
            </form>
        </div>
    <?php endif; ?>
    
    <div class="task-board">
        <div class="task-column">
            <h3>To Do</h3>
            <div class="task-list">
                <?php 
                $tasks->data_seek(0);
                while ($task = $tasks->fetch_assoc()): 
                    if ($task['status'] === 'To Do'):
                ?>
                    <div class="task-card">
                        <h4><?php echo $task['title']; ?></h4>
                        <p><?php echo $task['description']; ?></p>
                        <div class="task-actions">
                            <a href="tasks.php?project_id=<?php echo $project_id; ?>&action=edit&id=<?php echo $task['id']; ?>" class="btn btn-sm btn-secondary">Edit</a>
                            <a href="api/tasks.php?action=delete&id=<?php echo $task['id']; ?>&project_id=<?php echo $project_id; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete</a>
                        </div>
                    </div>
                <?php 
                    endif;
                endwhile; 
                ?>
            </div>
        </div>
        
        <div class="task-column">
            <h3>In Progress</h3>
            <div class="task-list">
                <?php 
                $tasks->data_seek(0);
                while ($task = $tasks->fetch_assoc()): 
                    if ($task['status'] === 'In Progress'):
                ?>
                    <div class="task-card">
                        <h4><?php echo $task['title']; ?></h4>
                        <p><?php echo $task['description']; ?></p>
                        <div class="task-actions">
                            <a href="tasks.php?project_id=<?php echo $project_id; ?>&action=edit&id=<?php echo $task['id']; ?>" class="btn btn-sm btn-secondary">Edit</a>
                            <a href="api/tasks.php?action=delete&id=<?php echo $task['id']; ?>&project_id=<?php echo $project_id; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete</a>
                        </div>
                    </div>
                <?php 
                    endif;
                endwhile; 
                ?>
            </div>
        </div>
        
        <div class="task-column">
            <h3>Done</h3>
            <div class="task-list">
                <?php 
                $tasks->data_seek(0);
                while ($task = $tasks->fetch_assoc()): 
                    if ($task['status'] === 'Done'):
                ?>
                    <div class="task-card">
                        <h4><?php echo $task['title']; ?></h4>
                        <p><?php echo $task['description']; ?></p>
                        <div class="task-actions">
                            <a href="tasks.php?project_id=<?php echo $project_id; ?>&action=edit&id=<?php echo $task['id']; ?>" class="btn btn-sm btn-secondary">Edit</a>
                            <a href="api/tasks.php?action=delete&id=<?php echo $task['id']; ?>&project_id=<?php echo $project_id; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete</a>
                        </div>
                    </div>
                <?php 
                    endif;
                endwhile; 
                ?>
            </div>
        </div>
    </div>
</div>

<?php 
$stmt->close();
closeConnection($conn);
include_once 'includes/footer.php'; 
?>
