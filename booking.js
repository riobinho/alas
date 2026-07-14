/* Modal de contratación reutilizable.
   Se inyecta en cualquier página que tenga uno o más botones con [data-book].
   El valor de data-book es el nombre del artista, que queda fijado en la
   solicitud. Envía a /api/lead como contratación y cuenta como conversión.
   Usa <dialog> nativo (foco atrapado, Escape para cerrar) y las variables de
   marca de la propia página. */
(function () {
  var CSS = `
  .bm{border:none;padding:0;margin:auto;color:var(--paper);background:var(--ink);max-width:520px;width:calc(100% - 32px);
    border:1px solid var(--rule);border-radius:18px;box-shadow:0 40px 100px -30px rgba(0,0,0,.8);
    max-height:calc(100dvh - 40px);overflow:auto;cursor:auto}
  .bm::backdrop{background:rgba(10,7,5,.62);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
  .bm[open]{animation:bm-in .3s cubic-bezier(.22,.65,.12,1)}
  @keyframes bm-in{from{opacity:0;transform:translateY(12px)}}
  .bm-inner{padding:clamp(22px,4vw,34px);position:relative}
  .bm-x{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid var(--rule);
    background:transparent;color:var(--paper-dim);font-size:19px;line-height:1;cursor:pointer;transition:color .2s,border-color .2s}
  .bm-x:hover{color:var(--paper);border-color:rgba(239,233,220,.5)}
  .bm .kicker{font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
  .bm-title{font-family:var(--sans);font-weight:500;font-size:clamp(23px,4vw,29px);text-transform:lowercase;letter-spacing:-.03em;margin:12px 0 22px;line-height:1.05}
  .bm .field{margin-bottom:14px}
  .bm .two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .bm label{display:block;font-size:12.5px;font-weight:500;color:var(--paper);margin-bottom:6px}
  .bm label .opt{color:var(--paper-quiet);font-weight:400}
  .bm input,.bm textarea{width:100%;font-family:var(--sans);font-size:15px;color:var(--paper);background:rgba(239,233,220,.04);
    border:1px solid var(--rule);border-radius:11px;padding:12px 14px;cursor:text;transition:border-color .2s,background .2s}
  .bm input[type=date]{color-scheme:dark}
  .bm input::placeholder,.bm textarea::placeholder{color:rgba(239,233,220,.32)}
  .bm input:focus,.bm textarea:focus{outline:none;border-color:var(--accent);background:rgba(239,233,220,.06)}
  .bm textarea{resize:vertical;min-height:92px;line-height:1.5}
  .bm input:user-invalid,.bm textarea:user-invalid{border-color:#b3402e}
  .bm-submit{display:inline-flex;align-items:center;gap:8px;margin-top:6px;font-family:var(--sans);font-weight:500;font-size:15px;
    color:#1a1410;background:var(--accent);border:none;border-radius:999px;padding:13px 26px;cursor:pointer;transition:opacity .2s}
  .bm-submit:hover{opacity:.88}
  .bm-submit[disabled]{opacity:.55}
  .bm-error{display:none;margin-top:10px;color:#e08a7b;font-size:13px}
  .bm .hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
  .bm-success{display:none;flex-direction:column;gap:8px;text-align:left}
  .bm-success .ok{width:50px;height:50px;border-radius:50%;background:var(--accent);color:#1a1410;display:flex;align-items:center;justify-content:center;font-size:24px}
  .bm-success h2{font-family:var(--sans);font-weight:500;font-size:24px;text-transform:lowercase;letter-spacing:-.03em;margin-top:6px}
  .bm-success p{color:var(--paper-dim);font-size:14.5px;line-height:1.6;max-width:40ch}
  .bm.sent .bm-fields{display:none}
  .bm.sent .bm-success{display:flex}
  @media (max-width:520px){.bm .two{grid-template-columns:1fr}.bm{width:calc(100% - 18px)}}`;

  function init() {
    var triggers = document.querySelectorAll('[data-book]');
    if (!triggers.length) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var dlg = document.createElement('dialog');
    dlg.className = 'bm';
    dlg.setAttribute('aria-label', 'Formulario de contratación');
    dlg.innerHTML =
      '<div class="bm-inner">' +
        '<button type="button" class="bm-x" aria-label="Cerrar">×</button>' +
        '<form class="bm-form" novalidate>' +
          '<div class="bm-fields">' +
            '<span class="kicker">contratación</span>' +
            '<h2 class="bm-title">contratar</h2>' +
            '<div class="hp" aria-hidden="true"><label>No rellenar<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>' +
            '<input type="hidden" name="artista" value="">' +
            '<div class="field"><label>Nombre o entidad</label><input name="name" required autocomplete="organization" placeholder="Tu nombre, sala, festival…"></div>' +
            '<div class="field"><label>Tipo de evento <span class="opt">(opcional)</span></label><input name="evento" placeholder="Festival, club, evento privado…"></div>' +
            '<div class="two">' +
              '<div class="field"><label>Fecha <span class="opt">(opcional)</span></label><input type="date" name="fecha"></div>' +
              '<div class="field"><label>Ubicación <span class="opt">(opcional)</span></label><input name="ubicacion" placeholder="Ciudad, país"></div>' +
            '</div>' +
            '<div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email" placeholder="tu@email.com"></div>' +
            '<div class="field"><label>Mensaje</label><textarea name="mensaje" required placeholder="Cuéntanos sobre tu evento, presupuesto y detalles…"></textarea></div>' +
            '<button type="submit" class="bm-submit"><span class="bm-label">enviar solicitud</span> <span aria-hidden="true">→</span></button>' +
            '<span class="bm-error">No se pudo enviar. Inténtalo de nuevo o escríbenos a info@alasservice.com.</span>' +
          '</div>' +
          '<div class="bm-success"><div class="ok" aria-hidden="true">✓</div><h2>solicitud enviada</h2><p>Gracias. Hemos recibido tu propuesta de contratación y te responderemos lo antes posible.</p></div>' +
        '</form>' +
      '</div>';
    document.body.appendChild(dlg);

    var form = dlg.querySelector('.bm-form');
    var artistaInput = dlg.querySelector('[name=artista]');
    var titleEl = dlg.querySelector('.bm-title');
    var errBox = dlg.querySelector('.bm-error');
    var submitBtn = dlg.querySelector('.bm-submit');
    var label = dlg.querySelector('.bm-label');

    function open(artista) {
      // Sin soporte de <dialog>: caemos a la página de contratación
      if (typeof dlg.showModal !== 'function') {
        location.href = '/contratacion' + (artista ? ('?artista=' + encodeURIComponent(artista)) : '');
        return;
      }
      dlg.classList.remove('sent');
      form.reset();
      artistaInput.value = artista || '';
      titleEl.textContent = artista ? ('contratar a ' + artista) : 'contratación';
      if (errBox) errBox.style.display = 'none';
      dlg.showModal();
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () { open(btn.getAttribute('data-book')); });
    });
    dlg.querySelector('.bm-x').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (errBox) errBox.style.display = 'none';
      var d = {};
      new FormData(form).forEach(function (v, k) { d[k] = v; });
      d.tipo = 'contratacion';
      submitBtn.disabled = true;
      var prev = label.textContent;
      label.textContent = 'enviando…';
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      }).then(function (res) {
        if (!res.ok) throw new Error('fail');
        dlg.classList.add('sent');
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', lead_type: 'contratacion' });
      }).catch(function () {
        if (errBox) errBox.style.display = 'block';
      }).finally(function () {
        submitBtn.disabled = false;
        label.textContent = prev;
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
