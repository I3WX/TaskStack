import "./styles.css";
import deleteImgSrc from "./image/icons8-delete.svg";
import editImgSrc from "./image/icons8-edit.svg";
import { Tasks } from "./Tasks.js";
// Get DOM elements
const addTodoBtn = document.getElementById("add-todo-btn");
const projectTitle = document.getElementById("project-title");
const projectList = document.getElementById("project-list");
const modal = document.getElementById("todo-modal");
const modalProject = document.getElementById("project-modal");
const closeTodoBtn = document.getElementById("close-modal");
const addToDoBtn = document.getElementById("AddToDoBTN");
const addProjectBtn = document.getElementById("add-project-btn");
const closeProjectBtn = document.getElementById("close-project-modal");
const todoList = document.getElementById("todo-list");
const saveProjectBtn = document.getElementById("AddProjectBTN");

// Project and Task state management
let projects = []; // List of projects
let activeProject = null; // Currently active project

// Track task editing state
let editingTaskElement = null;
let editingTaskInstance = null;

// Event listeners for modals and buttons
addTodoBtn.addEventListener("click", handleAddTodoClick);
closeTodoBtn.addEventListener("click", closeTodoModal);
addProjectBtn.addEventListener("click", showProjectModal);
closeProjectBtn.addEventListener("click", closeProjectModal);
addToDoBtn.addEventListener("click", handleAddOrUpdateTask);
saveProjectBtn.addEventListener("click", handleSaveProject);

// Initialize the page with any stored projects
loadProjectsFromLocalStorage();

/**
 * Handles opening the add task modal.
 */
function handleAddTodoClick() {
  if (activeProject) {
    modal.style.display = "block";
  } else {
    alert("Please select a project before adding tasks.");
  }
}

/**
 * Handles closing the task modal.
 */
function closeTodoModal() {
  modal.style.display = "none";
  resetTaskForm();
}

/**
 * Handles showing the project modal.
 */
function showProjectModal() {
  modalProject.style.display = "block";
}

/**
 * Handles closing the project modal.
 */
function closeProjectModal() {
  modalProject.style.display = "none";
}

/**
 * Handles adding or updating a task in the project.
 */
function handleAddOrUpdateTask(event) {
  event.preventDefault();

  const taskData = getTaskFormData();

  if (editingTaskInstance) {
    // Update existing task
    editingTaskInstance.editProperties(taskData);
    updateTodoElement(editingTaskElement, editingTaskInstance);
    saveProjectsToLocalStorage();
    resetTaskEditingState();
  } else {
    // Create new task and add to the project
    const newTask = new Tasks(
      taskData.taskName,
      taskData.description,
      taskData.priority,
      taskData.deadline
    );
    createTodoElement(newTask);
    activeProject.tasks.push(newTask);
    saveProjectsToLocalStorage();
  }

  closeTodoModal();
}

/**
 * Updates a todo element after editing.
 */
function updateTodoElement(todoElement, task) {
  todoElement.querySelector(".title").innerText = task.taskName;
  todoElement.querySelector(".description").innerText = task.description;
  todoElement.querySelector(".due-date").innerText =` Due: ${task.deadline}`;
  const todoPriority = todoElement.querySelector(".priority");
  todoPriority.innerText = `${capitalizePriority(task.priority)} Priority`;
  todoPriority.className = `priority ${task.priority}`;
}

/**
 * Fetches and returns the task form data.
 */
function getTaskFormData() {
  return {
    taskName: document.getElementById("todo-title").value,
    description: document.getElementById("todo-description").value,
    deadline: document.getElementById("todo-due-date").value,
    priority: document.getElementById("todo-priority").value,
  };
}

/**
 * Resets the task form and editing state.
 */
function resetTaskForm() {
  document.getElementById("todo-form").reset();
}

function resetTaskEditingState() {
  editingTaskElement = null;
  editingTaskInstance = null;
}

/**
 * Handles saving a new project.
 */
function handleSaveProject(event) {
  event.preventDefault();
  const projectName = document.getElementById("project-title-input").value;

  if (projectName) {
    const newProject = { projectName, tasks: [] };
    projects.push(newProject);
    saveProjectsToLocalStorage();
    createProjectElement(newProject);
    closeProjectModal();
    setActiveProject(newProject); // Automatically set the new project as active
  }
}

/**
 * Creates and appends` a project element to the project list.
 */
function createProjectElement(project) {
    const projectItem = document.createElement("li");
    
    // Project name
    const projectNameSpan = document.createElement("span");
    projectNameSpan.textContent = project.projectName;
    projectItem.appendChild(projectNameSpan);
    
    // Delete button
    const deleteBtn = document.createElement("button");
    const deleteImg = document.createElement("img");
    deleteImg.src = deleteImgSrc; 
    deleteBtn.appendChild(deleteImg)
    deleteBtn.classList.add("delete-project-btn");
    projectItem.appendChild(deleteBtn);
    
    // Event listener to select project when clicking the project name
    projectNameSpan.addEventListener("click", () => {
        setActiveProject(project);
    });

    // Event listener to delete project
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering the project select when deleting
        deleteProject(project, projectItem);
    });

    projectList.appendChild(projectItem);
}

/**
 * Deletes a project from the projects array and updates the UI and localStorage.
 */
function deleteProject(project, projectItem) {
    // Remove from the projects array
    projects = projects.filter(p => p !== project);
    
    // Remove the project element from the UI
    projectItem.remove();

    // If the deleted project was the active project, reset the active project
    if (activeProject === project) {
        activeProject = null;
        projectTitle.innerText = "No Project Selected";
        addTodoBtn.disabled = true;
        todoList.innerHTML = ""; // Clear the tasks
    }

    // Save the updated projects to localStorage
    saveProjectsToLocalStorage();
}

/**
 * Sets the active project and updates the UI.
 */
function setActiveProject(project) {
  activeProject = project;
  projectTitle.innerText = project.projectName;
  addTodoBtn.disabled = false;
  loadTasks(project.tasks);
  highlightActiveProject();
}

/**
 * Highlights the selected project in the UI.
 */
function highlightActiveProject() {
  const allProjects = document.querySelectorAll("#project-list li");
  allProjects.forEach((proj) => {
    proj.classList.remove("active");
    if (proj.textContent === activeProject.projectName) {
      proj.classList.add("active");
    }
  });
}

/**
 * Loads tasks for the active project.
 */
function loadTasks(tasks) {
  todoList.innerHTML = ""; // Clear previous tasks
  tasks.forEach(createTodoElement);
}

/**
 * Saves the projects to localStorage.
 */
function saveProjectsToLocalStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

/**
 * Loads the projects from localStorage.
 */
function loadProjectsFromLocalStorage() {
  const data = localStorage.getItem("projects");
  if (data) {
    projects = JSON.parse(data);
    projects.forEach((project) => {
      createProjectElement(project);
      if (!activeProject) {
        setActiveProject(project); // Set the first project as active
      }
    });
  }
}


/**
 * Creates the information section of a todo item.
 */
function createTodoInfo(task) {
  const todoInfo = document.createElement("div");
  todoInfo.className = "info";

  const todoTitle = document.createElement("div");
  todoTitle.className = "title";
  todoTitle.innerText = task.taskName;

  const todoDescription = document.createElement("div");
  todoDescription.className = "description";
  todoDescription.innerText = task.description;

  const todoDueDate = document.createElement("div");
  todoDueDate.className = "due-date";
  todoDueDate.innerText = `Due: ${task.deadline}`;

  todoInfo.appendChild(todoTitle);
  todoInfo.appendChild(todoDescription);
  todoInfo.appendChild(todoDueDate);

  return todoInfo;
}

/**
 * Creates the actions section (edit and delete buttons) of a todo item.
 */
function createTodoActions(task, todoItem) {
  const todoActions = document.createElement("div");
  todoActions.className = "Btns";

  const todoPriority = document.createElement("div");
  todoPriority.className = `priority ${task.priority}`;
  todoPriority.innerText = `${capitalizePriority(task.priority)} Priority`;

  const editBtn = createButtonWithIcon(editImgSrc, "edit-btn", () => handleEditTask(task, todoItem));
  const deleteBtn = createButtonWithIcon(deleteImgSrc, "delete-btn", () => handleDeleteTask(task, todoItem));

  todoActions.appendChild(todoPriority);
  todoActions.appendChild(editBtn);
  todoActions.appendChild(deleteBtn);

  return todoActions;
}
/**
 * Creates a new todo element for a task and appends it to the list.
 */
function createTodoElement(task) {
  const todoItem = document.createElement("div");
  todoItem.className = "todo-item";

  const todoInfo = createTodoInfo(task);
  const todoActions = createTodoActions(task, todoItem);

  todoItem.appendChild(todoInfo);
  todoItem.appendChild(todoActions);
  todoList.appendChild(todoItem);
}
/**
 * Capitalizes the task priority.
 */
function capitalizePriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

/**
 * Creates a button with an icon image.
 */
function createButtonWithIcon(iconSrc, className, onClick) {
  const button = document.createElement("button");
  button.className = className;

  const img = document.createElement("img");
  img.src = iconSrc;

  button.appendChild(img);
  button.addEventListener("click", onClick);

  return button;
}
/**
 * Handles deleting a task.
 */
function handleDeleteTask(task, todoItem) {
  todoItem.remove();
  activeProject.tasks = activeProject.tasks.filter(t => t !== task);
  saveProjectsToLocalStorage();
}

/**
 * Handles editing a task.
 */
function handleEditTask(task, todoItem) {
  modal.style.display = "block";
  document.getElementById("todo-title").value = task.taskName;
  document.getElementById("todo-description").value = task.description;
  document.getElementById("todo-due-date").value = task.deadline;
  document.getElementById("todo-priority").value = task.priority;

  editingTaskElement = todoItem;
  editingTaskInstance = task;
}