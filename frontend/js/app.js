// const API = "https://bizconnect-advanced-project.onrender.com/api";
const API = " http://localhost:5000/api";

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

// async function loadBusinesses() {
//     const res = await fetch(API + "/business");
//     const data = await res.json();

//     document.getElementById("list").innerHTML =
//         data.map(b => `
//         <div class="card">
//             <h3>${b.businessName}</h3>
//             <p><b>Category:</b> ${b.category}</p>
//             <p><b>Location:</b> ${b.location}</p>
//             <p>${b.description}</p>
//         </div>
//         `).join("");
// }
async function loadBusinesses() {
    const res = await fetch(API + "/business");
    const data = await res.json();

    const container = document.getElementById("list");

    container.innerHTML = data.map(b => `
        <div class="business-card">
            ${b.image 
                ? `<img src="${b.image}?t=${new Date().getTime()}" class="business-img">`
                : `<div class="no-image">No Image</div>`
            }

            <h3>${b.businessName}</h3>
            <p><strong>Category:</strong> ${b.category || "N/A"}</p>
            <p>${b.description || ""}</p>
            <p class="location">📍 ${b.location || ""}</p>
        </div>
    `).join("");
}

/* ================= BUSINESS PROFILE ================= */

// function loadBusinessProfile() {
//     const business = JSON.parse(localStorage.getItem("business"));
//     if (!business) return;

//     businessName.value = business.businessName;
//     ownerName.value = business.ownerName;
//     category.value = business.category;
//     description.value = business.description;
//     location.value = business.location;
// }

// async function updateBusiness() {
//     const business = JSON.parse(localStorage.getItem("business"));
//     const token = localStorage.getItem("token");

//     const res = await fetch(API + "/business/" + business.id, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + token
//         },
//         body: JSON.stringify({
//             businessName: businessName.value,
//             ownerName: ownerName.value,
//             category: category.value,
//             description: description.value,
//             location: location.value
//         })
//     });

//     const updated = await res.json();
//     localStorage.setItem("business", JSON.stringify(updated));
//     alert("Profile Updated");
// }
async function loadBusinessProfile() {
    const business = JSON.parse(localStorage.getItem("business"));
    const token = localStorage.getItem("token");

    const res = await fetch(API + "/business/" + business.id);
    const data = await res.json();

    businessName.value = data.businessName || "";
    ownerName.value = data.ownerName || "";
    category.value = data.category || "";
    description.value = data.description || "";
    location.value = data.location || "";

    if (data.image) {
        document.getElementById("previewImage").src = data.image;
    }
}
async function updateBusiness(e) {
    e.preventDefault();

    const business = JSON.parse(localStorage.getItem("business"));
    const token = localStorage.getItem("token");

    // Update text fields
    await fetch(API + "/business/" + business.id, {
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

    // Upload image if selected
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
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById("previewImage").src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

/* ================= LOGOUT ================= */

function logout() {
    localStorage.clear();
    window.location = "index.html";
}