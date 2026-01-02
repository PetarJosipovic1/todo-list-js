var input = document.getElementById("unos");
var addBtn = document.getElementById("addBtn");
var lista = document.getElementById("lista");
var msg = document.getElementById("msg");
var counter = document.getElementById("counter");
var clearDone = document.getElementById("clearDone");
var filterButtons = document.querySelectorAll(".filters button");

var tasks = [];
var currentFilter = "all";

/* LocalStorage */
function save() {
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

function load() {
    var data = localStorage.getItem("todo_tasks");
    if (data) {
        tasks = JSON.parse(data);
    }
}


function wordForTask(n) {

    var last = n % 10;
    var lastTwo = n % 100;

    if (n === 1) return "zadatak";
    if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return "zadatka";
    return "zadataka";
}

/* Utils */
function showMessage(text) {
    msg.textContent = text;
}


function updateCounter() {
    var total = tasks.length;
    var done = 0;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done) done++;
    }

    var active = total - done;

    
    counter.textContent =
        "Aktivno: " + active + "/" + total + " " + wordForTask(total) +
        " • Završeno: " + done;
}

/* CRUD */
function addTask() {
    var text = input.value.trim();
    if (text === "") {
        showMessage("Unesite tekst zadatka.");
        input.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    input.value = "";
    showMessage("");
    save();
    render();
    input.focus();
}

function toggleDone(id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].done = !tasks[i].done;
            break;
        }
    }
    save();
    render();
}

function removeTask(id) {
    var newTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    save();
    render();
}

function clearCompleted() {
    var active = [];
    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) {
            active.push(tasks[i]);
        }
    }
    tasks = active;
    save();
    render();
}

/* Filter */
function setFilter(filter) {
    currentFilter = filter;

    for (var i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("active");
        if (filterButtons[i].dataset.filter === filter) {
            filterButtons[i].classList.add("active");
        }
    }

    render();
}

/* Render */
function render() {
    lista.innerHTML = "";

    for (var i = 0; i < tasks.length; i++) {
        if (currentFilter === "active" && tasks[i].done) continue;
        if (currentFilter === "done" && !tasks[i].done) continue;

        var li = document.createElement("li");
        if (tasks[i].done) li.classList.add("done");

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tasks[i].done;
        checkbox.onclick = (function (id) {
            return function () {
                toggleDone(id);
            };
        })(tasks[i].id);

        var span = document.createElement("span");
        span.className = "text";
        span.textContent = tasks[i].text;

        var del = document.createElement("button");
        del.textContent = "X";
        del.className = "icon-btn";
        del.onclick = (function (id) {
            return function () {
                removeTask(id);
            };
        })(tasks[i].id);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(del);

        lista.appendChild(li);
    }

    updateCounter(); 
}

/* Events */
addBtn.onclick = addTask;

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
});

input.addEventListener("input", function () {
    if (msg.textContent !== "") {
        showMessage("");
    }
});

clearDone.onclick = clearCompleted;

for (var i = 0; i < filterButtons.length; i++) {
    filterButtons[i].onclick = function () {
        setFilter(this.dataset.filter);
    };
}

load();
render();
input.focus(); 
