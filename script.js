let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!title || !amount) return alert("Fill all fields");

  const data = {
    id: Date.now(),
    title,
    amount: Number(amount),
    type,
    date: new Date().toLocaleDateString()
  };

  transactions.push(data);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTable();
  updateSummary();
  drawChart();
}

function renderTable() {
  const tbody = document.getElementById("transactionTable");
  tbody.innerHTML = "";

  transactions.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td class="${t.type}">₹${t.amount}</td>
        <td>${t.type}</td>
        <td>${t.date}</td>
        <td><button onclick="del(${t.id})">X</button></td>
      </tr>
    `;
  });
}

function del(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  renderTable();
  updateSummary();
  drawChart();
}

function updateSummary() {
  let inc = 0, exp = 0;

  transactions.forEach(t => {
    if (t.type === "income") inc += t.amount;
    else exp += t.amount;
  });

  document.getElementById("income").textContent = "₹" + inc;
  document.getElementById("expense").textContent = "₹" + exp;
  document.getElementById("balance").textContent = "₹" + (inc - exp);
}

let chart;

function drawChart() {
  const ctx = document.getElementById("chart").getContext("2d");

  const inc = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const exp = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [inc, exp]
      }]
    }
  });
}

renderTable();
updateSummary();
drawChart();
