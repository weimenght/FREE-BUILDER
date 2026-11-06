    /* =====================================================================
       DATA LAYER — Supabase when configured, this browser otherwise.
       1) Run supabase-setup.sql in your project's SQL editor.
       2) Paste your Project URL and anon public key below.
       ===================================================================== */
    const SUPABASE_CONFIG = {
      url: 'https://uxbozndyjqizcxpzvjko.supabase.co',      // e.g. 'https://abcdxyz.supabase.co'
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ym96bmR5anFpemN4cHp2amtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTQ2MDMsImV4cCI6MjEwNzkzMDYwM30.PZn_0AHNlof5se5N3cZNo2hv2ohjHV-oLLyKn6IFwME'   // Project Settings → API → anon public key
    };

    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
    function fmt(str, vars) {
      return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null) ? vars[k] : m);
    }
    function timeAgo(iso) {
      const d = new Date(iso);
      if (isNaN(d)) return '';
      try {
        const rtf = new Intl.RelativeTimeFormat(LANG_META[AppState.lang].html, { numeric: 'auto' });
        const sec = (d.getTime() - Date.now()) / 1000;
        const abs = Math.abs(sec);
        if (abs < 60) return rtf.format(Math.round(sec), 'second');
        if (abs < 3600) return rtf.format(Math.round(sec / 60), 'minute');
        if (abs < 86400) return rtf.format(Math.round(sec / 3600), 'hour');
        if (abs < 86400 * 30) return rtf.format(Math.round(sec / 86400), 'day');
        return d.toLocaleDateString(LANG_META[AppState.lang].html);
      } catch (e) {
        return d.toLocaleDateString();
      }
    }
    /* tables live under the town's names in Supabase (grouped by place); local copies keep the old keys */
    const DB_T = t => ({ cocktails: 'town_bar_cocktails' })[t] || t;

    const DB = {
      sb: null,
      online: false,

      init() {
        try {
          if (SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && window.supabase && window.supabase.createClient) {
            this.sb = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, { auth: { persistSession: false } });
            this.online = true;
          }
        } catch (e) {
          this.sb = null;
          this.online = false;
        }
        this.badge();
      },

      badge() {
        const el = document.getElementById('db-dot');
        if (!el) return;
        el.classList.toggle('online', this.online);
        el.title = this.online ? T('db.online') : T('db.local');
      },

      fail(err) {
        console.warn('[supabase]', err && (err.message || err));
      },

      local(table) {
        try { return JSON.parse(localStorage.getItem('weis-db:' + table) || '[]'); } catch (e) { return []; }
      },
      saveLocal(table, rows) {
        try { localStorage.setItem('weis-db:' + table, JSON.stringify(rows.slice(-400))); } catch (e) {}
      },

      async insert(table, row) {
        const full = Object.assign({}, row, { created_at: new Date().toISOString() });
        if (this.sb) {
          try {
            const { data, error } = await this.sb.from(DB_T(table)).insert(row).select().single();
            if (!error && data) return data;
            this.fail(error);
          } catch (e) { this.fail(e); }
        }
        const rows = this.local(table);
        full.id = 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        rows.push(full);
        this.saveLocal(table, rows);
        return full;
      },

      async list(table, opts = {}) {
        const { order = 'created_at', asc = false, limit = 50, eq } = opts;
        if (this.sb) {
          try {
            let q = this.sb.from(DB_T(table)).select('*').order(order, { ascending: asc }).limit(limit);
            if (eq) Object.entries(eq).forEach(([k, v]) => { q = q.eq(k, v); });
            const { data, error } = await q;
            if (!error) return data || [];
            this.fail(error);
          } catch (e) { this.fail(e); }
        }
        let rows = this.local(table);
        if (eq) rows = rows.filter(r => Object.entries(eq).every(([k, v]) => r[k] === v));
        rows.sort((a, b) => {
          const x = a[order], y = b[order];
          return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1);
        });
        return rows.slice(0, limit);
      },

      // a heart for a drink in the book (counted on the server, never shown)
      async bump(table, id, column) {
        if (this.sb && !String(id).startsWith('local-') && !String(id).startsWith('seed-')) {
          try {
            const { error } = await this.sb.rpc('like_cocktail', { row_id: id });
            if (!error) return true;
            this.fail(error);
          } catch (e) { this.fail(e); }
        }
        const rows = this.local(table);
        const r = rows.find(x => x.id === id);
        if (r) { r[column] = (r[column] || 0) + 1; this.saveLocal(table, rows); }
        return !!r;
      },

      log(kind, detail = {}) {
        if (!Patron.name) return;
        /* what you do at the bar stays on this device: nothing is sent just for walking in or tapping around
           (the town never asks before it has to; only what you choose to leave — a drawing, a cocktail, a gift — goes to the server) */
        const row = { patron: Patron.name, kind, detail, lang: AppState.lang };
        const rows = this.local('interactions');
        rows.push(Object.assign(row, { created_at: new Date().toISOString() }));
        this.saveLocal('interactions', rows);
      }
    };

    /* ---------------- Patron (the visitor) ---------------- */
    const Patron = {
      name: '',

      load() {
        try { this.name = this.clean(localStorage.getItem('fb_nick') || localStorage.getItem('weis-name') || ''); } catch (e) { this.name = ''; }   /* the town's one name first */
        return this.name;
      },

      clean(raw) {
        return String(raw || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24);
      },

      /* your name at the bar stays on this device: nothing is sent */
      async enter(rawName) {
        const name = this.clean(rawName);
        if (!name) return null;
        this.name = name;
        try { localStorage.setItem('weis-name', name); } catch (e) {}
        DB.log('enter', { hour: Math.round(AppState.hour * 10) / 10, mode: AppState.isBarOpen ? 'bar' : 'cafe' });
        return null;
      }
    };

    /* Seed content so rooms never feel empty before anyone has visited */
    const SEEDS = {
      cocktails: [
        { id: 'seed-c1', patron: 'Wei', name: 'Hutong Sour', glass: 'coupe', ice: 'none', method: 'shake', garnish: 'hawthorn',
          pours: [{ id: 'baijiu', ml: 30 }, { id: 'jasmine_gin', ml: 15 }, { id: 'lemon', ml: 20 }, { id: 'hawthorn', ml: 15 }, { id: 'egg_white', ml: 15 }],
          color: '#e7a5a0', profile: { abv: 17, sweet: 13, sour: 16, bitter: 1, aroma: 35, }, note: 'Tanghulu in a glass.', created_at: '2026-10-02T21:00:00Z' }
      ]
    };
  
