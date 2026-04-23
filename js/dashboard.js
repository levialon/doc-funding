/* הכסף של הדוקו — dashboard.js */

/* --- Pie/Doughnut Chart (Kan Page) --- */
function initKanChart() {
  const canvas = document.getElementById('kanChart');
  if (!canvas || typeof Chart === 'undefined') return;

  const data = JSON.parse(canvas.dataset.chartData);

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '55%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    },
  });
}

/* --- Year Selector Bar Charts (Funds Page) --- */
function initFundsBars() {
  const selectors = document.querySelectorAll('.year-selector');
  selectors.forEach(selector => {
    const groupId = selector.dataset.group;
    const bars = document.querySelectorAll(`.bar-fill[data-group="${groupId}"]`);
    const maxVal = parseFloat(selector.dataset.max);

    selector.querySelectorAll('.year-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selector.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const year = btn.dataset.year;
        bars.forEach(bar => {
          const val = parseFloat(bar.dataset[`y${year}`]);
          const pct = Math.round((val / maxVal) * 100);
          bar.style.width = pct + '%';
          const label = bar.querySelector('.bar-value');
          if (label) label.textContent = val.toLocaleString('he-IL') + ' מ׳ ₪';
        });
      });
    });
  });
}

/* --- Nav: highlight current page --- */
function highlightNav() {
  const bodyClass = document.body.className;
  const pageMatch = bodyClass.match(/page-(\w+)/);
  if (!pageMatch) return;

  const currentPage = pageMatch[1];

  // Map page IDs to nav data-page values
  const pageMap = {
    'index': 'index',      // landing page (no nav highlight)
    'overview': 'overview',
    'kan': 'kan',
    'funds': 'funds',
    'cable': 'cable',
    'reshut': 'reshut'
  };

  const navPage = pageMap[currentPage];
  if (!navPage || navPage === 'index') return; // Don't highlight on landing page

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.page === navPage) {
      link.classList.add('active');
    }
  });
}

/* --- Info Modal --- */
function initInfoModal() {
  const modal = document.getElementById('infoModal');
  const overlay = document.querySelector('.info-modal-overlay');
  const closeBtn = document.querySelector('.info-modal-close');
  const content = document.querySelector('.info-modal-content');

  if (!modal) return;

  document.querySelectorAll('.total-box-info').forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = icon.dataset.info;
      content.textContent = text;
      modal.classList.add('active');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* --- Swipe Navigation (Mobile) --- */
function initSwipeNavigation() {
  const pageMap = {
    'index': 'overview',      // landing → overview
    'overview': 'kan',        // overview → kan
    'kan': 'funds',           // kan → funds
    'funds': 'cable',         // funds → cable
    'cable': 'reshut',        // cable → reshut
    'reshut': null            // reshut → (last page)
  };

  const pageMapReverse = {
    'overview': 'index',      // overview → landing
    'kan': 'overview',        // kan → overview
    'funds': 'kan',           // funds → kan
    'cable': 'funds',         // cable → funds
    'reshut': 'cable'         // reshut → cable
  };

  const bodyClass = document.body.className;
  const pageMatch = bodyClass.match(/page-(\w+)/);
  if (!pageMatch) return;

  const currentPage = pageMatch[1];

  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(currentPage, touchStartX, touchEndX, pageMap, pageMapReverse);
  });
}

function handleSwipe(currentPage, startX, endX, pageMap, pageMapReverse) {
  const threshold = 50; // minimum swipe distance in pixels
  const diff = startX - endX;

  // RTL (Hebrew): Swipe right (diff < 0) = next page
  if (diff < -threshold) {
    const nextPage = pageMap[currentPage];
    if (nextPage) {
      window.location.href = nextPage + '.html';
    }
  }
  // RTL (Hebrew): Swipe left (diff > 0) = previous page
  else if (diff > threshold) {
    const prevPage = pageMapReverse[currentPage];
    if (prevPage) {
      window.location.href = prevPage + '.html';
    }
  }
}

/* --- TLDR Box (Collapsible with 2-line preview) --- */
function initTldrBoxes() {
  // Just ensure all TLDR boxes start in collapsed state
  document.querySelectorAll('.tldr-box').forEach(box => {
    box.removeAttribute('open');
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  initKanChart();
  initFundsBars();
  initInfoModal();
  initSwipeNavigation();
  initTldrBoxes();
});
