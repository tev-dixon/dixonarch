(function () {
  const gallery = document.querySelector('.gallery');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  let current = 0;
  let autoScroll;

  function show(i, manual = false) {
    current = (i + slides.length) % slides.length;

    if (manual) {
      gallery.classList.add('manual');
      clearTimeout(gallery._manualTimeout);
      gallery._manualTimeout = setTimeout(() => gallery.classList.remove('manual'), 500);
    }

    slides.forEach((s, idx) => s.classList.toggle('active', idx === current));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  function startAutoScroll() {
    autoScroll = setInterval(() => show(current + 1), 3500);
  }

  function resetAutoScroll() {
    clearInterval(autoScroll);
    startAutoScroll();
  }

  document.querySelectorAll('.arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      show(current + parseInt(btn.dataset.dir, 10), true);
      resetAutoScroll();
    });
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      show(parseInt(dot.dataset.index, 10), true);
      resetAutoScroll();
    });
  });

  startAutoScroll();
})();
