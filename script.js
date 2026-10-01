/* ProduPlay — comportamento do site (menu, cabeçalho, revelação e formulários) */
(function () {
  document.documentElement.classList.replace('no-js', 'js');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var aberto = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    var fechar = function () { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') fechar(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { fechar(); burger.focus(); } });
    document.addEventListener('click', function (e) { if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) fechar(); });
  }

  var header = document.getElementById('topo');
  if (header) {
    var marcar = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', marcar, { passive: true }); marcar();
  }

  var itens = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0 });
    itens.forEach(function (el) { io.observe(el); });
    /* Rede de segurança: blocos altos nunca devem ficar invisíveis */
    setTimeout(function () { itens.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    itens.forEach(function (el) { el.classList.add('in'); });
  }

  /* Formulários (FormSubmit): envio por AJAX quando hospedado; envio nativo em arquivo local */
  function liga(form, statusId, okMsg) {
    if (!form) return;
    var status = document.getElementById(statusId);
    form.addEventListener('submit', function (e) {
      if (location.protocol === 'file:') return;
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      var txt = btn.textContent;
      if (status) { status.className = 'form-status'; status.textContent = 'Enviando…'; }
      btn.disabled = true; btn.textContent = 'Enviando…';
      var fd = new FormData(form);
      fetch('https://formsubmit.co/ajax/contato@produplay.com.br', { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          var ok = res && (res.success === true || res.success === 'true');
          if (ok) { form.reset(); if (status) { status.className = 'form-status ok'; status.textContent = okMsg; } }
          else if (status) { status.className = 'form-status err'; status.textContent = (res && res.message) || 'Não foi possível enviar agora. Tente de novo ou escreva para contato@produplay.com.br.'; }
        })
        .catch(function () { if (status) { status.className = 'form-status err'; status.textContent = 'Erro de conexão. Tente de novo ou escreva para contato@produplay.com.br.'; } })
        .then(function () { btn.disabled = false; btn.textContent = txt; });
    });
  }
  liga(document.getElementById('form-contato'), 'form-status', 'Mensagem enviada. Respondemos assim que possível. ✔');
  liga(document.getElementById('form-lista'), 'lista-status', 'Você está na lista. Avisamos assim que abrir turma. ✔');

  /* Retorno do envio nativo (?ok=1) */
  if (/[?&]ok=1/.test(location.search)) {
    var s = document.getElementById('form-status') || document.getElementById('lista-status');
    if (s) { s.className = 'form-status ok'; s.textContent = 'Recebemos sua mensagem. Obrigado! ✔'; s.scrollIntoView({ block: 'center' }); }
  }
})();
