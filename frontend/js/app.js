const API = "https://bizconnect-advanced-project.onrender.com/api";
// const API = "http://localhost:5000/api";

/* ================= USER ================= */

async function userRegister() {
    try {
        await fetch(API + "/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        alert("User Registered Successfully!");
        window.location = "user-login.html";

    } catch (err) {
        console.error(err);
        alert("Registration failed");
    }
}

async function userLogin() {
    try {
        const res = await fetch(API + "/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "user");
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location = "user-dashboard.html";
        } else {
            alert(data.msg || "Login failed");
        }

    } catch (err) {
        console.error(err);
        alert("Login error");
    }
}

/* ================= BUSINESS ================= */

async function businessRegister() {
    try {
        await fetch(API + "/business/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                businessName: document.getElementById("businessName").value,
                ownerName: document.getElementById("ownerName").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                category: document.getElementById("category").value,
                description: document.getElementById("description").value,
                location: document.getElementById("location").value
            })
        });

        alert("Business Registered Successfully!");
        window.location = "business-login.html";

    } catch (err) {
        console.error(err);
        alert("Registration failed");
    }
}

async function businessLogin() {
    try {
        const res = await fetch(API + "/business/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", "business");
            localStorage.setItem("business", JSON.stringify(data.business));
            window.location = "business-dashboard.html";
        } else {
            alert(data.msg || "Login failed");
        }

    } catch (err) {
        console.error(err);
        alert("Login error");
    }
}

/* ================= LOAD BUSINESSES ================= */

async function loadBusinesses() {
    try {
        const res = await fetch(API + "/business");
        const data = await res.json();

        const container = document.getElementById("businessList");
        if (!container) return;

        if (!data.length) {
            container.innerHTML = `
                <p class="text-gray-400 col-span-full text-center">
                    No businesses found.
                </p>
            `;
            return;
        }

        container.innerHTML = data.map(b => `
            <div class="bg-[#0f172a] border border-blue-500 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/40 transition">

                ${b.image
                    ? `<img src="${b.image}?t=${Date.now()}" class="w-full h-48 object-cover">`
                    : `<div class="h-48 flex items-center justify-center text-gray-500">
                        No Image
                       </div>`
                }

                <div class="p-5">
                    <h3 class="text-lg font-bold text-white">${b.businessName}</h3>
                    <p class="text-sm text-blue-400 mt-1">${b.category || "Uncategorized"}</p>
                    <p class="text-gray-400 text-sm mt-2">${b.description || ""}</p>
                    <p class="text-gray-500 text-xs mt-3">📍 ${b.location || ""}</p>
                </div>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
    }
}

/* ================= BUSINESS PROFILE ================= */

async function loadBusinessProfile() {
    const business = JSON.parse(localStorage.getItem("business"));
    if (!business) return;

    const res = await fetch(API + "/business/" + business.id);
    const data = await res.json();

    document.getElementById("businessName").value = data.businessName || "";
    document.getElementById("ownerName").value = data.ownerName || "";
    document.getElementById("category").value = data.category || "";
    document.getElementById("description").value = data.description || "";
    document.getElementById("location").value = data.location || "";

    if (data.image) {
        document.getElementById("previewImage").src = data.image;
    }
}

async function updateBusiness(e) {
    e.preventDefault();

    const business = JSON.parse(localStorage.getItem("business"));
    const token = localStorage.getItem("token");

    await fetch(API + "/business/" + business.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            businessName: document.getElementById("businessName").value,
            ownerName: document.getElementById("ownerName").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            location: document.getElementById("location").value
        })
    });

    const fileInput = document.getElementById("image");

    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        await fetch(API + "/business/upload-image/" + business.id, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        });
    }

    alert("Profile Updated Successfully!");
    location.reload();
}

/* ================= LOGOUT ================= */

function logout() {
    localStorage.clear();
    window.location = "index.html";
}