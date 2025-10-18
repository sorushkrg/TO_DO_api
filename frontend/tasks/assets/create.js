document.addEventListener("DOMContentLoaded", async () => {


    const createForm = document.getElementById("createForm");


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

            createForm.addEventListener("submit", async function (e) {
                const title = document.getElementById("title").value.trim();
                const description = document.getElementById("description").value.trim();
                const due_date = document.getElementById("due_date").value.trim();
                e.preventDefault();

                try {
                    const response = await fetch("http://127.0.0.1:5000/api/tasks", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,


                        },
                        body: JSON.stringify({title, due_date, description}),
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
                    window.location.href = "/tasks/index.html" + "?msg=1";
                } catch (err) {
                    alert("خطا در اتصال به سرور ❌");
                }
            });


        }


    } catch (err) {
        alert("Error connecting to server");
    }


});
