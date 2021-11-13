const myInputPassword = document.querySelectorAll(".inputPassword");
const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {
    // When an input is checked, and the the type is password
    // simply chnage it's type to text otherwise make it a password type
    for (input of myInputPassword) {
        if (input.getAttribute("type") === "password") {
            input.setAttribute("type", "text");
        } else {
            input.setAttribute("type", "password");
        }
    }
})