document.addEventListener('portfolio-ready', function() {
  const data = window.portfolioData;
  if (!data) return;
  const p = data.profile;

  /* ——— Build widget ——— */
  const widget = document.createElement('div');
  widget.id = 'term';

  widget.innerHTML = `
    <button id="term-toggle" title="Toggle terminal">_&gt;</button>
    <div id="term-window">
      <div id="term-header">
        <span>terminal@${p.alias || 'portfolio'}:~$</span>
        <button id="term-close">&times;</button>
      </div>
      <div id="term-output"></div>
      <div id="term-input-line">
        <span id="term-prompt">$ </span>
        <input type="text" id="term-input" autofocus spellcheck="false" autocomplete="off">
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  const win = document.getElementById('term-window');
  const output = document.getElementById('term-output');
  const input = document.getElementById('term-input');
  const toggle = document.getElementById('term-toggle');
  const close = document.getElementById('term-close');

  let open = false;

  function toggleOpen() {
    open = !open;
    win.classList.toggle('visible', open);
    toggle.innerHTML = open ? 'x' : '_&gt;';
    if (open) input.focus();
  }

  toggle.addEventListener('click', toggleOpen);
  close.addEventListener('click', toggleOpen);

  /* ——— Print helpers ——— */
  function print(text, cls) {
    const line = document.createElement('div');
    line.className = 'term-line' + (cls ? ' ' + cls : '');
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  /* ——— Commands ——— */
  const cmds = {
    help() {
      print('Available commands:', 'term-info');
      print('  about       — Show summary');
      print('  skills      — List technical skills');
      print('  soft        — List soft skills');
      print('  certs       — Show certifications');
      print('  edu         — Show education');
      print('  contests    — Recent contest results');
      print('  projects    — List projects');
      print('  contact     — Contact info');
      print('  whoami      — Who are you?');
      print('  ls          — List sections');
      print('  cat &lt;name&gt;  — View section');
      print('  banner      — Show ASCII art');
      print('  date        — Current date');
      print('  clear       — Clear terminal');
      print('  help        — This message');
    },

    about() {
      print(p.summary || 'No summary available.', 'term-info');
    },

    skills() {
      const tech = data.skills.filter(r => r.type === 'Technical');
      const cats = [...new Set(tech.map(r => r.category))];
      cats.forEach(cat => {
        const items = tech.filter(r => r.category === cat).map(r => r.name).join(', ');
        print(`${cat}: ${items}`);
      });
    },

    soft() {
      const soft = data.skills.filter(r => r.type === 'Soft');
      soft.forEach(r => print(`${r.category}: ${r.name}`));
    },

    certs() {
      data.certs.forEach(r => {
        print(`${r.abbreviation} — ${r.title} (${r.issuer}, ${r.date})`);
      });
    },

    edu() {
      data.education.forEach(r => {
        print(`${r.degree} @ ${r.institution} — ${r.result} (${r.duration})`);
      });
    },

    education() { this.edu(); },

    contests() {
      const top = data.contests.filter(r => r.display === 'yes').slice(0, 5);
      top.forEach(r => print(`${r.competition}: ${r.rank}${r.date ? ' (' + r.date + ')' : ''}`));
    },

    projects() {
      data.projects.forEach(r => print(`${r.name} — ${r.lang}`));
    },

    contact() {
      print(`Email: ${p.email}`);
      print(`GitHub: ${p.github}`);
      print(`LinkedIn: ${p.linkedin}`);
    },

    whoami() {
      print(p.name);
      print(`aka ${p.alias}`);
    },

    ls() {
      print('about  skills  soft  certs  edu  contests  projects  contact');
    },

    cat(args) {
      const section = (args || '').trim().toLowerCase();
      const map = { about:'about', skills:'skills', soft:'soft', certs:'certs',
                    edu:'edu', education:'edu', contests:'contests',
                    projects:'projects', contact:'contact' };
      if (map[section]) {
        this[map[section]]();
      } else {
        print(`cat: ${section || ''}: No such section`, 'term-error');
      }
    },

    banner() {
      print('  _  ___ _   _ _   _ ___ ____    _   _   _ _____ ___ _   _  ____   ___  _     ___   ___  ', 'term-ascii');
      print(' | |/ (_) \\ | | | | |_ _|  _ \\  | \\ | | | |_   _|_ _| \\ | |/ ___| / _ \\| |   / _ \\ / _ \\ ', 'term-ascii');
      print(' | \' /| |  \\| | | | || || |_) | |  \\| | | | | |  | ||  \\| | |  _ | | | | |  | | | | | | |', 'term-ascii');
      print(' | . \\| | |\\  | |_| || ||  __/  | |\\  | |_| | | |  | || |\\  | |_| || |_| | |__| |_| | |_| |', 'term-ascii');
      print(' |_|\\_\\_|_| \\_|\\___/|___|_|     |_| \\_|\\___/  |_| |___|_| \\_|\\____| \\___/|____\\___/ \\___/ ', 'term-ascii');
    },

    date() {
      print(new Date().toString());
    },

    clear() {
      output.innerHTML = '';
    },

    sudo() {
      print('Nice try. ;)', 'term-info');
    }
  };

  /* ——— Handle input ——— */
  input.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' || !this.value.trim()) return;
    const line = this.value;
    print(`$ ${line}`);
    this.value = '';

    const parts = line.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (cmds[cmd]) {
      try { cmds[cmd](args); } catch (err) { print(`Error: ${err.message}`, 'term-error'); }
    } else {
      print(`bash: ${cmd}: command not found. Type 'help' for available commands.`, 'term-error');
    }
  });

  /* ——— Welcome ——— */
  print(`Welcome to ${p.alias || p.name}'s terminal.`, 'term-info');
  print('Type help to see available commands.');
  print('');
});
