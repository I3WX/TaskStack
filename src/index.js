import "./styles.css";
import deleteImgSrc from "./image/icons8-delete.svg";
import editImgSrc from "./image/icons8-edit.svg";
import { Tasks } from "./Task";

// Get DOM elements
const addTodo = document.getElementById("add-todo-btn");
const modal = document.getElementById("todo-modal");
const closeBtn = document.getElementById("close-modal");
const AddToDoBTN = document.getElementById("AddToDoBTN");
const todoList = document.getElementById("todo-list");

// Store the current task being edited
let editingTaskElement = null;
let editingTaskInstance = null; // Store the current task instance

// Event to show the modal
addTodo.addEventListener("click", () => {
  modal.style.display = "block";
});

// Event to close the modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Event to add or update a task
AddToDoBTN.addEventListener("click", (event) => {
  event.preventDefault();

  // Get input values
  const taskData = {
    taskName: document.getElementById("todo-title").value,
    description: document.getElementById("todo-description").value,
    deadline: document.getElementById("todo-due-date").value,
    priority: document.getElementById("todo-priority").value,
  };

  if (editingTaskInstance) {
    // Update existing task
    editingTaskInstance.editProperties(taskData);
    updateTodoElement(editingTaskElement, editingTaskInstance);
    editingTaskElement = null; // Reset editing task element
    editingTaskInstance = null; // Reset editing task instance
  } else {
    // Create new task
    const newTask = new Tasks(
      taskData.taskName,
      taskData.description,
      taskData.priority,
      taskData.deadline
    );
    createTodoElement(newTask);
  }

  // Close the modal and reset the form
  modal.style.display = "none";
  document.getElementById("todo-form").reset();
});

// Helper function to capitalize the priority
function capitalizePriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// Function to create a new todo element
function createTodoElement(task) {
  // Create new todo elements
  const todoItem = document.createElement("div");
  const todoInfo = document.createElement("div");
  const todoTitle = document.createElement("div");
  const todoDescription = document.createElement("div");
  const todoDueDate = document.createElement("div");
  const todoPriority = document.createElement("div");
  const todoBtn = document.createElement("div");

  // Create edit and delete buttons
  const editBtn = document.createElement("button");
  const editImg = document.createElement("img");
  const deleteBtn = document.createElement("button");
  const deleteImg = document.createElement("img");

  // Set class names
  todoItem.className = "todo-item";
  todoInfo.className = "info";
  todoTitle.className = "title";
  todoDescription.className = "description";
  todoDueDate.className = "due-date";
  todoPriority.className = `priority ${task.priority}`;
  editBtn.className = "edit-btn";
  deleteBtn.className = "delete-btn";
  todoBtn.className = "Btns";

  // Set content from the task object
  todoTitle.innerText = task.taskName;
  todoDescription.innerText = task.description;
  todoDueDate.innerText = `Due: ${task.deadline}`;
  todoPriority.innerText = `${capitalizePriority(task.priority)} Priority`;

  deleteImg.src = deleteImgSrc;
  editImg.src = editImgSrc;

  // Set button content with icons
  editBtn.appendChild(editImg);
  deleteBtn.appendChild(deleteImg);

  // Append elements
  todoInfo.appendChild(todoTitle);
  todoInfo.appendChild(todoDescription);
  todoInfo.appendChild(todoDueDate);
  todoItem.appendChild(todoInfo);
  todoBtn.appendChild(todoPriority);
  todoBtn.appendChild(editBtn);
  todoBtn.appendChild(deleteBtn);
  todoItem.appendChild(todoBtn);
  todoList.appendChild(todoItem);

  // Set event listeners for edit and delete buttons
  editBtn.addEventListener("click", () => {
    modal.style.display = "block";
    document.getElementById("todo-title").value = task.taskName;
    document.getElementById("todo-description").value = task.description;
    document.getElementById("todo-due-date").value = task.deadline;
    document.getElementById("todo-priority").value = task.priority;

    // Set the editing task element and instance
    editingTaskElement = todoItem;
    editingTaskInstance = task;
  });

  deleteBtn.addEventListener("click", () => {
    todoItem.remove();
  });
}

// Function to update an existing todo element
function updateTodoElement(todoElement, task) {
  const todoTitle = todoElement.querySelector(".title");
  const todoDescription = todoElement.querySelector(".description");
  const todoDueDate = todoElement.querySelector(".due-date");
  const todoPriority = todoElement.querySelector(".priority");

  todoTitle.innerText = task.taskName;
  todoDescription.innerText = task.description;
  todoDueDate.innerText = `Due: ${task.deadline}`;
  todoPriority.innerText = `${capitalizePriority(task.priority)} Priority`;
  todoPriority.className = `priority ${task.priority}`;
}
