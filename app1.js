// Storage keys
const STORAGE_KEY = 'attendanceData.v1';
const USERS_KEY = 'users.v1';
const CURRENT_USER_KEY = 'currentUser.v1';

// State
let attendanceData = [];
let users = [];
let currentUser = null;

// Elements
const authPage = document.getElementById('authPage');
const appPage = document.getElementById('appPage');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const employeeNameEl = document.getElementById('employeeName');
const checkInBtn = document.getElementById('checkInBtn');
const checkOutBtn = document.getElementById('checkOutBtn');
const tbody = document.querySelector('#attendanceTable tbody');
const searchEl = document.getElementById('search');
const dateFilterEl = document.getElementById('dateFilter');
const statusFilterEl = document.getElementById('statusFilter');
const statEmployeesEl = document.getElementById('statEmployees');
const statPresentEl = document.getElementById('statPresent');
const statHoursEl = document.getElementById('statHours');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserEl = document.getElementById('currentUser');

// Utils
function toISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso;
  }
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function diffHours(isoIn, isoOut) {
  if (!isoIn || !isoOut) return 0;
  const a = new Date(isoIn);
  const b = new Date(isoOut);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return 0;
  const ms = Math.max(0, b - a);
  return ms / 36e5;
}

function showMessage(message, type = 'error') {
  // Remove existing messages
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;
  messageEl.textContent = message;
  
  const authCard = document.querySelector('.auth-card');
  authCard.insertBefore(messageEl, authCard.firstChild);
  
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.remove();
    }
  }, 5000);
}

// Authentication Functions
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    users = raw ? JSON.parse(raw) : [];
  } catch {
    users = [];
  }
}

function saveUsers() {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    currentUser = raw ? JSON.parse(raw) : null;
  } catch {
    currentUser = null;
  }
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function login(email, password) {
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    showMessage('User not found. Please check your email.');
    return false;
  }
  
  if (user.password !== password) {
    showMessage('Invalid password. Please try again.');
    return false;
  }
  
  currentUser = user;
  saveCurrentUser();
  return true;
}

function signup(name, email, password, confirmPassword) {
  if (password !== confirmPassword) {
    showMessage('Passwords do not match.');
    return false;
  }
  
  if (password.length < 6) {
    showMessage('Password must be at least 6 characters long.');
    return false;
  }
  
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    showMessage('User already exists with this email.');
    return false;
  }
  
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers();
  
  currentUser = newUser;
  saveCurrentUser();
  return true;
}

function logout() {
  currentUser = null;
  saveCurrentUser();
  showAuthPage();
}

function showAuthPage() {
  authPage.style.display = 'block';
  appPage.style.display = 'none';
  // Clear forms
  loginForm.reset();
  signupForm.reset();
}

function showAppPage() {
  authPage.style.display = 'none';
  appPage.style.display = 'block';
  appPage.classList.add('fade-in');
  
  if (currentUser) {
    currentUserEl.textContent = currentUser.name;
  }
  
  // Initialize attendance system
  load();
  render();
}

// Attendance System Functions
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    attendanceData = raw ? JSON.parse(raw) : [];
  } catch {
    attendanceData = [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceData));
}

function getToday() {
  return toISODate(new Date());
}

function getNowISO() {
  return new Date().toISOString();
}

// Core actions
function checkIn() {
  const name = (employeeNameEl.value || '').trim();
  if (!name) return alert('Please enter employee name!');
  const today = getToday();
  let record = attendanceData.find(r => r.name.toLowerCase() === name.toLowerCase() && r.date === today);
  if (record && record.checkIn) return alert('Already checked in today!');

  if (!record) {
    record = {
      id: Date.now(),
      name,
      date: today,
      checkIn: getNowISO(),
      checkOut: '',
      hours: 0,
      status: 'Present'
    };
    attendanceData.push(record);
  } else {
    record.checkIn = getNowISO();
    record.status = 'Present';
    record.hours = 0;
    record.checkOut = '';
  }

  save();
  render();
}

function checkOut() {
  const name = (employeeNameEl.value || '').trim();
  if (!name) return alert('Please enter employee name!');
  const today = getToday();
  const record = attendanceData.find(r => r.name.toLowerCase() === name.toLowerCase() && r.date === today);
  if (!record) return alert('No check-in found for today!');
  if (record.checkOut) return alert('Already checked out today!');

  record.checkOut = getNowISO();
  record.hours = Number(diffHours(record.checkIn, record.checkOut).toFixed(2));
  record.status = 'Completed';

  save();
  render();
}

// Filters and view
function applyFilters(records) {
  const q = (searchEl.value || '').trim().toLowerCase();
  const date = dateFilterEl.value; // ISO yyyy-mm-dd or ''
  const status = statusFilterEl.value; // all | Present | Completed

  return records.filter(r => {
    const matchesName = q ? r.name.toLowerCase().includes(q) : true;
    const matchesDate = date ? r.date === date : true;
    const matchesStatus = status === 'all' ? true : r.status === status;
    return matchesName && matchesDate && matchesStatus;
  });
}

function renderStats(records) {
  const today = getToday();
  const todayRecords = records.filter(r => r.date === today);
  const uniqueNames = new Set(todayRecords.map(r => r.name.toLowerCase()));
  const present = todayRecords.filter(r => r.status === 'Present').length;
  const totalHours = todayRecords.reduce((sum, r) => sum + (Number(r.hours) || 0), 0);

  statEmployeesEl.textContent = uniqueNames.size;
  statPresentEl.textContent = present;
  statHoursEl.textContent = totalHours.toFixed(2);
}

function renderTable() {
  const filtered = applyFilters(attendanceData);
  tbody.innerHTML = '';
  for (const r of filtered) {
    const tr = document.createElement('tr');
    const badgeClass = r.status === 'Completed' ? 'badge completed' : 'badge present';
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${formatDate(r.date)}</td>
      <td>${formatTime(r.checkIn) || '-'}</td>
      <td>${formatTime(r.checkOut) || '-'}</td>
      <td>${r.hours ? `${Number(r.hours).toFixed(2)} hrs` : '-'}</td>
      <td><span class="${badgeClass}">${r.status}</span></td>
    `;
    tbody.appendChild(tr);
  }
  renderStats(attendanceData);
}

function render() {
  renderTable();
}

// Export / Clear
function exportCSV() {
  if (!attendanceData.length) return alert('No data to export.');
  const headers = ['Employee Name','Date','Check-In','Check-Out','Working Hours','Status'];
  const rows = attendanceData.map(r => [
    r.name,
    formatDate(r.date),
    formatTime(r.checkIn),
    formatTime(r.checkOut),
    r.hours ? Number(r.hours).toFixed(2) : '0',
    r.status
  ]);

  const csv = [headers, ...rows].map(line => line.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_${toISODate()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearAll() {
  if (!confirm('Clear all attendance records? This cannot be undone.')) return;
  attendanceData = [];
  save();
  render();
}

// Tab switching
function switchTab(tabName) {
  // Update tab buttons
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    }
  });
  
  // Update forms
  const forms = document.querySelectorAll('.auth-form');
  forms.forEach(form => {
    form.classList.remove('active');
    if (form.id === `${tabName}Form`) {
      form.classList.add('active');
    }
  });
}

// Event Listeners
function initAuth() {
  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (login(email, password)) {
      showMessage('Login successful!', 'success');
      setTimeout(() => {
        showAppPage();
      }, 1000);
    }
  });

  // Signup form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (signup(name, email, password, confirmPassword)) {
      showMessage('Account created successfully!', 'success');
      setTimeout(() => {
        showAppPage();
      }, 1000);
    }
  });
}

function initApp() {
  // Attendance controls
  checkInBtn.addEventListener('click', checkIn);
  checkOutBtn.addEventListener('click', checkOut);
  
  // Filters
  searchEl.addEventListener('input', render);
  dateFilterEl.addEventListener('change', render);
  statusFilterEl.addEventListener('change', render);
  
  // Actions
  exportCsvBtn.addEventListener('click', exportCSV);
  clearAllBtn.addEventListener('click', clearAll);
  logoutBtn.addEventListener('click', logout);

  // Enter to check-in quickly
  employeeNameEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkIn();
  });
}

// Initialize app
function init() {
  loadUsers();
  loadCurrentUser();
  
  // Check if user is already logged in
  if (currentUser) {
    showAppPage();
    initApp();
  } else {
    showAuthPage();
    initAuth();
  }
}

// Start the application
document.addEventListener('DOMContentLoaded', init);
