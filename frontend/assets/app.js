document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("access_token");
    const login = document.getElementById("logout");
    const button = document.getElementById("log");
    const dash = document.getElementById("dash");


    if (token) {
        login.classList.remove("d-none");
        button.addEventListener("click", () => {
            localStorage.removeItem("access_token");

        });
    } else {
        dash.classList.add("d-none");
    }





});