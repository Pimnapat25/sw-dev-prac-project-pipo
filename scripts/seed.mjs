// Seeds the local backend (http://localhost:5000) with demo equipment and rental requests.
// Usage: node scripts/seed.mjs   (backend must be running)
// Safe to run again: existing accounts log in, existing equipment names are reused.
//
// Test accounts (local demo data only — not real credentials):
//   admin:  admin@snaprent.test  / SnapAdmin#2026
//   member: member@snaprent.test / SnapMember#2026

const API = process.env.API_URL ?? "http://localhost:5000/api/v1";

const ACCOUNTS = {
  admin: { name: "Snap Admin", email: "admin@snaprent.test", tel: "0800000001", password: "SnapAdmin#2026", role: "admin" },
  member: { name: "Snap Member", email: "member@snaprent.test", tel: "0800000002", password: "SnapMember#2026", role: "member" },
};

const EQUIPMENT = [
  { name: "Canon EOS R50", category: "Camera", description: "Mirrorless camera with 18–45mm kit lens, battery and 64GB card.", quantity: 5, rentalRate: 250 },
  { name: "Sony ZV-E10", category: "Camera", description: "Vlog camera with flip screen and wind muffler.", quantity: 3, rentalRate: 300 },
  { name: "GoPro HERO12", category: "Camera", description: "Action camera with waterproof case and chest mount.", quantity: 4, rentalRate: 200 },
  { name: "Epson EB-E01 Projector", category: "Projector", description: "3,300 lumen projector with HDMI cable and remote.", quantity: 2, rentalRate: 180 },
  { name: "XGIMI MoGo 2", category: "Projector", description: "Portable mini projector, built-in speaker and battery.", quantity: 2, rentalRate: 220 },
  { name: "MacBook Air M2", category: "Notebook", description: "13-inch notebook, 8GB RAM, charger included.", quantity: 3, rentalRate: 350 },
  { name: "Lenovo ThinkPad E14", category: "Notebook", description: "14-inch Windows notebook for coursework.", quantity: 4, rentalRate: 200 },
  { name: "Futsal Ball Set", category: "Sports", description: "Three size-4 futsal balls with pump and bag.", quantity: 6, rentalRate: 60 },
  { name: "Badminton Racket Pair", category: "Sports", description: "Two rackets and a tube of six shuttlecocks.", quantity: 8, rentalRate: 50 },
];

// [equipment name, quantity, start offset in days from today, length in days]
const RENTALS = [
  ["Canon EOS R50", 2, 1, 3],
  ["Epson EB-E01 Projector", 1, 2, 1],
  ["MacBook Air M2", 1, 3, 7],
  ["Futsal Ball Set", 3, 0, 0],
];

async function call(path, { method = "GET", token, body } = {}) {
  const res = await fetch(API + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function signIn(account) {
  const reg = await call("/auth/register", { method: "POST", body: account });
  if (reg.ok) return reg.data.data.token;
  const login = await call("/auth/login", { method: "POST", body: { email: account.email, password: account.password } });
  if (!login.ok) throw new Error(`Cannot sign in ${account.email}: ${login.data.error ?? login.status}`);
  return login.data.data.token;
}

// YYYY-MM-DD in Bangkok time (never earlier than the backend's UTC "today").
function day(offset) {
  const d = new Date(Date.now() + offset * 86400000);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

const adminToken = await signIn(ACCOUNTS.admin);
const memberToken = await signIn(ACCOUNTS.member);
console.log("Signed in admin and member");

for (const item of EQUIPMENT) {
  const r = await call("/equipment", { method: "POST", token: adminToken, body: item });
  console.log(r.ok ? `+ equipment ${item.name}` : `= equipment ${item.name} (${r.data.error ?? r.status})`);
}

const list = (await call("/equipment")).data.data ?? [];
const idByName = Object.fromEntries(list.map((e) => [e.name, e._id]));

const existing = (await call("/rentals", { token: memberToken })).data.data ?? [];
if (existing.length > 0) {
  console.log(`= member already has ${existing.length} rental request(s), skipping rentals`);
} else {
  for (const [name, quantity, startOffset, length] of RENTALS) {
    const body = { equipment: idByName[name], quantity, startDate: day(startOffset), returnDate: day(startOffset + length) };
    const r = await call("/rentals", { method: "POST", token: memberToken, body });
    console.log(r.ok ? `+ rental ${name} x${quantity} ${body.startDate} → ${body.returnDate}` : `! rental ${name} failed: ${r.data.error ?? r.status}`);
  }
}

console.log(`Done: ${list.length} equipment in database`);
