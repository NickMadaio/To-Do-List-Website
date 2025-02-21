document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const taskForm = document.getElementById("task-form");
  const newTaskInput = document.getElementById("new-task");
  const taskList = document.getElementById("task-list");

  // In-memory array to hold tasks
  let tasks = [];

  // Event listener: When the form is submitted, add a new task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    addTask();
  });

  /**
   * addTask
   * Reads the input value, creates a new task object,
   * adds it to the tasks array, clears the input field,
   * and re-renders the task list.
   */
  function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText === "") return; // Do nothing if input is empty

    // Create a new task object with a unique id, text, and completed status
    const newTask = {
      id: Date.now(), // Unique id based on current time
      text: taskText,
      completed: false,
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Clear the input field
    newTaskInput.value = "";

    // Re-render the task list to include the new task
    renderTasks();
  }

  /**
   * renderTasks
   * Clears the current task list in the DOM and rebuilds it from the tasks array.
   * Also attaches event listeners to each task's text and delete button.
   */
  function renderTasks() {
    // Clear the current list
    taskList.innerHTML = "";

    // Loop through each task in the tasks array
    tasks.forEach((task) => {
      // Create a new list item for the task
      const li = document.createElement("li");
      li.className = "task-item"; // Apply base styling for task items
      li.dataset.id = task.id; // Store the task id for later use

      // Create a span element to hold the task text
      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;
      if (task.completed) {
        span.classList.add("completed");
      }
      // Toggle completed status when task text is clicked
      span.addEventListener("click", () => {
        toggleTask(task.id);
      });

      // Create a delete button to remove the task
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => {
        removeTask(task.id);
      });

      // Append the text and delete button to the list item
      li.appendChild(span);
      li.appendChild(deleteBtn);

      // Add a fade-in animation class (ensure you add matching CSS for .fade-in)
      li.classList.add("fade-in");
      setTimeout(() => li.classList.remove("fade-in"), 500);

      // Append the task item to the task list container
      taskList.appendChild(li);
    });
  }

  /**
   * toggleTask
   * Toggles the 'completed' status of the task with the given id,
   * then re-renders the task list.
   */
  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
  }

  /**
   * removeTask
   * Removes the task with the given id from the tasks array,
   * then re-renders the task list.
   */
  function removeTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
  }
});
