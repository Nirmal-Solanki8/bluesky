// Dismiss alerts
document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.admin-content > div[style*="background: #d1fae5"], .admin-content > div[style*="background: #fee2e2"]');
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach(alert => {
        alert.style.transition = 'opacity 0.4s ease';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 400);
      });
    }, 3500);
  }
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('adminSidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('sidebar-open');
    });
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('sidebar-open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }
});

