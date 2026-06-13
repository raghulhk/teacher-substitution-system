if (!localStorage.getItem("token")) {
  window.location.href = "/";
}

const API = "http://localhost:3000";

// Animate numbers on page load
function animateNumber(element, target, duration = 1500) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.innerText = target;
      clearInterval(timer);
    } else {
      element.innerText = Math.floor(current);
    }
  }, 16);
}

// Load dashboard data
async function loadDashboard() {
  try {
    // Show loading state
    document.querySelectorAll('.stat-number').forEach(el => {
      el.innerText = '...';
    });

    // Fetch all data in parallel
    const [teachersRes, timetableRes, substitutionsRes] = await Promise.all([
      fetch(`${API}/api/teachers`),
      fetch(`${API}/api/timetable`),
      fetch(`${API}/api/substitution`)
    ]);

    const teacherData = await teachersRes.json();
    const timetableData = await timetableRes.json();
    const substitutionData = await substitutionsRes.json();

    // Update DOM with data
    const teacherCount = document.getElementById("teacherCount");
    const timetableCount = document.getElementById("timetableCount");
    const subCount = document.getElementById("subCount");

    // Animate numbers
    animateNumber(teacherCount, teacherData.length || 0);
    animateNumber(timetableCount, timetableData.length || 0);
    animateNumber(subCount, substitutionData.length || 0);

    // Log for debugging
    console.log("[v0] Dashboard data loaded:", {
      teachers: teacherData.length,
      timetable: timetableData.length,
      substitutions: substitutionData.length
    });

  } catch (error) {
    console.error("[v0] Error loading dashboard:", error);
    
    // Show error message
    document.querySelectorAll('.stat-number').forEach(el => {
      el.innerText = 'Error';
    });
  }
}

// Sidebar navigation
function initializeSidebar() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active class to clicked item
      this.classList.add('active');
    });
  });
}

// Logout functionality
function initializeLogout() {
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      // Clear session/auth
     localStorage.removeItem('token');
      // Redirect to login
      window.location.href = 'index.html';
    });
  }
}

// Initialize quick actions
function initializeQuickActions() {
  const actionBtns = document.querySelectorAll('.action-btn');
  
  const actions = {
    0: () => alert('Redirecting to Add Teacher...'),
    1: () => alert('Redirecting to Create Substitution...'),
    2: () => alert('Redirecting to Timetable...'),
    3: () => alert('Redirecting to Reports...')
  };

  actionBtns.forEach((btn, index) => {
    btn.addEventListener('click', actions[index] || (() => {}));
  });
}

// Initialize all features on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log("[v0] Initializing dashboard...");
  
  // Load and animate dashboard data
  loadDashboard();
  
  // Initialize interactive elements
  initializeSidebar();
  initializeLogout();
  initializeQuickActions();
  
  console.log("[v0] Dashboard initialization complete");
});

// Refresh data every 30 seconds
setInterval(() => {
  loadDashboard();
}, 30000);