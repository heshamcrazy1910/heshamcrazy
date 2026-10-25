/* ==========================================
   هشام حسن — Portfolio JS
   ========================================== */
(function () {
  'use strict';

  // نفعّل JS class على body — عشان لو JS فشل، الـ reveal يبقى ظاهر
  document.body.classList.add('js-ready');

  // لو حصل خطأ، يظهر في الكونسول
  window.addEventListener('error', function (e) {
    console.error('JS Error:', e.message, '→', e.filename, ':', e.lineno);
  });

  document.addEventListener('DOMContentLoaded', function () {
    safe(initTheme);
    safe(initMobileMenu);
    safe(initTyping);
    safe(initScrollReveal);
    safe(initActiveNav);
    safe(initScrollProgress);
    safe(initBackToTop);
    safe(initProjectFilter);
    safe(initCounters);
    safe(initContactForm);
    safe(initCopy);
  });

  function safe(fn) {
    try { fn(); } catch (e) { console.warn('⚠️', fn.name, e); }
  }

  /* ========== 1) الوضع الليلي/النهاري ========== */
  function initTheme() {
    var btn = document.getElementById('themeBtn');
    if (!btn) return;

    var saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      btn.textContent = '☀️';
    }

    btn.addEventListener('click', function () {
      var isLight = document.documentElement.getAttribute('data-theme') === 'light';
      document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
      btn.textContent = isLight ? '🌙' : '☀️';
      localStorage.setItem('theme', isLight ? 'dark' : 'light');
    });
  }

  /* ========== 2) قائمة الموبايل ========== */
  function initMobileMenu() {
    var burger = document.getElementById('burger');
    var navLinks = document.getElementById('navLinks');
    if (!burger || !navLinks) return;

    burger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ========== 3) تأثير الكتابة ========== */
  function initTyping() {
    var el = document.getElementById('typed');
    if (!el) return;

    var roles = [
      'Front-End Developer',
      'Problem Solving',
      'Continuous Learning',
      'IT',
    ];
    var i = 0, c = 0, deleting = false;

    function loop() {
      var word = roles[i];
      el.textContent = word.substring(0, c);

      if (!deleting && c < word.length) { c++; setTimeout(loop, 90); }
      else if (!deleting) { deleting = true; setTimeout(loop, 1600); }
      else if (c > 0) { c--; setTimeout(loop, 40); }
      else { deleting = false; i = (i + 1) % roles.length; setTimeout(loop, 300); }
    }
    loop();
  }

  /* ========== 4) Scroll Reveal (بديل آمن) ========== */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('show'); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');

          // تحريك أشرطة المهارات
          entry.target.querySelectorAll('.bar span').forEach(function (bar) {
            var w = bar.getAttribute('data-w');
            if (w) bar.style.width = w + '%';
          });

          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (el) { obs.observe(el); });
  }

  /* ========== 5) تفعيل رابط التنقل ========== */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.nav-links a');
    if (!sections.length || !links.length) return;

    function update() {
      var cur = '';
      sections.forEach(function (s) {
        if (window.scrollY >= s.offsetTop - 200) cur = s.id;
      });
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ========== 6) شريط تقدم القراءة ========== */
  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = p + '%';
    }, { passive: true });
  }

  /* ========== 7) زر العودة للأعلى ========== */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========== 8) فلتر المشاريع ========== */
  function initProjectFilter() {
    var btns = document.querySelectorAll('.filter-btn');
    var grid = document.getElementById('projectsGrid');
    if (!btns.length || !grid) return;

    var projects = grid.querySelectorAll('.project');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');
        projects.forEach(function (p) {
          var show = (filter === 'all' || p.getAttribute('data-category') === filter);
          if (show) {
            p.style.display = '';
            p.style.animation = 'none';
            // إعادة تشغيل الأنيميشن
            void p.offsetWidth;
            p.style.animation = 'fadeIn .5s ease';
          } else {
            p.style.display = 'none';
          }
        });
      });
    });
  }

  /* ========== 9) عدّاد الأرقام ========== */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) {
        el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var cur = 0;
        var step = Math.max(1, Math.floor(target / 50));

        var timer = setInterval(function () {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(timer); }
          el.textContent = cur + suffix;
        }, 30);

        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { obs.observe(el); });
  }

  /* ========== 10) نموذج التواصل ========== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var msg = document.getElementById('formMsg');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var valid = true;

      [name, email, message].forEach(function (f) {
        if (!f) return;
        f.classList.remove('error');
        if (!f.value.trim()) { f.classList.add('error'); valid = false; }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }

      if (!valid) {
        if (msg) {
          msg.textContent = '⚠️ من فضلك اكمل الحقول بشكل صحيح';
          msg.className = 'form-msg error';
        }
        return;
      }

      // هنا ممكن تستخدم fetch لإرسال البيانات لسيرفر حقيقي
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.textContent;

      if (msg) {
        msg.textContent = '✅ تم إرسال رسالتك بنجاح! هرد عليك قريباً';
        msg.className = 'form-msg success';
      }

      btn.textContent = '✅ تم الإرسال';
      btn.disabled = true;

      setTimeout(function () {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        if (msg) { msg.textContent = ''; msg.className = 'form-msg'; }
      }, 3500);
    });
  }

  /* ========== 11) نسخ البريد / أي نص ========== */
  function initCopy() {
    var btns = document.querySelectorAll('[data-copy]');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var original = btn.textContent;

        function done() {
          btn.textContent = '✅ تم النسخ!';
          setTimeout(function () { btn.textContent = original; }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(fallback);
        } else {
          fallback();
        }

        function fallback() {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); done(); }
          catch (e) { console.warn('copy failed', e); }
          document.body.removeChild(ta);
        }
      });
    });
  }

})();