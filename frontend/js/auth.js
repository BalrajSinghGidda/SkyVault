// Auth helper functions
function updateNavbar() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  const logoutLink = document.getElementById('logoutLink');
  const dashboardLink = document.getElementById('dashboardLink');

  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
    if (dashboardLink) dashboardLink.style.display = 'inline';
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
    if (logoutLink) logoutLink.style.display = 'none';
    if (dashboardLink) dashboardLink.style.display = 'none';
  }
}

// Update navbar on page load
updateNavbar();

// Listen for storage changes
window.addEventListener('storage', updateNavbar);
