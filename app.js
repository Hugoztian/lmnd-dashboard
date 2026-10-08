/* Lemonade (LMND) due-diligence site · © Hugo Tian. All data comes from data.js (built by build_data.py from the research workbook). */
'use strict';
const D = window.LMND_DATA, Q = D.meta.quarters, NQ = Q.length, LI = NQ - 1;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (v, d = 0) => v == null || isNaN(v) ? 'n/a' : Number(v).toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dlong = iso => { if (!iso) return ''; const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return `${d} ${MON[m-1]} ${y}`; };
const pct = (v, d = 1) => v == null || isNaN(v) ? 'n/a' : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%';
const pcls = v => v == null ? 'mut' : v >= 0 ? 'pos' : 'neg';
const money = (v, d = 1) => v == null ? 'n/a' : (v < 0 ? '−$' : '$') + fmt(Math.abs(v), d) + 'm';
const qshort = q => q.replace(/^Q(\d) (\d{2})(\d{2})$/, "Q$1'$3");
const linkify = s => esc(s).replace(/(https?:\/\/[^\s;,)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
const S = Object.assign({}, D.fin.kpi.series, D.fin.is.series, D.fin.bs.series, D.fin.cf.series);
const ser = (pat, src) => { const o = src ? D.fin[src].series : S; for (const k in o) if (new RegExp(pat, 'i').test(k)) return o[k]; return null; };
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
let C = {};
function palette() {
  C = isDark()
    ? {acc:'#ff3d9f', acc2:'#ff8cc6', acc3:'rgba(255,61,159,.25)', g:'#e5e5ea', r:'#8e8e93', y:'#ffb340', b:'#64d2ff', p:'#bf8fe6', t:'#5ad1b4', up:'#30d158', dn:'#ff453a', grid:'rgba(255,255,255,.08)', txt:'#a1a1a6', title:'#f5f5f7', band:'rgba(142,142,147,.35)'}
    : {acc:'#FF0083', acc2:'#ff8cc6', acc3:'rgba(255,0,131,.18)', g:'#3a3a3c', r:'#a1a1a6', y:'#e08a00', b:'#32ade6', p:'#8e5cd9', t:'#1a9e85', up:'#1d8a3a', dn:'#d70015', grid:'rgba(0,0,0,.06)', txt:'#6e6e73', title:'#1d1d1f', band:'rgba(142,142,147,.35)'};
  const d = Chart.defaults;
  d.font.family = '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif'; d.font.size = 11.5; d.color = C.txt; d.borderColor = C.grid;
  d.elements.line.borderWidth = 2; d.elements.line.tension = .3; d.elements.point.radius = 2.5; d.elements.point.hoverRadius = 5; d.elements.point.hitRadius = 10;
  d.elements.bar.borderRadius = 4; d.elements.bar.borderSkipped = false; d.datasets.bar.maxBarThickness = 36;
  Object.assign(d.plugins.legend.labels, {usePointStyle: true, pointStyle: 'circle', boxWidth: 7, boxHeight: 7, padding: 12});
  Object.assign(d.plugins.tooltip, {backgroundColor: isDark() ? 'rgba(58,58,60,.97)' : 'rgba(29,29,31,.93)', cornerRadius: 10, padding: 10, boxPadding: 4, usePointStyle: true});
  d.scale.border = {display: false}; d.scale.ticks.padding = 6; d.scales.category.grid = {display: false};
}
try { if (window.ChartZoom) Chart.register(window.ChartZoom); } catch (e) {}
try { const A = window['chartjs-plugin-annotation']; if (A) Chart.register(A.default || A); } catch (e) {}
Chart.register({id: 'autoLineBg', beforeInit(c) { (c.data.datasets || []).forEach(ds => { const t = ds.type || c.config.type; if (t === 'line' && !ds.backgroundColor && typeof ds.borderColor === 'string') ds.backgroundColor = ds.borderColor; }); }});
palette();

/* ---------------- glossary tooltips ---------------- */
const G = D.glossary;
const GKEYS = [['In-force premium','IFP'],['IFP','IFP'],['Premium per customer','PPC'],['PPC','PPC'],['Annual dollar retention','ADR'],['ADR','ADR'],['Gross loss ratio','GLR'],['GLR','GLR'],['Net loss ratio','NLR'],
  ['Gross earned premium','GEP'],['GEP','GEP'],['Gross written premium','GWP'],['Net earned premium','NEP'],['Adjusted EBITDA','Adj. EBITDA'],['Adj. EBITDA','Adj. EBITDA'],['Adjusted free cash flow','Adj. FCF'],['Adjusted FCF','Adj. FCF'],['Adj. FCF','Adj. FCF'],
  ['Prior period development','PPD'],['CAT','CAT'],['LAE','LAE'],['Growth spend','Growth spend'],['Synthetic Agents','Synthetic Agents'],['Price/IFP','Price/IFP'],['10b5-1','10b5-1'],['Customers','Customers'],['Total revenue','Revenue'],['Ceded','Quota share']];
const gfind = label => { for (const [k, g] of GKEYS) if (String(label).toLowerCase().includes(k.toLowerCase())) return G[g] ? [g, G[g]] : null; return null; };
const info = (key, extra = '') => { const g = G[key] ? `<b>${esc(key)}</b> — ${esc(G[key])}` : esc(key); return `<i class="i" tabindex="0" data-tip="${esc(g + (extra ? '<br>' + extra : ''))}">i</i>`; };
const termify = label => { const g = gfind(label); return g ? `<span class="term" tabindex="0" data-tip="${esc('<b>' + esc(g[0]) + '</b> — ' + esc(g[1]))}">${esc(label)}</span>` : esc(label); };
(function tips() {
  const tip = $('#tip'); let cur = null;
  const show = el => { cur = el; tip.innerHTML = el.dataset.tip; tip.classList.add('on'); const r = el.getBoundingClientRect(); const w = Math.min(300, innerWidth - 16);
    tip.style.maxWidth = w + 'px'; const tw = tip.offsetWidth, th = tip.offsetHeight; let x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), innerWidth - tw - 8); let y = r.top - th - 8; if (y < 56) y = r.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; };
  const hide = () => { cur = null; tip.classList.remove('on'); };
  document.addEventListener('mouseover', e => { const el = e.target.closest('[data-tip]'); if (el && el !== cur) show(el); else if (!el && cur) hide(); });
  document.addEventListener('focusin', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); });
  document.addEventListener('focusout', e => { if (!e.relatedTarget || !e.relatedTarget.closest('[data-tip]')) hide(); });
  document.addEventListener('click', e => { const el = e.target.closest('[data-tip]'); if (el) show(el); else hide(); }, true);
  addEventListener('scroll', hide, {passive: true});
})();

/* ---------------- charts ---------------- */
const charts = {}; window.__charts = charts;
const growth = (arr, lag) => arr.map((v, i) => (i < lag || v == null || arr[i - lag] == null || arr[i - lag] === 0) ? null : +((v - arr[i - lag]) / Math.abs(arr[i - lag]) * 100).toFixed(1));
function chart(id, cfg) { const el = document.getElementById(id); if (!el) return null; if (charts[id]) charts[id].destroy(); charts[id] = new Chart(el, cfg); return charts[id]; }
const zoomOpts = () => ({zoom: {wheel: {enabled: true, modifierKey: 'ctrl'}, pinch: {enabled: true}, mode: 'x'}, pan: {enabled: true, mode: 'x', threshold: 6}, limits: {x: {minRange: 2}}});
/* annotated events (reinsurance restructurings, Metromile, lapping) that fall inside a label set; a future event pins to the last label */
const qn = l => { const m = String(l).match(/^Q([1-4])\s?'?\s?(\d{2}|\d{4})$/); if (!m) return String(l); let y = +m[2]; if (y < 100) y += 2000; return `Q${m[1]} ${y}`; };
const qk = l => { const m = qn(l).match(/^Q(\d) (\d{4})$/); return m ? +m[2] * 10 + +m[1] : 0; };
function evIn(labels) {
  const out = []; if (!labels.length || !qk(labels[0])) return out; const last = qk(labels[labels.length - 1]); let fut = false;
  D.reins.forEach((r, k) => { const idx = labels.findIndex(l => qn(l) === r.quarter);
    if (idx >= 0) out.push({r, k, idx, future: false}); else if (qk(r.quarter) > last && !fut && qk(r.quarter) - last <= 10) { fut = true; out.push({r, k, idx: labels.length - 1, future: true}); } });
  return out;
}
function reinsAnn(labels, onClick) {
  const ann = {}; const n = labels.length;
  evIn(labels).forEach(({r, k, idx, future}, j) => {
    const col = r.kind === 'ma' ? C.g : r.kind === 'lap' ? C.r : C.acc;
    if (r.span) { const a = labels.findIndex(l => qn(l) === r.span[0]), b = labels.findIndex(l => qn(l) === r.span[1]);
      if (a >= 0) ann['rb' + k] = {type: 'box', xMin: a - .5, xMax: (b >= 0 ? b : n - 1) + .5, backgroundColor: r.kind === 'ma' ? 'rgba(142,142,147,.12)' : C.acc3, borderWidth: 0, drawTime: 'beforeDatasetsDraw', click: () => onClick && onClick(k)}; }
    else if (!future) ann['rb' + k] = {type: 'box', xMin: idx - .5, xMax: idx + .5, backgroundColor: r.kind === 'lap' ? 'rgba(142,142,147,.10)' : C.acc3, borderWidth: 0, drawTime: 'beforeDatasetsDraw', click: () => onClick && onClick(k)};
    const x = future ? idx : idx - .5;
    ann['re' + k] = {type: 'line', xMin: x, xMax: x, borderColor: col, borderWidth: 1.5, borderDash: r.kind === 'lap' ? [2, 3] : [5, 4],
      label: {display: true, content: (future ? '→ ' : r.kind === 'ma' ? '◆ ' : r.kind === 'lap' ? '↺ ' : '⟲ ') + (r.label || r.title), position: future || j % 2 ? 'end' : 'start', backgroundColor: col, color: r.kind === 'ma' && !isDark() ? '#fff' : r.kind === 'ma' ? '#000' : '#fff', font: {size: 10, weight: '600'}, padding: {x: 5, y: 3}, borderRadius: 6},
      click: () => onClick && onClick(k), enter: ({chart}) => { chart.canvas.style.cursor = 'pointer'; }, leave: ({chart}) => { chart.canvas.style.cursor = ''; }}; });
  return ann;
}
/* Interactive chart card: value / QoQ / YoY switch, zoom/pan + reset, legend toggle, optional range + reinsurance notes */
function ccard(o) {
  const tools = [];
  if (o.growth) tools.push(`<div class="seg" data-k="mode">${[['v','Value'],['q','QoQ %'],['y','YoY %']].map(([k,l]) => `<button data-v="${k}" class="${k==='v'?'on':''}">${l}</button>`).join('')}</div>`);
  if (o.ranges) tools.push(`<div class="seg" data-k="range">${o.ranges.map(([k,l],i) => `<button data-v="${k}" class="${i===o.ranges.length-1?'on':''}">${l}</button>`).join('')}</div>`);
  tools.push(`<button class="ib" data-z="in" title="Zoom in" aria-label="Zoom in">+</button><button class="ib" data-z="out" title="Zoom out" aria-label="Zoom out">−</button><button class="btn" data-z="reset" title="Reset zoom">Reset</button>`);
  const reins = o.reins ? `<div class="reinsboxes"></div>` : '';
  return `<div class="card ccard" id="cc-${o.id}"><div class="chead"><div class="ct">${esc(o.title)}${o.tip ? ' ' + info(o.tip) : ''}</div><div class="ctools">${tools.join('')}</div></div>
    <div class="chartbox" style="${o.h ? 'height:' + o.h + 'px' : ''}"><canvas id="${o.id}" role="img" aria-label="${esc(o.title)}"></canvas></div>
    <div class="chint">Hover or tap for values · click a legend item to hide it · drag to pan · pinch or Ctrl+scroll to zoom</div>${reins}</div>`;
}
function wireCard(o) {
  const card = $('#cc-' + o.id); if (!card) return;
  const rb = card.querySelector('.seg[data-k="range"] button.on'); const st = {mode: 'v', range: rb ? rb.dataset.v : null};
  const showRe = k => { const box = card.querySelector('.reinsboxes'); if (!box) return; const r = D.reins[k]; const ex = box.querySelector(`.reinsbox[data-k="${k}"]`); 
    box.querySelectorAll('.reinsbox').forEach(b => { if (b !== ex) b.classList.remove('on'); }); if (ex) ex.classList.toggle('on'); };
  const draw = () => {
    const base = o.build(st);
    base.datasets.forEach(ds => { if (!ds.yAxisID && !base.indexAxis) ds.yAxisID = 'y'; });
    const labels = base.labels;
    base.datasets.forEach(ds => { if (st.mode !== 'v' && !ds.keep) { ds.data = growth(ds.data, st.mode === 'q' ? 1 : 4); ds.yAxisID = 'y'; if (ds.type === 'bar' || (!ds.type && base.type === 'bar')) {} } });
    const scales = st.mode === 'v' ? (base.scales || {}) : {y: {title: {display: true, text: st.mode === 'q' ? 'QoQ growth %' : 'YoY growth %'}, ticks: {callback: v => v + '%'}}};
    const ann = o.reins ? reinsAnn(labels, showRe) : {};
    const unit = st.mode === 'v' ? (o.unit || '') : '%';
    const raw = o.build(st);
    chart(o.id, {type: base.type || 'bar', data: {labels, datasets: base.datasets},
      options: {responsive: true, maintainAspectRatio: false, interaction: {mode: 'index', intersect: false},
        scales: Object.assign({x: {stacked: !!base.stacked}}, st.mode === 'v' && base.stacked ? {y: {stacked: true}} : {}, scales),
        plugins: {legend: {position: 'bottom'}, zoom: zoomOpts(), annotation: {annotations: ann},
          tooltip: {callbacks: {label: c => { const v = c.raw; if (v == null) return `${c.dataset.label}: n/a`; const u = c.dataset.unit ?? unit;
              return `${c.dataset.label}: ${u === '$m' ? money(v) : u === '%' ? (st.mode === 'v' ? fmt(v, 1) + '%' : pct(v)) : u === '$' ? '$' + fmt(v, 0) : fmt(v, Math.abs(v) < 100 ? 1 : 0) + (u ? ' ' + u : '')}`; },
            footer: items => { if (st.mode !== 'v' || !items.length) return ''; const i = items[0].dataIndex; const ds = raw.datasets[items[0].datasetIndex]; if (!ds || ds.keep) return '';
              const q = growth(ds.data, 1)[i], y = growth(ds.data, 4)[i]; return [q != null ? `QoQ ${pct(q)}` : null, y != null ? `YoY ${pct(y)}` : null].filter(Boolean).join(' · '); }}}}}});
    if (o.reins) { const box = card.querySelector('.reinsboxes'); const inr = evIn(labels).map(e => [e.r, e.k]);
      box.innerHTML = inr.map(([r, k]) => `<button class="reinsbtn" data-k="${k}">${r.kind === 'ma' ? '◆' : r.kind === 'lap' ? '↺' : '⟲'} ${esc(r.quarter)}: ${esc(r.label || r.title)} <span class="mut">· what changed?</span></button>`).join(' ') + inr.map(([r, k]) => `<div class="reinsbox" data-k="${k}"><h4>${esc(dlong(r.date))} — ${esc(r.title)}</h4>${esc(r.detail)}<div class="mut" style="font-size:11.5px;margin-top:4px">Source: ${esc(r.source)}</div></div>`).join('');
      box.querySelectorAll('.reinsbtn').forEach(b => b.onclick = () => showRe(+b.dataset.k)); }
  };
  card.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { sg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); st[sg.dataset.k] = b.dataset.v; draw(); }));
  card.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { const c = charts[o.id]; if (!c) return; const z = b.dataset.z; if (z === 'reset') c.resetZoom(); else c.zoom(z === 'in' ? 1.3 : 0.77); });
  draw();
}
function charts2(list) { return `<div class="grid g2" style="margin-bottom:16px">${list.map(ccard).join('')}</div>`; }
function spark(id, data, color, labels) {
  return chart(id, {type: 'line', data: {labels: labels || Q.map(qshort), datasets: [{data, borderColor: color || C.acc, backgroundColor: C.acc3, fill: true, pointRadius: 0, pointHoverRadius: 3, borderWidth: 1.75, tension: .35}]},
    options: {responsive: true, maintainAspectRatio: false, animation: false, layout: {padding: 2}, scales: {x: {display: false}, y: {display: false}},
      plugins: {legend: {display: false}, tooltip: {displayColors: false, padding: 6, titleFont: {size: 10.5}, bodyFont: {size: 11}, callbacks: {label: c => fmt(c.raw, Math.abs(c.raw) < 100 ? 1 : 0)}}},
      interaction: {mode: 'index', intersect: false}}});
}

/* ---------------- tables: search, sort, CSV, sticky first column, expandable rows ---------------- */
let TID = 0;
const BAD = /loss ratio|glr|loss & lae|expense|marketing|development|administrative|opex|net loss|cat |lae|stock-based|wtd avg|shares|borrowing|liabilit|unpaid|capital expend|growth spend|ceded|synthetic|financing/i;
function cellFmt(v, col) {
  if (v == null || v === '') return ['', ''];
  if (typeof v === 'number') { const h = String(col || ''); let s;
    if (/%/.test(h) && !Number.isInteger(v)) s = fmt(v, 1);
    else if (Number.isInteger(v)) s = Math.abs(v) >= 10000 ? fmt(v, 0) : String(v);
    else s = fmt(v, Math.abs(v) < 10 ? 2 : 1);
    return [s, v < 0 ? 'neg-num' : '']; }
  const s = String(v); if (/^(n\/a|n\/m|n\/p)$/i.test(s)) return [s, 'na'];
  return [s, ''];
}
function tableBlock(t, o = {}) {
  const id = o.id || ('t' + (++TID)); const cols = t.columns; const qcols = cols.map((c, i) => /^Q[1-4]\s?'?\d{2}/.test(String(c)) ? i : -1).filter(i => i >= 0);
  const lastQ = qcols.length ? qcols[qcols.length - 1] : -1, prevQ = qcols.length > 1 ? qcols[qcols.length - 2] : -1;
  let h = '';
  if (t.title && !o.notitle) h += `<h3>${esc(t.title)}</h3>`;
  const pre = [...(o.pre || []), ...(t.pre || [])]; if (pre.length) h += `<div class="mut" style="font-size:12px;margin-bottom:8px">${pre.map(linkify).join('<br>')}</div>`;
  h += `<div class="tbar"><input type="search" placeholder="Filter rows…" aria-label="Filter table rows" data-t="${id}"><button class="btn" data-csv="${id}" title="Download this table as CSV">⬇ CSV</button><span class="tcount" id="${id}-n"></span></div>`;
  h += `<div class="tblwrap" style="${o.maxh ? 'max-height:' + o.maxh + 'px' : ''}"><table id="${id}" class="${o.wrap ? 'wrapt' : ''} ${o.cls || ''}" data-title="${esc(o.csvname || t.title || o.id || 'table')}"><thead><tr>${cols.map((c, i) => `<th data-i="${i}" class="${i === lastQ ? 'latest' : ''}">${o.headTip && i === 0 ? '' : ''}${esc(c)}</th>`).join('')}</tr></thead><tbody>`;
  t.rows.forEach((r, ri) => {
    if (!Array.isArray(r)) { h += `<tr class="sec"><td colspan="${cols.length}">${esc(r.section)}</td></tr>`; return; }
    const label = r[0]; let trend = '';
    if (o.colorLatest && lastQ > 0 && typeof r[lastQ] === 'number' && typeof r[prevQ] === 'number' && r[lastQ] !== r[prevQ]) { const up = r[lastQ] > r[prevQ]; const good = BAD.test(label) ? !up : up; trend = good ? 'up' : 'dn'; }
    const xd = o.expand ? o.expand(r, ri) : null;
    h += `<tr data-ri="${ri}" class="${xd ? 'xrow' : ''}">` + r.map((c, i) => { const [s, cl] = cellFmt(c, cols[i]); const w = (String(s).length > 44 || o.wrap) ? ' wrap' : '';
      const body = i === 0 && o.terms !== false ? termify(s) : linkify(s);
      return `<td class="${cl}${w}${i === lastQ ? ' latest ' + trend : ''}">${body}</td>`; }).join('') + '</tr>';
    if (xd) h += `<tr class="xdetail" data-for="${ri}" hidden><td colspan="${cols.length}">${xd}</td></tr>`;
  });
  h += '</tbody></table></div>';
  const notes = [...(t.notes || []), ...(o.notes || [])]; if (notes.length) h += `<ul class="notes">${notes.map(n => `<li>${linkify(n)}</li>`).join('')}</ul>`;
  return h;
}
function wireTables(root) {
  $$('table', root).forEach(tb => {
    if (tb.dataset.wired) return; tb.dataset.wired = 1;
    const body = tb.tBodies[0]; const orig = [...body.rows];
    const n = document.getElementById(tb.id + '-n'); const total = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')).length;
    const count = () => { if (n) { const vis = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail') && !r.hidden).length; n.textContent = vis === total ? `${total} rows` : `${vis} of ${total} rows`; } };
    count();
    // expandable rows
    orig.filter(r => r.classList.contains('xrow')).forEach(r => r.addEventListener('click', e => { if (e.target.closest('a,[data-tip]')) return; const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (!d) return; d.hidden = !d.hidden; r.classList.toggle('open', !d.hidden); }));
    // sort
    tb.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
      const i = +th.dataset.i; const cur = th.dataset.dir; tb.querySelectorAll('th').forEach(x => delete x.dataset.dir);
      const dir = cur === 'a' ? 'd' : cur === 'd' ? null : 'a';
      const val = r => { const t = (r.cells[i]?.innerText || '').replace(/[$,%+▸▾×x]/g, '').replace('−', '-').trim(); const m = t.match(/^\(?-?[\d.]+/); const f = m ? parseFloat(m[0].replace('(', '-')) : NaN; return isNaN(f) ? t.toLowerCase() : f; };
      const data = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail'));
      if (!dir) { orig.forEach(r => body.appendChild(r)); orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = ''); return; }
      th.dataset.dir = dir;
      data.sort((a, b) => { const x = val(a), y = val(b); if (typeof x !== typeof y) return typeof x === 'number' ? -1 : 1; return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'a' ? 1 : -1); });
      orig.filter(r => r.classList.contains('sec')).forEach(r => r.style.display = 'none');
      data.forEach(r => { body.appendChild(r); const d = body.querySelector(`tr.xdetail[data-for="${r.dataset.ri}"]`); if (d) body.appendChild(d); });
    }));
  });
  $$('input[data-t]', root).forEach(inp => { if (inp.dataset.wired) return; inp.dataset.wired = 1; inp.addEventListener('input', () => filterTable(inp.dataset.t, inp.value)); });
  $$('[data-csv]', root).forEach(b => { if (b.dataset.wired) return; b.dataset.wired = 1; b.onclick = () => csv(b.dataset.csv); });
  tightCols(root);
}
function filterTable(id, q) {
  const tb = document.getElementById(id); if (!tb) return; q = q.trim().toLowerCase(); let sec = null, secHit = false;
  const rows = [...tb.tBodies[0].rows];
  rows.forEach(r => {
    if (r.classList.contains('sec')) { if (sec) sec.hidden = !secHit && !!q; sec = r; secHit = false; return; }
    if (r.classList.contains('xdetail')) { if (q) r.hidden = true; return; }
    const hit = !q || r.innerText.toLowerCase().includes(q); r.hidden = !hit; if (hit) secHit = true; if (!hit) r.classList.remove('open');
  });
  if (sec) sec.hidden = !secHit && !!q;
  const n = document.getElementById(id + '-n'); if (n) { const d = rows.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')); const v = d.filter(r => !r.hidden).length; n.textContent = v === d.length ? `${d.length} rows` : `${v} of ${d.length} rows`; }
}
function csv(id) {
  const tb = document.getElementById(id); if (!tb) return;
  const q = s => { s = String(s).replace(/\s+/g, ' ').replace(/^[▸▾]\s*/, '').trim(); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [[...tb.tHead.rows[0].cells].map(c => q(c.innerText))];
  [...tb.tBodies[0].rows].filter(r => !r.hidden && r.style.display !== 'none' && !r.classList.contains('xdetail')).forEach(r => lines.push([...r.cells].map(c => q(c.innerText))));
  const blob = new Blob(['\ufeff' + lines.map(l => l.join(',')).join('\n')], {type: 'text/csv;charset=utf-8'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'LMND_' + (tb.dataset.title || id).replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 60) + '.csv'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
/* narrow short-code columns; dates never wrap */
const CODE_HDR = /^(form|code|ticker|symbol|type|d\/i|10b5-1|role|rating|quarter|q)$/i;
const DATE_RES = [/^\d{4}-\d{2}-\d{2}$/, /^\d{1,2}\s[A-Z][a-z]{2,8}\s\d{4}$/, /^~?Q[1-4]\s?'?\d{2,4}$/, /^Q[1-4] \d{4}$/, /^[A-Z][a-z]{2,8}[- ]\d{4}$/];
function tightCols(root) {
  $$('table', root).forEach(tb => { const head = tb.tHead && tb.tHead.rows[0]; if (!head) return; const n = head.cells.length; const rows = [...tb.tBodies[0].rows].filter(r => r.cells.length === n);
    rows.forEach(r => [...r.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); }));
    [...head.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); });
    for (let i = 0; i < n; i++) { const vals = rows.map(r => r.cells[i].textContent.trim()).filter(v => v && !/^n\/a$/i.test(v)); const hdr = head.cells[i].textContent.trim();
      let code = CODE_HDR.test(hdr); if (!code && vals.length) { const mx = Math.max(...vals.map(v => v.length)); code = mx <= 6 && vals.every(v => /^[A-Za-z][A-Za-z.]*$/.test(v)); }
      if (!code) continue; head.cells[i].classList.add('code'); rows.forEach(r => r.cells[i].classList.add('code')); if (i === 0) tb.classList.add('c0tight'); } });
}
function details(title, body, sm = '', open = false) { return `<details class="x"${open ? ' open' : ''}><summary><span>${title}${sm ? ` <span class="sm">${sm}</span>` : ''}</span></summary><div class="xb">${body}</div></details>`; }
function xallBtns() { return `<div class="xall"><button class="btn" data-xall="1">Expand all</button> <button class="btn" data-xall="0">Collapse all</button></div>`; }
function wireXall(root) { $$('[data-xall]', root).forEach(b => b.onclick = () => { const scope = b.closest('.xscope') || root; $$('details.x', scope).forEach(d => d.open = b.dataset.xall === '1'); }); }
const sheet = rx => { for (const n in D.sheets) if (new RegExp(rx, 'i').test(n)) return D.sheets[n]; return null; };

/* ---------------- TradingView (keyless free widgets, delayed quote) ---------------- */
const TV_SYM = 'NYSE:LMND';
function tvEmbed(el, widget, cfg, onFail) {
  if (!el) return; el.innerHTML = '';
  const box = document.createElement('div'); box.className = 'tradingview-widget-container'; box.style.height = '100%';
  const inner = document.createElement('div'); inner.className = 'tradingview-widget-container__widget'; inner.style.height = '100%'; box.appendChild(inner);
  const sc = document.createElement('script'); sc.type = 'text/javascript'; sc.async = true; sc.src = 'https://s3.tradingview.com/external-embedding/embed-widget-' + widget + '.js'; sc.textContent = JSON.stringify(cfg);
  let failed = false; const fail = why => { if (failed) return; failed = true; onFail && onFail(why); };
  sc.onerror = () => fail('script blocked or offline'); box.appendChild(sc); el.appendChild(box);
  setTimeout(() => { if (!el.querySelector('iframe')) fail('widget did not load within 12 s'); }, 12000);
}
function liveQuote() {
  const el = $('#tvq'); const P = D.price;
  tvEmbed(el, 'single-quote', {symbol: TV_SYM, width: '100%', isTransparent: true, colorTheme: isDark() ? 'dark' : 'light', locale: 'en'}, why => {
    el.style.height = 'auto'; el.innerHTML = `<div class="tvfail" title="${esc(why)}">Live quote could not load in this browser.</div><div style="font-size:24px;font-weight:700">$${fmt(P.close, 2)}</div><div class="mut" style="font-size:11px">Last close ${dlong(P.close_date)} (build-time)</div>`; });
}
/* ---------------- hero ---------------- */
function hero() {
  const H = D.hero, P = D.price, asof = `${H.quarter} · as of ${H.period_end_long}`;
  $('#updated').innerHTML = `Last updated <b>${esc(D.meta.built_sgt)}</b> · Company data through <b>${esc(H.quarter)}</b> (quarter ended ${esc(H.period_end_long)}) · Market data: close ${esc(dlong(P.close_date))}, live price via TradingView`;
  const ifp = ser('in-?force premium', 'kpi'), cu = ser('^customers', 'kpi'), pp = ser('premium per customer', 'kpi');
  const card = (n, label, key, v, ch, s, id) => `<div class="hcard"><div class="l">${label} ${info(key)}</div><div class="v">${v}</div><div class="ch ${pcls(ch)}">${pct(ch)} YoY</div><div class="s">${s}</div><span class="asof">${esc(asof)}</span><div class="spark"><canvas id="${id}"></canvas></div></div>`;
  $('#hero4').innerHTML = [
    `<div class="hcard live"><div class="l" style="padding:2px 4px 0"><i class="livedot"></i> Live stock price ${info('Live price', 'Lemonade (NYSE: LMND) quote from the free TradingView widget. It updates automatically but is delayed (Cboe/NYSE delayed feed); free widgets cannot show real-time US stock data.')}</div><div class="tvq" id="tvq"></div><div class="cap" style="padding:0 4px">NYSE: LMND · auto-updating · delayed quote (TradingView)</div></div>`,
    card(2, 'In-force premium', 'IFP', '$' + fmt(H.ifp / 1000, 2) + 'b', H.ifp_yoy, `$${fmt(H.ifp, 1)}m · ${pct(H.ifp_qoq)} QoQ · year ago $${fmt(H.ifp_prev_year, 1)}m`, 'spIfp'),
    card(3, 'Customers', 'Customers', fmt(H.customers / 1e6, 2) + 'm', H.cust_yoy, `${fmt(H.customers)} · ${pct(H.cust_qoq)} QoQ`, 'spCu'),
    card(4, 'Premium per customer', 'PPC', '$' + fmt(H.ppc), H.ppc_yoy, `${pct(H.ppc_qoq)} QoQ · year ago $${fmt(H.ppc_prev_year)}`, 'spPpc')].join('');
  const Y = P.ytd; const days = d => Math.ceil((new Date(d + 'T09:00:00-04:00') - new Date()) / 864e5);
  const dd = d => { const n = days(d); return n > 1 ? `in ${n} days` : n === 1 ? 'tomorrow' : n === 0 ? 'today' : 'reported'; };
  $('#hero2').innerHTML = [
    Y ? `<div class="mini" title="Year-to-date: latest close in the build vs the ${esc(Y.base_date)} close (last trading day of 2025)"><div class="l">LMND year-to-date</div><div class="v ${pcls(Y.pct)}">${pct(Y.pct)}</div><div class="s">$${fmt(Y.price, 2)} (${esc(dlong(Y.asof))}) vs $${fmt(Y.base, 2)} close ${esc(dlong(Y.base_date))} · as of build ${esc(D.meta.built_sgt)}</div></div>` : `<div class="mini"><div class="l">LMND year-to-date</div><div class="v na">n/a</div></div>`,
    `<div class="mini"><div class="l">Market cap / EV ${info('Price/IFP')}</div><div class="v">$${fmt(P.mcap_b, 2)}b / $${fmt(P.ev_b, 2)}b</div><div class="s">Close ${esc(dlong(P.close_date))} · 52-wk $${fmt(P.lo52, 2)}–$${fmt(P.hi52, 2)}</div></div>`,
    `<div class="mini"><div class="l">Next earnings (Q3 2026)</div><div class="v">~${esc(dlong(D.meta.next_earnings))}</div><div class="s">${dd(D.meta.next_earnings)} · company guide on Guidance tab</div></div>`,
    `<div class="mini"><div class="l">Investor Day</div><div class="v">${esc(dlong(D.meta.investor_day))}</div><div class="s">${dd(D.meta.investor_day)} · New York</div></div>`].join('');
  spark('spIfp', ifp); spark('spCu', cu.map(v => v / 1e6)); spark('spPpc', pp);
  liveQuote();
}
/* ---------------- overview ---------------- */
const KC = [['In-force premium ($m)', 'in-?force premium', 'kpi', 'IFP', v => money(v)], ['Customers', '^customers', 'kpi', 'Customers', v => fmt(v / 1e6, 2) + 'm'], ['Premium per customer', 'premium per customer', 'kpi', 'PPC', v => '$' + fmt(v)],
  ['Annual dollar retention', 'annual dollar retention', 'kpi', 'ADR', v => fmt(v) + '%', true], ['Gross loss ratio', '^gross loss ratio \\(', 'kpi', 'GLR', v => fmt(v) + '%', true, true], ['Net loss ratio', '^net loss ratio', 'kpi', 'NLR', v => fmt(v) + '%', true, true],
  ['Total revenue', '^total revenue', 'is', 'Revenue', v => money(v)], ['Gross earned premium', 'gross earned premium', 'is', 'GEP', v => money(v)], ['Adjusted EBITDA', '^adjusted ebitda', 'is', 'Adj. EBITDA', v => money(v)],
  ['Net loss', '^net loss$', 'is', 'Adj. EBITDA', v => money(v)], ['Cash & investments', '^cash & investments$', 'bs', 'Adj. FCF', v => money(v, 0)], ['Adjusted FCF', '^adjusted free cash flow', 'cf', 'Adj. FCF', v => money(v)]];
function kpiCards(i) {
  const g = $('#kpicards'); if (!g) return;
  g.innerHTML = KC.map(([l, pat, src, key, f, pp, inv], k) => { const s = ser(pat, src); const v = s ? s[i] : null; if (!s) return '';
    const dq = pp ? (i > 0 && s[i-1] != null && v != null ? v - s[i-1] : null) : (i > 0 && s[i-1] && v != null ? (v - s[i-1]) / Math.abs(s[i-1]) * 100 : null);
    const dy = pp ? (i > 3 && s[i-4] != null && v != null ? v - s[i-4] : null) : (i > 3 && s[i-4] && v != null ? (v - s[i-4]) / Math.abs(s[i-4]) * 100 : null);
    const show = (x, lab) => x == null ? `<span class="mut">${lab} n/a</span>` : pp ? `<span class="${(inv ? -x : x) >= 0 ? 'pos' : 'neg'}">${x >= 0 ? '+' : '−'}${fmt(Math.abs(x))}pp</span> ${lab}` : `<span class="${pcls(x)}">${pct(x)}</span> ${lab}`;
    return `<div class="card kpi" title="${esc(l)}: ${esc(Q[i])}"><div class="l">${esc(l)} ${info(key)}</div><div class="v">${v == null ? '<span class="na">n/a</span>' : f(v)}</div><div class="s">${show(dq, 'QoQ')} · ${show(dy, 'YoY')}</div><div class="spark"><canvas id="ks${k}"></canvas></div></div>`; }).join('');
  KC.forEach(([l, pat, src], k) => { const s = ser(pat, src); if (!s) return; const c = spark('ks' + k, s.map(v => v == null ? null : (Math.abs(v) > 1e5 ? v / 1e6 : v)));
    if (c) { c.data.datasets[0].pointRadius = s.map((_, j) => j === i ? 3.5 : 0); c.data.datasets[0].pointBackgroundColor = C.acc; c.update('none'); } });
}
function wsMap() { const t = (sheet('wall street') || {tables: []}).tables[0]; const m = {}; (t ? t.rows : []).forEach(r => { if (Array.isArray(r)) m[r[0]] = r[1]; }); return m; }
function overview() {
  const N = D.narrative, H = D.hero, P = D.price, W = wsMap(), L = LI, s = n => ser(n);
  const lmnd = ((sheet('valuation') || {tables: [{rows: []}]}).tables[0].rows.find(r => Array.isArray(r) && r[0] === 'LMND')) || [];
  const keyRows = [
    ['Share price / market cap / EV', `$${fmt(P.close, 2)} / $${fmt(P.mcap_b, 2)}b / $${fmt(P.ev_b, 2)}b`, `Close ${dlong(P.close_date)}`],
    ['In-force premium / customers / premium per customer', `$${fmt(H.ifp, 1)}m / ${fmt(H.customers)} / $${fmt(H.ppc)}`, H.period_end_long],
    [`${H.quarter} revenue / GEP / Adj. EBITDA`, `${money(s('^total revenue')[L])} / ${money(s('gross earned premium')[L])} / ${money(s('^adjusted ebitda')[L])}`, H.quarter],
    ['Gross / net loss ratio', `${s('^gross loss ratio \\(')[L]}% / ${s('^net loss ratio')[L]}%`, H.quarter],
    ['Cash & investments / Synthetic Agents borrowings', `${money(s('^cash & investments$')[L], 1)} / ${money(s('borrowings under')[L])}`, H.period_end_long],
    ['Price / IFP · TTM P/S', lmnd.length ? `${lmnd[6]}x · ${lmnd[4]}x` : 'n/a', `Close ${dlong(P.close_date)}`],
    ['Analyst rating · PT low / avg / median / high', `${W['Analyst rating (11)'] || 'n/a'} · ${W['PT low / avg / median / high'] || 'n/a'}`, '6–7 Oct 2026'],
    ['Short interest', P.short_pct ? `${fmt(P.short_pct * 100, 1)}% of float · ${fmt(P.short_ratio, 1)} days to cover` : 'n/a', 'mid-Sep 2026'],
    ['Next earnings (Q3 2026)', `~${dlong(D.meta.next_earnings)}`, 'Company / Yahoo calendar'],
    ['Investor Day', dlong(D.meta.investor_day), 'New York']];
  const daysTo = w => { const m = w.match(/(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/); if (!m) return ''; const d = new Date(`${m[2]} ${m[1]}, ${m[3]} 09:00 GMT-0500`); const n = Math.ceil((d - new Date()) / 864e5); return n > 0 ? `${n} days` : 'passed'; };
  const cats = N.catalysts.map(c => `<div class="cat"><div class="when">${esc(c.when === 'Ongoing' ? 'Through 2027' : c.when)}</div><div style="flex:1">${esc(c.what.charAt(0).toUpperCase() + c.what.slice(1))}</div><div class="dd">${daysTo(c.when)}</div></div>`).join('');
  const ex = N.exec; const exKeys = Object.keys(ex).filter(k => k !== 'Verdict');
  const sec = h => (N.sections.find(x => new RegExp(h, 'i').test(x.h)) || {paras: [], subs: []});
  const paras = arr => arr.filter(p => !p.startsWith('©')).map(p => { const m = p.match(/^[•\s]*([^:]{3,70}):\s(.+)$/); return m ? `<p><b>${esc(m[1])}:</b> ${esc(m[2])}</p>` : `<p>${esc(p.replace(/^•\s*/, ''))}</p>`; }).join('');
  const ph = P.hist || [];
  $('#s-overview').innerHTML = `<h2>Overview</h2>
  <div class="card verdict" style="margin-bottom:16px">${N.verdict ? `<b>Verdict:</b> ${esc(N.verdict)}` : ''}</div>
  <div class="card" style="margin-bottom:16px"><div class="qpick"><b>KPI cards for quarter</b> <button class="ib" id="qprev" aria-label="Previous quarter">‹</button><select id="qsel" aria-label="Pick quarter">${Q.map((q, i) => `<option value="${i}" ${i === LI ? 'selected' : ''}>${esc(q)} (ended ${esc(dlong(D.meta.period_end[i]))})</option>`).join('')}</select><button class="ib" id="qnext" aria-label="Next quarter">›</button><span class="mut" style="font-size:12px">The hero above always shows the latest quarter (${esc(H.quarter)}).</span></div>
    <div class="grid g4" id="kpicards"></div></div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3>Key numbers (with dates)</h3>${tableBlock({columns: ['Metric', 'Value', 'As of'], rows: keyRows}, {id: 'tKey', csvname: 'Key numbers', terms: true, wrap: true, cls: 'keyt'})}</div>
    <div class="card"><h3>Catalysts & dates</h3>${cats}<ul class="notes"><li>Q3 2026 company guide: ${esc(((sheet('guidance') || {tables: [{notes: []}]}).tables[0].notes[0] || '').replace(/^Q3 2026 guide \(Q2'26 letter\):\s*/, ''))}</li></ul></div></div>
  <div class="grid g3" style="margin-bottom:16px">${exKeys.map(k => `<div class="card"><h3>${esc(k)}</h3><div style="font-size:13.5px;line-height:1.55">${esc(ex[k])}</div></div>`).join('')}</div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3 style="margin-top:0">LMND live chart <span class="mut" style="font-size:12px;font-weight:400">· ${TV_SYM} via TradingView · delayed</span></h3><div class="tvchart" id="tvchart"></div></div>
    ${ccard({id: 'ovPx', title: 'LMND daily close (build-time, Yahoo)', ranges: [['1m', '1M'], ['3m', '3M'], ['ytd', 'YTD'], ['all', '1Y']], h: 400})}</div>
  <div class="xscope">${xallBtns()}
  ${details('Business overview', paras(sec('business').paras), 'model, Giveback, reinsurance, growth financing')}
  ${details('Latest quarter, guidance & path to profit', paras([...sec('latest quarter').paras, ...sec('latest quarter').subs.flatMap(x => x.paras)]), H.quarter)}
  ${details('Competitive position & moat', paras(sec('competitive').paras), 'vs incumbents and insurtech peers')}
  ${details('Recent news & sentiment', paras(sec('news').paras), 'last ~3 months, X/social')}
  ${details('Conclusion & what to monitor', paras(N.conclusion), '8 monitoring items')}</div>`;
  const sel = $('#qsel'); const set = i => { i = Math.max(0, Math.min(LI, i)); sel.value = i; kpiCards(i); };
  sel.onchange = () => set(+sel.value); $('#qprev').onclick = () => set(+sel.value - 1); $('#qnext').onclick = () => set(+sel.value + 1);
  kpiCards(LI);
  tvEmbed($('#tvchart'), 'advanced-chart', {autosize: true, symbol: TV_SYM, interval: 'D', range: '12M', timezone: 'Asia/Singapore', theme: isDark() ? 'dark' : 'light', style: '1', locale: 'en',
    backgroundColor: isDark() ? 'rgba(28,28,30,1)' : 'rgba(255,255,255,1)', gridColor: isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', allow_symbol_change: false, hide_side_toolbar: true, calendar: false, support_host: 'https://www.tradingview.com'},
    why => { $('#tvchart').innerHTML = `<div class="tvfail">Live chart could not load (${esc(why)}). The interactive daily-close chart next to it uses build-time data.</div>`; $('#tvchart').style.height = 'auto'; });
  wireCard({id: 'ovPx', ranges: 1, unit: '$', build: st => { const last = ph.length ? ph[ph.length - 1][0] : ''; const cut = st.range === '1m' ? 22 : st.range === '3m' ? 64 : 0; let h = ph;
    if (st.range === 'ytd') h = ph.filter(x => x[0] >= last.slice(0, 4) + '-01-01'); else if (cut) h = ph.slice(-cut);
    return {type: 'line', labels: h.map(x => x[0]), datasets: [{label: 'LMND close ($)', data: h.map(x => x[1]), borderColor: C.acc, backgroundColor: C.acc3, fill: true, pointRadius: 0, unit: '$', keep: true}],
      scales: {x: {ticks: {maxTicksLimit: 7, maxRotation: 0}}, y: {ticks: {callback: v => '$' + v}}}}; }});
  charts.ovPx && (charts.ovPx.options.plugins.tooltip.callbacks.label = c => `LMND close: $${fmt(c.raw, 2)}`);
}
/* ---------------- Insurance KPIs ---------------- */
const QL = Q.map(qshort);
function kpis() {
  const t = sheet('insurance kpi'); const k = n => ser(n, 'kpi'), i = n => ser(n, 'is');
  $('#s-kpis').innerHTML = `<h2>Insurance KPIs <span class="mut" style="font-size:16px;font-weight:500">· ${esc(Q[0])} – ${esc(Q[LI])}</span></h2>
  ${charts2([{id: 'kIfp', title: 'In-force premium vs revenue vs GEP ($m)', tip: 'IFP', growth: 1, reins: 1}, {id: 'kCu', title: 'Customers (m) & premium per customer ($)', tip: 'PPC', growth: 1},
    {id: 'kLr', title: 'Loss ratios (%)', tip: 'GLR'}, {id: 'kRe', title: 'Reinsurance effect: ceded vs net earned premium ($m)', tip: 'Quota share', reins: 1},
    {id: 'kMix', title: 'IFP by product / geography ($m)', tip: 'IFP', growth: 1}, {id: 'kGlrP', title: 'Gross loss ratio by product (%)', tip: 'GLR'},
    {id: 'kComp', title: 'Loss-ratio components (pp of GEP)', tip: 'CAT'}, {id: 'kAdr', title: 'Annual dollar retention (%)', tip: 'ADR'}])}
  ${tableBlock({title: 'Insurance KPIs — 8 quarters', columns: t.tables[0].columns, rows: t.tables[0].rows, notes: t.tables[0].notes}, {id: 'tKpi', colorLatest: 1, pre: t.pre})}`;
  wireCard({id: 'kIfp', reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Total revenue', data: i('^total revenue'), backgroundColor: C.acc, yAxisID: 'y', order: 2},
    {type: 'bar', label: 'Gross earned premium', data: i('gross earned premium'), backgroundColor: C.acc2, yAxisID: 'y', order: 3}, {type: 'line', label: 'In-force premium (annualised)', data: k('in-?force premium'), borderColor: C.g, yAxisID: 'y1', order: 1}],
    scales: {y: {title: {display: true, text: 'Quarterly $m'}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: 'IFP $m'}}}})});
  wireCard({id: 'kCu', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Customers (m)', data: k('^customers').map(v => v / 1e6), backgroundColor: C.acc, yAxisID: 'y', unit: 'm'},
    {type: 'line', label: 'Premium per customer ($)', data: k('premium per customer'), borderColor: C.g, yAxisID: 'y1', unit: '$'}], scales: {y: {title: {display: true, text: 'Customers (m)'}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: '$'}}}})});
  wireCard({id: 'kLr', unit: '%', build: () => ({type: 'line', labels: QL, datasets: [['^gross loss ratio \\(', 'Gross loss ratio', C.acc], ['^net loss ratio', 'Net loss ratio', C.g], ['ttm gross', 'TTM gross loss ratio', C.b], ['ex-cat', 'GLR ex-CAT', C.y], ['attritional', 'Attritional GLR', C.p]].map(([p, l, c]) => ({label: l, data: k(p), borderColor: c, spanGaps: true})), scales: {y: {ticks: {callback: v => v + '%'}}}})});
  wireCard({id: 'kRe', reins: 1, unit: '$m', build: () => { const ce = i('ceded earned'), ne = i('net earned'), ge = i('gross earned premium');
    return {labels: QL, stacked: true, datasets: [{type: 'bar', label: 'Net earned premium (kept)', data: ne, backgroundColor: C.acc, stack: 's'}, {type: 'bar', label: 'Ceded earned premium (to reinsurers)', data: ce, backgroundColor: C.r, stack: 's'},
      {type: 'line', label: 'Ceded share of GEP (%)', data: ce.map((v, j) => +(v / ge[j] * 100).toFixed(1)), borderColor: C.g, yAxisID: 'y1', unit: '%', keep: true}],
      scales: {y: {stacked: true}, y1: {position: 'right', min: 0, max: 100, grid: {drawOnChartArea: false}, ticks: {callback: v => v + '%'}}}}; }});
  wireCard({id: 'kMix', unit: '$m', build: () => ({labels: QL, stacked: true, datasets: [['homeowners', 'Homeowners MPL', C.acc], ['^pet$', 'Pet', C.acc2], ['^car$', 'Car', C.g], ['europe \\(', 'Europe', C.b], ['^other$', 'Other', C.r]].map(([p, l, c]) => ({type: 'bar', label: l, data: k(p), backgroundColor: c}))})});
  wireCard({id: 'kGlrP', unit: '%', build: () => ({type: 'line', labels: QL, datasets: [['homeowners mpl glr', 'Homeowners', C.acc], ['pet glr', 'Pet', C.p], ['car glr', 'Car', C.g], ['europe glr', 'Europe', C.b]].map(([p, l, c]) => ({label: l, data: k(p), borderColor: c, spanGaps: true})), scales: {y: {ticks: {callback: v => v + '%'}}}})});
  wireCard({id: 'kComp', unit: 'pp', build: () => ({labels: QL, datasets: [['cat excl', 'CAT excl. PPD', C.acc], ['lae excl', 'LAE excl. PPD', C.g], ['prior period', 'Prior-period development', C.b]].map(([p, l, c]) => ({type: 'bar', label: l, data: k(p), backgroundColor: c}))})});
  wireCard({id: 'kAdr', unit: '%', build: () => ({type: 'line', labels: QL, datasets: [{label: 'Annual dollar retention', data: k('annual dollar retention'), borderColor: C.acc, fill: false}], scales: {y: {min: 70, max: 100, ticks: {callback: v => v + '%'}}}})});
}
/* ---------------- statements ---------------- */
function stmt(key, sid, title, specs) {
  const sh = sheet('^' + key.toUpperCase() + '\\b'); const t = sh.tables[0];
  $('#s-' + sid).innerHTML = `<h2>${title} <span class="mut" style="font-size:16px;font-weight:500">· 8 quarters, ${esc(Q[0])} – ${esc(Q[LI])} ($m)</span></h2>${charts2(specs)}
   ${tableBlock({title: `${title} — 8 quarters`, columns: t.columns, rows: t.rows, notes: t.notes}, {id: 't' + sid, colorLatest: 1, pre: sh.pre})}`;
  specs.forEach(wireCard);
}
function isTab() { const i = n => ser(n, 'is');
  stmt('is', 'is', 'Income Statement', [
    {id: 'iRev', title: 'Revenue, GEP & net earned premium ($m)', tip: 'Revenue', growth: 1, reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Gross earned premium', data: i('gross earned premium'), backgroundColor: C.acc2}, {type: 'bar', label: 'Total revenue', data: i('^total revenue'), backgroundColor: C.acc}, {type: 'line', label: 'Net earned premium', data: i('net earned'), borderColor: C.g}]})},
    {id: 'iPl', title: 'Gross profit, Adj. EBITDA & net loss ($m)', tip: 'Adj. EBITDA', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Gross profit', data: i('^gross profit'), backgroundColor: C.acc}, {type: 'bar', label: 'Adjusted EBITDA', data: i('^adjusted ebitda'), backgroundColor: C.g}, {type: 'bar', label: 'Net loss', data: i('^net loss'), backgroundColor: C.r}]})},
    {id: 'iOpx', title: 'Operating expenses ex net loss & LAE ($m)', tip: 'Growth spend', growth: 1, unit: '$m', build: () => ({labels: QL, stacked: true, datasets: [['^sales', 'Sales & marketing', C.acc], ['technology', 'Technology development', C.g], ['general', 'General & administrative', C.b], ['other insurance', 'Other insurance expense', C.r]].map(([p, l, c]) => ({type: 'bar', label: l, data: i(p), backgroundColor: c}))})},
    {id: 'iSbc', title: 'Stock-based compensation ($m) & GAAP EPS ($)', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Stock-based compensation ($m)', data: i('stock-based'), backgroundColor: C.acc}, {type: 'line', label: 'GAAP EPS ($)', data: i('gaap eps'), borderColor: C.g, yAxisID: 'y1', unit: '$/sh'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})}]); }
function bsTab() { const b = n => ser(n, 'bs');
  stmt('bs', 'bs', 'Balance Sheet', [
    {id: 'bCash', title: 'Cash & investments ($m)', growth: 1, unit: '$m', build: () => ({labels: QL, stacked: true, datasets: [{type: 'bar', label: 'Cash, equivalents & restricted', data: b('^cash, cash'), backgroundColor: C.acc}, {type: 'bar', label: 'Investments', data: b('^investments'), backgroundColor: C.acc2}]})},
    {id: 'bAle', title: 'Total assets, liabilities & equity ($m)', growth: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Total assets', data: b('total assets'), backgroundColor: C.acc2}, {type: 'bar', label: 'Total liabilities', data: b('total liabilities'), backgroundColor: C.r}, {type: 'line', label: "Stockholders' equity", data: b('equity'), borderColor: C.acc}]})},
    {id: 'bRe', title: 'Reinsurance balances & unearned premium ($m)', tip: 'Quota share', reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'line', label: 'Unearned premium', data: b('unearned'), borderColor: C.acc}, {type: 'line', label: 'Prepaid reinsurance premium', data: b('prepaid'), borderColor: C.g}, {type: 'line', label: 'Reinsurance recoverable', data: b('recoverable'), borderColor: C.b}, {type: 'line', label: 'Unpaid loss & LAE', data: b('unpaid'), borderColor: C.r}]})},
    {id: 'bFin', title: 'Synthetic Agents borrowings ($m) & shares outstanding (m)', tip: 'Synthetic Agents', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Borrowings under financing', data: b('borrowings'), backgroundColor: C.acc}, {type: 'line', label: 'Shares outstanding (m)', data: b('shares outstanding'), borderColor: C.g, yAxisID: 'y1', unit: 'm'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})}]); }
function cfTab() { const c = n => ser(n, 'cf');
  stmt('cf', 'cf', 'Cash Flow', [
    {id: 'cFcf', title: 'Operating cash flow, capex & free cash flow ($m)', tip: 'Adj. FCF', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Cash from operations', data: c('operating activities'), backgroundColor: C.acc}, {type: 'bar', label: 'Capex', data: c('capital expend').map(v => -v), backgroundColor: C.r}, {type: 'line', label: 'Free cash flow', data: c('^free cash flow'), borderColor: C.g}, {type: 'line', label: 'Adjusted FCF', data: c('^adjusted free'), borderColor: C.b}]})},
    {id: 'cGs', title: 'Growth spend vs Synthetic Agents balance ($m)', tip: 'Synthetic Agents', growth: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: 'Growth spend (quarter)', data: c('growth spend'), backgroundColor: C.acc}, {type: 'line', label: 'Synthetic Agents balance (EOP)', data: c('synthetic'), borderColor: C.g, yAxisID: 'y1'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})},
    {id: 'cCi', title: 'Cash & investments, end of period ($m)', growth: 1, unit: '$m', build: () => ({type: 'line', labels: QL, datasets: [{label: 'Cash & investments', data: c('cash & investments'), borderColor: C.acc, fill: true, backgroundColor: C.acc3}]})}]); }

/* ---------------- Guidance vs actual ---------------- */
function guidance() {
  const sh = sheet('guidance'); const t = sh.tables[0]; const rows = t.rows.filter(Array.isArray); const col = n => t.columns.findIndex(c => new RegExp(n, 'i').test(c));
  const g = n => rows.map(r => typeof r[col(n)] === 'number' ? r[col(n)] : null); const lab = rows.map(r => r[0]);
  $('#s-guidance').innerHTML = `<h2>Guidance vs Actual</h2>
   <div class="card verdict" style="margin-bottom:16px">${esc(t.notes[0] || '')}</div>
   ${charts2([{id: 'gIfp', title: 'IFP: guidance range vs actual ($m)', tip: 'IFP'}, {id: 'gRev', title: 'Revenue: guidance midpoint vs actual ($m)', tip: 'Revenue', reins: 1}, {id: 'gEb', title: 'Adj. EBITDA: guidance midpoint vs actual ($m)', tip: 'Adj. EBITDA'}, {id: 'gGep', title: 'GEP: guidance midpoint vs actual ($m)', tip: 'GEP'}])}
   ${tableBlock({title: 'Quarter by quarter', columns: t.columns, rows: t.rows, notes: t.notes.slice(1)}, {id: 'tGva', pre: sh.pre})}`;
  const range = (lo, hi, act, l1) => ({labels: lab, datasets: [{type: 'bar', label: 'Guidance range', data: g(lo).map((v, i) => v == null ? null : [v, g(hi)[i]]), backgroundColor: C.band, barPercentage: .5, keep: 1},
      {type: 'line', label: 'Actual', data: g(act), borderColor: C.acc, showLine: false, pointRadius: 6, pointHoverRadius: 8, pointStyle: 'rectRot', keep: 1}]});
  const mid = (gm, act) => ({labels: lab, datasets: [{type: 'bar', label: 'Guidance midpoint', data: g(gm), backgroundColor: C.band}, {type: 'bar', label: 'Actual', data: g(act), backgroundColor: C.acc}]});
  wireCard({id: 'gIfp', unit: '$m', build: () => { const r = range('ifp guide low', 'ifp guide high', 'ifp actual'); r.scales = {y: {beginAtZero: false}}; return r; }});
  wireCard({id: 'gRev', unit: '$m', reins: 1, build: () => mid('rev guide mid', 'rev actual')});
  wireCard({id: 'gEb', unit: '$m', build: () => mid('ebitda guide mid', 'ebitda actual')});
  wireCard({id: 'gGep', unit: '$m', build: () => mid('gep guide mid', 'gep actual')});
  charts.gIfp.options.plugins.tooltip.callbacks.label = c => Array.isArray(c.raw) ? `Guide: $${fmt(c.raw[0])}–$${fmt(c.raw[1])}m` : `Actual: ${money(c.raw)}`; charts.gIfp.update('none');
}
/* ---------------- Wall Street ---------------- */
function street() {
  const sh = sheet('wall street'); const W = wsMap(); const P = D.price;
  const pts = String(W['PT low / avg / median / high'] || '').match(/[\d.]+/g) || [];
  $('#s-street').innerHTML = `<h2>Wall Street</h2>
   <div class="grid g4" style="margin-bottom:16px">${Object.entries(W).map(([k, v]) => `<div class="card kpi"><div class="l">${esc(k)}</div><div class="v" style="font-size:20px">${esc(v)}</div></div>`).join('')}</div>
   ${charts2([{id: 'wPt', title: 'Analyst price targets vs last close ($)'}, {id: 'wHist', title: 'LMND close vs average price target ($)'}])}
   ${sh.tables.map((t, i) => tableBlock(t, {id: 'tWs' + i})).join('')}`;
  const labels = ['PT low', 'PT median', 'PT average', 'PT high', `Close ${dlong(P.close_date)}`];
  const vals = [+pts[0], +pts[2], +pts[1], +pts[3], P.close];
  wireCard({id: 'wPt', unit: '$', build: () => ({labels, datasets: [{type: 'bar', label: 'Price ($)', data: vals, backgroundColor: vals.map((v, i) => i === 4 ? C.acc : C.band), keep: 1}], scales: {y: {beginAtZero: true, ticks: {callback: v => '$' + v}}}})});
  const ph = P.hist || [];
  wireCard({id: 'wHist', unit: '$', build: () => ({type: 'line', labels: ph.map(x => x[0]), datasets: [{label: 'LMND close', data: ph.map(x => x[1]), borderColor: C.acc, pointRadius: 0, keep: 1}, {label: 'Average PT', data: ph.map(() => +pts[1]), borderColor: C.g, borderDash: [5, 4], pointRadius: 0, keep: 1}, {label: 'PT low', data: ph.map(() => +pts[0]), borderColor: C.r, borderDash: [2, 3], pointRadius: 0, keep: 1}, {label: 'PT high', data: ph.map(() => +pts[3]), borderColor: C.b, borderDash: [2, 3], pointRadius: 0, keep: 1}], scales: {x: {ticks: {maxTicksLimit: 6, maxRotation: 0}}, y: {ticks: {callback: v => '$' + v}}}})});
}
/* ---------------- Insiders ---------------- */
const CODES = {S: 'Sale', M: 'Option exercise / RSU conversion', A: 'Grant / award', H: 'Holding (no transaction)', G: 'Gift', F: 'Tax withholding', P: 'Purchase'};
function f4rows(name) { const sur = name.split(' ').pop().toUpperCase(); return D.form4.filter(r => (r.insider || '').toUpperCase().includes(sur)); }
const f4kind = r => r.code !== 'S' ? 'other' : r.tax ? 'tax' : r.plan ? 'planned' : 'nonplan';
const f4pill = r => { const k = f4kind(r); return `<span class="pill ${k}">${k === 'planned' ? '10b5-1 sale' : k === 'tax' ? 'Tax sale' : k === 'nonplan' ? 'Non-plan sale' : esc(CODES[r.code] || r.code)}</span>`; };
function f4table(rows, id) {
  return tableBlock({columns: ['Date', 'Insider', 'Code', 'Type', 'Shares', 'Price ($)', 'Owned after', 'D/I', 'Security', 'Footnote'], rows: rows.map(r => [r.tdate, r.insider, r.code, f4kind(r) === 'other' ? (CODES[r.code] || r.code) : f4kind(r) === 'planned' ? '10b5-1 sale' : f4kind(r) === 'tax' ? 'Tax sale' : 'Non-plan sale', r.shares, r.price, r.owned_after, r.di, r.security, r.footnotes || r.nature || ''])}, {id, terms: false, maxh: 520});
}
function insiders() {
  const sh = sheet('ownership|form ?4'); const inst = sh.tables.find(t => /institution/i.test(t.title || '')) || sh.tables[0]; const sum = sh.tables.find(t => /insider/i.test(t.title || '')) || sh.tables[1];
  const sr = sum.rows.filter(Array.isArray); const ci = n => sum.columns.findIndex(c => new RegExp(n, 'i').test(c));
  $('#s-insiders').innerHTML = `<h2>Insiders & ownership <span class="mut" style="font-size:16px;font-weight:500">· Form 4</span></h2>
   ${sh.pre.length ? `<div class="mut" style="font-size:12.5px;margin-bottom:12px">${sh.pre.map(esc).join('<br>')}</div>` : ''}
   ${charts2([{id: 'nSold', title: 'Shares sold by insider and type', tip: '10b5-1'}, {id: 'nInst', title: 'Top institutional holders (% of shares)'}])}
   ${tableBlock(sum, {id: 'tIns', expand: r => { const rs = f4rows(r[0]); return rs.length ? `<div style="font-size:12.5px;margin-bottom:6px"><b>${rs.length} Form 4 lines for ${esc(r[0])}</b> · click the row again to collapse</div>` + `<div class="tblwrap" style="max-height:320px"><table class="inner"><thead><tr><th>Date</th><th>Code</th><th>Type</th><th>Shares</th><th>Price</th><th>Owned after</th><th>Footnote</th></tr></thead><tbody>${rs.map(x => `<tr><td>${esc(x.tdate)}</td><td>${esc(x.code)}</td><td>${f4pill(x)}</td><td>${fmt(x.shares)}</td><td>${x.price ? '$' + fmt(x.price, 2) : ''}</td><td>${fmt(x.owned_after)}</td><td class="wrap">${esc(x.footnotes || x.nature || '')}</td></tr>`).join('')}</tbody></table></div>` : '<span class="mut">No parsed Form 4 lines in the window.</span>'; }, notes: ['Click an insider row to expand their individual Form 4 transactions.']})}
   ${tableBlock(inst, {id: 'tInst'})}
   <h3>All Form 4 transactions (${D.form4.length} lines)</h3>
   <div class="chips" id="f4chips">${['All', 'Sales', '10b5-1 sale', 'Non-plan sale', 'Tax sale', 'Grant / award', 'Option exercise / RSU conversion', 'Gift'].map((c, i) => `<button class="btn ${i === 0 ? 'on' : ''}" data-f="${esc(c)}">${esc(c)}</button>`).join('')}</div>
   ${f4table(D.form4, 'tF4')}
   <ul class="notes"><li>Codes: ${Object.entries(CODES).map(([k, v]) => `<b>${k}</b> ${esc(v)}`).join(' · ')}. 10b5-1 = plan checkbox or footnote; tax sale = shares sold to cover RSU tax withholding.</li></ul>`;
  wireCard({id: 'nSold', build: () => ({labels: sr.map(r => r[0].split(' ').pop()), stacked: true, datasets: [{type: 'bar', label: '10b5-1 plan', data: sr.map(r => r[ci('10b5-1')]), backgroundColor: C.acc}, {type: 'bar', label: 'Non-plan (ex tax)', data: sr.map(r => (r[ci('non-plan')] || 0) - (r[ci('tax')] || 0)), backgroundColor: C.y}, {type: 'bar', label: 'Tax withholding', data: sr.map(r => r[ci('tax')]), backgroundColor: C.p}], scales: {x: {stacked: true}, y: {stacked: true}}}), unit: 'sh'});
  const ir = inst.rows.filter(Array.isArray);
  wireCard({id: 'nInst', unit: '%', build: () => ({labels: ir.map(r => r[0]), datasets: [{type: 'bar', label: '% held', data: ir.map(r => r[1]), backgroundColor: C.acc}]})});
  $$('#f4chips button').forEach(b => b.onclick = () => { $$('#f4chips button').forEach(x => x.classList.toggle('on', x === b)); const f = b.dataset.f; const tb = $('#tF4');
    [...tb.tBodies[0].rows].forEach(r => { const ty = r.cells[3].textContent; r.hidden = !(f === 'All' || (f === 'Sales' ? /sale/i.test(ty) : ty === f)); });
    const v = [...tb.tBodies[0].rows].filter(r => !r.hidden).length; $('#tF4-n').textContent = `${v} of ${tb.tBodies[0].rows.length} rows`; });
}
/* ---------------- Valuation & peers ---------------- */
function valuation() {
  const sh = sheet('valuation'); const t = sh.tables[0]; const rows = t.rows.filter(Array.isArray); const ci = n => t.columns.findIndex(c => new RegExp(n, 'i').test(c));
  const N = D.narrative;
  $('#s-valuation').innerHTML = `<h2>Valuation & peers</h2>
   ${charts2([{id: 'vPs', title: 'P/S (TTM) and Price / IFP (x)', tip: 'Price/IFP'}, {id: 'vMc', title: 'Market cap vs EV ($b)'}])}
   ${tableBlock({title: sh.title, columns: t.columns, rows: t.rows, notes: t.notes}, {id: 'tVal', terms: false})}
   <div class="card" style="margin-top:16px"><h3>Valuation view</h3>${N.valuation.map(p => `<p style="font-size:13.5px">${esc(p)}</p>`).join('')}</div>`;
  const lab = rows.map(r => r[0]); const n = (r, i) => typeof r[i] === 'number' ? r[i] : null;
  wireCard({id: 'vPs', unit: 'x', build: () => ({labels: lab, datasets: [{type: 'bar', label: 'P/S (TTM)', data: rows.map(r => n(r, ci('p/s'))), backgroundColor: lab.map(l => l === 'LMND' ? C.acc : C.acc2)}, {type: 'bar', label: 'Price / IFP', data: rows.map(r => n(r, ci('price/ifp'))), backgroundColor: C.g}]})});
  wireCard({id: 'vMc', unit: '$b', build: () => ({labels: lab, datasets: [{type: 'bar', label: 'Market cap ($b)', data: rows.map(r => n(r, ci('mkt cap'))), backgroundColor: C.acc}, {type: 'bar', label: 'EV ($b)', data: rows.map(r => n(r, ci('^ev'))), backgroundColor: C.r}], scales: {y: {type: 'logarithmic', title: {display: true, text: 'log scale'}}}})});
}
/* ---------------- Risks / bull-bear ---------------- */
function risks() {
  const N = D.narrative; const comp = (N.sections.find(s => /competitive/i.test(s.h)) || {paras: []}).paras;
  $('#s-risks').innerHTML = `<h2>Risks / Bull–Bear</h2>
   <div class="bb" style="margin-bottom:16px"><div class="card bull"><h3>Bull case</h3><div style="font-size:13.5px;line-height:1.55">${esc(N.bull)}</div></div><div class="card bear"><h3>Bear case</h3><div style="font-size:13.5px;line-height:1.55">${esc(N.bear)}</div></div></div>
   <div class="card" style="margin-bottom:16px"><h3>Top risks (summary)</h3><div style="font-size:13.5px;line-height:1.55">${esc(N.exec['Top risks'] || '')}</div></div>
   <div class="xscope"><h3>Risk details <span class="mut" style="font-size:13px;font-weight:400">· ${N.risks.length} risks, click to expand</span></h3>${xallBtns()}
   ${N.risks.map((r, i) => details(`${i + 1}. ${esc(r.title)}`, esc(r.detail), '', false)).join('')}
   <h3>Competitive position & moat</h3>${comp.map((p, i) => { const m = p.match(/^([^:]{3,40}):\s(.+)$/); return details(esc(m ? m[1] : 'Competitive position'), esc(m ? m[2] : p)); }).join('')}
   <h3>What to monitor</h3>${details('Conclusion & monitoring checklist', N.conclusion.map(p => `<p>${esc(p)}</p>`).join(''), '', true)}</div>`;
}
/* ---------------- Sources ---------------- */
function sources() {
  const sh = sheet('^sources'); const cover = sheet('cover'); const N = D.narrative; const rep = (N.sections.find(s => /^sources/i.test(s.h)) || {paras: []}).paras.filter(p => !p.startsWith('©'));
  $('#s-sources').innerHTML = `<h2>Sources</h2><div class="xscope">${xallBtns()}
   ${details('Workbook sources & links', `<ul class="lst">${(sh ? sh.pre : []).map(p => `<li>${linkify(p)}</li>`).join('')}</ul>`, `${sh ? sh.pre.length : 0} items`, true)}
   ${(sh && sh.tables.length) ? sh.tables.map(t => details(esc(t.title || 'Quarterly shareholder letters (SEC 8-K)'), `<ul class="lst">${[t.columns, ...t.rows.filter(Array.isArray)].map(r => `<li>${r.filter(x => x != null && x !== '').map(x => /^https?:/.test(String(x)) ? `<a href="${esc(x)}" target="_blank" rel="noopener">${esc(x)}</a>` : esc(x)).join(' — ')}</li>`).join('')}</ul>`, `${t.rows.length + 1} links`)).join('') : ''}
   ${details('Report sources', `<ul class="lst">${rep.map(p => `<li>${linkify(p.replace(/^•\s*/, ''))}</li>`).join('')}</ul>`, `${rep.length} items`)}
   ${details('Reinsurance restructuring sources', `<ul class="lst">${D.reins.map(r => `<li><b>${esc(dlong(r.date))} — ${esc(r.title)}:</b> ${esc(r.source)}</li>`).join('')}</ul>`, `${D.reins.length} events`)}
   ${details('Workbook notes & disclaimer', `<ul class="lst">${(cover ? cover.pre : []).filter(p => !/^\d+\.|^Sheets:/.test(p)).map(p => `<li>${linkify(p)}</li>`).join('')}</ul>`)}
   ${details('Data build', `<ul class="lst"><li>Built ${esc(D.meta.built_sgt)} from the workbook sheets: ${D.meta.sheets.map(esc).join(', ')}.</li><li>Price history: ${esc(D.price.hist_src)}. Live price: TradingView free widget (delayed quote).</li><li>Form 4 detail: ${D.form4.length} transaction lines parsed from SEC Form 4 XML.</li><li>Unavailable figures are shown as n/a, never estimated.</li></ul>`)}
   ${details('Metric definitions', `<ul class="lst">${Object.entries(D.glossary).map(([k, v]) => `<li><b>${esc(k)}</b> — ${esc(v)}</li>`).join('')}</ul>`)}</div>`;
}

/* ---------------- tabs fed by sheets that may arrive later (hidden until the sheet exists) ---------------- */
const OPT = D.optional || {};
const optSheet = k => OPT[k] ? D.sheets[OPT[k].sheet] : null;
const pickKey = (obj, inc, exc) => Object.keys(obj || {}).find(k => inc.test(k) && !(exc && exc.test(k)));
function allTables(sh, pfx, o = {}) { return sh.tables.map((t, i) => tableBlock(t, Object.assign({id: pfx + i, pre: i === 0 ? sh.pre : [], wrap: o.wrap}, o))).join(''); }
const QRX = /^Q([1-4])\s?'?\s?(\d{2}|\d{4})$/;
const qnorm = s => { const m = String(s || '').trim().match(QRX); if (!m) return String(s || ''); let y = +m[2]; if (y < 100) y += 2000; return `Q${m[1]} ${y}`; };
const qkey = s => { const m = qnorm(s).match(/Q(\d) (\d{4})/); return m ? +m[2] * 10 + +m[1] : 0; };
const reinsAt = q => D.reins.find(r => r.quarter === qnorm(q));
const cessionRow = () => { const o = OPT.opmetrics && OPT.opmetrics.qs; if (!o) return null; const k = pickKey(o.text, /reinsurance|cession|quota/i); return k ? {q: o.quarters, v: o.text[k], label: k} : null; };
function rangeSlice(L, st) { const n = st.range === '8' ? 8 : st.range === '12' ? 12 : L.length; return Math.max(0, L.length - n); }
function history() {
  const H = OPT.history, qs = H.qs, el = $('#s-history');
  const L = qs.quarters, Sx = qs.series;
  const kI = pickKey(Sx, /in-?force|ifp/i, /yoy|growth|%|qoq|per |-/i), kR = pickKey(Sx, /revenue/i, /yoy|growth|%|qoq/i), kG = pickKey(Sx, /gross earned|gep/i, /yoy|growth|%|qoq/i);
  const kIy = pickKey(Sx, /(in-?force|ifp).*(yoy|growth)|(yoy|growth).*(in-?force|ifp)/i), kRy = pickKey(Sx, /revenue.*(yoy|growth)|(yoy|growth).*revenue/i);
  const yI = kIy ? Sx[kIy] : growth(Sx[kI], 4), yR = kRy ? Sx[kRy] : growth(Sx[kR], 4);
  const n = L.length - 1, CR = cessionRow();
  const ces = q => { if (!CR) return ''; const i = CR.q.indexOf(q); return i >= 0 ? (CR.v[i] || '') : ''; };
  const evs = D.reins;
  const rows = L.map((q, i) => [q, Sx[kI][i], yI[i], Sx[kR][i], yR[i], ...(CR ? [ces(q)] : []), reinsAt(q) ? reinsAt(q).title : '']);
  const hNote = (D.sheets[H.sheet].tables[0] || {notes: []}).notes;
  el.innerHTML = `<h2>IFP & Revenue History <span class="mut" style="font-size:16px;font-weight:500">· ${esc(L[0])} – ${esc(L[n])}, every quarter</span></h2>
   <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="l">In-force premium, ${esc(L[n])} ${info('IFP')}</div><div class="v">${money(Sx[kI][n])}</div><div class="s"><span class="${pcls(yI[n])}">${pct(yI[n])}</span> YoY · ${esc(L[0])}: ${money(Sx[kI][0])} (${fmt(Sx[kI][n] / Sx[kI][0], 1)}×)</div></div>
    <div class="card kpi"><div class="l">Revenue, ${esc(L[n])} ${info('Revenue')}</div><div class="v">${money(Sx[kR][n])}</div><div class="s"><span class="${pcls(yR[n])}">${pct(yR[n])}</span> YoY · ${esc(L[0])}: ${money(Sx[kR][0])} (${fmt(Sx[kR][n] / Sx[kR][0], 1)}×)</div></div>
    <div class="card kpi"><div class="l">Gap: revenue YoY − IFP YoY, ${esc(L[n])} ${info('Quota share')}</div><div class="v">${yR[n] != null && yI[n] != null ? (yR[n] - yI[n] >= 0 ? '+' : '−') + fmt(Math.abs(yR[n] - yI[n]), 1) + 'pp' : 'n/a'}</div><div class="s">Revenue outgrows IFP while the quota-share cession falls</div></div>
    <div class="card kpi"><div class="l">Annotated events ${info('Quota share')}</div><div class="v">${evs.length}</div><div class="s">Reinsurance, Metromile and lapping: ${evs.map(r => esc(r.quarter.replace(/^Q(\d) 20(\d\d)$/, "Q$1'$2"))).join(' · ')}. Click a chart marker.</div></div></div>
   <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Reinsurance restructurings, Metromile & lapping <span class="mut" style="font-size:12.5px;font-weight:400">· also marked on both charts</span></h3><div class="grid g3">${evs.map(r => `<div><div class="pill ${r.kind === 'reins' ? 'acc' : 'other'}">${esc(dlong(r.date))} · ${esc(r.quarter)}</div><h4 style="margin:6px 0 4px">${esc(r.title)}</h4><div style="font-size:13px;line-height:1.55">${esc(r.detail)}</div><div class="mut" style="font-size:11.5px;margin-top:4px">Source: ${esc(r.source)}</div></div>`).join('')}</div>${hNote.length ? `<ul class="notes">${hNote.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>
   ${charts2([{id: 'hAbs', title: 'In-force premium vs quarterly revenue ($m)', tip: 'IFP', growth: 1, reins: 1, ranges: [['8', '8Q'], ['12', '3Y'], ['all', '2020+ (all)']]}, {id: 'hYoy', title: 'YoY growth: IFP vs revenue (%)', tip: 'Revenue', reins: 1, ranges: [['8', '8Q'], ['12', '3Y'], ['all', '2020+ (all)']]}])}
   ${tableBlock({title: 'Quarter by quarter', columns: ['Quarter', 'IFP ($m)', 'IFP YoY %', 'Revenue ($m)', 'Revenue YoY %', ...(CR ? ['Quota share cession'] : []), 'Event'], rows}, {id: 'tHist', terms: false, maxh: 720, notes: [`Source: ${H.sheet} sheet${CR ? ' (IFP, revenue) and Operating Metrics sheet (cession)' : ''}. Highlighted rows = annotated event quarters (reinsurance, Metromile, lapping).`]})}`;
  $$('#tHist tbody tr').forEach(r => { if (reinsAt(r.cells[0].textContent)) { r.style.boxShadow = 'inset 3px 0 0 var(--acc)'; [...r.cells].forEach(c => c.style.background = 'var(--accsoft)'); } });
  wireCard({id: 'hAbs', reins: 1, unit: '$m', build: st => { const s0 = rangeSlice(L, st); return {labels: L.slice(s0), datasets: [{type: 'line', label: 'In-force premium (annualised)', data: Sx[kI].slice(s0), borderColor: C.acc, yAxisID: 'y', order: 1}, {type: 'bar', label: 'Revenue (quarter)', data: Sx[kR].slice(s0), backgroundColor: C.g, yAxisID: 'y1', order: 2}, kG && {type: 'bar', label: 'Gross earned premium', data: Sx[kG].slice(s0), backgroundColor: C.acc2, yAxisID: 'y1', order: 3}].filter(Boolean),
    scales: {y: {title: {display: true, text: 'IFP $m'}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: 'Quarterly $m'}}}}; }});
  wireCard({id: 'hYoy', reins: 1, unit: '%', build: st => { const s0 = rangeSlice(L, st); return {type: 'line', labels: L.slice(s0), datasets: [{label: 'IFP YoY %', data: yI.slice(s0), borderColor: C.acc, keep: 1, unit: '%'}, {label: 'Revenue YoY %', data: yR.slice(s0), borderColor: C.g, keep: 1, unit: '%'}], scales: {y: {ticks: {callback: v => v + '%'}}}}; }});
  ['hAbs', 'hYoy'].forEach(id => { const c = charts[id]; if (c) { c.options.plugins.tooltip.callbacks.label = x => `${x.dataset.label}: ${x.raw == null ? 'n/a' : /YoY/.test(x.dataset.label) ? pct(x.raw) : money(x.raw)}`; c.options.plugins.tooltip.callbacks.afterBody = it => { const q = it[0] && it[0].label; const c2 = ces(q); const r = reinsAt(q); return [c2 ? 'Quota share: ' + c2 : '', r ? '⟲ ' + r.title : ''].filter(Boolean); }; c.update('none'); } });
}
function highlights() {
  const sh = optSheet('highlights'); const el = $('#s-highlights'); const t = sh.tables[0]; const ci = re => t.columns.findIndex(c => re.test(c));
  const iQ = ci(/quarter/i) < 0 ? 0 : ci(/quarter/i), iTxt = ci(/highlight|commentary|comment/i), iDt = ci(/date/i);
  const num = re => ci(re);
  const iI = num(/^ifp \(|in-?force.*\(\$/i), iIy = num(/ifp yoy/i), iR = num(/^revenue \(/i), iRy = num(/revenue yoy/i);
  const items = t.rows.filter(Array.isArray).map(r => ({q: qnorm(r[iQ]), r})).sort((a, b) => qkey(b.q) - qkey(a.q));
  const bullets = s => { const parts = String(s || '').split(/\n|(?:^|\s)•\s/).map(x => x.replace(/^•\s*/, '').trim()).filter(Boolean); return `<ul class="lst">${parts.map(p => `<li>${linkify(p)}</li>`).join('')}</ul>`; };
  const CH = ['Reinsurance', 'Pet', 'Car', 'Europe', 'AI', 'Metromile', 'EBITDA', 'Retention'];
  el.innerHTML = `<h2>Quarterly Highlights <span class="mut" style="font-size:16px;font-weight:500">· management commentary, ${esc(items[items.length - 1].q)} – ${esc(items[0].q)}</span></h2>
   ${sh.pre.length ? `<div class="mut" style="font-size:12.5px;margin-bottom:10px">${sh.pre.map(esc).join('<br>')}</div>` : ''}
   <div class="tbar"><input type="search" id="hlq" placeholder="Search commentary (e.g. pet, car, reinsurance)…" aria-label="Search highlights"><span class="tcount" id="hln"></span></div>
   <div class="chips" id="hlchips">${CH.map(c => `<button class="btn" data-v="${c}">${c}</button>`).join('')}</div>
   <div class="xscope" id="hlwrap">${xallBtns()}${items.map((it, k) => { const r = it.r; const re = reinsAt(it.q);
     const sm = [iDt >= 0 && r[iDt] ? 'letter ' + r[iDt] : '', iI >= 0 && r[iI] != null ? `IFP ${money(r[iI])}${iIy >= 0 && r[iIy] != null ? ' (' + pct(r[iIy], 0) + ')' : ''}` : '', iR >= 0 && r[iR] != null ? `revenue ${money(r[iR])}${iRy >= 0 && r[iRy] != null ? ' (' + pct(r[iRy], 0) + ')' : ''}` : ''].filter(Boolean).join(' · ');
     return details(`${esc(it.q)}${re ? ' <span class="pill acc">⟲ reinsurance</span>' : ''}`, (re ? `<div class="reinsbox on"><h4>${esc(re.title)}</h4>${esc(re.detail)}</div>` : '') + bullets(r[iTxt]), esc(sm), k === 0); }).join('')}</div>
   ${(t.notes || []).length ? `<ul class="notes">${t.notes.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
   <h3>Table view</h3>${tableBlock(t, {id: 'tHl', wrap: true, terms: false, maxh: 600})}`;
  const upd = () => { const q = $('#hlq').value.trim().toLowerCase(); let v = 0; $$('#hlwrap details.x').forEach(d => { const hit = !q || d.innerText.toLowerCase().includes(q) || d.querySelector('.xb').textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) v++; if (q && hit) d.open = true; }); $('#hln').textContent = `${v} of ${items.length} quarters`;
    $$('#hlchips button').forEach(b => b.classList.toggle('on', b.dataset.v.toLowerCase() === q)); };
  $('#hlq').addEventListener('input', upd); $$('#hlchips button').forEach(b => b.onclick = () => { const i = $('#hlq'); i.value = i.value.toLowerCase() === b.dataset.v.toLowerCase() ? '' : b.dataset.v; upd(); }); upd();
}
const PROD = [['Pet', /\bpet|chewy/i], ['Car', /\bcar\b|metromile|autonomous|tesla|fsd/i], ['Life', /\blife\b/i], ['Home & renters', /renter|homeowner|contents|building|home/i], ['Financing', /synthetic|financ|general catalyst/i], ['Footprint', /footprint|states/i]];
const GEO = [['Europe', /germany|netherlands|france|\buk\b|europe|\beu\b/i], ['US', /\bus\b|u\.s\.|illinois|tennessee|texas|florida|colorado|indiana|pennsylvania|new york|states|metromile|chewy|tesla|car\b/i]];
function rollout() {
  const sh = optSheet('rollout'); const el = $('#s-rollout');
  const t = sh.tables.find(t => t.columns.some(c => /date|quarter|when|period/i.test(c))) || sh.tables[0];
  const ci = re => t.columns.findIndex(c => re.test(c));
  const iD = ci(/date|period|when|quarter/i), iP = ci(/product|line/i), iG = ci(/geo|market|country|region/i), iE = ci(/event|milestone|title|what/i), iL = ci(/letter date/i);
  const cls = (txt, map, dflt) => { for (const [k, re] of map) if (re.test(txt)) return k; return dflt; };
  const rows = t.rows.filter(Array.isArray).map((r, k) => { const all = t.columns.map((c, i) => String(r[i] ?? '')).join(' ');
    const pg = iP >= 0 ? String(r[iP] ?? '') : '';
    return {k, d: iD >= 0 ? String(r[iD] ?? '') : '', name: pg, p: iP >= 0 && iP !== iG ? pg : cls(pg + ' ' + (iE >= 0 ? r[iE] : ''), PROD, 'Other'), g: iG >= 0 && iG !== iP ? String(r[iG] ?? '') : cls(pg + ' ' + (iE >= 0 ? r[iE] : ''), GEO, 'US'),
      e: iE >= 0 ? String(r[iE] ?? '') : all, letter: iL >= 0 ? String(r[iL] ?? '') : '', x: t.columns.map((c, i) => [c, r[i]]).filter(([c, v], i) => v != null && v !== '' && i !== iE && !/^#$/.test(c))}; });
  const uniq = a => [...new Set(a.filter(Boolean))];
  const Ps = uniq(rows.map(r => r.p)), Gs = uniq(rows.map(r => r.g));
  el.innerHTML = `<h2>Product Rollout <span class="mut" style="font-size:16px;font-weight:500">· ${rows.length} milestones</span></h2>
   ${sh.pre.length ? `<div class="mut" style="font-size:12.5px;margin-bottom:10px">${sh.pre.map(esc).join('<br>')}</div>` : ''}
   <div class="mut" style="font-size:12px">Product line</div><div class="chips" id="roP"><button class="btn on" data-v="">All</button>${Ps.map(p => `<button class="btn" data-v="${esc(p)}">${esc(p)} <span class="mut">${rows.filter(r => r.p === p).length}</span></button>`).join('')}</div>
   <div class="mut" style="font-size:12px">Geography</div><div class="chips" id="roG"><button class="btn on" data-v="">All</button>${Gs.map(p => `<button class="btn" data-v="${esc(p)}">${esc(p)} <span class="mut">${rows.filter(r => r.g === p).length}</span></button>`).join('')}</div>
   <div class="grid g2"><div class="card"><h3 style="margin-top:0">Timeline <span class="mut" style="font-size:12px;font-weight:400" id="ron"></span></h3><div class="mut" style="font-size:12px;margin-bottom:8px">Click or tap an item for the source letter and notes. <button class="btn" id="roAll">Expand all</button></div><div class="tl" id="rotl">${rows.map(r => `<div class="tli" data-p="${esc(r.p)}" data-g="${esc(r.g)}" tabindex="0" role="button" aria-expanded="false"><div class="w">${esc(r.d)} · <span class="pill acc">${esc(r.p)}</span> <span class="pill other">${esc(r.g)}</span></div><div class="p">${esc(r.name)}${r.name && r.e ? ': ' : ''}<span style="font-weight:400">${esc(r.e)}</span></div><div class="d">${r.x.map(([c, v]) => `<div><b>${esc(c)}:</b> ${linkify(String(v))}</div>`).join('')}</div></div>`).join('')}</div></div>
   <div>${ccard({id: 'roC', title: 'Milestones per year by product line', h: 340})}<div class="card" style="margin-top:16px"><h3 style="margin-top:0">Rollout by product line</h3>${Ps.map(p => `<div class="cat"><div class="when">${esc(p)}</div><div style="flex:1;font-size:13px">${rows.filter(r => r.p === p).map(r => esc(r.d.replace(/\s*\(.*\)/, ''))).join(' → ')}</div></div>`).join('')}</div></div></div>
   ${tableBlock(t, {id: 'tRo', wrap: true, terms: false, maxh: 600})}`;
  const st = {p: '', g: ''}; const apply = () => { let v = 0; $$('#rotl .tli').forEach(x => { const ok = (!st.p || x.dataset.p === st.p) && (!st.g || x.dataset.g === st.g); x.hidden = !ok; if (ok) v++; }); $('#ron').textContent = `· showing ${v} of ${rows.length}`; };
  [['#roP', 'p'], ['#roG', 'g']].forEach(([s, k]) => $$(s + ' button').forEach(b => b.onclick = () => { $$(s + ' button').forEach(x => x.classList.toggle('on', x === b)); st[k] = b.dataset.v; apply(); }));
  $$('#rotl .tli').forEach(x => { const tg = () => { x.classList.toggle('open'); x.setAttribute('aria-expanded', x.classList.contains('open')); }; x.onclick = e => { if (!e.target.closest('a')) tg(); }; x.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } }; });
  $('#roAll').onclick = e => { e.stopPropagation(); const open = !$$('#rotl .tli').every(x => x.classList.contains('open')); $$('#rotl .tli').forEach(x => x.classList.toggle('open', open)); $('#roAll').textContent = open ? 'Collapse all' : 'Expand all'; };
  apply();
  const yr = r => { const m = r.d.match(/(20\d{2})/); if (m) return m[1]; const q = r.d.match(/Q[1-4]'(\d{2})/); if (q) return '20' + q[1]; const l = r.letter.match(/(20\d{2})/); return l ? l[1] : ''; };
  const Ys = uniq(rows.map(yr)).sort(); const pal = [C.acc, C.g, C.acc2, C.b, C.p, C.y, C.r, C.t];
  wireCard({id: 'roC', build: () => ({labels: Ys, stacked: true, datasets: Ps.map((p, i) => ({type: 'bar', label: p, data: Ys.map(y => rows.filter(r => yr(r) === y && r.p === p).length), backgroundColor: pal[i % pal.length]})), scales: {x: {stacked: true}, y: {stacked: true, ticks: {precision: 0}}}})});
  charts.roC.options.plugins.tooltip.callbacks.label = c => c.raw ? `${c.dataset.label}: ${c.raw} milestone${c.raw > 1 ? 's' : ''}` : null; charts.roC.update('none');
}
const PICKMAP = [[/lae/i, /^lae ratio/i], [/in-?force|ifp/i, /^in-?force premium/i], [/gross loss ratio/i, /^gross loss ratio \(/i], [/gross profit/i, /adj\. gross profit \/ gep|gross profit margin/i], [/ebitda/i, /^adj\. ebitda/i], [/fcf|cash/i, /^cash & investments/i], [/growth spend/i, /^growth spend/i], [/retention|adr/i, /annual dollar retention/i], [/product mix|segment/i, /^ifp - pet/i]];
function opmetrics() {
  const sh = optSheet('opmetrics'), qs = OPT.opmetrics.qs; const el = $('#s-opmetrics'); const L = qs.quarters, Sx = qs.series, SEC = qs.sections || {};
  const P = OPT.picks ? D.sheets[OPT.picks.sheet] : null; const pt = P ? P.tables[0] : null; const pc = re => pt ? pt.columns.findIndex(c => re.test(c)) : -1;
  const picks = pt ? pt.rows.filter(Array.isArray).map(r => ({name: String(r[pc(/^metric/i)] || ''), why: r[pc(/why/i)], latest: r[pc(/latest/i)], watch: r[pc(/trend|watch/i)], chart: r[pc(/chart/i)]})) : [];
  const findS = re => Object.keys(Sx).find(k => re.test(k));
  const numKeys = Object.keys(Sx).filter(k => Sx[k].filter(v => v != null).length >= 2);
  const secs = [...new Set(numKeys.map(k => SEC[k] || 'Metrics'))];
  const lastOf = k => { const v = Sx[k]; for (let i = v.length - 1; i >= 0; i--) if (v[i] != null) return [v[i], i]; return [null, -1]; };
  const prevOf = (k, i) => { const v = Sx[k]; for (let j = i - 1; j >= 0; j--) if (v[j] != null) return [v[j], j]; return [null, -1]; };
  const fv = (k, v) => v == null ? 'n/a' : /\(%\)|%/.test(k) ? fmt(v, Number.isInteger(v) ? 0 : 1) + (/pts|pp/.test(k) ? '' : '%') : /\(\$m\)/.test(k) ? money(v) : /\(\$\)/.test(k) ? '$' + fmt(v) : /\(m\)/.test(k) ? fmt(v, 2) + 'm' : Math.abs(v) >= 1e5 ? fmt(v / 1e6, 2) + 'm' : fmt(v, Number.isInteger(v) ? 0 : 1);
  const txtKeys = Object.keys(qs.text || {}).filter(k => (qs.text[k] || []).some(Boolean));
  const ret = findS(/annual dollar retention/i) || numKeys[0];
  el.innerHTML = `<h2>Operating Metrics <span class="mut" style="font-size:16px;font-weight:500">· ${esc(L[0])} – ${esc(L[L.length - 1])}</span></h2>
   ${sh.pre.length ? `<div class="mut" style="font-size:12.5px;margin-bottom:10px">${sh.pre.map(esc).join('<br>')}</div>` : ''}
   ${picks.length ? `<div class="card verdict" style="margin-bottom:16px"><b>What to watch:</b> the ${picks.length} recommended due-diligence metrics are on the <a href="#picks">Metric Picks</a> tab, each with a chart, its latest value and what to watch.</div>` : ''}
   <div class="card ccard" id="cc-omX" style="margin-bottom:16px"><div class="chead"><div class="ct">Metric explorer <select id="omSel" aria-label="Choose metric" style="margin-left:6px;max-width:260px">${secs.map(s => `<optgroup label="${esc(s)}">${numKeys.filter(k => (SEC[k] || 'Metrics') === s).map(k => `<option ${k === ret ? 'selected' : ''}>${esc(k)}</option>`).join('')}</optgroup>`).join('')}</select></div>
     <div class="ctools"><div class="seg" data-k="mode"><button data-v="v" class="on">Value</button><button data-v="q">QoQ %</button><button data-v="y">YoY %</button></div><div class="seg" data-k="range"><button data-v="8">8Q</button><button data-v="12">3Y</button><button data-v="all" class="on">2020+ (all)</button></div><button class="ib" data-z="in" aria-label="Zoom in">+</button><button class="ib" data-z="out" aria-label="Zoom out">−</button><button class="btn" data-z="reset">Reset</button></div></div>
     <div class="chartbox" style="height:330px"><canvas id="omX"></canvas></div><div class="chint">Pick any metric, or click a card below. Hover or tap for values · drag to pan · pinch or Ctrl+scroll to zoom</div><div class="reinsboxes"></div></div>
   ${secs.map(s => `<h3>${esc(s)}</h3><div class="grid g4">${numKeys.filter(k => (SEC[k] || 'Metrics') === s).map(k => { const [v, i] = lastOf(k); const [pv, pj] = prevOf(k, i); const g = gfind(k); const n = Sx[k].filter(x => x != null).length;
     return `<div class="card kpi omc" data-k="${esc(k)}" style="cursor:pointer" title="Click to load into the metric explorer"><div class="l">${esc(k)} ${g ? info(g[0]) : ''}</div><div class="v">${fv(k, v)}</div><div class="s">${esc(L[i] || '')}${pv != null ? ` · prior ${fv(k, pv)} (${esc(L[pj])})` : ''} · ${n} qtrs</div><div class="spark"><canvas id="oms${numKeys.indexOf(k)}"></canvas></div></div>`; }).join('')}</div>`).join('')}
   ${txtKeys.length ? `<h3>Disclosed qualitative metrics</h3><div class="xscope">${xallBtns()}${txtKeys.map(k => details(esc(k), `<ul class="lst">${qs.text[k].map((v, i) => v ? `<li><b>${esc(L[i])}:</b> ${linkify(String(v))}</li>` : '').join('')}</ul>`, `${qs.text[k].filter(Boolean).length} quarters`)).join('')}</div>` : ''}
   <h3>All operating metrics</h3>${tableBlock(sh.tables[0], {id: 'tOm', maxh: 640, notes: []})}
   `;
  numKeys.forEach((k, i) => { const v = Sx[k]; const s0 = v.findIndex(x => x != null); spark('oms' + i, v.slice(s0), C.acc, L.slice(s0)); });
  picks.forEach((p, i) => { const m = PICKMAP.find(([a]) => a.test(p.name)); const sk = m ? findS(m[1]) : null; if (sk) { const v = Sx[sk]; const s0 = v.findIndex(x => x != null); spark('pk' + i, v.slice(s0), C.acc, L.slice(s0)); } });
  const st = {k: ret};
  wireCard({id: 'omX', reins: 1, build: s => { const v = Sx[st.k]; const s0 = Math.max(rangeSlice(L, s), v.findIndex(x => x != null)); const u = /%/.test(st.k) ? '%' : /\(\$m\)/.test(st.k) ? '$m' : /\(\$\)/.test(st.k) ? '$' : '';
    return {type: 'line', labels: L.slice(s0), datasets: [{label: st.k, data: v.slice(s0), borderColor: C.acc, backgroundColor: C.acc3, fill: true, spanGaps: true, unit: u}]}; }});
  const load = k => { st.k = k; $('#omSel').value = k; const b = $('#cc-omX .seg[data-k="mode"] button.on'); (b || $('#cc-omX .seg button')).click(); $('#cc-omX').scrollIntoView({behavior: 'smooth', block: 'center'}); };
  $('#omSel').onchange = () => load($('#omSel').value);
  $$('.omc').forEach(c => c.onclick = e => { if (e.target.closest('[data-tip]')) return; load(c.dataset.k); });
  $$('.pick').forEach(c => c.onclick = e => { const a = e.target.closest('[data-load]'); if (a) { e.preventDefault(); load(a.dataset.load); return; } if (e.target.closest('[data-tip]')) return; const d = c.querySelector('.pk-d'); d.hidden = !d.hidden; });
}
/* ---------------- Metric Picks: what to watch ---------------- */
function picksTab() {
  const P = D.sheets[OPT.picks.sheet], pt = P.tables[0]; const pc = re => pt.columns.findIndex(c => re.test(c));
  const picks = pt.rows.filter(Array.isArray).map(r => ({name: String(r[pc(/^metric/i)] || ''), why: r[pc(/why/i)], latest: r[pc(/latest/i)], watch: r[pc(/trend|watch/i)], chart: r[pc(/chart/i)]}));
  const om = OPT.opmetrics ? OPT.opmetrics.qs : null; const L = om ? om.quarters : [], Sx = om ? om.series : {};
  const f = re => { const k = Object.keys(Sx).find(k => re.test(k)); return k ? Sx[k] : null; };
  const line = (label, re, color, extra = {}) => { const d = f(re); return d ? Object.assign({type: 'line', label, data: d, borderColor: color, spanGaps: true}, extra) : null; };
  const bar = (label, re, color, extra = {}) => { const d = f(re); return d ? Object.assign({type: 'bar', label, data: d, backgroundColor: color}, extra) : null; };
  const y1 = {y1: {position: 'right', grid: {drawOnChartArea: false}}};
  const SPEC = [
    [/lae/i, () => ({datasets: [line('LAE ratio (%)', /^lae ratio/i, C.acc, {unit: '%'}), line('IFP per employee ($m)', /ifp per employee/i, C.g, {yAxisID: 'y1', unit: '$m'})], scales: y1, unit: '%'})],
    [/in-?force|ifp/i, () => ({datasets: [bar('IFP ($m)', /^in-?force premium/i, C.acc2, {unit: '$m'}), line('IFP YoY %', /^ifp yoy/i, C.acc, {yAxisID: 'y1', unit: '%', keep: 1})], scales: y1, reins: 1})],
    [/gross loss ratio/i, () => ({datasets: [line('Gross loss ratio', /^gross loss ratio \(/i, C.acc), line('TTM gross loss ratio', /^ttm gross loss/i, C.g), line('GLR ex-CAT & PPD', /ex-cat/i, C.b), line('Net loss ratio', /^net loss ratio/i, C.r)], unit: '%'})],
    [/gross profit/i, () => ({datasets: [line('Gross profit margin (%)', /^gross profit margin/i, C.acc), line('Adj. gross profit / GEP (%)', /adj\. gross profit \/ gep/i, C.g)], unit: '%', reins: 1})],
    [/ebitda/i, () => ({datasets: [bar('Adj. EBITDA ($m)', /^adj\. ebitda/i, C.acc, {unit: '$m'}), line('Net loss as % of GEP', /net loss as % of gep/i, C.g, {yAxisID: 'y1', unit: '%'})], scales: y1})],
    [/fcf|cash/i, () => ({datasets: [line('Cash & investments ($m)', /^cash & investments/i, C.acc), bar('GC Synthetic Agents borrowings ($m)', /synthetic agents borrowings/i, C.g), bar('Adj. FCF ($m)', /^adj\. fcf/i, C.b)], unit: '$m'})],
    [/growth spend/i, () => ({datasets: [bar('Growth spend ($m)', /^growth spend/i, C.acc, {unit: '$m'}), line('IFP added QoQ ($m)', /^in-?force premium/i, C.g, {unit: '$m', keep: 1})].map((d, i) => { if (d && i === 1) d.data = d.data.map((v, j) => j && v != null && d.data[j - 1] != null ? +(v - d.data[j - 1]).toFixed(1) : null); return d; }), unit: '$m'})],
    [/retention|adr/i, () => ({datasets: [line('Annual dollar retention (%)', /annual dollar retention/i, C.acc, {unit: '%'}), line('Premium per customer ($)', /^premium per customer \(/i, C.g, {yAxisID: 'y1', unit: '$'})], scales: y1})],
    [/product mix|segment/i, () => ({datasets: [bar('Home/renters US', /^ifp - home/i, C.acc), bar('Pet', /^ifp - pet/i, C.acc2), bar('Car', /^ifp - car/i, C.g), bar('Europe', /^ifp - europe/i, C.b)], stacked: true, unit: '$m'})]];
  const specs = picks.map((p, i) => { const m = SPEC.find(([re]) => re.test(p.name)); return m && om ? m[1]() : null; });
  $('#s-picks').innerHTML = `<h2>What to watch <span class="mut" style="font-size:16px;font-weight:500">· ${picks.length} recommended due-diligence metrics</span></h2>
   ${P.title ? `<div class="mut" style="font-size:13px;margin-bottom:4px">${esc(P.title)}</div>` : ''}${P.pre.length ? `<div class="mut" style="font-size:12.5px;margin-bottom:14px">${P.pre.map(esc).join('<br>')}</div>` : ''}
   <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">Checklist</h3>${picks.map((p, i) => `<div class="cat"><div class="when" style="width:28px">${i + 1}</div><div style="flex:1"><a href="#picks" data-go="pk-${i}"><b>${esc(p.name.replace(/^\d+\.\s*/, ''))}</b></a><div class="mut" style="font-size:12.5px">${esc(p.watch || '')}</div></div><div class="dd" style="max-width:200px;white-space:normal;text-align:right">${esc(p.latest || '')}</div></div>`).join('')}</div>
   <div class="grid g2">${picks.map((p, i) => `<div id="pk-${i}" style="scroll-margin-top:70px">${specs[i] && specs[i].datasets.some(Boolean) ? ccard({id: 'pkc' + i, title: p.name, growth: 0, reins: specs[i].reins, ranges: [['8', '8Q'], ['12', '3Y'], ['all', '2020+ (all)']], h: 260}) : `<div class="card"><div class="ct" style="font-weight:600">${esc(p.name)}</div></div>`}
     <div class="card" style="margin-top:-8px;border-top-left-radius:0;border-top-right-radius:0;padding-top:12px"><div class="kpi"><div class="l">Latest (${esc(D.hero.quarter)})</div><div class="v" style="font-size:18px">${esc(p.latest || 'n/a')}</div></div>
     <p style="font-size:13px;margin:8px 0 6px"><b>What to watch:</b> ${esc(p.watch || '')}</p>${details('Why it matters', esc(p.why || ''), esc(p.chart || ''))}</div></div>`).join('')}</div>
   <h3>Table view</h3>${tableBlock(pt, {id: 'tPk', wrap: true, terms: false})}`;
  specs.forEach((sp, i) => { if (!sp || !sp.datasets.some(Boolean)) return; wireCard({id: 'pkc' + i, reins: sp.reins, unit: sp.unit || '', build: st => { const s0 = rangeSlice(L, st); const ds = sp.datasets.filter(Boolean).map(d => Object.assign({}, d, {data: d.data.slice(s0)}));
    const first = Math.min(...ds.map(d => d.data.findIndex(v => v != null)).filter(x => x >= 0)); return {labels: L.slice(s0 + first), datasets: ds.map(d => Object.assign(d, {data: d.data.slice(first)})), stacked: sp.stacked, scales: Object.assign({}, sp.scales || {}, sp.stacked ? {y: {stacked: true}} : {})}; }}); });
  $$('#s-picks [data-go]').forEach(a => a.onclick = e => { e.preventDefault(); const t = document.getElementById(a.dataset.go); t && t.scrollIntoView({behavior: 'smooth', block: 'start'}); });
}
/* ---------------- router ---------------- */
const TABS = [['overview', 'Overview', overview], ['kpis', 'Insurance KPIs', kpis], ['history', 'IFP & Revenue History', history, 'history'], ['highlights', 'Quarterly Highlights', highlights, 'highlights'],
  ['rollout', 'Product Rollout', rollout, 'rollout'], ['opmetrics', 'Operating Metrics', opmetrics, 'opmetrics'], ['picks', 'Metric Picks', picksTab, 'picks'], ['is', 'Income Statement', isTab], ['bs', 'Balance Sheet', bsTab], ['cf', 'Cash Flow', cfTab],
  ['guidance', 'Guidance vs Actual', guidance], ['street', 'Wall Street', street], ['insiders', 'Insiders', insiders], ['valuation', 'Valuation & Peers', valuation], ['risks', 'Risks / Bull–Bear', risks], ['sources', 'Sources', sources]]
  .filter(t => !t[3] || OPT[t[3]]);
const done = {};
function route() {
  let id = (location.hash || '#overview').slice(1).split('/')[0]; if (!TABS.some(t => t[0] === id)) id = 'overview';
  $$('#nav a').forEach(a => { const on = a.dataset.t === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({block: 'nearest', inline: 'center'}); });
  $$('main section').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
  const t = TABS.find(t => t[0] === id);
  if (!done[id]) { try { t[2](); } catch (e) { console.error('render ' + id, e); $('#s-' + id).insertAdjacentHTML('beforeend', `<div class="tvfail">This tab could not render: ${esc(e.message)}</div>`); } done[id] = 1; wireTables($('#s-' + id)); wireXall($('#s-' + id)); }
  document.title = `${t[1]} · Lemonade (LMND) Dashboard · © Hugo Tian`;
}
function buildNav() {
  $('#nav').innerHTML = TABS.map(([id, l]) => `<a href="#${id}" data-t="${id}">${esc(l)}</a>`).join('');
  $('#main').innerHTML = TABS.map(([id]) => `<section id="s-${id}"></section>`).join('');
}
/* ---------------- theme ---------------- */
function applyTheme(rerender) {
  const t = document.documentElement.dataset.theme || 'auto';
  $('#themelbl').textContent = t === 'auto' ? 'Auto' : t === 'dark' ? 'Dark' : 'Light'; $('#themeic').textContent = t === 'auto' ? '◐' : t === 'dark' ? '☾' : '☀';
  $('#themebtn').title = `Theme: ${t === 'auto' ? 'follows your system' : t} · click to switch`;
  if (!rerender) return;
  palette(); Object.keys(charts).forEach(k => { try { charts[k].destroy(); } catch (e) {} delete charts[k]; });
  for (const k in done) delete done[k]; hero(); route();
}
$('#themebtn').onclick = () => { const cur = document.documentElement.dataset.theme || 'auto'; const nx = cur === 'auto' ? (isDark() ? 'light' : 'dark') : cur === 'dark' ? 'light' : 'auto';
  if (nx === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('lmnd-theme'); } catch (e) {} } else { document.documentElement.dataset.theme = nx; try { localStorage.setItem('lmnd-theme', nx); } catch (e) {} }
  applyTheme(true); };
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!document.documentElement.dataset.theme) applyTheme(true); });
/* ---------------- init ---------------- */
$('#foot').innerHTML = `Built from Lemonade's SEC filings (10-Q, 8-K shareholder letters, Form 4, DEF 14A), company IR material and labelled third-party market data. Company figures as of ${esc(D.hero.period_end_long)} (${esc(D.hero.quarter)}); market data close ${esc(dlong(D.price.close_date))}; live price via TradingView (delayed). Not investment advice. Unavailable figures are shown as n/a.<br><b>© Hugo Tian</b>`;
buildNav(); applyTheme(false); hero(); route(); addEventListener('hashchange', route);
