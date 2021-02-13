const Transaction = {
  all: [
    {
      id: 1,
      description: "Luz",
      amount: -50000,
      date: "23/01/2021"
    },
    {
      id: 2,
      description: "Website",
      amount: 500000,
      date: "23/01/2021"
    },
    {
      id: 3,
      description: "Internet",
      amount: -20000,
      date: "23/01/2021"
    }
  ],
  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  remove(index) {
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
    tr.innerHTML = this.innerHTMLTransaction(transaction)
    this.transactionsContainer.appendChild(tr)
  },
  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? 'income' : 'expense'

    const html = `<td class="description">${transaction.description}</td>
    <td class="${cssClass}">${Utils.formatCurrency(transaction.amount)}</td>
    <td class="date">${transaction.date}</td>
    <td class="remove"><img onclick="DOM.removeTransaction()" src="./assets/minus.svg" alt="Remover Transação"></td>
      `
    return html
  },
  addEachTransaction() {
    Transaction.all.forEach(transaction => {
      this.addTransaction(transaction)
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
  formatAmount(value){
    value = Number(value) * 100
    return value
  },
  formatDate(date){
    const splittedDate = date.split("-")
    console.log(splittedDate)
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
  }
}

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),
  getValues(){
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  validateFields(){
    const {description, amount, date} = Form.getValues()
    
    if(description.trim() == "" || amount.trim() == "" || date.trim() == ""){
      throw new Error("Por favor, preencha todos os campos")
    }
    
  },
  formatValues(){
    let { description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    
  },
  submit(event){
    event.preventDefault()

    try {
      // this.validateFields()
      //Formatar os dados
      this.formatValues()
      //salvar

      //apagar os dados do form

      //modal handle

      //att o app

    } catch (error) {

      alert(error.message)
    }
  }
}

const App = {
  init() {
    Modal.start()

    DOM.updateBalance()
    DOM.addEachTransaction()
  },
  reload() {
    DOM.clearTransaction()
    this.init()
  }
}

App.init()
