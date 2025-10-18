document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href="/auth/login.html" + "?msg=4";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/check", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            localStorage.removeItem("access_token");
            window.location.href="/auth/login.html" + "?msg=4";
            return;
        }

        const data = await response.json();

        document.getElementById("welcome").textContent = data.msg;

    } catch (err) {
        alert("Error connecting to server");
    }
});
