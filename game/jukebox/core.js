/* FREE//BUILDER Jukebox · core
   One shared turntable for the studio (/game/jukebox/), Wei's Bar and the Dog-Eared Corner.
   - a song is a short code: 1.<bpm>.<mood>.<instrument>.<melody 8x16 as 32 hex>.<drums 3x16 as 12 hex>
   - the synth turns that code into a ~30 s arrangement (intro, bass, drums, full, lift, outro)
   - the clock asks the database what is playing for everyone, and plays it from the right second
   No account. Listening is a read; dropping a coin sends the record id, the venue and your nickname. */
(function () {
  "use strict";
  if (window.JB) return;

  /* ---------------- songs ---------------- */
  var MOODS = [
    { k: "sun", root: 60, scale: [0, 2, 4, 7, 9], prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], col: "#f6b73c" },        /* C major pentatonic, I V vi IV */
    { k: "rain", root: 57, scale: [0, 3, 5, 7, 10], prog: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]], col: "#5b8def" },       /* A minor, i VI III VII */
    { k: "lantern", root: 62, scale: [0, 2, 5, 7, 9], prog: [[0, 7, 14], [5, 9, 12], [-3, 2, 9], [-5, 2, 7]], col: "#e2553f" },    /* D gong-ish open fifths */
    { k: "smoke", root: 55, scale: [0, 3, 5, 6, 7, 10], prog: [[0, 4, 10], [5, 9, 15], [0, 4, 10], [7, 11, 17]], col: "#9b6fd8" }  /* G blues, 7th chords */
  ];
  var INSTR = ["musicbox", "piano", "chip", "pluck"];
  var ROWS = 8, STEPS = 16, LOOPS = 6;

  function rowNote(mood, row) {   /* row 0 = top = highest */
    var m = MOODS[mood] || MOODS[0], sc = m.scale, idx = ROWS - 1 - row;
    return m.root + 12 * Math.floor(idx / sc.length) + sc[idx % sc.length];
  }
  function bitsToHex(grid) {      /* grid: array of rows, each an array of 16 booleans */
    var h = ""; grid.forEach(function (r) { for (var q = 0; q < 4; q++) { var n = 0; for (var b = 0; b < 4; b++) if (r[q * 4 + b]) n |= 8 >> b; h += n.toString(16); } }); return h;
  }
  function hexToBits(h, rows) {
    var g = []; for (var r = 0; r < rows; r++) { var row = []; for (var q = 0; q < 4; q++) { var n = parseInt(h[r * 4 + q] || "0", 16); for (var b = 0; b < 4; b++) row.push(!!(n & (8 >> b))); } g.push(row); } return g;
  }
  function encode(s) { return ["1", Math.round(s.bpm), s.mood | 0, s.inst | 0, bitsToHex(s.mel), bitsToHex(s.drum)].join("."); }
  function decode(code) {
    var p = String(code || "").split("."); if (p.length !== 6 || p[0] !== "1") return null;
    return { bpm: Math.max(72, Math.min(140, +p[1] || 100)), mood: (+p[2] || 0) % MOODS.length, inst: (+p[3] || 0) % INSTR.length, mel: hexToBits(p[4], ROWS), drum: hexToBits(p[5], 3) };
  }
  function seconds(s) { if (typeof s === "string") s = decode(s); return s ? 96 * 30 / s.bpm : 30; }
  function blank() { var g = function (n) { var a = []; for (var i = 0; i < n; i++) { var r = []; for (var j = 0; j < STEPS; j++) r.push(false); a.push(r); } return a; }; return { bpm: 100, mood: 0, inst: 0, mel: g(ROWS), drum: g(3) }; }

  /* a pleasant random tune: a walking line that leans on chord tones, with rests and a rhythm that repeats */
  function rnd(seed) { var x = (Math.imul(seed >>> 0, 2654435761) ^ 0x9e3779b9) >>> 0 || 1; for (var w = 0; w < 6; w++) { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; } return function () { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function random(seed) {
    var R = rnd(seed == null ? (Math.random() * 4294967296) : seed), s = blank();
    s.mood = Math.floor(R() * MOODS.length); s.inst = Math.floor(R() * INSTR.length); s.bpm = [78, 88, 96, 104, 112, 120][Math.floor(R() * 6)];
    var rhythm = []; for (var i = 0; i < 8; i++) rhythm.push(i % 4 === 0 || R() < 0.55);
    var row = 3 + Math.floor(R() * 3);
    for (var st = 0; st < STEPS; st++) {
      if (!rhythm[st % 8] || (st % 8 && R() < 0.08)) continue;
      row = Math.max(0, Math.min(ROWS - 1, row + [-2, -1, -1, 0, 1, 1, 2][Math.floor(R() * 7)]));
      s.mel[row][st] = true;
      if (st % 4 === 0 && R() < 0.25) s.mel[Math.min(ROWS - 1, row + 2)][st] = true;
    }
    var beat = Math.floor(R() * 3);
    for (st = 0; st < STEPS; st++) {
      s.drum[0][st] = st % 8 === 0 || (beat === 1 && st === 10) || (beat === 2 && (st === 6 || st === 11));
      s.drum[1][st] = st % 8 === 4 || (beat === 2 && st === 15);
      s.drum[2][st] = beat === 0 ? st % 2 === 0 : (st % 2 === 0 || R() < 0.2);
    }
    return s;
  }
  function hue(code) { var h = 0; code = String(code); for (var i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) >>> 0; return h % 360; }

  /* ---------------- sound ---------------- */
  var ctx = null, master = null, duck = null, comp = null, verb = null, noiseBuf = null, analyser = null;
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0.8;
    duck = ctx.createGain(); duck.gain.value = 1;
    analyser = ctx.createAnalyser(); analyser.fftSize = 256;
    master.connect(duck); duck.connect(comp); comp.connect(analyser); analyser.connect(ctx.destination);
    /* a small room: two filtered delays */
    verb = ctx.createGain(); verb.gain.value = 0.22;
    [0.113, 0.177].forEach(function (t, i) { var d = ctx.createDelay(1); d.delayTime.value = t; var fb = ctx.createGain(); fb.gain.value = 0.32; var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600 - i * 700; verb.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master); });
    var n = ctx.sampleRate; noiseBuf = ctx.createBuffer(1, n, n); var dd = noiseBuf.getChannelData(0); for (var i = 0; i < n; i++) dd[i] = Math.random() * 2 - 1;
    return ctx;
  }
  function unlock() { var c = audio(); if (c && c.state === "suspended") c.resume(); if (c) { var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } }
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function out(g, wet) { g.connect(master); if (wet) { var w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(verb); } }

  function note(inst, midi, t, len, vel) {
    var f = hz(midi), g = ctx.createGain(), o, o2, lp;
    g.gain.value = 0;
    if (inst === 0) {          /* music box: sine + bright partial, long ring */
      o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * 2;
      o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2 * 4.2; var g2 = ctx.createGain(); g2.gain.setValueAtTime(0.18 * vel, t); g2.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o2.connect(g2); g2.connect(g);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32 * vel, t + 0.004); g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      o.connect(g); out(g, 0.9); o.start(t); o2.start(t); o.stop(t + 1.7); o2.stop(t + 0.3);
    } else if (inst === 1) {   /* felt piano: triangle + soft saw through a closing filter */
      o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = f;
      o2 = ctx.createOscillator(); o2.type = "sawtooth"; o2.frequency.value = f; o2.detune.value = 4;
      lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.9);
      var m2 = ctx.createGain(); m2.gain.value = 0.25; o2.connect(m2); m2.connect(lp); o.connect(lp); lp.connect(g);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4 * vel, t + 0.006); g.gain.exponentialRampToValueAtTime(0.12 * vel, t + 0.25); g.gain.exponentialRampToValueAtTime(0.001, t + Math.max(0.6, len * 2.2));
      out(g, 0.5); o.start(t); o2.start(t); o.stop(t + len * 2.4 + 0.7); o2.stop(t + len * 2.4 + 0.7);
    } else if (inst === 2) {   /* chip: pulse with a little vibrato */
      o = ctx.createOscillator(); o.type = "square"; o.frequency.value = f * 2;
      var v = ctx.createOscillator(), vg = ctx.createGain(); v.frequency.value = 6; vg.gain.value = f * 0.012; v.connect(vg); vg.connect(o.frequency);
      lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800; o.connect(lp); lp.connect(g);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.13 * vel, t + 0.005); g.gain.setValueAtTime(0.1 * vel, t + len * 0.8); g.gain.exponentialRampToValueAtTime(0.001, t + len * 0.98);
      out(g, 0.25); o.start(t); v.start(t); o.stop(t + len + 0.05); v.stop(t + len + 0.05);
    } else {                   /* pluck: guzheng / nylon guitar, filtered saw with a fast bloom */
      o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f;
      o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = f * 2;
      lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 2; lp.frequency.setValueAtTime(f * 9, t); lp.frequency.exponentialRampToValueAtTime(f * 1.1, t + 0.35);
      o.connect(lp); var m3 = ctx.createGain(); m3.gain.value = 0.3; o2.connect(m3); m3.connect(g); lp.connect(g);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32 * vel, t + 0.003); g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      out(g, 0.55); o.start(t); o2.start(t); o.stop(t + 1.25); o2.stop(t + 1.25);
    }
  }
  function pad(chord, root, t, len, vol) {
    chord.forEach(function (iv, i) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = "sawtooth"; o.frequency.value = hz(root - 12 + iv); o.detune.value = (i - 1) * 7;
      lp.type = "lowpass"; lp.frequency.value = 900;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035 * vol, t + len * 0.3); g.gain.linearRampToValueAtTime(0.0, t + len);
      o.connect(lp); lp.connect(g); out(g, 0.6); o.start(t); o.stop(t + len + 0.05);
    });
  }
  function bass(midi, t, len) {
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = "triangle"; o.frequency.value = hz(midi); lp.type = "lowpass"; lp.frequency.value = 500;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.38, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + len);
    o.connect(lp); lp.connect(g); out(g, 0); o.start(t); o.stop(t + len + 0.02);
  }
  function drum(kind, t, vel) {
    var g = ctx.createGain();
    if (kind === 0) {
      var o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      g.gain.setValueAtTime(0.75 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32); o.connect(g); out(g, 0); o.start(t); o.stop(t + 0.34);
    } else {
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(); s.buffer = noiseBuf;
      if (kind === 1) { f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.8; g.gain.setValueAtTime(0.42 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18); }
      else { f.type = "highpass"; f.frequency.value = 7500; g.gain.setValueAtTime(0.14 * vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); }
      s.connect(f); f.connect(g); out(g, kind === 1 ? 0.3 : 0); s.start(t, Math.random() * 0.5); s.stop(t + 0.2);
    }
  }

  /* ---------------- the player ----------------
     play(song, {at: AudioContext time to start, from: seconds into the song, loop: studio preview, onStep, onEnd}) */
  function Player() { this.timer = null; this.song = null; }
  Player.prototype.play = function (song, o) {
    o = o || {}; this.stop(); var c = audio(); if (!c) return;
    if (typeof song === "string") song = decode(song); if (!song) return;
    var me = this, dt = 30 / song.bpm, total = o.loop ? Infinity : STEPS * LOOPS;
    var start = (o.at != null ? o.at : c.currentTime + 0.06) - (o.from || 0);
    var k = Math.max(0, Math.ceil(((o.from || 0) - 0.02) / dt)), m = MOODS[song.mood];
    me.song = song; me.start = start; me.dt = dt; me.loop = !!o.loop;
    function sched() {
      var horizon = c.currentTime + 0.15;
      while (k < total && start + k * dt < horizon) {
        var t = start + k * dt, st = k % STEPS, lp = o.loop ? 3 : Math.floor(k / STEPS), s = me.song;   /* the studio always hears the full mix */
        if (t >= c.currentTime - 0.01) {
          var bar = Math.floor(st / 4), ch = m.prog[bar], fade = (!o.loop && lp === LOOPS - 1) ? Math.max(0.25, 1 - (st / STEPS) * 0.7) : 1;
          m = MOODS[s.mood];
          ch = m.prog[bar];
          if (st % 4 === 0) pad(ch, m.root, t, dt * 4, lp === 0 ? 0.6 : 1);
          if (lp >= 1 && (st % 8 === 0 || st % 8 === 6 || (lp >= 3 && st % 8 === 3))) bass(m.root - 24 + ch[0], t, dt * (st % 8 === 0 ? 2.5 : 1.5));
          for (var r = 0; r < ROWS; r++) if (s.mel[r][st]) {
            var mid = rowNote(s.mood, r), vel = (st % 4 === 0 ? 1 : 0.8) * fade;
            note(s.inst, mid, t, dt, vel);
            if (!o.loop && lp === 4) note(s.inst === 0 ? 0 : s.inst, mid + 12, t + 0.008, dt, vel * 0.35);
          }
          if (lp >= 2) for (var d = 0; d < 3; d++) if (s.drum[d][st]) drum(d, t, (lp === 2 ? 0.7 : 1) * fade * (d === 2 && st % 4 ? 0.7 : 1));
          if (o.onStep) (function (st, t, lp) { var w = (t - c.currentTime) * 1000; setTimeout(function () { if (me.timer) o.onStep(st, lp); }, Math.max(0, w)); })(st, t, lp);
        }
        k++;
      }
      if (k >= total && c.currentTime > start + total * dt + 1.2) { me.stop(); if (o.onEnd) o.onEnd(); }
    }
    sched(); this.timer = setInterval(sched, 25);
  };
  Player.prototype.set = function (song) { this.song = song; };   /* studio: edits are heard on the next step */
  Player.prototype.stop = function () { if (this.timer) clearInterval(this.timer); this.timer = null; };
  Player.prototype.playing = function () { return !!this.timer; };

  /* ---------------- the shared turntable ---------------- */
  var cfg = { url: "", key: "" }, cfgWait = [];
  (function () {
    if (window.FB_SUPABASE) { cfg.url = FB_SUPABASE.url || ""; cfg.key = FB_SUPABASE.anonKey || ""; return; }
    var sc = document.createElement("script"); sc.src = "/config.js";
    sc.onload = sc.onerror = function () { var c = window.FB_SUPABASE || {}; cfg.url = c.url || ""; cfg.key = c.anonKey || ""; cfgWait.splice(0).forEach(function (f) { f(); }); };
    document.head.appendChild(sc);
  })();
  function ready() { return new Promise(function (r) { if (cfg.url || window.FB_SUPABASE) { if (!cfg.url && window.FB_SUPABASE) { cfg.url = FB_SUPABASE.url; cfg.key = FB_SUPABASE.anonKey; } r(); } else cfgWait.push(r); }); }
  function rest(path, opt) {
    opt = opt || {};
    return ready().then(function () {
      if (!cfg.url) throw new Error("offline");
      return fetch(cfg.url + "/rest/v1/" + path, { method: opt.method || "GET", headers: { apikey: cfg.key, Authorization: "Bearer " + cfg.key, "Content-Type": "application/json" }, body: opt.body ? JSON.stringify(opt.body) : undefined })
        .then(function (r) { return r.text().then(function (x) { var j = null; try { j = x ? JSON.parse(x) : null; } catch (e) {} if (!r.ok) throw new Error((j && (j.message || j.hint)) || ("HTTP " + r.status)); return j; }); });
    });
  }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function key(create) {
    var k = ls("fb_device_key");
    if (!k && create) { var a = new Uint8Array(32); crypto.getRandomValues(a); k = btoa(String.fromCharCode.apply(null, a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); ls("fb_device_key", k); }
    return k;
  }
  function nick() { return (ls("fb_nick") || "").trim(); }

  /* house records: what the jukebox plays when the database is out of reach (and the first records it was given) */
  var HOUSE = [{"id": "h1", "title": "Hutong Rain", "name": "Wei", "house": true, "song": "1.84.1.1.00000000100022008080002000100002.80200808aaaa"},
    {"id": "h2", "title": "Last Train to Gulou", "name": "Wei", "house": true, "song": "1.104.0.0.00000000000008002200812200840008.80800808ffff"},
    {"id": "h3", "title": "Yuzu on the Piano", "name": "Yuzu", "house": true, "song": "1.96.0.1.00800020800812000801000000000000.82800808aaaa"},
    {"id": "h4", "title": "Miso's Midnight Snack", "name": "Miso", "house": true, "song": "1.112.3.2.00000000008004200800101020088002.90900808aaaa"},
    {"id": "h5", "title": "Dog-Eared Waltz", "name": "Wei", "house": true, "song": "1.88.2.3.00000000108022008080002000080002.800002088888"},
    {"id": "h6", "title": "Neon over Barcelona", "name": "Wei", "house": true, "song": "1.120.1.2.00800240882040082002000000000000.82900808ffff"}];

  var off = 0, plays = [], online = false, listeners = [], lastErr = "";
  function now() { return Date.now() + off; }
  function emit() { listeners.forEach(function (f) { try { f(state()); } catch (e) {} }); }
  function localRadio() {   /* same 45-second slots as the database, from the house records */
    var slot = Math.floor(Date.now() / 45000), out = [];
    for (var i = 0; i < 2; i++) { var r = HOUSE[((slot + i) * 2654435761 >>> 0) % HOUSE.length], st = (slot + i) * 45000; out.push({ record_id: r.id, title: r.title, name: r.name, song: r.song, house: true, venue: null, by_name: null, s: st, e: st + seconds(r.song) * 1000, queued: false }); }
    return out;
  }
  function poll() {
    var t0 = Date.now();
    return rest("rpc/jukebox_now").then(function (rows) {
      var t1 = Date.now(); online = true; lastErr = "";
      if (rows && rows[0] && rows[0].server_now) off = Date.parse(rows[0].server_now) + (t1 - t0) / 2 - t1;
      plays = (rows || []).map(function (r) { return { record_id: r.record_id, title: r.title, name: r.name, song: r.song, house: r.house, venue: r.venue, by_name: r.by_name, s: Date.parse(r.starts_at), e: Date.parse(r.ends_at), queued: r.queued }; });
      if (!plays.length) plays = localRadio();
      emit();
    }).catch(function (e) { online = false; lastErr = String(e && e.message || e); off = 0; plays = localRadio(); emit(); });
  }
  function current() { var t = now(); for (var i = 0; i < plays.length; i++) if (plays[i].s <= t && plays[i].e > t) return plays[i]; return null; }
  function upcoming() { var t = now(); return plays.filter(function (p) { return p.s > t; }).sort(function (a, b) { return a.s - b.s; }); }
  function state() { return { now: current(), next: upcoming(), online: online, err: lastErr }; }

  /* the venue speaker: follows the shared clock */
  var speaker = new Player(), on = false, playingKey = "", pollT = null, tickT = null, vol = 0.8;
  function tick() {
    if (!on) return;
    var c = audio(), p = current(), k = p ? p.record_id + "@" + p.s : "";
    if (k !== playingKey) {
      playingKey = k; speaker.stop();
      if (p && c) {
        var from = (now() - p.s) / 1000;
        if (from < seconds(p.song) - 1) speaker.play(p.song, { from: Math.max(0, from), onStep: function (st, lp) { stepFns.forEach(function (f) { f(st, lp, p); }); } });
      }
      emit();
    }
  }
  var stepFns = [];
  function listen(yes) {
    on = yes !== false;
    if (on) { unlock(); if (!pollT) { poll().then(tick); pollT = setInterval(function () { if (!document.hidden) poll().then(tick); }, 7000); tickT = setInterval(tick, 250); } else tick(); }
    else { speaker.stop(); playingKey = ""; }
    emit();
  }
  function watch() { if (!pollT) { poll(); pollT = setInterval(function () { if (!document.hidden) poll().then(tick); }, 7000); tickT = setInterval(tick, 250); } }
  document.addEventListener("visibilitychange", function () { if (!document.hidden && pollT) poll().then(tick); });

  function records(limit) {
    return rest("jukebox_records?select=id,name,title,song,house,spins,created_at&order=created_at.desc&limit=" + (limit || 60))
      .then(function (r) { return r && r.length ? r : HOUSE.slice(); }).catch(function () { return HOUSE.slice(); });
  }
  function spin(id, venue) {
    if (String(id).charAt(0) === "h" && id.length < 4) return Promise.reject(new Error("offline"));
    return rest("rpc/jukebox_spin", { method: "POST", body: { p_secret: key(true), p_id: id, p_venue: venue, p_name: nick() } }).then(function (st) { return poll().then(function () { tick(); return st; }); });
  }
  function press(name, title, song) {
    if (name) ls("fb_nick", name.slice(0, 32));
    return rest("rpc/jukebox_press", { method: "POST", body: { p_secret: key(true), p_name: name, p_title: title, p_song: typeof song === "string" ? song : encode(song) } });
  }
  function mine() { var k = key(false); if (!k) return Promise.resolve([]); return rest("rpc/jukebox_mine", { method: "POST", body: { p_secret: k } }).then(function (ids) { return (ids || []).map(function (r) { return typeof r === "string" ? r : r.jukebox_mine; }); }).catch(function () { return []; }); }
  function hide(id) { return rest("rpc/jukebox_hide", { method: "POST", body: { p_secret: key(true), p_id: id } }); }

  /* five languages for the few words the machine shows */
  var W = {
    spunAt: ["played in {v} by {n}", "{n} 在{v}点播", "{n} 在{v}點播", "puesta en {v} por {n}", "posada a {v} per {n}"],
    spunAt0: ["played in {v}", "在{v}点播", "在{v}點播", "puesta en {v}", "posada a {v}"],
    studio: ["the studio", "录音室", "錄音室", "el estudio", "l'estudi"],
    bar: ["Wei's Bar", "Wei 的酒吧", "Wei 的酒吧", "el bar de Wei", "el bar d'en Wei"],
    books: ["the book corner", "书角", "書角", "el rincón de libros", "el racó de llibres"],
    house: ["house record", "店里的唱片", "店裡的唱片", "disco de la casa", "disc de la casa"],
    by: ["by {n}", "{n} 作", "{n} 作", "de {n}", "de {n}"],
    next: ["next", "下一首", "下一首", "después", "després"],
    full: ["The queue is full — try in a minute", "队列满了，过一会儿再试", "佇列滿了，過一會兒再試", "La cola está llena: prueba en un minuto", "La cua és plena: prova-ho d'aquí a un minut"],
    fast: ["One coin at a time", "一次投一枚硬币", "一次投一枚硬幣", "Una moneda cada vez", "Una moneda cada cop"],
    queued: ["In the queue ✓", "已加入队列 ✓", "已加入佇列 ✓", "En la cola ✓", "A la cua ✓"],
    make: ["Make your own record", "做一张你自己的唱片", "做一張你自己的唱片", "Graba tu propio disco", "Grava el teu propi disc"],
    away: ["The jukebox is out of reach — playing the house records", "点唱机暂时连不上，正在放店里的唱片", "點唱機暫時連不上，正在放店裡的唱片", "La gramola no responde: suenan los discos de la casa", "La gramola no respon: sonen els discos de la casa"]
  };
  function lang() {
    var b = ls("weis-lang"), l = null;
    if (/\/game\/bar\//.test(location.pathname) && b) l = { en: 0, zh: 1, tw: 2, yue: 2, es: 3, ca: 4 }[b];
    if (l == null) l = { en: 0, zh: 1, "zh-Hant": 2, es: 3, ca: 4 }[(window.FBL && FBL.get()) || "en"];
    return l || 0;
  }
  function w(k, o) { var s = (W[k] || [k])[lang()] || W[k][0]; if (o) for (var x in o) s = s.replace("{" + x + "}", o[x]); return s; }

  window.JB = {
    MOODS: MOODS, INSTR: INSTR, ROWS: ROWS, STEPS: STEPS, LOOPS: LOOPS, HOUSE: HOUSE,
    encode: encode, decode: decode, seconds: seconds, blank: blank, random: random, hue: hue, rowNote: rowNote,
    audio: audio, unlock: unlock, Player: Player, note: function (i, m, v) { var c = audio(); if (c) note(i, m, c.currentTime + 0.01, 0.3, v || 0.8); },
    drum: function (k) { var c = audio(); if (c) drum(k, c.currentTime + 0.01, 0.9); },
    analyser: function () { audio(); return analyser; },
    volume: function (v) { if (v == null) return vol; vol = v; audio(); if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.1); },
    duck: function (v) { audio(); if (duck) duck.gain.setTargetAtTime(v, ctx.currentTime, 0.3); },
    listen: listen, listening: function () { return on; }, watch: watch, poll: poll, state: state, now: now,
    onChange: function (f) { listeners.push(f); }, onStep: function (f) { stepFns.push(f); },
    records: records, spin: spin, press: press, mine: mine, hide: hide, nick: nick, lang: lang, w: w,
    where: function (p) { if (!p || !p.venue) return ""; var v = w(p.venue); return p.by_name ? w("spunAt", { v: v, n: p.by_name }) : w("spunAt0", { v: v }); }
  };
})();
