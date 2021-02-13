const Modal = {
  handleModal() {
    const modal = document.querySelector(".modal-overlay")
    modal.classList.toggle("active")
  },
  start() {
    document.querySelector(".button.new")
      .addEventListener("click", this.handleModal)

    document.querySelector(".button.cancel")
      .addEventListener("click", this.handleModal)
  }
}