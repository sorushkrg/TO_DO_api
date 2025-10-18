document.addEventListener("DOMContentLoaded", async date => {


    const editForm = document.getElementById("editForm");

    const params = new URLSearchParams(window.location.search);
    const encodedId = params.get("id");


    if (!encodedId) {
        window.location.href = "index.html";
        return;
    }


    flatpickr("#due_date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true
    });


    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/auth/login.html" + "?msg=4";
        return;
    }


    try {
        const response = await fetch("http://127.0.0.1:5000/check", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.href = "/auth/login.html" + "?msg=4";
        } else {

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/tasks/${encodedId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error("Failed to load task data");

                const data = await response.json();
                const task = data.task;
                console.log(task);

                document.getElementById("title").value = task.title;
                document.getElementById("description").value = task.description;
                document.getElementById("status").value = String(task.status ?? "0");
                const dueDateInput = document.getElementById("due_date");

                const fp = flatpickr(dueDateInput, {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    time_24hr: true,
                });

                if (task.due_date) {
                    fp.setDate(task.due_date, true, "Y-m-d H:i");
                }


            } catch (err) {
                alert("Error loading task data");
            }

            editForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                const updatedTask = {
                    title: document.getElementById("title").value.trim(),
                    description: document.getElementById("description").value.trim(),
                    status: parseInt(document.getElementById("status").value),
                    due_date: document.getElementById("due_date").value
                        ? new Date(document.getElementById("due_date").value).toISOString()
                        : null
                };

                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${encodedId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedTask)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        document.getElementById("titleEr").textContent = "";
                        document.getElementById("descriptionEr").textContent = "";
                        document.getElementById("due_dateEr").textContent = "";


                        for (const key in errorData) {
                            const errors = errorData[key];
                            if (key === "title") {
                                document.getElementById("titleEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                            }
                            if (key === "description") {
                                document.getElementById("descriptionEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                            }
                            if (key === "due_date") {
                                document.getElementById("due_dateEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                            }
                        }
                        return;
                    }

                    window.location.href = "index.html" + "?msg=2";

                } catch (err) {
                    alert("Error updating task");
                }
            });


        }

    } catch (err) {
        alert("Error connecting to server");
    }


});
