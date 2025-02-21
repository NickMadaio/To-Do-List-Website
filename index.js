import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const newTaskInput = document.getElementById("new-task");
  const taskList = document.getElementById("task-list");

  // This array is now fed by Firestore via real-time updates.
  let tasks = [];

  // Get Firestore instance (firebase app is already initialized in index.html)
  const db = getFirestore();
  const tasksColRef = collection(db, "tasks");
  const tasksQuery = query(tasksColRef, orderBy("timestamp"));

  // Real-time listener for tasks collection
  onSnapshot(tasksQuery, (snapshot) => {
    tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderTasks();
  });

  // When the form is submitted, add a new task to Firestore
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await addTask();
  });

  async function addTask() {
    const taskText = newTaskInput.value.trim();
    if (!taskText) return;
    try {
      await addDoc(tasksColRef, {
        text: taskText,
        completed: false,
        timestamp: Date.now(),
      });
      newTaskInput.value = "";
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = task.id;

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;
      if (task.completed) span.classList.add("completed");
      span.addEventListener("click", () => toggleTask(task.id, task.completed));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "X";
      deleteBtn.addEventListener("click", () => removeTask(task.id));

      li.appendChild(span);
      li.appendChild(deleteBtn);
      li.classList.add("fade-in");
      setTimeout(() => li.classList.remove("fade-in"), 500);
      taskList.appendChild(li);
    });
  }

  async function toggleTask(id, currentStatus) {
    try {
      const taskDocRef = doc(db, "tasks", id);
      await updateDoc(taskDocRef, { completed: !currentStatus });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function removeTask(id) {
    try {
      const taskDocRef = doc(db, "tasks", id);
      await deleteDoc(taskDocRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
});
