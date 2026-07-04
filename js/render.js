function sectionNum(n) {
  const s = document.createElement('span');
  s.className = 'section-num';
  s.textContent = String(n).padStart(2, '0');
  return s;
}

function el(tag, cls, children) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (typeof children === 'string') e.innerHTML = children;
  else if (children) {
    const items = children.forEach ? children : [children];
    items.forEach(c => { if (c) e.appendChild(c); });
  }
  return e;
}

function txt(text) {
  return document.createTextNode(text);
}

/* ———— HERO ———— */
function renderHero(p) {
  const codeHTML = `<div class="code-block">
    <div class="code-header"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span> about.js</div>
<pre>const person = {
  name: "${p.name}",
  alias: "${p.alias}",
  focus: ["Pentesting", "RE", "OSINT"],
  club: "JKKNIU Cyber Security Club",
  role: "President"
};
console.log(person.focus);
// → ['Pentesting', 'RE', 'OSINT']</pre>
  </div>`;

  const sec = document.createElement('section');
  sec.id = 'hero';

  const grid = el('div', 'hero-grid');
  const textDiv = el('div', 'hero-text');

  const badge = el('span', 'badge', txt(p.badge));
  const h1 = el('h1', '', txt(p.name));
  const tagline = el('p', 'tagline', txt(p.tagline));
  const actions = el('div', 'hero-actions');
  actions.appendChild(el('a', 'btn primary', txt('Download CV')));
  actions.lastChild.href = 'CV.pdf';
  actions.appendChild(el('a', 'btn secondary', txt('Get in Touch')));
  actions.lastChild.href = '#contact';

  const statsRow = el('div', 'stats-row');
  if (p.stat1_label) {
    const d1 = el('div', '', [el('span', '', txt(p.stat1_label)), txt(p.stat1_desc)]);
    statsRow.appendChild(d1);
  }
  if (p.stat2_label) {
    const d2 = el('div', '', [el('span', '', txt(p.stat2_label)), txt(p.stat2_desc)]);
    statsRow.appendChild(d2);
  }
  if (p.stat3_label) {
    const d3 = el('div', '', [el('span', '', txt(p.stat3_label)), txt(p.stat3_desc)]);
    statsRow.appendChild(d3);
  }

  textDiv.append(badge, h1, tagline, actions, statsRow);
  const codeDiv = el('div', 'hero-code');
  codeDiv.innerHTML = codeHTML;
  grid.append(textDiv, codeDiv);
  sec.appendChild(grid);
  document.getElementById('section-hero').appendChild(sec);
}

/* ———— ABOUT ———— */
function renderAbout(p) {
  const sec = document.createElement('section');
  sec.id = 'about';
  const h2 = el('h2', '', [sectionNum(1), txt(' About')]);
  const content = el('div', 'about-content');
  const para = el('p', '', txt(p.summary));
  const info = el('div', 'quick-info');
  info.innerHTML = `
    <div><span>Email</span>${p.email}</div>
    <div><span>Location</span>${p.location}</div>
    <div><span>GitHub</span><a href="${p.github}">${p.github.replace('https://', '/')}</a></div>
    <div><span>LinkedIn</span><a href="${p.linkedin}">${p.linkedin.replace('https://', '/')}</a></div>`;
  content.append(para, info);
  sec.append(h2, content);
  document.getElementById('section-about').appendChild(sec);
}

/* ———— SKILLS ———— */
function renderSkills(rows) {
  const sec = document.createElement('section');
  sec.id = 'skills';
  const h2 = el('h2', '', [sectionNum(2), txt(' Technical Skills')]);

  const tech = rows.filter(r => r.type === 'Technical');
  const cats = [...new Set(tech.map(r => r.category))];

  const grid = el('div', 'skills-grid');
  cats.forEach(cat => {
    const card = el('div', 'skill-group');
    const h3 = el('h3', '', txt(cat));
    const ul = document.createElement('ul');
    tech.filter(r => r.category === cat).forEach(r => {
      const li = el('li', '', txt(r.name));
      ul.appendChild(li);
    });
    card.append(h3, ul);
    grid.appendChild(card);
  });

  sec.append(h2, grid);
  document.getElementById('section-skills').appendChild(sec);
}

/* ———— SOFT SKILLS ———— */
function renderSoftSkills(rows) {
  const sec = document.createElement('section');
  sec.id = 'soft-skills';
  const h2 = el('h2', '', [sectionNum(3), txt(' Soft Skills')]);

  const soft = rows.filter(r => r.type === 'Soft');
  const list = el('div', 'soft-list');

  soft.forEach(r => {
    const item = el('div', 'soft-item');
    const label = el('span', 'soft-label', txt(r.category));
    const desc = el('span', 'soft-desc', txt(r.name));
    item.append(label, desc);
    list.appendChild(item);
  });

  sec.append(h2, list);
  document.getElementById('section-soft-skills').appendChild(sec);
}

/* ———— CERTS ———— */
function renderCerts(rows) {
  const sec = document.createElement('section');
  sec.id = 'certs';
  const h2 = el('h2', '', [sectionNum(4), txt(' Certifications')]);
  const grid = el('div', 'certs-grid');

  rows.forEach(r => {
    const card = el('div', 'cert-card');
    const icon = el('div', 'cert-icon', txt(r.abbreviation));
    const h3 = el('h3', '', txt(r.title));
    const p = el('p', '', txt(`${r.issuer} — ${r.date}`));
    card.append(icon, h3, p);
    grid.appendChild(card);
  });

  sec.append(h2, grid);
  document.getElementById('section-certs').appendChild(sec);
}

/* ———— EDUCATION ———— */
function renderEducation(rows) {
  const sec = document.createElement('section');
  sec.id = 'education';
  const h2 = el('h2', '', [sectionNum(5), txt(' Education')]);
  const list = el('div', 'edu-list');

  rows.forEach(r => {
    const item = el('div', 'edu-item');
    const year = el('div', 'edu-year', txt(r.duration));
    const info = el('div', 'edu-info');
    const h3 = el('h3', '', txt(r.degree));
    const p = el('p', '', txt(r.institution));
    const result = el('span', 'edu-result', txt(r.result));
    info.append(h3, p, result);
    item.append(year, info);
    list.appendChild(item);
  });

  sec.append(h2, list);
  document.getElementById('section-education').appendChild(sec);
}

/* ———— CONTESTS ———— */
function renderContests(rows, cpRows) {
  const sec = document.createElement('section');
  sec.id = 'contests';
  const h2 = el('h2', '', [sectionNum(6), txt(' Contests & Achievements')]);

  // Featured cards in horizontal scrolling tracks
  const featured = rows.filter(r => r.display === 'yes');
  const mid = Math.ceil(featured.length / 2);
  const row1 = featured.slice(0, mid);
  const row2 = featured.slice(mid);

  function buildTrack(items, reverse) {
    const track = el('div', 'contest-track');
    const inner = el('div', 'contest-track-inner' + (reverse ? ' reverse' : ''));
    function addCards(items) {
      items.forEach(r => {
        const card = el('div', 'contest-card' + (r.rank === 'Champion' ? ' gold' : ''));
        const label = el('span', 'rank-label', txt(r.rank));
        const h3 = el('h3', '', txt(r.competition));
        const dateP = el('p', '', txt(r.date || ''));
        card.append(label, h3, dateP);
        inner.appendChild(card);
      });
    }
    addCards(items);
    addCards(items); // duplicate for seamless loop
    track.appendChild(inner);
    return track;
  }

  const tracks = el('div', 'contest-tracks');
  tracks.appendChild(buildTrack(row1, false));  // left-to-right
  tracks.appendChild(buildTrack(row2, true));   // right-to-left

  // Collapsible full table
  const details = document.createElement('details');
  details.className = 'more-contests';
  const summary = document.createElement('summary');
  summary.textContent = 'View all CTF results (' + rows.filter(r => r.category === 'ctf').length + ' competitions)';
  details.appendChild(summary);

  const wrap = el('div', 'contest-table-wrap');
  const table = document.createElement('table');
  let html = '<tr><th>Competition</th><th>Rank</th></tr>';
  rows.filter(r => r.category === 'ctf').forEach(r => {
    html += `<tr><td>${r.competition}</td><td>${r.rank}</td></tr>`;
  });
  table.innerHTML = html;
  wrap.appendChild(table);
  details.appendChild(wrap);

  // Programming & hackathons table
  const progRows = rows.filter(r => r.category === 'programming');
  const progDetails = document.createElement('details');
  progDetails.className = 'more-contests';
  const progSummary = document.createElement('summary');
  progSummary.textContent = 'Programming contests & hackathons';
  progDetails.appendChild(progSummary);
  const progWrap = el('div', 'contest-table-wrap');
  const progTable = document.createElement('table');
  let progHtml = '<tr><th>Contest</th><th>Rank</th></tr>';
  progRows.forEach(r => {
    progHtml += `<tr><td>${r.competition}</td><td>${r.rank}</td></tr>`;
  });
  progTable.innerHTML = progHtml;
  progWrap.appendChild(progTable);
  progDetails.appendChild(progWrap);

  // CP cards
  const cpGrid = el('div', 'cp-cards');
  cpRows.forEach(r => {
    const card = el('div', 'cp-card');
    const h3 = el('h3', '', txt(r.platform));
    const handle = el('p', 'handle', txt(r.handle));
    const stats = el('p', '', txt(r.stats));
    card.append(h3, handle, stats);
    cpGrid.appendChild(card);
  });

  sec.append(h2, tracks, details, progDetails, cpGrid);
  document.getElementById('section-contests').appendChild(sec);
}

/* ———— PROJECTS ———— */
function renderProjects(rows) {
  const sec = document.createElement('section');
  sec.id = 'projects';
  const h2 = el('h2', '', [sectionNum(7), txt(' Projects')]);
  const grid = el('div', 'projects-grid');

  rows.forEach(r => {
    const card = el(r.link ? 'a' : 'div', 'project-card');
    if (r.link) {
      card.href = r.link;
      card.target = '_blank';
    }
    const lang = el('div', 'project-lang', txt(r.lang));
    const h3 = el('h3', '', txt(r.name));
    const p = el('p', '', txt(r.description));
    card.append(lang, h3, p);
    grid.appendChild(card);
  });

  sec.append(h2, grid);
  document.getElementById('section-projects').appendChild(sec);
}

/* ———— ORGANIZATIONS ———— */
function renderOrganizations(rows) {
  const sec = document.createElement('section');
  sec.id = 'organizations';
  const h2 = el('h2', '', [sectionNum(8), txt(' Organizations')]);
  const list = el('div', 'org-list');

  rows.forEach(r => {
    const item = el('div', 'org-item');
    const role = el('div', 'org-role', txt(r.position));
    const detail = el('div', 'org-detail');
    const h3 = el('h3', '', txt(r.org));
    const p = el('p', '', txt(r.duration));
    detail.append(h3, p);
    item.append(role, detail);
    list.appendChild(item);
  });

  sec.append(h2, list);
  document.getElementById('section-organizations').appendChild(sec);
}

/* ———— CONTACT ———— */
function renderContact(p) {
  const sec = document.createElement('section');
  sec.id = 'contact';
  const h2 = el('h2', '', [sectionNum(9), txt(' Contact')]);
  const content = el('div', 'contact-content');
  const msg = el('p', '', txt('Available for collaborations, CTFs, and security research.'));
  const links = el('div', 'contact-links');

  const emailBtn = el('a', 'btn primary', txt('Email'));
  emailBtn.href = `mailto:${p.email}`;
  const ghBtn = el('a', 'btn secondary', txt('GitHub'));
  ghBtn.href = p.github;
  ghBtn.target = '_blank';
  const liBtn = el('a', 'btn secondary', txt('LinkedIn'));
  liBtn.href = p.linkedin;
  liBtn.target = '_blank';
  const cvBtn = el('a', 'btn secondary', txt('Download CV'));
  cvBtn.href = 'CV.pdf';

  links.append(emailBtn, ghBtn, liBtn, cvBtn);
  content.append(msg, links);
  sec.append(h2, content);
  document.getElementById('section-contact').appendChild(sec);
}

/* ———— BOOT ———— */
(async function() {
  let profile, skills, certs, education, contests, cp, projects, organizations;
  try {
    [profile, skills, certs, education, contests, cp, projects, organizations] = await Promise.all([
      loadCSV('data/profile.csv'),
      loadCSV('data/skills.csv'),
      loadCSV('data/certs.csv'),
      loadCSV('data/education.csv'),
      loadCSV('data/contests.csv'),
      loadCSV('data/cp.csv'),
      loadCSV('data/projects.csv'),
      loadCSV('data/organizations.csv'),
    ]);
  } catch (e) {
    document.body.innerHTML = '<p style="color:red;padding:2rem;font-family:monospace;">Failed to load CSV data. Make sure all CSV files exist in the data/ folder.</p>';
    console.error(e);
    return;
  }

  const p = profile.reduce((acc, row) => { acc[row.key] = row.value; return acc; }, {});

  window.portfolioData = { profile: p, skills, certs, education, contests, cp, projects, organizations };
  document.dispatchEvent(new Event('portfolio-ready'));

  document.getElementById('nav-name').textContent = p.alias || p.name;
  document.getElementById('footer-name').textContent = p.name;

  renderHero(p);
  renderAbout(p);
  renderSkills(skills);
  renderSoftSkills(skills);
  renderCerts(certs);
  renderEducation(education);
  renderContests(contests, cp);
  renderProjects(projects);
  renderOrganizations(organizations);
  renderContact(p);

  // Smooth scroll
  for (const a of document.querySelectorAll('a[href^="#"]')) {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
