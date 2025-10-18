document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/auth/login.html" + "?msg=4";
        return;
    }


    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    const alertContainer = document.querySelector(".alert_cd");


    if (msg === "1") {
        alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            Task added successfully. 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else if (msg === "2") {
        alertContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            Task updated successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    } else if (msg === "3") {
        alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            Task deleted successfully.
        <button aria-label="Close" class="btn-close" data-bs-dismiss="alert" type="button"></button>

        </div>`
    }


    function getStatus(value) {
        let statusText = "";
        let statusClass = "";

        switch (value) {
            case 0:
                statusText = "Pending";
                statusClass = "badge bg-warning text-dark";
                break;
            case 1:
                statusText = "Completed";
                statusClass = "badge bg-success";
                break;
            case 2:
                statusText = "Cancelled";
                statusClass = "badge bg-danger";
                break;
            default:
                statusText = "Unknown";
                statusClass = "badge bg-secondary";
                break;
        }

        return {statusText, statusClass};
    }


    const apiBase = "http://localhost:5000";
    let currentPage = 1;
    const perPage = 5;

    async function loadTasks(page = 1) {
        const response = await fetch(`${apiBase}/api/tasks?page=${page}&per_page=${perPage}`, {
            headers: {"Authorization": `Bearer ${token}`}
        });

        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.href = "/auth/login.html" + "?msg=4";
            return;
        }

        const data = await response.json();


        renderTasks(data.tasks);
        renderPagination(data.page, data.total_pages);
    }

    function renderTasks(tasks) {
        const tbody = document.getElementById("tasksTableBody");
        tbody.innerHTML = "";
        if (tasks.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
      <td colspan="5" class="text-center text-muted">No tasks to display</td>
    `;
            tbody.appendChild(tr);
            return;
        }
        tasks.forEach((task, index) => {

            const tr = document.createElement("tr");
            const {statusText, statusClass} = getStatus(task.status);

            const date = task.due_date ? new Date(task.due_date).toLocaleString("en-US") : "-";

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${task.title}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${date}</td>
                <td>
                    <a href="./edit.html?id=${task.id}" class="btn btn-primary btn-sm">Edit</a>
                    <a  class="btn btn-danger btn-sm deleteTag" data-id="${task.id}">Delete</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderPagination(current, total) {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";

        for (let i = 1; i <= total; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = `btn btn-sm ${i === current ? "btn-primary" : "btn-outline-primary"} mx-1`;
            btn.addEventListener("click", () => loadTasks(i));
            pagination.appendChild(btn);
        }
    }

    loadTasks(currentPage);
});
