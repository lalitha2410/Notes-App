// Function to add a new task
function addTask(taskText) {
    const taskItem = document.createElement("li");

    // Create checkbox for the task
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Add event listener for task completion (checkbox checked)
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            taskItem.classList.add("completed"); // Fade and mark as completed
        } else {
            taskItem.classList.remove("completed"); // Reset to incomplete
        }
        saveTasks(); // Save the task status
        checkTaskCompletion(); // Check if all tasks are completed
    });

    // Create a span for task text
    const taskContent = document.createElement("span");
    taskContent.textContent = taskText;

    // Create div for modify/delete options
    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    // Modify Button
    const modifyButton = document.createElement("button");
    modifyButton.textContent = "Modify";
    modifyButton.onclick = function () {
        const newTaskText = prompt("Edit your task:", taskText);
        if (newTaskText) {
            taskContent.textContent = newTaskText;
            saveTasks(); // Save the modified task
        }
    };

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
        taskItem.remove(); // Remove task from the list
        saveTasks(); // Save the updated list
        checkTaskCompletion(); // Check if all tasks are completed
    };

    optionsDiv.appendChild(modifyButton);
    optionsDiv.appendChild(deleteButton);

    // Append checkbox, task content, and options to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(optionsDiv);

    // Add task to the list
    document.getElementById("task-list").appendChild(taskItem);

    // Clear the input field
    document.getElementById("new-note").value = "";

    // Save tasks to local storage
    saveTasks();

    // Show Clear All button
    document.getElementById("clear-all").style.display = "block";
}

// Function to add task from the input field (via the Add Task button)
function addTaskFromInput() {
    const taskInput = document.getElementById("new-note");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        addTask(taskText); // Add task
    }
}

// Save tasks to local storage
function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll("li");

    taskItems.forEach(function (taskItem) {
        const taskText = taskItem.querySelector("span").textContent;
        const isChecked = taskItem.querySelector("input").checked;
        tasks.push({ text: taskText, checked: isChecked });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    if (tasks) {
        tasks.forEach(function (task) {
            addTask(task.text);
            if (task.checked) {
                const taskItem = document.querySelector(`li span:contains("${task.text}")`).parentElement;
                taskItem.querySelector("input").checked = true;
                taskItem.classList.add("completed");
            }
        });
    }
    checkTaskCompletion(); // Check if all tasks are completed on load
}

// Handle pressing Enter to add task
function checkEnter(event) {
    if (event.key === "Enter") {
        const taskInput = document.getElementById("new-note");
        const taskText = taskInput.value.trim();

        if (taskText === "") {
            return; // Do nothing if input is empty
        }

        addTask(taskText); // Add task
    }
}

// Clear all tasks
function clearAllTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Remove all tasks
    localStorage.removeItem("tasks"); // Clear tasks from local storage
    document.getElementById("clear-all").style.display = "none"; // Hide Clear All button
    document.getElementById("success-message").style.display = "none"; // Hide Good job message
}

// Check if all tasks are completed
function checkTaskCompletion() {
    const taskItems = document.querySelectorAll("li");
    const allCompleted = [...taskItems].every(task => task.querySelector("input").checked);

    if (allCompleted) {
        document.getElementById("success-message").style.display = "block"; // Show Good job message
    } else {
        document.getElementById("success-message").style.display = "none"; // Hide Good job message
    }
}

// Load tasks on page load
window.onload = loadTasks;
