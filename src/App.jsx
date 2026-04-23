import { useState, useEffect, useRef } from "react";

function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=general-sans@400,500,600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: #fff; color: #0A1628; font-family: 'General Sans', sans-serif; -webkit-font-smoothing: antialiased; }
      ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #f1f5f9; } ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      input, textarea, select, button { font-family: inherit; }
      input::placeholder { color: #9CA3AF; }
      a { text-decoration: none; color: inherit; }

      .wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
      @media(max-width:768px){ .wrap { padding: 0 18px; } }

      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
      .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
      .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
      @media(max-width:1024px){ .grid-4{grid-template-columns:repeat(2,1fr)} .grid-3{grid-template-columns:1fr 1fr} }
      @media(max-width:768px){ .grid-2,.grid-3,.grid-4{grid-template-columns:1fr} }

      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media(max-width:600px){ .form-grid{grid-template-columns:1fr} }

      .portal-wrap { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 60px); }
      @media(max-width:900px){ .portal-wrap{grid-template-columns:1fr} }

      .sidebar { background: #F8FAFC; border-right: 1px solid #E2E8F0; padding: 28px 0; position: sticky; top: 60px; height: calc(100vh - 60px); overflow-y: auto; }
      @media(max-width:900px){ .sidebar{display:none!important} }

      .mob-nav { display: none; }
      @media(max-width:900px){ .mob-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #E2E8F0;z-index:200} }

      .job-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
      .worker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
      @media(max-width:768px){ .job-grid,.worker-grid{grid-template-columns:1fr} }

      .hdr { position: sticky; top: 0; z-index: 300; background: rgba(255,255,255,.97); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E8F0; height: 60px; display: flex; align-items: center; }
      .hdr-nav { display: flex; align-items: center; gap: 28px; }
      @media(max-width:768px){ .hdr-nav{display:none} }

      .desk-only { display:block; } @media(max-width:900px){ .desk-only{display:none!important} }
      .mob-only { display:none; } @media(max-width:768px){ .mob-only{display:block!important} }

      .hero { padding: 80px 0 72px; }
      @media(max-width:768px){ .hero{padding:52px 0 44px} }
      .sec { padding: 72px 0; }
      @media(max-width:768px){ .sec{padding:48px 0} }
      .sec-gray { background: #F8FAFC; }

      .card-h { transition: border-color .18s, box-shadow .18s; cursor: pointer; }
      .card-h:hover { border-color: #16A34A !important; box-shadow: 0 4px 20px rgba(22,163,74,.08); }

      .mkt-item { display:flex; flex-direction:column; align-items:center; gap:10px; padding:24px 14px; border-radius:12px; border:1px solid #E2E8F0; background:#fff; transition:all .18s; }
      .mkt-item:hover { border-color:#16A34A; background:#F0FDF4; }

      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes popIn { 0%{transform:scale(.88);opacity:0} 70%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
      @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
      .fu1{animation:fadeUp .45s ease both} .fu2{animation:fadeUp .45s .08s ease both} .fu3{animation:fadeUp .45s .16s ease both}

      .prog { display:flex; gap:5px; align-items:center; }
      .prog-s { height:3px; border-radius:2px; transition:all .3s; }

      .nav-link { font-size:14px; color:#475569; cursor:pointer; transition:color .15s; font-family:'General Sans',sans-serif; }
      .nav-link:hover { color:#0A1628; }
    `;
    document.head.appendChild(s);
    document.body.style.overflowX = "hidden";
  }, []);
  return null;
}

// ─── TOKENS ───────────────────────────────────────────────────
const C = {
  bg: "#FFFFFF", surf: "#F8FAFC", card: "#FFFFFF",
  border: "#E2E8F0", border2: "#CBD5E1",
  navy: "#0A1628", navyL: "#1E3A5F",
  green: "#16A34A", greenL: "#22C55E", greenBg: "#F0FDF4",
  blue: "#2563EB", blueBg: "#EFF6FF",
  text: "#0A1628", sub: "#475569", muted: "#94A3B8",
  red: "#DC2626", amber: "#D97706",
};
const H = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const B = { fontFamily: "'General Sans', sans-serif" };

// ─── PRIMITIVES ───────────────────────────────────────────────
const Tag = ({ label, color = C.green, bg }) => (
  <span style={{ ...B, fontSize: 11, fontWeight: 600, letterSpacing: .3, padding: "3px 10px", borderRadius: 20, background: bg || color + "15", color, whiteSpace: "nowrap" }}>{label}</span>
);

const Btn = ({ label, onClick, disabled, variant = "primary", size = "md", full = false }) => {
  const vs = {
    primary: { background: disabled ? "#CBD5E1" : C.green,   color: "#fff",       border: "none" },
    outline:  { background: "transparent",                    color: C.green,      border: `1.5px solid ${C.green}` },
    navy:     { background: disabled ? "#CBD5E1" : C.navy,   color: "#fff",       border: "none" },
    ghost:    { background: "transparent",                    color: C.sub,        border: `1.5px solid ${C.border2}` },
    white:    { background: "#fff",                           color: C.navy,       border: `1.5px solid ${C.border}` },
  }[variant];
  const ss = {
    sm: { fontSize: 12, padding: "7px 16px",  borderRadius: 7  },
    md: { fontSize: 13, padding: "10px 20px", borderRadius: 8  },
    lg: { fontSize: 14, padding: "12px 26px", borderRadius: 9  },
    xl: { fontSize: 15, padding: "14px 32px", borderRadius: 10 },
  }[size];
  return (
    <button onClick={!disabled ? onClick : undefined}
      style={{ ...H, fontWeight: 700, cursor: disabled ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", width: full ? "100%" : "auto", justifyContent: full ? "center" : undefined, transition: "opacity .15s, box-shadow .15s", ...vs, ...ss }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = ".88"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
      {label}
    </button>
  );
};

const Field = ({ label, placeholder, value, onChange, type = "text", hint, maxLength }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ ...B, fontSize: 12, fontWeight: 600, color: C.sub, letterSpacing: .3, display: "block", marginBottom: 6 }}>{label}</label>}
    <input type={type} placeholder={placeholder} value={value} maxLength={maxLength}
      onChange={e => onChange(e.target.value)}
      onFocus={e => e.target.style.borderColor = C.green}
      onBlur={e => e.target.style.borderColor = C.border2}
      style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${C.border2}`, background: "#fff", ...B, fontSize: 14, color: C.text, outline: "none", transition: "border-color .2s" }} />
    {hint && <div style={{ ...B, fontSize: 11, color: C.red, marginTop: 5 }}>{hint}</div>}
  </div>
);

const SL = ({ children }) => (
  <div style={{ ...B, fontSize: 11, fontWeight: 700, color: C.green, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: C.border, margin: "24px 0" }} />;

const Prog = ({ step, total }) => (
  <div className="prog">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="prog-s" style={{ background: i < step ? C.green : C.border2, width: i < step ? 24 : 12 }} />
    ))}
    <span style={{ ...B, fontSize: 12, color: C.muted, marginLeft: 6 }}>{step}/{total}</span>
  </div>
);

// ─── DATA ─────────────────────────────────────────────────────
const SPECS = [
  { id:"pick",    icon:"📦", label:"Picking" },
  { id:"rep",     icon:"🏪", label:"Reposição" },
  { id:"caixa",   icon:"💳", label:"Caixa" },
  { id:"estq",    icon:"🏭", label:"Estoquista" },
  { id:"frios",   icon:"❄️",  label:"Frios" },
  { id:"hort",    icon:"🥬", label:"Hortifruti" },
  { id:"log",     icon:"🚛", label:"Logística" },
  { id:"pack",    icon:"📫", label:"Embalador" },
  { id:"shopper", icon:"🛍",  label:"Shopper" },
  { id:"padaria", icon:"🥖", label:"Padaria" },
];

const MARKETS = [
  { icon:"🛒", label:"Supermercados" },
  { icon:"🏬", label:"Atacarejos" },
  { icon:"🏘", label:"Mercados de bairro" },
  { icon:"📦", label:"Centros de Distribuição" },
  { icon:"🚴", label:"Dark Stores" },
  { icon:"🏭", label:"Atacadistas" },
  { icon:"🛍", label:"Lojas de Shopping" },
  { icon:"🏭", label:"Indústria FMCG" },
  { icon:"💊", label:"Farmácias" },
  { icon:"🥬", label:"Hortifrútis" },
  { icon:"🚛", label:"Distribuidores" },
  { icon:"📋", label:"Outros" },
];

const JOBS = [
  { id:1, co:"Assaí Atacadista",  role:"Picker de Separação",  dist:"1.2km", pay:22, hrs:"06h–14h", date:"Amanhã", free:2, slots:3, spec:["pick","estq"],   color:"#2563EB", urgent:false, desc:"Separação de pedidos delivery no CD da Lapa. Orientação incluída. EPI fornecido." },
  { id:2, co:"Carrefour",         role:"Reposição Noturna",    dist:"3.1km", pay:25, hrs:"22h–06h", date:"Hoje",   free:1, slots:2, spec:["rep"],            color:"#1D4ED8", urgent:true,  desc:"Reposição de gôndolas no período noturno. Lanche fornecido." },
  { id:3, co:"iFood Dark Store",  role:"Picker Express",       dist:"0.9km", pay:28, hrs:"10h–16h", date:"Hoje",   free:4, slots:4, spec:["pick","shopper"], color:"#DC2626", urgent:true,  desc:"Separação expressa com bonificação por performance." },
  { id:4, co:"Extra Hiper",       role:"Operador de Caixa",    dist:"2.4km", pay:20, hrs:"14h–20h", date:"Sáb",    free:3, slots:5, spec:["caixa"],          color:"#D97706", urgent:false, desc:"Checkout com treinamento de 30 min. Uniforme fornecido." },
  { id:5, co:"Mercado Livre",     role:"Fulfillment Operator", dist:"8.7km", pay:30, hrs:"08h–16h", date:"Dom",    free:5, slots:8, spec:["log","estq"],     color:"#16A34A", urgent:false, desc:"Recebimento, conferência e expedição em CD de alto volume. VT incluso." },
  { id:6, co:"Atacadão",          role:"Repositor de Frios",   dist:"4.2km", pay:24, hrs:"14h–22h", date:"Amanhã", free:2, slots:3, spec:["frios","rep"],    color:"#0369A1", urgent:false, desc:"Reposição de câmara fria e geladeiras. EPI de frio fornecido." },
];

const WORKERS = [
  { id:1, name:"Carlos Silva",    initials:"CS", age:28, rating:4.9, shifts:47, city:"Lapa · SP",        specs:["pick","estq","log"],     avail:["Seg","Ter","Qua","Sex"], color:"#2563EB" },
  { id:2, name:"Fernanda Lima",   initials:"FL", age:24, rating:4.8, shifts:31, city:"Pinheiros · SP",   specs:["caixa","rep","frios"],   avail:["Qui","Sex","Sáb"],       color:"#7C3AED" },
  { id:3, name:"João Santos",     initials:"JS", age:35, rating:4.7, shifts:89, city:"Osasco · SP",      specs:["log","pick","pack"],     avail:["Seg","Ter","Qua","Qui","Sex"], color:"#0369A1" },
  { id:4, name:"Ana Costa",       initials:"AC", age:22, rating:5.0, shifts:12, city:"V. Madalena · SP", specs:["rep","hort","padaria"],  avail:["Qua","Qui","Sex","Sáb"], color:"#D97706" },
  { id:5, name:"Marcos Pereira",  initials:"MP", age:31, rating:4.6, shifts:58, city:"Guarulhos · SP",   specs:["estq","pick","log"],     avail:["Seg","Ter","Sáb","Dom"], color:"#16A34A" },
  { id:6, name:"Bianca Rocha",    initials:"BR", age:26, rating:4.9, shifts:23, city:"ABC Paulista",     specs:["shopper","rep","caixa"], avail:["Ter","Qua","Qui","Sex"], color:"#DC2626" },
  { id:7, name:"Rafael Teixeira", initials:"RT", age:29, rating:4.8, shifts:64, city:"Santo André · SP", specs:["pick","pack","log"],     avail:["Seg","Ter","Qui","Sex"], color:"#0891B2" },
  { id:8, name:"Juliana Moura",   initials:"JM", age:27, rating:4.7, shifts:38, city:"Itaquera · SP",    specs:["caixa","rep"],           avail:["Qua","Sex","Sáb","Dom"], color:"#CA8A04" },
];

// ─── HEADER ───────────────────────────────────────────────────
function Header({ onNav, user, type }) {
  const [mob, setMob] = useState(false);
  return (
    <header className="hdr">
      <div className="wrap" style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, background: C.green, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
            <span style={{ ...H, fontSize: 19, fontWeight: 900, color: C.navy, letterSpacing: -.4 }}>Giobbi's</span>
          </div>

          <nav className="hdr-nav">
            {!user
              ? [["Sobre nós","home"],["Para colaboradores","worker-auth"],["Para empresas","company-auth"],["Contato","home"]].map(([l,n]) => (
                  <span key={l} className="nav-link" onClick={() => onNav(n)}>{l}</span>
                ))
              : <>
                  {type==="worker" && <><span className="nav-link" onClick={()=>onNav("worker-app")}>Vagas</span><span className="nav-link" onClick={()=>onNav("worker-app")}>Meus Turnos</span></>}
                  {type==="company" && <><span className="nav-link" onClick={()=>onNav("company-app")}>Talent Browser</span><span className="nav-link" onClick={()=>onNav("company-app")}>Dashboard</span></>}
                </>
            }
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!user ? <>
              <Btn label="Entrar" variant="ghost" size="sm" onClick={() => onNav("auth-choice")} />
              <Btn label="Cadastro Colaborador" variant="white" size="sm" onClick={() => onNav("worker-auth")} />
              <Btn label="Cadastro Negócio" variant="primary" size="sm" onClick={() => onNav("company-auth")} />
            </> : <>
              <span style={{ ...B, fontSize: 13, color: C.sub }}>Olá, {user}</span>
              <Btn label="Sair" variant="ghost" size="sm" onClick={() => onNav("home")} />
            </>}
            <button onClick={() => setMob(!mob)} className="mob-only" style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.navy, padding: "4px 8px" }}>☰</button>
          </div>
        </div>
      </div>
      {mob && (
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "16px 18px", zIndex: 500, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
          {[["Para colaboradores","worker-auth"],["Para empresas","company-auth"],["Sobre nós","home"]].map(([l,n]) => (
            <div key={l} onClick={() => { onNav(n); setMob(false); }} style={{ ...B, fontSize: 15, color: C.sub, padding: "12px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>{l}</div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <Btn label="Colaborador" variant="white" size="sm" onClick={() => { onNav("worker-auth"); setMob(false); }} />
            <Btn label="Negócio" variant="primary" size="sm" onClick={() => { onNav("company-auth"); setMob(false); }} />
          </div>
        </div>
      )}
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════
function Landing({ onNav }) {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="hero" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div className="fu1" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.greenBg, border: `1px solid #BBF7D0`, borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 2s ease infinite", display: "inline-block" }} />
                <span style={{ ...B, fontSize: 12, fontWeight: 600, color: C.green }}>Especialistas em varejo e supermercados</span>
              </div>
              <h1 className="fu1" style={{ ...H, fontSize: "clamp(36px, 4.5vw, 56px)", fontWeight: 900, color: C.navy, lineHeight: 1.05, letterSpacing: -1.5, marginBottom: 20 }}>
                O parceiro certo,<br />no momento certo.
              </h1>
              <p className="fu2" style={{ ...B, fontSize: 17, color: C.sub, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
                Conectamos empresas de varejo a colaboradores verificados e qualificados. Escale sua equipe quando precisar — com agilidade, segurança e sem burocracia.
              </p>
              <div className="fu3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Btn label="Cadastro Negócio" variant="primary" size="xl" onClick={() => onNav("company-auth")} />
                <Btn label="Cadastro Colaborador" variant="white" size="xl" onClick={() => onNav("worker-auth")} />
              </div>
            </div>

            {/* Hero card preview */}
            <div className="fu2" style={{ background: C.surf, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ background: C.navy, padding: "20px 24px" }}>
                <div style={{ ...B, fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 4 }}>Talent Browser</div>
                <div style={{ ...H, fontSize: 16, fontWeight: 800, color: "#fff" }}>Colaboradores disponíveis agora</div>
              </div>
              {WORKERS.slice(0, 4).map((w, i) => (
                <div key={w.id} style={{ padding: "14px 24px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", gap: 12, background: "#fff" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: w.color + "18", border: `2px solid ${w.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...H, fontSize: 13, fontWeight: 900, color: w.color }}>{w.initials}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...H, fontSize: 14, fontWeight: 700, color: C.navy }}>{w.name}</div>
                    <div style={{ ...B, fontSize: 11, color: C.muted }}>{w.city}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {SPECS.filter(s => w.specs.includes(s.id)).slice(0, 2).map(s => <Tag key={s.id} label={s.label} color={C.green} />)}
                  </div>
                </div>
              ))}
              <div style={{ padding: "14px 24px", background: C.surf, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ ...B, fontSize: 12, color: C.muted }}>+{WORKERS.length - 4} colaboradores disponíveis</span>
                <Btn label="Ver todos →" variant="outline" size="sm" onClick={() => onNav("company-auth")} />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 56, borderTop: `1px solid ${C.border}`, paddingTop: 40 }}>
            {[
              { v: "+1.000", l: "Estabelecimentos atendidos" },
              { v: "+300k",  l: "Horas realizadas" },
              { v: "+60",    l: "Cidades em 7 estados" },
              { v: "4,9 ★",  l: "Avaliação média dos parceiros" },
            ].map(({ v, l }, i, arr) => (
              <div key={l} style={{ textAlign: "center", paddingRight: i < arr.length - 1 ? 24 : 0, borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none", marginRight: i < arr.length - 1 ? 24 : 0 }}>
                <div style={{ ...H, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: C.green }}>{v}</div>
                <div style={{ ...B, fontSize: 13, color: C.sub, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA EMPRESAS ── */}
      <section className="sec">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 72, alignItems: "center" }}>
            <div>
              <SL>Para empresas</SL>
              <h2 style={{ ...H, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900, color: C.navy, letterSpacing: -1.2, lineHeight: 1.05, marginBottom: 16 }}>
                Mão de obra qualificada<br />quando você precisa.
              </h2>
              <p style={{ ...B, fontSize: 15, color: C.sub, lineHeight: 1.8, marginBottom: 32 }}>
                Module sua equipe conforme a demanda. Contrate colaboradores verificados para cobrir picos, faltas ou operações pontuais — com agilidade e sem encargos fixos.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
                {[
                  { icon:"👁", t:"Você escolhe o colaborador",     d:"Navegue pelos perfis, veja avaliações e histórico. Você decide — não a plataforma." },
                  { icon:"🔒", t:"Perfis verificados",              d:"Documentos conferidos antes de aparecerem no sistema. Segurança para os dois lados." },
                  { icon:"📊", t:"Gestão centralizada",             d:"Painel completo com histórico, avaliações e métricas da operação." },
                  { icon:"💳", t:"Pague só quando contratar",       d:"Sem mensalidade. Sem créditos pré-pagos. Cobrança por contratação confirmada." },
                ].map(({ icon, t, d }) => (
                  <div key={t} style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenBg, border: `1px solid #BBF7D0`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ ...H, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{t}</div>
                      <div style={{ ...B, fontSize: 13, color: C.sub, lineHeight: 1.65 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Btn label="Cadastrar minha empresa →" variant="primary" size="lg" onClick={() => onNav("company-auth")} />
            </div>

            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
              <div style={{ background: C.navy, padding: "20px 28px" }}>
                <div style={{ ...H, fontSize: 15, fontWeight: 800, color: "#fff" }}>Talent Browser</div>
                <div style={{ ...B, fontSize: 13, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Escolha quem vai trabalhar na sua operação</div>
              </div>
              {WORKERS.slice(0, 4).map((w, i) => (
                <div key={w.id} style={{ padding: "16px 28px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: w.color + "18", border: `2px solid ${w.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...H, fontSize: 14, fontWeight: 900, color: w.color }}>{w.initials}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...H, fontSize: 14, fontWeight: 700, color: C.navy }}>{w.name}</div>
                    <div style={{ ...B, fontSize: 11, color: C.muted }}>⭐ {w.rating} · {w.shifts} turnos · {w.city}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>{SPECS.filter(s => w.specs.includes(s.id)).slice(0,1).map(s => <Tag key={s.id} label={s.label} color={C.green} />)}</div>
                </div>
              ))}
              <div style={{ padding: "14px 28px", background: C.surf }}>
                <Btn label="Acessar painel →" variant="outline" size="sm" onClick={() => onNav("company-auth")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MERCADOS QUE ATENDEMOS ── */}
      <section className="sec sec-gray">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SL>Segmentos</SL>
            <h2 style={{ ...H, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: C.navy, letterSpacing: -1 }}>Mercados que atendemos</h2>
            <p style={{ ...B, fontSize: 15, color: C.sub, marginTop: 12, maxWidth: 480, margin: "12px auto 0", lineHeight: 1.75 }}>Estamos presentes em toda a cadeia do varejo, do supermercado de bairro ao grande centro de distribuição.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {MARKETS.map(m => (
              <div key={m.label} className="mkt-item">
                <span style={{ fontSize: 32 }}>{m.icon}</span>
                <span style={{ ...B, fontSize: 13, fontWeight: 500, color: C.sub, textAlign: "center" }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA COLABORADORES ── */}
      <section className="sec">
        <div className="wrap">
          <div className="grid-2" style={{ gap: 72, alignItems: "center" }}>
            {/* Card preview */}
            <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,.06)" }}>
              <div style={{ background: C.green, padding: "20px 28px" }}>
                <div style={{ ...H, fontSize: 15, fontWeight: 800, color: "#fff" }}>Vagas disponíveis</div>
                <div style={{ ...B, fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 2 }}>São Paulo · {JOBS.length} oportunidades</div>
              </div>
              {JOBS.slice(0, 4).map((job, i) => (
                <div key={job.id} style={{ padding: "14px 28px", borderBottom: i < 3 ? `1px solid ${C.border}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <span style={{ ...H, fontSize: 14, fontWeight: 700, color: C.navy }}>{job.role}</span>
                      {job.urgent && <Tag label="Urgente" color={C.red} />}
                    </div>
                    <div style={{ ...B, fontSize: 12, color: C.muted }}>{job.co} · {job.dist} · {job.hrs}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ ...H, fontSize: 18, fontWeight: 800, color: C.green }}>R${job.pay}<span style={{ ...B, fontSize: 11, fontWeight: 400, color: C.muted }}>/h</span></div>
                    <div style={{ ...B, fontSize: 11, color: C.muted }}>{job.date}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "14px 28px", background: C.surf }}>
                <Btn label="Ver todas as vagas →" variant="outline" size="sm" onClick={() => onNav("worker-auth")} />
              </div>
            </div>

            <div>
              <SL>Para colaboradores</SL>
              <h2 style={{ ...H, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900, color: C.navy, letterSpacing: -1.2, lineHeight: 1.05, marginBottom: 16 }}>
                Flexibilidade real.<br />Você decide quando trabalhar.
              </h2>
              <p style={{ ...B, fontSize: 15, color: C.sub, lineHeight: 1.8, marginBottom: 32 }}>
                Escolha os turnos que se encaixam na sua rotina em supermercados e dark stores próximos de você. Sem compromissos longos, sem vínculo fixo.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
                {[
                  { icon:"⚡", t:"Aprovação em até 48h",       d:"Verificamos seus dados rapidamente. Você começa a trabalhar o quanto antes." },
                  { icon:"📍", t:"Vagas perto de você",         d:"Veja distância, horário e valor antes de se candidatar. Sem surpresas." },
                  { icon:"💵", t:"Pagamento rápido",            d:"Receba seus ganhos em até 48h após o turno realizado, direto na sua conta." },
                  { icon:"📈", t:"Construa sua reputação",      d:"Avaliações a cada turno constroem seu perfil e abrem mais oportunidades." },
                ].map(({ icon, t, d }) => (
                  <div key={t} style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: C.greenBg, border: `1px solid #BBF7D0`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ ...H, fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{t}</div>
                      <div style={{ ...B, fontSize: 13, color: C.sub, lineHeight: 1.65 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Btn label="Cadastro Colaborador →" variant="white" size="lg" onClick={() => onNav("worker-auth")} />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="sec sec-gray">
        <div className="wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SL>Como funciona</SL>
            <h2 style={{ ...H, fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: C.navy, letterSpacing: -1 }}>Simples para os dois lados</h2>
          </div>
          <div className="grid-2" style={{ gap: 28 }}>
            {[
              {
                title: "🏢 Para a empresa",
                color: C.navy,
                steps: [
                  ["1", "Cadastre seu negócio",        "CNPJ, dados da operação e responsável. Aprovação ágil."],
                  ["2", "Acesse o Talent Browser",     "Navegue pelos perfis disponíveis e filtre por especialidade."],
                  ["3", "Escolha e convide",           "Você decide quem vai. Notificamos o colaborador imediatamente."],
                  ["4", "Gerencie pelo painel",        "Histórico de contratações, avaliações e métricas em um só lugar."],
                ],
                cta: "Cadastrar Negócio →", nav: "company-auth", variant: "primary",
              },
              {
                title: "🛒 Para o colaborador",
                color: C.green,
                steps: [
                  ["1", "Cadastre-se gratuitamente",   "Dados, especialidades e documento de identificação."],
                  ["2", "Aprovação em 48h",            "Verificamos tudo rapidamente para você começar logo."],
                  ["3", "Escolha seus turnos",         "Candidate-se nas vagas que combinam com seu horário."],
                  ["4", "Trabalhe e seja avaliado",    "Cada turno bem feito melhora seu perfil e abre mais oportunidades."],
                ],
                cta: "Cadastro Colaborador →", nav: "worker-auth", variant: "white",
              },
            ].map(({ title, color, steps, cta, nav, variant }) => (
              <div key={title} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
                <div style={{ ...H, fontSize: 16, fontWeight: 800, color, marginBottom: 24 }}>{title}</div>
                {steps.map(([n, t, d]) => (
                  <div key={n} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: color + "12", border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ ...H, fontSize: 13, fontWeight: 800, color }}>{n}</span>
                    </div>
                    <div>
                      <div style={{ ...H, fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 3 }}>{t}</div>
                      <div style={{ ...B, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>{d}</div>
                    </div>
                  </div>
                ))}
                <Btn label={cta} variant={variant} size="md" full onClick={() => onNav(nav)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="sec" style={{ background: C.navy }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2 style={{ ...H, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, color: "#fff", letterSpacing: -1.5, lineHeight: 1, marginBottom: 16 }}>
            Pronto para começar?
          </h2>
          <p style={{ ...B, fontSize: 15, color: "rgba(255,255,255,.6)", marginBottom: 36, maxWidth: 400, margin: "0 auto 36px", lineHeight: 1.75 }}>
            Cadastro gratuito. Sem taxa de adesão. Sem burocracia.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn label="Cadastro Negócio" variant="primary" size="xl" onClick={() => onNav("company-auth")} />
            <Btn label="Cadastro Colaborador" variant="ghost" size="xl" onClick={() => onNav("worker-auth")} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.surf, borderTop: `1px solid ${C.border}`, padding: "36px 0" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, background: C.green, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</div>
              <span style={{ ...H, fontSize: 15, fontWeight: 900, color: C.navy }}>Giobbi's</span>
            </div>
            <div style={{ ...B, fontSize: 12, color: C.muted }}>© 2025 Giobbi's Tecnologia Ltda. · São Paulo, SP</div>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacidade", "Termos", "Contato"].map(l => <span key={l} style={{ ...B, fontSize: 13, color: C.sub, cursor: "pointer" }}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════════════
function AuthScreen({ type, onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [show, setShow] = useState(false);
  const isW = type === "worker";
  return (
    <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: C.surf }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <button onClick={onBack} style={{ ...B, fontSize: 13, color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 28 }}>← Voltar</button>
        <SL>{isW ? "Área do Colaborador" : "Área da Empresa"}</SL>
        <h2 style={{ ...H, fontSize: 34, fontWeight: 900, color: C.navy, letterSpacing: -1.2, marginBottom: 32 }}>Bem-vindo<br />de volta.</h2>
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
          <Field label="E-mail" placeholder="seu@email.com" value={email} onChange={setEmail} type="email" />
          <div style={{ marginBottom: 22 }}>
            <label style={{ ...B, fontSize: 12, fontWeight: 600, color: C.sub, letterSpacing: .3, display: "block", marginBottom: 6 }}>Senha</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)}
                style={{ width: "100%", padding: "11px 42px 11px 14px", borderRadius: 8, border: `1.5px solid ${C.border2}`, background: "#fff", ...B, fontSize: 14, color: C.text, outline: "none" }} />
              <span onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 13, color: C.muted }}>{show ? "🙈" : "👁"}</span>
            </div>
          </div>
          <Btn label="Entrar →" variant="primary" size="lg" full onClick={() => email && pass.length >= 6 && onLogin()} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} /><span style={{ ...B, fontSize: 12, color: C.muted }}>ou</span><div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <Btn label={isW ? "Criar conta gratuita →" : "Cadastrar minha empresa →"} variant="ghost" size="lg" full onClick={onRegister} />
          <div style={{ ...B, fontSize: 12, color: C.muted, textAlign: "center", marginTop: 16 }}>🔒 Dados protegidos</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORKER REGISTER
// ═══════════════════════════════════════════════════════════════
function WorkerRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ nome:"",cpf:"",nasc:"",tel:"",cep:"",rua:"",num:"",bairro:"",cidade:"",specs:[],photo:null,docType:"",docFile:null,email:"",senha:"",conf:"" });
  const fileRef = useRef(); const docRef = useRef();
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleSpec = s => set("specs", data.specs.includes(s) ? data.specs.filter(x => x !== s) : [...data.specs, s]);
  const fCPF = v => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4");
  const fTel = v => v.replace(/\D/g,"").slice(0,11).replace(/(\d{2})(\d{5})(\d{4})/,"($1) $2-$3");
  const fCEP = v => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d{3})/,"$1-$2");
  const ok = { 1:data.nome&&data.cpf.length>=11&&data.nasc&&data.tel, 2:data.cep&&data.rua&&data.bairro&&data.cidade, 3:data.specs.length>=1, 4:true, 5:!!data.docType, 6:data.email&&data.senha.length>=6&&data.senha===data.conf }[step];
  const next = () => step < 6 ? setStep(s => s+1) : onDone(data);
  const back = () => step > 1 ? setStep(s => s-1) : onBack();
  const labels = ["Dados pessoais","Endereço","Especialidades","Foto de perfil","Documento","Criar login"];

  return (
    <div style={{ minHeight: "75vh", padding: "48px 20px", background: C.surf }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <button onClick={back} style={{ ...B, fontSize: 13, color: C.sub, background: "none", border: "none", cursor: "pointer" }}>← {step > 1 ? "Voltar" : "Cancelar"}</button>
          <Prog step={step} total={6} />
        </div>
        <div style={{ ...B, fontSize: 12, color: C.muted, marginBottom: 20 }}>{labels[step-1]}</div>
        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, padding: "36px 40px", boxShadow: "0 2px 16px rgba(0,0,0,.05)" }}>

          {step===1&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Seus dados pessoais</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Aprovação em até <strong style={{color:C.green}}>48 horas</strong> após o envio.</p>
            <div className="form-grid">
              <div style={{gridColumn:"span 2"}}><Field label="Nome completo" placeholder="João da Silva" value={data.nome} onChange={v=>set("nome",v)} /></div>
              <Field label="CPF" placeholder="000.000.000-00" value={data.cpf} onChange={v=>set("cpf",fCPF(v))} maxLength={14} />
              <Field label="Data de nascimento" value={data.nasc} onChange={v=>set("nasc",v)} type="date" />
              <div style={{gridColumn:"span 2"}}><Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.tel} onChange={v=>set("tel",fTel(v))} type="tel" maxLength={15} /></div>
            </div>
          </>}

          {step===2&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Seu endereço</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Mostramos vagas perto de você com a distância exata.</p>
            <div className="form-grid">
              <Field label="CEP" placeholder="00000-000" value={data.cep} onChange={v=>set("cep",fCEP(v))} maxLength={9} />
              <Field label="Número" placeholder="42" value={data.num} onChange={v=>set("num",v)} />
              <div style={{gridColumn:"span 2"}}><Field label="Rua / Avenida" placeholder="Rua das Flores" value={data.rua} onChange={v=>set("rua",v)} /></div>
              <Field label="Bairro" placeholder="Centro" value={data.bairro} onChange={v=>set("bairro",v)} />
              <Field label="Cidade" placeholder="São Paulo · SP" value={data.cidade} onChange={v=>set("cidade",v)} />
            </div>
          </>}

          {step===3&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Suas especialidades</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Empresas filtram por especialidade. Selecione tudo o que você sabe fazer.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
              {SPECS.map(s=>{const on=data.specs.includes(s.id);return(
                <div key={s.id} onClick={()=>toggleSpec(s.id)} style={{padding:"9px 16px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${on?C.green:C.border2}`,background:on?C.greenBg:"transparent",display:"flex",alignItems:"center",gap:8,userSelect:"none",transition:"all .15s"}}>
                  <span style={{fontSize:17}}>{s.icon}</span>
                  <span style={{...B,fontSize:13,fontWeight:on?600:400,color:on?C.green:C.sub}}>{s.label}</span>
                </div>
              );})}
            </div>
            {data.specs.length>0&&<div style={{padding:"10px 14px",background:C.greenBg,border:`1px solid #BBF7D0`,borderRadius:8,...B,fontSize:13,color:C.green}}>✓ {data.specs.length} especialidade{data.specs.length>1?"s":""} selecionada{data.specs.length>1?"s":""}</div>}
          </>}

          {step===4&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Foto de perfil</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Perfis com foto têm muito mais chance de ser selecionados.</p>
            <div style={{display:"flex",alignItems:"flex-start",gap:28}}>
              <div onClick={()=>fileRef.current?.click()} style={{width:140,height:140,borderRadius:70,background:C.surf,border:`2px dashed ${data.photo?C.green:C.border2}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0,transition:"border-color .2s"}}>
                {data.photo?<img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<div style={{textAlign:"center"}}><div style={{fontSize:36,marginBottom:6}}>📷</div><div style={{...B,fontSize:12,color:C.muted}}>Enviar foto</div></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f){const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);}}} />
              <div>
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}}>Dicas para uma boa foto</div>
                {["Rosto bem visível","Boa iluminação","Fundo neutro","Foto recente"].map(d=><div key={d} style={{...B,fontSize:13,color:C.sub,marginBottom:7}}>✓ {d}</div>)}
                {!data.photo&&<button onClick={next} style={{...B,fontSize:13,color:C.muted,textDecoration:"underline",background:"none",border:"none",cursor:"pointer",marginTop:12}}>Pular por enquanto</button>}
              </div>
            </div>
          </>}

          {step===5&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Documento</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Necessário para verificação e aprovação do seu perfil.</p>
            <div style={{display:"flex",gap:14,marginBottom:20}}>
              {[["RG","🪪","Identidade"],["CNH","🚗","Habilitação"]].map(([t,ic,sub])=>(
                <div key={t} onClick={()=>set("docType",t)} style={{flex:1,background:data.docType===t?C.greenBg:"#fff",borderRadius:12,padding:"20px 16px",border:`2px solid ${data.docType===t?C.green:C.border2}`,textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{ic}</div>
                  <div style={{...H,fontSize:17,fontWeight:700,color:data.docType===t?C.green:C.navy}}>{t}</div>
                  <div style={{...B,fontSize:12,color:C.muted,marginTop:3}}>{sub}</div>
                </div>
              ))}
            </div>
            {data.docType&&<>
              <div onClick={()=>docRef.current?.click()} style={{background:C.surf,border:`2px dashed ${data.docFile?C.green:C.border2}`,borderRadius:12,padding:"40px 24px",textAlign:"center",cursor:"pointer",marginBottom:14}}>
                {data.docFile?<><div style={{fontSize:40,marginBottom:8}}>✅</div><div style={{...H,fontSize:16,fontWeight:700,color:C.green}}>Enviado!</div><div style={{...B,fontSize:12,color:C.muted,marginTop:4}}>Clique para substituir</div></>:<><div style={{fontSize:40,marginBottom:8}}>📄</div><div style={{...H,fontSize:16,fontWeight:700,color:C.navy}}>Enviar {data.docType}</div><div style={{...B,fontSize:12,color:C.muted,marginTop:4}}>Foto ou PDF · máx. 10MB</div></>}
              </div>
              <input ref={docRef} type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)set("docFile",f.name);}} />
            </>}
          </>}

          {step===6&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Criar login</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Para acessar sua conta no Giobbi's.</p>
            <div className="form-grid">
              <div style={{gridColumn:"span 2"}}><Field label="E-mail" placeholder="seu@email.com" value={data.email} onChange={v=>set("email",v)} type="email" /></div>
              <Field label="Senha" placeholder="Mínimo 6 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.conf} onChange={v=>set("conf",v)} type="password" hint={data.conf&&data.senha!==data.conf?"Senhas não coincidem":""} />
            </div>
            <Divider />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:12}}>Resumo do cadastro</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
              {[["Nome",data.nome],["CPF",data.cpf],["Cidade",data.cidade||"—"],["Especialidades",`${data.specs.length} selecionadas`],["Documento",data.docType||"—"],["Foto",data.photo?"Enviada":"Não enviada"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}
        </div>
        <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===6?"Criar meu perfil →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!ok} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY REGISTER
// ═══════════════════════════════════════════════════════════════
function CompanyRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({cnpj:"",razao:"",nomeFant:"",seg:"",cep:"",rua:"",num:"",bairro:"",cidade:"",resp:"",cargo:"",tel:"",email:"",senha:"",conf:""});
  const set = (k, v) => setData(d => ({...d, [k]: v}));
  const fCNPJ = v => v.replace(/\D/g,"").slice(0,14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,"$1.$2.$3/$4-$5");
  const fTel = v => v.replace(/\D/g,"").slice(0,11).replace(/(\d{2})(\d{5})(\d{4})/,"($1) $2-$3");
  const fCEP = v => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d{3})/,"$1-$2");
  const SEGS = ["Supermercado","Atacarejo","Dark Store","Centro de Distribuição","Delivery","Hortifruti","Farmácia","Indústria FMCG","Distribuidor","Outro"];
  const ok = {1:data.cnpj.length>=14&&data.razao&&data.seg,2:data.cep&&data.rua&&data.bairro&&data.cidade,3:data.resp&&data.cargo&&data.tel,4:true,5:data.email&&data.senha.length>=6&&data.senha===data.conf}[step];
  const next = () => step < 5 ? setStep(s=>s+1) : onDone(data);
  const back = () => step > 1 ? setStep(s=>s-1) : onBack();
  const labels = ["Dados da empresa","Endereço","Responsável","Como funciona","Criar login"];

  return (
    <div style={{minHeight:"75vh",padding:"48px 20px",background:C.surf}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <button onClick={back} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer"}}>← {step>1?"Voltar":"Cancelar"}</button>
          <Prog step={step} total={5} />
        </div>
        <div style={{...B,fontSize:12,color:C.muted,marginBottom:20}}>{labels[step-1]}</div>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:16,padding:"36px 40px",boxShadow:"0 2px 16px rgba(0,0,0,.05)"}}>

          {step===1&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Dados da empresa</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Precisamos do CNPJ para verificar sua empresa.</p>
            <div className="form-grid">
              <Field label="CNPJ" placeholder="00.000.000/0000-00" value={data.cnpj} onChange={v=>set("cnpj",fCNPJ(v))} maxLength={18} />
              <Field label="Nome fantasia (opcional)" placeholder="Como aparece no sistema" value={data.nomeFant} onChange={v=>set("nomeFant",v)} />
              <div style={{gridColumn:"span 2"}}><Field label="Razão social" placeholder="Nome Fantasia Ltda." value={data.razao} onChange={v=>set("razao",v)} /></div>
            </div>
            <div>
              <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,letterSpacing:.3,display:"block",marginBottom:10}}>Segmento</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SEGS.map(s=><div key={s} onClick={()=>set("seg",s)} style={{padding:"7px 14px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${data.seg===s?C.green:C.border2}`,background:data.seg===s?C.greenBg:"transparent",...B,fontSize:13,fontWeight:data.seg===s?600:400,color:data.seg===s?C.green:C.sub,transition:"all .15s"}}>{s}</div>)}
              </div>
            </div>
          </>}

          {step===2&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Endereço de operação</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Colaboradores verão a distância até sua operação.</p>
            <div className="form-grid">
              <Field label="CEP" placeholder="00000-000" value={data.cep} onChange={v=>set("cep",fCEP(v))} maxLength={9} />
              <Field label="Número" placeholder="1000" value={data.num} onChange={v=>set("num",v)} />
              <div style={{gridColumn:"span 2"}}><Field label="Rua / Avenida" placeholder="Av. Paulista" value={data.rua} onChange={v=>set("rua",v)} /></div>
              <Field label="Bairro" placeholder="Bela Vista" value={data.bairro} onChange={v=>set("bairro",v)} />
              <Field label="Cidade" placeholder="São Paulo · SP" value={data.cidade} onChange={v=>set("cidade",v)} />
            </div>
          </>}

          {step===3&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Responsável</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Quem vai gerenciar as contratações na plataforma.</p>
            <div className="form-grid">
              <div style={{gridColumn:"span 2"}}><Field label="Nome completo" placeholder="Maria Souza" value={data.resp} onChange={v=>set("resp",v)} /></div>
              <Field label="Cargo" placeholder="Gerente de Operações" value={data.cargo} onChange={v=>set("cargo",v)} />
              <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.tel} onChange={v=>set("tel",fTel(v))} type="tel" maxLength={15} />
            </div>
          </>}

          {step===4&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:20}}>Como o Giobbi's funciona</h2>
            {[
              {icon:"👁",t:"Você escolhe o colaborador",d:"Navegue pelos perfis verificados, veja especialidades e avaliações. Você decide — não a plataforma."},
              {icon:"🔒",t:"Perfis verificados",d:"Documentos conferidos antes de aparecerem no sistema. Segurança para os dois lados."},
              {icon:"📊",t:"Gestão completa",d:"Painel com histórico de contratações, avaliações e métricas da sua operação."},
              {icon:"💳",t:"Modelo simples de cobrança",d:"Sem mensalidade. Sem créditos. Cobrança por contratação confirmada."},
            ].map(({icon,t,d})=>(
              <div key={t} style={{display:"flex",gap:14,marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:38,height:38,borderRadius:9,background:C.greenBg,border:`1px solid #BBF7D0`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{t}</div><div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65}}>{d}</div></div>
              </div>
            ))}
          </>}

          {step===5&&<>
            <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,letterSpacing:-1,marginBottom:6}}>Criar login</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24}}>Para acessar o painel da empresa.</p>
            <div className="form-grid">
              <div style={{gridColumn:"span 2"}}><Field label="E-mail corporativo" placeholder="rh@empresa.com.br" value={data.email} onChange={v=>set("email",v)} type="email" /></div>
              <Field label="Senha" placeholder="Mínimo 6 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.conf} onChange={v=>set("conf",v)} type="password" hint={data.conf&&data.senha!==data.conf?"Senhas não coincidem":""} />
            </div>
            <Divider />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:12}}>Resumo</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 24px"}}>
              {[["Empresa",data.nomeFant||data.razao],["CNPJ",data.cnpj],["Segmento",data.seg],["Cidade",data.cidade||"—"],["Responsável",data.resp],["Cargo",data.cargo]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}
        </div>
        <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===5?"Cadastrar empresa →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!ok} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUCCESS SCREENS
// ═══════════════════════════════════════════════════════════════
function WorkerSuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.surf}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:88,height:88,borderRadius:44,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",animation:"popIn .4s ease both",overflow:"hidden"}}>
          {data?.photo?<img src={data.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:42,color:"#fff"}}>✓</span>}
        </div>
        <h2 style={{...H,fontSize:36,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Perfil criado,<br />{data?.nome?.split(" ")[0]||"colaborador"}!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:24}}>Seus dados foram enviados. Em até <strong style={{color:C.green}}>48 horas</strong> você já pode começar a se candidatar às vagas.</p>
        {data?.specs?.length>0&&<div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:8,marginBottom:24}}>{SPECS.filter(s=>data.specs.includes(s.id)).map(s=><Tag key={s.id} label={`${s.icon} ${s.label}`} color={C.green} />)}</div>}
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px",marginBottom:28,textAlign:"left"}}>
          {[["⚡ Aprovação","Em até 48 horas"],["💵 Pagamento","Rápido após cada turno realizado"],["📍 Vagas","Na sua região e especialidade"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{...B,fontSize:13,color:C.sub}}>{k}</span>
              <span style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        <Btn label="Ver vagas disponíveis →" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

function CompanySuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.surf}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:88,height:88,borderRadius:44,background:C.greenBg,border:`3px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 24px",animation:"popIn .4s ease both"}}>🏢</div>
        <h2 style={{...H,fontSize:36,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Empresa<br />cadastrada!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:24}}><strong style={{color:C.navy}}>{data?.nomeFant||data?.razao||"Sua empresa"}</strong> está pronta para contratar no Giobbi's.</p>
        <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px",marginBottom:28,textAlign:"left"}}>
          <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}}>Próximo passo</div>
          <div style={{...B,fontSize:14,color:C.sub,lineHeight:1.7}}>Acesse o <strong style={{color:C.navy}}>Talent Browser</strong> e encontre colaboradores verificados disponíveis na sua região. Filtre por especialidade e convide diretamente quem você quiser.</div>
        </div>
        <Btn label="Abrir Talent Browser →" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORKER PORTAL
// ═══════════════════════════════════════════════════════════════
function WorkerPortal({ workerData }) {
  const [tab, setTab] = useState("feed"); const [applied, setApplied] = useState([]); const [selJob, setSelJob] = useState(null);
  const tabs = [{id:"feed",label:"Vagas",icon:"🔍"},{id:"shifts",label:"Meus Turnos",icon:"📋"},{id:"profile",label:"Perfil",icon:"👤"}];
  return (
    <div className="portal-wrap">
      <aside className="sidebar desk-only">
        <div style={{padding:"0 18px 20px",borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:42,height:42,borderRadius:21,background:C.greenBg,border:`2px solid #BBF7D0`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
              {workerData?.photo?<img src={workerData.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{...H,fontSize:16,fontWeight:900,color:C.green}}>{workerData?.nome?.[0]||"J"}</span>}
            </div>
            <div>
              <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{workerData?.nome?.split(" ")[0]||"Colaborador"}</div>
              <div style={{...B,fontSize:11,color:C.muted}}>{workerData?.cidade||"São Paulo · SP"}</div>
            </div>
          </div>
        </div>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"10px 18px",cursor:"pointer",background:tab===t.id?"#F0FDF4":"transparent",borderLeft:`3px solid ${tab===t.id?C.green:"transparent"}`,transition:"all .15s"}}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span style={{...B,fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?C.green:C.sub}}>{t.label}</span>
          </div>
        ))}
      </aside>
      <main style={{padding:"28px 32px",minWidth:0,background:"#fff"}}>
        {tab==="feed"&&<WorkerFeed jobs={JOBS} applied={applied} onApply={id=>setApplied(p=>[...p,id])} selJob={selJob} setSelJob={setSelJob} workerData={workerData} />}
        {tab==="shifts"&&<WorkerShifts jobs={JOBS} applied={applied} />}
        {tab==="profile"&&<WorkerProfile workerData={workerData} />}
      </main>
      <div className="mob-nav">{tabs.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0 14px",textAlign:"center",cursor:"pointer"}}><div style={{fontSize:19}}>{t.icon}</div><div style={{...B,fontSize:10,color:tab===t.id?C.green:C.muted,fontWeight:tab===t.id?600:400,marginTop:3}}>{t.label}</div></div>)}</div>
    </div>
  );
}

function WorkerFeed({ jobs, applied, onApply, selJob, setSelJob, workerData }) {
  const [f, setF] = useState("Todos");
  const filters = ["Todos","Hoje","Urgente","Perto de mim"];
  const filtered = jobs.filter(j=>{ if(f==="Hoje")return j.date==="Hoje"; if(f==="Urgente")return j.urgent; if(f==="Perto de mim")return parseFloat(j.dist)<2; return true; });
  const weekEarnings = applied.reduce((s,id)=>{const j=jobs.find(x=>x.id===id);return s+(j?j.pay*8:0);},0);

  if(selJob) return (
    <div>
      <button onClick={()=>setSelJob(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:24}}>← Voltar às vagas</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:24,alignItems:"start"}}>
        <div>
          <div style={{background:selJob.color,borderRadius:12,padding:"28px 32px",marginBottom:16}}>
            <div style={{...B,fontSize:13,color:"rgba(255,255,255,.65)",marginBottom:5}}>{selJob.co}</div>
            <div style={{...H,fontSize:30,fontWeight:900,color:"#fff",letterSpacing:-.8,marginBottom:12}}>{selJob.role}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{SPECS.filter(s=>selJob.spec.includes(s.id)).map(s=><Tag key={s.id} label={`${s.icon} ${s.label}`} color="#fff" bg="rgba(255,255,255,.2)" />)}</div>
          </div>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:28}}>
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>Sobre a vaga</div>
            <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:24}}>{selJob.desc}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["📅 Data",selJob.date],["⏰ Horário",selJob.hrs],["📍 Distância",selJob.dist],["👥 Vagas",`${selJob.free} de ${selJob.slots}`]].map(([k,v])=>(
                <div key={k} style={{background:C.surf,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{...B,fontSize:11,color:C.muted,marginBottom:3}}>{k}</div>
                  <div style={{...H,fontSize:15,fontWeight:700,color:C.navy}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"sticky",top:88}}>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:24,boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
            <div style={{...H,fontSize:40,fontWeight:900,color:C.green,marginBottom:4}}>R${selJob.pay}<span style={{...B,fontSize:15,fontWeight:400,color:C.muted}}>/h</span></div>
            <div style={{...B,fontSize:14,color:C.sub,marginBottom:22}}>~R$ {selJob.pay*8} pelo turno completo</div>
            <Btn label={applied.includes(selJob.id)?"✓ Candidatura enviada!":"Candidatar-se →"} variant={applied.includes(selJob.id)?"ghost":"primary"} size="lg" full onClick={()=>!applied.includes(selJob.id)&&onApply(selJob.id)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5}}>Vagas disponíveis</h2>
          <div style={{...B,fontSize:13,color:C.muted,marginTop:2}}>📍 São Paulo, SP · {filtered.length} vagas</div>
        </div>
        {applied.length>0&&<div style={{background:C.greenBg,border:`1px solid #BBF7D0`,borderRadius:10,padding:"10px 18px",textAlign:"right"}}>
          <div style={{...B,fontSize:11,color:C.green,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Estimado esta semana</div>
          <div style={{...H,fontSize:20,fontWeight:900,color:C.green}}>R$ {weekEarnings}</div>
        </div>}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {filters.map(x=><button key={x} onClick={()=>setF(x)} style={{...B,fontSize:13,fontWeight:500,padding:"7px 16px",borderRadius:20,cursor:"pointer",background:f===x?C.navy:"transparent",color:f===x?"#fff":C.sub,border:`1px solid ${f===x?C.navy:C.border2}`,transition:"all .15s"}}>{x}</button>)}
      </div>
      <div className="job-grid">
        {filtered.map(job=>{
          const isApplied=applied.includes(job.id);
          return <div key={job.id} className="card-h" onClick={()=>setSelJob(job)} style={{background:"#fff",border:`1px solid ${isApplied?"#BBF7D0":C.border}`,borderRadius:12,padding:22,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:isApplied?C.green:job.color}} />
            <div style={{paddingLeft:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:2}}>{job.role}</div><div style={{...B,fontSize:12,color:C.muted}}>{job.co}</div></div>
                {isApplied?<Tag label="✓ Candidato" color={C.green} />:job.urgent&&<Tag label="Urgente" color={C.red} />}
              </div>
              <div style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:10}}>
                <span style={{...H,fontSize:28,fontWeight:900,color:C.green}}>R${job.pay}</span>
                <span style={{...B,fontSize:13,color:C.muted}}>/h · ~R${job.pay*8} pelo turno</span>
              </div>
              <div style={{display:"flex",gap:14,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{...B,fontSize:12,color:C.sub}}>📅 {job.date}</span>
                <span style={{...B,fontSize:12,color:C.sub}}>⏰ {job.hrs}</span>
                <span style={{...B,fontSize:12,color:C.sub}}>📍 {job.dist}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{SPECS.filter(s=>job.spec.includes(s.id)).map(s=><Tag key={s.id} label={s.label} color={C.green} />)}</div>
                <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:6,height:6,borderRadius:3,background:job.free<=1?C.red:C.green}} /><span style={{...B,fontSize:11,color:job.free<=1?C.red:C.green,fontWeight:600}}>{job.free} vaga{job.free!==1?"s":""}</span></div>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}

function WorkerShifts({ jobs, applied }) {
  const myJobs=jobs.filter(j=>applied.includes(j.id));
  const total=myJobs.reduce((s,j)=>s+j.pay*8,0);
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5}}>Meus Turnos</h2>
        {myJobs.length>0&&<div style={{background:C.greenBg,border:`1px solid #BBF7D0`,borderRadius:10,padding:"10px 18px"}}>
          <div style={{...B,fontSize:11,color:C.green,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Total esta semana</div>
          <div style={{...H,fontSize:20,fontWeight:900,color:C.green}}>R$ {total}</div>
        </div>}
      </div>
      {myJobs.length===0?<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:56,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:14}}>📋</div>
        <div style={{...H,fontSize:19,fontWeight:700,color:C.muted}}>Nenhum turno ainda</div>
        <div style={{...B,fontSize:14,color:C.muted,marginTop:8}}>Candidate-se nas vagas disponíveis</div>
      </div>:<div style={{display:"flex",flexDirection:"column",gap:10}}>
        {myJobs.map(job=>(
          <div key={job.id} style={{background:"#fff",border:`1px solid #BBF7D0`,borderRadius:12,padding:"18px 22px",display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"center"}}>
            <div>
              <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:5}}>{job.role} — {job.co}</div>
              <div style={{display:"flex",gap:18,flexWrap:"wrap"}}><span style={{...B,fontSize:13,color:C.sub}}>📅 {job.date}</span><span style={{...B,fontSize:13,color:C.sub}}>⏰ {job.hrs}</span></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{...H,fontSize:20,fontWeight:900,color:C.green}}>R$ {job.pay*8}</div>
              <div style={{...B,fontSize:12,color:C.muted}}>pelo turno</div>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}

function WorkerProfile({ workerData }) {
  const specs=SPECS.filter(s=>workerData?.specs?.includes(s.id));
  return (
    <div style={{maxWidth:560}}>
      <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5,marginBottom:22}}>Meu Perfil</h2>
      <div style={{display:"flex",gap:20,alignItems:"center",background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:16}}>
        <div style={{width:68,height:68,borderRadius:34,background:C.greenBg,border:`2px solid #BBF7D0`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",flexShrink:0}}>
          {workerData?.photo?<img src={workerData.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{...H,fontSize:26,fontWeight:900,color:C.green}}>{workerData?.nome?.[0]||"J"}</span>}
        </div>
        <div>
          <div style={{...H,fontSize:20,fontWeight:900,color:C.navy}}>{workerData?.nome||"Seu Nome"}</div>
          <div style={{...B,fontSize:13,color:C.muted,marginTop:3,marginBottom:8}}>{workerData?.cidade||"São Paulo · SP"}</div>
          <div style={{display:"flex",gap:8}}><Tag label="✓ Verificado" color={C.green} /><Tag label="Pagamento ativo" color={C.blue} /></div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[{v:"0",l:"Turnos feitos"},{v:"—",l:"Avaliação"},{v:"R$ 0",l:"Total ganhos"}].map(({v,l})=>(
          <div key={l} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 12px",textAlign:"center"}}>
            <div style={{...H,fontSize:24,fontWeight:900,color:C.green}}>{v}</div>
            <div style={{...B,fontSize:11,color:C.muted,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      {specs.length>0&&<div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Especialidades</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{specs.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:7,background:C.greenBg,border:`1px solid #BBF7D0`,borderRadius:8,padding:"7px 12px"}}><span style={{fontSize:16}}>{s.icon}</span><span style={{...B,fontSize:13,fontWeight:600,color:C.green}}>{s.label}</span></div>)}</div>
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY PORTAL
// ═══════════════════════════════════════════════════════════════
function CompanyPortal({ companyData }) {
  const [tab, setTab] = useState("talent"); const [hired, setHired] = useState([]); const [selW, setSelW] = useState(null);
  const tabs = [{id:"talent",label:"Talent Browser",icon:"🔍"},{id:"dash",label:"Dashboard",icon:"📊"},{id:"post",label:"Publicar vaga",icon:"➕"}];
  return (
    <div className="portal-wrap">
      <aside className="sidebar desk-only">
        <div style={{padding:"0 18px 20px",borderBottom:`1px solid ${C.border}`,marginBottom:14}}>
          <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:2}}>{companyData?.nomeFant||companyData?.razao||"Sua empresa"}</div>
          <div style={{...B,fontSize:12,color:C.muted}}>{companyData?.seg||"Varejo"}</div>
        </div>
        {tabs.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"10px 18px",cursor:"pointer",background:tab===t.id?"#F0FDF4":"transparent",borderLeft:`3px solid ${tab===t.id?C.green:"transparent"}`,transition:"all .15s"}}><span style={{fontSize:16}}>{t.icon}</span><span style={{...B,fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?C.green:C.sub}}>{t.label}</span></div>)}
        <Divider />
        <div style={{padding:"0 18px"}}>
          <div style={{...B,fontSize:11,color:C.muted,fontWeight:600,letterSpacing:.5,textTransform:"uppercase",marginBottom:8}}>Modelo de cobrança</div>
          <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65}}>Por contratação confirmada.<br />Sem mensalidade.</div>
        </div>
      </aside>
      <main style={{padding:"28px 32px",minWidth:0,background:"#fff"}}>
        {tab==="talent"&&<TalentBrowser workers={WORKERS} hired={hired} onHire={id=>setHired(p=>[...p,id])} selW={selW} setSelW={setSelW} />}
        {tab==="dash"&&<CompanyDash hired={hired} companyData={companyData} />}
        {tab==="post"&&<PostJob onDone={()=>setTab("dash")} />}
      </main>
      <div className="mob-nav">{tabs.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0 14px",textAlign:"center",cursor:"pointer"}}><div style={{fontSize:19}}>{t.icon}</div><div style={{...B,fontSize:10,color:tab===t.id?C.green:C.muted,fontWeight:tab===t.id?600:400,marginTop:3}}>{t.label}</div></div>)}</div>
    </div>
  );
}

function TalentBrowser({ workers, hired, onHire, selW, setSelW }) {
  const [specF, setSpecF] = useState("all");
  const filtered = workers.filter(w => specF === "all" || w.specs.includes(specF));

  if(selW) return (
    <div>
      <button onClick={()=>setSelW(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar</button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:22,alignItems:"start"}}>
        <div>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:28,marginBottom:14}}>
            <div style={{display:"flex",gap:18,alignItems:"center",marginBottom:22}}>
              <div style={{width:68,height:68,borderRadius:34,background:selW.color+"18",border:`2px solid ${selW.color}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{...H,fontSize:22,fontWeight:900,color:selW.color}}>{selW.initials}</span>
              </div>
              <div>
                <div style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:3}}>{selW.name}</div>
                <div style={{...B,fontSize:13,color:C.muted}}>{selW.city} · {selW.age} anos</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {[{v:`⭐ ${selW.rating}`,l:"Avaliação",c:C.green},{v:selW.shifts,l:"Turnos feitos",c:C.navy},{v:"98%",l:"Presença",c:C.blue}].map(({v,l,c})=>(
                <div key={l} style={{background:C.surf,borderRadius:8,padding:"12px 10px",textAlign:"center"}}>
                  <div style={{...H,fontSize:18,fontWeight:900,color:c}}>{v}</div>
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:18}}>
              <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:10}}>Especialidades</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{SPECS.filter(s=>selW.specs.includes(s.id)).map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:7,background:C.greenBg,border:`1px solid #BBF7D0`,borderRadius:8,padding:"6px 12px"}}><span style={{fontSize:15}}>{s.icon}</span><span style={{...B,fontSize:13,fontWeight:600,color:C.green}}>{s.label}</span></div>)}</div>
            </div>
            <div>
              <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:10}}>Disponibilidade</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(d=>{const a=selW.avail.includes(d);return <div key={d} style={{padding:"7px 13px",borderRadius:7,background:a?C.greenBg:C.surf,border:`1px solid ${a?"#BBF7D0":C.border}`}}><span style={{...B,fontSize:12,fontWeight:600,color:a?C.green:C.muted}}>{d}</span></div>;})}</div>
            </div>
          </div>
        </div>
        <div style={{position:"sticky",top:88}}>
          <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:22,boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:5}}>Convidar para um turno</div>
            <div style={{...B,fontSize:13,color:C.sub,marginBottom:20,lineHeight:1.65}}>Notificamos {selW.name.split(" ")[0]} imediatamente.</div>
            <Btn label={hired.includes(selW.id)?"✓ Convite enviado!":`Convidar ${selW.name.split(" ")[0]}`} variant={hired.includes(selW.id)?"ghost":"primary"} size="lg" full onClick={()=>!hired.includes(selW.id)&&onHire(selW.id)} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5}}>Talent Browser</h2>
          <div style={{...B,fontSize:13,color:C.muted,marginTop:2}}>{filtered.length} colaboradores verificados · Você decide quem convidar</div>
        </div>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:20,flexWrap:"wrap"}}>
        {[{id:"all",label:"Todos"},...SPECS].map(s=><button key={s.id} onClick={()=>setSpecF(s.id)} style={{...B,fontSize:12,fontWeight:500,padding:"6px 14px",borderRadius:18,cursor:"pointer",background:specF===s.id?C.navy:"transparent",color:specF===s.id?"#fff":C.sub,border:`1px solid ${specF===s.id?C.navy:C.border2}`,transition:"all .15s"}}>{s.icon||""} {s.label}</button>)}
      </div>
      <div className="worker-grid">
        {filtered.map(w=>{
          const isHired=hired.includes(w.id);
          return <div key={w.id} className="card-h" onClick={()=>setSelW(w)} style={{background:"#fff",border:`1px solid ${isHired?"#BBF7D0":C.border}`,borderRadius:12,padding:20}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:46,height:46,borderRadius:23,background:w.color+"18",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${w.color}25`,flexShrink:0}}>
                <span style={{...H,fontSize:15,fontWeight:900,color:w.color}}>{w.initials}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{w.name}</div>
                  {isHired&&<Tag label="✓ Convidado" color={C.green} />}
                </div>
                <div style={{...B,fontSize:12,color:C.muted}}>{w.city} · {w.age} anos</div>
              </div>
            </div>
            <div style={{display:"flex",gap:14,marginBottom:12}}>
              <div><div style={{...H,fontSize:16,fontWeight:900,color:C.green}}>⭐ {w.rating}</div><div style={{...B,fontSize:10,color:C.muted}}>avaliação</div></div>
              <div><div style={{...H,fontSize:16,fontWeight:900,color:C.navy}}>{w.shifts}</div><div style={{...B,fontSize:10,color:C.muted}}>turnos</div></div>
            </div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{SPECS.filter(s=>w.specs.includes(s.id)).map(s=><Tag key={s.id} label={s.label} color={C.green} />)}</div>
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{...B,fontSize:11,color:C.muted}}>Disponível:</span>
              {w.avail.map(d=><span key={d} style={{...B,fontSize:11,fontWeight:600,color:C.green,background:C.greenBg,padding:"2px 7px",borderRadius:5}}>{d}</span>)}
            </div>
          </div>;
        })}
      </div>
    </div>
  );
}

function CompanyDash({ hired, companyData }) {
  const nome = companyData?.nomeFant||companyData?.razao||"Sua Empresa";
  return (
    <div>
      <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5,marginBottom:22}}>Dashboard — {nome}</h2>
      <div className="grid-4" style={{marginBottom:22}}>
        {[{v:hired.length,l:"Colaboradores convocados",c:C.green,icon:"👥"},{v:`R$ ${hired.length*29}`,l:"Total investido",c:C.amber,icon:"💳"},{v:"3",l:"Vagas ativas",c:C.blue,icon:"📋"},{v:"4.8 ⭐",l:"Avaliação média",c:C.navy,icon:""}].map(({v,l,c,icon})=>(
          <div key={l} style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 16px"}}>
            {icon&&<div style={{fontSize:20,marginBottom:8}}>{icon}</div>}
            <div style={{...H,fontSize:26,fontWeight:900,color:c}}>{v}</div>
            <div style={{...B,fontSize:12,color:C.muted,marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      {hired.length===0?<div style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:12,padding:48,textAlign:"center"}}>
        <div style={{fontSize:44,marginBottom:12}}>👁</div>
        <div style={{...H,fontSize:18,fontWeight:700,color:C.muted}}>Nenhuma convocação ainda</div>
        <div style={{...B,fontSize:14,color:C.muted,marginTop:8}}>Use o Talent Browser para encontrar e convidar colaboradores</div>
      </div>:<>
        <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:12}}>Colaboradores convocados</div>
        {WORKERS.filter(w=>hired.includes(w.id)).map(w=>(
          <div key={w.id} style={{background:"#fff",border:`1px solid #BBF7D0`,borderRadius:10,padding:"14px 20px",display:"flex",alignItems:"center",gap:14,marginBottom:8}}>
            <div style={{width:38,height:38,borderRadius:19,background:w.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{...H,fontSize:13,fontWeight:900,color:w.color}}>{w.initials}</span></div>
            <div style={{flex:1}}><div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{w.name}</div><div style={{...B,fontSize:12,color:C.muted}}>⭐ {w.rating} · {w.shifts} turnos</div></div>
            <Tag label="✓ Convidado" color={C.green} />
          </div>
        ))}
      </>}
    </div>
  );
}

function PostJob({ onDone }) {
  const [step,setStep]=useState(1); const [done,setDone]=useState(false);
  const [data,setData]=useState({role:"",date:"",ts:"",te:"",slots:1,pay:22});
  const roles=["Picker de Separação","Operador de Caixa","Repositor","Operador Noturno","Shopper","Embalador"];
  const times=[["06h","14h"],["14h","22h"],["22h","06h"],["08h","16h"]];
  const dates=["Hoje","Amanhã","Sex, 25/04","Sáb, 26/04"];
  const ok={1:!!data.role,2:!!data.date&&!!data.ts,3:true}[step];

  if(done) return (
    <div style={{maxWidth:480,margin:"0 auto",textAlign:"center",padding:"64px 0"}}>
      <div style={{width:80,height:80,borderRadius:40,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 22px",animation:"popIn .4s ease both",color:"#fff"}}>✓</div>
      <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:12}}>Vaga publicada!</h2>
      <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.7,marginBottom:22}}>Colaboradores com o perfil <strong style={{color:C.navy}}>"{data.role}"</strong> serão notificados.</p>
      <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:22,textAlign:"left"}}>
        {[["Função",data.role],["Data",data.date],["Horário",`${data.ts}–${data.te}`],["Vagas",`${data.slots} abertas`]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
            <span style={{...B,fontSize:13,color:C.sub}}>{k}</span><span style={{...B,fontSize:13,fontWeight:600,color:C.navy}}>{v}</span>
          </div>
        ))}
      </div>
      <Btn label="Ver Dashboard →" variant="primary" size="xl" full onClick={onDone} />
    </div>
  );

  return (
    <div style={{maxWidth:560}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <h2 style={{...H,fontSize:24,fontWeight:900,color:C.navy,letterSpacing:-.5}}>Publicar vaga</h2>
        <Prog step={step} total={3} />
      </div>
      <div style={{background:"#fff",border:`1px solid ${C.border}`,borderRadius:14,padding:"28px 32px",marginBottom:18,boxShadow:"0 2px 12px rgba(0,0,0,.04)"}}>
        {step===1&&<><div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:16}}>Qual função você precisa?</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{roles.map(r=><div key={r} onClick={()=>setData({...data,role:r})} style={{padding:"13px 16px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${data.role===r?C.green:C.border2}`,background:data.role===r?C.greenBg:"transparent",...B,fontSize:14,fontWeight:data.role===r?600:400,color:data.role===r?C.green:C.sub,transition:"all .15s"}}>{r}</div>)}</div></>}
        {step===2&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <div><div style={{...B,fontSize:11,fontWeight:600,color:C.sub,letterSpacing:.5,textTransform:"uppercase",marginBottom:10}}>Data</div>{dates.map(d=><div key={d} onClick={()=>setData({...data,date:d})} style={{padding:"11px 14px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${data.date===d?C.green:C.border2}`,background:data.date===d?C.greenBg:"transparent",...B,fontSize:13,color:data.date===d?C.green:C.sub,fontWeight:data.date===d?600:400,marginBottom:7,transition:"all .15s"}}>{d}</div>)}</div>
          <div><div style={{...B,fontSize:11,fontWeight:600,color:C.sub,letterSpacing:.5,textTransform:"uppercase",marginBottom:10}}>Turno</div>{times.map(([s,e])=><div key={s} onClick={()=>setData({...data,ts:s,te:e})} style={{padding:"11px 14px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${data.ts===s?C.green:C.border2}`,background:data.ts===s?C.greenBg:"transparent",...B,fontSize:13,color:data.ts===s?C.green:C.sub,fontWeight:data.ts===s?600:400,marginBottom:7,transition:"all .15s"}}>{s} – {e}</div>)}</div>
        </div>}
        {step===3&&<>
          <div style={{marginBottom:22}}>
            <div style={{...B,fontSize:11,fontWeight:600,color:C.sub,letterSpacing:.5,textTransform:"uppercase",marginBottom:16}}>Valor por hora</div>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <button onClick={()=>setData({...data,pay:Math.max(18,data.pay-1)})} style={{width:44,height:44,borderRadius:8,border:`1px solid ${C.border2}`,background:C.surf,fontSize:20,cursor:"pointer",color:C.navy}}>−</button>
              <div style={{flex:1,textAlign:"center"}}><div style={{...H,fontSize:48,fontWeight:900,color:C.green}}>R${data.pay}</div><div style={{...B,fontSize:13,color:C.muted}}>por hora · ~R${data.pay*8} pelo turno</div></div>
              <button onClick={()=>setData({...data,pay:data.pay+1})} style={{width:44,height:44,borderRadius:8,border:"none",background:C.green,fontSize:20,cursor:"pointer",color:"#fff"}}>+</button>
            </div>
          </div>
          <Divider />
          <div>
            <div style={{...B,fontSize:11,fontWeight:600,color:C.sub,letterSpacing:.5,textTransform:"uppercase",marginBottom:16}}>Número de vagas</div>
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <button onClick={()=>setData({...data,slots:Math.max(1,data.slots-1)})} style={{width:44,height:44,borderRadius:8,border:`1px solid ${C.border2}`,background:C.surf,fontSize:20,cursor:"pointer",color:C.navy}}>−</button>
              <div style={{flex:1,textAlign:"center"}}><div style={{...H,fontSize:48,fontWeight:900,color:C.navy}}>{data.slots}</div><div style={{...B,fontSize:13,color:C.muted}}>vaga{data.slots>1?"s":""}</div></div>
              <button onClick={()=>setData({...data,slots:data.slots+1})} style={{width:44,height:44,borderRadius:8,border:"none",background:C.green,fontSize:20,cursor:"pointer",color:"#fff"}}>+</button>
            </div>
          </div>
        </>}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
        {step>1&&<Btn label="← Voltar" variant="ghost" size="lg" onClick={()=>setStep(s=>s-1)} />}
        <Btn label={step===3?"Publicar vaga →":"Continuar →"} variant="primary" size="lg" onClick={()=>{if(step<3)setStep(s=>s+1);else setDone(true);}} disabled={!ok} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function GiobbisApp() {
  const [screen, setScreen] = useState("home");
  const [wData, setWData] = useState(null);
  const [cData, setCData] = useState(null);
  const userType = screen==="worker-app"?"worker":screen==="company-app"?"company":null;
  const userName = userType==="worker"?wData?.nome?.split(" ")[0]:userType==="company"?(cData?.nomeFant||cData?.razao):null;

  return (
    <>
      <GlobalStyles />
      <Header onNav={setScreen} user={userName} type={userType} />
      {screen==="home"            &&<Landing          onNav={setScreen} />}
      {screen==="auth-choice"     &&<Landing          onNav={setScreen} />}
      {screen==="worker-auth"     &&<AuthScreen       type="worker"  onBack={()=>setScreen("home")} onLogin={()=>setScreen("worker-app")} onRegister={()=>setScreen("worker-register")} />}
      {screen==="worker-register" &&<WorkerRegister   onBack={()=>setScreen("worker-auth")} onDone={d=>{setWData(d);setScreen("worker-success");}} />}
      {screen==="worker-success"  &&<WorkerSuccess    data={wData} onEnter={()=>setScreen("worker-app")} />}
      {screen==="worker-app"      &&<WorkerPortal     workerData={wData} />}
      {screen==="company-auth"    &&<AuthScreen       type="company" onBack={()=>setScreen("home")} onLogin={()=>setScreen("company-app")} onRegister={()=>setScreen("company-register")} />}
      {screen==="company-register"&&<CompanyRegister  onBack={()=>setScreen("company-auth")} onDone={d=>{setCData(d);setScreen("company-success");}} />}
      {screen==="company-success" &&<CompanySuccess   data={cData} onEnter={()=>setScreen("company-app")} />}
      {screen==="company-app"     &&<CompanyPortal    companyData={cData} />}
    </>
  );
}
