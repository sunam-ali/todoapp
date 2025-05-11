// selected elements
let newTask = document.querySelector('#new-task');
let form = document.querySelector('form');
let todoUl = document.querySelector('#items');
let completedUl = document.querySelector('.task-content-completed');

let todoEmptyMessage = todoUl.querySelector('.not-found');
let completedEmptyMessage = completedUl.querySelector('.not-found');

// 🔸 LocalStorage Keys
const TODO_KEY = "todoTasks";
const COMPLETED_KEY = "completedTasks";

// 🔹 Load tasks from localStorage
function loadTasksFromStorage() {
  const todos = JSON.parse(localStorage.getItem(TODO_KEY)) || [];
  const completed = JSON.parse(localStorage.getItem(COMPLETED_KEY)) || [];

  todos.forEach(task => {
    let listItem = createTask(task);
    todoUl.appendChild(listItem);
    setTimeout(() => listItem.classList.add('show'), 10);
    bindInCompleteItems(listItem, completeTask);
  });

  completed.forEach(task => {
    let listItem = createTask(task);
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";
    listItem.appendChild(deleteBtn);
    listItem.querySelector('input').remove();
    completedUl.appendChild(listItem);
    setTimeout(() => listItem.classList.add('show'), 10);
    bindCompleteItems(listItem, deleteTask);
  });

  updateEmptyMessage();
}

// 🔹 Save tasks to localStorage
function saveTasksToStorage() {
  const todos = Array.from(todoUl.querySelectorAll('li label')).map(label => label.innerText);
  const completed = Array.from(completedUl.querySelectorAll('li label')).map(label => label.innerText);
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
}

function updateEmptyMessage() {
  todoEmptyMessage.style.display = todoUl.querySelector('li') ? 'none' : 'block';
  completedEmptyMessage.style.display = completedUl.querySelector('li') ? 'none' : 'block';
}

let createTask = function (task) {
  let listItem = document.createElement('li');
  let checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  let label = document.createElement('label');
  label.innerText = task;

  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  return listItem;
}

let addTask = function (e) {
  e.preventDefault();
  if (!newTask.value.trim()) return;
  let listItem = createTask(newTask.value);
  todoUl.appendChild(listItem);
  newTask.value = "";
  setTimeout(() => listItem.classList.add('show'), 10);
  bindInCompleteItems(listItem, completeTask);
  updateEmptyMessage();
  saveTasksToStorage(); // ✅ Save
}

let completeTask = function () {
  let listItem = this.parentNode;

  listItem.classList.remove('show');
  listItem.classList.add('hide');

  setTimeout(() => {
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";
    listItem.appendChild(deleteBtn);

    let checkbox = listItem.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.remove();

    completedUl.appendChild(listItem);

    listItem.classList.remove('hide');
    void listItem.offsetWidth;
    listItem.classList.add('show');

    bindCompleteItems(listItem, deleteTask);
    updateEmptyMessage();
    saveTasksToStorage(); // ✅ Save
  }, 300);
};

let deleteTask = function () {
  let listItem = this.parentNode;
  listItem.classList.add('hide');
  setTimeout(() => {
    let ul = listItem.parentNode;
    ul.removeChild(listItem);
    updateEmptyMessage();
    saveTasksToStorage(); // ✅ Save
  }, 10);
}

let bindInCompleteItems = function (taskItem, checkboxClick) {
  let checkbox = taskItem.querySelector('input[type="checkbox"]');
  checkbox.onchange = checkboxClick;
}

let bindCompleteItems = function (taskItem, deleteBtnClick) {
  let deleteButton = taskItem.querySelector('.delete');
  deleteButton.onclick = deleteBtnClick;
}

// 🔹 Load existing tasks on page load
loadTasksFromStorage();

form.addEventListener('submit', addTask);

