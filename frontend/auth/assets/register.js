document.addEventListener("DOMContentLoaded", () => {
    const apiBase = "http://localhost:5000";

    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const name = document.getElementById("name").value.trim();
        const password = document.getElementById("password").value.trim();



        try {
            const response = await fetch(apiBase + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password, name}),
            });

            if (!response.ok) {
                const errorData = await response.json();


                document.getElementById("emailEr").textContent = "";
                document.getElementById("passwordEr").textContent = "";
                document.getElementById("nameEr").textContent = "";


                for (const key in errorData) {
                    const errors = errorData[key];
                    if (key === "email") {
                        document.getElementById("emailEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                    }
                    if (key === "password") {
                        document.getElementById("passwordEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                    }
                    if (key === "name") {
                        document.getElementById("nameEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                    }
                }
                return;
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access_token);
            window.location.href = "/dashboard/dashboard.html";
        } catch (err) {
            alert("خطا در اتصال به سرور ❌");
        }
    });
});
