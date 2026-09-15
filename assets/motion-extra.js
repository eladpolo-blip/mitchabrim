/* motion-extra.js : inserts the extra motion elements (marquee band, glowing card edges, floating shapes).
   Every visible word comes from text that is already on the page. Nothing here hides existing content. */
(function(){
  try {
    var root = document.documentElement;
    if (root.classList.contains('mx-ready')) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var watched = [];

    /* 1. Marquee band with the workshop names, placed right above the workshops section */
    function buildMarquee(){
      var workshops = document.getElementById('workshops');
      if (!workshops || document.querySelector('.mx-marquee')) return;
      var names = [];
      workshops.querySelectorAll('.card h3').forEach(function(h){
        var text = (h.textContent || '').replace(/\s+/g, ' ').trim();
        if (text) names.push(text);
      });
      if (names.length < 3) return;

      var band = document.createElement('div');
      band.className = 'mx-marquee';
      band.setAttribute('aria-hidden', 'true');
      var track = document.createElement('div');
      track.className = 'mx-marquee-track';

      function makeGroup(){
        var group = document.createElement('span');
        group.className = 'mx-marquee-group';
        names.forEach(function(name){
          var item = document.createElement('span');
          item.className = 'mx-marquee-item';
          item.textContent = name;
          group.appendChild(item);
          var dot = document.createElement('span');
          dot.className = 'mx-marquee-dot';
          group.appendChild(dot);
        });
        return group;
      }

      track.appendChild(makeGroup());
      track.appendChild(makeGroup());
      band.appendChild(track);
      workshops.parentNode.insertBefore(band, workshops);

      function setSpeed(){
        var group = track.firstChild;
        if (!group) return;
        var width = group.getBoundingClientRect().width;
        if (!width) return;
        var seconds = Math.max(28, Math.round(width / 42));
        track.style.setProperty('--mx-marquee-duration', seconds + 's');
      }
      setSpeed();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(setSpeed);
      watched.push(band);
    }

    /* 2. Glowing edge layer inside each card */
    function buildGlow(){
      var hosts = document.querySelectorAll('#workshops .card, .lecture-card, .testimonial, .why-item, .facilitator-card');
      hosts.forEach(function(host){
        if (host.querySelector('.mx-glow-edge')) return;
        host.classList.add('mx-glow-host');
        var edge = document.createElement('span');
        edge.className = 'mx-glow-edge';
        edge.setAttribute('aria-hidden', 'true');
        host.appendChild(edge);
      });
    }

    /* 3. Floating shapes behind a few sections */
    function buildBlobs(){
      var sections = [];
      var lifebook = document.getElementById('lifebook');
      var lectures = document.getElementById('lectures');
      var testimonials = document.querySelector('.testimonials');
      if (lifebook) sections.push(lifebook);
      if (lectures) sections.push(lectures);
      if (testimonials && testimonials.closest) {
        var wrap = testimonials.closest('section');
        if (wrap) sections.push(wrap);
      }
      sections.forEach(function(section){
        if (section.classList.contains('mx-has-blobs')) return;
        section.classList.add('mx-has-blobs');
        ['mx-blob mx-blob-a', 'mx-blob mx-blob-b'].forEach(function(cls){
          var blob = document.createElement('span');
          blob.className = cls;
          blob.setAttribute('aria-hidden', 'true');
          section.insertBefore(blob, section.firstChild);
        });
        watched.push(section);
      });
    }

    /* Pause loops while they are off screen */
    function watchOffscreen(){
      if (reduceMotion || typeof window.IntersectionObserver !== 'function' || !watched.length) return;
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          entry.target.classList.toggle('mx-offscreen', !entry.isIntersecting);
        });
      }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
      watched.forEach(function(el){ observer.observe(el); });
    }

    buildMarquee();
    buildGlow();
    buildBlobs();
    watchOffscreen();
    root.classList.add('mx-ready');
  } catch (err) {
    /* any failure leaves the page exactly as it was */
  }
})();
