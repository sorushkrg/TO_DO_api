document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        window.location.href = "/auth/login.html";
        return;
    }

    document.addEventListener("click", async (e) => {
        if (e.target.classList.contains("deleteTag")) {
            const encodedId = e.target.dataset.id;

            if (!encodedId) {
                Swal.fire("Error", "Task ID not found.", "error");
                return;
            }

            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel"
            });

            // ✅ اینجا بررسی کن که آیا کاربر تأیید کرده یا کنسل
            if (!result.isConfirmed) {
                return; // اگر کنسل زده، هیچ کاری نکن
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/tasks/${encodedId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const err = await response.json();
                    Swal.fire("Error", err.message || "Failed to delete task.", "error");
                    return;
                }

                window.location.href = "index.html?msg=3";

            } catch (err) {
                Swal.fire("Error", "Server connection failed.", "error");
            }
        }
    });
});
