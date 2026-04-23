import { useState, useEffect, useRef, useCallback } from "react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────
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
      body { background: #F8FAFC; color: #0A1628; font-family: 'General Sans', sans-serif; -webkit-font-smoothing: antialiased; }
      input, textarea, select, button { font-family: inherit; }
      input::placeholder { color: #9CA3AF; }
      ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #F1F5F9; } ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }

      .wrap { max-width: 1160px; margin: 0 auto; padding: 0 32px; }
      @media(max-width:768px){ .wrap { padding: 0 16px; } }

      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
      @media(max-width:600px){ .form-grid { grid-template-columns: 1fr; } }

      .hdr { position: sticky; top: 0; z-index: 300; background: rgba(255,255,255,.97); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E8F0; height: 60px; display: flex; align-items: center; }
      .hdr-nav { display: flex; align-items: center; gap: 24px; }
      @media(max-width:768px){ .hdr-nav { display: none; } }

      .prog { display: flex; gap: 4px; align-items: center; }
      .prog-s { height: 4px; border-radius: 2px; transition: all .3s; }

      @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes popIn { 0%{transform:scale(.88);opacity:0} 70%{transform:scale(1.03)} 100%{transform:scale(1);opacity:1} }
      @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      .fu { animation: fadeUp .35s ease both; }

      .chip { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; border-radius:9px; cursor:pointer; border:1.5px solid #CBD5E1; background:transparent; transition:all .15s; user-select:none; }
      .chip.on { border-color:#16A34A; background:#F0FDF4; }
      .chip:hover { border-color:#16A34A; }

      .day-chip { display:flex; flex-direction:column; align-items:center; gap:4px; padding:12px 10px; border-radius:9px; cursor:pointer; border:1.5px solid #CBD5E1; background:#fff; transition:all .15s; min-width:52px; }
      .day-chip.on { border-color:#16A34A; background:#F0FDF4; }

      .shift-chip { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:14px 10px; border-radius:10px; cursor:pointer; border:1.5px solid #CBD5E1; background:#fff; transition:all .15s; }
      .shift-chip.on { border-color:#16A34A; background:#F0FDF4; }

      .upload-zone { border:2px dashed #CBD5E1; border-radius:14px; padding:40px 24px; text-align:center; cursor:pointer; transition:border-color .2s, background .2s; }
      .upload-zone:hover { border-color:#16A34A; background:#F0FDF4; }
      .upload-zone.has-file { border-color:#16A34A; border-style:solid; background:#F0FDF4; }

      .nav-link { font-size:14px; color:#475569; cursor:pointer; transition:color .15s; }
      .nav-link:hover { color:#0A1628; }

      .tab-btn { flex:1; padding:10px; border:none; background:transparent; cursor:pointer; font-size:13px; font-weight:500; color:#64748B; border-bottom:2px solid transparent; transition:all .15s; font-family:'General Sans',sans-serif; }
      .tab-btn.active { color:#16A34A; border-bottom-color:#16A34A; font-weight:600; }

      .unit-card { background:#fff; border:1.5px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:12px; position:relative; }
      .unit-card:hover { border-color:#CBD5E1; }

      input:focus { outline:none; border-color:#16A34A !important; }
      select:focus { outline:none; }
    `;
    document.head.appendChild(s);
    document.body.style.overflowX = "hidden";
  }, []);
  return null;
}

// ─── TOKENS ────────────────────────────────────────────────────
const C = {
  bg: "#F8FAFC", white: "#FFFFFF",
  border: "#E2E8F0", border2: "#CBD5E1",
  navy: "#0A1628", navyL: "#1E3A5F",
  green: "#16A34A", greenBg: "#F0FDF4", greenBorder: "#BBF7D0",
  blue: "#2563EB", blueBg: "#EFF6FF",
  red: "#DC2626", redBg: "#FEF2F2",
  amber: "#D97706", amberBg: "#FFFBEB",
  text: "#0A1628", sub: "#475569", muted: "#94A3B8",
};
const H = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const B = { fontFamily: "'General Sans', sans-serif" };

// ─── MASKS & VALIDATORS ────────────────────────────────────────
const maskCPF  = v => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
const maskCNPJ = v => v.replace(/\D/g,"").slice(0,14).replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1/$2").replace(/(\d{4})(\d{1,2})$/,"$1-$2");
const maskPhone= v => { const d=v.replace(/\D/g,"").slice(0,11); if(d.length<=10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/,"($1) $2-$3"); return d.replace(/(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3"); };
const maskCEP  = v => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d{1,3})/,"$1-$2");

const validateCPF = cpf => {
  const d = cpf.replace(/\D/g,"");
  if(d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  let s=0; for(let i=0;i<9;i++) s+=parseInt(d[i])*(10-i);
  let r=11-(s%11); if(r>=10)r=0; if(r!==parseInt(d[9])) return false;
  s=0; for(let i=0;i<10;i++) s+=parseInt(d[i])*(11-i);
  r=11-(s%11); if(r>=10)r=0; return r===parseInt(d[10]);
};

const validateAge = (dateStr) => {
  if(!dateStr) return false;
  const birth = new Date(dateStr);
  const today = new Date();
  const age = today.getFullYear()-birth.getFullYear() - (today<new Date(today.getFullYear(),birth.getMonth(),birth.getDate())?1:0);
  return age >= 18;
};

// ─── CEP LOOKUP ────────────────────────────────────────────────
const lookupCEP = async (cep) => {
  const d = cep.replace(/\D/g,"");
  if(d.length !== 8) return null;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const data = await r.json();
    if(data.erro) return null;
    return { rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf };
  } catch { return null; }
};

// ─── PRIMITIVES ────────────────────────────────────────────────
const Btn = ({ label, onClick, disabled, variant="primary", size="md", full=false, loading=false }) => {
  const vs = {
    primary: { background:disabled?"#CBD5E1":C.green, color:"#fff", border:"none" },
    ghost:   { background:"transparent", color:C.sub, border:`1.5px solid ${C.border2}` },
    outline: { background:"transparent", color:C.green, border:`1.5px solid ${C.green}` },
    navy:    { background:C.navy, color:"#fff", border:"none" },
    white:   { background:"#fff", color:C.navy, border:`1.5px solid ${C.border2}` },
    danger:  { background:C.redBg, color:C.red, border:`1px solid ${C.red}30` },
  }[variant];
  const ss = {
    sm: { fontSize:12, padding:"7px 14px", borderRadius:7 },
    md: { fontSize:13, padding:"10px 20px", borderRadius:8 },
    lg: { fontSize:14, padding:"12px 26px", borderRadius:9 },
    xl: { fontSize:15, padding:"14px 32px", borderRadius:10 },
  }[size];
  return (
    <button onClick={!disabled&&!loading?onClick:undefined}
      style={{ ...H, fontWeight:700, cursor:disabled||loading?"default":"pointer", display:"inline-flex", alignItems:"center", justifyContent:full?"center":undefined, gap:8, width:full?"100%":"auto", whiteSpace:"nowrap", transition:"opacity .15s", ...vs, ...ss }}>
      {loading && <span style={{ width:14,height:14,borderRadius:7,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite",display:"inline-block",flexShrink:0 }} />}
      {label}
    </button>
  );
};

const Field = ({ label, placeholder, value, onChange, type="text", hint, maxLength, required, suffix, disabled, helper }) => (
  <div style={{ marginBottom:18 }}>
    {label && <label style={{ ...B, fontSize:12, fontWeight:600, color:C.sub, display:"block", marginBottom:6 }}>
      {label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}
    </label>}
    <div style={{ position:"relative" }}>
      <input type={type} placeholder={placeholder} value={value} maxLength={maxLength} disabled={disabled}
        onChange={e=>onChange(e.target.value)}
        style={{ width:"100%", padding:`11px ${suffix?40:14}px 11px 14px`, borderRadius:8, border:`1.5px solid ${hint?C.red:C.border2}`, background:disabled?"#F8FAFC":"#fff", ...B, fontSize:14, color:disabled?C.muted:C.text, transition:"border-color .2s" }} />
      {suffix && <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", ...B, fontSize:12, color:C.muted }}>{suffix}</span>}
    </div>
    {hint && <div style={{ ...B, fontSize:11, color:C.red, marginTop:5, display:"flex", alignItems:"center", gap:4 }}>⚠ {hint}</div>}
    {helper && !hint && <div style={{ ...B, fontSize:11, color:C.muted, marginTop:5 }}>{helper}</div>}
  </div>
);

const SelectField = ({ label, options, value, onChange, required }) => (
  <div style={{ marginBottom:18 }}>
    {label && <label style={{ ...B, fontSize:12, fontWeight:600, color:C.sub, display:"block", marginBottom:6 }}>
      {label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}
    </label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1.5px solid ${C.border2}`, background:"#fff", ...B, fontSize:14, color:value?C.text:C.muted, cursor:"pointer" }}>
      <option value="">Selecionar...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const SL = ({ children }) => (
  <div style={{ ...B, fontSize:11, fontWeight:700, color:C.green, letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>{children}</div>
);

const Div = () => <div style={{ height:1, background:C.border, margin:"22px 0" }} />;

const Prog = ({ step, total }) => (
  <div className="prog">
    {Array.from({length:total}).map((_,i) => (
      <div key={i} className="prog-s" style={{ background:i<step?C.green:C.border2, width:i<step?28:14 }} />
    ))}
    <span style={{ ...B, fontSize:12, color:C.muted, marginLeft:8 }}>{step} de {total}</span>
  </div>
);

const Alert = ({ type="info", children }) => {
  const styles = {
    info:    { bg:C.blueBg,  border:"#BFDBFE", color:C.blue,  icon:"ℹ" },
    warning: { bg:C.amberBg, border:"#FDE68A", color:C.amber, icon:"⚠" },
    success: { bg:C.greenBg, border:C.greenBorder, color:C.green, icon:"✓" },
    error:   { bg:C.redBg,   border:"#FECACA", color:C.red,   icon:"✕" },
  }[type];
  return (
    <div style={{ background:styles.bg, border:`1px solid ${styles.border}`, borderRadius:10, padding:"12px 16px", display:"flex", gap:10, marginBottom:16 }}>
      <span style={{ color:styles.color, fontWeight:700, flexShrink:0 }}>{styles.icon}</span>
      <div style={{ ...B, fontSize:13, color:styles.color, lineHeight:1.65 }}>{children}</div>
    </div>
  );
};

// ─── HEADER ────────────────────────────────────────────────────
function Header({ onNav, user, type }) {
  const [mob, setMob] = useState(false);
  return (
    <header className="hdr">
      <div className="wrap" style={{ width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div onClick={()=>onNav("home")} style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
            <div style={{ width:32, height:32, background:C.green, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>⚡</div>
            <span style={{ ...H, fontSize:19, fontWeight:900, color:C.navy, letterSpacing:-.4 }}>Giobbi's</span>
          </div>
          <nav className="hdr-nav">
            {!user
              ? [["Para empresas","company-auth"],["Para colaboradores","worker-auth"],["Contato","home"]].map(([l,n])=>(
                  <span key={l} className="nav-link" onClick={()=>onNav(n)}>{l}</span>
                ))
              : <span className="nav-link" onClick={()=>onNav("home")}>← Início</span>
            }
          </nav>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {!user ? <>
              <Btn label="Entrar" variant="ghost" size="sm" onClick={()=>onNav("auth-choice")} />
              <Btn label="Cadastro Negócio" variant="primary" size="sm" onClick={()=>onNav("company-register")} />
            </> : <>
              <span style={{...B,fontSize:13,color:C.sub}}>Olá, {user}</span>
              <Btn label="Sair" variant="ghost" size="sm" onClick={()=>onNav("home")} />
            </>}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── DATA ──────────────────────────────────────────────────────
const SPECS = [
  {id:"pick",icon:"📦",label:"Picking"},
  {id:"rep",icon:"🏪",label:"Reposição"},
  {id:"caixa",icon:"💳",label:"Caixa"},
  {id:"estq",icon:"🏭",label:"Estoquista"},
  {id:"frios",icon:"❄️",label:"Frios"},
  {id:"hort",icon:"🥬",label:"Hortifruti"},
  {id:"log",icon:"🚛",label:"Logística"},
  {id:"pack",icon:"📫",label:"Embalador"},
  {id:"shopper",icon:"🛍",label:"Shopper"},
  {id:"padaria",icon:"🥖",label:"Padaria"},
];
const DAYS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const SHIFTS = [
  {id:"manha",icon:"🌅",label:"Manhã",sub:"06h–14h"},
  {id:"tarde",icon:"☀️",label:"Tarde",sub:"14h–22h"},
  {id:"noite",icon:"🌙",label:"Noite",sub:"22h–06h"},
];
const SEGS = ["Supermercado","Atacarejo","Dark Store","Centro de Distribuição","Delivery","Hortifruti","Farmácia","Indústria FMCG","Distribuidor","Outro"];

// ═══════════════════════════════════════════════════════════════
// LANDING (simplified for now - focus is on forms)
// ═══════════════════════════════════════════════════════════════
function Landing({ onNav }) {
  return (
    <div style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 20px" }}>
      <div style={{ maxWidth:640, width:"100%", textAlign:"center" }}>
        <div style={{ ...B, fontSize:11, fontWeight:700, color:C.green, letterSpacing:1.5, textTransform:"uppercase", marginBottom:16 }}>Especialistas em varejo</div>
        <h1 style={{ ...H, fontSize:"clamp(38px,6vw,68px)", fontWeight:900, color:C.navy, letterSpacing:-2, lineHeight:.95, marginBottom:20 }}>
          O parceiro certo,<br />no momento certo.
        </h1>
        <p style={{ ...B, fontSize:17, color:C.sub, lineHeight:1.75, marginBottom:44, maxWidth:480, margin:"0 auto 44px" }}>
          Conectamos empresas de varejo a colaboradores verificados e qualificados, de forma rápida e sem burocracia.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Btn label="Cadastro Negócio →" variant="primary" size="xl" onClick={()=>onNav("company-register")} />
          <Btn label="Sou colaborador →" variant="white" size="xl" onClick={()=>onNav("worker-register")} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginTop:56, paddingTop:40, borderTop:`1px solid ${C.border}` }}>
          {[{v:"+1.000",l:"Estabelecimentos"},{v:"+300k",l:"Horas realizadas"},{v:"+60",l:"Cidades"},{v:"4,9★",l:"Avaliação média"}].map(({v,l})=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ ...H, fontSize:"clamp(22px,3vw,32px)", fontWeight:900, color:C.green }}>{v}</div>
              <div style={{ ...B, fontSize:13, color:C.muted, marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORKER REGISTRATION — 7 steps
// ═══════════════════════════════════════════════════════════════
function WorkerRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [data, setData] = useState({
    // step 1 — dados pessoais
    nome:"", cpf:"", nascimento:"", telefone:"",
    // step 2 — endereço
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    // step 3 — especialidades
    specs:[],
    // step 4 — disponibilidade
    dias:[], turnos:[],
    // step 5 — foto rosto
    fotoRosto: null,
    // step 6 — doc + selfie
    docTipo:"", selfieDoc: null,
    // step 7 — login
    email:"", senha:"", confirma:"",
  });

  const photoRef  = useRef();
  const selfieRef = useRef();
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const toggleArr = (k,v) => setData(d=>({...d,[k]:d[k].includes(v)?d[k].filter(x=>x!==v):[...d[k],v]}));

  const handleCEP = async (rawCep) => {
    const masked = maskCEP(rawCep);
    set("cep", masked);
    if(masked.replace(/\D/g,"").length===8) {
      setCepLoading(true);
      const addr = await lookupCEP(masked);
      setCepLoading(false);
      if(addr) setData(d=>({...d, rua:addr.rua, bairro:addr.bairro, cidade:addr.cidade, estado:addr.estado}));
    }
  };

  const cpfError   = data.cpf && data.cpf.replace(/\D/g,"").length===11 && !validateCPF(data.cpf) ? "CPF inválido" : "";
  const ageError   = data.nascimento && !validateAge(data.nascimento) ? "É necessário ter 18 anos ou mais" : "";
  const senhaError = data.confirma && data.senha !== data.confirma ? "Senhas não coincidem" : "";

  const canNext = {
    1: data.nome && data.cpf.replace(/\D/g,"").length===11 && validateCPF(data.cpf) && data.nascimento && validateAge(data.nascimento) && data.telefone.replace(/\D/g,"").length>=10,
    2: data.cep && data.rua && data.numero && data.bairro && data.cidade,
    3: data.specs.length >= 1,
    4: data.dias.length >= 1 && data.turnos.length >= 1,
    5: !!data.fotoRosto,
    6: !!data.docTipo && !!data.selfieDoc,
    7: data.email && data.senha.length >= 8 && !senhaError,
  }[step];

  const next = () => step < 7 ? setStep(s=>s+1) : onDone(data);
  const back = () => step > 1 ? setStep(s=>s-1) : onBack();
  const LABELS = ["Dados pessoais","Endereço","Especialidades","Disponibilidade","Foto de perfil","Documento","Criar conta"];

  const readFile = (file, key) => {
    const r = new FileReader();
    r.onload = e => set(key, e.target.result);
    r.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight:"90vh", padding:"32px 20px 80px", background:C.bg }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <button onClick={back} style={{ ...B, fontSize:13, color:C.sub, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            ← {step>1?"Voltar":"Cancelar"}
          </button>
          <Prog step={step} total={7} />
        </div>
        <div style={{ ...B, fontSize:12, color:C.muted, marginBottom:20 }}>{LABELS[step-1]}</div>

        {/* Card */}
        <div className="fu" key={step} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"32px 36px", boxShadow:"0 2px 16px rgba(0,0,0,.05)" }}>

          {/* ── STEP 1: Dados pessoais ── */}
          {step===1 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dados pessoais</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Preencha com seus dados reais. Essas informações serão verificadas pela equipe Giobbi's.</p>
            <Field label="Nome completo" placeholder="João da Silva" value={data.nome} onChange={v=>set("nome",v)} required />
            <div className="form-grid">
              <Field label="CPF" placeholder="000.000.000-00" value={data.cpf} onChange={v=>set("cpf",maskCPF(v))} maxLength={14} hint={cpfError} required helper="Será validado pelo sistema" />
              <Field label="Data de nascimento" value={data.nascimento} onChange={v=>set("nascimento",v)} type="date" hint={ageError} required helper="Mínimo 18 anos" />
            </div>
            <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.telefone} onChange={v=>set("telefone",maskPhone(v))} type="tel" maxLength={15} required helper="Usado para comunicação sobre turnos" />
            <Alert type="info">Todos os dados são tratados com sigilo. Veja nossa política de privacidade.</Alert>
          </>}

          {/* ── STEP 2: Endereço ── */}
          {step===2 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Seu endereço</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Usamos para mostrar vagas próximas com a distância exata de cada oportunidade.</p>
            <div className="form-grid">
              <div>
                <Field label="CEP" placeholder="00000-000" value={data.cep} onChange={handleCEP} maxLength={9} required
                  suffix={cepLoading?"...":""} helper={cepLoading?"Buscando endereço...":""} />
              </div>
              <Field label="Número" placeholder="42" value={data.numero} onChange={v=>set("numero",v)} required />
            </div>
            {cepLoading && <Alert type="info">Buscando endereço pelo CEP...</Alert>}
            <Field label="Rua / Avenida" placeholder="Será preenchido pelo CEP" value={data.rua} onChange={v=>set("rua",v)} required disabled={!data.rua&&cepLoading} />
            <div className="form-grid">
              <Field label="Bairro" placeholder="Centro" value={data.bairro} onChange={v=>set("bairro",v)} required />
              <Field label="Complemento" placeholder="Apto 12, Bloco B" value={data.complemento} onChange={v=>set("complemento",v)} />
            </div>
            <div className="form-grid">
              <Field label="Cidade" placeholder="São Paulo" value={data.cidade} onChange={v=>set("cidade",v)} required />
              <Field label="Estado" placeholder="SP" value={data.estado} onChange={v=>set("estado",v)} />
            </div>
          </>}

          {/* ── STEP 3: Especialidades ── */}
          {step===3 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Suas especialidades</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Selecione tudo o que você já sabe fazer. Empresas filtram por especialidade ao buscar colaboradores.</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:20 }}>
              {SPECS.map(s => {
                const on = data.specs.includes(s.id);
                return (
                  <div key={s.id} className={`chip ${on?"on":""}`} onClick={()=>toggleArr("specs",s.id)}>
                    <span style={{fontSize:18}}>{s.icon}</span>
                    <span style={{...B,fontSize:13,fontWeight:on?600:400,color:on?C.green:C.sub}}>{s.label}</span>
                    {on && <span style={{color:C.green,fontSize:12}}>✓</span>}
                  </div>
                );
              })}
            </div>
            {data.specs.length > 0
              ? <Alert type="success">{data.specs.length} especialidade{data.specs.length>1?"s":""} selecionada{data.specs.length>1?"s":""}. Quanto mais especialidades, mais vagas você verá.</Alert>
              : <Alert type="warning">Selecione ao menos uma especialidade para continuar.</Alert>
            }
          </>}

          {/* ── STEP 4: Disponibilidade ── */}
          {step===4 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Sua disponibilidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Informe quando você pode trabalhar. Você sempre poderá atualizar depois.</p>

            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:12}}>DIAS DA SEMANA</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
              {DAYS.map(d => {
                const on = data.dias.includes(d);
                return (
                  <div key={d} className={`day-chip ${on?"on":""}`} onClick={()=>toggleArr("dias",d)}>
                    <span style={{...B,fontSize:12,fontWeight:600,color:on?C.green:C.sub}}>{d}</span>
                    {on && <span style={{fontSize:10,color:C.green}}>✓</span>}
                  </div>
                );
              })}
            </div>

            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:12}}>TURNOS DE PREFERÊNCIA</div>
            <div style={{ display:"flex", gap:10 }}>
              {SHIFTS.map(sh => {
                const on = data.turnos.includes(sh.id);
                return (
                  <div key={sh.id} className={`shift-chip ${on?"on":""}`} onClick={()=>toggleArr("turnos",sh.id)}>
                    <span style={{fontSize:24}}>{sh.icon}</span>
                    <span style={{...H,fontSize:14,fontWeight:700,color:on?C.green:C.navy}}>{sh.label}</span>
                    <span style={{...B,fontSize:11,color:C.muted}}>{sh.sub}</span>
                    {on && <span style={{...B,fontSize:11,color:C.green,fontWeight:600}}>✓ Selecionado</span>}
                  </div>
                );
              })}
            </div>
            {data.dias.length>0 && data.turnos.length>0 && (
              <Alert type="success" style={{marginTop:16}}>
                Disponível {data.dias.join(", ")} — {data.turnos.map(t=>SHIFTS.find(s=>s.id===t)?.label).join(", ")}
              </Alert>
            )}
          </>}

          {/* ── STEP 5: Foto de rosto ── */}
          {step===5 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Foto de perfil</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Perfis com foto recebem muito mais convites de empresas.</p>

            <Alert type="info">
              <strong>Como tirar uma boa foto:</strong><br />
              • Rosto completamente visível, sem óculos escuros ou boné<br />
              • Fundo neutro (parede branca ou clara)<br />
              • Boa iluminação natural ou artificial<br />
              • Olhando diretamente para a câmera<br />
              • Foto recente (últimos 6 meses)
            </Alert>

            <div className={`upload-zone ${data.fotoRosto?"has-file":""}`} onClick={()=>photoRef.current?.click()} style={{marginTop:8}}>
              {data.fotoRosto
                ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                    <img src={data.fotoRosto} alt="Foto" style={{width:120,height:120,borderRadius:60,objectFit:"cover",border:`3px solid ${C.green}`}} />
                    <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Foto enviada</span>
                    <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                  </div>
                : <div>
                    <div style={{fontSize:48,marginBottom:12}}>📷</div>
                    <div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Clique para enviar sua foto</div>
                    <div style={{...B,fontSize:13,color:C.muted}}>JPG ou PNG · máx. 5MB</div>
                  </div>
              }
            </div>
            <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"fotoRosto");}} />
          </>}

          {/* ── STEP 6: Documento + Selfie ── */}
          {step===6 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Documento de identidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Precisamos confirmar sua identidade. Vamos precisar de uma selfie sua <strong>segurando o documento aberto</strong>.</p>

            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:10}}>TIPO DE DOCUMENTO</div>
            <div style={{ display:"flex", gap:12, marginBottom:24 }}>
              {[["RG","🪪","Identidade"],["CNH","🚗","Habilitação"]].map(([t,ic,sub])=>(
                <div key={t} onClick={()=>set("docTipo",t)} style={{flex:1,background:data.docTipo===t?C.greenBg:"#fff",borderRadius:12,padding:"18px 14px",border:`2px solid ${data.docTipo===t?C.green:C.border2}`,textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:32,marginBottom:8}}>{ic}</div>
                  <div style={{...H,fontSize:17,fontWeight:700,color:data.docTipo===t?C.green:C.navy}}>{t}</div>
                  <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>

            {data.docTipo && <>
              <Alert type="warning">
                <strong>Como tirar a selfie com documento:</strong><br />
                1. Segure o {data.docTipo} aberto na altura do rosto<br />
                2. O documento deve estar completamente visível e legível<br />
                3. Seu rosto e o documento devem aparecer na mesma foto<br />
                4. Boa iluminação — evite reflexos no documento<br />
                5. Fundo simples, de preferência parede clara
              </Alert>

              <div className={`upload-zone ${data.selfieDoc?"has-file":""}`} onClick={()=>selfieRef.current?.click()}>
                {data.selfieDoc
                  ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                      <img src={data.selfieDoc} alt="Selfie" style={{maxWidth:240,maxHeight:180,borderRadius:10,objectFit:"cover",border:`2px solid ${C.green}`}} />
                      <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Selfie enviada</span>
                      <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                    </div>
                  : <div>
                      <div style={{fontSize:48,marginBottom:12}}>🤳</div>
                      <div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Selfie segurando o {data.docTipo}</div>
                      <div style={{...B,fontSize:13,color:C.muted}}>Foto ou PDF · máx. 10MB</div>
                    </div>
                }
              </div>
              <input ref={selfieRef} type="file" accept="image/*,application/pdf" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"selfieDoc");}} />
              <div style={{...B,fontSize:11,color:C.muted,textAlign:"center",marginTop:10}}>🔒 Criptografado. Visível apenas à equipe Giobbi's para verificação.</div>
            </>}
          </>}

          {/* ── STEP 7: Login ── */}
          {step===7 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Criar sua conta</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Esses dados serão usados para acessar o Giobbi's.</p>
            <Field label="E-mail" placeholder="seu@email.com" value={data.email} onChange={v=>set("email",v)} type="email" required />
            <div className="form-grid">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required helper={data.senha.length>0&&data.senha.length<8?"Muito curta":""} />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            <Div />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:14}}>Resumo do cadastro</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 24px" }}>
              {[
                ["Nome", data.nome],
                ["CPF", data.cpf],
                ["Nascimento", data.nascimento],
                ["Cidade", `${data.cidade}/${data.estado}`],
                ["Especialidades", `${data.specs.length} selecionadas`],
                ["Disponibilidade", `${data.dias.length} dias`],
                ["Foto", data.fotoRosto?"✓ Enviada":"—"],
                ["Documento", data.docTipo||"—"],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:12,color:C.navy,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <Alert type="info" style={{marginTop:16}}>Ao criar a conta você concorda com nossos <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong>.</Alert>
          </>}
        </div>

        {/* Footer nav */}
        <div style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===7?"Criar minha conta →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!canNext} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY REGISTRATION — 6 steps
// ═══════════════════════════════════════════════════════════════
function CompanyRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [unitCepLoading, setUnitCepLoading] = useState(false);
  const [data, setData] = useState({
    // step 1 — dados corporativos
    cnpj:"", razao:"", nomeFant:"", site:"", seg:"",
    // step 2 — endereço sede
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    // step 3 — responsável
    respNome:"", respCargo:"", respTel:"", respEmail:"",
    // step 4 — unidades
    unidades:[],
    // step 5 — como funciona (info only)
    // step 6 — login
    email:"", senha:"", confirma:"",
  });

  // Nova unidade em edição
  const [newUnit, setNewUnit] = useState({ nome:"", cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"" });
  const setU = (k,v) => setNewUnit(u=>({...u,[k]:v}));

  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const senhaError = data.confirma && data.senha !== data.confirma ? "Senhas não coincidem" : "";

  const handleCEP = async (raw) => {
    const masked = maskCEP(raw);
    set("cep",masked);
    if(masked.replace(/\D/g,"").length===8){
      setCepLoading(true);
      const addr = await lookupCEP(masked);
      setCepLoading(false);
      if(addr) setData(d=>({...d,rua:addr.rua,bairro:addr.bairro,cidade:addr.cidade,estado:addr.estado}));
    }
  };

  const handleUnitCEP = async (raw) => {
    const masked = maskCEP(raw);
    setU("cep",masked);
    if(masked.replace(/\D/g,"").length===8){
      setUnitCepLoading(true);
      const addr = await lookupCEP(masked);
      setUnitCepLoading(false);
      if(addr) setNewUnit(u=>({...u,rua:addr.rua,bairro:addr.bairro,cidade:addr.cidade,estado:addr.estado}));
    }
  };

  const addUnit = () => {
    if(!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero) return;
    setData(d=>({...d,unidades:[...d.unidades,{...newUnit,id:Date.now()}]}));
    setNewUnit({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  };

  const removeUnit = (id) => setData(d=>({...d,unidades:d.unidades.filter(u=>u.id!==id)}));

  const canNext = {
    1: data.cnpj.replace(/\D/g,"").length===14 && data.razao && data.seg,
    2: data.cep && data.rua && data.numero && data.bairro && data.cidade,
    3: data.respNome && data.respCargo && data.respTel.replace(/\D/g,"").length>=10 && data.respEmail,
    4: true,
    5: true,
    6: data.email && data.senha.length>=8 && !senhaError,
  }[step];

  const next = () => step<6 ? setStep(s=>s+1) : onDone(data);
  const back = () => step>1 ? setStep(s=>s-1) : onBack();
  const LABELS = ["Dados corporativos","Endereço sede","Responsável","Unidades de trabalho","Como funciona","Criar conta"];

  return (
    <div style={{ minHeight:"90vh", padding:"32px 20px 80px", background:C.bg }}>
      <div style={{ maxWidth:620, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <button onClick={back} style={{ ...B, fontSize:13, color:C.sub, background:"none", border:"none", cursor:"pointer" }}>
            ← {step>1?"Voltar":"Cancelar"}
          </button>
          <Prog step={step} total={6} />
        </div>
        <div style={{ ...B, fontSize:12, color:C.muted, marginBottom:20 }}>{LABELS[step-1]}</div>

        <div className="fu" key={step} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"32px 36px", boxShadow:"0 2px 16px rgba(0,0,0,.05)" }}>

          {/* ── STEP 1: Dados corporativos ── */}
          {step===1 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dados da empresa</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Usaremos o CNPJ para verificar sua empresa na Receita Federal.</p>
            <div className="form-grid">
              <Field label="CNPJ" placeholder="00.000.000/0000-00" value={data.cnpj} onChange={v=>set("cnpj",maskCNPJ(v))} maxLength={18} required helper="Será validado automaticamente" />
              <Field label="Nome fantasia" placeholder="Como aparece no sistema" value={data.nomeFant} onChange={v=>set("nomeFant",v)} />
            </div>
            <Field label="Razão social" placeholder="Nome Fantasia Ltda." value={data.razao} onChange={v=>set("razao",v)} required />
            <Field label="Site" placeholder="https://www.suaempresa.com.br" value={data.site} onChange={v=>set("site",v)} helper="Opcional, mas ajuda na credibilidade" />
            <div>
              <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:8}}>Segmento <span style={{color:C.red}}>*</span></label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {SEGS.map(s=>(
                  <div key={s} onClick={()=>set("seg",s)} style={{padding:"7px 14px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${data.seg===s?C.green:C.border2}`,background:data.seg===s?C.greenBg:"transparent",...B,fontSize:13,fontWeight:data.seg===s?600:400,color:data.seg===s?C.green:C.sub,transition:"all .15s"}}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── STEP 2: Endereço sede ── */}
          {step===2 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Endereço da sede</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Endereço principal da empresa. As unidades onde as vagas serão publicadas serão cadastradas no próximo passo.</p>
            <div className="form-grid">
              <Field label="CEP" placeholder="00000-000" value={data.cep} onChange={handleCEP} maxLength={9} required helper={cepLoading?"Buscando endereço...":""} />
              <Field label="Número" placeholder="1000" value={data.numero} onChange={v=>set("numero",v)} required />
            </div>
            {cepLoading && <Alert type="info">Buscando endereço pelo CEP...</Alert>}
            <Field label="Rua / Avenida" placeholder="Será preenchido pelo CEP" value={data.rua} onChange={v=>set("rua",v)} required />
            <div className="form-grid">
              <Field label="Bairro" placeholder="Bela Vista" value={data.bairro} onChange={v=>set("bairro",v)} required />
              <Field label="Complemento" placeholder="Sala 301, Andar 10" value={data.complemento} onChange={v=>set("complemento",v)} />
            </div>
            <div className="form-grid">
              <Field label="Cidade" placeholder="São Paulo" value={data.cidade} onChange={v=>set("cidade",v)} required />
              <Field label="Estado" placeholder="SP" value={data.estado} onChange={v=>set("estado",v)} />
            </div>
          </>}

          {/* ── STEP 3: Responsável ── */}
          {step===3 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Responsável pelas contratações</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Quem vai gerenciar as vagas e as contratações na plataforma. Pode ser o dono, gerente de RH ou operações.</p>
            <Field label="Nome completo" placeholder="Maria Souza" value={data.respNome} onChange={v=>set("respNome",v)} required />
            <Field label="Cargo" placeholder="Gerente de Operações" value={data.respCargo} onChange={v=>set("respCargo",v)} required />
            <div className="form-grid">
              <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.respTel} onChange={v=>set("respTel",maskPhone(v))} type="tel" maxLength={15} required helper="Para comunicação urgente" />
              <Field label="E-mail direto" placeholder="maria@empresa.com.br" value={data.respEmail} onChange={v=>set("respEmail",v)} type="email" required />
            </div>
            <Alert type="info">Esse contato ficará vinculado à conta e será usado para notificações de candidaturas e confirmações de turno.</Alert>
          </>}

          {/* ── STEP 4: Unidades ── */}
          {step===4 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Unidades de trabalho</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Cada vaga será vinculada a uma unidade. O colaborador verá a distância até aquele endereço específico.</p>

            {/* Unidades adicionadas */}
            {data.unidades.map((u,i)=>(
              <div key={u.id} className="unit-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:4}}>{u.nome}</div>
                    <div style={{...B,fontSize:13,color:C.sub}}>{u.rua}, {u.numero} — {u.bairro}, {u.cidade}/{u.estado}</div>
                    {u.complemento&&<div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>{u.complemento}</div>}
                  </div>
                  <button onClick={()=>removeUnit(u.id)} style={{background:C.redBg,border:`1px solid #FECACA`,borderRadius:7,padding:"5px 10px",cursor:"pointer",...B,fontSize:12,color:C.red}}>Remover</button>
                </div>
              </div>
            ))}

            {/* Formulário nova unidade */}
            <div style={{background:C.bg,border:`1.5px dashed ${C.border2}`,borderRadius:14,padding:24}}>
              <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:16}}>
                {data.unidades.length===0?"Adicionar primeira unidade":"Adicionar nova unidade"}
              </div>
              <Field label="Nome da unidade" placeholder="Ex: Loja Lapa, CD Guarulhos, Filial Centro" value={newUnit.nome} onChange={v=>setU("nome",v)} />
              <div className="form-grid">
                <Field label="CEP" placeholder="00000-000" value={newUnit.cep} onChange={handleUnitCEP} maxLength={9} helper={unitCepLoading?"Buscando...":""} />
                <Field label="Número" placeholder="1000" value={newUnit.numero} onChange={v=>setU("numero",v)} />
              </div>
              {unitCepLoading && <Alert type="info">Buscando endereço...</Alert>}
              <Field label="Rua / Avenida" placeholder="Preenchido pelo CEP" value={newUnit.rua} onChange={v=>setU("rua",v)} />
              <div className="form-grid">
                <Field label="Bairro" placeholder="Centro" value={newUnit.bairro} onChange={v=>setU("bairro",v)} />
                <Field label="Complemento" placeholder="Galpão 3" value={newUnit.complemento} onChange={v=>setU("complemento",v)} />
              </div>
              <div className="form-grid">
                <Field label="Cidade" placeholder="São Paulo" value={newUnit.cidade} onChange={v=>setU("cidade",v)} />
                <Field label="Estado" placeholder="SP" value={newUnit.estado} onChange={v=>setU("estado",v)} />
              </div>
              <Btn
                label="+ Adicionar unidade"
                variant={newUnit.nome&&newUnit.cep&&newUnit.rua&&newUnit.numero?"primary":"ghost"}
                size="md"
                onClick={addUnit}
                disabled={!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero}
              />
            </div>

            {data.unidades.length===0 && (
              <Alert type="warning" style={{marginTop:16}}>Adicione ao menos uma unidade para publicar vagas. Você pode adicionar mais depois.</Alert>
            )}
            {data.unidades.length>0 && (
              <Alert type="success" style={{marginTop:16}}>{data.unidades.length} unidade{data.unidades.length>1?"s":""} cadastrada{data.unidades.length>1?"s":""}. Você pode adicionar mais depois.</Alert>
            )}
          </>}

          {/* ── STEP 5: Como funciona ── */}
          {step===5 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Como o Giobbi's funciona</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Antes de finalizar, entenda como a plataforma funciona para sua empresa.</p>
            {[
              {icon:"👁",t:"Você escolhe quem trabalha",d:"No Talent Browser você vê os perfis verificados disponíveis na sua região, filtra por especialidade e convida quem quiser."},
              {icon:"📋",t:"Publique vagas por unidade",d:"Cada vaga é vinculada a uma das suas unidades. Colaboradores veem a distância exata até aquele local."},
              {icon:"🔒",t:"Perfis verificados pela Giobbi's",d:"Todos os colaboradores têm documentos e identidade conferidos antes de aparecerem na plataforma."},
              {icon:"⭐",t:"Avaliação bidirecional",d:"Ao final de cada turno, empresa e colaborador se avaliam. Isso garante qualidade crescente nos dois lados."},
              {icon:"💳",t:"Modelo simples de cobrança",d:"Sem mensalidade obrigatória. Você paga apenas pelo que usar, conforme o plano escolhido."},
              {icon:"⚖️",t:"Você é o contratante",d:"O Giobbi's é um marketplace de conexão. O vínculo de trabalho é entre sua empresa e o colaborador, com total autonomia de ambos."},
            ].map(({icon,t,d})=>(
              <div key={t} style={{display:"flex",gap:14,marginBottom:18,paddingBottom:18,borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:40,height:40,borderRadius:10,background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{t}</div>
                  <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65}}>{d}</div>
                </div>
              </div>
            ))}
          </>}

          {/* ── STEP 6: Login ── */}
          {step===6 && <>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Criar conta da empresa</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:24,lineHeight:1.65}}>Esses dados serão usados para acessar o painel da empresa no Giobbi's.</p>
            <Field label="E-mail de acesso" placeholder="acesso@empresa.com.br" value={data.email} onChange={v=>set("email",v)} type="email" required helper="Pode ser diferente do e-mail do responsável" />
            <div className="form-grid">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            <Div />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:14}}>Resumo do cadastro</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 24px" }}>
              {[
                ["Empresa", data.nomeFant||data.razao],
                ["CNPJ", data.cnpj],
                ["Segmento", data.seg],
                ["Sede", `${data.cidade}/${data.estado}`],
                ["Responsável", data.respNome],
                ["Cargo", data.respCargo],
                ["Unidades", `${data.unidades.length} cadastrada${data.unidades.length!==1?"s":""}`],
                ["WhatsApp", data.respTel],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:12,color:C.navy,fontWeight:600}}>{v||"—"}</span>
                </div>
              ))}
            </div>
            <Alert type="info" style={{marginTop:16}}>Ao criar a conta você concorda com os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> do Giobbi's.</Alert>
          </>}
        </div>

        <div style={{ marginTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===6?"Cadastrar empresa →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!canNext} />
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
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:48,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",animation:"popIn .4s ease both",overflow:"hidden"}}>
          {data?.fotoRosto?<img src={data.fotoRosto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:42,color:"#fff"}}>✓</span>}
        </div>
        <h2 style={{...H,fontSize:36,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Cadastro enviado,<br />{data?.nome?.split(" ")[0]}!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:24}}>
          Nossa equipe vai revisar suas informações e documento. Em até <strong style={{color:C.green}}>48 horas úteis</strong> você receberá um e-mail confirmando a aprovação.
        </p>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 24px",marginBottom:24,textAlign:"left"}}>
          <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>O que acontece agora?</div>
          {[
            ["1","Análise do documento","Nossa equipe verifica a selfie com documento enviada"],
            ["2","Aprovação do perfil","Você recebe um e-mail confirmando a aprovação"],
            ["3","Acesso às vagas","Seu perfil fica visível para empresas e você pode se candidatar"],
          ].map(([n,t,d])=>(
            <div key={n} style={{display:"flex",gap:12,marginBottom:14}}>
              <div style={{width:26,height:26,borderRadius:6,background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{...H,fontSize:12,fontWeight:800,color:C.green}}>{n}</span>
              </div>
              <div>
                <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{t}</div>
                <div style={{...B,fontSize:12,color:C.muted,lineHeight:1.5}}>{d}</div>
              </div>
            </div>
          ))}
        </div>
        <Btn label="Ver vagas disponíveis" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

function CompanySuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:48,background:C.greenBg,border:`3px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 24px",animation:"popIn .4s ease both"}}>🏢</div>
        <h2 style={{...H,fontSize:36,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Empresa cadastrada!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:24}}>
          <strong style={{color:C.navy}}>{data?.nomeFant||data?.razao}</strong> está cadastrada. Em breve você terá acesso ao Talent Browser e poderá publicar suas primeiras vagas.
        </p>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 24px",marginBottom:24,textAlign:"left"}}>
          <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>Unidades cadastradas</div>
          {data?.unidades?.length>0?data.unidades.map((u,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:10,padding:"10px 12px",background:C.greenBg,borderRadius:9,border:`1px solid ${C.greenBorder}`}}>
              <span style={{color:C.green}}>📍</span>
              <div>
                <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{u.nome}</div>
                <div style={{...B,fontSize:12,color:C.sub}}>{u.rua}, {u.numero} — {u.cidade}/{u.estado}</div>
              </div>
            </div>
          )):<div style={{...B,fontSize:13,color:C.muted}}>Nenhuma unidade cadastrada ainda. Adicione pelo painel.</div>}
        </div>
        <Btn label="Abrir Talent Browser →" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH SCREEN
// ═══════════════════════════════════════════════════════════════
function AuthScreen({ type, onLogin, onRegister, onBack }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const isW = type==="worker";
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <button onClick={onBack} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:24}}>← Voltar</button>
        <SL>{isW?"Área do Colaborador":"Área da Empresa"}</SL>
        <h2 style={{...H,fontSize:32,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:28}}>Bem-vindo<br />de volta.</h2>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="seu@email.com" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          <Btn label="Entrar →" variant="primary" size="lg" full onClick={()=>email&&pass&&onLogin()} />
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"18px 0"}}>
            <div style={{flex:1,height:1,background:C.border}} /><span style={{...B,fontSize:12,color:C.muted}}>ou</span><div style={{flex:1,height:1,background:C.border}} />
          </div>
          <Btn label={isW?"Criar conta gratuitamente →":"Cadastrar minha empresa →"} variant="ghost" size="lg" full onClick={onRegister} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function GiobbisApp() {
  const [screen,  setScreen]  = useState("home");
  const [wData,   setWData]   = useState(null);
  const [cData,   setCData]   = useState(null);

  const userType = screen==="worker-app"?"worker":screen==="company-app"?"company":null;
  const userName = userType==="worker"?wData?.nome?.split(" ")[0]:userType==="company"?(cData?.nomeFant||cData?.razao):null;

  return (
    <>
      <GlobalStyles />
      <Header onNav={setScreen} user={userName} type={userType} />
      {screen==="home"             && <Landing         onNav={setScreen} />}
      {screen==="auth-choice"      && <Landing         onNav={setScreen} />}
      {screen==="worker-auth"      && <AuthScreen      type="worker"  onBack={()=>setScreen("home")} onLogin={()=>setScreen("worker-app")} onRegister={()=>setScreen("worker-register")} />}
      {screen==="worker-register"  && <WorkerRegister  onBack={()=>setScreen("worker-auth")} onDone={d=>{setWData(d);setScreen("worker-success");}} />}
      {screen==="worker-success"   && <WorkerSuccess   data={wData} onEnter={()=>setScreen("home")} />}
      {screen==="worker-app"       && <Landing         onNav={setScreen} />}
      {screen==="company-auth"     && <AuthScreen      type="company" onBack={()=>setScreen("home")} onLogin={()=>setScreen("company-app")} onRegister={()=>setScreen("company-register")} />}
      {screen==="company-register" && <CompanyRegister onBack={()=>setScreen("company-auth")} onDone={d=>{setCData(d);setScreen("company-success");}} />}
      {screen==="company-success"  && <CompanySuccess  data={cData} onEnter={()=>setScreen("home")} />}
      {screen==="company-app"      && <Landing         onNav={setScreen} />}
    </>
  );
}
