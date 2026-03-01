const API = "http://localhost:5000/api";

/* ================= USER ================= */

async function userRegister() {
    await fetch(API + "/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
        })
    });

    alert("User Registered");
}

async function userLogin() {
    const res = await fetch(API + "/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "user");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location = "user-dashboard.html";
    } else {
        alert(data.msg);
    }
}

/* ================= BUSINESS ================= */

async function businessRegister() {
    await fetch(API + "/business/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            businessName: businessName.value,
            ownerName: ownerName.value,
            email: email.value,
            password: password.value,
            category: category.value,
            description: description.value,
            location: location.value
        })
    });

    alert("Business Registered");
}

async function businessLogin() {
    const res = await fetch(API + "/business/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "business");
        localStorage.setItem("business", JSON.stringify(data.business));
        window.location = "business-dashboard.html";
    } else {
        alert(data.msg);
    }
}

/* ================= LOAD BUSINESSES ================= */

async function loadBusinesses() {
    const res = await fetch(API + "/business");
    const data = await res.json();

    document.getElementById("list").innerHTML =
        data.map(b => `
        <div class="card">
            <h3>${b.businessName}</h3>
            <p><b>Category:</b> ${b.category}</p>
            <p><b>Location:</b> ${b.location}</p>
            <p>${b.description}</p>
        </div>
        `).join("");
}

/* ================= BUSINESS PROFILE ================= */

function loadBusinessProfile() {
    const business = JSON.parse(localStorage.getItem("business"));
    if (!business) return;

    businessName.value = business.businessName;
    ownerName.value = business.ownerName;
    category.value = business.category;
    description.value = business.description;
    location.value = business.location;
}

async function updateBusiness() {
    const business = JSON.parse(localStorage.getItem("business"));
    const token = localStorage.getItem("token");

    const res = await fetch(API + "/business/" + business.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            businessName: businessName.value,
            ownerName: ownerName.value,
            category: category.value,
            description: description.value,
            location: location.value
        })
    });

    const updated = await res.json();
    localStorage.setItem("business", JSON.stringify(updated));
    alert("Profile Updated");
}

/* ================= LOGOUT ================= */

function logout() {
    localStorage.clear();
    window.location = "index.html";
}