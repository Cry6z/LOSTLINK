// LostLink - Mobile UX & Interactive Enhancements
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Utility
  const showToast = (message, type = 'success', duration = 3000) => {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: min(90vw, 420px);
        pointer-events: none;
      `;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const icon = isSuccess ? 'fa-circle-check' : 'fa-circle-info';
    const bgColor = isSuccess ? '#15803D' : '#1E3A8A';

    toast.style.cssText = `
      background: ${bgColor};
      color: #FFFFFF;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      font-weight: 600;
      opacity: 0;
      transform: translateY(-15px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    toast.innerHTML = `<i class="fa-solid ${icon}" style="font-size: 18px; color: #FACC15;"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto dismiss
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-15px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // 2. Active Tab Syncing for Nav
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.side-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Catalog Real-time Search & Filter (katalog.html)
  const searchInput = document.querySelector('.catalog-search input');
  const selects = document.querySelectorAll('.catalog-toolbar select');
  const catalogGrid = document.querySelector('.catalog-grid');
  const catalogCards = document.querySelectorAll('.catalog-card');

  if (searchInput && catalogCards.length > 0) {
    const categorySelect = selects[0];
    const statusSelect = selects[1];

    let emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-search-state';
    emptyMessage.style.cssText = `
      display: none;
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      background: #FFFFFF;
      border: 1px dashed var(--line);
      border-radius: 16px;
      color: var(--muted);
    `;
    emptyMessage.innerHTML = `
      <i class="fa-solid fa-magnifying-glass" style="font-size: 32px; color: #94A3B8; margin-bottom: 12px; display: block;"></i>
      <strong style="color: var(--ink); font-size: 16px; display: block;">Tidak ada barang yang cocok</strong>
      <p style="font-size: 12px; margin-top: 4px;">Coba gunakan kata kunci atau pilihan filter yang berbeda.</p>
    `;
    catalogGrid.appendChild(emptyMessage);

    const filterCards = () => {
      const query = searchInput.value.toLowerCase().trim();
      const catVal = categorySelect ? categorySelect.value.toLowerCase() : 'semua kategori';
      const statVal = statusSelect ? statusSelect.value.toLowerCase() : 'semua status';

      let visibleCount = 0;

      catalogCards.forEach(card => {
        const title = (card.querySelector('h3')?.innerText || '').toLowerCase();
        const category = (card.querySelector('.catalog-card-body small')?.innerText || '').toLowerCase();
        const status = (card.querySelector('.status-pill')?.innerText || '').toLowerCase();
        const location = (card.querySelector('.catalog-card-body p:last-of-type')?.innerText || '').toLowerCase();

        const matchesQuery = !query || title.includes(query) || category.includes(query) || location.includes(query);
        const matchesCategory = catVal.includes('semua') || category.includes(catVal);
        const matchesStatus = statVal.includes('semua') || status.includes(statVal);

        if (matchesQuery && matchesCategory && matchesStatus) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    searchInput.addEventListener('input', filterCards);
    if (categorySelect) categorySelect.addEventListener('change', filterCards);
    if (statusSelect) statusSelect.addEventListener('change', filterCards);
  }

  // 4. Report Form Interactive Submission (laporkan.html)
  const reportForm = document.querySelector('.form-card');
  if (reportForm && window.location.pathname.includes('laporkan')) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaBarang = document.getElementById('nama')?.value || 'Barang';
      const submitBtn = reportForm.querySelector('button[type="submit"]');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses Laporan...';
      }

      showToast(`Laporan "${namaBarang}" berhasil dikirim! Menjalankan Smart Matching...`, 'success', 3500);

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1600);
    });
  }

  // 5. Help Link & Demo note toasts
  document.querySelectorAll('.demo-note, .login-bottom a, .login-options a').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'A' && el.getAttribute('href') === '#') {
        e.preventDefault();
        showToast('Fitur ini tersedia dalam versi lengkap LostLink.', 'info', 2500);
      }
    });
  });
});
