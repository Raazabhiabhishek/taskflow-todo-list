
/* =====================================
   1. GET HTML ELEMENTS
===================================== */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");

const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");

/* =====================================
   2. LOAD TASKS FROM LOCAL STORAGE
===================================== */

let tasks = [];

try {
  const savedTasks = localStorage.getItem("taskflow-tasks");

  if (savedTasks) {
    const parsedTasks = JSON.parse(savedTasks);

    if (Array.isArray(parsedTasks)) {
      tasks = parsedTasks.filter(
        (task) =>
          task &&
          typeof task.id === "string" &&
          typeof task.text === "string" &&
          typeof task.completed === "boolean"
      );
    }
  }
} catch (error) {
  console.error("Could not load saved tasks:", error);
}

/* =====================================
   3. SAVE TASKS
===================================== */

function saveTasks() {
  try {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
    alert("Tasks save nahi ho paaye. Browser storage check karo.");
  }
}

/* =====================================
   4. RENDER TASKS ON THE PAGE
===================================== */

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    if (task.completed) {
      listItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    checkbox.addEventListener("change", () => {
      toggleTask(task.id);
    });

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
      deleteTask(task.id);
    });

    listItem.append(checkbox, taskText, deleteButton);
    taskList.appendChild(listItem);
  });

  updateStats();

  emptyMessage.classList.toggle("hidden", tasks.length > 0);
}

/* =====================================
   5. UPDATE TASK COUNTERS
===================================== */

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

/* =====================================
   6. ADD A NEW TASK
===================================== */

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  const newTask = {
    id: crypto.randomUUID(),
    text: text,
    completed: false,
  };

  tasks.unshift(newTask);

  saveTasks();
  renderTasks();

  taskForm.reset();
  taskInput.focus();
});

/* =====================================
   7. MARK TASK COMPLETE / INCOMPLETE
===================================== */

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: !task.completed }
      : task
  );

  saveTasks();
  renderTasks();
}

/* =====================================
   8. DELETE A TASK
===================================== */

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasks();
  renderTasks();
}

/* =====================================
   9. CLEAR ALL COMPLETED TASKS
===================================== */

clearCompletedButton.addEventListener("click", () => {
  const completedTasksExist = tasks.some((task) => task.completed);

  if (!completedTasksExist) {
    return;
  }

  tasks = tasks.filter((task) => !task.completed);

  saveTasks();
  renderTasks();
});

/* =====================================
   10. INITIALIZE THE APP
===================================== */

renderTasks();
