import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── GLOBAL STYLES ─────────────────────────────────────────────
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=general-sans@400,500,600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      html{scroll-behavior:smooth}
      body{background:#F8FAFC;color:#0A1628;font-family:'General Sans',sans-serif;-webkit-font-smoothing:antialiased}
      input,textarea,select,button{font-family:inherit}
      input::placeholder,textarea::placeholder{color:#9CA3AF}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#F1F5F9}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
      .wrap{max-width:1160px;margin:0 auto;padding:0 32px}
      @media(max-width:768px){.wrap{padding:0 16px}}
      .g2{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
      .g3{display:grid;grid-template-columns:1fr 1fr 80px;gap:0 12px}
      @media(max-width:600px){.g2,.g3{grid-template-columns:1fr}}
      .hdr{position:sticky;top:0;z-index:300;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border-bottom:1px solid #E2E8F0;height:60px;display:flex;align-items:center}
      .chip{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:9px;cursor:pointer;border:1.5px solid #CBD5E1;background:transparent;transition:all .15s;user-select:none}
      .chip.on{border-color:#16A34A;background:#F0FDF4}
      .day-chip{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 10px;border-radius:9px;cursor:pointer;border:1.5px solid #CBD5E1;background:#fff;transition:all .15s;min-width:52px}
      .day-chip.on{border-color:#16A34A;background:#F0FDF4}
      .shift-chip{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 10px;border-radius:10px;cursor:pointer;border:1.5px solid #CBD5E1;background:#fff;transition:all .15s}
      .shift-chip.on{border-color:#16A34A;background:#F0FDF4}
      .upload-zone{border:2px dashed #CBD5E1;border-radius:14px;padding:40px 24px;text-align:center;cursor:pointer;transition:all .2s}
      .upload-zone:hover,.upload-zone.has{border-color:#16A34A;background:#F0FDF4}
      .upload-zone.has{border-style:solid}
      .card-h{transition:border-color .18s,box-shadow .18s;cursor:pointer}
      .card-h:hover{border-color:#16A34A!important;box-shadow:0 4px 16px rgba(22,163,74,.08)}
      .admin-item{display:flex;align-items:center;gap:11px;padding:10px 14px;cursor:pointer;border-radius:9px;margin:2px 8px;transition:all .15s}
      .admin-item:hover,.admin-item.active{background:#F0FDF4}
      .admin-item.active span{color:#16A34A;font-weight:600}
      .status-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes popIn{0%{transform:scale(.88);opacity:0}70%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      .fu{animation:fadeUp .35s ease both}
      .prog{display:flex;gap:4px;align-items:center}
      .prog-s{height:4px;border-radius:2px;transition:all .3s}
      input:focus,select:focus,textarea:focus{outline:none;border-color:#16A34A!important}
    `;
    document.head.appendChild(s);
    document.body.style.overflowX = "hidden";
  }, []);
  return null;
}

// ─── TOKENS ────────────────────────────────────────────────────
const C = {
  bg:"#F8FAFC", white:"#FFFFFF",
  border:"#E2E8F0", border2:"#CBD5E1",
  navy:"#0A1628",
  green:"#16A34A", greenBg:"#F0FDF4", greenBorder:"#BBF7D0",
  blue:"#2563EB", blueBg:"#EFF6FF", blueBorder:"#BFDBFE",
  red:"#DC2626", redBg:"#FEF2F2", redBorder:"#FECACA",
  amber:"#D97706", amberBg:"#FFFBEB", amberBorder:"#FDE68A",
  text:"#0A1628", sub:"#475569", muted:"#94A3B8",
};
const H = { fontFamily:"'Cabinet Grotesk', sans-serif" };
const B = { fontFamily:"'General Sans', sans-serif" };

// ─── MASKS & VALIDATORS ────────────────────────────────────────
const maskCPF   = v => v.replace(/\D/g,"").slice(0,11).replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
const maskCNPJ  = v => v.replace(/\D/g,"").slice(0,14).replace(/(\d{2})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1/$2").replace(/(\d{4})(\d{1,2})$/,"$1-$2");
const maskPhone = v => { const d=v.replace(/\D/g,"").slice(0,11); return d.length<=10?d.replace(/(\d{2})(\d{4})(\d{0,4})/,"($1) $2-$3"):d.replace(/(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3"); };
const maskCEP   = v => v.replace(/\D/g,"").slice(0,8).replace(/(\d{5})(\d{1,3})/,"$1-$2");

const validateCPF = cpf => {
  const d = cpf.replace(/\D/g,"");
  if(d.length!==11||/^(\d)\1+$/.test(d)) return false;
  let s=0; for(let i=0;i<9;i++) s+=parseInt(d[i])*(10-i);
  let r=11-(s%11); if(r>=10)r=0; if(r!==parseInt(d[9])) return false;
  s=0; for(let i=0;i<10;i++) s+=parseInt(d[i])*(11-i);
  r=11-(s%11); if(r>=10)r=0; return r===parseInt(d[10]);
};
const validateAge = ds => {
  if(!ds) return false;
  const b=new Date(ds),t=new Date();
  return t.getFullYear()-b.getFullYear()-(t<new Date(t.getFullYear(),b.getMonth(),b.getDate())?1:0)>=18;
};

const lookupCEP = async cep => {
  const d = cep.replace(/\D/g,"");
  if(d.length!==8) return null;
  try { const r=await fetch(`https://viacep.com.br/ws/${d}/json/`); const j=await r.json(); if(j.erro) return null; return {rua:j.logradouro,bairro:j.bairro,cidade:j.localidade,estado:j.uf}; }
  catch { return null; }
};

// ─── PRIMITIVES ────────────────────────────────────────────────
const Btn = ({ label, onClick, disabled, variant="primary", size="md", full=false, loading=false }) => {
  const vs = {
    primary: { background:disabled||loading?"#CBD5E1":C.green, color:"#fff", border:"none" },
    ghost:   { background:"transparent", color:C.sub, border:`1.5px solid ${C.border2}` },
    outline: { background:"transparent", color:C.green, border:`1.5px solid ${C.green}` },
    navy:    { background:C.navy, color:"#fff", border:"none" },
    white:   { background:"#fff", color:C.navy, border:`1.5px solid ${C.border2}` },
    danger:  { background:C.redBg, color:C.red, border:`1px solid ${C.redBorder}` },
    approve: { background:C.greenBg, color:C.green, border:`1px solid ${C.greenBorder}` },
    amber:   { background:C.amberBg, color:C.amber, border:`1px solid ${C.amberBorder}` },
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
      {loading&&<span style={{width:13,height:13,borderRadius:7,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin .7s linear infinite",display:"inline-block"}} />}
      {label}
    </button>
  );
};

const Field = ({ label, placeholder, value, onChange, type="text", hint, maxLength, required, helper, disabled }) => (
  <div style={{ marginBottom:16 }}>
    {label&&<label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>
      {label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}
    </label>}
    <input type={type} placeholder={placeholder} value={value} maxLength={maxLength} disabled={disabled}
      onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${hint?C.red:C.border2}`,background:disabled?"#F8FAFC":"#fff",...B,fontSize:14,color:disabled?C.muted:C.text,transition:"border-color .2s"}} />
    {hint&&<div style={{...B,fontSize:11,color:C.red,marginTop:5}}>⚠ {hint}</div>}
    {helper&&!hint&&<div style={{...B,fontSize:11,color:C.muted,marginTop:5}}>{helper}</div>}
  </div>
);

const SL = ({ children }) => (
  <div style={{...B,fontSize:11,fontWeight:700,color:C.green,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{children}</div>
);
const Div = () => <div style={{height:1,background:C.border,margin:"20px 0"}} />;
const Prog = ({ step, total }) => (
  <div className="prog">
    {Array.from({length:total}).map((_,i)=><div key={i} className="prog-s" style={{background:i<step?C.green:C.border2,width:i<step?26:12}} />)}
    <span style={{...B,fontSize:12,color:C.muted,marginLeft:8}}>{step} de {total}</span>
  </div>
);
const Alert = ({ type="info", children }) => {
  const t={info:{bg:C.blueBg,border:C.blueBorder,color:C.blue,icon:"ℹ"},warning:{bg:C.amberBg,border:C.amberBorder,color:C.amber,icon:"⚠"},success:{bg:C.greenBg,border:C.greenBorder,color:C.green,icon:"✓"},error:{bg:C.redBg,border:C.redBorder,color:C.red,icon:"✕"}}[type];
  return <div style={{background:t.bg,border:`1px solid ${t.border}`,borderRadius:10,padding:"12px 16px",display:"flex",gap:10,marginBottom:14,marginTop:4}}><span style={{color:t.color,fontWeight:700,flexShrink:0}}>{t.icon}</span><div style={{...B,fontSize:13,color:t.color,lineHeight:1.65}}>{children}</div></div>;
};
const Badge = ({ status }) => {
  const cfg={
    pending: {label:"Pendente",  bg:C.amberBg, color:C.amber,  icon:"⏳"},
    approved:{label:"Aprovado",  bg:C.greenBg, color:C.green,  icon:"✓"},
    rejected:{label:"Reprovado", bg:C.redBg,   color:C.red,    icon:"✕"},
    trial:   {label:"Trial",     bg:C.blueBg,  color:C.blue,   icon:"★"},
    paid:    {label:"Pago",      bg:C.greenBg, color:C.green,  icon:"💳"},
    overdue: {label:"Em atraso", bg:C.redBg,   color:C.red,    icon:"!"},
    inactive:{label:"Inativo",   bg:C.bg,      color:C.muted,  icon:"○"},
  }[status]||{label:status,bg:C.bg,color:C.muted,icon:"?"};
  return <span className="status-badge" style={{background:cfg.bg,color:cfg.color}}>{cfg.icon} {cfg.label}</span>;
};

// ─── DATA ──────────────────────────────────────────────────────
const SPECS = [
  {id:"pick",icon:"📦",label:"Picking"},{id:"rep",icon:"🏪",label:"Reposição"},
  {id:"caixa",icon:"💳",label:"Caixa"},{id:"estq",icon:"🏭",label:"Estoquista"},
  {id:"frios",icon:"❄️",label:"Frios"},{id:"hort",icon:"🥬",label:"Hortifruti"},
  {id:"log",icon:"🚛",label:"Logística"},{id:"pack",icon:"📫",label:"Embalador"},
  {id:"shopper",icon:"🛍",label:"Shopper"},{id:"padaria",icon:"🥖",label:"Padaria"},
];
const DAYS   = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const SHIFTS = [{id:"manha",icon:"🌅",label:"Manhã",sub:"06h–14h"},{id:"tarde",icon:"☀️",label:"Tarde",sub:"14h–22h"},{id:"noite",icon:"🌙",label:"Noite",sub:"22h–06h"}];
const SEGS   = ["Supermercado","Atacarejo","Dark Store","Centro de Distribuição","Delivery","Hortifruti","Farmácia","Indústria FMCG","Distribuidor","Outro"];
const PLANS  = ["Trial (30 dias)","Básico — R$ 299/mês","Profissional — R$ 599/mês","Enterprise — R$ 1.299/mês"];

// ─── SUPABASE FUNCTIONS ────────────────────────────────────────
const saveCompany = async (data) => {
  const { data: company, error } = await supabase
    .from("companies")
    .insert({
      cnpj: data.cnpj, razao: data.razao, nome_fant: data.nomeFant,
      site: data.site, seg: data.seg,
      cep: data.cep, rua: data.rua, numero: data.numero, complemento: data.complemento,
      bairro: data.bairro, cidade: data.cidade, estado: data.estado,
      resp_nome: data.respNome, resp_cargo: data.respCargo,
      resp_tel: data.respTel, resp_email: data.respEmail,
      email: data.email, status: "pending", pay_status: "trial", plan: "Trial (30 dias)",
    })
    .select().single();
  if(error) throw error;

  if(data.unidades.length > 0) {
    await supabase.from("company_units").insert(
      data.unidades.map(u => ({
        company_id: company.id,
        nome: u.nome, cep: u.cep, rua: u.rua, numero: u.numero,
        complemento: u.complemento, bairro: u.bairro, cidade: u.cidade, estado: u.estado,
      }))
    );
  }
  return company;
};

const saveWorker = async (data) => {
  const { data: worker, error } = await supabase
    .from("workers")
    .insert({
      nome: data.nome, cpf: data.cpf, nascimento: data.nascimento, telefone: data.telefone,
      cep: data.cep, rua: data.rua, numero: data.numero, complemento: data.complemento,
      bairro: data.bairro, cidade: data.cidade, estado: data.estado,
      specs: data.specs, dias: data.dias, turnos: data.turnos,
      doc_tipo: data.docTipo, email: data.email, status: "pending",
    })
    .select().single();
  if(error) throw error;
  return worker;
};

const fetchCompanies = async () => {
  const { data, error } = await supabase
    .from("companies")
    .select("*, company_units(*)")
    .order("created_at", { ascending: false });
  if(error) throw error;
  return data;
};

const fetchWorkers = async () => {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false });
  if(error) throw error;
  return data;
};

const updateCompanyDB = async (id, changes) => {
  const { error } = await supabase.from("companies").update(changes).eq("id", id);
  if(error) throw error;
};

const updateWorkerDB = async (id, changes) => {
  const { error } = await supabase.from("workers").update(changes).eq("id", id);
  if(error) throw error;
};

// ─── ADDRESS BLOCK ─────────────────────────────────────────────
function AddressBlock({ data, setData, loading, setLoading }) {
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const handleCEP = async raw => {
    const masked = maskCEP(raw);
    set("cep", masked);
    if(masked.replace(/\D/g,"").length===8) {
      setLoading(true);
      const addr = await lookupCEP(masked);
      setLoading(false);
      if(addr) setData(d=>({...d,rua:addr.rua,bairro:addr.bairro,cidade:addr.cidade,estado:addr.estado}));
    }
  };
  return (
    <>
      <Field label="CEP" placeholder="00000-000" value={data.cep||""} onChange={handleCEP} maxLength={9} required helper={loading?"🔍 Buscando endereço...":""} />
      {loading&&<Alert type="info">Preenchendo endereço automaticamente...</Alert>}
      <Field label="Rua / Avenida" placeholder="Preenchida pelo CEP" value={data.rua||""} onChange={v=>set("rua",v)} required />
      <div className="g2">
        <Field label="Número" placeholder="Ex: 1042" value={data.numero||""} onChange={v=>set("numero",v)} required />
        <Field label="Complemento" placeholder="Sala, Andar, Bloco..." value={data.complemento||""} onChange={v=>set("complemento",v)} />
      </div>
      <div className="g3">
        <Field label="Bairro" placeholder="Centro" value={data.bairro||""} onChange={v=>set("bairro",v)} required />
        <Field label="Cidade" placeholder="São Paulo" value={data.cidade||""} onChange={v=>set("cidade",v)} required />
        <Field label="UF" placeholder="SP" value={data.estado||""} onChange={v=>set("estado",v)} maxLength={2} />
      </div>
    </>
  );
}

// ─── HEADER ────────────────────────────────────────────────────
function Header({ onNav, user, type }) {
  return (
    <header className="hdr">
      <div className="wrap" style={{width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div onClick={()=>onNav("home")} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
            <div style={{width:32,height:32,background:C.green,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
            <span style={{...H,fontSize:19,fontWeight:900,color:C.navy,letterSpacing:-.4}}>Giobbi's</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {!user?<>
              <Btn label="Entrar" variant="ghost" size="sm" onClick={()=>onNav("worker-auth")} />
              <Btn label="Cadastro Negócio" variant="primary" size="sm" onClick={()=>onNav("company-register")} />
              <Btn label="Admin" variant="white" size="sm" onClick={()=>onNav("admin-login")} />
            </>:<>
              <span style={{...B,fontSize:13,color:C.sub}}>Olá, {user}</span>
              <Btn label="Sair" variant="ghost" size="sm" onClick={()=>onNav("home")} />
            </>}
          </div>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════
function Landing({ onNav }) {
  return (
    <div style={{minHeight:"80vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px"}}>
      <div style={{maxWidth:620,width:"100%",textAlign:"center"}}>
        <div style={{...B,fontSize:11,fontWeight:700,color:C.green,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>Especialistas em varejo</div>
        <h1 style={{...H,fontSize:"clamp(38px,6vw,68px)",fontWeight:900,color:C.navy,letterSpacing:-2,lineHeight:.95,marginBottom:20}}>O parceiro certo,<br />no momento certo.</h1>
        <p style={{...B,fontSize:17,color:C.sub,lineHeight:1.75,marginBottom:44,maxWidth:480,margin:"0 auto 44px"}}>
          Conectamos empresas de varejo a colaboradores verificados e qualificados, de forma rápida e sem burocracia.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Btn label="Cadastro Negócio →" variant="primary" size="xl" onClick={()=>onNav("company-register")} />
          <Btn label="Sou colaborador →"  variant="white"   size="xl" onClick={()=>onNav("worker-register")} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:56,paddingTop:40,borderTop:`1px solid ${C.border}`}}>
          {[{v:"+1.000",l:"Estabelecimentos"},{v:"+300k",l:"Horas realizadas"},{v:"+60",l:"Cidades"},{v:"4,9★",l:"Avaliação média"}].map(({v,l})=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{...H,fontSize:"clamp(22px,3vw,32px)",fontWeight:900,color:C.green}}>{v}</div>
              <div style={{...B,fontSize:13,color:C.muted,marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY REGISTER — 6 steps
// ═══════════════════════════════════════════════════════════════
function CompanyRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [uCepLoading, setUCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState({
    cnpj:"", razao:"", nomeFant:"", site:"", seg:"",
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    respNome:"", respCargo:"", respTel:"", respEmail:"",
    unidades:[],
    email:"", senha:"", confirma:"",
  });
  const [newUnit, setNewUnit] = useState({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const senhaError = data.confirma&&data.senha!==data.confirma?"Senhas não coincidem":"";

  const addUnit = () => {
    if(!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero) return;
    setData(d=>({...d,unidades:[...d.unidades,{...newUnit,id:Date.now()}]}));
    setNewUnit({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  };

  const canNext = {
    1: data.cnpj.replace(/\D/g,"").length===14&&data.razao&&data.seg,
    2: data.cep&&data.rua&&data.numero&&data.bairro&&data.cidade,
    3: data.respNome&&data.respCargo&&data.respTel.replace(/\D/g,"").length>=10&&data.respEmail,
    4: true, 5: true,
    6: data.email&&data.senha.length>=8&&!senhaError,
  }[step];

  const next = async () => {
    if(step < 6) { setStep(s=>s+1); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const saved = await saveCompany(data);
      onDone({ ...data, id: saved.id });
    } catch(e) {
      setSubmitError(e.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };
  const back = () => step>1?setStep(s=>s-1):onBack();
  const LABELS = ["Dados corporativos","Endereço da sede","Responsável","Unidades de trabalho","Como funciona","Criar conta"];

  return (
    <div style={{minHeight:"90vh",padding:"32px 20px 80px",background:C.bg}}>
      <div style={{maxWidth:620,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={back} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer"}}>← {step>1?"Voltar":"Cancelar"}</button>
          <Prog step={step} total={6} />
        </div>
        <div style={{...B,fontSize:12,color:C.muted,marginBottom:20}}>{LABELS[step-1]}</div>

        <div className="fu" key={step} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px 36px",boxShadow:"0 2px 16px rgba(0,0,0,.05)"}}>

          {step===1&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dados da empresa</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Usaremos o CNPJ para verificar sua empresa na Receita Federal.</p>
            <div className="g2">
              <Field label="CNPJ" placeholder="00.000.000/0000-00" value={data.cnpj} onChange={v=>set("cnpj",maskCNPJ(v))} maxLength={18} required helper="Validado automaticamente" />
              <Field label="Nome fantasia" placeholder="Como aparece no sistema" value={data.nomeFant} onChange={v=>set("nomeFant",v)} />
            </div>
            <Field label="Razão social" placeholder="Nome Fantasia Ltda." value={data.razao} onChange={v=>set("razao",v)} required />
            <Field label="Site" placeholder="https://www.suaempresa.com.br" value={data.site} onChange={v=>set("site",v)} helper="Opcional — aumenta a credibilidade do cadastro" />
            <div>
              <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:8}}>Segmento <span style={{color:C.red}}>*</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SEGS.map(s=><div key={s} onClick={()=>set("seg",s)} style={{padding:"7px 14px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${data.seg===s?C.green:C.border2}`,background:data.seg===s?C.greenBg:"transparent",...B,fontSize:13,fontWeight:data.seg===s?600:400,color:data.seg===s?C.green:C.sub,transition:"all .15s"}}>{s}</div>)}
              </div>
            </div>
          </>}

          {step===2&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Endereço da sede</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Endereço principal da empresa. As unidades onde as vagas serão publicadas são configuradas no próximo passo.</p>
            <AddressBlock data={data} setData={setData} loading={cepLoading} setLoading={setCepLoading} />
          </>}

          {step===3&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Responsável pelas contratações</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Quem vai gerenciar as vagas e contratações.</p>
            <Field label="Nome completo" placeholder="Maria Souza" value={data.respNome} onChange={v=>set("respNome",v)} required />
            <Field label="Cargo" placeholder="Gerente de Operações" value={data.respCargo} onChange={v=>set("respCargo",v)} required />
            <div className="g2">
              <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.respTel} onChange={v=>set("respTel",maskPhone(v))} type="tel" maxLength={15} required />
              <Field label="E-mail direto" placeholder="maria@empresa.com.br" value={data.respEmail} onChange={v=>set("respEmail",v)} type="email" required />
            </div>
            <Alert type="info">Este contato receberá notificações de candidaturas e confirmações de turno.</Alert>
          </>}

          {step===4&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Unidades de trabalho</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Cada vaga será vinculada a uma unidade. O colaborador verá a distância exata até aquele endereço.</p>
            {data.unidades.map(u=>(
              <div key={u.id} style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:12,padding:"14px 18px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{u.nome}</div>
                  <div style={{...B,fontSize:12,color:C.sub,marginTop:2}}>{u.rua}, {u.numero} — {u.cidade}/{u.estado}</div>
                </div>
                <button onClick={()=>setData(d=>({...d,unidades:d.unidades.filter(x=>x.id!==u.id)}))}
                  style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:7,padding:"5px 10px",cursor:"pointer",...B,fontSize:12,color:C.red}}>Remover</button>
              </div>
            ))}
            <div style={{background:C.bg,border:`1.5px dashed ${C.border2}`,borderRadius:14,padding:22}}>
              <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>{data.unidades.length===0?"Adicionar primeira unidade":"+ Nova unidade"}</div>
              <Field label="Nome da unidade" placeholder="Ex: Loja Lapa, CD Guarulhos" value={newUnit.nome} onChange={v=>setNewUnit(u=>({...u,nome:v}))} />
              <AddressBlock data={newUnit} setData={setNewUnit} loading={uCepLoading} setLoading={setUCepLoading} />
              <Btn label="+ Adicionar unidade" variant={newUnit.nome&&newUnit.cep&&newUnit.rua&&newUnit.numero?"primary":"ghost"} size="md" onClick={addUnit} disabled={!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero} />
            </div>
            {data.unidades.length===0&&<Alert type="warning" style={{marginTop:14}}>Adicione ao menos uma unidade. Pode adicionar mais depois pelo painel.</Alert>}
            {data.unidades.length>0&&<Alert type="success" style={{marginTop:14}}>{data.unidades.length} unidade{data.unidades.length>1?"s":""} cadastrada{data.unidades.length>1?"s":""}.</Alert>}
          </>}

          {step===5&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Como o Giobbi's funciona</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Entenda como a plataforma funciona antes de finalizar.</p>
            {[
              {icon:"👁",t:"Você escolhe quem trabalha",d:"No Talent Browser você vê perfis verificados na sua região, filtra por especialidade e convida diretamente."},
              {icon:"📋",t:"Publique vagas por unidade",d:"Cada vaga é vinculada a uma de suas unidades. Colaboradores veem a distância exata."},
              {icon:"🔒",t:"Perfis verificados pela Giobbi's",d:"Todos os colaboradores têm documentos conferidos antes de aparecerem na plataforma."},
              {icon:"⭐",t:"Avaliação bidirecional",d:"Ao final de cada turno, empresa e colaborador se avaliam mutuamente."},
              {icon:"⚖️",t:"Você é o contratante",d:"O Giobbi's é um marketplace de conexão. O vínculo de trabalho é entre sua empresa e o colaborador."},
            ].map(({icon,t,d})=>(
              <div key={t} style={{display:"flex",gap:14,marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:40,height:40,borderRadius:10,background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{t}</div><div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65}}>{d}</div></div>
              </div>
            ))}
          </>}

          {step===6&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Criar conta</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Dados de acesso ao painel da empresa no Giobbi's.</p>
            <Field label="E-mail de acesso" placeholder="acesso@empresa.com.br" value={data.email} onChange={v=>set("email",v)} type="email" required />
            <div className="g2">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            <Div />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>Resumo do cadastro</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 24px"}}>
              {[["Empresa",data.nomeFant||data.razao],["CNPJ",data.cnpj],["Segmento",data.seg],["Sede",`${data.cidade}/${data.estado}`],["Responsável",data.respNome],["WhatsApp",data.respTel],["Unidades",`${data.unidades.length} cadastrada${data.unidades.length!==1?"s":""}`],["Site",data.site||"—"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:12,color:C.navy,fontWeight:600}}>{v||"—"}</span>
                </div>
              ))}
            </div>
            {submitError&&<Alert type="error" style={{marginTop:14}}>{submitError}</Alert>}
            <Alert type="info" style={{marginTop:14}}>Ao criar a conta você concorda com os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong> do Giobbi's.</Alert>
          </>}
        </div>

        <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===6?"Cadastrar empresa →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!canNext} loading={submitting} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORKER REGISTER — 7 steps
// ═══════════════════════════════════════════════════════════════
function WorkerRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState({
    nome:"", cpf:"", nascimento:"", telefone:"",
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    specs:[], dias:[], turnos:[],
    fotoRosto:null, docTipo:"", selfieDoc:null,
    email:"", senha:"", confirma:"",
  });
  const photoRef = useRef(); const selfieRef = useRef();
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const toggleArr = (k,v) => setData(d=>({...d,[k]:d[k].includes(v)?d[k].filter(x=>x!==v):[...d[k],v]}));
  const readFile = (file,key) => { const r=new FileReader(); r.onload=e=>set(key,e.target.result); r.readAsDataURL(file); };

  const cpfError   = data.cpf&&data.cpf.replace(/\D/g,"").length===11&&!validateCPF(data.cpf)?"CPF inválido":"";
  const ageError   = data.nascimento&&!validateAge(data.nascimento)?"É necessário ter 18 anos ou mais":"";
  const senhaError = data.confirma&&data.senha!==data.confirma?"Senhas não coincidem":"";

  const canNext = {
    1: data.nome&&data.cpf.replace(/\D/g,"").length===11&&validateCPF(data.cpf)&&data.nascimento&&validateAge(data.nascimento)&&data.telefone.replace(/\D/g,"").length>=10,
    2: data.cep&&data.rua&&data.numero&&data.bairro&&data.cidade,
    3: data.specs.length>=1,
    4: data.dias.length>=1&&data.turnos.length>=1,
    5: !!data.fotoRosto,
    6: !!data.docTipo&&!!data.selfieDoc,
    7: data.email&&data.senha.length>=8&&!senhaError,
  }[step];

  const next = async () => {
    if(step < 7) { setStep(s=>s+1); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const saved = await saveWorker(data);
      onDone({ ...data, id: saved.id });
    } catch(e) {
      setSubmitError(e.message || "Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };
  const back = ()=>step>1?setStep(s=>s-1):onBack();
  const LABELS = ["Dados pessoais","Endereço","Especialidades","Disponibilidade","Foto de perfil","Documento","Criar conta"];

  return (
    <div style={{minHeight:"90vh",padding:"32px 20px 80px",background:C.bg}}>
      <div style={{maxWidth:600,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={back} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer"}}>← {step>1?"Voltar":"Cancelar"}</button>
          <Prog step={step} total={7} />
        </div>
        <div style={{...B,fontSize:12,color:C.muted,marginBottom:20}}>{LABELS[step-1]}</div>

        <div className="fu" key={step} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px 36px",boxShadow:"0 2px 16px rgba(0,0,0,.05)"}}>

          {step===1&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dados pessoais</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Preencha com seus dados reais. Serão verificados pela equipe Giobbi's.</p>
            <Field label="Nome completo" placeholder="João da Silva" value={data.nome} onChange={v=>set("nome",v)} required />
            <div className="g2">
              <Field label="CPF" placeholder="000.000.000-00" value={data.cpf} onChange={v=>set("cpf",maskCPF(v))} maxLength={14} hint={cpfError} required helper="Será validado pelo sistema" />
              <Field label="Data de nascimento" value={data.nascimento} onChange={v=>set("nascimento",v)} type="date" hint={ageError} required helper="Mínimo 18 anos" />
            </div>
            <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.telefone} onChange={v=>set("telefone",maskPhone(v))} type="tel" maxLength={15} required />
            <Alert type="info">Todos os dados são tratados com sigilo e usados apenas para verificação.</Alert>
          </>}

          {step===2&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Seu endereço</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Usado para mostrar vagas próximas com a distância exata.</p>
            <AddressBlock data={data} setData={setData} loading={cepLoading} setLoading={setCepLoading} />
          </>}

          {step===3&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Suas especialidades</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Selecione tudo o que você já sabe fazer. Empresas filtram por especialidade.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:18}}>
              {SPECS.map(s=>{const on=data.specs.includes(s.id);return(
                <div key={s.id} className={`chip ${on?"on":""}`} onClick={()=>toggleArr("specs",s.id)}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <span style={{...B,fontSize:13,fontWeight:on?600:400,color:on?C.green:C.sub}}>{s.label}</span>
                  {on&&<span style={{color:C.green,fontSize:11}}>✓</span>}
                </div>
              );})}
            </div>
            {data.specs.length>0?<Alert type="success">{data.specs.length} especialidade{data.specs.length>1?"s":""} selecionada{data.specs.length>1?"s":""}.</Alert>:<Alert type="warning">Selecione ao menos uma especialidade.</Alert>}
          </>}

          {step===4&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Sua disponibilidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Quando você pode trabalhar. Pode atualizar a qualquer momento.</p>
            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:10}}>DIAS DA SEMANA</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:26}}>
              {DAYS.map(d=>{const on=data.dias.includes(d);return(
                <div key={d} className={`day-chip ${on?"on":""}`} onClick={()=>toggleArr("dias",d)}>
                  <span style={{...B,fontSize:12,fontWeight:600,color:on?C.green:C.sub}}>{d}</span>
                  {on&&<span style={{fontSize:10,color:C.green}}>✓</span>}
                </div>
              );})}
            </div>
            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:10}}>TURNO DE PREFERÊNCIA</div>
            <div style={{display:"flex",gap:10}}>
              {SHIFTS.map(sh=>{const on=data.turnos.includes(sh.id);return(
                <div key={sh.id} className={`shift-chip ${on?"on":""}`} onClick={()=>toggleArr("turnos",sh.id)}>
                  <span style={{fontSize:24}}>{sh.icon}</span>
                  <span style={{...H,fontSize:14,fontWeight:700,color:on?C.green:C.navy}}>{sh.label}</span>
                  <span style={{...B,fontSize:11,color:C.muted}}>{sh.sub}</span>
                  {on&&<span style={{...B,fontSize:11,color:C.green,fontWeight:600}}>✓</span>}
                </div>
              );})}
            </div>
          </>}

          {step===5&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Foto de perfil</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:18,lineHeight:1.65}}>Perfis com foto recebem muito mais convites.</p>
            <Alert type="info">Rosto visível, sem óculos escuros, fundo neutro, boa iluminação.</Alert>
            <div className={`upload-zone ${data.fotoRosto?"has":""}`} onClick={()=>photoRef.current?.click()}>
              {data.fotoRosto
                ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                  <img src={data.fotoRosto} alt="" style={{width:120,height:120,borderRadius:60,objectFit:"cover",border:`3px solid ${C.green}`}} />
                  <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Foto enviada</span>
                  <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                 </div>
                :<div><div style={{fontSize:48,marginBottom:12}}>📷</div><div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Clique para enviar sua foto</div><div style={{...B,fontSize:13,color:C.muted}}>JPG ou PNG · máx. 5MB</div></div>}
            </div>
            <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"fotoRosto");}} />
          </>}

          {step===6&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Documento de identidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:18,lineHeight:1.65}}>Selfie segurando o documento aberto para confirmar sua identidade.</p>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              {[["RG","🪪","Identidade"],["CNH","🚗","Habilitação"]].map(([t,ic,sub])=>(
                <div key={t} onClick={()=>set("docTipo",t)} style={{flex:1,background:data.docTipo===t?C.greenBg:"#fff",borderRadius:12,padding:"16px 14px",border:`2px solid ${data.docTipo===t?C.green:C.border2}`,textAlign:"center",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:30,marginBottom:7}}>{ic}</div>
                  <div style={{...H,fontSize:16,fontWeight:700,color:data.docTipo===t?C.green:C.navy}}>{t}</div>
                  <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
            {data.docTipo&&<>
              <Alert type="warning">
                <strong>Como tirar a selfie com {data.docTipo}:</strong><br />
                1. Segure o {data.docTipo} aberto na altura do rosto<br />
                2. Rosto e documento visíveis na mesma foto<br />
                3. Documento legível, sem reflexos<br />
                4. Boa iluminação, fundo simples
              </Alert>
              <div className={`upload-zone ${data.selfieDoc?"has":""}`} onClick={()=>selfieRef.current?.click()}>
                {data.selfieDoc
                  ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                    <img src={data.selfieDoc} alt="" style={{maxWidth:220,maxHeight:165,borderRadius:10,objectFit:"cover",border:`2px solid ${C.green}`}} />
                    <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Selfie enviada</span>
                    <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                   </div>
                  :<div><div style={{fontSize:48,marginBottom:12}}>🤳</div><div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Selfie segurando o {data.docTipo}</div><div style={{...B,fontSize:13,color:C.muted}}>Foto · máx. 10MB</div></div>}
              </div>
              <input ref={selfieRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"selfieDoc");}} />
              <div style={{...B,fontSize:11,color:C.muted,textAlign:"center",marginTop:8}}>🔒 Visível apenas à equipe Giobbi's.</div>
            </>}
          </>}

          {step===7&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Criar sua conta</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Dados de acesso ao Giobbi's.</p>
            <Field label="E-mail" placeholder="seu@email.com" value={data.email} onChange={v=>set("email",v)} type="email" required />
            <div className="g2">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            <Div />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>Resumo</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 24px"}}>
              {[["Nome",data.nome],["CPF",data.cpf],["Cidade",`${data.cidade}/${data.estado}`],["Especialidades",`${data.specs.length} selecionadas`],["Dias",`${data.dias.length} dias`],["Turnos",data.turnos.map(t=>SHIFTS.find(s=>s.id===t)?.label).join(", ")],["Foto","✓ Enviada"],["Documento",data.docTipo||"—"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:12,color:C.navy,fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            {submitError&&<Alert type="error" style={{marginTop:14}}>{submitError}</Alert>}
          </>}
        </div>

        <div style={{marginTop:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===7?"Criar minha conta →":"Continuar →"} variant="primary" size="lg" onClick={next} disabled={!canNext} loading={submitting} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SUCCESS SCREENS
// ═══════════════════════════════════════════════════════════════
function CompanySuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:48,background:C.greenBg,border:`3px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 24px",animation:"popIn .4s ease both"}}>🏢</div>
        <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Cadastro enviado!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:22}}>
          <strong style={{color:C.navy}}>{data?.nomeFant||data?.razao}</strong> está em análise. Nossa equipe entrará em contato em até <strong style={{color:C.green}}>24 horas úteis</strong>.
        </p>
        <Alert type="success">Cadastro salvo com sucesso no sistema Giobbi's! ✓</Alert>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:22,textAlign:"left"}}>
          <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:12}}>Unidades cadastradas</div>
          {data?.unidades?.length>0?data.unidades.map((u,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:10,paddingBottom:10,borderBottom:i<data.unidades.length-1?`1px solid ${C.border}`:"none"}}>
              <span style={{color:C.green}}>📍</span>
              <div>
                <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{u.nome}</div>
                <div style={{...B,fontSize:12,color:C.sub}}>{u.rua}, {u.numero} — {u.cidade}/{u.estado}</div>
              </div>
            </div>
          )):<div style={{...B,fontSize:13,color:C.muted}}>Nenhuma unidade cadastrada.</div>}
        </div>
        <Btn label="Voltar ao início" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

function WorkerSuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:48,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",animation:"popIn .4s ease both",overflow:"hidden"}}>
          {data?.fotoRosto?<img src={data.fotoRosto} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />:<span style={{fontSize:42,color:"#fff"}}>✓</span>}
        </div>
        <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Cadastro enviado,<br />{data?.nome?.split(" ")[0]}!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:22}}>
          Nossa equipe vai revisar seu documento. Em até <strong style={{color:C.green}}>48 horas úteis</strong> você receberá confirmação por e-mail.
        </p>
        <Alert type="success">Cadastro salvo com sucesso no sistema Giobbi's! ✓</Alert>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:22,textAlign:"left"}}>
          {[["1","Análise do documento","Revisamos a selfie com documento enviada"],["2","Aprovação do perfil","Você recebe e-mail confirmando a aprovação"],["3","Acesso às vagas","Seu perfil fica visível e você pode se candidatar"]].map(([n,t,d])=>(
            <div key={n} style={{display:"flex",gap:12,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:6,background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{...H,fontSize:12,fontWeight:800,color:C.green}}>{n}</span>
              </div>
              <div><div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{t}</div><div style={{...B,fontSize:12,color:C.muted,lineHeight:1.5}}>{d}</div></div>
            </div>
          ))}
        </div>
        <Btn label="Voltar ao início" variant="primary" size="xl" full onClick={onEnter} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN LOGIN
// ═══════════════════════════════════════════════════════════════
function AdminLogin({ onLogin }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  const handleLogin = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setLoading(false);
    if(email==="admin@giobbis.com"&&pass==="giobbis2024") onLogin();
    else setError("E-mail ou senha incorretos.");
  };
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:56,height:56,background:C.navy,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26}}>🔐</div>
          <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,marginBottom:6}}>Admin Giobbi's</h2>
          <p style={{...B,fontSize:14,color:C.muted}}>Acesso restrito à equipe interna</p>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="admin@giobbis.com" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          {error&&<Alert type="error">{error}</Alert>}
          <Btn label="Acessar painel" variant="navy" size="lg" full onClick={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL — reads real data from Supabase
// ═══════════════════════════════════════════════════════════════
function AdminPanel() {
  const [tab, setTab] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selCompany, setSelCompany] = useState(null);
  const [selWorker, setSelWorker] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [cos, wos] = await Promise.all([fetchCompanies(), fetchWorkers()]);
      setCompanies(cos || []);
      setWorkers(wos || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateCo = async (id, changes) => {
    setSaving(true);
    await updateCompanyDB(id, changes);
    setCompanies(cs=>cs.map(c=>c.id===id?{...c,...changes}:c));
    setSelCompany(s=>s?.id===id?{...s,...changes}:s);
    setSaving(false);
  };

  const updateWo = async (id, changes) => {
    setSaving(true);
    await updateWorkerDB(id, changes);
    setWorkers(ws=>ws.map(w=>w.id===id?{...w,...changes}:w));
    setSelWorker(s=>s?.id===id?{...s,...changes}:s);
    setSaving(false);
  };

  const pending_co = companies.filter(c=>c.status==="pending").length;
  const pending_wo = workers.filter(w=>w.status==="pending").length;
  const approved_co = companies.filter(c=>c.status==="approved").length;
  const overdue = companies.filter(c=>c.pay_status==="overdue").length;

  const fmtDate = iso => iso ? new Date(iso).toLocaleDateString("pt-BR") : "—";

  const NAV = [
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"companies",icon:"🏢",label:`Empresas${pending_co>0?` (${pending_co})`:""}`},
    {id:"workers",  icon:"👥",label:`Colaboradores${pending_wo>0?` (${pending_wo})`:""}`},
    {id:"billing",  icon:"💳",label:"Cobranças"},
  ];

  const RejectModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.white,borderRadius:16,padding:28,maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
        <h3 style={{...H,fontSize:20,fontWeight:800,color:C.navy,marginBottom:6}}>Reprovar cadastro</h3>
        <p style={{...B,fontSize:14,color:C.sub,marginBottom:16,lineHeight:1.65}}>Informe o motivo. Será enviado por e-mail ao cadastrante.</p>
        <div style={{marginBottom:16}}>
          <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>Motivo *</label>
          <textarea value={rejectNote} onChange={e=>setRejectNote(e.target.value)}
            placeholder="Ex: Documento ilegível. Por favor envie uma nova selfie com melhor iluminação."
            style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${C.border2}`,...B,fontSize:14,color:C.text,minHeight:100,resize:"vertical"}} />
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn label="Cancelar" variant="ghost" size="md" full onClick={()=>{setRejectModal(null);setRejectNote("");}} />
          <Btn label="Confirmar reprovação" variant="danger" size="md" full disabled={!rejectNote} loading={saving}
            onClick={async()=>{
              if(rejectModal.type==="company") await updateCo(rejectModal.id,{status:"rejected",reject_note:rejectNote,pay_status:"inactive"});
              else await updateWo(rejectModal.id,{status:"rejected",reject_note:rejectNote});
              setRejectModal(null); setRejectNote("");
            }} />
        </div>
      </div>
    </div>
  );

  if(loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh",flexDirection:"column",gap:16}}>
      <span style={{width:36,height:36,borderRadius:18,border:`3px solid ${C.border2}`,borderTopColor:C.green,animation:"spin .8s linear infinite",display:"block"}} />
      <div style={{...B,fontSize:14,color:C.muted}}>Carregando dados do Supabase...</div>
    </div>
  );

  return (
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",minHeight:"calc(100vh - 60px)"}}>
      {rejectModal&&<RejectModal />}

      {/* Sidebar */}
      <aside style={{background:C.white,borderRight:`1px solid ${C.border}`,padding:"20px 0",position:"sticky",top:60,height:"calc(100vh - 60px)",overflowY:"auto"}}>
        <div style={{padding:"0 16px 18px",borderBottom:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{...B,fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Painel Interno</div>
          <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Equipe Giobbi's</div>
          <button onClick={load} style={{...B,fontSize:11,color:C.green,background:"none",border:"none",cursor:"pointer",marginTop:6,fontWeight:600}}>↻ Atualizar</button>
        </div>
        {NAV.map(n=>(
          <div key={n.id} className={`admin-item ${tab===n.id?"active":""}`} onClick={()=>{setTab(n.id);setSelCompany(null);setSelWorker(null);}}>
            <span style={{fontSize:16}}>{n.icon}</span>
            <span style={{...B,fontSize:13,color:tab===n.id?C.green:C.sub}}>{n.label}</span>
          </div>
        ))}
        <Div />
        <div style={{padding:"0 14px"}}>
          {pending_co>0&&<div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:9,padding:"10px 12px",marginBottom:8,...B,fontSize:12,color:C.amber}}>⏳ {pending_co} empresa{pending_co>1?"s":""} pendente{pending_co>1?"s":""}</div>}
          {pending_wo>0&&<div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:9,padding:"10px 12px",marginBottom:8,...B,fontSize:12,color:C.amber}}>⏳ {pending_wo} colaborador{pending_wo>1?"es":""} pendente{pending_wo>1?"s":""}</div>}
          {overdue>0&&<div style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:9,padding:"10px 12px",...B,fontSize:12,color:C.red}}>! {overdue} em atraso</div>}
          {pending_co===0&&pending_wo===0&&overdue===0&&<div style={{...B,fontSize:12,color:C.green}}>✓ Tudo em dia</div>}
        </div>
      </aside>

      {/* Main */}
      <main style={{padding:"28px 32px",background:C.bg,minWidth:0}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dashboard</h2>
            <p style={{...B,fontSize:14,color:C.muted,marginBottom:24}}>Visão geral da plataforma Giobbi's</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {[
                {v:companies.length,l:"Empresas total",c:C.navy,icon:"🏢",sub:`${pending_co} pendentes`},
                {v:workers.length,  l:"Colaboradores", c:C.blue,icon:"👥",sub:`${pending_wo} pendentes`},
                {v:approved_co,     l:"Empresas ativas",c:C.green,icon:"✓",sub:"aprovadas"},
                {v:overdue,         l:"Em atraso",     c:C.red, icon:"⚠",sub:"inadimplentes"},
              ].map(({v,l,c,icon,sub})=>(
                <div key={l} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                    <span style={{fontSize:22}}>{icon}</span>
                    <div style={{...H,fontSize:30,fontWeight:900,color:c}}>{v}</div>
                  </div>
                  <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{l}</div>
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Empresas pendentes</div>
                  <Badge status="pending" />
                </div>
                {companies.filter(c=>c.status==="pending").length===0
                  ?<div style={{padding:32,textAlign:"center",...B,fontSize:13,color:C.muted}}>Nenhuma pendente ✓</div>
                  :companies.filter(c=>c.status==="pending").map(co=>(
                    <div key={co.id} className="card-h" onClick={()=>{setTab("companies");setSelCompany(co);}} style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div>
                      <div style={{...B,fontSize:12,color:C.muted}}>{co.seg} · {co.cidade}/{co.estado} · {fmtDate(co.created_at)}</div>
                    </div>
                  ))}
              </div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Colaboradores pendentes</div>
                  <Badge status="pending" />
                </div>
                {workers.filter(w=>w.status==="pending").length===0
                  ?<div style={{padding:32,textAlign:"center",...B,fontSize:13,color:C.muted}}>Nenhum pendente ✓</div>
                  :workers.filter(w=>w.status==="pending").map(wo=>(
                    <div key={wo.id} className="card-h" onClick={()=>{setTab("workers");setSelWorker(wo);}} style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{wo.nome}</div>
                      <div style={{...B,fontSize:12,color:C.muted}}>{wo.cidade}/{wo.estado} · {wo.specs?.length||0} especialidades · {fmtDate(wo.created_at)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── COMPANIES ── */}
        {tab==="companies"&&!selCompany&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:20}}>Empresas</h2>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                {["Empresa","Segmento","Unidades","Status","Pagamento"].map(h=><div key={h} style={{...B,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
              </div>
              {companies.length===0
                ?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhuma empresa cadastrada ainda.</div>
                :companies.map(co=>(
                <div key={co.id} className="card-h" onClick={()=>setSelCompany(co)}
                  style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div>
                    <div style={{...B,fontSize:12,color:C.muted}}>{co.cnpj} · {co.cidade}/{co.estado}</div>
                  </div>
                  <div style={{...B,fontSize:13,color:C.sub}}>{co.seg}</div>
                  <div style={{...B,fontSize:13,color:C.sub}}>{co.company_units?.length||0} unidade{(co.company_units?.length||0)!==1?"s":""}</div>
                  <Badge status={co.status} />
                  <Badge status={co.pay_status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company detail */}
        {tab==="companies"&&selCompany&&(
          <div>
            <button onClick={()=>setSelCompany(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20,alignItems:"start"}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
                  <div>
                    <h3 style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:4}}>{selCompany.nome_fant||selCompany.razao}</h3>
                    <div style={{...B,fontSize:13,color:C.muted}}>{selCompany.razao}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><Badge status={selCompany.status} /><Badge status={selCompany.pay_status} /></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",marginBottom:20}}>
                  {[["CNPJ",selCompany.cnpj],["Segmento",selCompany.seg],["Site",selCompany.site||"—"],["Cadastro",fmtDate(selCompany.created_at)],["CEP",selCompany.cep],["Cidade",`${selCompany.cidade}/${selCompany.estado}`]].map(([k,v])=>(
                    <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div>
                      <div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</div>
                    </div>
                  ))}
                </div>
                <Div />
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Responsável</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",marginBottom:20}}>
                  {[["Nome",selCompany.resp_nome],["Cargo",selCompany.resp_cargo],["WhatsApp",selCompany.resp_tel],["E-mail",selCompany.resp_email]].map(([k,v])=>(
                    <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div>
                      <div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
                {selCompany.company_units?.length>0&&<>
                  <Div />
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Unidades</div>
                  {selCompany.company_units.map(u=>(
                    <div key={u.id} style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                      <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{u.nome}</div>
                      <div style={{...B,fontSize:12,color:C.sub,marginTop:2}}>{u.rua}, {u.numero} — {u.bairro}, {u.cidade}/{u.estado}</div>
                    </div>
                  ))}
                </>}
                {selCompany.reject_note&&<><Div /><Alert type="error"><strong>Motivo da reprovação:</strong> {selCompany.reject_note}</Alert></>}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {selCompany.status==="pending"&&(
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Decisão</div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <Btn label="✓ Aprovar empresa" variant="approve" size="md" full loading={saving} onClick={()=>updateCo(selCompany.id,{status:"approved",pay_status:"trial",plan:"Trial (30 dias)"})} />
                      <Btn label="✕ Reprovar" variant="danger" size="md" full onClick={()=>setRejectModal({id:selCompany.id,type:"company"})} />
                    </div>
                  </div>
                )}
                {selCompany.status==="approved"&&<>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Plano</div>
                    <div style={{...B,fontSize:13,color:C.sub,marginBottom:10}}>{selCompany.plan}</div>
                    {PLANS.map(p=>(
                      <div key={p} onClick={()=>updateCo(selCompany.id,{plan:p})} style={{padding:"8px 12px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${selCompany.plan===p?C.green:C.border2}`,background:selCompany.plan===p?C.greenBg:"transparent",...B,fontSize:12,color:selCompany.plan===p?C.green:C.sub,marginBottom:5,transition:"all .15s"}}>
                        {selCompany.plan===p?"✓ ":""}{p}
                      </div>
                    ))}
                  </div>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Pagamento</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <Btn label="✓ Marcar como pago" variant="approve" size="sm" full loading={saving} onClick={()=>updateCo(selCompany.id,{pay_status:"paid"})} />
                      <Btn label="! Marcar em atraso" variant="danger" size="sm" full onClick={()=>updateCo(selCompany.id,{pay_status:"overdue"})} />
                      <Btn label="Suspender acesso" variant="ghost" size="sm" full onClick={()=>updateCo(selCompany.id,{status:"rejected",pay_status:"inactive"})} />
                    </div>
                  </div>
                </>}
                {selCompany.status==="rejected"&&(
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Reativar</div>
                    <Btn label="↩ Reabrir para análise" variant="amber" size="sm" full loading={saving} onClick={()=>updateCo(selCompany.id,{status:"pending",reject_note:"",pay_status:"trial"})} />
                  </div>
                )}
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <div style={{...H,fontSize:13,fontWeight:700,color:C.navy,marginBottom:10}}>Contato</div>
                  <div style={{...B,fontSize:13,color:C.sub,marginBottom:6}}>📱 {selCompany.resp_tel}</div>
                  <div style={{...B,fontSize:13,color:C.sub}}>✉️ {selCompany.resp_email}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── WORKERS ── */}
        {tab==="workers"&&!selWorker&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:20}}>Colaboradores</h2>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                {["Colaborador","Especialidades","Disponibilidade","Status"].map(h=><div key={h} style={{...B,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
              </div>
              {workers.length===0
                ?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhum colaborador cadastrado ainda.</div>
                :workers.map(wo=>(
                <div key={wo.id} className="card-h" onClick={()=>setSelWorker(wo)}
                  style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{wo.nome}</div>
                    <div style={{...B,fontSize:12,color:C.muted}}>{wo.cpf} · {wo.cidade}/{wo.estado} · {fmtDate(wo.created_at)}</div>
                  </div>
                  <div style={{...B,fontSize:12,color:C.sub}}>{wo.specs?.length||0} especialidade{(wo.specs?.length||0)!==1?"s":""}</div>
                  <div style={{...B,fontSize:12,color:C.sub}}>{wo.dias?.length||0}d · {wo.turnos?.map(t=>SHIFTS.find(s=>s.id===t)?.label).join(", ")||"—"}</div>
                  <Badge status={wo.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worker detail */}
        {tab==="workers"&&selWorker&&(
          <div>
            <button onClick={()=>setSelWorker(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
                  <div><h3 style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:4}}>{selWorker.nome}</h3><div style={{...B,fontSize:13,color:C.muted}}>{selWorker.cidade}/{selWorker.estado}</div></div>
                  <Badge status={selWorker.status} />
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",marginBottom:20}}>
                  {[["CPF",selWorker.cpf],["Nascimento",selWorker.nascimento],["WhatsApp",selWorker.telefone],["E-mail",selWorker.email],["Documento",selWorker.doc_tipo||"—"],["Cadastro",fmtDate(selWorker.created_at)]].map(([k,v])=>(
                    <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div>
                      <div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v||"—"}</div>
                    </div>
                  ))}
                </div>
                <Div />
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Especialidades</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                  {SPECS.filter(s=>selWorker.specs?.includes(s.id)).map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:7,background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"6px 12px"}}>
                      <span style={{fontSize:15}}>{s.icon}</span><span style={{...B,fontSize:13,fontWeight:600,color:C.green}}>{s.label}</span>
                    </div>
                  ))}
                  {(!selWorker.specs||selWorker.specs.length===0)&&<div style={{...B,fontSize:13,color:C.muted}}>Nenhuma especialidade</div>}
                </div>
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Disponibilidade</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  {DAYS.map(d=>{const on=selWorker.dias?.includes(d);return <div key={d} style={{padding:"6px 12px",borderRadius:7,background:on?C.greenBg:C.bg,border:`1px solid ${on?C.greenBorder:C.border}`}}><span style={{...B,fontSize:12,fontWeight:600,color:on?C.green:C.muted}}>{d}</span></div>;})}
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {selWorker.turnos?.map(t=>{const sh=SHIFTS.find(s=>s.id===t);return sh?<div key={t} style={{display:"flex",alignItems:"center",gap:6,background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"6px 14px"}}><span>{sh.icon}</span><span style={{...B,fontSize:13,fontWeight:600,color:C.green}}>{sh.label}</span></div>:null;})}
                </div>
                {selWorker.reject_note&&<><Div /><Alert type="error"><strong>Motivo da reprovação:</strong> {selWorker.reject_note}</Alert></>}
                <Div />
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Documentos enviados</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{label:"Foto de perfil",icon:"📷"},{label:`Selfie com ${selWorker.doc_tipo||"documento"}`,icon:"🤳"}].map(({label,icon})=>(
                    <div key={label} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"24px 16px",textAlign:"center"}}>
                      <div style={{fontSize:34,marginBottom:8}}>{icon}</div>
                      <div style={{...B,fontSize:12,color:C.muted}}>{label}</div>
                      <div style={{...B,fontSize:11,color:C.green,marginTop:6,fontWeight:600}}>✓ Enviado</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {selWorker.status==="pending"&&(
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Decisão</div>
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      <Btn label="✓ Aprovar perfil" variant="approve" size="md" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"approved"})} />
                      <Btn label="✕ Reprovar" variant="danger" size="md" full onClick={()=>setRejectModal({id:selWorker.id,type:"worker"})} />
                    </div>
                    <div style={{...B,fontSize:11,color:C.muted,marginTop:12,lineHeight:1.6}}>Verifique os documentos antes de aprovar.</div>
                  </div>
                )}
                {selWorker.status==="approved"&&(
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <Alert type="success">Colaborador ativo na plataforma.</Alert>
                    <Btn label="Suspender perfil" variant="danger" size="sm" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"rejected",reject_note:"Perfil suspenso."})} />
                  </div>
                )}
                {selWorker.status==="rejected"&&(
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Reativar</div>
                    <Btn label="↩ Reabrir para análise" variant="amber" size="sm" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"pending",reject_note:""})} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BILLING ── */}
        {tab==="billing"&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Cobranças</h2>
            <p style={{...B,fontSize:14,color:C.muted,marginBottom:22}}>Gestão de planos e pagamentos das empresas parceiras.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
              {[
                {v:companies.filter(c=>c.pay_status==="paid").length,l:"Pagamentos confirmados",c:C.green,icon:"💰"},
                {v:companies.filter(c=>c.pay_status==="trial").length,l:"Em período trial",c:C.blue,icon:"⏱"},
                {v:companies.filter(c=>c.pay_status==="overdue").length,l:"Em atraso",c:C.red,icon:"⚠"},
              ].map(({v,l,c,icon})=>(
                <div key={l} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px"}}>
                  <div style={{fontSize:24,marginBottom:8}}>{icon}</div>
                  <div style={{...H,fontSize:30,fontWeight:900,color:c}}>{v}</div>
                  <div style={{...B,fontSize:13,color:C.sub,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                {["Empresa","Plano","Pagamento","Ações"].map(h=><div key={h} style={{...B,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
              </div>
              {companies.filter(c=>c.status==="approved").length===0
                ?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhuma empresa aprovada ainda.</div>
                :companies.filter(c=>c.status==="approved").map(co=>(
                <div key={co.id} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div>
                    <div style={{...B,fontSize:12,color:C.muted}}>{co.seg} · {co.cidade}</div>
                  </div>
                  <div style={{...B,fontSize:13,color:C.sub}}>{co.plan}</div>
                  <Badge status={co.pay_status} />
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>updateCo(co.id,{pay_status:"paid"})} style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:6,padding:"5px 9px",cursor:"pointer",...B,fontSize:11,color:C.green,fontWeight:600}}>✓</button>
                    <button onClick={()=>updateCo(co.id,{pay_status:"overdue"})} style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:6,padding:"5px 9px",cursor:"pointer",...B,fontSize:11,color:C.red,fontWeight:600}}>!</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── AUTH SCREEN ────────────────────────────────────────────────
function AuthScreen({ type, onLogin, onRegister, onBack }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <button onClick={onBack} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:24}}>← Voltar</button>
        <SL>{type==="worker"?"Área do Colaborador":"Área da Empresa"}</SL>
        <h2 style={{...H,fontSize:32,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:28}}>Bem-vindo<br />de volta.</h2>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="seu@email.com" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          <Btn label="Entrar →" variant="primary" size="lg" full onClick={()=>email&&pass&&onLogin()} />
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
            <div style={{flex:1,height:1,background:C.border}} /><span style={{...B,fontSize:12,color:C.muted}}>ou</span><div style={{flex:1,height:1,background:C.border}} />
          </div>
          <Btn label={type==="worker"?"Criar conta →":"Cadastrar minha empresa →"} variant="ghost" size="lg" full onClick={onRegister} />
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
  const [admin,   setAdmin]   = useState(false);

  const userType = admin?"admin":null;
  const userName = admin?"Admin":null;
  const onNav = s => { if(s==="home") setAdmin(false); setScreen(s); };

  return (
    <>
      <GlobalStyles />
      <Header onNav={onNav} user={userName} type={userType} />
      {!admin&&screen==="home"             &&<Landing          onNav={onNav} />}
      {!admin&&screen==="worker-auth"      &&<AuthScreen       type="worker"  onBack={()=>onNav("home")} onLogin={()=>onNav("worker-app")} onRegister={()=>onNav("worker-register")} />}
      {!admin&&screen==="worker-register"  &&<WorkerRegister   onBack={()=>onNav("worker-auth")} onDone={d=>{setWData(d);onNav("worker-success");}} />}
      {!admin&&screen==="worker-success"   &&<WorkerSuccess    data={wData} onEnter={()=>onNav("home")} />}
      {!admin&&screen==="worker-app"       &&<Landing          onNav={onNav} />}
      {!admin&&screen==="company-auth"     &&<AuthScreen       type="company" onBack={()=>onNav("home")} onLogin={()=>onNav("company-app")} onRegister={()=>onNav("company-register")} />}
      {!admin&&screen==="company-register" &&<CompanyRegister  onBack={()=>onNav("company-auth")} onDone={d=>{setCData(d);onNav("company-success");}} />}
      {!admin&&screen==="company-success"  &&<CompanySuccess   data={cData} onEnter={()=>onNav("home")} />}
      {!admin&&screen==="company-app"      &&<Landing          onNav={onNav} />}
      {!admin&&screen==="admin-login"      &&<AdminLogin       onLogin={()=>setAdmin(true)} />}
      {admin                               &&<AdminPanel />}
    </>
  );
}
