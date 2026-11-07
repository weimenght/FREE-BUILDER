/* FREE//BUILDER — one Supabase project for every live demo.
 * Used by Room Mode (/tools/room), Inbox Runner and KILL//SWITCH (/labs/launchpad).
 * Paste from Supabase → Project Settings → API:
 *   url      = Project URL, e.g. https://abcdxyz.supabase.co
 *   anonKey  = the "anon" / public key (never the service_role key)
 * realtimeUrl (optional) = your Cloudflare Worker relay for mainland China, e.g. wss://room.wei-meng.org
 * Leave url empty and every demo keeps running offline, on the device.
 * accounts = the optional after-hours account (email sign-in + a private copy, /fbkit/ahid.js, Nov 7). Set it to true once
 *   ah_backups exists (supabase/migrations/20261107090000_ah_account_backup.sql) and Auth allows https://www.after-hours.work/app/. */
window.FB_SUPABASE = { url: "https://uxbozndyjqizcxpzvjko.supabase.co", anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4Ym96bmR5anFpemN4cHp2amtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNTQ2MDMsImV4cCI6MjEwNzkzMDYwM30.PZn_0AHNlof5se5N3cZNo2hv2ohjHV-oLLyKn6IFwME", realtimeUrl: "wss://room.wei-meng.org", accounts: false };
