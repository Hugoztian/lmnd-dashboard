/* Lemonade (LMND) Dashboard · © 2026 Hugo Tian. All rights reserved. All data comes from data.js (built by build_data.py from the research workbook). */
'use strict';
const D = window.LMND_DATA, Q = D.meta.quarters, NQ = Q.length, LI = NQ - 1;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
/* ---------------- language: English only. L(en, _) returns English; tr(s) returns s unchanged. ---------------- */
let LANG = 'en';   // English only
const L = (en, zh) => LANG === 'zh' ? zh : en;
const NA = () => L('n/a', '');
const ZHT = {}, TOKR = /\d+(?:[.,]\d+)*/g;
const MONI = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Sept:9,Oct:10,Nov:11,Dec:12}, MRX = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)[a-z]*\\.?';
const DRX = [ // English date forms → Chinese (Chinese mode only)
  [new RegExp('\\b(\\d{1,2})[–-](\\d{1,2}) ' + MRX + ' (\\d{4})\\b', 'g'), (m, a, b, mo, y) => `${y}${MONI[mo]}${a}–${b}`],
  [new RegExp('\\b(\\d{1,2})[- ]' + MRX + '[- ,]+(\\d{4})\\b', 'g'), (m, d, mo, y) => `${y}${MONI[mo]}${+d}`],
  [new RegExp('\\b' + MRX + ' (\\d{1,2}),? (\\d{4})\\b', 'g'), (m, mo, d, y) => `${y}${MONI[mo]}${+d}`],
  [new RegExp('\\b' + MRX + '[- ](\\d{4})\\b', 'g'), (m, mo, y) => `${y}${MONI[mo]}`],
  [new RegExp('\\b(\\d{1,2}) ' + MRX + '(?![a-z])', 'g'), (m, d, mo) => `${MONI[mo]}${+d}`]];
const zhDate = s => DRX.reduce((a, [r, f]) => a.replace(r, f), String(s ?? ''));
const dl = s => LANG === 'zh' ? zhDate(s) : s;   // a date written in English inside data → Chinese date in Chinese mode
function tr(s) { if (LANG !== 'zh' || s == null || typeof s !== 'string') return s; const t = ZHT[s.replace(TOKR, '⟦⟧')]; if (t == null) return s;
  const v = s.match(TOKR) || [], o = t.replace(/⟦(\d+)⟧/g, (m, i) => v[+i] ?? '');
  return o.startsWith(s) ? s + zhDate(o.slice(s.length)) : o; }   // an English original kept in front of "" is never altered
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (v, d = 0) => v == null || isNaN(v) ? NA() : Number(v).toLocaleString('en-US', {minimumFractionDigits: d, maximumFractionDigits: d});
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dlong = iso => { if (!iso) return ''; const [y, m, d] = iso.slice(0, 10).split('-').map(Number); return LANG === 'zh' ? `${y}${m}${d}` : `${d} ${MON[m-1]} ${y}`; };
const pct = (v, d = 1) => v == null || isNaN(v) ? NA() : (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) + '%';
const pcls = v => v == null ? 'mut' : v >= 0 ? 'pos' : 'neg';
const money = (v, d = 1) => v == null ? NA() : (v < 0 ? '−$' : '$') + fmt(Math.abs(v), d) + 'm';
const qshort = q => q.replace(/^Q(\d) (\d{2})(\d{2})$/, "Q$1'$3");
const linkify = s => esc(s).replace(/(https?:\/\/[^\s;,)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
const S = Object.assign({}, D.fin.kpi.series, D.fin.is.series, D.fin.bs.series, D.fin.cf.series);
const ser = (pat, src) => { const o = src ? D.fin[src].series : S; for (const k in o) if (new RegExp(pat, 'i').test(k)) return o[k]; return null; };
const isDark = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); };
let C = {};
function palette() {
  C = isDark()
    ? {acc:'#ff3d9f', acc2:'#ff9fcf', acc3:'rgba(255,61,159,.16)', g:'#d1d1d6', r:'#636366', y:'#c9a77c', b:'#8fa3bf', p:'#b49fc9', t:'#86b8a8', up:'#30d158', dn:'#ff453a', grid:'rgba(255,255,255,.06)', txt:'#8e8e93', title:'#f5f5f7', band:'rgba(142,142,147,.30)'}
    : {acc:'#FF0083', acc2:'#ff99cd', acc3:'rgba(255,0,131,.10)', g:'#48484a', r:'#c7c7cc', y:'#b8946a', b:'#7d93b2', p:'#a48bbd', t:'#6fa696', up:'#1d8a3a', dn:'#d70015', grid:'rgba(0,0,0,.045)', txt:'#86868b', title:'#1d1d1f', band:'rgba(142,142,147,.28)'};
  const d = Chart.defaults; d.devicePixelRatio = Math.max(2, window.devicePixelRatio || 1);
  d.font.family = '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Microsoft YaHei",Arial,sans-serif'; d.font.size = 11; d.color = C.txt; d.borderColor = C.grid;
  d.elements.line.borderWidth = 2; d.elements.line.tension = .35; d.elements.point.radius = 1.5; d.elements.point.hoverRadius = 5; d.elements.point.hitRadius = 12; d.elements.point.borderWidth = 0;
  d.elements.bar.borderRadius = 5; d.elements.bar.borderSkipped = false; d.datasets.bar.maxBarThickness = 32;
  Object.assign(d.plugins.legend.labels, {usePointStyle: true, pointStyle: 'circle', boxWidth: 6, boxHeight: 6, padding: 14, color: C.txt});
  Object.assign(d.plugins.tooltip, {backgroundColor: isDark() ? 'rgba(58,58,60,.97)' : 'rgba(29,29,31,.93)', cornerRadius: 10, padding: 10, boxPadding: 4, usePointStyle: true});
  d.scale.border = {display: false}; d.scale.ticks.padding = 8; d.scales.category.grid = {display: false};
  d.scales.category.ticks = Object.assign(d.scales.category.ticks || {}, {maxRotation: 0, autoSkip: true, autoSkipPadding: 14});
  ['linear', 'logarithmic'].forEach(k => { if (d.scales[k]) { d.scales[k].grid = Object.assign(d.scales[k].grid || {}, {color: C.grid, drawTicks: false}); d.scales[k].ticks = Object.assign(d.scales[k].ticks || {}, {maxTicksLimit: 5}); } });
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
const info = (key, extra = '') => { const g = G[key] ? `<b>${esc(tr(key))}</b> — ${esc(tr(G[key]))}` : esc(tr(key)); return `<i class="i" tabindex="0" data-tip="${esc(g + (extra ? '<br>' + extra : ''))}">i</i>`; };
const termify = (label, disp = label) => { const g = gfind(label); return g ? `<span class="term" tabindex="0" data-tip="${esc('<b>' + esc(tr(g[0])) + '</b> — ' + esc(tr(g[1])))}">${esc(disp)}</span>` : esc(disp); };
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
      label: {display: true, content: (future ? '→ ' : r.kind === 'ma' ? '◆ ' : r.kind === 'lap' ? '↺ ' : '⟲ ') + tr(r.label || r.title), position: future || j % 2 ? 'end' : 'start', backgroundColor: col, color: r.kind === 'ma' && !isDark() ? '#fff' : r.kind === 'ma' ? '#000' : '#fff', font: {size: 10, weight: '600'}, padding: {x: 5, y: 3}, borderRadius: 6},
      click: () => onClick && onClick(k), enter: ({chart}) => { chart.canvas.style.cursor = 'pointer'; }, leave: ({chart}) => { chart.canvas.style.cursor = ''; }}; });
  return ann;
}
/* Interactive chart card: value / QoQ / YoY switch, zoom/pan + reset, legend toggle, optional range + reinsurance notes */
function ccard(o) {
  const tools = [];
  if (o.growth) tools.push(`<div class="seg" data-k="mode">${[['v',L('Value','')],['q',L('QoQ %',' %')],['y',L('YoY %',' %')]].map(([k,l]) => `<button data-v="${k}" class="${k==='v'?'on':''}">${l}</button>`).join('')}</div>`);
  if (o.ranges) tools.push(`<div class="seg" data-k="range">${o.ranges.map(([k,l],i) => `<button data-v="${k}" class="${i===o.ranges.length-1?'on':''}">${l}</button>`).join('')}</div>`);
  tools.push(`<span class="ztools"><button class="ib" data-z="in" title="${L('Zoom in', '')}" aria-label="${L('Zoom in', '')}">+</button><button class="ib" data-z="out" title="${L('Zoom out', '')}" aria-label="${L('Zoom out', '')}">−</button><button class="ib wide" data-z="reset" title="${L('Reset zoom', '')}">${L('Reset', '')}</button></span>`);
  const reins = o.reins ? `<div class="reinsboxes"></div>` : '';
  return `<div class="card ccard" id="cc-${o.id}"><div class="chead"><div class="ct">${esc(o.title)}${o.tip ? ' ' + info(o.tip) : ''}</div><div class="ctools">${tools.join('')}</div></div>
    <div class="chartbox" style="${o.h ? 'height:' + o.h + 'px' : ''}"><canvas id="${o.id}" role="img" aria-label="${esc(o.title)}"></canvas></div>
    <div class="chint">${L('Hover or tap for values · click a legend item to hide it · drag to pan · pinch or Ctrl+scroll to zoom', ' ·  ·  ·  Ctrl+')}</div>${reins}</div>`;
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
    const scales = st.mode === 'v' ? (base.scales || {}) : {y: {title: {display: true, text: st.mode === 'q' ? L('QoQ growth %', ' %') : L('YoY growth %', ' %')}, ticks: {callback: v => v + '%'}}};
    const ann = o.reins ? reinsAnn(labels, showRe) : {};
    const unit = st.mode === 'v' ? (o.unit || '') : '%';
    const raw = o.build(st);
    chart(o.id, {type: base.type || 'bar', data: {labels, datasets: base.datasets},
      options: {responsive: true, maintainAspectRatio: false, interaction: {mode: 'index', intersect: false},
        scales: Object.assign({x: {stacked: !!base.stacked}}, st.mode === 'v' && base.stacked ? {y: {stacked: true}} : {}, scales),
        plugins: {legend: {position: 'bottom'}, zoom: zoomOpts(), annotation: {annotations: ann},
          tooltip: {callbacks: {label: c => { const v = c.raw; if (v == null) return `${c.dataset.label}: ${NA()}`; const u = c.dataset.unit ?? unit;
              return `${c.dataset.label}: ${u === '$m' ? money(v) : u === '%' ? (st.mode === 'v' ? fmt(v, 1) + '%' : pct(v)) : u === '$' ? '$' + fmt(v, 0) : fmt(v, Math.abs(v) < 100 ? 1 : 0) + (u ? ' ' + u : '')}`; },
            footer: items => { if (st.mode !== 'v' || !items.length) return ''; const i = items[0].dataIndex; const ds = raw.datasets[items[0].datasetIndex]; if (!ds || ds.keep) return '';
              const q = growth(ds.data, 1)[i], y = growth(ds.data, 4)[i]; return [q != null ? `${L('QoQ', '')} ${pct(q)}` : null, y != null ? `${L('YoY', '')} ${pct(y)}` : null].filter(Boolean).join(' · '); }}}}}});
    if (o.reins) { const box = card.querySelector('.reinsboxes'); const inr = evIn(labels).map(e => [e.r, e.k]);
      box.innerHTML = inr.map(([r, k]) => `<button class="reinsbtn" data-k="${k}">${r.kind === 'ma' ? '◆' : r.kind === 'lap' ? '↺' : '⟲'} ${esc(r.quarter)}: ${esc(tr(r.label || r.title))} <span class="mut">· ${L('what changed?', '')}</span></button>`).join(' ') + inr.map(([r, k]) => `<div class="reinsbox" data-k="${k}"><h4>${esc(dlong(r.date))} — ${esc(tr(r.title))}</h4>${esc(tr(r.detail))}<div class="mut" style="font-size:11.5px;margin-top:4px">${L('Source', '')}: ${esc(tr(r.source))}</div></div>`).join('');
      box.querySelectorAll('.reinsbtn').forEach(b => b.onclick = () => showRe(+b.dataset.k)); }
  };
  card.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { sg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); st[sg.dataset.k] = b.dataset.v; draw(); }));
  card.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { const c = charts[o.id]; if (!c) return; const z = b.dataset.z; if (z === 'reset') c.resetZoom(); else c.zoom(z === 'in' ? 1.3 : 0.77); });
  draw();
}
function charts2(list) { return `<div class="grid g2" style="margin-bottom:16px">${list.map(ccard).join('')}</div>`; }
function spark(id, data, color, labels) {
  return chart(id, {type: 'line', data: {labels: labels || Q.map(qshort), datasets: [{data, borderColor: color || C.acc, backgroundColor: C.acc3, fill: 'start', pointRadius: 0, pointHoverRadius: 3, borderWidth: 1.75, tension: .35}]},
    options: {responsive: true, maintainAspectRatio: false, animation: false, layout: {padding: {top: 4, bottom: 0, left: 0, right: 5}}, scales: {x: {display: false, offset: false}, y: {display: false, grace: '8%'}},
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
  const s = String(v); if (/^(n\/a|n\/m|n\/p)$/i.test(s)) return [/^n\/a$/i.test(s) ? NA() : s, 'na'];
  return [tr(s), ''];
}
/* long notes and source lines sit behind a quiet disclosure */
function fnote(lines, label, raw = false) { label = label || L('Notes & sources', ''); lines = (lines || []).filter(x => x != null && String(x).trim() !== ''); if (!lines.length) return '';
  return `<details class="fn"><summary>${esc(label)} <span class="fnn">${lines.length}</span></summary><ul class="notes">${lines.map(n => `<li>${raw ? n : linkify(tr(n)).replace(/\n/g, '<br>')}</li>`).join('')}</ul></details>`; }
function tableBlock(t, o = {}) {
  const id = o.id || ('t' + (++TID)); const cols = t.columns; const qcols = cols.map((c, i) => /^Q[1-4]\s?'?\d{2}/.test(String(c)) ? i : -1).filter(i => i >= 0);
  const lastQ = qcols.length ? qcols[qcols.length - 1] : -1, prevQ = qcols.length > 1 ? qcols[qcols.length - 2] : -1;
  let h = '';
  if (t.title && !o.notitle) h += `<h3>${esc(tr(t.title))}</h3>`;
  const pre = [...(o.pre || []), ...(t.pre || [])];
  h += `<div class="tbar"><input type="search" placeholder="${L('Filter', '')}" aria-label="${L('Filter table rows', '')}" data-t="${id}"><span class="tcount" id="${id}-n"></span><button class="lnk" data-csv="${id}" title="${L('Download this table as CSV', ' CSV')}">CSV ↓</button></div>`;
  h += `<div class="tblwrap" style="${o.maxh ? 'max-height:' + o.maxh + 'px' : ''}"><table id="${id}" class="${o.wrap ? 'wrapt' : ''} ${o.cls || ''}" data-title="${esc(o.csvname || t.title || o.id || 'table')}"><thead><tr>${cols.map((c, i) => `<th data-i="${i}" class="${i === lastQ ? 'latest' : ''}">${esc(tr(c))}</th>`).join('')}</tr></thead><tbody>`;
  t.rows.forEach((r, ri) => {
    if (!Array.isArray(r)) { h += `<tr class="sec"><td colspan="${cols.length}">${esc(tr(r.section))}</td></tr>`; return; }
    const label = r[0]; let trend = '';
    if (o.colorLatest && lastQ > 0 && typeof r[lastQ] === 'number' && typeof r[prevQ] === 'number' && r[lastQ] !== r[prevQ]) { const up = r[lastQ] > r[prevQ]; const good = BAD.test(label) ? !up : up; trend = good ? 'up' : 'dn'; }
    const xd = o.expand ? o.expand(r, ri) : null;
    h += `<tr data-ri="${ri}" class="${xd ? 'xrow' : ''}">` + r.map((c, i) => { const [s, cl] = cellFmt(c, cols[i]); const w = (String(s).length > 44 || o.wrap) ? ' wrap' : '';
      const body = o.raw && typeof c === 'string' && /<(a|span) /.test(c) ? c : (i === 0 && o.terms !== false ? termify(String(c ?? ''), s) : linkify(s)).replace(/\n/g, '<br>');
      return `<td class="${cl}${w}${i === lastQ ? ' latest ' + trend : ''}">${body}</td>`; }).join('') + '</tr>';
    if (xd) h += `<tr class="xdetail" data-for="${ri}" hidden><td colspan="${cols.length}">${xd}</td></tr>`;
  });
  h += '</tbody></table></div>';
  const notes = [...pre, ...(t.notes || []), ...(o.notes || [])]; h += fnote(notes, undefined, !!o.raw);
  return h;
}
function wireTables(root) {
  $$('table', root).forEach(tb => {
    if (tb.dataset.wired) return; tb.dataset.wired = 1;
    const body = tb.tBodies[0]; const orig = [...body.rows];
    const n = document.getElementById(tb.id + '-n'); const total = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')).length;
    const count = () => { if (n) { const vis = orig.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail') && !r.hidden).length; n.textContent = rowsTxt(vis, total); } };
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
const rowsTxt = (v, n) => v === n ? L(`${n} rows`, ` ${n} `) : L(`${v} of ${n} rows`, `${v} / ${n} `);
function filterTable(id, q) {
  const tb = document.getElementById(id); if (!tb) return; q = q.trim().toLowerCase(); let sec = null, secHit = false;
  const rows = [...tb.tBodies[0].rows];
  rows.forEach(r => {
    if (r.classList.contains('sec')) { if (sec) sec.hidden = !secHit && !!q; sec = r; secHit = false; return; }
    if (r.classList.contains('xdetail')) { if (q) r.hidden = true; return; }
    const hit = !q || r.innerText.toLowerCase().includes(q); r.hidden = !hit; if (hit) secHit = true; if (!hit) r.classList.remove('open');
  });
  if (sec) sec.hidden = !secHit && !!q;
  const n = document.getElementById(id + '-n'); if (n) { const d = rows.filter(r => !r.classList.contains('sec') && !r.classList.contains('xdetail')); const v = d.filter(r => !r.hidden).length; n.textContent = rowsTxt(v, d.length); }
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
const CODE_HDR = /^(form|code|ticker|symbol|type|d\/i|10b5-1|role|rating|quarter|q||||\/|||)$/i;
const DATE_RES = [/^\d{4}\d{1,2}(\d{1,2}(–\d{1,2})?)?$/, /^\d{4}-\d{2}-\d{2}$/, /^\d{1,2}\s[A-Z][a-z]{2,8}\s\d{4}$/, /^~?Q[1-4]\s?'?\d{2,4}$/, /^Q[1-4] \d{4}$/, /^[A-Z][a-z]{2,8}[- ]\d{4}$/];
function tightCols(root) {
  $$('table', root).forEach(tb => { const head = tb.tHead && tb.tHead.rows[0]; if (!head) return; const n = head.cells.length; const rows = [...tb.tBodies[0].rows].filter(r => r.cells.length === n);
    rows.forEach(r => [...r.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); }));
    [...head.cells].forEach(c => { if (DATE_RES.some(re => re.test(c.textContent.trim()))) c.classList.add('dt'); });
    for (let i = 0; i < n; i++) { const vals = rows.map(r => r.cells[i].textContent.trim()).filter(v => v && !/^n\/a$/i.test(v)); const hdr = head.cells[i].textContent.trim();
      let code = CODE_HDR.test(hdr); if (!code && vals.length) { const mx = Math.max(...vals.map(v => v.length)); code = mx <= 6 && vals.every(v => /^[A-Za-z][A-Za-z.]*$/.test(v)); }
      if (!code) continue; head.cells[i].classList.add('code'); rows.forEach(r => r.cells[i].classList.add('code')); if (i === 0) tb.classList.add('c0tight'); } });
}
function details(title, body, sm = '', open = false) { return `<details class="x"${open ? ' open' : ''}><summary><span>${title}${sm ? ` <span class="sm">${sm}</span>` : ''}</span></summary><div class="xb">${body}</div></details>`; }
function xallBtns() { return `<div class="xall"><button class="lnk" data-xall="1">${L('Expand all', '')}</button><button class="lnk" data-xall="0">${L('Collapse all', '')}</button></div>`; }
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
  sc.onerror = () => fail(L('script blocked or offline', '')); box.appendChild(sc); el.appendChild(box);
  setTimeout(() => { if (!el.querySelector('iframe')) fail(L('widget did not load within 12 s', ' 12 ')); }, 12000);
}
const tvTheme = () => isDark() ? 'dark' : 'light';
const tvLocale = () => LANG === 'zh' ? 'zh_CN' : 'en';
/* ---------- real-time quote (Micron method): own quote endpoint polled every 15 s while visible; TradingView delayed widget when it is empty or failing ---------- */
const QUOTE_API = (new URLSearchParams(location.search).get('quoteapi')) || 'https://micron-dashboard.cashcache.workers.dev/api/quote?symbol=LMND';  /* shared Cloudflare Worker (Robinhood real-time, Nasdaq.com backup) */
const LQ = {timer: null, fails: 0, ok: false, last: null, tv: false, prev: null, vis: false};
const usd = v => v == null ? NA() : '$' + fmt(v, 2);
const sgn = (v, d = 2) => (v >= 0 ? '+' : '−') + fmt(Math.abs(v), d);
const mdy = d => { if (!d) return ''; const t = new Date(String(d).slice(0, 10) + 'T12:00:00Z'); return LANG === 'zh' ? `${t.getUTCMonth() + 1}${t.getUTCDate()}` : t.toLocaleDateString('en-US', {month: 'short', day: 'numeric', timeZone: 'UTC'}); };
const tET = ms => new Date(ms).toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour12: false});
const tSG = ms => new Date(ms).toLocaleTimeString('en-GB', {timeZone: 'Asia/Singapore', hour12: false});
function tvFallback(on) {
  const w = $('#tvwrap'), lq = $('#lq'); if (!w || !lq) return;
  w.style.display = on ? 'flex' : 'none'; lq.style.display = on ? 'none' : 'block';
  if (on && !LQ.tv) { LQ.tv = true; const el = $('#tvq'); const P = D.price;
    tvEmbed(el, 'single-quote', {symbol: TV_SYM, width: '100%', isTransparent: true, colorTheme: tvTheme(), locale: tvLocale()}, why => {
      el.style.height = 'auto'; el.innerHTML = `<div class="tvfail" title="${esc(why)}">${L('Live quote unavailable', '')}</div><div class="snap"><span class="snapv">$${fmt(P.close, 2)}</span><span class="snaps">${L(`Build-time snapshot · close ${esc(dlong(P.close_date))} · not live`, ` · ${esc(dlong(P.close_date))}  · `)}</span></div>`;
      const c = $('#tvqcap'); if (c) c.textContent = L('Static snapshot (not live)', ''); }); }
}
const SESS = {pre: '', premarket: '', 'pre-market': '', after: '', 'after-hours': '', post: '', overnight: '', closed: '', regular: ''};
const sz = x => { const k = String(x || '').toLowerCase(); return LANG === 'zh' ? (SESS[k] || SESS[k.replace(/[\s_]?(session|market|hours)$/, '')] || x) : x; };
function renderQuote(q) {
  const m = q.main || {}, ref = q.ref_close || {}, reg = q.session === 'regular';
  const box = $('#lq'); if (!box) return; box.classList.toggle('reg', reg); box.classList.toggle('stale', !!q.stale);
  $('#lq-sl').textContent = reg ? L('Live · regular session', ' · ') : (q.session === 'closed' ? L('Market closed', '') : L(`${q.session_label || q.session} session`, `${sz(q.session) || q.session_label}`)) + (q.session === 'overnight' ? L(' (8 PM–4 AM ET)', ' 20:00– 4:00') : '');
  const MK = {Close: '', 'Last close': '', 'Pre-market': '', 'After-hours': '', Overnight: ''};
  $('#lq-k').textContent = m.kind === 'regular' ? '' : (LANG === 'zh' ? (MK[m.label] || sz(m.kind) || m.label || '') : (m.label || ''));
  const px = $('#lq-px'); px.textContent = m.price != null ? usd(m.price) : NA();
  if (LQ.prev != null && m.price != null && m.price !== LQ.prev) { px.classList.remove('up', 'dn'); void px.offsetWidth; px.classList.add(m.price > LQ.prev ? 'up' : 'dn'); }
  LQ.prev = m.price;
  const ch = $('#lq-ch');
  if (m.change != null) { ch.className = 'lq-ch ' + (m.change >= 0 ? 'pos' : 'neg'); ch.textContent = `${sgn(m.change)} (${sgn(m.pct)}%)${reg ? '' : L(' vs close', ' ')}`; }
  else { ch.className = 'lq-ch mut'; ch.textContent = ''; }
  const pc = (reg ? q.prev_close : ref) || {};
  let sub = `${L('Prev close', '')} ${usd(pc.price)}${pc.date ? ` · ${mdy(pc.date)}` : ''}`;
  if (!reg && q.ext && m.kind === 'close') sub += ` · ${LANG === 'zh' ? (MK[q.ext.label] || sz(q.ext.label)) : q.ext.label} ${usd(q.ext.price)} (${sgn(q.ext.pct)}%)`;
  if (reg && q.bid && q.ask) sub += ` · ${L('Bid', '')} ${usd(q.bid)} / ${L('Ask', '')} ${usd(q.ask)}`;
  $('#lq-sub').textContent = sub;
  const RH = q.source === 'Robinhood public quote';
  const venue = m.kind === 'regular' ? (RH ? L('NYSE last sale via Robinhood', 'NYSE  Robinhood') : q.source) : ((q.ext && q.ext.venue) ? L(`${q.ext.venue} via Robinhood 24-hour feed`, `${q.ext.venue} Robinhood 24 `) : (RH ? L('Robinhood extended-hours feed', 'Robinhood ') : q.source));
  const fresh = q.source === 'Nasdaq.com quote API' && !/real-time/i.test(q.source_note || '') ? L('may be delayed', '') : L('real-time', '');
  $('#lq-cap').textContent = (m.time ? L(`as of ${tET(m.time)} ET (${tSG(m.time)} SGT)`, ` ${tET(m.time)} ${tSG(m.time)}`) : '') + ` · ${venue} · ${fresh}` + (q.stale ? L(' · last good update, retrying', ' · ') : L(' · refreshes every 15 s', ' ·  15 '));
  /* YTD box follows the live regular-session price */
  const Y = D.price.ytd; const rp = q.regular && q.regular.price;
  if (Y && Y.base && rp) { const p2 = (rp / Y.base - 1) * 100; const v = $('#ytd-v'); if (v) { v.className = 'v ' + pcls(p2); v.textContent = pct(p2); }
    const s1 = $('#ytd-s1'); if (s1) s1.textContent = L(`${usd(rp)} (${reg ? 'live' : 'regular close'}${q.regular.time ? ' ' + tET(q.regular.time).slice(0, 5) + ' ET' : ''}) vs ${usd(Y.base)} close ${dlong(Y.base_date)} · updated ${tET(Date.now())} ET`,
      `${usd(rp)}${reg ? '' : ''}${q.regular.time ? '  ' + tET(q.regular.time).slice(0, 5) : ''} ${dlong(Y.base_date)}  ${usd(Y.base)} ·  ${tET(Date.now())}`); }
}
async function pollQuote() {
  if (document.visibilityState === 'hidden') return;
  try {
    const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(QUOTE_API + (QUOTE_API.includes('?') ? '&' : '?') + 't=' + Date.now(), {cache: 'no-store', signal: ctl.signal}); clearTimeout(to);
    const q = await r.json(); if (!q || !q.ok || !q.main) throw new Error('bad quote');
    LQ.fails = 0; LQ.ok = true; LQ.last = q; tvFallback(false); renderQuote(q); { const e = document.getElementById('lfstat'); if (e) e.textContent = L(`Last tick $${Number((q.main || {}).price).toFixed(2)} at ${(q.main || {}).time_et || ''} · ${q.session_label || q.session || ''}`, ` $${Number((q.main || {}).price).toFixed(2)} ${String((q.main || {}).time_et || '').replace(/\s*ET$/, '')} · ${sz(q.session) || q.session_label || ''}`); }
  } catch (e) {
    LQ.fails++;
    if (!LQ.ok || LQ.fails >= 4) tvFallback(true);
    else if (LQ.last) renderQuote({...LQ.last, stale: true});
  }
}
function liveQuote() {
  LQ.tv = false; clearTimeout(LQ.timer);
  if (!QUOTE_API) { tvFallback(true); return; }  /* no endpoint yet: TradingView delayed widget */
  if (LQ.last) { tvFallback(false); renderQuote(LQ.last); }
  /* 15 s while the endpoint answers; back off to 30–60 s while it is unreachable (TradingView fallback shown meanwhile) */
  const loop = async () => { await pollQuote(); const d = LQ.fails === 0 ? 15000 : Math.min(60000, 15000 * 2 ** Math.min(LQ.fails, 2)); LQ.timer = setTimeout(loop, d); };
  loop();
  if (!LQ.vis) { LQ.vis = true; document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { clearTimeout(LQ.timer); loop(); } }); }
}
/* trim leading quarters where every series is empty */
const trimQ = cfg => { const n = cfg.labels.length; let i0 = n; cfg.datasets.forEach(d => { const j = (d.data || []).findIndex(v => v != null && !isNaN(v)); if (j >= 0 && j < i0) i0 = j; }); if (i0 < n) i0 = Math.max(i0, n - 8); /* keep at most the latest 8 quarters */
  if (i0 > 0 && i0 < n) { cfg.labels = cfg.labels.slice(i0); cfg.datasets.forEach(d => { d.data = (d.data || []).slice(i0); }); } return cfg; };
/* ---------------- hero ---------------- */
function hero() {
  const H = D.hero, P = D.price, asof = L(`${H.quarter} · as of ${H.period_end_long}`, `${H.quarter} ·  ${dlong(H.period_end)}`);
  $('#updated').innerHTML = `© 2026 Hugo Tian. All rights reserved.`;
  const ifp = ser('in-?force premium', 'kpi'), cu = ser('^customers', 'kpi'), pp = ser('premium per customer', 'kpi');
  const card = (n, label, key, v, ch, s, id) => `<div class="hcard"><div class="l">${label} ${info(key)}</div><div class="v">${v}</div><div class="ch ${pcls(ch)}">${L(pct(ch) + ' YoY', ' ' + pct(ch))}</div><div class="s">${s}</div><div class="asof">${esc(asof)}</div></div>`;
  $('#hero4').innerHTML = [
    `<div class="hcard live"><div id="lq" class="lq" aria-live="polite" style="display:none"><div class="lq-top"><span class="lq-sess"><i class="lq-dot"></i><span id="lq-sl">${L('Connecting to live quote…', '…')}</span></span><span class="lq-sym">LMND · NYSE</span></div>
       <div class="lq-row"><span class="lq-k" id="lq-k"></span><span class="lq-px" id="lq-px">—</span><span class="lq-ch" id="lq-ch"></span></div><div class="lq-sub" id="lq-sub"></div><div class="lq-cap" id="lq-cap"></div></div>
     <div id="tvwrap" class="tvwrap" style="display:none"><div class="l" style="padding:2px 4px 0"><i class="livedot"></i> ${L('Live stock price', '')} ${info(L('Live price', ''), L('Lemonade (NYSE: LMND). The real-time box (NYSE last sale via Robinhood, refreshed every 15 s) appears when the quote service answers; otherwise this free TradingView widget is shown. It updates automatically but is delayed about 15 minutes (the “D” badge).', 'LemonadeNYSE: LMNDNYSE  Robinhood 15  TradingView  15 “D”'))}</div><div class="tvq" id="tvq"></div><div class="cap" id="tvqcap" style="padding:0 4px">${L('NYSE: LMND · delayed ~15 min (“D”) · TradingView', 'NYSE: LMND ·  15 “D”· TradingView')}</div></div></div>`,
    card(2, L('In-force premium', ''), 'IFP', '$' + fmt(H.ifp / 1000, 2) + 'b', H.ifp_yoy, L(`$${fmt(H.ifp, 1)}m · ${pct(H.ifp_qoq)} QoQ · year ago $${fmt(H.ifp_prev_year, 1)}m`, `$${fmt(H.ifp, 1)}m ·  ${pct(H.ifp_qoq)} ·  $${fmt(H.ifp_prev_year, 1)}m`), 'spIfp'),
    card(3, L('Customers', ''), 'Customers', fmt(H.customers / 1e6, 2) + 'm', H.cust_yoy, L(`${fmt(H.customers)} · ${pct(H.cust_qoq)} QoQ`, `${fmt(H.customers)} ·  ${pct(H.cust_qoq)}`), 'spCu'),
    card(4, L('Premium per customer', ''), 'PPC', '$' + fmt(H.ppc), H.ppc_yoy, L(`${pct(H.ppc_qoq)} QoQ · year ago $${fmt(H.ppc_prev_year)}`, ` ${pct(H.ppc_qoq)} ·  $${fmt(H.ppc_prev_year)}`), 'spPpc')].join('');
  const Y = P.ytd; const days = d => Math.ceil((new Date(d + 'T09:00:00-04:00') - new Date()) / 864e5);
  const dd = d => { const n = days(d); return n > 1 ? L(`in ${n} days`, `${n} `) : n === 1 ? L('tomorrow', '') : n === 0 ? L('today', '') : L('reported', ''); };
  $('#hero2').innerHTML = [
    Y ? `<div class="mini" title="${L(`Year-to-date: latest price vs the ${esc(Y.base_date)} close (last trading day of 2025); follows the real-time quote when it is available`, ` ${esc(Y.base_date)} 2025 `)}"><div class="l">${L('LMND year-to-date', 'LMND ')}</div><div class="v ${pcls(Y.pct)}" id="ytd-v">${pct(Y.pct)}</div><div class="s" id="ytd-s1">${L(`$${fmt(Y.price, 2)} (${esc(dlong(Y.asof))}) vs $${fmt(Y.base, 2)} close ${esc(dlong(Y.base_date))} · as of build ${esc(D.meta.built_sgt)}`, `$${fmt(Y.price, 2)}${esc(dlong(Y.asof))} ${esc(dlong(Y.base_date))}  $${fmt(Y.base, 2)} ·  ${esc(D.meta.built_sgt.replace(' SGT', ''))}`)}</div></div>` : `<div class="mini"><div class="l">${L('LMND year-to-date', 'LMND ')}</div><div class="v na">${NA()}</div></div>`,
    `<div class="mini"><div class="l">${L('Market cap / EV', ' / ')} ${info('Price/IFP')}</div><div class="v">$${fmt(P.mcap_b, 2)}b / $${fmt(P.ev_b, 2)}b</div><div class="s">${L(`Close ${esc(dlong(P.close_date))} · 52-wk $${fmt(P.lo52, 2)}–$${fmt(P.hi52, 2)}`, `${esc(dlong(P.close_date))}  · 52  $${fmt(P.lo52, 2)}–$${fmt(P.hi52, 2)}`)}</div></div>`,
    `<div class="mini"><div class="l">${L('Next earnings (Q3 2026)', 'Q3 2026')}</div><div class="v">${D.meta.next_earnings_confirmed ? '' : '~'}${esc(dlong(D.meta.next_earnings))}</div><div class="s">${dd(D.meta.next_earnings)} · <a href="#metrics/guidance">${L('company guide', '')}</a></div></div>`,
    `<div class="mini"><div class="l">${L('Investor Day', '')}</div><div class="v">${esc(dlong(D.meta.investor_day))}</div><div class="s">${dd(D.meta.investor_day)} · ${L('New York', '')}</div></div>`].join('');
  liveQuote();
}
/* ---------------- overview ---------------- */
const KC = [['In-force premium ($m)', 'in-?force premium', 'kpi', 'IFP', v => money(v)], ['Customers', '^customers', 'kpi', 'Customers', v => fmt(v / 1e6, 2) + 'm'], ['Premium per customer', 'premium per customer', 'kpi', 'PPC', v => '$' + fmt(v)],
  ['Annual dollar retention', 'annual dollar retention', 'kpi', 'ADR', v => fmt(v) + '%', true], ['Gross loss ratio', '^gross loss ratio \\(', 'kpi', 'GLR', v => fmt(v) + '%', true, true], ['Net loss ratio', '^net loss ratio', 'kpi', 'NLR', v => fmt(v) + '%', true, true],
  ['Total revenue', '^total revenue', 'is', 'Revenue', v => money(v)], ['Gross earned premium', 'gross earned premium', 'is', 'GEP', v => money(v)], ['Adjusted EBITDA', '^adjusted ebitda', 'is', 'Adj. EBITDA', v => money(v)],
  ['Net loss', '^net loss$', 'is', 'Adj. EBITDA', v => money(v)], ['Cash & investments', '^cash & investments$', 'bs', 'Adj. FCF', v => money(v, 0)], ['Adjusted FCF', '^adjusted free cash flow', 'cf', 'Adj. FCF', v => money(v)]];
const KCZ = {'In-force premium ($m)': '', Customers: '', 'Premium per customer': '', 'Annual dollar retention': '', 'Gross loss ratio': '', 'Net loss ratio': '',
  'Total revenue': '', 'Gross earned premium': '', 'Adjusted EBITDA': ' EBITDA', 'Net loss': '', 'Cash & investments': '', 'Adjusted FCF': ''};
function kpiCards(i) {
  const g = $('#kpicards'); if (!g) return;
  g.innerHTML = KC.map(([l, pat, src, key, f, pp, inv], k) => { const s = ser(pat, src); const v = s ? s[i] : null; if (!s) return '';
    const dq = pp ? (i > 0 && s[i-1] != null && v != null ? v - s[i-1] : null) : (i > 0 && s[i-1] && v != null ? (v - s[i-1]) / Math.abs(s[i-1]) * 100 : null);
    const dy = pp ? (i > 3 && s[i-4] != null && v != null ? v - s[i-4] : null) : (i > 3 && s[i-4] && v != null ? (v - s[i-4]) / Math.abs(s[i-4]) * 100 : null);
    const show = (x, lab) => x == null ? `<span class="mut">${lab} ${NA()}</span>` : pp ? `<span class="${(inv ? -x : x) >= 0 ? 'pos' : 'neg'}">${x >= 0 ? '+' : '−'}${fmt(Math.abs(x))}pp</span> ${lab}` : `<span class="${pcls(x)}">${pct(x)}</span> ${lab}`;
    const lz = L(l, KCZ[l] || l);
    return `<div class="card kpi" title="${esc(lz)}: ${esc(Q[i])}"><div class="l">${esc(lz)} ${info(key)}</div><div class="v">${v == null ? `<span class="na">${NA()}</span>` : f(v)}</div><div class="s">${show(dq, L('QoQ', ''))} · ${show(dy, L('YoY', ''))}</div><div class="spark"><canvas id="ks${k}"></canvas></div></div>`; }).join('');
  KC.forEach(([l, pat, src], k) => { const s = ser(pat, src); if (!s) return; const c = spark('ks' + k, s.map(v => v == null ? null : (Math.abs(v) > 1e5 ? v / 1e6 : v)));
    if (c) { c.data.datasets[0].pointRadius = s.map((_, j) => j === i ? 3.5 : 0); c.data.datasets[0].pointBackgroundColor = C.acc; c.update('none'); } });
}
function wsMap() { const t = (sheet('wall street') || {tables: []}).tables[0]; const m = {}; (t ? t.rows : []).forEach(r => { if (Array.isArray(r)) m[r[0]] = r[1]; }); return m; }
function overview() {
  const N = D.narrative, H = D.hero, P = D.price, W = wsMap(), LQi = LI, s = n => ser(n);
  const lmnd = ((sheet('valuation') || {tables: [{rows: []}]}).tables[0].rows.find(r => Array.isArray(r) && r[0] === 'LMND')) || [];
  const keyRows = [
    [L('Share price / market cap / EV', ' /  / '), `$${fmt(P.close, 2)} / $${fmt(P.mcap_b, 2)}b / $${fmt(P.ev_b, 2)}b`, L(`Close ${dlong(P.close_date)}`, `${dlong(P.close_date)} `)],
    [L('In-force premium / customers / premium per customer', ' /  / '), `$${fmt(H.ifp, 1)}m / ${fmt(H.customers)} / $${fmt(H.ppc)}`, dlong(H.period_end)],
    [L(`${H.quarter} revenue / GEP / Adj. EBITDA`, `${H.quarter}  / GEP /  EBITDA`), `${money(s('^total revenue')[LQi])} / ${money(s('gross earned premium')[LQi])} / ${money(s('^adjusted ebitda')[LQi])}`, H.quarter],
    [L('Gross / net loss ratio', ' / '), `${s('^gross loss ratio \\(')[LQi]}% / ${s('^net loss ratio')[LQi]}%`, H.quarter],
    [L('Cash & investments / Synthetic Agents borrowings', ' / Synthetic Agents '), `${money(s('^cash & investments$')[LQi], 1)} / ${money(s('borrowings under')[LQi])}`, dlong(H.period_end)],
    [L('Price / IFP · TTM P/S', '/IFP · TTM '), lmnd.length ? `${lmnd[6]}x · ${lmnd[4]}x` : NA(), L(`Close ${dlong(P.close_date)}`, `${dlong(P.close_date)} `)],
    [L('Analyst rating · PT low / avg / median / high', ' ·   /  /  / '), `${tr(W['Analyst rating (11)']) || NA()} · ${W['PT low / avg / median / high'] || NA()}`, L('6–7 Oct 2026', '2026106–7')],
    [L('Short interest', ''), P.short_pct ? L(`${fmt(P.short_pct * 100, 1)}% of float · ${fmt(P.short_ratio, 1)} days to cover`, ` ${fmt(P.short_pct * 100, 1)}% ·  ${fmt(P.short_ratio, 1)} `) : NA(), L('mid-Sep 2026', '20269')],
    [L('Next earnings (Q3 2026)', 'Q3 2026'), `${D.meta.next_earnings_confirmed ? '' : '~'}${dlong(D.meta.next_earnings)}`, L('Company / market calendar', ' / ')],
    [L('Investor Day', ''), dlong(D.meta.investor_day), L('New York', '')]];
  const daysTo = w => { const m = w.match(/(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})/); if (!m) return ''; const d = new Date(`${m[2]} ${m[1]}, ${m[3]} 09:00 GMT-0500`); const n = Math.ceil((d - new Date()) / 864e5); return n > 0 ? L(`${n} days`, `${n} `) : L('passed', ''); };
  const cats = N.catalysts.map(c => `<div class="cat"><div class="when">${esc(c.when === 'Ongoing' ? L('Through 2027', ' 2027 ') : tr(c.when))}</div><div style="flex:1">${esc(LANG === 'zh' ? tr(c.what) : c.what.charAt(0).toUpperCase() + c.what.slice(1))}</div><div class="dd">${daysTo(c.when)}</div></div>`).join('');
  const ex = N.exec; const exKeys = Object.keys(ex).filter(k => k !== 'Verdict');
  const sec = h => (N.sections.find(x => new RegExp(h, 'i').test(x.h)) || {paras: [], subs: []});
  const paras = arr => arr.filter(p => !p.startsWith('©')).map(p => { p = tr(p); const m = LANG === 'zh' ? p.match(/^[•\s]*([^:]{2,40})[:]\s?(.+)$/s) : p.match(/^[•\s]*([^:]{3,70}):\s(.+)$/); return m ? `<p><b>${esc(m[1])}${L(':', '')}</b> ${esc(m[2])}</p>` : `<p>${esc(p.replace(/^•\s*/, ''))}</p>`; }).join('');
  const ph = P.hist || [];
  $('#s-overview').innerHTML = `<h2>${L('Overview', '')}</h2>
  <p class="lead">${N.verdict ? `<b>${L('Verdict.', '')}</b> ${esc(tr(N.verdict))}` : ''}</p>
  ${weekCard()}
  <div class="blk"><div class="qpick"><b>${L('KPI cards for quarter', 'KPI ')}</b> <button class="ib" id="qprev" aria-label="${L('Previous quarter', '')}">‹</button><select id="qsel" aria-label="${L('Pick quarter', '')}">${Q.map((q, i) => `<option value="${i}" ${i === LI ? 'selected' : ''}>${esc(q)} (${L('ended', '')} ${esc(dlong(D.meta.period_end[i]))})</option>`).join('')}</select><button class="ib" id="qnext" aria-label="${L('Next quarter', '')}">›</button><span class="mut" style="font-size:12px">${L(`The cards at the top always show the latest quarter (${esc(H.quarter)}).`, `${esc(H.quarter)}`)}</span></div>
    <div class="grid g4" id="kpicards"></div></div>
  <div class="grid g2" style="margin-bottom:16px">
    <div class="card"><h3>${L('Key numbers (with dates)', '')}</h3>${tableBlock({columns: [L('Metric', ''), L('Value', ''), L('As of', '')], rows: keyRows}, {id: 'tKey', csvname: 'Key numbers', terms: true, wrap: true, cls: 'keyt'})}</div>
    <div class="card"><h3>${L('Catalysts & dates', '')}</h3>${cats}<ul class="notes"><li>${L('Q3 2026 company guide', 'Q3 2026 ')}: ${esc(LANG === 'zh' ? tr((sheet('guidance') || {tables: [{notes: []}]}).tables[0].notes[0] || '').replace(/^[^]*\s*/, '') : ((sheet('guidance') || {tables: [{notes: []}]}).tables[0].notes[0] || '').replace(/^Q3 2026 guide \(Q2'26 letter\):\s*/, ''))}</li></ul></div></div>
  <div class="grid g3" style="margin-bottom:16px">${exKeys.map(k => `<div class="card"><h3>${esc(tr(k))}</h3><div style="font-size:13.5px;line-height:1.55">${esc(tr(ex[k]))}</div></div>`).join('')}</div>
  <div style="margin-bottom:16px">
    <div class="card"><h3 style="margin-top:0">${L('LMND live chart', 'LMND ')} <span class="mut" style="font-size:12px;font-weight:400">${TV_SYM} · TradingView · ${L('delayed', '')}</span></h3><div class="tvchart" id="tvchart"></div></div></div>
  <div class="xscope">${xallBtns()}
  ${details(L('Business overview', ''), paras(sec('business').paras), L('model, Giveback, reinsurance, growth financing', 'Giveback'))}
  ${details(L('Latest quarter, guidance & path to profit', ''), paras([...sec('latest quarter').paras, ...sec('latest quarter').subs.flatMap(x => x.paras)]), H.quarter)}
  ${details(L('Competitive position & moat', ''), paras(sec('competitive').paras), L('vs incumbents and insurtech peers', ''))}
  ${details(L('Recent news & sentiment', ''), paras(sec('news').paras), L('last ~3 months, X/social', ' 3 X/'))}
  ${details(L('Conclusion & what to monitor', ''), paras(N.conclusion), L('8 monitoring items', '8 '))}</div>`;
  const sel = $('#qsel'); const set = i => { i = Math.max(0, Math.min(LI, i)); sel.value = i; kpiCards(i); };
  sel.onchange = () => set(+sel.value); $('#qprev').onclick = () => set(+sel.value - 1); $('#qnext').onclick = () => set(+sel.value + 1);
  kpiCards(LI);
  tvEmbed($('#tvchart'), 'advanced-chart', {autosize: true, symbol: TV_SYM, interval: 'D', range: '12M', timezone: 'Asia/Singapore', theme: tvTheme(), style: '1', locale: tvLocale(),
    backgroundColor: isDark() ? 'rgba(28,28,30,1)' : 'rgba(255,255,255,1)', gridColor: isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.035)', allow_symbol_change: false, hide_side_toolbar: true, calendar: false, support_host: 'https://www.tradingview.com'},
    why => { $('#tvchart').innerHTML = `<div class="tvfail">${L(`Live chart unavailable (${esc(why)}).`, `${esc(why)}`)}</div><div class="mut" style="font-size:12px">${L(`Build-time snapshot: close $${fmt(D.price.close, 2)} on ${esc(dlong(D.price.close_date))} · not live`, `${esc(dlong(D.price.close_date))}  $${fmt(D.price.close, 2)} · `)}</div>`; $('#tvchart').style.height = 'auto'; });
}
/* ---------------- Insurance KPIs ---------------- */
const QL = Q.map(qshort);
function kpis() {
  const t = sheet('insurance kpi'); const k = n => ser(n, 'kpi'), i = n => ser(n, 'is');
  $('#s-kpis').innerHTML = `<h2>${L('Insurance KPIs', ' KPI')} <span class="mut">${esc(Q[0])} – ${esc(Q[LI])}</span></h2>
  ${charts2([{id: 'kIfp', title: L('In-force premium vs revenue vs GEP ($m)', ' GEP'), tip: 'IFP', growth: 1, reins: 1}, {id: 'kCu', title: L('Customers (m) & premium per customer ($)', ''), tip: 'PPC', growth: 1},
    {id: 'kLr', title: L('Loss ratios (%)', '%'), tip: 'GLR'}, {id: 'kRe', title: L('Reinsurance effect: ceded vs net earned premium ($m)', ''), tip: 'Quota share', reins: 1},
    {id: 'kMix', title: L('IFP by product / geography ($m)', ' /  IFP'), tip: 'IFP', growth: 1}, {id: 'kGlrP', title: L('Gross loss ratio by product (%)', '%'), tip: 'GLR'},
    {id: 'kAdr', title: L('Annual dollar retention (%)', '%'), tip: 'ADR'}])}
  ${lrBlock()}
  ${cohortBlock()}
  ${tableBlock({title: L('Insurance KPIs — 8 quarters', ' KPI — 8 '), columns: t.tables[0].columns, rows: t.tables[0].rows, notes: t.tables[0].notes}, {id: 'tKpi', colorLatest: 1, pre: t.pre})}`;
  wireCard({id: 'kIfp', reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Total revenue', ''), data: i('^total revenue'), backgroundColor: C.acc, yAxisID: 'y', order: 2},
    {type: 'bar', label: L('Gross earned premium', ''), data: i('gross earned premium'), backgroundColor: C.acc2, yAxisID: 'y', order: 3}, {type: 'line', label: L('In-force premium (annualised)', ''), data: k('in-?force premium'), borderColor: C.g, yAxisID: 'y1', order: 1}],
    scales: {y: {title: {display: true, text: L('Quarterly $m', '')}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: L('IFP $m', 'IFP')}}}})});
  wireCard({id: 'kCu', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Customers (m)', ''), data: k('^customers').map(v => v / 1e6), backgroundColor: C.acc, yAxisID: 'y', unit: 'm'},
    {type: 'line', label: L('Premium per customer ($)', ''), data: k('premium per customer'), borderColor: C.g, yAxisID: 'y1', unit: '$'}], scales: {y: {title: {display: true, text: L('Customers (m)', '')}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: '$'}}}})});
  wireCard({id: 'kLr', unit: '%', build: () => ({type: 'line', labels: QL, datasets: [['^gross loss ratio \\(', L('Gross loss ratio', ''), C.acc], ['^net loss ratio', L('Net loss ratio', ''), C.g], ['ttm gross', L('TTM gross loss ratio', 'TTM '), C.b], ['ex-cat', L('GLR ex-CAT', ' GLR'), C.y], ['attritional', L('Attritional GLR', ' GLR'), C.p]].map(([p, l, c]) => ({label: l, data: k(p), borderColor: c, spanGaps: true})), scales: {y: {ticks: {callback: v => v + '%'}}}})});
  wireCard({id: 'kRe', reins: 1, unit: '$m', build: () => { const ce = i('ceded earned'), ne = i('net earned'), ge = i('gross earned premium');
    return {labels: QL, stacked: true, datasets: [{type: 'bar', label: L('Net earned premium (kept)', ''), data: ne, backgroundColor: C.acc, stack: 's'}, {type: 'bar', label: L('Ceded earned premium (to reinsurers)', ''), data: ce, backgroundColor: C.r, stack: 's'},
      {type: 'line', label: L('Ceded share of GEP (%)', ' GEP %'), data: ce.map((v, j) => +(v / ge[j] * 100).toFixed(1)), borderColor: C.g, yAxisID: 'y1', unit: '%', keep: true}],
      scales: {y: {stacked: true}, y1: {position: 'right', min: 0, max: 100, grid: {drawOnChartArea: false}, ticks: {callback: v => v + '%'}}}}; }});
  wireCard({id: 'kMix', unit: '$m', build: () => trimQ({labels: QL, stacked: true, datasets: [['homeowners', L('Homeowners MPL', ''), C.acc], ['^pet$', L('Pet', ''), C.acc2], ['^car$', L('Car', ''), C.g], ['europe \\(', L('Europe', ''), C.b], ['^other$', L('Other', ''), C.r]].map(([p, l, c]) => ({type: 'bar', label: l, data: k(p), backgroundColor: c}))})});
  wireCard({id: 'kGlrP', unit: '%', build: () => trimQ({type: 'line', labels: QL, datasets: [['homeowners mpl glr', L('Homeowners', ''), C.acc], ['pet glr', L('Pet', ''), C.p], ['car glr', L('Car', ''), C.g], ['europe glr', L('Europe', ''), C.b]].map(([p, l, c]) => ({label: l, data: k(p), borderColor: c, spanGaps: true})), scales: {y: {ticks: {callback: v => v + '%'}}}})});
  lrWire(); cohortWire();
  wireCard({id: 'kAdr', unit: '%', build: () => ({type: 'line', labels: QL, datasets: [{label: L('Annual dollar retention', ''), data: k('annual dollar retention'), borderColor: C.acc, fill: false}], scales: {y: {min: 70, max: 100, ticks: {callback: v => v + '%'}}}})});
}
/* ---------------- statements ---------------- */
function stmt(key, sid, title, specs) {
  const sh = sheet('^' + key.toUpperCase() + '\\b'); const t = sh.tables[0];
  $('#s-' + sid).innerHTML = `<h2 class="bh">${title} <span class="mut">${L(`8 quarters, ${esc(Q[0])} – ${esc(Q[LI])} ($m)`, `8 ${esc(Q[0])} – ${esc(Q[LI])}`)}</span></h2>${charts2(specs)}
   ${tableBlock({title: L(`${title} — 8 quarters`, `${title} — 8 `), columns: t.columns, rows: t.rows, notes: t.notes}, {id: 't' + sid, colorLatest: 1, pre: sh.pre})}`;
  specs.forEach(wireCard);
}
function isTab() { const i = n => ser(n, 'is');
  stmt('is', 'is', L('Income Statement', ''), [
    {id: 'iRev', title: L('Revenue, GEP & net earned premium ($m)', 'GEP '), tip: 'Revenue', growth: 1, reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Gross earned premium', ''), data: i('gross earned premium'), backgroundColor: C.acc2}, {type: 'bar', label: L('Total revenue', ''), data: i('^total revenue'), backgroundColor: C.acc}, {type: 'line', label: L('Net earned premium', ''), data: i('net earned'), borderColor: C.g}]})},
    {id: 'iPl', title: L('Gross profit, Adj. EBITDA & net loss ($m)', ' EBITDA '), tip: 'Adj. EBITDA', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Gross profit', ''), data: i('^gross profit'), backgroundColor: C.acc}, {type: 'bar', label: L('Adjusted EBITDA', ' EBITDA'), data: i('^adjusted ebitda'), backgroundColor: C.g}, {type: 'bar', label: L('Net loss', ''), data: i('^net loss'), backgroundColor: C.r}]})},
    {id: 'iOpx', title: L('Operating expenses ex net loss & LAE ($m)', ' LAE '), tip: 'Growth spend', growth: 1, unit: '$m', build: () => ({labels: QL, stacked: true, datasets: [['^sales', L('Sales & marketing', ''), C.acc], ['technology', L('Technology development', ''), C.g], ['general', L('General & administrative', ''), C.b], ['other insurance', L('Other insurance expense', ''), C.r]].map(([p, l, c]) => ({type: 'bar', label: l, data: i(p), backgroundColor: c}))})},
    {id: 'iSbc', title: L('Stock-based compensation ($m) & GAAP EPS ($)', ' GAAP EPS'), unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Stock-based compensation ($m)', ''), data: i('stock-based'), backgroundColor: C.acc}, {type: 'line', label: L('GAAP EPS ($)', 'GAAP EPS'), data: i('gaap eps'), borderColor: C.g, yAxisID: 'y1', unit: '$/sh'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})}]); }
function bsTab() { const b = n => ser(n, 'bs');
  stmt('bs', 'bs', L('Balance Sheet', ''), [
    {id: 'bCash', title: L('Cash & investments ($m)', ''), growth: 1, unit: '$m', build: () => ({labels: QL, stacked: true, datasets: [{type: 'bar', label: L('Cash, equivalents & restricted', ''), data: b('^cash, cash'), backgroundColor: C.acc}, {type: 'bar', label: L('Investments', ''), data: b('^investments'), backgroundColor: C.acc2}]})},
    {id: 'bAle', title: L('Total assets, liabilities & equity ($m)', ''), growth: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Total assets', ''), data: b('total assets'), backgroundColor: C.acc2}, {type: 'bar', label: L('Total liabilities', ''), data: b('total liabilities'), backgroundColor: C.r}, {type: 'line', label: L("Stockholders' equity", ''), data: b('equity'), borderColor: C.acc}]})},
    {id: 'bRe', title: L('Reinsurance balances & unearned premium ($m)', ''), tip: 'Quota share', reins: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'line', label: L('Unearned premium', ''), data: b('unearned'), borderColor: C.acc}, {type: 'line', label: L('Prepaid reinsurance premium', ''), data: b('prepaid'), borderColor: C.g}, {type: 'line', label: L('Reinsurance recoverable', ''), data: b('recoverable'), borderColor: C.b}, {type: 'line', label: L('Unpaid loss & LAE', ' LAE'), data: b('unpaid'), borderColor: C.r}]})},
    {id: 'bFin', title: L('Synthetic Agents borrowings ($m) & shares outstanding (m)', 'Synthetic Agents '), tip: 'Synthetic Agents', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Borrowings under financing', ''), data: b('borrowings'), backgroundColor: C.acc}, {type: 'line', label: L('Shares outstanding (m)', ''), data: b('shares outstanding'), borderColor: C.g, yAxisID: 'y1', unit: 'm'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})}]); }
function cfTab() { const c = n => ser(n, 'cf');
  stmt('cf', 'cf', L('Cash Flow Statement', ''), [
    {id: 'cFcf', title: L('Operating cash flow, capex & free cash flow ($m)', ''), tip: 'Adj. FCF', unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Cash from operations', ''), data: c('operating activities'), backgroundColor: C.acc}, {type: 'bar', label: L('Capex', ''), data: c('capital expend').map(v => -v), backgroundColor: C.r}, {type: 'line', label: L('Free cash flow', ''), data: c('^free cash flow'), borderColor: C.g}, {type: 'line', label: L('Adjusted FCF', ''), data: c('^adjusted free'), borderColor: C.b}]})},
    {id: 'cGs', title: L('Growth spend vs Synthetic Agents balance ($m)', ' Synthetic Agents '), tip: 'Synthetic Agents', growth: 1, unit: '$m', build: () => ({labels: QL, datasets: [{type: 'bar', label: L('Growth spend (quarter)', ''), data: c('growth spend'), backgroundColor: C.acc}, {type: 'line', label: L('Synthetic Agents balance (EOP)', 'Synthetic Agents '), data: c('synthetic'), borderColor: C.g, yAxisID: 'y1'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})},
    {id: 'cCi', title: L('Cash & investments, end of period ($m)', ''), growth: 1, unit: '$m', build: () => ({type: 'line', labels: QL, datasets: [{label: L('Cash & investments', ''), data: c('cash & investments'), borderColor: C.acc, fill: true, backgroundColor: C.acc3}]})}]);
  $('#s-cf').insertAdjacentHTML('afterbegin', `<div class="sblk" id="blk-runway" style="margin-bottom:18px">${runwayBlock()}</div>`); runwayWire(); wireTables($('#blk-runway')); }

/* ---------------- Guidance vs actual ---------------- */
function guidance() {
  const sh = sheet('guidance'); const t = sh.tables[0]; const rows = t.rows.filter(Array.isArray); const col = n => t.columns.findIndex(c => new RegExp(n, 'i').test(c));
  const g = n => rows.map(r => typeof r[col(n)] === 'number' ? r[col(n)] : null); const lab = rows.map(r => r[0]);
  $('#blk-guidance').innerHTML = `<p class="lead sm">${esc(tr(t.notes[0] || ''))}</p>
   ${charts2([{id: 'gIfp', title: L('IFP: guidance range vs actual ($m)', 'IFP'), tip: 'IFP'}, {id: 'gRev', title: L('Revenue: guidance midpoint vs actual ($m)', ''), tip: 'Revenue', reins: 1}, {id: 'gEb', title: L('Adj. EBITDA: guidance midpoint vs actual ($m)', ' EBITDA'), tip: 'Adj. EBITDA'}, {id: 'gGep', title: L('GEP: guidance midpoint vs actual ($m)', 'GEP'), tip: 'GEP'}])}
   ${tableBlock({title: L('Quarter by quarter', ''), columns: t.columns, rows: t.rows, notes: t.notes.slice(1)}, {id: 'tGva', pre: sh.pre})}`;
  const range = (lo, hi, act, l1) => ({labels: lab, datasets: [{type: 'bar', label: L('Guidance range', ''), data: g(lo).map((v, i) => v == null ? null : [v, g(hi)[i]]), backgroundColor: C.band, barPercentage: .5, keep: 1},
      {type: 'line', label: L('Actual', ''), data: g(act), borderColor: C.acc, showLine: false, pointRadius: 6, pointHoverRadius: 8, pointStyle: 'rectRot', keep: 1}]});
  const mid = (gm, act) => ({labels: lab, datasets: [{type: 'bar', label: L('Guidance midpoint', ''), data: g(gm), backgroundColor: C.band}, {type: 'bar', label: L('Actual', ''), data: g(act), backgroundColor: C.acc}]});
  wireCard({id: 'gIfp', unit: '$m', build: () => { const r = range('ifp guide low', 'ifp guide high', 'ifp actual'); r.scales = {y: {beginAtZero: false}}; return r; }});
  wireCard({id: 'gRev', unit: '$m', reins: 1, build: () => mid('rev guide mid', 'rev actual')});
  wireCard({id: 'gEb', unit: '$m', build: () => mid('ebitda guide mid', 'ebitda actual')});
  wireCard({id: 'gGep', unit: '$m', build: () => mid('gep guide mid', 'gep actual')});
  charts.gIfp.options.plugins.tooltip.callbacks.label = c => Array.isArray(c.raw) ? `${L('Guide', '')}: $${fmt(c.raw[0])}–$${fmt(c.raw[1])}m` : `${L('Actual', '')}: ${money(c.raw)}`; charts.gIfp.update('none');
}
/* ---------------- Wall Street ---------------- */
function street() {
  const sh = sheet('wall street'); const W = wsMap(); const P = D.price;
  const pts = String(W['PT low / avg / median / high'] || '').match(/[\d.]+/g) || [];
  $('#blk-street').innerHTML = `
   <div class="grid g4" style="margin-bottom:16px">${Object.entries(W).map(([k, v]) => `<div class="card kpi"><div class="l">${esc(tr(k))}</div><div class="v" style="font-size:20px">${esc(tr(v))}</div></div>`).join('')}</div>
   ${charts2([{id: 'wPt', title: L('Analyst price targets vs last close ($)', '')}, {id: 'wHist', title: L('LMND close vs average price target ($)', 'LMND ')}])}
   ${sh.tables.map((t, i) => i === 0 ? details(esc(tr(t.title) || L('Consensus table', '')), tableBlock(t, {id: 'tWs' + i, notitle: 1}), L('same figures as the cards above, as a table', '')) : tableBlock(t, {id: 'tWs' + i})).join('')}`;
  const labels = [L('PT low', ''), L('PT median', ''), L('PT average', ''), L('PT high', ''), L(`Close ${dlong(P.close_date)}`, `${dlong(P.close_date)} `)];
  const vals = [+pts[0], +pts[2], +pts[1], +pts[3], P.close];
  wireCard({id: 'wPt', unit: '$', build: () => ({labels, datasets: [{type: 'bar', label: L('Price ($)', ''), data: vals, backgroundColor: vals.map((v, i) => i === 4 ? C.acc : C.band), keep: 1}], scales: {y: {beginAtZero: true, ticks: {callback: v => '$' + v}}}})});
  const ph = P.hist || [];
  wireCard({id: 'wHist', unit: '$', build: () => ({type: 'line', labels: ph.map(x => x[0]), datasets: [{label: L('LMND close', 'LMND '), data: ph.map(x => x[1]), borderColor: C.acc, pointRadius: 0, keep: 1}, {label: L('Average PT', ''), data: ph.map(() => +pts[1]), borderColor: C.g, borderDash: [5, 4], pointRadius: 0, keep: 1}, {label: L('PT low', ''), data: ph.map(() => +pts[0]), borderColor: C.r, borderDash: [2, 3], pointRadius: 0, keep: 1}, {label: L('PT high', ''), data: ph.map(() => +pts[3]), borderColor: C.b, borderDash: [2, 3], pointRadius: 0, keep: 1}], scales: {x: {ticks: {maxTicksLimit: 6, maxRotation: 0}}, y: {ticks: {callback: v => '$' + v}}}})});
}
/* ---------------- Insiders ---------------- */
const CODES = {S: 'Sale', M: 'Option exercise / RSU conversion', A: 'Grant / award', H: 'Holding (no transaction)', G: 'Gift', F: 'Tax withholding', P: 'Purchase'};
const CODESZ = {S: '', M: ' / RSU ', A: ' / ', H: '', G: '', F: '', P: ''};
const codeL = c => L(CODES[c] || c, CODESZ[c] || c);
const F4L = {planned: ['10b5-1 sale', '10b5-1 '], tax: ['Tax sale', ''], nonplan: ['Non-plan sale', '']};
const f4lab = r => { const k = f4kind(r); return k === 'other' ? codeL(r.code) : L(...F4L[k]); };
function f4rows(name) { const sur = name.split(' ').pop().toUpperCase(); return D.form4.filter(r => (r.insider || '').toUpperCase().includes(sur)); }
const f4kind = r => r.code !== 'S' ? 'other' : r.tax ? 'tax' : r.plan ? 'planned' : 'nonplan';
const f4pill = r => `<span class="pill ${f4kind(r)}">${esc(f4lab(r))}</span>`;
function f4table(rows, id) {
  return tableBlock({columns: [L('Date', ''), L('Insider', ''), L('Code', ''), L('Type', ''), L('Shares', ''), L('Price ($)', ''), L('Owned after', ''), L('D/I', '/'), L('Security', ''), L('Footnote', '')], rows: rows.map(r => [r.tdate, r.insider, r.code, f4lab(r), r.shares, r.price, r.owned_after, r.di, r.security, r.footnotes || r.nature || ''])}, {id, terms: false, maxh: 520});
}
/* ---------------- Board of Directors + executive officers (board.js from build_board.py: 2026 proxy + 8-Ks, holdings from latest Form 3/4/5) ---------------- */
const BROLE = {co_ceo_chair: ['Co-founder, CEO & Chairman', ''], co_pres: ['Co-founder, President & Director', ''],
  lead_ind: ['Lead independent director', ''], ind: ['Independent director', ''], cfo: ['Chief Financial Officer & Treasurer', ''],
  coo: ['Chief Operating Officer', ''], cio: ['Chief Insurance Officer', ''], cbo: ['Chief Business Officer', '']};
const bent = s => String(s || '').replace(/^(directly\s+)?held\s+(by|through)\s+/i, '');
const BCOM = {a: ['Audit', ''], c: ['Compensation', ''], n: ['Nominating & Governance', '']};
function boardBlock() {
  const B = window.LMND_BOARD; if (!B) return '';
  const role = p => esc(L(...(BROLE[p.role] || [p.role, p.role])));
  const hold = p => { const h = p.holding; if (!h) return `<span class="na">${NA()}</span>`;
    const ln = h.lines.map(l => `<div class="bl">${esc(l.di === 'D' ? L('Direct', '') : L(`Indirect: ${bent(l.nature)}`, `${bent(l.nature)}`))} <b>${fmt(l.shares)}</b></div>`).join('');
    return `<div class="bt">${fmt(h.total)}</div>${h.lines.length > 1 ? ln : `<div class="bl">${esc(h.lines.length && h.lines[0].di !== 'D' ? L('Indirect', '') : L('Direct', ''))}</div>`}`; };
  const asof = p => { const h = p.holding; if (!h) return `<span class="na">${NA()}</span>`;
    const fs = [...new Map(h.lines.map(l => [l.url, l])).values()];
    return fs.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(L('Form ' + l.form, ' ' + l.form))}</a> <span class="mut">${esc(l.date)}</span>`).join('<br>'); };
  const prox = p => p.proxy_shares ? fmt(p.proxy_shares) : '—';
  const notes = p => (p.notes || []).length ? `<div class="bnote">${p.notes.map(n => esc(L(...n))).join('<br>')}</div>` : '';
  const coms = p => { const e = Object.entries(p.com || {}); return e.length ? e.map(([k, v]) => `<span class="pill ${v === 'chair' ? 'acc' : 'other'}">${esc(L(BCOM[k][0] + (v === 'chair' ? ' · Chair' : ''), BCOM[k][1] + (v === 'chair' ? '' : '')))}</span>`).join(' ') : '<span class="mut">—</span>'; };
  const thH = L('Shares held (latest Form 3/4/5)', ' 3/4/5'), thA = L('Filing', ''), thP = L(`Proxy, ${B.proxy.record}`, `${B.proxy.record}`);
  const dir = B.directors.map(p => `<tr><td><b>${esc(p.name)}</b><div class="bl">${role(p)}</div>${notes(p)}</td><td class="wrap">${coms(p)}</td><td class="nw">${p.since}</td><td class="nw">${esc(L(`Class ${p.cls} · ${p.term}`, `${({I: '', II: '', III: ''})[p.cls] || p.cls} · ${p.term} `))}</td><td>${hold(p)}</td><td class="dt">${asof(p)}</td><td class="nw">${prox(p)}</td></tr>`).join('');
  const ex = B.execs.map(p => `<tr><td><b>${esc(p.name)}</b>${notes(p)}</td><td class="wrap">${role(p)}</td><td class="nw">${p.since}</td><td>${hold(p)}</td><td class="dt">${asof(p)}</td><td>${prox(p)}</td></tr>`).join('');
  const nd = B.directors.length, ni = B.directors.filter(p => p.ind).length;
  return `<div id="board"><h3>${L('Board of Directors', '')} <span class="mut">${L(`${nd} directors, ${ni} independent · staggered three-year terms`, `${nd}  ${ni}  · `)}</span></h3>
   <div class="tblwrap btab"><table><thead><tr><th>${L('Director', '')}</th><th>${L('Committees', '')}</th><th>${L('Director since', '')}</th><th>${L('Class · term ends', ' · ')}</th><th>${thH}</th><th>${thA}</th><th>${thP}</th></tr></thead><tbody>${dir}</tbody></table></div>
   <h4 class="bh4">${L('Executive officers (not on the board)', '')}</h4>
   <div class="tblwrap btab"><table><thead><tr><th>${L('Officer', '')}</th><th>${L('Title', '')}</th><th>${L('In role since', '')}</th><th>${thH}</th><th>${thA}</th><th>${thP}</th></tr></thead><tbody>${ex}</tbody></table></div>
   ${fnote([
     L('Roles, committees, class and director-since years: 2026 proxy statement (DEF 14A) and later 8-Ks; names as filed.', '2026 DEF 14A 8-K'),
     L('Shares held: common stock owned after the latest transaction in each person’s most recent Form 3/4/5 on EDGAR, direct plus each indirect holding line (the entity is named). Options are not included; Lemonade reports RSU awards as common stock on Form 4, so unvested RSUs can be included. Indirect lines not reported again within 2 years are treated as stale.', ' EDGAR  3/4/5 Lemonade  4  RSU  RSU'),
     L(`Proxy column: beneficial ownership as of the record date ${B.proxy.record}, which also counts options and RSUs vesting within 60 days; “—” means none.`, ` ${B.proxy.record}  60  RSU“—”`),
     L('Committees: Audit, Compensation, Nominating & Corporate Governance; the chair is highlighted.', ''),
     ...B.sources.map(([t, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(L(t, BSRCZ[t] || t))}</a>`),
     L(`Holdings rebuilt from EDGAR on ${B.built_sgt}.`, ` ${B.built_sgt.replace('SGT', '')}  EDGAR `)], L('Board data: notes & sources', ''), true)}</div>`;
}
const BSRCZ = {
 'DEF 14A proxy statement (filed 2026-04-22; ownership as of record date 2026-04-09)': 'DEF 14A 2026-04-22  2026-04-09',
 '8-K Item 5.07, 2026 annual meeting results (Eisenberg and Schwartz re-elected, Class III to 2029; filed 2026-06-05)': '8-K  5.07 2026 Eisenberg  Schwartz  2029 2026-06-05 ',
 '8-K Item 5.02, Tim Bixby to move from CFO to the Board (Class III) on 1 Jan 2027; Nick Stead named CFO (filed 2026-07-29)': '8-K  5.02 Tim Bixby  2027  1  1 Nick Stead 2026-07-29 ',
 '8-K Item 5.02, Prashant Ratanchandani appointed (Class II; filed 2025-10-15)': '8-K  5.02  Prashant Ratanchandani 2025-10-15 ',
 '8-K Item 5.02, Geoff Seeley appointed (Class I; filed 2025-10-06)': '8-K  5.02  Geoff Seeley 2025-10-06 '};
function insiders() {
  const sh = sheet('ownership|form ?4'); const inst = sh.tables.find(t => /institution/i.test(t.title || '')) || sh.tables[0]; const sum = sh.tables.find(t => /insider/i.test(t.title || '')) || sh.tables[1];
  const sr = sum.rows.filter(Array.isArray); const ci = n => sum.columns.findIndex(c => new RegExp(n, 'i').test(c));
  $('#s-insiders').innerHTML = `<h2>${L('Insiders & ownership', '')} <span class="mut">Form 4</span></h2>
   ${fnote(sh.pre, L('About this data', ''))}
   ${boardBlock()}
   ${isellBlock()}
   ${charts2([{id: 'nSold', title: L('Shares sold by insider and type', ''), tip: '10b5-1'}, {id: 'nInst', title: L('Top institutional holders (% of shares)', ' %')}])}
   ${tableBlock(sum, {id: 'tIns', expand: r => { const rs = f4rows(r[0]); return rs.length ? `<div style="font-size:12.5px;margin-bottom:6px"><b>${L(`${rs.length} Form 4 lines for ${esc(r[0])}`, `${esc(r[0])}  ${rs.length}  Form 4 `)}</b> · ${L('click the row again to collapse', '')}</div>` + `<div class="tblwrap" style="max-height:320px"><table class="inner"><thead><tr><th>${L('Date', '')}</th><th>${L('Code', '')}</th><th>${L('Type', '')}</th><th>${L('Shares', '')}</th><th>${L('Price', '')}</th><th>${L('Owned after', '')}</th><th>${L('Footnote', '')}</th></tr></thead><tbody>${rs.map(x => `<tr><td>${esc(x.tdate)}</td><td>${esc(x.code)}</td><td>${f4pill(x)}</td><td>${fmt(x.shares)}</td><td>${x.price ? '$' + fmt(x.price, 2) : ''}</td><td>${fmt(x.owned_after)}</td><td class="wrap">${esc(tr(x.footnotes || x.nature || '')).replace(/\n/g, '<br>')}</td></tr>`).join('')}</tbody></table></div>` : `<span class="mut">${L('No parsed Form 4 lines in the window.', ' Form 4 ')}</span>`; }, notes: [L('Click an insider row to expand their individual Form 4 transactions.', ' Form 4 ')]})}
   ${details(esc(tr(inst.title) || L('Top institutional holders', '')), tableBlock(inst, {id: 'tInst', notitle: 1}), L('table', ''))}
   <h3>${L(`All Form 4 transactions (${D.form4.length} lines)`, ` Form 4 ${D.form4.length} `)}</h3>
   <div class="chips" id="f4chips">${[['all', 'All', ''], ['sales', 'Sales', ''], ...['planned', 'nonplan', 'tax'].map(k => [k, ...F4L[k]]), ...['A', 'M', 'G'].map(c => [c, CODES[c], CODESZ[c]])].map(([k, en, zh], i) => `<button class="btn ${i === 0 ? 'on' : ''}" data-f="${esc(k)}">${esc(L(en, zh))}</button>`).join('')}</div>
   ${f4table(D.form4, 'tF4')}
   ${fnote([L(`Codes: ${Object.entries(CODES).map(([k, v]) => `<b>${k}</b> ${esc(v)}`).join(' · ')}. 10b5-1 = plan checkbox or footnote; tax sale = shares sold to cover RSU tax withholding.`, `${Object.keys(CODES).map(k => `<b>${k}</b> ${esc(CODESZ[k])}`).join(' · ')}10b5-1 =  =  RSU `)], L('Form 4 codes', 'Form 4 '), true)}`;
  wireCard({id: 'nSold', build: () => ({labels: sr.map(r => r[0].split(' ').pop()), stacked: true, datasets: [{type: 'bar', label: L('10b5-1 plan', '10b5-1 '), data: sr.map(r => r[ci('10b5-1')]), backgroundColor: C.acc}, {type: 'bar', label: L('Non-plan (ex tax)', ''), data: sr.map(r => (r[ci('non-plan')] || 0) - (r[ci('tax')] || 0)), backgroundColor: C.y}, {type: 'bar', label: L('Tax withholding', ''), data: sr.map(r => r[ci('tax')]), backgroundColor: C.p}], scales: {x: {stacked: true}, y: {stacked: true}}}), unit: 'sh'});
  isellWire();
  const ir = inst.rows.filter(Array.isArray);
  wireCard({id: 'nInst', unit: '%', build: () => ({labels: ir.map(r => r[0]), datasets: [{type: 'bar', label: L('% held', ' %'), data: ir.map(r => r[1]), backgroundColor: C.acc}]})});
  const saleLabs = ['planned', 'nonplan', 'tax'].map(k => L(...F4L[k]));
  const chipLab = f => F4L[f] ? L(...F4L[f]) : codeL(f);
  $$('#f4chips button').forEach(b => b.onclick = () => { $$('#f4chips button').forEach(x => x.classList.toggle('on', x === b)); const f = b.dataset.f; const tb = $('#tF4');
    [...tb.tBodies[0].rows].forEach(r => { const ty = r.cells[3].textContent; r.hidden = !(f === 'all' || (f === 'sales' ? saleLabs.includes(ty) : ty === chipLab(f))); });
    const v = [...tb.tBodies[0].rows].filter(r => !r.hidden).length; $('#tF4-n').textContent = rowsTxt(v, tb.tBodies[0].rows.length); });
}
/* ---------------- Valuation & peers ---------------- */
function valuation() {
  const sh = sheet('valuation'); const t = sh.tables[0]; const rows = t.rows.filter(Array.isArray); const ci = n => t.columns.findIndex(c => new RegExp(n, 'i').test(c));
  const N = D.narrative;
  $('#blk-valuation').innerHTML = `
   ${charts2([{id: 'vPs', title: L('P/S (TTM) and Price / IFP (x)', 'TTM/IFP'), tip: 'Price/IFP'}, {id: 'vMc', title: L('Market cap vs EV ($b)', '')}])}
   ${tableBlock({title: sh.title, columns: t.columns, rows: t.rows, notes: t.notes}, {id: 'tVal', terms: false})}
   <div class="card" style="margin-top:16px"><h3>${L('Valuation view', '')}</h3>${N.valuation.map(p => `<p style="font-size:13.5px">${esc(tr(p))}</p>`).join('')}</div>`;
  const lab = rows.map(r => r[0]); const n = (r, i) => typeof r[i] === 'number' ? r[i] : null;
  wireCard({id: 'vPs', unit: 'x', build: () => ({labels: lab, datasets: [{type: 'bar', label: L('P/S (TTM)', 'TTM'), data: rows.map(r => n(r, ci('p/s'))), backgroundColor: lab.map(l => l === 'LMND' ? C.acc : C.acc2)}, {type: 'bar', label: L('Price / IFP', '/IFP'), data: rows.map(r => n(r, ci('price/ifp'))), backgroundColor: C.g}]})});
  wireCard({id: 'vMc', unit: '$b', build: () => ({labels: lab, datasets: [{type: 'bar', label: L('Market cap ($b)', ''), data: rows.map(r => n(r, ci('mkt cap'))), backgroundColor: C.acc}, {type: 'bar', label: L('EV ($b)', ''), data: rows.map(r => n(r, ci('^ev'))), backgroundColor: C.r}], scales: {y: {type: 'logarithmic', title: {display: true, text: L('log scale', '')}}}})});
}
/* ---------------- Metrics & Street: Operating Metrics, Metric Picks, Guidance vs Actual, Wall Street, Valuation & Peers as one section ---------------- */
const mblk = () => [['opmetrics', () => opmetrics(), 'opmetrics'], ['picks', () => picksTab(), 'picks'], ['guidance', () => guidance()], ['street', () => street()], ['valuation', () => valuation()], ['bear', () => bearBlk()]].filter(b => !b[2] || OPT[b[2]]);
function metricsTab() {
  const om = OPT.opmetrics ? OPT.opmetrics.qs.quarters : null;
  $('#s-metrics').innerHTML = `<h2>${L('Metrics & Street', '')} <span class="mut">${om ? `${esc(om[0])} – ${esc(om[om.length - 1])} · ` : ''}${L('operating metrics, what to watch, guidance vs actual, Wall Street and valuation', '')}</span></h2>
   ${mblk().map(([k]) => `<div class="sblk" id="blk-${k}"></div>`).join('')}`;
  mblk().forEach(([k, fn]) => { try { fn(); } catch (e) { console.error('render ' + k, e); $('#blk-' + k).insertAdjacentHTML('beforeend', `<div class="tvfail">${L('This part could not render', '')}: ${esc(e.message)}</div>`); } });
  $$('#s-metrics a[href^="#metrics/"]:not([data-go])').forEach(a => a.addEventListener('click', e => { const k = a.getAttribute('href').split('/')[1]; if (location.hash === '#metrics/' + k) { e.preventDefault(); metricsJump(k); } }));
}
function metricsJump(k, smooth = true) {
  const el = $('#blk-' + k); if (!el) return;
  if (k === mblk()[0][0]) window.scrollTo({top: $('#s-metrics').getBoundingClientRect().top + scrollY - 70, behavior: smooth ? 'smooth' : 'auto'});
  else el.scrollIntoView({behavior: smooth ? 'smooth' : 'auto', block: 'start'});
}
/* ---------------- Sources ---------------- */
/* ---------------- bull & bear voices (public commentary, compiled 9 Oct 2026) ---------------- */
const VOICES = {
 bull: [
  {n: 'Paper Bag Investor', who: 'Engineer and long-term investor; detailed quarterly LMND model, management interviews', links: [['X @PaperBagInvest', 'https://x.com/PaperBagInvest'], ['YouTube', 'https://www.youtube.com/@PaperBagInvest']],
   pts: [['About $190/share present value from 40× 2032 earnings; about $95 even at 20×', 'https://www.youtube.com/watch?v=fFCNYuItKgs', '5 Mar 2026'],
         ['Long-run base-case gross loss ratio about 65%; better data lets Lemonade cut prices and keep loss ratios good', 'https://x.com/PaperBagInvest/status/2107337642765623694', '6 Oct 2026'],
         ['Revenue jumped because growth sped up and reinsurance was cut; it should go back to tracking in-force premium', 'https://x.com/PaperBagInvest/status/2107336363947491686', '6 Oct 2026'],
         ['Q2 jump in costs excluding growth spend was partly one-offs and stock pay; expects single-digit growth again', 'https://x.com/PaperBagInvest/status/2105161249520861258', '30 Sep 2026'],
         ['Annual dollar retention should recover as home non-renewals fade and car grows', 'https://x.com/PaperBagInvest/status/2104804130892190188', '29 Sep 2026'],
         ['Bullish on car: over 90% of car customers use telematics; home problems do not carry over to pet, renters or car', 'https://x.com/PaperBagInvest/status/2100798372320072110', '18 Sep 2026']]},
  {n: 'Rebellionaire', who: 'Advisory for Tesla-focused investors; Lemonade is its main non-Tesla pick', links: [['X @Rebellionaire', 'https://x.com/Rebellionaire'], ['YouTube', 'https://www.youtube.com/@rebellionair3'], ['Blog', 'https://www.rebellionaire.com/post/lemonade-stock-earnings']],
   pts: [['At $46 the stock is down more than 50% from 2026 highs; higher rates explain only about $7/share, so the fall is sentiment, not the business', 'https://x.com/Rebellionaire/status/2107471362763735456', '6 Oct 2026'],
         ['Customer acquisition spend is an investment with very high returns, like Tesla building factories; AI gives operating leverage as premium grows faster than core costs', 'https://www.youtube.com/watch?v=tXcwMlO2TUc', 'Nov 2024'],
         ['Valuation about $130/share then and $323 by 2033; net income positive around 2027, then 50%+ earnings growth', 'https://www.youtube.com/watch?v=tXcwMlO2TUc', 'Nov 2024'],
         ['Tesla FSD insurance discount as a growth catalyst', 'https://x.com/Rebellionaire/status/2108175344813674950', '8 Oct 2026']]},
  {n: 'Matt Smith', who: 'Equity analyst at Rebellionaire; covers Tesla, Bloom Energy, Micron and Lemonade', links: [['X @nerdalert', 'https://x.com/nerdalert']],
   pts: [['Q2 2026 was "an excellent quarter": beat guidance on every metric, car loss ratio improved more than expected, continued operating leverage', 'https://x.com/nerdalert/status/2082416121542500636', '29 Jul 2026'],
         ['The sell-off on higher operating costs was "wildly overblown"; underwriting and customer adds track modestly ahead of his model', 'https://x.com/nerdalert/status/2082939577900163274', '30 Jul 2026'],
         ['Hannover growth financing at about 10% versus about 16% with General Catalyst is "very prudent"', 'https://x.com/nerdalert/status/2069766859939791027', '24 Jun 2026'],
         ['Updated thoughts on $LMND', 'https://x.com/nerdalert/status/2107485542770196779', '6 Oct 2026']]},
  {n: 'Domien Van der Elst', who: 'Self-described big LMND bull who presses management', links: [['X @DomienVdE', 'https://x.com/DomienVdE']],
   pts: [['Argued adjusted EBITDA could turn positive before Q4 2026, but said promised leverage on costs excluding growth spend "has not come true" yet', 'https://x.com/DomienVdE/status/2082469743668216282', '29 Jul 2026']]},
  {n: 'HyperChange (Galileo Russell)', who: 'YouTube creator and holder', links: [['YouTube', 'https://www.youtube.com/@HyperChangeTV'], ['X @HyperChangeTV', 'https://x.com/HyperChangeTV']],
   pts: [['Calls Lemonade an AI-native insurer that can take share for decades', 'https://www.youtube.com/watch?v=XfscpnOY7C8', '2 Jan 2026']]},
  {n: 'Caesar Capital', who: 'Bull who posts each purchase publicly', links: [['X @CaesarCapitalz', 'https://x.com/CaesarCapitalz']],
   pts: [['Latest buy at $46.18; average cost $40.07', 'https://x.com/CaesarCapitalz/status/2107532441678454991', '6 Oct 2026']]}],
 bear: [
  {n: 'Short interest', who: 'Market positioning', links: [['Benzinga', 'https://www.benzinga.com/quote/LMND/short-interest'], ['MarketBeat', 'https://www.marketbeat.com/stocks/NYSE/LMND/short-interest/']],
   pts: [['10.85m shares short, about 15% of float and about 12 days to cover (15 Sep 2026 settlement); down from about 23% in Dec 2025', 'https://www.benzinga.com/quote/LMND/short-interest', '15 Sep 2026'],
         ['Street consensus is Hold: 4 Buy, 4 Hold, 1 Sell; targets $44–$92 in MarketBeat\'s list', 'https://www.marketbeat.com/stocks/NYSE/LMND/forecast/', 'Oct 2026']]},
  {n: 'Jefferies (Yaron Kinar)', who: 'Sell-side; lowest target on the Street', links: [],
   pts: [['Target cut to $37 from $40 after Q2', 'https://rallies.ai/news/lemonade-inc-lmndn-jefferies-cuts-target-price-to-37-from-40-8f3939b32061c75e', '30 Jul 2026']]},
  {n: 'BMO Capital (Jack Matten)', who: 'Sell-side; Underperform (latest confirmed update Aug 2025)', links: [],
   pts: [['Underperform, $42 target: the price assumes a best case of profitable scale in very competitive car insurance', 'https://www.tipranks.com/news/the-fly/lemonade-price-target-raised-to-42-from-23-at-bmo-capital-thefly', '18 Aug 2025'],
         ['Risk in relying on its captive Cayman reinsurer if reinsurers lose appetite', 'https://www.tipranks.com/news/the-fly/lemonade-price-target-raised-to-42-from-23-at-bmo-capital-thefly', '18 Aug 2025']]},
  {n: 'KBW (Tommy McJoynt)', who: 'Sell-side; former bear', links: [],
   pts: [['Was Underperform until Q2 2026; upgraded to Market Perform, $48 target, after the 24% post-earnings drop', 'https://seekingalpha.com/news/4621779-lemonade-raised-to-market-perform-at-kbw-after-post-q2-earnings-stock-slump', '30 Jul 2026']]},
  {n: 'The CrickAnt', who: 'Seeking Alpha; insurance and reinsurance analyst; Sell', links: [['Article', 'https://seekingalpha.com/article/4928594-lemonade-growth-is-working-but-the-insurance-economics-still-are-not']],
   pts: [['Q2 60% gross loss ratio was helped by about 7 points of favourable prior-year reserve development', 'https://seekingalpha.com/article/4928594-lemonade-growth-is-working-but-the-insurance-economics-still-are-not', '31 Jul 2026'],
         ['"Economic" combined ratio estimated at about 115% gross and 133% net', 'https://seekingalpha.com/article/4928594-lemonade-growth-is-working-but-the-insurance-economics-still-are-not', '31 Jul 2026'],
         ['Costs excluding claims grew 41%, faster than earned premium (+32%); over 7× book value prices in profits not yet shown', 'https://seekingalpha.com/article/4928594-lemonade-growth-is-working-but-the-insurance-economics-still-are-not', '31 Jul 2026']]},
  {n: 'Ryan Canady', who: 'Seeking Alpha; Sell, then still not a Buy', links: [['Jul article', 'https://seekingalpha.com/article/4919465-lemonade-this-ai-insurance-darling-could-prove-to-be-a-disappointment'], ['Sep article', 'https://seekingalpha.com/article/4944935-lemonade-the-business-is-finally-starting-to-catch-up-but-the-stock-isnt-a-buy-just-yet']],
   pts: [['AI is no longer a moat because rivals use it too; fast expansion into new products and markets adds execution risk; expensive next to peers', 'https://seekingalpha.com/article/4919465-lemonade-this-ai-insurance-darling-could-prove-to-be-a-disappointment', '2 Jul 2026'],
         ['Business is catching up, but the stock still is not a Buy', 'https://seekingalpha.com/article/4944935-lemonade-the-business-is-finally-starting-to-catch-up-but-the-stock-isnt-a-buy-just-yet', '10 Sep 2026']]},
  {n: 'Brian McCormick', who: 'Skeptic on X; would buy when sentiment and the business bottom', links: [['X @bjmtweets', 'https://x.com/bjmtweets']],
   pts: [['Insiders sold near the peaks: Schreiber about $12m at $95–99 in January, Bixby $5.7m at $79.18 on 7 Jul', 'https://x.com/bjmtweets/status/2103175328751616132', '24 Sep 2026'],
         ['Homesite now underwrites Lemonade home policies in 29 states, leaving 8 on Lemonade\'s own paper', 'https://x.com/bjmtweets/status/2098522976379719793', '11 Sep 2026'],
         ['Pet insurance industry growth has slowed below 10%', 'https://x.com/bjmtweets/status/2079654574454087942', '21 Jul 2026'],
         ['Claims contractors sit in operating costs, not in headcount', 'https://x.com/bjmtweets/status/2107301686033404197', '6 Oct 2026']]},
  {n: 'Weiss Ratings', who: 'Quant rating, not an analyst thesis', links: [],
   pts: [['"Sell (D-)" reiterated', 'https://www.marketbeat.com/all-access/ratings-screener/details/2432379/', '17 Jul 2026']]}]};
/* Chinese for the bull & bear cards (English kept as the source of truth; quotes keep the English words followed by a  translation) */
const VZ = {
 'Engineer and long-term investor; detailed quarterly LMND model, management interviews': ' LMND ',
 'About $190/share present value from 40× 2032 earnings; about $95 even at 20×': ' 2032  40  $190 20  $95',
 'Long-run base-case gross loss ratio about 65%; better data lets Lemonade cut prices and keep loss ratios good': ' 65% Lemonade ',
 'Revenue jumped because growth sped up and reinsurance was cut; it should go back to tracking in-force premium': '',
 'Q2 jump in costs excluding growth spend was partly one-offs and stock pay; expects single-digit growth again': 'Q2 ',
 'Annual dollar retention should recover as home non-renewals fade and car grows': '',
 'Bullish on car: over 90% of car customers use telematics; home problems do not carry over to pet, renters or car': ' 90% ',
 'Advisory for Tesla-focused investors; Lemonade is its main non-Tesla pick': 'Lemonade ',
 'At $46 the stock is down more than 50% from 2026 highs; higher rates explain only about $7/share, so the fall is sentiment, not the business': ' $46  2026  50% $7',
 'Customer acquisition spend is an investment with very high returns, like Tesla building factories; AI gives operating leverage as premium grows faster than core costs': 'AI ',
 'Valuation about $130/share then and $323 by 2033; net income positive around 2027, then 50%+ earnings growth': ' $130 2033  $323 2027  50%',
 'Tesla FSD insurance discount as a growth catalyst': ' FSD ',
 'Equity analyst at Rebellionaire; covers Tesla, Bloom Energy, Micron and Lemonade': 'Rebellionaire Bloom Energy Lemonade',
 'Q2 2026 was "an excellent quarter": beat guidance on every metric, car loss ratio improved more than expected, continued operating leverage': 'Q2 2026  "an excellent quarter"“”',
 'The sell-off on higher operating costs was "wildly overblown"; underwriting and customer adds track modestly ahead of his model': ' "wildly overblown"“”',
 'Hannover growth financing at about 10% versus about 16% with General Catalyst is "very prudent"': 'Hannover  10%  General Catalyst  16% "very prudent"“”',
 'Updated thoughts on $LMND': ' $LMND ',
 'Self-described big LMND bull who presses management': ' LMND ',
 'Argued adjusted EBITDA could turn positive before Q4 2026, but said promised leverage on costs excluding growth spend "has not come true" yet': ' EBITDA  2026  "has not come true"“”',
 'YouTube creator and holder': 'YouTube ',
 'Calls Lemonade an AI-native insurer that can take share for decades': ' Lemonade  AI ',
 'Bull who posts each purchase publicly': '',
 'Latest buy at $46.18; average cost $40.07': ' $46.18 $40.07',
 'Market positioning': '',
 '10.85m shares short, about 15% of float and about 12 days to cover (15 Sep 2026 settlement); down from about 23% in Dec 2025': ' 10.85m  15% 12 2026915 202512 23%',
 "Street consensus is Hold: 4 Buy, 4 Hold, 1 Sell; targets $44–$92 in MarketBeat's list": '4 4 1 MarketBeat  $44–$92',
 'Sell-side; lowest target on the Street': '',
 'Target cut to $37 from $40 after Q2': 'Q2  $40  $37',
 'Sell-side; Underperform (latest confirmed update Aug 2025)': '“” 20258',
 'Underperform, $42 target: the price assumes a best case of profitable scale in very competitive car insurance': '“” $42',
 'Risk in relying on its captive Cayman reinsurer if reinsurers lose appetite': '',
 'Sell-side; former bear': '',
 'Was Underperform until Q2 2026; upgraded to Market Perform, $48 target, after the 24% post-earnings drop': ' Q2 2026 “” 24%“” $48',
 'Seeking Alpha; insurance and reinsurance analyst; Sell': 'Seeking Alpha',
 'Q2 60% gross loss ratio was helped by about 7 points of favourable prior-year reserve development': 'Q2 60%  7 ',
 '"Economic" combined ratio estimated at about 115% gross and 133% net': '"Economic"“” 115% 133%',
 'Costs excluding claims grew 41%, faster than earned premium (+32%); over 7× book value prices in profits not yet shown': ' 41%+32% 7 ',
 'Seeking Alpha; Sell, then still not a Buy': 'Seeking Alpha',
 'AI is no longer a moat because rivals use it too; fast expansion into new products and markets adds execution risk; expensive next to peers': ' AIAI ',
 'Business is catching up, but the stock still is not a Buy': '',
 'Skeptic on X; would buy when sentiment and the business bottom': 'X ',
 'Insiders sold near the peaks: Schreiber about $12m at $95–99 in January, Bixby $5.7m at $79.18 on 7 Jul': 'Schreiber 1  $95–99  $12mBixby  77 $79.18  $5.7m',
 "Homesite now underwrites Lemonade home policies in 29 states, leaving 8 on Lemonade's own paper": 'Homesite  29  Lemonade  8  Lemonade ',
 'Pet insurance industry growth has slowed below 10%': ' 10% ',
 'Claims contractors sit in operating costs, not in headcount': '',
 'Quant rating, not an analyst thesis': '',
 '"Sell (D-)" reiterated': ' "Sell (D-)"“D-”',
 'X @PaperBagInvest': 'X @PaperBagInvest', 'Blog': '', 'Article': '', 'Jul article': '7 ', 'Sep article': '9 '};
VZ['Short interest'] = '';
const vz = t => L(t, VZ[t] || t);
const SRCSUB = [['feed', 'Sources & Live feed', ''], ['bull', 'Bulls', ''], ['bear', 'Bears', '']];
function voicesHtml(side) {
  const VL = VOICES[side];
  return `<p class="mut" style="margin:4px 0 14px">${L(`${side === 'bull' ? 'Public bull cases on Lemonade' : 'Public bear and skeptical cases on Lemonade, including sell-side ratings and short interest'}: who said it, the facts and logic, and the source. Compiled 9 Oct 2026; each point links to the post, video or report. Not investment advice.`,
    `${side === 'bull' ? 'Lemonade ' : 'Lemonade '} 2026109`)}</p>
   <div class="grid g2">${VL.map(v => `<div class="card voice"><h3 style="margin:0 0 2px">${esc(vz(v.n))} <span class="vtag ${side}">${side === 'bull' ? L('Bull', '') : L('Bear', '')}</span></h3><div class="mut" style="font-size:12.5px">${esc(vz(v.who))}${v.links.length ? ' · ' + v.links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(vz(l))}</a>`).join(' · ') : ''}</div>
     <ul class="lst" style="margin-top:10px">${v.pts.map(([t, u, d]) => `<li>${esc(vz(t))} <span class="mut">· <a href="${esc(u)}" target="_blank" rel="noopener">${L('source', '')}</a>${L(', ', '')}${esc(dl(d))}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
}
function srcShow(id) {
  if (!SRCSUB.some(s => s[0] === id)) id = 'feed';
  $$('#srcsub button').forEach(b => b.classList.toggle('on', b.dataset.v === id));
  SRCSUB.forEach(([k]) => { const e = $('#src-' + k); if (e) e.hidden = k !== id; });
}
const SHEETZ = {Cover: '', 'IS 8Q': ' 8Q', 'BS 8Q': ' 8Q', 'CF 8Q': ' 8Q', 'Insurance KPIs': ' KPI', 'Guidance vs Actual': '', 'Wall Street': '', 'Ownership Form4': ' Form 4',
  'Valuation Peers': '', 'Metric Picks': '', 'Quarterly Highlights': '', 'Product Rollout': '', 'Operating Metrics': '', Sources: ''};
function sources() {
  const sh = sheet('^sources'); const cover = sheet('cover'); const N = D.narrative; const rep = (N.sections.find(s => /^sources/i.test(s.h)) || {paras: []}).paras.filter(p => !p.startsWith('©'));
  const FD = window.FEED || {filings: [], fetched_sgt: NA(), status: L('not loaded', '')};
  const ft = FD.filings.map(f => `<tr><td><b>${esc(f.form)}</b></td><td>${esc(f.date)}</td><td>${esc(f.report || '')}</td><td style="white-space:normal">${esc(tr(f.desc))}${f.items ? ` <span class="mut">${L('items', '')} ${esc(f.items)}</span>` : ''}</td><td><a href="${esc(f.url)}" target="_blank" rel="noopener">${L('doc', '')}</a> · <a href="${esc(f.index)}" target="_blank" rel="noopener">${L('index', '')}</a></td></tr>`).join('');
  const lq = LQ.last, lqm = (lq && lq.main) || {};
  const lqs = lq ? L(`Last tick $${Number(lqm.price).toFixed(2)} at ${esc(lqm.time_et || '')} · ${esc(lq.session_label || lq.session || '')}`, ` $${Number(lqm.price).toFixed(2)} ${esc(String(lqm.time_et || '').replace(/\s*ET$/, ''))} · ${esc(sz(lq.session) || lq.session_label || '')}`) : (LQ.tv ? L('Real-time feed unreachable right now; the TradingView delayed quote is showing instead.', ' TradingView ') : L('Waiting for the first tick…', '…'));
  const fst = FD.status === 'ok' ? L('ok', '') : FD.status;
  $('#s-sources').innerHTML = `<h2>${L('Sources &amp; Live feed', '')}</h2><div class="subtabs" id="srcsub" role="tablist">${SRCSUB.map(([k, en, zh]) => `<button role="tab" data-v="${k}">${esc(L(en, zh))}</button>`).join('')}</div>
   <div id="src-bull" hidden>${voicesHtml('bull')}</div><div id="src-bear" hidden>${voicesHtml('bear')}</div><div id="src-feed">
   <div class="card"><h3>${L('Live price feed', '')}</h3><ul class="lst">
    <li>${L(`<b>Price box:</b> NYSE last sale via Robinhood, real-time, refreshed every 15 seconds through`, `<b></b>NYSE  Robinhood 15 `)} <a href="${esc(QUOTE_API)}" target="_blank" rel="noopener">${esc(QUOTE_API.replace(/^https?:\/\//, ''))}</a>${L(". Nasdaq.com is the relay's backup source.", 'Nasdaq.com ')}</li>
    <li>${L("<b>Backup:</b> if the real-time feed fails, the box switches to TradingView's delayed quote widget.", '<b></b> TradingView ')}</li>
    <li>${L('<b>Chart:</b> TradingView advanced chart (NYSE:LMND), streamed live in your browser.', '<b></b>TradingView NYSE:LMND')}</li>
    <li><b>${L('Status:', '')}</b> <span id="lfstat">${lqs}</span></li></ul></div>
   <div class="card" style="margin-top:16px"><h3>${L(`Latest SEC filings (CIK ${esc(FD.cik || '1691421')})`, ` SEC CIK ${esc(FD.cik || '1691421')}`)}</h3><div class="mut" style="font-size:12px">${L(`The list refreshes each time the dashboard is published · ${FD.filings.length} most recent filings · data.sec.gov submissions API, last fetched ${esc(FD.fetched_sgt)} (status: ${esc(fst)}).`, ` ·  ${FD.filings.length}  · data.sec.gov submissions API ${esc(String(FD.fetched_sgt).replace(' SGT', ''))}${esc(fst)}`)}</div>
    <div class="tblwrap" style="max-height:420px;overflow:auto"><table class="feedt"><thead><tr><th>${L('Form', '')}</th><th>${L('Filed', '')}</th><th>${L('Report date', '')}</th><th>${L('Description / items', ' / ')}</th><th>${L('Link', '')}</th></tr></thead><tbody>${ft}</tbody></table></div></div>
   <h3>${L('Source documents', '')}</h3><div class="xscope">${xallBtns()}
   ${details(L('Workbook sources & links', ''), `<ul class="lst">${(sh ? sh.pre : []).map(p => `<li>${linkify(tr(p))}</li>`).join('')}</ul>`, L(`${sh ? sh.pre.length : 0} items`, `${sh ? sh.pre.length : 0} `), true)}
   ${(sh && sh.tables.length) ? sh.tables.map(t => details(esc(tr(t.title) || L('Quarterly shareholder letters (SEC 8-K)', 'SEC 8-K')), `<ul class="lst">${[t.columns, ...t.rows.filter(Array.isArray)].map(r => `<li>${r.filter(x => x != null && x !== '').map(x => /^https?:/.test(String(x)) ? `<a href="${esc(x)}" target="_blank" rel="noopener">${esc(x)}</a>` : esc(tr(x))).join(' — ')}</li>`).join('')}</ul>`, L(`${t.rows.length + 1} links`, `${t.rows.length + 1} `))).join('') : ''}
   ${details(L('Report sources', ''), `<ul class="lst">${rep.map(p => `<li>${linkify(tr(p).replace(/^•\s*/, ''))}</li>`).join('')}</ul>`, L(`${rep.length} items`, `${rep.length} `))}
   ${details(L('Reinsurance restructuring sources', ''), `<ul class="lst">${D.reins.map(r => `<li><b>${esc(dlong(r.date))} — ${esc(tr(r.title))}${L(':', '')}</b> ${esc(tr(r.source))}</li>`).join('')}</ul>`, L(`${D.reins.length} events`, `${D.reins.length} `))}
   ${details(L('Workbook notes & disclaimer', ''), `<ul class="lst">${(cover ? cover.pre : []).filter(p => !/^\d+\.|^Sheets:/.test(p)).map(p => `<li>${linkify(tr(p))}</li>`).join('')}</ul>`)}
   ${details(L('Data build', ''), L(`<ul class="lst"><li>Built ${esc(D.meta.built_sgt)} from the workbook sheets: ${D.meta.sheets.map(esc).join(', ')}.</li><li>Price history: ${esc(D.price.hist_src)}. Live price: Robinhood real-time via the quote relay, TradingView delayed quote as backup. SEC filings feed: data.sec.gov, fetched ${esc((window.FEED||{}).fetched_sgt||'n/a')}.</li><li>Form 4 detail: ${D.form4.length} transaction lines parsed from SEC Form 4 XML.</li><li>Unavailable figures are shown as n/a, never estimated.</li></ul>`,
     `<ul class="lst"><li> ${esc(D.meta.built_sgt.replace(' SGT', ''))}${D.meta.sheets.map(n => esc(SHEETZ[n] || n)).join('')}</li><li> Robinhood TradingView SEC data.sec.gov ${esc(String((window.FEED||{}).fetched_sgt||'').replace(' SGT', ''))}</li><li>Form 4  SEC Form 4 XML  ${D.form4.length} </li><li>“”</li></ul>`))}
   ${details(L('Metric definitions', ''), `<ul class="lst">${Object.entries(D.glossary).map(([k, v]) => `<li><b>${esc(tr(k))}</b> — ${esc(tr(v))}</li>`).join('')}</ul>`)}</div></div>`;
  $$('#srcsub button').forEach(b => b.onclick = () => { location.replace('#sources/' + b.dataset.v); srcShow(b.dataset.v); });
  srcShow(location.hash.split('/')[1] || 'feed');
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
const RNG = () => [['8', L('8Q', '8 ')], ['12', L('3Y', '3 ')], ['all', L('2020+ (all)', '2020 ')]];
function rangeSlice(QQ, st) { const n = st.range === '8' ? 8 : st.range === '12' ? 12 : QQ.length; return Math.max(0, QQ.length - n); }
function history() {
  const H = OPT.history, qs = H.qs, el = $('#s-history');
  const QQ = qs.quarters, Sx = qs.series;
  const kI = pickKey(Sx, /in-?force|ifp/i, /yoy|growth|%|qoq|per |-/i), kR = pickKey(Sx, /revenue/i, /yoy|growth|%|qoq/i), kG = pickKey(Sx, /gross earned|gep/i, /yoy|growth|%|qoq/i);
  const kIy = pickKey(Sx, /(in-?force|ifp).*(yoy|growth)|(yoy|growth).*(in-?force|ifp)/i), kRy = pickKey(Sx, /revenue.*(yoy|growth)|(yoy|growth).*revenue/i);
  const yI = kIy ? Sx[kIy] : growth(Sx[kI], 4), yR = kRy ? Sx[kRy] : growth(Sx[kR], 4);
  const n = QQ.length - 1, CR = cessionRow();
  const ces = q => { if (!CR) return ''; const i = CR.q.indexOf(q); return i >= 0 ? (CR.v[i] || '') : ''; };
  const evs = D.reins;
  const rows = QQ.map((q, i) => [q, Sx[kI][i], yI[i], Sx[kR][i], yR[i], ...(CR ? [ces(q)] : []), reinsAt(q) ? tr(reinsAt(q).title) : '']);
  const hNote = (D.sheets[H.sheet].tables[0] || {notes: []}).notes;
  const yoyL = L('YoY', '');
  el.innerHTML = `<h2>${L('IFP & Revenue History', 'IFP ')} <span class="mut">${esc(QQ[0])} – ${esc(QQ[n])}${L(', every quarter', '')}</span></h2>
   <div class="grid g4" style="margin-bottom:16px">
    <div class="card kpi"><div class="l">${L('In-force premium', '')}, ${esc(QQ[n])} ${info('IFP')}</div><div class="v">${money(Sx[kI][n])}</div><div class="s"><span class="${pcls(yI[n])}">${pct(yI[n])}</span> ${yoyL} · ${esc(QQ[0])}: ${money(Sx[kI][0])} (${fmt(Sx[kI][n] / Sx[kI][0], 1)}×)</div></div>
    <div class="card kpi"><div class="l">${L('Revenue', '')}, ${esc(QQ[n])} ${info('Revenue')}</div><div class="v">${money(Sx[kR][n])}</div><div class="s"><span class="${pcls(yR[n])}">${pct(yR[n])}</span> ${yoyL} · ${esc(QQ[0])}: ${money(Sx[kR][0])} (${fmt(Sx[kR][n] / Sx[kR][0], 1)}×)</div></div>
    <div class="card kpi"><div class="l">${L('Gap: revenue YoY − IFP YoY', ' − IFP ')}, ${esc(QQ[n])} ${info('Quota share')}</div><div class="v">${yR[n] != null && yI[n] != null ? (yR[n] - yI[n] >= 0 ? '+' : '−') + fmt(Math.abs(yR[n] - yI[n]), 1) + L('pp', ' ') : NA()}</div><div class="s">${L('Revenue outgrows IFP while the quota-share cession falls', ' IFP')}</div></div>
    <div class="card kpi"><div class="l">${L('Annotated events', '')} ${info('Quota share')}</div><div class="v">${evs.length}</div><div class="s">${L('Reinsurance, Metromile and lapping', 'Metromile ')}: ${evs.map(r => esc(r.quarter.replace(/^Q(\d) 20(\d\d)$/, "Q$1'$2"))).join(' · ')}${L('. Click a chart marker.', '')}</div></div></div>
   <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">${L('Reinsurance restructurings, Metromile & lapping', 'Metromile ')} <span class="mut" style="font-size:12.5px;font-weight:400">${L('also marked on both charts', '')}</span></h3><div class="grid g3">${evs.map(r => `<div><div class="pill ${r.kind === 'reins' ? 'acc' : 'other'}">${esc(dlong(r.date))} · ${esc(r.quarter)}</div><h4 style="margin:6px 0 4px">${esc(tr(r.title))}</h4><div style="font-size:13px;line-height:1.55">${esc(tr(r.detail))}</div><div class="mut" style="font-size:11.5px;margin-top:4px">${L('Source', '')}: ${esc(tr(r.source))}</div></div>`).join('')}</div>${fnote(hNote)}</div>
   ${charts2([{id: 'hAbs', title: L('In-force premium vs quarterly revenue ($m)', ''), tip: 'IFP', growth: 1, reins: 1, ranges: RNG()}, {id: 'hYoy', title: L('YoY growth: IFP vs revenue (%)', 'IFP %'), tip: 'Revenue', reins: 1, ranges: RNG()}])}
   ${tableBlock({title: L('Quarter by quarter', ''), columns: [L('Quarter', ''), L('IFP ($m)', 'IFP'), L('IFP YoY %', 'IFP  %'), L('Revenue ($m)', ''), L('Revenue YoY %', ' %'), ...(CR ? [L('Quota share cession', '')] : []), L('Event', '')], rows}, {id: 'tHist', terms: false, maxh: 720, notes: [L(`Source: ${H.sheet} sheet${CR ? ' (IFP, revenue) and Operating Metrics sheet (cession)' : ''}. Highlighted rows = annotated event quarters (reinsurance, Metromile, lapping).`, `${SHEETZ[H.sheet] || H.sheet} ${CR ? 'IFP' : ''} = Metromile`)]})}`;
  $$('#tHist tbody tr').forEach(r => { if (reinsAt(r.cells[0].textContent)) { r.style.boxShadow = 'inset 3px 0 0 var(--acc)'; [...r.cells].forEach(c => c.style.background = 'var(--accsoft)'); } });
  wireCard({id: 'hAbs', reins: 1, unit: '$m', build: st => { const s0 = rangeSlice(QQ, st); return {labels: QQ.slice(s0), datasets: [{type: 'line', label: L('In-force premium (annualised)', ''), data: Sx[kI].slice(s0), borderColor: C.acc, yAxisID: 'y', order: 1}, {type: 'bar', label: L('Revenue (quarter)', ''), data: Sx[kR].slice(s0), backgroundColor: C.g, yAxisID: 'y1', order: 2}, kG && {type: 'bar', label: L('Gross earned premium', ''), data: Sx[kG].slice(s0), backgroundColor: C.acc2, yAxisID: 'y1', order: 3}].filter(Boolean),
    scales: {y: {title: {display: true, text: L('IFP $m', 'IFP')}}, y1: {position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: L('Quarterly $m', '')}}}}; }});
  wireCard({id: 'hYoy', reins: 1, unit: '%', build: st => { const s0 = rangeSlice(QQ, st); return {type: 'line', labels: QQ.slice(s0), datasets: [{label: L('IFP YoY %', 'IFP  %'), data: yI.slice(s0), borderColor: C.acc, keep: 1, unit: '%'}, {label: L('Revenue YoY %', ' %'), data: yR.slice(s0), borderColor: C.g, keep: 1, unit: '%'}], scales: {y: {ticks: {callback: v => v + '%'}}}}; }});
  ['hAbs', 'hYoy'].forEach(id => { const c = charts[id]; if (c) { c.options.plugins.tooltip.callbacks.label = x => `${x.dataset.label}: ${x.raw == null ? NA() : x.dataset.unit === '%' ? pct(x.raw) : money(x.raw)}`; c.options.plugins.tooltip.callbacks.afterBody = it => { const q = it[0] && it[0].label; const c2 = ces(q); const r = reinsAt(q); return [c2 ? L('Quota share: ', '') + tr(c2) : '', r ? '⟲ ' + tr(r.title) : ''].filter(Boolean); }; c.update('none'); } });
}
function highlights() {
  const sh = optSheet('highlights'); const el = $('#s-highlights'); const t = sh.tables[0]; const ci = re => t.columns.findIndex(c => re.test(c));
  const iQ = ci(/quarter/i) < 0 ? 0 : ci(/quarter/i), iTxt = ci(/highlight|commentary|comment/i), iDt = ci(/date/i);
  const num = re => ci(re);
  const iI = num(/^ifp \(|in-?force.*\(\$/i), iIy = num(/ifp yoy/i), iR = num(/^revenue \(/i), iRy = num(/revenue yoy/i);
  const items = t.rows.filter(Array.isArray).map(r => ({q: qnorm(r[iQ]), r})).sort((a, b) => qkey(b.q) - qkey(a.q));
  const bullets = s => { const parts = String(s || '').split(/\n|(?:^|\s)•\s/).map(x => x.replace(/^•\s*/, '').trim()).filter(Boolean); return `<ul class="lst">${parts.map(p => `<li>${linkify(p)}</li>`).join('')}</ul>`; };
  const CHZ = {Reinsurance: '', Pet: '', Car: '', Europe: '', Retention: ''};
  const CH = ['Reinsurance', 'Pet', 'Car', 'Europe', 'AI', 'Metromile', 'EBITDA', 'Retention'].map(c => L(c, CHZ[c] || c));
  el.innerHTML = `<h2>${L('Quarterly Highlights', '')} <span class="mut">${L('management commentary', '')}, ${esc(items[items.length - 1].q)} – ${esc(items[0].q)}</span></h2>
   ${fnote(sh.pre, L('About this data', ''))}
   <div class="tbar"><input type="search" id="hlq" placeholder="${L('Search commentary (e.g. pet, car, reinsurance)…', '…')}" aria-label="${L('Search highlights', '')}"><span class="tcount" id="hln"></span></div>
   <div class="chips" id="hlchips">${CH.map(c => `<button class="btn" data-v="${c}">${c}</button>`).join('')}</div>
   <div class="xscope" id="hlwrap">${xallBtns()}${items.map((it, k) => { const r = it.r; const re = reinsAt(it.q);
     const sm = [iDt >= 0 && r[iDt] ? L('letter ', ' ') + dl(String(r[iDt])) : '', iI >= 0 && r[iI] != null ? `IFP ${money(r[iI])}${iIy >= 0 && r[iIy] != null ? ' (' + pct(r[iIy], 0) + ')' : ''}` : '', iR >= 0 && r[iR] != null ? `${L('revenue', '')} ${money(r[iR])}${iRy >= 0 && r[iRy] != null ? ' (' + pct(r[iRy], 0) + ')' : ''}` : ''].filter(Boolean).join(' · ');
     return details(`${esc(it.q)}${re ? ` <span class="pill acc">⟲ ${L('reinsurance', '')}</span>` : ''}`, (re ? `<div class="reinsbox on"><h4>${esc(tr(re.title))}</h4>${esc(tr(re.detail))}</div>` : '') + bullets(tr(r[iTxt])), esc(sm), k === 0); }).join('')}</div>
   ${fnote(t.notes)}`;
  const upd = () => { const q = $('#hlq').value.trim().toLowerCase(); let v = 0; $$('#hlwrap details.x').forEach(d => { const hit = !q || d.innerText.toLowerCase().includes(q) || d.querySelector('.xb').textContent.toLowerCase().includes(q); d.hidden = !hit; if (hit) v++; if (q && hit) d.open = true; }); $('#hln').textContent = L(`${v} of ${items.length} quarters`, `${v} / ${items.length} `);
    $$('#hlchips button').forEach(b => b.classList.toggle('on', b.dataset.v.toLowerCase() === q)); };
  $('#hlq').addEventListener('input', upd); $$('#hlchips button').forEach(b => b.onclick = () => { const i = $('#hlq'); i.value = i.value.toLowerCase() === b.dataset.v.toLowerCase() ? '' : b.dataset.v; upd(); }); upd();
}
const PROD = [['Pet', /\bpet|chewy/i], ['Car', /\bcar\b|metromile|autonomous|tesla|fsd/i], ['Life', /\blife\b/i], ['Home & renters', /renter|homeowner|contents|building|home/i], ['Financing', /synthetic|financ|general catalyst/i], ['Footprint', /footprint|states/i]];
const GEO = [['Europe', /germany|netherlands|france|\buk\b|europe|\beu\b/i], ['US', /\bus\b|u\.s\.|illinois|tennessee|texas|florida|colorado|indiana|pennsylvania|new york|states|metromile|chewy|tesla|car\b/i]];
const PZ = {Pet: '', Car: '', Life: '', 'Home & renters': '', Financing: '', Footprint: '', Other: '', Europe: '', US: ''};
const pz = p => LANG === 'zh' ? (PZ[p] || tr(p)) : p;
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
  el.innerHTML = `<h2>${L('Product Rollout', '')} <span class="mut">${L(`${rows.length} milestones`, `${rows.length} `)}</span></h2>
   ${growthBlock()}
   ${fnote(sh.pre, L('About this data', ''))}
   <div class="flab">${L('Product line', '')}</div><div class="chips" id="roP"><button class="btn on" data-v="">${L('All', '')}</button>${Ps.map(p => `<button class="btn" data-v="${esc(p)}">${esc(pz(p))} <span class="mut">${rows.filter(r => r.p === p).length}</span></button>`).join('')}</div>
   <div class="flab">${L('Geography', '')}</div><div class="chips" id="roG"><button class="btn on" data-v="">${L('All', '')}</button>${Gs.map(p => `<button class="btn" data-v="${esc(p)}">${esc(pz(p))} <span class="mut">${rows.filter(r => r.g === p).length}</span></button>`).join('')}</div>
   <div class="grid g2"><div class="card"><h3 style="margin-top:0">${L('Timeline', '')} <span class="mut" style="font-size:12px;font-weight:400" id="ron"></span></h3><div class="mut" style="font-size:12px;margin-bottom:8px">${L('Click or tap an item for the source letter and notes.', '')} <button class="lnk" id="roAll">${L('Expand all', '')}</button></div><div class="tl" id="rotl">${[...rows].reverse().map(r => `<div class="tli" data-p="${esc(r.p)}" data-g="${esc(r.g)}" tabindex="0" role="button" aria-expanded="false"><div class="w">${esc(tr(r.d))} · <span class="pill acc">${esc(pz(r.p))}</span> <span class="pill other">${esc(pz(r.g))}</span></div><div class="p">${esc(tr(r.name))}${r.name && r.e ? L(': ', '') : ''}<span style="font-weight:400">${esc(tr(r.e))}</span></div><div class="d">${r.x.map(([c, v]) => `<div><b>${esc(tr(c))}${L(':', '')}</b> ${linkify(String(tr(v)))}</div>`).join('')}</div></div>`).join('')}</div></div>
   <div>${ccard({id: 'roC', title: L('Milestones per year by product line', ''), h: 340})}<div class="card" style="margin-top:16px"><h3 style="margin-top:0">${L('Rollout by product line', '')}</h3>${Ps.map(p => `<div class="cat"><div class="when">${esc(pz(p))}</div><div style="flex:1;font-size:13px">${rows.filter(r => r.p === p).map(r => esc(tr(r.d).replace(/\s*[(].*[)]/, ''))).join(' → ')}</div></div>`).join('')}</div></div></div>`;
  const st = {p: '', g: ''}; const apply = () => { let v = 0; $$('#rotl .tli').forEach(x => { const ok = (!st.p || x.dataset.p === st.p) && (!st.g || x.dataset.g === st.g); x.hidden = !ok; if (ok) v++; }); $('#ron').textContent = L(`· showing ${v} of ${rows.length}`, `·  ${v} / ${rows.length}`); };
  [['#roP', 'p'], ['#roG', 'g']].forEach(([s, k]) => $$(s + ' button').forEach(b => b.onclick = () => { $$(s + ' button').forEach(x => x.classList.toggle('on', x === b)); st[k] = b.dataset.v; apply(); }));
  $$('#rotl .tli').forEach(x => { const tg = () => { x.classList.toggle('open'); x.setAttribute('aria-expanded', x.classList.contains('open')); }; x.onclick = e => { if (!e.target.closest('a')) tg(); }; x.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } }; });
  $('#roAll').onclick = e => { e.stopPropagation(); const open = !$$('#rotl .tli').every(x => x.classList.contains('open')); $$('#rotl .tli').forEach(x => x.classList.toggle('open', open)); $('#roAll').textContent = open ? L('Collapse all', '') : L('Expand all', ''); };
  apply(); growthWire();
  const yr = r => { const m = r.d.match(/(20\d{2})/); if (m) return m[1]; const q = r.d.match(/Q[1-4]'(\d{2})/); if (q) return '20' + q[1]; const l = r.letter.match(/(20\d{2})/); return l ? l[1] : ''; };
  const Ys = uniq(rows.map(yr)).sort(); const pal = [C.acc, C.g, C.acc2, C.b, C.p, C.y, C.r, C.t];
  wireCard({id: 'roC', build: () => ({labels: Ys, stacked: true, datasets: Ps.map((p, i) => ({type: 'bar', label: pz(p), data: Ys.map(y => rows.filter(r => yr(r) === y && r.p === p).length), backgroundColor: pal[i % pal.length]})), scales: {x: {stacked: true}, y: {stacked: true, ticks: {precision: 0}}}})});
  charts.roC.options.plugins.tooltip.callbacks.label = c => c.raw ? L(`${c.dataset.label}: ${c.raw} milestone${c.raw > 1 ? 's' : ''}`, `${c.dataset.label}${c.raw} `) : null; charts.roC.update('none');
}
const PICKMAP = [[/lae/i, /^lae ratio/i], [/in-?force|ifp/i, /^in-?force premium/i], [/gross loss ratio/i, /^gross loss ratio \(/i], [/gross profit/i, /adj\. gross profit \/ gep|gross profit margin/i], [/ebitda/i, /^adj\. ebitda/i], [/fcf|cash/i, /^cash & investments/i], [/growth spend/i, /^growth spend/i], [/retention|adr/i, /annual dollar retention/i], [/product mix|segment/i, /^ifp - pet/i]];
function opmetrics() {
  const sh = optSheet('opmetrics'), qs = OPT.opmetrics.qs; const el = $('#blk-opmetrics'); const QQ = qs.quarters, Sx = qs.series, SEC = qs.sections || {};
  const P = OPT.picks ? D.sheets[OPT.picks.sheet] : null; const pt = P ? P.tables[0] : null; const pc = re => pt ? pt.columns.findIndex(c => re.test(c)) : -1;
  const picks = pt ? pt.rows.filter(Array.isArray).map(r => ({name: String(r[pc(/^metric/i)] || ''), why: r[pc(/why/i)], latest: r[pc(/latest/i)], watch: r[pc(/trend|watch/i)], chart: r[pc(/chart/i)]})) : [];
  const findS = re => Object.keys(Sx).find(k => re.test(k));
  const numKeys = Object.keys(Sx).filter(k => Sx[k].filter(v => v != null).length >= 2);
  const secs = [...new Set(numKeys.map(k => SEC[k] || 'Metrics'))];
  const lastOf = k => { const v = Sx[k]; for (let i = v.length - 1; i >= 0; i--) if (v[i] != null) return [v[i], i]; return [null, -1]; };
  const prevOf = (k, i) => { const v = Sx[k]; for (let j = i - 1; j >= 0; j--) if (v[j] != null) return [v[j], j]; return [null, -1]; };
  const fv = (k, v) => v == null ? NA() : /\(%\)|%/.test(k) ? fmt(v, Number.isInteger(v) ? 0 : 1) + (/pts|pp/.test(k) ? '' : '%') : /\(\$m\)/.test(k) ? money(v) : /\(\$\)/.test(k) ? '$' + fmt(v) : /\(m\)/.test(k) ? fmt(v, 2) + 'm' : Math.abs(v) >= 1e5 ? fmt(v / 1e6, 2) + 'm' : fmt(v, Number.isInteger(v) ? 0 : 1);
  const txtKeys = Object.keys(qs.text || {}).filter(k => (qs.text[k] || []).some(Boolean));
  const ret = findS(/annual dollar retention/i) || numKeys[0];
  const rg = RNG();
  el.innerHTML = `${fnote(sh.pre, L('About this data', ''))}
   ${picks.length ? `<p class="lead sm">${L(`<b>What to watch.</b> the ${picks.length} recommended due-diligence metrics are <a href="#metrics/picks">further down this page</a>, each with a chart, its latest value and what to watch.`, `<b></b>${picks.length} <a href="#metrics/picks"></a>`)}</p>` : ''}
   <div class="card ccard" id="cc-omX" style="margin-bottom:16px"><div class="chead"><div class="ct">${L('Metric explorer', '')} <select id="omSel" aria-label="${L('Choose metric', '')}" style="margin-left:6px;max-width:260px">${secs.map(s => `<optgroup label="${esc(s === 'Metrics' ? L('Metrics', '') : tr(s))}">${numKeys.filter(k => (SEC[k] || 'Metrics') === s).map(k => `<option value="${esc(k)}" ${k === ret ? 'selected' : ''}>${esc(tr(k))}</option>`).join('')}</optgroup>`).join('')}</select></div>
     <div class="ctools"><div class="seg" data-k="mode"><button data-v="v" class="on">${L('Value', '')}</button><button data-v="q">${L('QoQ %', ' %')}</button><button data-v="y">${L('YoY %', ' %')}</button></div><div class="seg" data-k="range"><button data-v="8">${rg[0][1]}</button><button data-v="12">${rg[1][1]}</button><button data-v="all" class="on">${rg[2][1]}</button></div><span class="ztools"><button class="ib" data-z="in" aria-label="${L('Zoom in', '')}">+</button><button class="ib" data-z="out" aria-label="${L('Zoom out', '')}">−</button><button class="ib wide" data-z="reset">${L('Reset', '')}</button></span></div></div>
     <div class="chartbox" style="height:330px"><canvas id="omX"></canvas></div><div class="chint">${L('Pick any metric, or click a card below. Hover or tap for values · drag to pan · pinch or Ctrl+scroll to zoom', ' ·  ·  Ctrl+')}</div><div class="reinsboxes"></div></div>
   ${secs.map(s => `<h3>${esc(s === 'Metrics' ? L('Metrics', '') : tr(s))}</h3><div class="grid g4">${numKeys.filter(k => (SEC[k] || 'Metrics') === s).map(k => { const [v, i] = lastOf(k); const [pv, pj] = prevOf(k, i); const g = gfind(k); const n = Sx[k].filter(x => x != null).length;
     return `<div class="card kpi omc" data-k="${esc(k)}" style="cursor:pointer" title="${L('Click to load into the metric explorer', '')}"><div class="l">${esc(tr(k))} ${g ? info(g[0]) : ''}</div><div class="v">${fv(k, v)}</div><div class="s">${esc(QQ[i] || '')}${pv != null ? ` · ${L('prior', '')} ${fv(k, pv)} (${esc(QQ[pj])})` : ''} · ${L(`${n} qtrs`, `${n} `)}</div><div class="spark"><canvas id="oms${numKeys.indexOf(k)}"></canvas></div></div>`; }).join('')}</div>`).join('')}
   ${txtKeys.length ? `<h3>${L('Disclosed qualitative metrics', '')}</h3><div class="xscope">${xallBtns()}${txtKeys.map(k => details(esc(tr(k)), `<ul class="lst">${qs.text[k].map((v, i) => v ? `<li><b>${esc(QQ[i])}${L(':', '')}</b> ${linkify(String(tr(v)))}</li>` : '').join('')}</ul>`, L(`${qs.text[k].filter(Boolean).length} quarters`, `${qs.text[k].filter(Boolean).length} `))).join('')}</div>` : ''}
   <h3>${L('All operating metrics', '')}</h3>${details(L('Full operating metrics table', ''), tableBlock(sh.tables[0], {id: 'tOm', maxh: 640, notes: []}), L('every metric, every quarter', ''))}
   `;
  numKeys.forEach((k, i) => { const v = Sx[k]; const s0 = v.findIndex(x => x != null); spark('oms' + i, v.slice(s0), C.acc, QQ.slice(s0)); });
  picks.forEach((p, i) => { const m = PICKMAP.find(([a]) => a.test(p.name)); const sk = m ? findS(m[1]) : null; if (sk) { const v = Sx[sk]; const s0 = v.findIndex(x => x != null); spark('pk' + i, v.slice(s0), C.acc, QQ.slice(s0)); } });
  const st = {k: ret};
  wireCard({id: 'omX', reins: 1, build: s => { const v = Sx[st.k]; const s0 = Math.max(rangeSlice(QQ, s), v.findIndex(x => x != null)); const u = /%/.test(st.k) ? '%' : /\(\$m\)/.test(st.k) ? '$m' : /\(\$\)/.test(st.k) ? '$' : '';
    return {type: 'line', labels: QQ.slice(s0), datasets: [{label: tr(st.k), data: v.slice(s0), borderColor: C.acc, backgroundColor: C.acc3, fill: true, spanGaps: true, unit: u}]}; }});
  const load = k => { st.k = k; $('#omSel').value = k; const b = $('#cc-omX .seg[data-k="mode"] button.on'); (b || $('#cc-omX .seg button')).click(); $('#cc-omX').scrollIntoView({behavior: 'smooth', block: 'center'}); };
  $('#omSel').onchange = () => load($('#omSel').value);
  $$('.omc').forEach(c => c.onclick = e => { if (e.target.closest('[data-tip]')) return; load(c.dataset.k); });
  $$('.pick').forEach(c => c.onclick = e => { const a = e.target.closest('[data-load]'); if (a) { e.preventDefault(); load(a.dataset.load); return; } if (e.target.closest('[data-tip]')) return; const d = c.querySelector('.pk-d'); d.hidden = !d.hidden; });
}
/* ---------------- Metric Picks: what to watch ---------------- */
function picksTab() {
  const P = D.sheets[OPT.picks.sheet], pt = P.tables[0]; const pc = re => pt.columns.findIndex(c => re.test(c));
  const picks = pt.rows.filter(Array.isArray).map(r => ({name: String(r[pc(/^metric/i)] || ''), why: r[pc(/why/i)], latest: r[pc(/latest/i)], watch: r[pc(/trend|watch/i)], chart: r[pc(/chart/i)]}));
  const om = OPT.opmetrics ? OPT.opmetrics.qs : null; const QQ = om ? om.quarters : [], Sx = om ? om.series : {};
  const f = re => { const k = Object.keys(Sx).find(k => re.test(k)); return k ? Sx[k] : null; };
  const line = (label, re, color, extra = {}) => { const d = f(re); return d ? Object.assign({type: 'line', label, data: d, borderColor: color, spanGaps: true}, extra) : null; };
  const bar = (label, re, color, extra = {}) => { const d = f(re); return d ? Object.assign({type: 'bar', label, data: d, backgroundColor: color}, extra) : null; };
  const y1 = {y1: {position: 'right', grid: {drawOnChartArea: false}}};
  const SPEC = [
    [/lae/i, () => ({datasets: [line(L('LAE ratio (%)', 'LAE %'), /^lae ratio/i, C.acc, {unit: '%'}), line(L('IFP per employee ($m)', ' IFP'), /ifp per employee/i, C.g, {yAxisID: 'y1', unit: '$m'})], scales: y1, unit: '%'})],
    [/in-?force|ifp/i, () => ({datasets: [bar(L('IFP ($m)', 'IFP'), /^in-?force premium/i, C.acc2, {unit: '$m'}), line(L('IFP YoY %', 'IFP  %'), /^ifp yoy/i, C.acc, {yAxisID: 'y1', unit: '%', keep: 1})], scales: y1, reins: 1})],
    [/gross loss ratio/i, () => ({datasets: [line(L('Gross loss ratio', ''), /^gross loss ratio \(/i, C.acc), line(L('TTM gross loss ratio', 'TTM '), /^ttm gross loss/i, C.g), line(L('GLR ex-CAT & PPD', 'GLR CAT  PPD'), /ex-cat/i, C.b), line(L('Net loss ratio', ''), /^net loss ratio/i, C.r)], unit: '%'})],
    [/gross profit/i, () => ({datasets: [line(L('Gross profit margin (%)', '%'), /^gross profit margin/i, C.acc), line(L('Adj. gross profit / GEP (%)', ' / GEP%'), /adj\. gross profit \/ gep/i, C.g)], unit: '%', reins: 1})],
    [/ebitda/i, () => ({datasets: [bar(L('Adj. EBITDA ($m)', ' EBITDA'), /^adj\. ebitda/i, C.acc, {unit: '$m'}), line(L('Net loss as % of GEP', ' GEP '), /net loss as % of gep/i, C.g, {yAxisID: 'y1', unit: '%'})], scales: y1})],
    [/fcf|cash/i, () => ({datasets: [line(L('Cash & investments ($m)', ''), /^cash & investments/i, C.acc), bar(L('GC Synthetic Agents borrowings ($m)', 'GC Synthetic Agents '), /synthetic agents borrowings/i, C.g), bar(L('Adj. FCF ($m)', ' FCF'), /^adj\. fcf/i, C.b)], unit: '$m'})],
    [/growth spend/i, () => ({datasets: [bar(L('Growth spend ($m)', ''), /^growth spend/i, C.acc, {unit: '$m'}), line(L('IFP added QoQ ($m)', 'IFP '), /^in-?force premium/i, C.g, {unit: '$m', keep: 1})].map((d, i) => { if (d && i === 1) d.data = d.data.map((v, j) => j && v != null && d.data[j - 1] != null ? +(v - d.data[j - 1]).toFixed(1) : null); return d; }), unit: '$m'})],
    [/retention|adr/i, () => ({datasets: [line(L('Annual dollar retention (%)', '%'), /annual dollar retention/i, C.acc, {unit: '%'}), line(L('Premium per customer ($)', ''), /^premium per customer \(/i, C.g, {yAxisID: 'y1', unit: '$'})], scales: y1})],
    [/product mix|segment/i, () => ({datasets: [bar(L('Home/renters US', '/'), /^ifp - home/i, C.acc), bar(L('Pet', ''), /^ifp - pet/i, C.acc2), bar(L('Car', ''), /^ifp - car/i, C.g), bar(L('Europe', ''), /^ifp - europe/i, C.b)], stacked: true, unit: '$m'})]];
  const specs = picks.map((p, i) => { const m = SPEC.find(([re]) => re.test(p.name)); return m && om ? m[1]() : null; });
  $('#blk-picks').innerHTML = `
   ${P.title ? `<div class="mut" style="font-size:13px;margin-bottom:4px">${esc(tr(P.title))}</div>` : ''}${fnote(P.pre, L('About this data', ''))}
   <div class="card" style="margin-bottom:16px"><h3 style="margin-top:0">${L('Checklist', '')}</h3>${picks.map((p, i) => `<div class="cat"><div class="when" style="width:28px">${i + 1}</div><div style="flex:1"><a href="#metrics/picks" data-go="pk-${i}"><b>${esc(tr(p.name).replace(/^\d+\.\s*/, ''))}</b></a><div class="mut" style="font-size:12.5px">${esc(tr(p.watch || ''))}</div></div><div class="dd" style="max-width:200px;white-space:normal;text-align:right">${esc(tr(p.latest || ''))}</div></div>`).join('')}</div>
   <div class="grid g2">${picks.map((p, i) => `<div id="pk-${i}" style="scroll-margin-top:70px">${specs[i] && specs[i].datasets.some(Boolean) ? ccard({id: 'pkc' + i, title: tr(p.name), growth: 0, reins: specs[i].reins, ranges: RNG(), h: 260}) : `<div class="card"><div class="ct" style="font-weight:600">${esc(tr(p.name))}</div></div>`}
     <div class="card" style="margin-top:-8px;border-top-left-radius:0;border-top-right-radius:0;padding-top:12px"><div class="kpi"><div class="l">${L('Latest', '')} (${esc(D.hero.quarter)})</div><div class="v" style="font-size:18px">${esc(tr(p.latest) || NA())}</div></div>
     <p style="font-size:13px;margin:8px 0 6px"><b>${L('What to watch:', '')}</b> ${esc(tr(p.watch || ''))}</p>${details(L('Why it matters', ''), esc(tr(p.why || '')), esc(tr(p.chart || '')))}</div></div>`).join('')}</div>
   <h3>${L('Table view', '')}</h3>${details(L('All picks in one table', ''), tableBlock(pt, {id: 'tPk', wrap: true, terms: false}), L(`${picks.length} metrics`, `${picks.length} `))}`;
  specs.forEach((sp, i) => { if (!sp || !sp.datasets.some(Boolean)) return; wireCard({id: 'pkc' + i, reins: sp.reins, unit: sp.unit || '', build: st => { const s0 = rangeSlice(QQ, st); const ds = sp.datasets.filter(Boolean).map(d => Object.assign({}, d, {data: d.data.slice(s0)}));
    const first = Math.min(...ds.map(d => d.data.findIndex(v => v != null)).filter(x => x >= 0)); return {labels: QQ.slice(s0 + first), datasets: ds.map(d => Object.assign(d, {data: d.data.slice(first)})), stacked: sp.stacked, scales: Object.assign({}, sp.scales || {}, sp.stacked ? {y: {stacked: true}} : {})}; }}); });
  $$('#blk-picks [data-go]').forEach(a => a.onclick = e => { e.preventDefault(); const t = document.getElementById(a.dataset.go); t && t.scrollIntoView({behavior: 'smooth', block: 'start'}); });
}
/* ---------------- router ---------------- */
/* ---------------- Financial Statements (sub-tabs: BS, IS, CF) ---------------- */
const FINSUB = [['bs', 'Balance Sheet', () => bsTab(), ''], ['is', 'Income Statement', () => isTab(), ''], ['cf', 'Cash Flow Statement', () => cfTab(), '']];
const finDone = {};
function finShow(id) {
  if (!FINSUB.some(f => f[0] === id)) id = 'bs';
  $$('#finsub button').forEach(b => b.classList.toggle('on', b.dataset.v === id));
  FINSUB.forEach(([k]) => { const e = $('#s-' + k); if (e) e.hidden = k !== id; });
  if (!finDone[id]) { finDone[id] = 1; try { FINSUB.find(f => f[0] === id)[2](); } catch (e) { console.error('render ' + id, e); $('#s-' + id).insertAdjacentHTML('beforeend', `<div class="tvfail">${L('This statement could not render', '')}: ${esc(e.message)}</div>`); } }
}
function finTab() {
  for (const k in finDone) delete finDone[k];
  $('#s-fin').innerHTML = `<h2>${L('Financial Statements', '')} <span class="mut">${L("From Lemonade's 10-Q and 10-K filings", ' Lemonade  10-Q  10-K ')}</span></h2><div class="subtabs" id="finsub" role="tablist">${FINSUB.map(([k, l, , z]) => `<button role="tab" data-v="${k}">${esc(L(l, z))}</button>`).join('')}</div>${FINSUB.map(([k]) => `<div id="s-${k}" hidden></div>`).join('')}`;
  $$('#finsub button').forEach(b => b.onclick = () => { location.replace('#fin/' + b.dataset.v); finShow(b.dataset.v); });
  finShow((location.hash.split('/')[1] || 'bs'));
}
/* ---------------- Added sections (extra.js): loss-ratio breakdown, growth by product & state, cash runway, insider selling over time, cohorts, bear checks, what changed this week ---------------- */
const X = window.LMND_EXTRA || null;
const XQ = X ? X.quarters.map(qshort) : [];
const srcA = (u, t) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t || L('source', ''))}</a>`;
const qsrc = () => X.quarters.map((q, i) => srcA(X.letters[i], qshort(q))).join(' · ');
/* figure card: big number on top, chart behind it (same look as the Overview KPI cards) */
function fcard(id, label, v, s, key) { return `<div class="card kpi"><div class="l">${label}${key ? ' ' + info(key) : ''}</div><div class="v">${v}</div><div class="s">${s}</div><div class="spark"><canvas id="${id}"></canvas></div></div>`; }
const xs = (id, data, labels) => { const c = spark(id, data, C.acc, labels || XQ); if (c) { c.data.datasets[0].pointRadius = data.map((_, j) => j === data.length - 1 ? 3.5 : 0); c.data.datasets[0].pointBackgroundColor = C.acc; c.update('none'); } };
const pp = v => v == null ? NA() : (v < 0 ? '(' + Math.abs(v) + '%)' : v + '%');

/* 7) What changed this week — Overview */
function weekCard() {
  if (!X) return ''; const W = X.week;
  const kind = {company: [L('Company', ''), 'acc'], market: [L('Market', ''), 'other'], social: [L('X commentary', 'X '), 'other']};
  const fl = W.filings.length ? W.filings.map(f => `<li><b>${esc(dlong(f.date))}</b> · SEC ${esc(f.form)} · ${srcA(f.url, 'EDGAR')}</li>`).join('')
    : `<li>${L(`No new SEC filings between ${dlong(W.from)} and ${dlong(W.to)}.`, `${dlong(W.from)}${dlong(W.to)} SEC `)}${W.last_filing ? ' ' + L(`Latest: Form ${esc(W.last_filing.form)} on ${dlong(W.last_filing.date)}`, `${dlong(W.last_filing.date)}  Form ${esc(W.last_filing.form)}`) + ' · ' + srcA(W.last_filing.url, 'EDGAR') : ''}</li>`;
  const it = [...W.finds].sort((a, b) => b.date.localeCompare(a.date)).map(x => `<li><b>${esc(dlong(x.date))}</b> <span class="pill ${kind[x.kind][1]}">${kind[x.kind][0]}</span> ${esc(tr(x.txt))} · ${srcA(x.src)}</li>`).join('');
  return `<div class="card wkcard" style="margin-bottom:16px;border-left:3px solid var(--acc)"><h3 style="margin-top:0">${L('What changed this week', '')} <span class="mut" style="font-size:12px;font-weight:400">${esc(dlong(W.from))} – ${esc(dlong(W.to))} · ${L('from SEC EDGAR and the daily X & web scan', ' SEC EDGAR  X ')}</span></h3>
   <div class="flab">${L('SEC filings', 'SEC ')}</div><ul class="lst">${fl}</ul><div class="flab">${L('Scan findings (newest first)', '')}</div><ul class="lst">${it}</ul></div>`;
}

/* 1) Loss-ratio breakdown — Insurance KPIs (replaces the old components chart) */
function lrBlock() {
  if (!X) return ''; const R = X.lr; const n = XQ.length - 1;
  const rows = XQ.map((q, i) => [q, pp(R.attr[i]), pp(R.cat[i]), pp(R.lae[i]), pp(R.ppd[i]), pp(R.cat_ppd[i]), pp(R.noncat_ppd[i]), pp(R.glr[i])]).reverse();
  return `<h3 id="lrbd">${L('Loss-ratio breakdown', '')} <span class="mut" style="font-size:12px;font-weight:400">${esc(X.quarters[0])} – ${esc(X.quarters[n])}</span></h3>
   <div class="grid g4" style="margin-bottom:16px">${[['lrG', L('Gross loss ratio', ''), R.glr, 'GLR'], ['lrA', L('Current-year attritional', ''), R.attr, null], ['lrC', L('Catastrophe losses (excl. PPD)', ' PPD'), R.cat, 'CAT'], ['lrP', L('Prior-year reserve development', ''), R.ppd, 'PPD']].map(([id, l, s, k]) =>
     fcard(id, l, pp(s[n]), `${esc(XQ[n])} · ${L('year ago', '')} ${pp(s[n - 4])}`, k)).join('')}</div>
   ${ccard({id: 'kLrB', title: L('Gross loss ratio split: attritional + CAT + LAE + prior-year development (pp of GEP)', ' +  + LAE +  GEP '), tip: 'GLR'})}
   ${tableBlock({title: L('Gross loss ratio breakdown by quarter (newest first)', ''), columns: [L('Quarter', ''), L('Attritional', ''), L('CAT excl. PPD', 'CAT PPD'), L('LAE excl. PPD', 'LAE PPD'), L('Prior-year development', ''), L('of which CAT PPD', ' CAT PPD'), L('of which non-CAT PPD', ' CAT PPD'), L('Gross loss ratio', '')], rows,
     notes: [L('Attritional + CAT + LAE + PPD = gross loss ratio; negative PPD means earlier-year reserves were released (favourable).', ' +  + LAE + PPD = PPD '), L('Source', '') + ': ' + srcA(R.src, tr(R.src_note))]}, {id: 'tLrB', raw: true})}`;
}
function lrWire() {
  if (!X) return; const R = X.lr;
  [['lrG', R.glr], ['lrA', R.attr], ['lrC', R.cat], ['lrP', R.ppd]].forEach(([id, s]) => xs(id, s));
  wireCard({id: 'kLrB', unit: '%', build: () => ({labels: XQ, stacked: true, datasets: [{type: 'bar', label: L('Attritional', ''), data: R.attr, backgroundColor: C.acc, stack: 's'}, {type: 'bar', label: L('CAT excl. PPD', 'CAT PPD'), data: R.cat, backgroundColor: C.y, stack: 's'},
    {type: 'bar', label: L('LAE excl. PPD', 'LAE PPD'), data: R.lae, backgroundColor: C.b, stack: 's'}, {type: 'bar', label: L('Prior-year development', ''), data: R.ppd, backgroundColor: C.r, stack: 's'},
    {type: 'line', label: L('Gross loss ratio', ''), data: R.glr, borderColor: C.g, keep: true}], scales: {y: {stacked: true, ticks: {callback: v => v + '%'}}}})});
}

/* 5) Cohort & retention — Insurance KPIs */
function cohortBlock() {
  if (!X) return '';
  return `<h3>${L('Cohorts & retention', '')}</h3><div class="grid g2" style="margin-bottom:16px">
   <div class="card"><div class="mut" style="font-size:12.5px;margin-bottom:6px">${L('Lemonade’s letters and 10-Q do not publish annual dollar retention or premium per customer by signup cohort, so no cohort table is shown. What the filings do say about cohorts, newest first:', 'Lemonade  10-Q ')}</div>
    <ul class="lst">${X.cohort.map(c => `<li><b>${esc(dlong(c.date))}</b> · ${esc(tr(c.q))}${L(':', '')} ${esc(tr(c.txt))} · ${srcA(c.src)}</li>`).join('')}</ul></div>
   <div class="grid g2">${fcard('chAdr', L('Annual dollar retention', ''), X.adr[X.adr.length - 1] + '%', `${esc(XQ[XQ.length - 1])} · ${L('whole book', '')} · ${qsrc()}`, 'ADR')}${fcard('chPpc', L('Premium per customer', ''), '$' + fmt(X.ppc[X.ppc.length - 1]), `${esc(XQ[XQ.length - 1])} · ${L('whole book', '')} · ${qsrc()}`, 'PPC')}</div></div>`;
}
function cohortWire() { if (!X) return; xs('chAdr', X.adr); xs('chPpc', X.ppc); }

/* 2) Growth by product & state — Product Rollout */
const PRODZ = {'Homeowners multi-peril': '', Pet: '', Car: '', 'Europe (all products)': '', Other: ''};
function growthBlock() {
  if (!X) return ''; const I = X.ifp, n = XQ.length - 1; const P = ['Pet', 'Car', 'Homeowners multi-peril', 'Europe (all products)', 'Other'];
  const yoy = s => s[n - 4] ? (s[n] / s[n - 4] - 1) * 100 : null;
  return `<h3 style="margin-top:0">${L('Growth by product and state', '')} <span class="mut" style="font-size:12px;font-weight:400">${L('in-force premium by product, ', '')}${esc(X.quarters[0])} – ${esc(X.quarters[n])}</span></h3>
   <div class="grid g4" style="margin-bottom:12px">${P.slice(0, 4).map((p, k) => fcard('gp' + k, `${esc(L(p, PRODZ[p]))} IFP`, money(I[p][n], 0), `<span class="${pcls(yoy(I[p]))}">${pct(yoy(I[p]))}</span> ${L('YoY', '')} · ${fmt(I[p][n] / I.total[n] * 100, 0)}% ${L('of IFP', ' IFP')}`, 'IFP')).join('')}</div>
   ${tableBlock({title: L('IFP by product ($m) and customers, newest first', ' IFP'), columns: [L('Quarter', ''), ...P.map(p => L(p, PRODZ[p])), L('Total IFP', 'IFP '), L('Customers', ''), L('Source', '')],
     rows: XQ.map((q, i) => [q, ...P.map(p => I[p][i]), I.total[i], I.customers[i], `<a href="${esc(I.src[i])}" target="_blank" rel="noopener">${L('letter', '')}</a>`]).reverse(),
     notes: [L('Customers are disclosed only for the whole company, not per product. Renters are reported inside Homeowners multi-peril (home, condo and renters); Life is not broken out.', '')]}, {id: 'tGp', raw: true})}
   <div class="card" style="margin:16px 0"><h3 style="margin-top:0">${L('State launches since Q2 2025 (newest first)', '2025 ')}</h3><ul class="lst">${X.launches.map(x => `<li><b>${esc(dlong(x.date))}</b> · <span class="pill acc">${esc(tr(x.states))}</span> ${esc(tr(x.what))} · ${srcA(x.src, tr(x.by))}</li>`).join('')}</ul></div>`;
}
function growthWire() { if (!X) return; ['Pet', 'Car', 'Homeowners multi-peril', 'Europe (all products)'].forEach((p, k) => xs('gp' + k, X.ifp[p])); }

/* 3) Cash runway — Financials › Cash Flow */
function runwayBlock() {
  if (!X) return ''; const K = X.cash, n = XQ.length - 1;
  const rw = K.runway_q != null ? L(`~${fmt(K.runway_q)} quarters`, ` ${fmt(K.runway_q)} `) : L('No burn', '');
  return `<h3 style="margin-top:0">${L('Cash runway', '')} <span class="mut" style="font-size:12px;font-weight:400">${esc(X.quarters[0])} – ${esc(X.quarters[n])}</span></h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('rwC', L('Cash & investments', ''), money(K.cash[n], 0), `${esc(XQ[n])} · ${srcA(K.src[n], L('letter', ''))}`)}
    ${fcard('rwO', L('Operating cash flow', ''), money(K.opcf[n]), `${esc(XQ[n])} · ${L('TTM free cash flow', 'TTM ')} ${money(K.ttm_fcf)}`)}
    ${fcard('rwG', L('General Catalyst Synthetic Agents debt', 'General Catalyst Synthetic Agents '), money(K.gc[n]), `${esc(XQ[n])} · ${L('interest', '')} $${fmt(K.gc_int['Q2 2026'], 1)}m ${L('in the quarter', '')} · ${srcA(K.gc_terms_src, '10-Q')}`, 'Synthetic Agents')}
    ${fcard('rwR', L('Runway at current burn', ''), rw, L(`cash & investments ÷ ${XQ[n]} free cash outflow of ${money(-K.fcf[n])}`, ` ÷ ${XQ[n]}  ${money(-K.fcf[n])}`))}</div>
   ${ccard({id: 'rwCh', title: L('Operating cash flow, free cash flow and Synthetic Agents debt ($m)', ' Synthetic Agents '), tip: 'Synthetic Agents', unit: '$m'})}
   ${fnote([L(`Runway is a simple ratio: ${XQ[n]} cash & investments of ${money(K.cash[n], 0)} divided by that quarter’s free cash outflow (operating cash flow minus capex). Free cash flow over the last four quarters was ${money(K.ttm_fcf)}, i.e. not burning on a TTM basis. Much of the cash sits in regulated insurance subsidiaries and cannot all be moved to the parent.`, `${XQ[n]}  ${money(K.cash[n], 0)}  ${money(K.ttm_fcf)} TTM `),
     L('GC terms (10-Q): GC advances 50–80% of growth spend and is repaid from cohort premiums with a 16% return; up to $200m more for 2026; from 1 Jan 2027 new financing moves to Hannover Re (up to $250m outstanding).', 'GC 10-QGC  50–80%  16%2026  2  2027  1  1  Hannover Re 2.5 ') + ' ' + srcA(K.gc_terms_src, '10-Q'),
     L('Quarterly figures', '') + ': ' + qsrc()], L('Notes & sources', ''), true)}`;
}
function runwayWire() {
  if (!X) return; const K = X.cash; xs('rwC', K.cash); xs('rwO', K.opcf); xs('rwG', K.gc); xs('rwR', K.fcf);
  wireCard({id: 'rwCh', unit: '$m', build: () => ({labels: XQ, datasets: [{type: 'bar', label: L('Operating cash flow', ''), data: K.opcf, backgroundColor: C.acc}, {type: 'bar', label: L('Free cash flow', ''), data: K.fcf, backgroundColor: C.r},
    {type: 'line', label: L('Synthetic Agents debt (EOP)', 'Synthetic Agents '), data: K.gc, borderColor: C.g, yAxisID: 'y1'}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})});
}

/* 4) Insider selling over time — Insiders (from Form 4 lines in data.js) */
const IGRP = r => /schreiber/i.test(r.insider) ? 'Schreiber' : /wininger/i.test(r.insider) ? 'Wininger' : /director/i.test(r.role || '') && !/officer|chief|president/i.test(r.role || '') ? 'Board' : 'Other officers';
const IGZ = {Schreiber: ['Daniel Schreiber (CEO)', 'Daniel SchreiberCEO'], Wininger: ['Shai Wininger (President)', 'Shai Wininger'], 'Other officers': ['Other officers', ''], Board: ['Board (non-executive)', '']};
const accUrl = f => 'https://www.sec.gov/Archives/edgar/data/1691421/' + String(f || '').replace('.xml', '').replace(/-/g, '') + '/';
function isellRows() { return D.form4.filter(r => (r.code === 'S' || r.code === 'P') && r.tdate >= '2025-04-01' && r.price).map(r => ({...r, g: IGRP(r), v: (r.code === 'S' ? 1 : -1) * r.shares * r.price, k: r.code === 'P' ? 'buy' : r.plan ? 'planned' : r.tax ? 'tax' : 'nonplan'})).sort((a, b) => a.tdate.localeCompare(b.tdate)); }
function isellBlock() {
  const rs = isellRows(); const G = Object.keys(IGZ); const tot = g => rs.filter(r => r.g === g).reduce((a, r) => a + r.v, 0);
  const KL = {planned: L('10b5-1 plan', '10b5-1 '), nonplan: L('Discretionary', ''), tax: L('Sell-to-cover (tax)', ''), buy: L('Purchase', '')};
  const by = k => rs.filter(r => r.k === k).reduce((a, r) => a + r.v, 0);
  return `<h3>${L('Insider selling over time', '')} <span class="mut" style="font-size:12px;font-weight:400">${L(`Form 4, ${dlong(rs[0].tdate)} – ${dlong(rs[rs.length - 1].tdate)}`, `Form 4${dlong(rs[0].tdate)} – ${dlong(rs[rs.length - 1].tdate)}`)}</span></h3>
   <div class="grid g4" style="margin-bottom:12px">${G.map((g, k) => fcard('isg' + k, esc(L(...IGZ[g])), '$' + fmt(tot(g) / 1e6, 2) + 'm', L(`net sold · ${rs.filter(r => r.g === g).length} sale lines`, ` · ${rs.filter(r => r.g === g).length} `))).join('')}</div>
   ${ccard({id: 'isCum', title: L('Cumulative net insider sales ($m)', ''), tip: '10b5-1', h: 300})}
   <div class="mut" style="font-size:12.5px;margin:6px 0 10px">${L('By type', '')}: ${['planned', 'nonplan', 'tax'].map(k => `<span class="pill ${k}">${KL[k]}</span> $${fmt(by(k) / 1e6, 2)}m`).join(' · ')}</div>
   ${details(L('Every sale, newest first, with its Form 4', ' Form 4'), tableBlock({columns: [L('Date', ''), L('Insider', ''), L('Group', ''), L('Type', ''), L('Shares', ''), L('Price', ''), L('Value', ''), 'Form 4'],
     rows: [...rs].reverse().map(r => [r.tdate, r.insider, L(...IGZ[r.g]), `<span class="pill ${r.k === 'buy' ? 'other' : r.k}">${KL[r.k]}</span>`, r.shares, '$' + fmt(r.price, 2), '$' + fmt(Math.abs(r.v)), `<a href="${accUrl(r.filing)}" target="_blank" rel="noopener">EDGAR</a>`])}, {id: 'tIsell', raw: true, notitle: 1}), L(`${rs.length} lines`, `${rs.length} `))}
   ${fnote([L('Net sales = open-market sales (code S) minus purchases (code P), at the Form 4 price. 10b5-1 = sale under a pre-set Rule 10b5-1 plan (box or footnote); sell-to-cover = shares sold to pay tax on vesting RSUs; discretionary = any other sale. Shai Wininger filed no sales in this window. Gifts, grants and option exercises are excluded.', ' =  S P Form 4 10b5-1 =  Rule 10b5-1  =  RSU  =  Shai Wininger ')], L('How this is counted', ''), true)}`;
}
function isellWire() {
  const rs = isellRows(); const G = Object.keys(IGZ); const days = [...new Set(rs.map(r => r.tdate))];
  const cum = g => { let a = 0; return days.map(d => { rs.filter(r => r.g === g && r.tdate === d).forEach(r => a += r.v); return +(a / 1e6).toFixed(3); }); };
  G.forEach((g, k) => { const c = cum(g); xs('isg' + k, c.length ? c : [0], days); });
  const pal = [C.acc, C.g, C.b, C.y];
  wireCard({id: 'isCum', unit: '$m', build: () => ({type: 'line', labels: days.map(d => dl(mdy(d) + (LANG === 'zh' ? '' : ' ’' + d.slice(2, 4)))), datasets: G.map((g, k) => ({label: L(...IGZ[g]), data: cum(g), borderColor: pal[k], stepped: true, pointRadius: days.map(d => rs.some(r => r.g === g && r.tdate === d) ? 3 : 0),
    pointBackgroundColor: pal[k]})), scales: {y: {title: {display: true, text: '$m'}}}})});
}

/* 6) Bear checks — Metrics & Street */
function bearBlk() {
  const el = $('#blk-bear'); if (!el || !X) return; const pb = X.pb, PL = X.pb_latest, S = X.si; const s0 = S[S.length - 1];
  el.innerHTML = `<h2 class="bh">${L('Bear checks', '')} <span class="mut">${L('price/book, litigation, short interest', '')}</span></h2>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('brPb', L('Price / book', ''), fmt(PL.pb, 2) + 'x', L(`$${fmt(PL.close, 2)} close ${dlong(PL.date)} ÷ ${PL.bv_q} book value $${fmt(PL.bvps, 2)}/share`, `${dlong(PL.date)}  $${fmt(PL.close, 2)} ÷ ${PL.bv_q}  $${fmt(PL.bvps, 2)}`))}
    ${fcard('brSi', L('Short interest', ''), fmt(s0[1] / 1e6, 2) + 'm ' + L('shares', ''), L(`${dlong(s0[0])} · ${fmt(s0[1] / 1e6 / X.shares_latest * 100, 1)}% of shares outstanding · ${fmt(s0[2], 1)} days to cover`, `${dlong(s0[0])} ·  ${fmt(s0[1] / 1e6 / X.shares_latest * 100, 1)}% ·  ${fmt(s0[2], 1)} `))}
    ${fcard('brDc', L('Days to cover', ''), fmt(s0[2], 1), L(`FINRA settlement ${dlong(s0[0])}`, `FINRA  ${dlong(s0[0])}`))}
    ${fcard('brBv', L('Book value per share', ''), '$' + fmt(PL.bvps, 2), L(`${PL.bv_q} · equity ÷ shares outstanding`, `${PL.bv_q} ·  ÷ `))}</div>
   ${charts2([{id: 'brPbC', title: L('Price / book at each quarter end (x)', '')}, {id: 'brSiC', title: L('Short interest (m shares) and days to cover', '')}])}
   ${tableBlock({title: L('Price / book by quarter (newest first)', ''), columns: [L('Quarter', ''), L('Close', ''), L('Book value / share', ''), L('P/B', ''), L('Source', '')],
     rows: [[L(`Latest (${PL.date})`, `${PL.date}`), '$' + fmt(PL.close, 2), '$' + fmt(PL.bvps, 2), fmt(PL.pb, 2) + 'x', srcA(X.px_src, 'Nasdaq') + ' · ' + srcA(pb[pb.length - 1].src, L('letter', ''))], ...[...pb].reverse().map(r => [qshort(r.q), '$' + fmt(r.close, 2), '$' + fmt(r.bvps, 2), fmt(r.pb, 2) + 'x', srcA(X.px_src, 'Nasdaq') + ' · ' + srcA(r.src, L('letter', ''))])]}, {id: 'tPb', raw: true})}
   <div class="card" style="margin:16px 0"><h3 style="margin-top:0">${L('Litigation status', '')}</h3><ul class="lst">${X.legal.map(x => `<li><b>${esc(dlong(x.date))}</b> · ${esc(tr(x.txt))} · ${srcA(x.src)}</li>`).join('')}</ul>
    <div class="mut" style="font-size:12px">${L('No Homesite lawsuit or settlement appears in Lemonade’s 10-Q, shareholder letters or news search, so none is shown.', 'Lemonade  10-Q Homesite ')}</div></div>
   ${fnote([L('Short interest: FINRA consolidated equity short interest, twice-monthly settlement dates', 'FINRA ') + ' · ' + srcA(X.si_src, L('FINRA', 'FINRA ')), L('Book value: stockholders’ equity ÷ shares outstanding at quarter end, from the shareholder letters; closes from Nasdaq historical prices.', ' ÷  Nasdaq ') + ' ' + qsrc()], L('Notes & sources', ''), true)}`;
  xs('brPb', [...pb.map(r => r.pb), PL.pb], [...XQ, PL.date]); xs('brSi', S.map(r => r[1] / 1e6), S.map(r => r[0])); xs('brDc', S.map(r => r[2]), S.map(r => r[0])); xs('brBv', pb.map(r => r.bvps));
  wireCard({id: 'brPbC', unit: 'x', build: () => ({labels: [...XQ, L('Latest', '')], datasets: [{type: 'bar', label: L('Price / book', ''), data: [...pb.map(r => r.pb), PL.pb], backgroundColor: C.acc}]})});
  wireCard({id: 'brSiC', build: () => ({labels: S.map(r => dl(mdy(r[0]) + (LANG === 'zh' ? '' : ' ’' + r[0].slice(2, 4)))), datasets: [{type: 'bar', label: L('Short interest (m shares)', ''), data: S.map(r => +(r[1] / 1e6).toFixed(2)), backgroundColor: C.acc, unit: 'm'}, {type: 'line', label: L('Days to cover', ''), data: S.map(r => r[2]), borderColor: C.g, yAxisID: 'y1', unit: L('days', '')}], scales: {y1: {position: 'right', grid: {drawOnChartArea: false}}}})});
}
/* ---------------- Risk & Q3 tab (more.js): reinsurance, catastrophe exposure, Synthetic Agents financing, Car tracker, Q3 2026 earnings preview ---------------- */
const MX = window.LMND_MORE || null;
const MQ = MX ? MX.quarters.map(qshort) : [];
const lsrc = i => srcA(MX.letters[i], L(`${qshort(MX.quarters[i])} letter, ${dlong(MX.ldate[i])}`, `${qshort(MX.quarters[i])} ${dlong(MX.ldate[i])}`));
const qsrcM = () => MX.quarters.map((q, i) => srcA(MX.letters[i], qshort(q))).join(' · ');
const tqsrc = () => srcA(MX.tenq, L(`Q2 2026 10-Q, ${dlong(MX.tenq_d)}`, `2026  10-Q${dlong(MX.tenq_d)}`));
const ZTX = {
 'Whole-account quota share with Hannover Re and MAPFRE renewed 1 Jul 2026 – 30 Jun 2027: effective cession cut from ~20% to ~18% of premium; new $40m limit per loss occurrence and $100m aggregate, catastrophe losses included. Other terms similar.': ' Hannover Re  MAPFRE  2026  7  1  2027  6  30  20%  18% 4,000  1 ',
 'Property per-risk excess-of-loss contract (claims above $750k, up to $2.25m) expired 30 Jun 2026 and was not renewed.': '75  225  2026  6  30 ',
 'Bermuda captive catastrophe excess-of-loss (above $50m per occurrence): renewed for LIC with a $50m limit per occurrence and in aggregate; not renewed for MIC.': ' 5,000 LIC  5,000 MIC ',
 'Captive quota share (Lemonade Re SPC) cession raised: MIC 35% → 40%, LIC 15% → 25%, from 1 Jul 2026.': 'Lemonade Re SPC 2026  7  1 MIC  35%  40%LIC  15%  25%',
 'Letter: the renewal adds protection against named storms, which the prior structure excluded, and shifts strategy from broad quota share toward targeted catastrophe protection in homeowners.': '',
 'Prior program (1 Jul 2025 – 30 Jun 2026): ~20% of premium ceded; hurricanes excluded; $10m per-occurrence limit on non-hurricane catastrophes; $750k per-risk cap; loss-ratio caps and variable ceding commission; funds-withheld.': '2025  7  1  2026  6  30  20%  1,000  75 ',
 'Hurricane Isaias (Florida Panhandle landfall 9 Oct): modelers put private insured losses at $1–3b. Lemonade has not commented on its exposure; Q3 results will be the first read.': ' Isaias10  9  10  30 Lemonade ',
 '10-Q: January 2025 California wildfires — subrogation rights cut net unpaid losses by $4.2m; California FAIR Plan assessment paid and expensed in Q1 2025.': '10-Q2025  1 —— 420  FAIR Plan  2025 ',
 'Original Customer Investment Agreement, through 31 Dec 2024': ' 2024  12  31 ',
 'Amended: up to an additional $140m through 31 Dec 2025': ' 2025  12  31  1.4 ',
 'Amended: up to an additional $200m for 1 Jan – 31 Dec 2026': '2026  1  1  12  31  2 ',
 'New Business Financing Agreement with Hannover Re from 1 Jan 2027: up to 80% of monthly growth spend, ≤$20m per cohort; max outstanding $150m in 2027 and $250m in 2028; return = max(0, 3-year T-bill) + 5.8% (letter: ~9.8% cost, >600 bps below GC).': ' Hannover Re  2027  1  1  80% 2,000 2027  1.5 2028  2.5  = max(0, ) + 5.8% 9.8% GC  600 ',
 'Florida FSD discount not yet live; Shai Wininger says it will be announced as soon as it is available': ' FSD Shai Wininger ',
 'Tesla HW3 / FSD v14 Lite support (30% off FSD miles)': ' HW3 / FSD v14 LiteFSD  7 ',
 'Car and Autonomous Car launched together': '',
 'Autonomous Car (50% off FSD miles)': 'FSD  5 ',
 'Autonomous Car (Tesla FSD)': ' FSD',
 'Autonomous Car launch: ~50% off FSD miles; Arizona first, Oregon in February': 'FSD  5 2 ',
 'Car launched in Pennsylvania (13th Car state)': ' 13 ',
 'Car launched in Missouri': '',
 'Car launched in Florida (~50% of US car market now covered)': ' 50% ',
 'Car launched in Indiana (~42% of the US car market covered)': ' 42% ',
 'Texas Car is written through a fronting arrangement with a third-party carrier (assumed premium).': '',
 California: '', Texas: '', Florida: ''};
const mz = s => LANG === 'zh' && ZTX[s] ? ZTX[s] : s;
const M1 = v => v == null ? NA() : money(v);
function riskTab() {
  const s = $('#s-risk'); if (!MX) { s.innerHTML = `<div class="tvfail">${L('Data file missing', '')}</div>`; return; }
  const n = MQ.length - 1, R = MX.re, CT = MX.cat, G = MX.gc, CR = MX.car, Q = MX.q3;
  const sub = t => `<span class="mut" style="font-size:12px;font-weight:400">${t}</span>`;
  const li = a => a.map(x => `<li><b>${esc(dlong(x.date))}</b>${x.st ? ` · <span class="pill acc">${esc(x.st)}</span>` : ''} ${esc(mz(x.txt))} · ${srcA(x.src)}</li>`).join('');
  const share = CR.ifp.map((v, i) => +(v / CR.tot[i] * 100).toFixed(1));
  const commitTot = G.commit.reduce((a, c) => a + c.amt, 0);
  const rng = r => r.lo == null ? NA() : r.u === 'sh' ? `${r.lo}m` : r.lo === r.hi ? money(r.lo, 0) : `${money(r.lo, 0)} – ${money(r.hi, 0)}`;
  const mid = r => r.lo == null ? null : (r.lo + r.hi) / 2;
  s.innerHTML = `<h2 class="bh">${L('Risk & Q3 preview', '')} ${sub(L('reinsurance, catastrophe exposure, growth financing, Car and the 5 Nov results', ' 11  5 '))}</h2>
  <div class="sblk" id="blk-q3"><h3>${L('Q3 2026 earnings preview', '2026 ')} ${sub(L(`results ${dlong(Q.date)} before US market open · call 8:00 am ET (9:00 pm SGT)`, `${dlong(Q.date)}  ·  8:00 9:00`) + ' · ' + srcA(Q.call_src))}</h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('q3I', L('IFP guidance', 'IFP '), `${money(1537, 0)}–${fmt(1540)}m`, `${L('vs', '')} ${MQ[n]} ${money(1434, 0)} · ${lsrc(n)}`, 'IFP')}
    ${fcard('q3R', L('Revenue guidance', ''), `${money(323, 0)}–${fmt(326)}m`, `${L('Street', '')} ${money(322.74, 2)} · ${srcA(Q.street_src, 'MarketBeat ' + dlong(Q.street_date))}`)}
    ${fcard('q3E', L('Adj. EBITDA guidance', ' EBITDA '), `${money(-23, 0)} – ${money(-20, 0)}`, `${L('implies Q4 ≈ +$8m', ' +800 ')} · ${lsrc(n)}`)}
    ${fcard('q3P', L('EPS consensus', 'EPS '), '−$0.58', `${L('company gives no EPS guidance', ' EPS ')} · ${srcA(Q.street_src, 'MarketBeat')}`)}</div>
   ${tableBlock({title: L('Scorecard: fill in actuals on 5 Nov', '11  5 '), columns: [L('Metric', ''), L('Q3 guidance', ''), L('Guidance mid', ''), L('Street consensus', ''), L('Q2 2026 actual', '2026 '), L('Q3 actual', ''), L('vs guidance mid', ''), L('vs Street', '')],
     rows: Q.rows.map(r => [L(r.k, r.z), rng(r), r.u === 'eps' || mid(r) == null ? NA() : r.u === 'sh' ? mid(r) + 'm' : money(mid(r)), r.st == null ? NA() : r.u === 'eps' ? '−$' + Math.abs(r.st).toFixed(2) : money(r.st, 2), r.q2 == null ? NA() : money(r.q2), L('due 5 Nov', '11  5 '), '—', '—']),
     notes: [L('Guidance', '') + ': ' + lsrc(n) + ' · ' + L('Street consensus (revenue, EPS) as shown on', 'EPS') + ' ' + srcA(Q.street_src, 'MarketBeat') + ` (${dlong(Q.street_date)})`,
       L('Street consensus for IFP, GEP and Adj. EBITDA is not published on free sources, so it is shown as n/a. Full-year 2026 guidance: IFP $1,632–1,639m, GEP $1,374–1,378m, revenue $1,214–1,220m, Adj. EBITDA ($51)–($47)m.', 'IFPGEP  EBITDA 2026 IFP 16.32–16.39 GEP 13.74–13.78  12.14–12.20  EBITDA  0.47–0.51 ')]}, {id: 'tQ3', raw: true})}</div>
  <div class="sblk" id="blk-reins"><h3>${L('Reinsurance', '')} ${sub(esc(MX.quarters[0]) + ' – ' + esc(MX.quarters[n]))}</h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('reC', L('Premium ceded to reinsurers', ''), R.ceded_pct[n] + '%', `${L('of gross written', '')} · ${MQ[n]} · ${L('year ago', '')} ${R.ceded_pct[n - 4]}% · ${lsrc(n)}`)}
    ${fcard('reK', L('Ceding commission income', ''), money(R.ccom[n]), `${MQ[n]} · ${L('year ago', '')} ${money(R.ccom[n - 4])} · ${lsrc(n)}`)}
    ${fcard('reG', L('Gross loss ratio', ''), R.glr[n] + '%', `${MQ[n]} · ${lsrc(n)}`, 'GLR')}
    ${fcard('reN', L('Net loss ratio', ''), R.nlr[n] + '%', `${MQ[n]} · ${L('after reinsurance', '')} · ${lsrc(n)}`, 'NLR')}</div>
   ${ccard({id: 'reCh', title: L('Ceded share of gross written premium (bars) vs gross and net loss ratio', '')})}
   ${tableBlock({title: L('Reinsurance by quarter, newest first ($m)', ''), columns: [L('Quarter', ''), L('Gross written', ''), L('Ceded written', ''), L('Ceded %', ''), L('Gross earned', ''), L('Ceded earned', ''), L('Ceding commission', ''), L('Gross LR', ''), L('Net LR', ''), L('Source', '')],
     rows: MQ.map((q, i) => [q, R.gwp[i], R.cwp[i], R.ceded_pct[i] + '%', R.gep[i], R.cep[i], R.ccom[i], R.glr[i] + '%', R.nlr[i] + '%', lsrc(i)]).reverse(),
     notes: [L('Ceded % = ceded written ÷ gross written premium (calculated). The drop after Q2 2025 reflects the 1 Jul 2025 program, which cut the quota share to ~20%.', ' =  ÷ 2025  2025  7  1  20%')]}, {id: 'tRe', raw: true})}
   <div class="card" style="margin:16px 0"><h3 style="margin-top:0">${L('1 July 2026 renewal terms', '2026  7  1 ')}</h3><ul class="lst">${li(R.terms)}</ul>
    <div class="mut" style="font-size:12px">${L('The ceding-commission rate on the renewed program is not disclosed.', '')}</div></div></div>
  <div class="sblk" id="blk-cat"><h3>${L('Catastrophe exposure', '')}</h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${CT.states.map((x, k) => fcard('ctS' + k, `${esc(mz(x.st))} ${L('share of GWP', ' GWP')}`, x.p + '%', `${MQ[n]} · ${money(x.q)} · ${L('year ago', '')} ${x.p0}% · ${tqsrc()}`)).join('')}
    ${fcard('ctC', L('Catastrophe losses (excl. PPD)', ' PPD'), CT.pp[n] + ' pp', `${L('of GEP', ' GEP')} · ≈ ${money(CT.usd[n])} · ${MQ[n]} · ${lsrc(n)}`, 'CAT')}</div>
   ${ccard({id: 'ctCh', title: L('Catastrophe losses (pp of GEP, bars) next to the gross loss ratio and GLR ex-CAT', ' GEP ')})}
   ${tableBlock({title: L('Catastrophe losses by quarter, newest first', ''), columns: [L('Quarter', ''), L('CAT excl. PPD (pp of GEP)', 'CAT PPD GEP '), L('≈ CAT losses ($m, calculated)', '≈ '), L('Gross loss ratio', ''), L('GLR ex-CAT', ''), L('Source', '')],
     rows: MQ.map((q, i) => [q, CT.pp[i], CT.usd[i], CT.glr[i] + '%', CT.exc[i] + '%', lsrc(i)]).reverse(),
     notes: [L('Dollar amounts are pp × gross earned premium, so they are approximate (the letters round pp to whole numbers). Lemonade does not disclose catastrophe losses in dollars by quarter.', ' =  × Lemonade '),
       L('State shares are gross written premium (all products) from the 10-Q segment note; premium by state and product (e.g. Florida homeowners only) and in-force premium by state are not disclosed.', ' 10-Q ') + ' ' + tqsrc()]}, {id: 'tCt', raw: true})}
   ${tableBlock({title: L('Gross written premium in the three largest catastrophe states ($m)', ''), columns: [L('State', ''), 'Q2 2026', '%', 'Q2 2025', '%', L('H1 2026', '2026 '), '%'], rows: CT.states.map(x => [mz(x.st), x.q, x.p + '%', x.q0, x.p0 + '%', x.h, x.hp + '%']), notes: [tqsrc()]}, {id: 'tCs', raw: true})}
   <div class="card" style="margin:16px 0"><h3 style="margin-top:0">${L('Catastrophe events (newest first)', '')}</h3><ul class="lst">${li(CT.notes)}</ul></div></div>
  <div class="sblk" id="blk-gc"><h3>${L('Synthetic Agents (General Catalyst financing)', 'Synthetic AgentsGeneral Catalyst ')}</h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('gcB', L('Balance outstanding', ''), money(G.bal[n]), `${MQ[n]} · ${tqsrc()}`)}
    ${fcard('gcD', L('Drawn in H1 2026', '2026 '), money(G.draw_h1_26), `${L('repaid', '')} ${money(G.repay_h1_26)} · ${tqsrc()}`)}
    ${fcard('gcI', L('Interest expense Q2 2026', '2026 '), money(G.int_q['Q2 2026']), `${L('year ago', '')} ${money(G.int_q['Q2 2025'])} · ${L('16% rate of return to GC', ' GC  16% ')} · ${tqsrc()}`)}
    ${fcard('gcC', L('Total GC commitments', 'GC '), money(commitTot, 0), `${L('3 tranches, 2023–2026', '2023–2026 ')} · ${tqsrc()}`)}</div>
   ${tableBlock({title: L('Balance outstanding by quarter, newest first ($m)', ''), columns: [L('Quarter', ''), L('Balance outstanding', ''), L('Source', '')], rows: MQ.map((q, i) => [q, G.bal[i], lsrc(i)]).reverse(),
     notes: [L(`H1 2026: drawn ${money(G.draw_h1_26)}, repaid ${money(G.repay_h1_26)}, interest expense ${money(G.int_h1_26)} (cash interest paid ${money(G.cash_int_h1_26)}); H1 2025: drawn ${money(G.draw_h1_25)}, repaid ${money(G.repay_h1_25)}, interest ${money(G.int_h1_25)}. Cumulative amount drawn since 2023 is not disclosed.`, `2026  ${money(G.draw_h1_26)} ${money(G.repay_h1_26)} ${money(G.int_h1_26)} ${money(G.cash_int_h1_26)}2025  ${money(G.draw_h1_25)} ${money(G.repay_h1_25)} ${money(G.int_h1_25)}2023 `) + ' ' + tqsrc()]}, {id: 'tGc', raw: true})}
   <div class="card" style="margin:16px 0"><h3 style="margin-top:0">${L('Agreements (newest first)', '')}</h3><ul class="lst">
    <li><b>${esc(dlong(G.hann.date))}</b> · Hannover Re · ${esc(mz(G.hann.txt))} · ${tqsrc()} · ${lsrc(n)}</li>
    ${[...G.commit].reverse().map(c => `<li><b>${esc(dlong(c.date))}</b> · General Catalyst · ${money(c.amt, 0)} · ${esc(mz(c.txt))} · ${tqsrc()}</li>`).join('')}</ul>
    <div class="mut" style="font-size:12px">${L('Under each GC tranche, GC advances 50–80% of growth spend and is repaid on an agreed schedule including a 16% rate of return.', ' GC  50–80% 16% ')}</div></div></div>
  <div class="sblk" id="blk-car"><h3>${L('Car tracker', '')}</h3>
   <div class="grid g4" style="margin-bottom:12px">
    ${fcard('carI', L('Car in-force premium', ''), money(CR.ifp[n], 0), `${MQ[n]} · ${L('year ago', '')} ${money(CR.ifp[n - 4], 0)} · ${lsrc(n)}`, 'IFP')}
    ${fcard('carS', L('Car share of IFP', ' IFP'), share[n] + '%', `${MQ[n]} · ${L('year ago', '')} ${share[n - 4]}% · ${L('calculated', '')} · ${lsrc(n)}`)}
    ${fcard('carG', L('Car gross loss ratio', ''), CR.glr[n] + '%', `${MQ[n]} · ${L('year ago', '')} ${CR.glr[n - 4]}% · ${lsrc(n)}`, 'GLR')}
    ${fcard('carN', L('States where Car is live', ''), String(CR.states_n.n), `${L('as of', '')} ${dlong(CR.states_n.date)} · ${srcA(CR.states_n.src, 'Lemonade on X')}`)}</div>
   ${tableBlock({title: L('Car by quarter, newest first', ''), columns: [L('Quarter', ''), L('Car IFP ($m)', ' IFP'), L('Total IFP ($m)', 'IFP '), L('Car share', ''), L('Car GLR', ''), L('Premium per Car customer ($)', ''), L('Source', '')],
     rows: MQ.map((q, i) => [q, CR.ifp[i], CR.tot[i], share[i] + '%', CR.glr[i] + '%', CR.ppc[i], lsrc(i)]).reverse(),
     notes: [L('Q4 2025 Car loss ratio benefited from year-end reserve movements (per the letter).', '2025 '), L('A complete list of the 13 Car states is not published in one filing; launches below are those with a company source.', '13 ')]}, {id: 'tCar', raw: true})}
   <div class="grid g2" style="margin:16px 0"><div class="card"><h3 style="margin-top:0">${L('Autonomous Car / FSD discount (newest first)', ' / FSD ')}</h3><ul class="lst">${li(CR.auto)}</ul>
     <div class="mut" style="font-size:12px">${L('State rate filings for the FSD discount are not linked here: Lemonade announces these launches by press release and on X, and the state filings are not posted with them.', ' FSD Lemonade  X ')}</div></div>
    <div class="card"><h3 style="margin-top:0">${L('Car state launches since Q2 2025 (newest first)', '2025 ')}</h3><ul class="lst">${li(CR.launch)}<li><b>${esc(dlong(CR.tx_note.date))}</b> · <span class="pill acc">TX</span> ${esc(mz(CR.tx_note.txt))} · ${srcA(CR.tx_note.src)}</li></ul></div></div></div>`;
  [['q3I', [1083, 1158, 1237, 1333, 1434, 1538.5], [...MQ, L('Q3 guide', '')]], ['q3R', [...D.fin.is.series['Total revenue'].slice(-5), 324.5], [...MQ, L('Q3 guide', '')]], ['q3E', [...D.fin.kpi.series['Adjusted EBITDA ($m)'].slice(-5), -21.5], [...MQ, L('Q3 guide', '')]]].forEach(([id, d, l]) => xs(id, d, l));
  xs('reC', R.ceded_pct, MQ); xs('reK', R.ccom, MQ); xs('reG', R.glr, MQ); xs('reN', R.nlr, MQ);
  CT.states.forEach((x, k) => xs('ctS' + k, [x.p0, x.p], ['Q2 2025', 'Q2 2026'])); xs('ctC', CT.pp, MQ);
  xs('gcB', G.bal, MQ); xs('gcI', [G.int_q['Q2 2025'], G.int_q['Q2 2026']], ['Q2 2025', 'Q2 2026']);
  xs('carI', CR.ifp, MQ); xs('carS', share, MQ); xs('carG', CR.glr, MQ);
  wireCard({id: 'reCh', unit: '%', build: () => ({labels: MQ, datasets: [{type: 'bar', label: L('Ceded % of GWP', ''), data: R.ceded_pct, backgroundColor: C.acc, keep: true}, {type: 'line', label: L('Gross loss ratio', ''), data: R.glr, borderColor: C.g, keep: true}, {type: 'line', label: L('Net loss ratio', ''), data: R.nlr, borderColor: C.b, keep: true}], scales: {y: {ticks: {callback: v => v + '%'}}}})});
  wireCard({id: 'ctCh', unit: '%', build: () => ({labels: MQ, datasets: [{type: 'bar', label: L('CAT excl. PPD (pp)', 'CAT PPD'), data: CT.pp, backgroundColor: C.acc, keep: true}, {type: 'line', label: L('Gross loss ratio', ''), data: CT.glr, borderColor: C.g, keep: true}, {type: 'line', label: L('GLR ex-CAT', ''), data: CT.exc, borderColor: C.b, keep: true}], scales: {y: {ticks: {callback: v => v + '%'}}}})});
}
const TABS = [['overview', 'Overview', overview], ['fin', 'Financial Statements', finTab], ['kpis', 'Insurance KPIs', kpis], ['history', 'IFP & Revenue History', history, 'history'], ['highlights', 'Quarterly Highlights', highlights, 'highlights'],
  ['rollout', 'Product Rollout', rollout, 'rollout'],
  ['risk', 'Risk & Q3 preview', riskTab], ['metrics', 'Metrics & Street', metricsTab], ['insiders', 'Insiders', insiders], ['sources', 'Sources & Live feed', sources]]
  .filter(t => !t[3] || OPT[t[3]]);
/* short labels keep the nav simple; section headings keep the full names */
const NAVL = {overview: 'Overview', kpis: 'KPIs', history: 'History', highlights: 'Highlights', rollout: 'Rollout', risk: 'Risk & Q3', fin: 'Financials', metrics: 'Metrics & Street', insiders: 'Insiders', sources: 'Sources & Live feed'};
const NAVZ = {overview: '', kpis: 'KPI', history: '', highlights: '', rollout: '', risk: 'Q3', fin: '', metrics: '', insiders: '', sources: ''};
const TABZ = {overview: '', fin: '', kpis: ' KPI', history: 'IFP ', highlights: '', rollout: '', risk: '', metrics: '', insiders: '', sources: ''};
/* Sources & Live feed is a nav tab (Hugo asked for it, like Micron's) */
const NONAV = new Set([]);
/* old links: retired tabs land somewhere sensible */
const MOVED = {opmetrics: '#metrics/opmetrics', picks: '#metrics/picks', guidance: '#metrics/guidance', street: '#metrics/street', valuation: '#metrics/valuation', risks: '#overview', bear: '#metrics/bear', runway: '#fin/cf'};
const done = {};
function route() {
  let id = (location.hash || '#overview').slice(1).split('/')[0];
  if (['is', 'bs', 'cf'].includes(id)) { location.replace('#fin/' + id); return; }
  if (MOVED[id]) { location.replace(MOVED[id]); return; }
  if (!TABS.some(t => t[0] === id)) id = 'overview';
  if (id === 'fin' && done.fin) finShow(location.hash.split('/')[1] || 'bs');
  if (id === 'sources' && done.sources) srcShow(location.hash.split('/')[1] || 'feed');
  $$('#nav a').forEach(a => { const on = a.dataset.t === id; a.classList.toggle('on', on); if (on) a.scrollIntoView({block: 'nearest', inline: 'center'}); });
  $$('main section').forEach(s => s.classList.toggle('on', s.id === 's-' + id));
  const t = TABS.find(t => t[0] === id);
  if (!done[id]) { try { t[2](); } catch (e) { console.error('render ' + id, e); $('#s-' + id).insertAdjacentHTML('beforeend', `<div class="tvfail">${L('This tab could not render', '')}: ${esc(e.message)}</div>`); } done[id] = 1; wireTables($('#s-' + id)); wireXall($('#s-' + id)); }
  if (id === 'metrics') { const sub = location.hash.split('/')[1]; if (sub && mblk().some(b => b[0] === sub)) setTimeout(() => metricsJump(sub, false), 60); }
  route.seen = 1;
  document.title = L(`${t[1]} · Lemonade (LMND) Dashboard · © 2026 Hugo Tian`, `${TABZ[t[0]] || t[1]} · Lemonade (LMND)  · © 2026 Hugo Tian`);
}
function buildNav() {
  $('#nav').innerHTML = TABS.filter(([id]) => !NONAV.has(id)).map(([id, l]) => `<a href="#${id}" data-t="${id}" title="${esc(L(l, TABZ[id] || l))}">${esc(L(NAVL[id] || l, NAVZ[id] || l))}</a>`).join('');
  $('#main').innerHTML = TABS.map(([id]) => `<section id="s-${id}"></section>`).join('');
}
/* ---------------- theme ---------------- */
function applyTheme(rerender) {
  const t = document.documentElement.dataset.theme || 'auto';
  $('#themelbl').textContent = t === 'auto' ? L('Auto', '') : t === 'dark' ? L('Dark', '') : L('Light', ''); $('#themeic').textContent = t === 'auto' ? '◐' : t === 'dark' ? '☾' : '☀';
  $('#themebtn').title = L(`Theme: ${t === 'auto' ? 'follows your system' : t} · click to switch`, `${t === 'auto' ? '' : t === 'dark' ? '' : ''} · `);
  if (!rerender) return;
  palette(); Object.keys(charts).forEach(k => { try { charts[k].destroy(); } catch (e) {} delete charts[k]; });
  for (const k in done) delete done[k]; hero(); route();
}
$('#themebtn').onclick = () => { const cur = document.documentElement.dataset.theme || 'auto'; const nx = cur === 'auto' ? (isDark() ? 'light' : 'dark') : cur === 'dark' ? 'light' : 'auto';
  if (nx === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem('lmnd-theme'); } catch (e) {} } else { document.documentElement.dataset.theme = nx; try { localStorage.setItem('lmnd-theme', nx); } catch (e) {} }
  applyTheme(true); };
if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!document.documentElement.dataset.theme) applyTheme(true); });
/* ---------------- language ---------------- */
function langChrome() {
  const de = document.documentElement; de.lang = LANG === 'zh' ? 'zh-CN' : 'en'; de.dataset.lang = LANG;
  
  const bn = $('#brandsub'); if (bn) bn.textContent = L('Dashboard', '');
  const h1 = $('#h1t'); if (h1) h1.textContent = L('Dashboard', '');
}
/* ---------------- init ---------------- */
$('#foot').innerHTML = `© 2026 Hugo Tian. All rights reserved.`;
langChrome(); buildNav(); applyTheme(false); hero(); route(); addEventListener('hashchange', route);
