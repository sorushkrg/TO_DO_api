document.addEventListener("DOMContentLoaded", () => {
    const apiBase = "http://localhost:5000";

    const loginForm = document.getElementById("loginForm");


    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");
    const alertContainer = document.querySelector(".alert_cd");


    if (msg === "4") {
        alertContainer.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            please log in.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }


    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();


        try {
            const response = await fetch(apiBase + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password}),
            });

            if (!response.ok) {
                const errorData = await response.json();

                document.getElementById("emailEr").textContent = "";
                document.getElementById("passwordEr").textContent = "";

                for (const key in errorData) {
                    const errors = errorData[key];
                    if (key === "email") {
                        document.getElementById("emailEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
                    }
                    if (key === "password") {
                        document.getElementById("passwordEr").innerHTML = errors.map(err => `<div>${err}</div>`).join("");
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
