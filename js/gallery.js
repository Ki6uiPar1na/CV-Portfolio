(async function() {
  const rows = await loadCSV('data/gallery.csv');

  const grid = document.getElementById('gallery-grid');
  const count = document.getElementById('gallery-count');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';
  let currentIndex = -1;

  function render(filter) {
    const filtered = filter === 'all' ? rows : rows.filter(r => r.category === filter);
    count.textContent = `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`;

    grid.innerHTML = '';
    filtered.forEach((r, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = i;
      item.innerHTML = `
        <img src="${r.image}" alt="${r.caption}" loading="lazy">
        <div class="gallery-info">
          <span class="gallery-cat">${r.category}</span>
          <span class="gallery-date">${r.date || ''}</span>
        </div>
        <div class="gallery-caption">${r.caption}</div>
      `;
      item.addEventListener('click', () => openLightbox(filtered, i));
      grid.appendChild(item);
    });
  }

  /* ——— Lightbox ——— */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let lbItems = [];

  function openLightbox(items, idx) {
    lbItems = items;
    currentIndex = idx;
    showImage();
    lb.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function showImage() {
    const item = lbItems[currentIndex];
    lbImg.src = item.image;
    lbImg.alt = item.caption;
    lbCaption.innerHTML = `<strong>${item.caption}</strong> ${item.date ? '· ' + item.date : ''}`;
    lbPrev.style.display = lbItems.length > 1 ? 'block' : 'none';
    lbNext.style.display = lbItems.length > 1 ? 'block' : 'none';
  }

  lbClose.addEventListener('click', () => {
    lb.classList.remove('visible');
    document.body.style.overflow = '';
  });

  lbPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + lbItems.length) % lbItems.length;
    showImage();
  });

  lbNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % lbItems.length;
    showImage();
  });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('visible')) return;
    if (e.key === 'Escape') lbClose.click();
    if (e.key === 'ArrowLeft') lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });

  lb.addEventListener('click', e => {
    if (e.target === lb) lbClose.click();
  });

  /* ——— Filters ——— */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render(currentFilter);
    });
  });

  render('all');
})();
