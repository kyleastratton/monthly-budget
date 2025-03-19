const users = { admin: "password123", user: "pass" };

function loadDashboard() {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    document.getElementById("app").innerHTML = `
            <div id="dashboard">
                <div id="loginForm">
                    <h2>Login</h2>
                    <input type="text" id="username" placeholder="Username">
                    <input type="password" id="password" placeholder="Password">
                    <button onclick="login()">Login</button>
                    <p id="error" style="color: red;"></p>
                </div>
            </div>
        `;
  } else {
    document.getElementById("app").innerHTML = `
            <div id="dashboard">
                <!--- <h2>Welcome, <span id="user">${user}</span></h2> --->
                <table>
                    <thead>
                        <tr>
                            <th>Expense</th>
                            <th class="right">Amount (£)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="budgetTable"></tbody>
                    <tfoot>
                        <tr id="totalRow">
                            <td>Total</td>
                            <td class="right" id="totalAmount">£0.00</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                <button class="add-row-btn" onclick="addRow()">Add Expense</button>
                <button onclick="saveBudget()">Save Budget</button>
                <button onclick="logout()">Logout</button>
            </div>
        `;
    loadBudget();
  }
}

function loadBudget() {
  const savedBudget = JSON.parse(localStorage.getItem("budget")) || [
    { name: "Mortgage", amount: 0 },
    { name: "Telephone", amount: 0 },
    { name: "Broadband", amount: 0 },
    { name: "Utilities", amount: 0 },
    { name: "Groceries", amount: 0 },
    { name: "Subscriptions", amount: 0 },
  ];

  const tableBody = document.getElementById("budgetTable");
  tableBody.innerHTML = savedBudget
    .map(
      (expense, index) => `
        <tr>
            <td><input type="text" value="${expense.name}" data-index="${index}" class="expense-name left" oninput="saveBudget()"></td>
            <td class="right"><input type="number" value="${expense.amount}" data-index="${index}" class="expense-amount right" oninput="updateTotal()"></td>
            <td><button class="remove-btn" onclick="removeRow(${index})">X</button></td>
        </tr>
    `
    )
    .join("");

  updateTotal();
}

function addRow() {
  const tableBody = document.getElementById("budgetTable");
  const index = tableBody.children.length;

  const row = document.createElement("tr");
  row.innerHTML = `
        <td><input type="text" value="New Expense" data-index="${index}" class="expense-name left" oninput="saveBudget()"></td>
        <td class="right"><input type="number" value="0" data-index="${index}" class="expense-amount right" oninput="updateTotal()"></td>
        <td><button class="remove-btn" onclick="removeRow(${index})">X</button></td>
    `;

  tableBody.appendChild(row);
  saveBudget();
}

function removeRow(index) {
  const budget = JSON.parse(localStorage.getItem("budget")) || [];
  budget.splice(index, 1);
  localStorage.setItem("budget", JSON.stringify(budget));
  loadBudget();
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll(".expense-amount").forEach((input) => {
    total += parseFloat(input.value) || 0;
  });
  totalFixed = total.toFixed(2);
  totalAmount = numberWithCommas(totalFixed);
  document.getElementById("totalAmount").innerText = `£${totalAmount}`;
  saveBudget();
}

function saveBudget() {
  const budget = [];
  document.querySelectorAll("#budgetTable tr").forEach((row) => {
    const name = row.querySelector(".expense-name")?.value || "";
    const amount = row.querySelector(".expense-amount")?.value || 0;
    if (name.trim() !== "") {
      budget.push({ name, amount: parseFloat(amount) });
    }
  });
  localStorage.setItem("budget", JSON.stringify(budget));
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    loadDashboard();
  } else {
    document.getElementById("error").innerText = "Invalid credentials!";
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  loadDashboard();
}

window.onload = loadDashboard;
