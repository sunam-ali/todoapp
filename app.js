// selected elments

let newTask = document.querySelector('#new-task');
let form = document.querySelector('form');
let todoUl = document.querySelector('#items');
let completedUl = document.querySelector('.task-content-completed');

// Functions

let todoEmptyMessage = todoUl.querySelector('.not-found');
let completedEmptyMessage = completedUl.querySelector('.not-found');

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
  updateEmptyMessage()
}

let completeTask = function () {
  let listItem = this.parentNode;

  // Fade out from To-Do
  listItem.classList.remove('show');
  listItem.classList.add('hide');

  // After the fade-out completes (300ms), move to Completed and fade in
  setTimeout(() => {
    let deleteBtn = document.createElement('button');
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete";
    listItem.appendChild(deleteBtn);

    let checkbox = listItem.querySelector('input[type="checkbox"]');
    if (checkbox) checkbox.remove();

    completedUl.appendChild(listItem);

    // Reset animation classes
    listItem.classList.remove('hide');
    void listItem.offsetWidth; // Force reflow to restart transition
    listItem.classList.add('show');

    bindCompleteItems(listItem, deleteTask);
    updateEmptyMessage();
  }, 300); // Match your CSS transition time
};


let deleteTask = function () {
  let listItem = this.parentNode;
  listItem.classList.add('hide');
  setTimeout(() => {
    let ul = listItem.parentNode;
    ul.removeChild(listItem);
    updateEmptyMessage();
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
for (let i = 0; i < todoUl.children.length; i++) {
  const item = todoUl.children[i];
  if (item.className === 'show') {
    bindInCompleteItems(item, completeTask);
  }
}

for (let i = 0; i < completedUl.children.length; i++) {
  const item = completedUl.children[i];
  if (item.className === 'show') {
    bindCompleteItems(item, deleteTask);
  }
}

form.addEventListener('submit', addTask);
updateEmptyMessage() 
