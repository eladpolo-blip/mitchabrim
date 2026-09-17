/* =========================================================================
   motion-extra.js

   The added elements of this build are AUTHORED DOM in index.html, not
   injected here. That was the change worth making: injected elements arrive
   after layout and push the page around as they land, and the build law
   forbids an entrance that shifts layout. Written into the markup, they are
   there on the first paint, and the page is complete with JavaScript off.

   So this file now does one thing: it stops the ribbon animating while it is
   off screen. Nothing here is required for the page to be correct.
   ========================================================================= */
(function(){
  try {
    var root = document.documentElement;
    if (root.classList.contains('mx-ready')) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof window.IntersectionObserver !== 'function') {
      root.classList.add('mx-ready');
      return;
    }

    var watched = document.querySelectorAll('.mx-ribbon-wrap');
    if (watched.length) {
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          entry.target.classList.toggle('mx-offscreen', !entry.isIntersecting);
        });
      }, { rootMargin: '140px 0px 140px 0px', threshold: 0 });

      Array.prototype.forEach.call(watched, function(el){ observer.observe(el); });
    }

    root.classList.add('mx-ready');
  } catch (err) {
    /* Any failure here leaves the page exactly as the markup and CSS built it. */
  }
})();
