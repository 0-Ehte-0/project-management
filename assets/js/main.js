document.addEventListener("DOMContentLoaded", () => {
  // Flash messages auto-hide
  const alerts = document.querySelectorAll(".alert")
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach((alert) => {
        alert.style.opacity = "0"
        setTimeout(() => {
          alert.style.display = "none"
        }, 500)
      })
    }, 5000)
  }

  // Password confirmation validation
  const registerForm = document.querySelector('form[action*="register"]')
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm_password").value

      if (password !== confirmPassword) {
        e.preventDefault()
        alert("Passwords do not match!")
      }
    })
  }
})
