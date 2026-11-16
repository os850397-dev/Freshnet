:root {
  --bg: #f7f3ea;
  --surface: #ffffff;
  --surface-strong: #171717;
  --gold: #d6a93b;
  --gold-light: #f4d783;
  --text: #1d1d1d;
  --muted: #6b675f;
  --line: #e9e1d1;
  --danger: #a94343;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
}
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 18px 6%; background: #111; color: #fff;
  border-bottom: 1px solid rgba(214,169,59,.35);
}
.brand {
  display: inline-flex; align-items: center; gap: 8px;
  text-decoration: none; color: #fff; font-weight: 800; font-size: 26px;
}
.brand span:last-child { color: var(--gold-light); }
.brand-mark {
  display: inline-grid; place-items: center; width: 32px; height: 32px;
  border-radius: 10px; border: 2px solid var(--gold);
  color: var(--gold-light); font-weight: 900;
}
.user-box {
  display: flex; align-items: center; gap: 12px;
}
#whoami { font-weight: 700; }
.ghost-button {
  border: 1px solid rgba(255,255,255,.2); background: transparent; color: #fff;
  border-radius: 999px; padding: 10px 14px; cursor: pointer;
}
.auth-page {
  min-height: 100vh; display: grid; place-items: center; background: #111;
}
.auth-card {
  width: min(90vw, 420px); background: rgba(255,255,255,.98);
  border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.22);
  padding: 28px 22px 18px;
}
.tabs {
  display: grid; grid-template-columns: 1fr 1fr; margin: 18px 0 22px; gap: 8px;
}
.tab {
  border: 1px solid var(--line); background: #f4efe8; color: var(--muted);
  border-radius: 10px; padding: 12px 10px; font-weight: 700; cursor: pointer;
}
.tab.active {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  color: #17130a; border-color: transparent;
}
form {
  display: grid; gap: 16px;
}
label {
  display: grid; gap: 8px; font-size: 14px; font-weight: 700; color: var(--text);
}
input, textarea {
  width: 100%; border: 1px solid var(--line); border-radius: 10px;
  padding: 12px 14px; font: inherit; background: #fff; color: var(--text);
}
textarea {
  resize: vertical; min-height: 110px;
}
button.gold-button {
  border: 0; border-radius: 10px; padding: 13px 18px; font: inherit; font-weight: 700;
  background: linear-gradient(135deg, var(--gold-light), var(--gold)); color: #17130a; cursor: pointer;
}
.message {
  min-height: 22px; margin-top: 16px; font-size: 14px; color: var(--muted);
}
.message.error { color: var(--danger); }
.feed {
  max-width: 760px; margin: 36px auto; padding: 0 18px 32px;
}
.composer {
  background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 18px;
  box-shadow: 0 10px 24px rgba(17,17,17,0.04);
}
.composer-bar {
  display: flex; justify-content: space-between; align-items: center; margin-top: 12px;
  color: var(--muted);
}
#posts {
  display: grid; gap: 16px; margin-top: 20px;
}
.post-card {
  background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 18px;
  box-shadow: 0 10px 24px rgba(17,17,17,0.04);
}
.post-head {
  display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
}
.avatar-mini {
  width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
  background: linear-gradient(135deg, var(--gold-light), var(--gold)); font-weight: 900; color: #17130a;
}
.post-card strong { display: block; }
.post-card small { color: var(--muted); }
.post-card p { margin: 8px 0 0; line-height: 1.6; }
@media (max-width: 640px) {
  .topbar { flex-wrap: wrap; padding: 16px 18px; }
  .user-box { width: 100%; justify-content: space-between; }
  .tabs { grid-template-columns: 1fr; }
}
