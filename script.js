// COLOQUE AQUI O LINK DA SUA PÁGINA DO CURSO NO SYMPLA:
    var SYMPLA_URL = "https://www.sympla.com.br/evento-online/da-ideia-ao-projeto/3494887?referrer=www.google.com&referrer=www.google.com";
    document.getElementById("sympla-btn").href = SYMPLA_URL;
    document.querySelectorAll(".sympla-link").forEach(function(a){ a.href = SYMPLA_URL; });

    var burger = document.getElementById("burger");
    var menu = document.getElementById("menu");
    burger.addEventListener("click", function(){ menu.classList.toggle("open"); });
    menu.addEventListener("click", function(e){ if(e.target.tagName === "A") menu.classList.remove("open"); });

    var header = document.getElementById("topo");
    window.addEventListener("scroll", function(){ header.classList.toggle("scrolled", window.scrollY > 10); });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold:.15 });
    document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });

    // ===================== FORMULÁRIO DE CONTATO (envio por e-mail via FormSubmit) =====================
    var formContato = document.getElementById("form-contato");
    if (formContato) {
      formContato.addEventListener("submit", function (e) {
        // Teste local (arquivo aberto direto no navegador, file://): deixa o envio
        // nativo do formulário acontecer, pois o envio via AJAX só funciona quando
        // o site está hospedado (http/https).
        if (location.protocol === "file:") return;
        e.preventDefault();
        var status = document.getElementById("form-status");
        var btn = formContato.querySelector("button[type=submit]");
        var btnText = btn.textContent;
        status.className = "form-status";
        status.textContent = "Enviando sua mensagem...";
        btn.disabled = true;
        btn.textContent = "Enviando...";

        fetch("https://formsubmit.co/ajax/contato@produplay.com.br", {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(formContato)
        })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          var ok = res && (res.success === true || res.success === "true");
          if (ok) {
            formContato.reset();
            status.className = "form-status ok";
            status.textContent = "Mensagem enviada com sucesso! A equipe da ProduPlay vai responder em breve. ✔";
          } else {
            status.className = "form-status err";
            status.textContent = (res && res.message) ? res.message : "Não foi possível enviar agora. Tente novamente ou escreva para contato@produplay.com.br.";
          }
        })
        .catch(function () {
          status.className = "form-status err";
          status.textContent = "Erro de conexão. Tente novamente ou escreva para contato@produplay.com.br.";
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = btnText;
        });
      });
    }
