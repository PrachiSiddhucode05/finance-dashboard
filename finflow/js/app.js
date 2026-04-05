// ── STATE ─────────────────────────────────────────────
const S = {
  role: 'viewer', activeTab: 'dashboard',
  transactions: [
    { id: 1,  date: '2026-04-01', desc: 'Monthly Salary',       cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 2,  date: '2026-04-02', desc: 'Grocery Store',         cat: 'food',          type: 'expense', amt: 3200  },
    { id: 3,  date: '2026-04-03', desc: 'Uber Ride',             cat: 'transport',     type: 'expense', amt: 480   },
    { id: 4,  date: '2026-04-04', desc: 'Netflix Subscription',  cat: 'entertainment', type: 'expense', amt: 649   },
    { id: 5,  date: '2026-04-04', desc: 'Freelance Project',     cat: 'freelance',     type: 'income',  amt: 22000 },
    { id: 6,  date: '2026-04-05', desc: 'Electric Bill',         cat: 'utilities',     type: 'expense', amt: 1850  },
    { id: 7,  date: '2026-03-31', desc: 'Monthly Salary',        cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 8,  date: '2026-03-28', desc: 'Restaurant Dinner',     cat: 'food',          type: 'expense', amt: 2100  },
    { id: 9,  date: '2026-03-27', desc: 'Pharmacy',              cat: 'health',        type: 'expense', amt: 960   },
    { id: 10, date: '2026-03-25', desc: 'Amazon Shopping',       cat: 'shopping',      type: 'expense', amt: 4600  },
    { id: 11, date: '2026-03-20', desc: 'Stock Dividend',        cat: 'investment',    type: 'income',  amt: 5400  },
    { id: 12, date: '2026-03-15', desc: 'Petrol',                cat: 'transport',     type: 'expense', amt: 2200  },
    { id: 13, date: '2026-03-10', desc: 'Freelance Design',      cat: 'freelance',     type: 'income',  amt: 18000 },
    { id: 14, date: '2026-03-05', desc: 'Movie Tickets',         cat: 'entertainment', type: 'expense', amt: 1200  },
    { id: 15, date: '2026-02-28', desc: 'Monthly Salary',        cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 16, date: '2026-02-20', desc: 'Clothes Shopping',      cat: 'shopping',      type: 'expense', amt: 6800  },
    { id: 17, date: '2026-02-18', desc: 'Doctor Visit',          cat: 'health',        type: 'expense', amt: 1500  },
    { id: 18, date: '2026-02-10', desc: 'Internet Bill',         cat: 'utilities',     type: 'expense', amt: 999   },
    { id: 19, date: '2026-01-31', desc: 'Monthly Salary',        cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 20, date: '2026-01-15', desc: 'Freelance App Dev',     cat: 'freelance',     type: 'income',  amt: 32000 },
    { id: 21, date: '2026-01-10', desc: 'Supermarket',           cat: 'food',          type: 'expense', amt: 5400  },
    { id: 22, date: '2025-12-31', desc: 'Monthly Salary',        cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 23, date: '2025-12-25', desc: 'Christmas Shopping',    cat: 'shopping',      type: 'expense', amt: 12000 },
    { id: 24, date: '2025-12-20', desc: 'Year-end Bonus',        cat: 'salary',        type: 'income',  amt: 25000 },
    { id: 25, date: '2025-11-30', desc: 'Monthly Salary',        cat: 'salary',        type: 'income',  amt: 85000 },
    { id: 26, date: '2025-11-20', desc: 'Diwali Shopping',       cat: 'shopping',      type: 'expense', amt: 9500  }
  ]
};

let C = { trend: null, donut: null, bar: null, inc: null };

const CAT_COLORS = {
  food: '#f59e0b', transport: '#3b82f6', shopping: '#8b5cf6',
  entertainment: '#ec4899', health: '#10b981', salary: '#16a34a',
  freelance: '#0d9488', investment: '#6366f1', utilities: '#ef4444', other: '#6b7280'
};

const fmt = n => '₹' + Math.abs(n).toLocaleString('en-IN');
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function getStats() {
  const now = new Date();
  const tm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const lmd = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lm = `${lmd.getFullYear()}-${String(lmd.getMonth() + 1).padStart(2, '0')}`;
  let totInc = 0, totExp = 0, tmExp = 0, lmExp = 0, tmInc = 0;
  const catSpend = {}, catInc = {}, monthly = {};
  S.transactions.forEach(t => {
    const m = t.date.substring(0, 7);
    if (!monthly[m]) monthly[m] = { income: 0, expense: 0 };
    if (t.type === 'income') {
      totInc += t.amt; monthly[m].income += t.amt;
      catInc[t.cat] = (catInc[t.cat] || 0) + t.amt;
      if (m === tm) tmInc += t.amt;
    } else {
      totExp += t.amt; monthly[m].expense += t.amt;
      catSpend[t.cat] = (catSpend[t.cat] || 0) + t.amt;
      if (m === tm) tmExp += t.amt;
      if (m === lm) lmExp += t.amt;
    }
  });
  const topCat = Object.entries(catSpend).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
  const savRate = totInc > 0 ? ((totInc - totExp) / totInc * 100).toFixed(1) : 0;
  return { totInc, totExp, tmInc, tmExp, lmExp, catSpend, catInc, monthly, topCat, savRate, balance: totInc - totExp };
}

// ── ROLE ──────────────────────────────────────────────
function switchRole(r) {
  S.role = r;
  document.getElementById('roleSelect').value = r;
  const b = document.getElementById('roleBadge');
  b.textContent = r === 'admin' ? 'Admin' : 'Viewer';
  b.className = 'role-badge' + (r === 'admin' ? ' admin' : '');
  document.getElementById('addBtn').classList.toggle('hidden', r !== 'admin');
  document.getElementById('actionTh').style.display = r === 'admin' ? '' : 'none';
  renderTxTable();
}

// ── TABS ──────────────────────────────────────────────
function switchTab(tab, el) {
  S.activeTab = tab;
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('active', x.dataset.tab === tab));
  closeSB();
  if (tab === 'dashboard') setTimeout(drawDashCharts, 80);
  if (tab === 'insights') { renderInsights(); setTimeout(drawInsightCharts, 80); }
}

function toggleSB() { document.getElementById('sidebar').classList.toggle('open'); }
function closeSB() { document.getElementById('sidebar').classList.remove('open'); }

// ── DASHBOARD ─────────────────────────────────────────
function renderDashboard() {
  const s = getStats();
  document.getElementById('cBalance').textContent = fmt(s.balance);
  document.getElementById('cIncome').textContent = fmt(s.totInc);
  document.getElementById('cExpense').textContent = fmt(s.totExp);
  document.getElementById('cSavings').textContent = fmt(s.totInc - s.totExp);
  document.getElementById('cBalDelta').textContent = s.balance >= 0 ? `↑ ${s.savRate}% savings rate` : '↓ Spending exceeds income';
  document.getElementById('cIncDelta').textContent = `↑ ${fmt(s.tmInc)} this month`;
  document.getElementById('cExpDelta').textContent = `↑ ${fmt(s.tmExp)} this month`;
  const sd = document.getElementById('cSavDelta');
  sd.textContent = `${s.savRate}% of income saved`;
  sd.className = 'scard-delta ' + (+s.savRate >= 20 ? 'delta-up' : 'delta-dn');

  const recent = [...S.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  document.getElementById('recentList').innerHTML = recent.map(t => `
    <div style="display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid #f0fdf4">
      <div style="width:40px;height:40px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:${t.type === 'income' ? '#dcfce7' : '#fee2e2'}">
        ${t.type === 'income'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>'}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#0f172a">${t.desc}</div>
        <div style="font-size:11.5px;color:#6b7280;margin-top:2px">${fmtDate(t.date)} · <span class="cat-pill ${t.cat}" style="padding:2px 8px;font-size:10.5px">${cap(t.cat)}</span></div>
      </div>
      <div style="font-size:14.5px;font-weight:700;color:${t.type === 'income' ? '#16a34a' : '#ef4444'};flex-shrink:0">
        ${t.type === 'income' ? '+' : '-'}${fmt(t.amt)}
      </div>
    </div>
  `).join('');
}

// ── CHARTS ────────────────────────────────────────────
const TOOLTIP_OPTS = {
  backgroundColor: '#fff',
  titleColor: '#0f172a', bodyColor: '#6b7280',
  borderColor: '#e2f0e8', borderWidth: 1.5,
  padding: 12, cornerRadius: 10,
  titleFont: { family: 'Poppins', weight: '700', size: 13 },
  bodyFont: { family: 'Poppins', size: 12 }
};

function drawDashCharts() {
  const s = getStats();
  const months6 = Object.keys(s.monthly).sort().slice(-6);
  const mLbls = months6.map(m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); });
  const incData = months6.map(m => s.monthly[m]?.income || 0);
  const expData = months6.map(m => s.monthly[m]?.expense || 0);

  // TREND LINE
  const tc = document.getElementById('trendChart');
  if (tc) {
    if (C.trend) { C.trend.destroy(); C.trend = null; }
    const ctx = tc.getContext('2d');
    const gI = ctx.createLinearGradient(0, 0, 0, 240);
    gI.addColorStop(0, 'rgba(22,163,74,.22)'); gI.addColorStop(1, 'rgba(22,163,74,0)');
    const gE = ctx.createLinearGradient(0, 0, 0, 240);
    gE.addColorStop(0, 'rgba(239,68,68,.18)'); gE.addColorStop(1, 'rgba(239,68,68,0)');
    C.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: mLbls, datasets: [
          { label: 'Income', data: incData, borderColor: '#16a34a', backgroundColor: gI, fill: true, tension: .42, pointRadius: 5, pointBackgroundColor: '#16a34a', pointBorderColor: '#fff', pointBorderWidth: 2, borderWidth: 2.5 },
          { label: 'Expense', data: expData, borderColor: '#ef4444', backgroundColor: gE, fill: true, tension: .42, pointRadius: 5, pointBackgroundColor: '#ef4444', pointBorderColor: '#fff', pointBorderWidth: 2, borderWidth: 2.5 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#6b7280', font: { family: 'Poppins', size: 12, weight: '600' }, boxWidth: 12, boxHeight: 12, useBorderRadius: true, borderRadius: 4 } },
          tooltip: { ...TOOLTIP_OPTS, callbacks: { label: c => ' ' + fmt(c.raw) } }
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { family: 'Poppins', size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { family: 'Poppins', size: 11 }, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    });
  }

  // DONUT
  const dc = document.getElementById('donutChart');
  if (dc) {
    if (C.donut) { C.donut.destroy(); C.donut = null; }
    const cats = Object.entries(s.catSpend).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const total = cats.reduce((a, [, v]) => a + v, 0);
    C.donut = new Chart(dc.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: cats.map(([k]) => cap(k)),
        datasets: [{ data: cats.map(([, v]) => v), backgroundColor: cats.map(([k]) => CAT_COLORS[k] || '#9ca3af'), borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#6b7280', font: { family: 'Poppins', size: 11, weight: '500' }, boxWidth: 10, boxHeight: 10, padding: 10, useBorderRadius: true, borderRadius: 5 } },
          tooltip: { ...TOOLTIP_OPTS, callbacks: { label: c => ' ' + fmt(c.raw) + ' (' + (c.raw / total * 100).toFixed(1) + '%)' } }
        }
      }
    });
  }
}

function drawInsightCharts() {
  const s = getStats();
  const months6 = Object.keys(s.monthly).sort().slice(-6);
  const mLbls = months6.map(m => { const [y, mo] = m.split('-'); return new Date(y, mo - 1).toLocaleDateString('en-IN', { month: 'short' }); });

  // BAR
  const bc = document.getElementById('barChart');
  if (bc) {
    if (C.bar) { C.bar.destroy(); C.bar = null; }
    C.bar = new Chart(bc.getContext('2d'), {
      type: 'bar',
      data: {
        labels: mLbls, datasets: [
          { label: 'Income', data: months6.map(m => s.monthly[m]?.income || 0), backgroundColor: 'rgba(22,163,74,.82)', borderRadius: 7, borderSkipped: false },
          { label: 'Expense', data: months6.map(m => s.monthly[m]?.expense || 0), backgroundColor: 'rgba(239,68,68,.75)', borderRadius: 7, borderSkipped: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#6b7280', font: { family: 'Poppins', size: 12, weight: '600' }, boxWidth: 12, boxHeight: 12, useBorderRadius: true, borderRadius: 4 } },
          tooltip: { ...TOOLTIP_OPTS, callbacks: { label: c => ' ' + fmt(c.raw) } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { family: 'Poppins', size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { family: 'Poppins', size: 11 }, callback: v => '₹' + v.toLocaleString('en-IN') } }
        }
      }
    });
  }

  // INCOME PIE
  const ic = document.getElementById('incChart');
  if (ic) {
    if (C.inc) { C.inc.destroy(); C.inc = null; }
    const cats = Object.entries(s.catInc).sort((a, b) => b[1] - a[1]);
    const total = cats.reduce((a, [, v]) => a + v, 0);
    C.inc = new Chart(ic.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: cats.map(([k]) => cap(k)),
        datasets: [{ data: cats.map(([, v]) => v), backgroundColor: cats.map(([k]) => CAT_COLORS[k] || '#9ca3af'), borderWidth: 3, borderColor: '#fff', hoverOffset: 8 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#6b7280', font: { family: 'Poppins', size: 11, weight: '500' }, boxWidth: 10, boxHeight: 10, padding: 10, useBorderRadius: true, borderRadius: 5 } },
          tooltip: { ...TOOLTIP_OPTS, callbacks: { label: c => ' ' + fmt(c.raw) + ' (' + (c.raw / total * 100).toFixed(1) + '%)' } }
        }
      }
    });
  }
}

// ── INSIGHTS ──────────────────────────────────────────
function renderInsights() {
  const s = getStats();
  document.getElementById('iTopCat').textContent = cap(s.topCat[0]);
  document.getElementById('iTopAmt').textContent = fmt(s.topCat[1]) + ' total spent';
  document.getElementById('iMonth').textContent = fmt(s.tmExp);
  const diff = s.tmExp - s.lmExp;
  const pct = s.lmExp > 0 ? Math.abs(diff / s.lmExp * 100).toFixed(1) : 0;
  const el = document.getElementById('iMonthCmp');
  el.textContent = (diff >= 0 ? '↑ ' : '↓ ') + pct + '% vs last month';
  el.style.color = diff >= 0 ? '#ef4444' : '#16a34a';
  document.getElementById('iSavRate').textContent = s.savRate + '%';
  document.getElementById('iSavDesc').textContent = +s.savRate >= 20 ? 'Healthy savings rate ✅' : 'Below recommended 20% ⚠️';

  const cats = Object.entries(s.catSpend).sort((a, b) => b[1] - a[1]);
  const max = cats[0]?.[1] || 1;
  document.getElementById('spendBars').innerHTML = cats.map(([cat, amt]) => `
    <div class="bar-row">
      <div class="bar-label">${cap(cat)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${(amt / max * 100).toFixed(1)}%;background:linear-gradient(90deg,${CAT_COLORS[cat] || '#9ca3af'},${CAT_COLORS[cat] || '#9ca3af'}90)"></div></div>
      <div class="bar-amt">${fmt(amt)}</div>
    </div>
  `).join('');
}

// ── TRANSACTIONS ──────────────────────────────────────
function populateCatSel() {
  const sel = document.getElementById('fCat');
  const cats = [...new Set(S.transactions.map(t => t.cat))].sort();
  sel.innerHTML = '<option value="all">All Categories</option>' + cats.map(c => `<option value="${c}">${cap(c)}</option>`).join('');
}

function getFiltered() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase();
  const type = document.getElementById('fType').value;
  const cat = document.getElementById('fCat').value;
  const sort = document.getElementById('fSort').value;
  let list = S.transactions.filter(t => {
    if (type !== 'all' && t.type !== type) return false;
    if (cat !== 'all' && t.cat !== cat) return false;
    if (q && !t.desc.toLowerCase().includes(q) && !t.cat.includes(q)) return false;
    return true;
  });
  const [sf, sd] = sort.split('-');
  list.sort((a, b) => {
    const av = sf === 'date' ? new Date(a.date) : a.amt;
    const bv = sf === 'date' ? new Date(b.date) : b.amt;
    return sd === 'desc' ? bv - av : av - bv;
  });
  return list;
}

function filterTx() { renderTxTable(); }

function renderTxTable() {
  const list = getFiltered();
  const tbody = document.getElementById('txBody');
  const empty = document.getElementById('txEmpty');
  const isAdmin = S.role === 'admin';
  document.getElementById('actionTh').style.display = isAdmin ? '' : 'none';
  if (!list.length) { tbody.innerHTML = ''; empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  tbody.innerHTML = list.map(t => `
    <tr>
      <td style="color:#6b7280;font-size:12.5px;white-space:nowrap">${fmtDate(t.date)}</td>
      <td style="font-weight:500">${t.desc}</td>
      <td><span class="cat-pill ${t.cat}">${cap(t.cat)}</span></td>
      <td><span class="type-chip ${t.type === 'income' ? 'inc' : 'exp'}">
        ${t.type === 'income'
      ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.8" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg> Income'
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg> Expense'}
      </span></td>
      <td class="${t.type === 'income' ? 'amt-inc' : 'amt-exp'}">${t.type === 'income' ? '+' : '-'}${fmt(t.amt)}</td>
      ${isAdmin ? `<td><button class="del-btn" onclick="delTx(${t.id})">Delete</button></td>` : ''}
    </tr>
  `).join('');
}

function delTx(id) {
  S.transactions = S.transactions.filter(t => t.id !== id);
  renderAll();
}

// ── MODAL ─────────────────────────────────────────────
function openModal() {
  document.getElementById('mDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('overlay').classList.add('open');
}
function closeModal() { document.getElementById('overlay').classList.remove('open'); }
function overlayClick(e) { if (e.target.id === 'overlay') closeModal(); }

function addTx() {
  const type = document.getElementById('mType').value;
  const amt = parseFloat(document.getElementById('mAmt').value);
  const desc = document.getElementById('mDesc').value.trim();
  const cat = document.getElementById('mCat').value;
  const date = document.getElementById('mDate').value;
  if (!amt || amt <= 0 || !desc || !date) { alert('Please fill all fields correctly.'); return; }
  S.transactions.unshift({ id: Date.now(), date, desc, cat, type, amt });
  closeModal();
  document.getElementById('mAmt').value = '';
  document.getElementById('mDesc').value = '';
  renderAll();
}

// ── RENDER ALL ────────────────────────────────────────
function renderAll() {
  populateCatSel();
  renderDashboard();
  renderTxTable();
  if (S.activeTab === 'dashboard') drawDashCharts();
  if (S.activeTab === 'insights') { renderInsights(); drawInsightCharts(); }
}

// ── INIT ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dateLabel').textContent =
    new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  renderAll();
  setTimeout(drawDashCharts, 150);
});
