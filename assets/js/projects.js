document.addEventListener("DOMContentLoaded", () => {
  // Project status color update
  const statusSelects = document.querySelectorAll('select[name="status"]')
  statusSelects.forEach((select) => {
    select.addEventListener("change", function () {
      const statusValue = this.value.toLowerCase().replace(" ", "-")
      this.className = `status-${statusValue}`
    })
  })
})
