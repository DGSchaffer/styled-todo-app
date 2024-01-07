const state = loadState() || {
  todos: [
    { description: "Learn CSS", done: false },
    { description: "Learn HTML", done: false },
    { description: "Learn Javascript", done: false },
  ],
};

// Save state in local storage
function saveState() {
  localStorage.setItem("state", JSON.stringify(state));
}
// Load state from local storage
function loadState() {
  const storedState = localStorage.getItem("state");
  return storedState ? JSON.parse(storedState) : { todos: [] };
}

const todoNameInput = document.querySelector("#todoname");
const todoList = document.querySelector("#todolist");
const removeDone = document.getElementById("removedone");

// generate html elements:
function generateLi(todo) {
  const todoLi = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;

  checkbox.addEventListener("change", (e) => {
    const newTodoDoneState = e.target.checked;
    todo.done = newTodoDoneState;
    saveState();

    // Change styles when todo is checked:
    if (checkbox.checked === true) {
      todoLi.style.textDecoration = "line-through";
      todoLi.dataset.status = "done";
      checkbox.textContent = "✔";
      checkbox.style.backgroundColor = "#06d6a0";
    } else {
      todoLi.style.textDecoration = "none";
      todoLi.dataset.status = "open";
      checkbox.textContent = "";
      checkbox.style.backgroundColor = "#ffffff";
    }
  });

  todoLi.appendChild(checkbox);
  const todoText = document.createTextNode(todo.description);
  todoLi.appendChild(todoText);

  return todoLi;
}

// Render Todo-List
function renderTodos() {
  todoList.innerHTML = "";
  state.todos.forEach((todo) => {
    const newLi = generateLi(todo);
    todoList.appendChild(newLi);
  });
}

// click-event to add new To-do:

const addTodo = document.getElementById("addtodo");
addTodo.addEventListener("click", () => {
  const newTodoDescription = todoNameInput.value.trim();
  if (newTodoDescription.length >= 5) {
    state.todos.push({
      description: newTodoDescription,
      done: false,
    });

    todoNameInput.value = "";
    renderTodos();
    saveState();
  }
  renderTodos();
});

//visibilty based on value of todos:

const openTodos = document.getElementById("open");
const doneTodos = document.getElementById("done");
const allTodos = document.getElementById("all");

function updateVisibility() {
  const checkboxes = todoList.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    const listItem = checkbox.closest("li");

    if (
      allTodos.checked ||
      (doneTodos.checked && checkbox.checked) ||
      (openTodos.checked && !checkbox.checked)
    ) {
      listItem.classList.remove("hidden");
    } else {
      listItem.classList.add("hidden");
    }
  });
}

allTodos.addEventListener("change", updateVisibility);
doneTodos.addEventListener("change", updateVisibility);
openTodos.addEventListener("change", updateVisibility);

updateVisibility();

// remove Done Todos:
removeDone.addEventListener("click", () => {
  const doneTodosToRemove = [];
  todoList.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    if (checkbox.checked) {
      const liElement = checkbox.closest("li");
      doneTodosToRemove.push(liElement);
    }
  });
  doneTodosToRemove.forEach((element) => {
    element.remove();
    saveState();
    loadState();
  });
});

renderTodos();
