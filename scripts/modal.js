const Modal = {
  handleModal() {
    const modal = document.querySelector(".modal-overlay")
    modal.classList.toggle("active")
  },
  handleAddedModal() {
    const modal = document.querySelectorAll(".modal-overlay")[1]
    modal.classList.toggle("active")
    
    const body = document.querySelector("body")
    body.removeChild(modal)
  },
  createModal(message){
    const modalOverlay = document.createElement("div")
    const modal = document.createElement("div")
    modalOverlay.classList.add("modal-overlay")
    modalOverlay.classList.add("active")
    modal.classList.add("modal")
    modal.classList.add("highest")

    const div = document.createElement("div")
    div.classList.add("modal-button")
    div.innerHTML = `${message}`

    modal.appendChild(div)
    modalOverlay.appendChild(modal)

    const body = document.querySelector("body")
    body.appendChild(modalOverlay)
  },
  start() {
    document.querySelector(".button.new")
      .addEventListener("click", this.handleModal)

    document.querySelector(".button.cancel")
      .addEventListener("click", this.handleModal)
  }
}