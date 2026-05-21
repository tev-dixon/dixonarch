(function () {
  /* Justified collage: scale each row so images share the same height
     and the row exactly fills the container width. */
  function layoutCollage(collage) {
    const targetHeight = parseInt(collage.dataset.rowHeight, 10) || 280;
    const gap = parseInt(collage.dataset.gap, 10) || 10;
    const containerWidth = collage.clientWidth;
    const items = Array.from(collage.querySelectorAll('.collage-item'));
    const imgs = items.map(i => i.querySelector('img'));

    if (imgs.some(img => !img.naturalWidth)) {
      Promise.all(imgs.map(img =>
        img.complete ? Promise.resolve()
                     : new Promise(r => { img.onload = img.onerror = r; })
      )).then(() => layoutCollage(collage));
      return;
    }

    let row = [], rowAspectSum = 0;

    items.forEach((item, idx) => {
      const aspect = item.querySelector('img').naturalWidth / item.querySelector('img').naturalHeight;
      row.push({ item, aspect });
      rowAspectSum += aspect;

      const wouldBeWidth = rowAspectSum * targetHeight + gap * (row.length - 1);
      const isLast = idx === items.length - 1;

      if (wouldBeWidth >= containerWidth || isLast) {
        const availableWidth = containerWidth - gap * (row.length - 1);
        const rowHeight = isLast && wouldBeWidth < containerWidth
          ? targetHeight
          : availableWidth / rowAspectSum;

        row.forEach(({ item, aspect }) => {
          item.style.width = (rowHeight * aspect) + 'px';
          item.style.height = rowHeight + 'px';
        });

        row = [];
        rowAspectSum = 0;
      }
    });
  }

  function layoutAll() {
    document.querySelectorAll('.collage').forEach(layoutCollage);
  }

  layoutAll();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutAll, 100);
  });

  /* Lightbox */
  const data = JSON.parse(document.getElementById('portfolio-data').textContent);
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('.lightbox-image');
  const lbTitle = lightbox.querySelector('.lightbox-title');
  const lbCounter = lightbox.querySelector('.lightbox-counter');

  let currentImages = [], currentTitle = '', currentIndex = 0;

  function toWebP(src, width) {
    return src.replace(/\.[^.]+$/, '').replace('/uploads/', '/uploads/optimized/') + '-' + width + 'w.webp';
  }

  function show() {
    const original = currentImages[currentIndex];
    lbImg.src = toWebP(original, 1600);
    lbImg.onerror = function () { lbImg.src = original; lbImg.onerror = null; };
    lbTitle.textContent = currentTitle;
    lbCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
  }

  function open(sectionIdx, projectIdx) {
    const project = data[sectionIdx][projectIdx];
    currentImages = project.images;
    currentTitle = project.title;
    currentIndex = 0;
    show();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function step(dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    show();
  }

  document.querySelectorAll('.collage-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      open(parseInt(item.dataset.sectionIndex, 10), parseInt(item.dataset.projectIndex, 10));
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
})();
