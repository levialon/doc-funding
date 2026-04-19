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
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.page === page) link.classList.add('active');
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  highlightNav();
  initKanChart();
  initFundsBars();
});
