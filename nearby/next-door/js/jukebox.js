  /* the jukebox has the back room now (where the old studio was): same records, same second as the studio and the book corner */
  (function () {
    var room = document.getElementById("room-studio"); if (!room || !window.JBW) return;
    var inner = room.querySelector(".room-inner") || room;
    var st = document.createElement("style"); st.textContent = "#room-studio .room-inner>*:not(#jbRoom){display:none!important}#jbRoom{padding:6px 0 18px}#jbRoom .jbc-make{display:flex;width:max-content;margin:18px auto 0}";
    document.head.appendChild(st);
    var box = document.createElement("div"); box.id = "jbRoom"; inner.insertBefore(box, inner.firstChild);
    JBW.mount(box, { venue: "bar" });
    var make = document.createElement("a"); make.className = "jbc-make"; make.href = "../same-song/"; make.innerHTML = '<span aria-hidden="true">🎛️</span><span></span>'; make.lastChild.textContent = JB.w("make"); box.appendChild(make);
    JB.watch();
    /* walking into the room turns it on */
    new MutationObserver(function () { if (!room.classList.contains("hidden") && !JB.listening()) { JB.unlock(); JB.listen(true); JBW.fire(); JBW.paint(); } }).observe(room, { attributes: true, attributeFilter: ["class"] });
    /* the jukebox is the bar's music: it starts when you come in (NDJuke.on) */
    function on() { JB.unlock(); if (!JB.listening()) { JB.listen(true); JBW.fire(); } JBW.paint(); }
    window.NDJuke = { on: on };
    /* phones keep sound locked until a touch: the first tap anywhere lets the record play */
    document.addEventListener("pointerdown", function () { if (JB.listening()) JB.unlock(); }, true);
  })();
