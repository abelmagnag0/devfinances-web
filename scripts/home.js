const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transactions",
      JSON.stringify(Transaction.all))
  }
}

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  areYouSure(index){
     const message = `<button onclick="Modal.handleAddedModal()"><img src="./assets/close.svg" alt="Fechar"><h2 class="sr-only">Fechar</h2></button><h2 style="text-align: left;">O(a) senhor(a) tem certeza que gostaria de excluir a transação?</h2><a href="#" class="button cancel" onclick="Transaction.remove(${index})">Sim, desejo excluir a transação permanentemente.</a>`
    
    const modal = Modal.createModal(message)
    
  },
  remove(index) {
      Modal.handleAddedModal()
      Transaction.all.splice(index, 1)
      App.reload()
  },
  incomes() {
    let income = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })

    return income
  },
  expenses() {
    let expense = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })

    return expense
  },
  total() {
    // entrada - saida
    let total = this.incomes() + this.expenses()

    return total
  }
}

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = this.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    this.transactionsContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? 'income' : 'expense'

    const html = `<td class="description">${transaction.description}</td>
    <td class="${cssClass}">${Utils.formatCurrency(transaction.amount)}</td>
    <td class="date">${transaction.date}</td>
    <td class="category">${transaction.category}</td>
    <td class="remove">
    <img onclick="Transaction.areYouSure(${index})" src="./assets/minus.svg" alt="Remover Transação"
    </td>
      `
    return html
  },
  addEachTransaction() {
    Transaction.all.forEach((transaction, index) => {
      this.addTransaction(transaction, index)
    })
  },
  updateBalance() {
    document
      .querySelector("#incomeDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .querySelector("#expenseDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .querySelector("#totalDisplay")
      .innerHTML = Utils.formatCurrency(Transaction.total())

  },
  clearTransaction() {
    this.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value) {
    value = Number(value) * 100
    return value
  },
  formatDate(date) {
    const splittedDate = date.split("-")
    const [year, month, day] = splittedDate
    return `${day}/${month}/${year}`
  },
  formatCategory(category) {
    switch (category) {
      case "0":
        category = "Renda"
        break
      case "1":
        category = "Lazer"
        break
      case "2":
        category = "Despesas da casa"
        break
      case "3":
        category = "Despesas de automóveis"
        break
      case "4":
        category = "Outros"
        break
    }
    return category
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value
  },
  buttonValue(button){
    if(button.value == 0){
      return "Não"
    }
    if(button.value == 1){
      return "Sim"
    }
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),
  category: document.querySelector("select#category"),
  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
      category: Form.category.value
    }
  },
  validateFields() {
    const { description, amount, date, category } = Form.getValues()

    if (description.trim() == "" || amount.trim() == "" || date.trim() == "" || category.trim() == "") {
      throw new Error("Por favor, preencha todos os campos")
    }

  },
  formatValues() {
    let { description, amount, date, category } = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    category = Utils.formatCategory(category)

    return {
      description,
      amount,
      date,
      category
    }
  },
  transactionAdded() {
    const message = `<button onclick="Modal.handleAddedModal()"><img src="./assets/close.svg" alt="Fechar"><h2 class="sr-only">Fechar</h2></button><h2>Transação adicionada com sucesso!</h2>`
    Modal.createModal(message)
  },
  saveTransaction(transaction) {
    Transaction.add(transaction)
  },
  clearForm() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  submit(event) {
    event.preventDefault()

    try {
      this.validateFields()
      const transaction = this.formatValues()
      this.saveTransaction(transaction)
      this.clearForm()
      Modal.handleModal()
      this.transactionAdded()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Modal.start()
    DOM.addEachTransaction()
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransaction()
    this.init()
  }
}

App.init()

