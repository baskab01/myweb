const loginForm = document.getElementById("loginForm");
const jumpscare = document.getElementById("jumpscare");
const scream = document.getElementById("scream");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    if (username === "admin" && password === "admin") {

        error.textContent = "Login successful";

        setTimeout(function() {
            jumpscare.classList.add("active");

            scream.currentTime = 0;
            scream.play();

        }, 500);

    } else {

        error.textContent = "Username หรือ Password ไม่ถูกต้อง";

    }
});
