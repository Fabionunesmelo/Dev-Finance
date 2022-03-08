const DEV_FINANCE_PREFIX = "dev-finance:"

function toggleModal() {
  const modal = document.querySelector('.modal-overlay')
  modal.classList.toggle('active')
}

function getTransactions() {
  const transactionsText = localStorage.getItem(DEV_FINANCE_PREFIX + "transactions")
  return JSON.parse(transactionsText) || []
}

function saveTransactions(transactions) {
  localStorage.setItem(DEV_FINANCE_PREFIX + "transactions", JSON.stringify(transactions))
}

function loadTransactions() {
  const transactionsTable = document.querySelector('#transactions table tbody')
  transactionsTable.innerHTML = ""

  const transactions = getTransactions()
  
  transactions.forEach(addTransactionToTable)
  
  const totals = getTotals()
  
  const incomeCard = document.querySelector('#income-card p')
  incomeCard.innerHTML = totals.income

  const expensesCard = document.querySelector('#expenses-card p')
  expensesCard.innerHTML = totals.expenses

  const totalCard = document.querySelector('#total-card p')
  totalCard.innerHTML = totals.total
}

function addTransaction(event) {
  event.preventDefault()
  
  const description = document.querySelector('#description').value
  const amount = document.querySelector('#amount').value
  const date = document.querySelector('#date').value

  if (Number.isNaN(Number(amount))) {
    alert('Valor deve ser um número válido')
    return
  }
  
  let missingFields = []
  
  if (!description) {
    missingFields.push('descriçao')
  }

  if (!amount) {
    missingFields.push('valor')
  }

  if (!date) {
    missingFields.push('data')
  }

  if (missingFields.length > 0) {
    alert('Por favor preencha todos os campos. Campos vazios: ' + missingFields.join(', '))
    return
  }

  addNewTransaction({description, amount, date})
  loadTransactions()
  toggleModal()

  const descriptionInput = document.querySelector('#description')
  const amountInput = document.querySelector('#amount')
  const dateInput = document.querySelector('#date')

  descriptionInput.value = ""
  amountInput.value = ""
  dateInput.value = ""
}

function addNewTransaction({description, amount, date}) {
  const currentTransactions = getTransactions()
  
  currentTransactions.push({
    id: Math.floor(Math.random() * 100000).toString(),
    description,
    amount: Number(amount) * 100,
    date,
  })

  saveTransactions(currentTransactions)
}

function formatAmount(amount) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount / 100)
}

function addTransactionToTable({description, amount, date, id}) {
  const transactionsTable = document.querySelector('#transactions table tbody')

  const formattedAmount = formatAmount(amount)
  const formattedDate = new Date(date).toLocaleString('pt-BR', { timeZone: 'UTC' }).split(" ")[0]

  
  transactionsTable.innerHTML += `
    <tr>
      <td class="description">${description}</td>
      <td class="${amount < 0 ? "expense" : "income"}">${formattedAmount}</td>
      <td class="date">${formattedDate}</td>
      <td>
        <button onclick="deleteTransaction('${id}')">
          <img src="./assets/minus.svg" alt="Remover transação" />
        </button>
      </td>
    </tr>
  `
}

function getTotals() {
  let income = 0;
  let expenses = 0;

  const transactions = getTransactions()
  
  transactions.forEach(transaction => {
    if (transaction.amount > 0) {
      income += transaction.amount
    }

    if (transaction.amount < 0) {
      expenses += transaction.amount
    }
  })
  
  return {
    income: formatAmount(income),
    expenses: formatAmount(expenses),
    total: formatAmount(income + expenses),
  }
}

function deleteTransaction(id) {
  const transactions = getTransactions()
  
  const index = transactions.findIndex(transaction => transaction.id === id)
  
  transactions.splice(index, 1)

  saveTransactions(transactions)
  
  loadTransactions()
}

loadTransactions()