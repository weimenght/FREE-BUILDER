/* Popo's blue biscuit tin sits on the lower shelf behind the counter: tap it to open it (what you've found, her story).
   Meeting someone happens at the Wall, among the graffiti and the postcards (Wei's introductions, in the shell). */
(function () {
  const S = (en, zh, tw, es, ca) => lx([en, zh, tw, tw, es, ca]);
  const TIN = S("Popo's tin", "婆婆的饼干罐", "婆婆的曲奇罐", "La lata de Popo", "La llauna de la Popo"), MEET = S("Find a friend", "找个朋友", "找個朋友", "Busca un amigo", "Troba un amic"),
    BOARD = S("FIND A FRIEND · THE WALL", "找个朋友 · 墙上", "找個朋友 · 牆上", "BUSCA UN AMIGO · EL MURO", "TROBA UN AMIC · EL MUR");
  const st = document.createElement('style');
  st.textContent = '#nd-tin{position:absolute;top:92px;left:47%;z-index:2;width:26px;height:24px;padding:0;border:0;background:none;cursor:pointer;filter:drop-shadow(1px 2px 0 rgba(0,0,0,.6))}#nd-tin svg{width:100%;height:100%;image-rendering:pixelated}#nd-tin:hover{transform:translateY(-1px)}#nd-tin:focus-visible{outline:2px solid var(--amber,#f6b73c);outline-offset:2px}';
  document.head.appendChild(st);
  const tin = document.getElementById('nd-tin'); try { tin.innerHTML = FBWorld.pix('tin'); } catch (e) {}
  window.NDTin = function () { try { (window.FBTale || parent.FBTale).tin(); } catch (e) {} };
  function words() { tin.setAttribute('aria-label', L(TIN)); tin.title = L(TIN); const m = document.getElementById('wall-meet-l'); if (m) m.textContent = L(MEET); }
  /* Find a friend: a corner of the Wall where people pin a card (a name, a line, what they like); it's the Wall's own board,
     not a host talking (the same introductions as before: town_wei_* via intro_*, names only once both say yes) */
  st.textContent += '#nd-friend{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;width:min(420px,calc(100vw - 20px));max-height:78vh;overflow:auto;padding:14px 14px 12px;background:#f4e8cf;color:#2a1d14;border:3px solid #000;box-shadow:6px 6px 0 #000;font:400 20px/1.3 "VT323",monospace}#nd-friend[hidden]{display:none}#nd-friend b.l{display:block;font:400 9px/1.5 "Press Start 2P",monospace;color:#8a2a2a;margin:0 26px 8px 0}#nd-friend .say{margin:0 0 10px}#nd-friend .opts{display:grid;gap:8px}#nd-friend .opts small{display:block;opacity:.7;font-size:.85em}#nd-friend .x{position:absolute;right:8px;top:6px;border:0;background:none;font:20px monospace;cursor:pointer;color:#2a1d14}#nd-friend::before{content:"";position:absolute;left:50%;top:-8px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#c8303a;border:2px solid #000}';
  /* the paper card reads in ink (the form's own labels are written for Wei's dark card), and the menu's tabs aren't cut */
  st.textContent += '#nd-friend label,#nd-friend .fbw-note,#nd-friend .say,#nd-friend small{color:#4a3424!important;opacity:1!important}#nd-friend label{display:block;margin:8px 0 4px;font:400 20px/1.2 "VT323",monospace}#nd-friend .fbw-note{font-size:17px;line-height:1.3}#nd-friend input,#nd-friend textarea{width:100%;box-sizing:border-box;background:#fffaf0;color:#2a1d14;border:3px solid #000;font:400 20px/1.3 "VT323",monospace;padding:6px 8px}#nd-friend input::placeholder,#nd-friend textarea::placeholder{color:#8a7a64}' +
    '.tabs{overflow-y:hidden;padding:4px 2px 6px;align-items:center;flex-wrap:nowrap}.tabs .tab{flex:none;min-height:40px;line-height:1.25;padding:8px 12px;overflow:visible}';
  window.NDFriend = function () {
    let el = document.getElementById('nd-friend');
    if (!el) { el = document.createElement('section'); el.id = 'nd-friend'; el.setAttribute('role', 'dialog'); el.innerHTML = '<b class="l"></b><p class="say" aria-live="polite"></p><div class="opts"></div><button type="button" class="x" aria-label="✕">✕</button>'; document.body.appendChild(el); el.querySelector('.x').onclick = () => { el.hidden = true; }; }
    el.hidden = false; el.querySelector('.l').textContent = L(BOARD);
    const say = el.querySelector('.say'), opts = el.querySelector('.opts');
    const btn = (label, fn, sub, ghost) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'fbb' + (ghost ? ' fbb-glass' : ''); b.textContent = label; if (sub) { const sm = document.createElement('small'); sm.textContent = sub; b.appendChild(sm); } b.onclick = fn; opts.appendChild(b); return b; };
    const close = () => { el.hidden = true; };
    if (window.FBG && FBG.introduce) FBG.introduce(t => { say.textContent = t; }, opts, btn, close); else close();
  };
  words(); addEventListener('fbl:lang', words); setInterval(words, 4000);
})();
