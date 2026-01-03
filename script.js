// Base API URL (adjust to your backend)
const API_URL = "http://localhost:5000/api";

// Show/Hide sections
function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  // Load dashboard charts when dashboard is shown
  if (id === "dashboard") {
    loadDashboard();
  }
}

// Login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
    showSection("employees");
    loadEmployees();
  } else {
    alert("Login failed!");
  }
}

// Add Employee
async function addEmployee() {
  const emp = {
    name: document.getElementById("empName").value,
    email: document.getElementById("empEmail").value,
    department: document.getElementById("empDept").value,
    salary: document.getElementById("empSalary").value
  };

  const res = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(emp)
  });

  const data = await res.json();
  alert("Employee added!");
  loadEmployees();
}

// Load Employees
async function loadEmployees() {
  const res = await fetch(`${API_URL}/employees`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });
  const employees = await res.json();
  document.getElementById("employee-list").innerHTML =
    employees.map(e => `<p>${e.id}: ${e.name} - ${e.role}</p>`).join("");
}

// Mark Attendance
async function markAttendance() {
  const att = {
    employee_id: document.getElementById("attEmpId").value,
    date: document.getElementById("attDate").value,
    status: document.getElementById("attStatus").value
  };

  await fetch(`${API_URL}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(att)
  });

  alert("Attendance marked!");
}

// Dashboard Charts
function loadDashboard() {
  const ctx1 = document.getElementById('attendanceChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Attendance',
        data: [20, 18, 22, 19, 21], // sample values
        backgroundColor: ['#20b2aa', '#4682b4', '#ff4500', '#2e8b57', '#dd2476']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  const ctx2 = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ['Excellent', 'Good', 'Average', 'Poor'],
      datasets: [{
        data: [40, 30, 20, 10],
        backgroundColor: ['#4caf50', '#2196f3', '#ffeb3b', '#f44336']
      }]
    },
    options: { responsive: true }
  });
}