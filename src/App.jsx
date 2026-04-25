import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

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
      .level-bar{height:6px;border-radius:3px;background:#E2E8F0;overflow:hidden;margin-top:4px}
      .level-fill{height:100%;border-radius:3px;background:#16A34A;transition:width .3s}
      .toggle-btn{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;cursor:pointer;border:1.5px solid #CBD5E1;background:#fff;transition:all .15s;user-select:none}
      .toggle-btn.on{border-color:#16A34A;background:#F0FDF4}
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

const SelectField = ({ label, value, onChange, options, required }) => (
  <div style={{ marginBottom:16 }}>
    {label&&<label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>
      {label}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}
    </label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:14,color:value?C.text:C.muted,cursor:"pointer"}}>
      <option value="">Selecionar...</option>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

const SL = ({ children }) => (
  <div style={{...B,fontSize:11,fontWeight:700,color:C.green,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{children}</div>
);
const Div = () => <div style={{height:1,background:C.border,margin:"20px 0"}} />;
const Prog = ({ step, total }) => (
  <div className="prog">
    {Array.from({length:total}).map((_,i)=><div key={i} className="prog-s" style={{background:i<step?C.green:C.border2,width:i<step?22:10}} />)}
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
  {id:"pack",icon:"📫",label:"Embalador"},
  {id:"shopper",icon:"🛍",label:"Shopper"},{id:"padaria",icon:"🥖",label:"Padaria"},
];
const LEVELS = [
  {value:0,label:"Nenhum"},
  {value:1,label:"Básico"},
  {value:2,label:"Intermediário"},
  {value:3,label:"Avançado"},
  {value:4,label:"Especialista"},
];
const EXP_TIMES = [
  "Menos de 6 meses","6 meses a 1 ano","1 a 3 anos","3 a 5 anos","Mais de 5 anos"
];
const DAYS   = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const SHIFTS = [
  {id:"manha",    label:"Manhã",     color:"#F59E0B"},
  {id:"tarde",    label:"Tarde",     color:"#3B82F6"},
  {id:"noite",    label:"Noite",     color:"#6366F1"},
  {id:"madrugada",label:"Madrugada", color:"#374151"},
];
const SEGS   = ["Supermercado","Atacarejo","Dark Store","Centro de Distribuição","Delivery","Hortifruti","Farmácia","Indústria FMCG","Distribuidor","Outro"];
const PLANS  = ["Trial (30 dias)","Básico — R$ 299/mês","Profissional — R$ 599/mês","Enterprise — R$ 1.299/mês"];
const EQUIP  = ["Paleteira manual","Paleteira elétrica","Empilhadeira","Leitor de código de barras","Coletor de dados","Impressora de etiquetas","SAP","Totvs"];
const DESLOCAMENTOS = ["Transporte público","Moto própria","Carro próprio","Bicicleta","A pé (raio curto)"];

// ─── SUPABASE FUNCTIONS ────────────────────────────────────────
const saveCompany = async (data) => {
  // Check duplicates
  const { data: existCNPJ } = await supabase.from("companies").select("id").eq("cnpj", data.cnpj).maybeSingle();
  if(existCNPJ) throw new Error("CNPJ já cadastrado. Se já tem conta, faça login.");
  const { data: existEmail } = await supabase.from("companies").select("id").eq("email", data.email).maybeSingle();
  if(existEmail) throw new Error("E-mail já cadastrado. Se já tem conta, faça login.");

  const { data: company, error } = await supabase.from("companies").insert({
    cnpj:data.cnpj, razao:data.razao, nome_fant:data.nomeFant, site:data.site, seg:data.seg,
    cep:data.cep, rua:data.rua, numero:data.numero, complemento:data.complemento,
    bairro:data.bairro, cidade:data.cidade, estado:data.estado,
    resp_nome:data.respNome, resp_cargo:data.respCargo, resp_tel:data.respTel, resp_email:data.respEmail,
    email:data.email, status:"pending", pay_status:"trial", plan:"Trial (30 dias)",
  }).select().single();
  if(error) throw error;
  if(data.unidades.length>0) {
    await supabase.from("company_units").insert(data.unidades.map(u=>({
      company_id:company.id, nome:u.nome, cep:u.cep, rua:u.rua, numero:u.numero,
      complemento:u.complemento, bairro:u.bairro, cidade:u.cidade, estado:u.estado,
    })));
  }
  return company;
};

const addUnitToDB = async (companyId, unit) => {
  const { data, error } = await supabase.from("company_units").insert({
    company_id:companyId, nome:unit.nome, cep:unit.cep, rua:unit.rua, numero:unit.numero,
    complemento:unit.complemento, bairro:unit.bairro, cidade:unit.cidade, estado:unit.estado,
  }).select().single();
  if(error) throw error;
  return data;
};

const deleteUnitFromDB = async (unitId) => {
  const { error } = await supabase.from("company_units").delete().eq("id", unitId);
  if(error) throw error;
};

const deleteCompanyDB = async (id) => {
  await supabase.from("company_units").delete().eq("company_id", id);
  const { error } = await supabase.from("companies").delete().eq("id", id);
  if(error) throw error;
};

const deleteWorkerDB = async (id) => {
  const { error } = await supabase.from("workers").delete().eq("id", id);
  if(error) throw error;
};

const saveWorker = async (data) => {
  const { data: existCPF } = await supabase.from("workers").select("id").eq("cpf", data.cpf).maybeSingle();
  if(existCPF) throw new Error("CPF já cadastrado — se já tem conta, faça login.");
  const { data: existEmail } = await supabase.from("workers").select("id").eq("email", data.email).maybeSingle();
  if(existEmail) throw new Error("E-mail já cadastrado — se já tem conta, faça login.");

  // Merge custom spec into spec_levels label
  const specLevelsFinal = {...data.specLevels};
  if(data.specCustom && data.specs.includes("custom")) {
    specLevelsFinal["custom"] = {...(specLevelsFinal["custom"]||{}), label: data.specCustom};
  }

  const { data: worker, error } = await supabase.from("workers").insert({
    nome:data.nome, cpf:data.cpf, nascimento:data.nascimento, telefone:data.telefone,
    cep:data.cep, rua:data.rua, numero:data.numero, complemento:data.complemento,
    bairro:data.bairro, cidade:data.cidade, estado:data.estado,
    raio_km:data.raioKm, deslocamento:data.deslocamento,
    specs:data.specs,
    spec_levels:specLevelsFinal,
    dias: Object.keys(data.disponibilidade).filter(d=>data.disponibilidade[d].length>0),
    turnos: [...new Set(Object.values(data.disponibilidade).flat())],
    disponibilidade: data.disponibilidade,
    trabalho_equipe:data.trabalhoEquipe, atend_cliente:data.atendCliente, tipo_trabalho:data.tipoTrabalho,
    pcd:data.pcd, pcd_tipo:data.pcdTipo,
    doc_tipo:data.docTipo, email:data.email, status:"pending",
  }).select().single();
  if(error) throw error;
  return worker;
};

const fetchCompanies = async () => {
  const { data, error } = await supabase.from("companies").select("*, company_units(*)").order("created_at",{ascending:false});
  if(error) throw error;
  return data;
};
const fetchWorkers = async () => {
  const { data, error } = await supabase.from("workers").select("*").order("created_at",{ascending:false});
  if(error) throw error;
  return data;
};
const updateCompanyDB = async (id, changes) => { const {error}=await supabase.from("companies").update(changes).eq("id",id); if(error) throw error; };
const updateWorkerDB  = async (id, changes) => { const {error}=await supabase.from("workers").update(changes).eq("id",id); if(error) throw error; };

// ─── ADDRESS BLOCK ─────────────────────────────────────────────
function AddressBlock({ data, setData, loading, setLoading }) {
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const handleCEP = async raw => {
    const masked = maskCEP(raw); set("cep",masked);
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
        <Field label="Complemento" placeholder="Apto, Bloco..." value={data.complemento||""} onChange={v=>set("complemento",v)} />
      </div>
      <div className="g3">
        <Field label="Bairro" placeholder="Centro" value={data.bairro||""} onChange={v=>set("bairro",v)} required />
        <Field label="Cidade" placeholder="São Paulo" value={data.cidade||""} onChange={v=>set("cidade",v)} required />
        <Field label="UF" placeholder="SP" value={data.estado||""} onChange={v=>set("estado",v)} maxLength={2} />
      </div>
    </>
  );
}

// ─── LEVEL SELECTOR ────────────────────────────────────────────
function LevelSelector({ spec, levels, onChange }) {
  const sl = levels[spec.id] || { nivel:0, experiencia:"", empresas:[] };
  const [newEmp, setNewEmp] = useState("");
  const levelColors = ["#9CA3AF","#60A5FA","#FBBF24","#F97316","#16A34A"];
  const levelWidth  = [0,25,50,75,100];

  const addEmpresa = () => {
    if(!newEmp.trim()) return;
    const empresas = [...(sl.empresas||[]), newEmp.trim()];
    onChange(spec.id, {...sl, empresas});
    setNewEmp("");
  };
  const removeEmpresa = (i) => {
    const empresas = (sl.empresas||[]).filter((_,idx)=>idx!==i);
    onChange(spec.id, {...sl, empresas});
  };

  return (
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <span style={{fontSize:22}}>{spec.icon}</span>
        <div style={{...H,fontSize:15,fontWeight:700,color:C.navy}}>{spec.label}</div>
      </div>

      {/* Nível */}
      <div style={{...B,fontSize:11,fontWeight:600,color:C.sub,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Nível de experiência</div>
      <div style={{display:"flex",gap:8,marginBottom:6}}>
        {LEVELS.map(l=>(
          <div key={l.value} onClick={()=>onChange(spec.id,{...sl,nivel:l.value})}
            style={{flex:1,padding:"8px 4px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${sl.nivel===l.value?levelColors[l.value]:C.border2}`,background:sl.nivel===l.value?levelColors[l.value]+"20":"transparent",textAlign:"center",transition:"all .15s"}}>
            <div style={{...B,fontSize:11,fontWeight:sl.nivel===l.value?700:400,color:sl.nivel===l.value?levelColors[l.value]:C.muted}}>{l.label}</div>
          </div>
        ))}
      </div>
      {sl.nivel>0&&<div className="level-bar" style={{marginBottom:14}}><div className="level-fill" style={{width:`${levelWidth[sl.nivel]}%`,background:levelColors[sl.nivel]}} /></div>}

      {sl.nivel>0&&<>
        {/* Tempo */}
        <div style={{...B,fontSize:11,fontWeight:600,color:C.sub,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Tempo na função</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {EXP_TIMES.map(exp=>(
            <div key={exp} onClick={()=>onChange(spec.id,{...sl,experiencia:exp})}
              style={{padding:"7px 12px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${sl.experiencia===exp?C.green:C.border2}`,background:sl.experiencia===exp?C.greenBg:"transparent",...B,fontSize:12,fontWeight:sl.experiencia===exp?600:400,color:sl.experiencia===exp?C.green:C.sub,transition:"all .15s"}}>
              {exp}
            </div>
          ))}
        </div>

        {/* Empresas */}
        <div style={{...B,fontSize:11,fontWeight:600,color:C.sub,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Onde trabalhou nessa função</div>
        {(sl.empresas||[]).length>0&&(
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
            {(sl.empresas||[]).map((emp,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:8,padding:"5px 12px"}}>
                <span style={{...B,fontSize:12,fontWeight:600,color:C.green}}>{emp}</span>
                <span onClick={()=>removeEmpresa(i)} style={{cursor:"pointer",color:C.red,fontWeight:700,fontSize:13,lineHeight:1}}>×</span>
              </div>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:8}}>
          <input placeholder="Nome da empresa..." value={newEmp} onChange={e=>setNewEmp(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addEmpresa()}
            style={{flex:1,padding:"9px 12px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,color:C.text,outline:"none"}} />
          <button onClick={addEmpresa} style={{padding:"9px 16px",borderRadius:8,background:C.green,border:"none",color:"#fff",...B,fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Adicionar</button>
        </div>
        <div style={{...B,fontSize:11,color:C.muted,marginTop:6}}>Pressione Enter ou clique em Adicionar. Pode informar mais de uma empresa.</div>
      </>}
    </div>
  );
}

// ─── HEADER ────────────────────────────────────────────────────
function Header({ onNav, user, type }) {
  const [clicks, setClicks] = useState(0);
  const handleLogoClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if(next >= 5) { setClicks(0); onNav("admin-login"); return; }
    onNav("home");
  };
  return (
    <header className="hdr">
      <div className="wrap" style={{width:"100%"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div onClick={handleLogoClick} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
            <div style={{width:32,height:32,background:C.green,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⚡</div>
            <span style={{...H,fontSize:19,fontWeight:900,color:C.navy,letterSpacing:-.4}}>VORKY</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {!user?<>
              <Btn label="Entre" variant="ghost" size="sm" onClick={()=>onNav("auth-choice")} />
              <Btn label="Cadastre-se" variant="primary" size="sm" onClick={()=>onNav("auth-choice")} />
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
    <div>
      {/* Hero */}
      <div style={{minHeight:"70vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px"}}>
        <div style={{maxWidth:620,width:"100%",textAlign:"center"}}>
          <div style={{...B,fontSize:11,fontWeight:700,color:C.green,letterSpacing:1.5,textTransform:"uppercase",marginBottom:16}}>Especialistas em varejo</div>
          <h1 style={{...H,fontSize:"clamp(38px,6vw,68px)",fontWeight:900,color:C.navy,letterSpacing:-2,lineHeight:.95,marginBottom:20}}>O parceiro certo,<br />no momento certo.</h1>
          <p style={{...B,fontSize:17,color:C.sub,lineHeight:1.75,marginBottom:44,maxWidth:480,margin:"0 auto 44px"}}>
            Conectamos empresas de varejo a colaboradores verificados e qualificados, de forma rápida e sem burocracia.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,paddingTop:40,borderTop:`1px solid ${C.border}`}}>
            {[{v:"+1.000",l:"Estabelecimentos"},{v:"+300k",l:"Horas realizadas"},{v:"+60",l:"Cidades"},{v:"4,9★",l:"Avaliação média"}].map(({v,l})=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{...H,fontSize:"clamp(22px,3vw,32px)",fontWeight:900,color:C.green}}>{v}</div>
                <div style={{...B,fontSize:13,color:C.muted,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shortcut buttons — abaixo do hero */}
      <div style={{background:C.white,borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,padding:"32px 20px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{...H,fontSize:18,fontWeight:800,color:C.navy}}>Comece agora — é gratuito</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {/* Empresa */}
            <div onClick={()=>onNav("company-register")}
              style={{background:C.greenBg,border:`1.5px solid ${C.greenBorder}`,borderRadius:14,padding:"24px 28px",cursor:"pointer",display:"flex",alignItems:"center",gap:18,transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(22,163,74,.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontSize:42,flexShrink:0}}>🏢</div>
              <div>
                <div style={{...H,fontSize:17,fontWeight:900,color:C.navy,marginBottom:4}}>Sou uma empresa</div>
                <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.5}}>Quero encontrar colaboradores qualificados na minha região</div>
                <div style={{...H,fontSize:13,fontWeight:700,color:C.green,marginTop:8}}>Cadastrar empresa →</div>
              </div>
            </div>

            {/* Colaborador */}
            <div onClick={()=>onNav("worker-register")}
              style={{background:C.blueBg,border:`1.5px solid ${C.blueBorder}`,borderRadius:14,padding:"24px 28px",cursor:"pointer",display:"flex",alignItems:"center",gap:18,transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(37,99,235,.15)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";}}>
              <div style={{fontSize:42,flexShrink:0}}>👤</div>
              <div>
                <div style={{...H,fontSize:17,fontWeight:900,color:C.navy,marginBottom:4}}>Sou colaborador</div>
                <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.5}}>Quero ser encontrado por empresas e receber convites de trabalho</div>
                <div style={{...H,fontSize:13,fontWeight:700,color:C.blue,marginTop:8}}>Criar meu perfil →</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WORKER REGISTER — 10 steps
// ═══════════════════════════════════════════════════════════════
function WorkerRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [data, setData] = useState({
    // 1 — Dados pessoais
    nome:"", cpf:"", nascimento:"", telefone:"",
    cpfExists: false,
    // 2 — Endereço + deslocamento
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    raioKm: 10, deslocamento:"",
    // 3 — Especialidades
    specs:[], specCustom:"",
    // 4 — Nível por especialidade
    specLevels:{},
    // 5 — Disponibilidade (grid: { Seg: ['manha','tarde'], Ter: ['noite'], ... })
    disponibilidade:{},
    // 6 — Perfil comportamental
    trabalhoEquipe:false, atendCliente:false, tipoTrabalho:"",
    // 7 — Documentação
    temPix:false, chavePix:"", pcd:false, pcdTipo:"",
    // 8 — Foto
    fotoRosto:null,
    // 9 — Documento + Login
    docTipo:"", selfieDoc:null,
    email:"", senha:"", confirma:"",
  });
  const photoRef = useRef(); const selfieRef = useRef();
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const toggleArr = (k,v) => setData(d=>({...d,[k]:d[k].includes(v)?d[k].filter(x=>x!==v):[...d[k],v]}));
  const readFile = (file,key) => { const r=new FileReader(); r.onload=e=>set(key,e.target.result); r.readAsDataURL(file); };
  const setSpecLevel = (specId, val) => setData(d=>({...d,specLevels:{...d.specLevels,[specId]:val}}));

  const [cpfChecking, setCpfChecking] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);

  const cpfError   = data.cpf&&data.cpf.replace(/\D/g,"").length===11&&!validateCPF(data.cpf)?"CPF inválido":data.cpfExists?"CPF já cadastrado — se já tem conta, faça login":"";
  const ageError   = data.nascimento&&!validateAge(data.nascimento)?"É necessário ter 18 anos ou mais":"";
  const senhaError = data.confirma&&data.senha!==data.confirma?"Senhas não coincidem":"";

  const checkCPF = async (cpf) => {
    const raw = cpf.replace(/\D/g,"");
    if(raw.length!==11||!validateCPF(cpf)) return;
    setCpfChecking(true);
    const { data: existing } = await supabase.from("workers").select("id").eq("cpf",cpf).maybeSingle();
    setCpfChecking(false);
    set("cpfExists", !!existing);
  };
  const allSpecs = [...SPECS, ...(data.specCustom?[{id:"custom",icon:"⭐",label:data.specCustom}]:[])];
  const selectedSpecs = allSpecs.filter(s=>data.specs.includes(s.id));
  const allLevelsFilled = selectedSpecs.every(s=>data.specLevels[s.id]?.nivel>0&&data.specLevels[s.id]?.experiencia);

  const getMissingFields = () => {
    if(step===1){
      const m=[];
      if(!data.nome) m.push("Nome completo");
      if(data.cpf.replace(/\D/g,"").length<11) m.push("CPF");
      if(cpfError) m.push("CPF inválido ou já cadastrado");
      if(!data.nascimento) m.push("Data de nascimento");
      if(ageError) m.push("Idade mínima de 18 anos");
      if(data.telefone.replace(/\D/g,"").length<10) m.push("WhatsApp");
      return m;
    }
    if(step===2){
      const m=[];
      if(!data.cep) m.push("CEP");
      if(!data.rua) m.push("Rua/Avenida");
      if(!data.numero) m.push("Número");
      if(!data.bairro) m.push("Bairro");
      if(!data.cidade) m.push("Cidade");
      if(!data.deslocamento) m.push("Como você se desloca");
      return m;
    }
    if(step===3) return data.specs.length===0?["Selecione ao menos uma especialidade"]:[];
    if(step===4) return allLevelsFilled?[]:["Preencha o nível e tempo de experiência de todas as especialidades"];
    if(step===5) return Object.values(data.disponibilidade).some(t=>t.length>0)?[]:["Selecione ao menos um turno disponível"];
    if(step===6) return data.tipoTrabalho?[]:["Tipo de trabalho preferido"];
    if(step===8) return data.fotoRosto?[]:["Foto de perfil"];
    if(step===9){
      const m=[];
      if(!data.docTipo) m.push("Tipo de documento (RG ou CNH)");
      if(!data.selfieDoc) m.push("Selfie com documento");
      if(!data.email) m.push("E-mail");
      if(data.senha.length<8) m.push("Senha (mínimo 8 caracteres)");
      if(senhaError) m.push("Senhas não coincidem");
      return m;
    }
    return [];
  };

  const canNext = {
    1:  data.nome&&data.cpf.replace(/\D/g,"").length===11&&validateCPF(data.cpf)&&!data.cpfExists&&data.nascimento&&validateAge(data.nascimento)&&data.telefone.replace(/\D/g,"").length>=10,
    2:  data.cep&&data.rua&&data.numero&&data.bairro&&data.cidade&&data.deslocamento,
    3:  data.specs.length>=1,
    4:  allLevelsFilled,
    5:  Object.values(data.disponibilidade).some(turnos=>turnos.length>0),
    6:  !!data.tipoTrabalho,
    7:  true,
    8:  !!data.fotoRosto,
    9:  data.email&&data.senha.length>=8&&!senhaError&&!!data.docTipo&&!!data.selfieDoc,
  }[step];

  const handleNext = () => {
    const missing = getMissingFields();
    if(missing.length>0){ setFieldErrors(missing); return; }
    setFieldErrors([]);
    next();
  };

  const next = async () => {
    if(step<9){ setStep(s=>s+1); return; }
    setSubmitting(true); setSubmitError("");
    try { const saved=await saveWorker(data); onDone({...data,id:saved.id}); }
    catch(e){ setSubmitError(e.message||"Erro ao salvar. Tente novamente."); }
    finally { setSubmitting(false); }
  };
  const back = ()=>{ setFieldErrors([]); step>1?setStep(s=>s-1):onBack(); };

  const LABELS = [
    "Dados pessoais","Endereço e deslocamento","Especialidades",
    "Nível por especialidade","Disponibilidade",
    "Perfil profissional","Informações adicionais","Foto de perfil","Documento e conta",
  ];

  return (
    <div style={{minHeight:"90vh",padding:"32px 20px 80px",background:C.bg}}>
      <div style={{maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={back} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer"}}>← {step>1?"Voltar":"Cancelar"}</button>
          <Prog step={step} total={9} />
        </div>
        <div style={{...B,fontSize:12,color:C.muted,marginBottom:20}}>{LABELS[step-1]}</div>

        <div className="fu" key={step} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,padding:"32px 36px",boxShadow:"0 2px 16px rgba(0,0,0,.05)"}}>

          {/* ── STEP 1: Dados pessoais ── */}
          {step===1&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dados pessoais</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Preencha com seus dados reais. Serão verificados pela equipe VORKY.</p>
            <Field label="Nome completo" placeholder="João da Silva" value={data.nome} onChange={v=>set("nome",v)} required />
            <div className="g2">
              <div style={{marginBottom:16}}>
                <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>CPF <span style={{color:C.red}}>*</span></label>
                <input placeholder="000.000.000-00" value={data.cpf} maxLength={14}
                  onChange={e=>{ set("cpfExists",false); set("cpf",maskCPF(e.target.value)); }}
                  onBlur={()=>checkCPF(data.cpf)}
                  style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${cpfError?C.red:C.border2}`,background:"#fff",...B,fontSize:14,color:C.text,outline:"none"}} />
                {cpfChecking&&<div style={{...B,fontSize:11,color:C.muted,marginTop:5}}>🔍 Verificando CPF...</div>}
                {cpfError&&!cpfChecking&&<div style={{...B,fontSize:11,color:C.red,marginTop:5}}>⚠ {cpfError}</div>}
                {!cpfError&&!cpfChecking&&data.cpf.replace(/\D/g,"").length===11&&validateCPF(data.cpf)&&!data.cpfExists&&<div style={{...B,fontSize:11,color:C.green,marginTop:5}}>✓ CPF disponível</div>}
              </div>
              <Field label="Data de nascimento" value={data.nascimento} onChange={v=>set("nascimento",v)} type="date" hint={ageError} required helper="Mínimo 18 anos" />
            </div>
            <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.telefone} onChange={v=>set("telefone",maskPhone(v))} type="tel" maxLength={15} required helper="Usado pelas empresas para entrar em contato com você" />
            <Alert type="info">Todos os dados são tratados com sigilo e usados apenas para verificação.</Alert>
          </>}

          {/* ── STEP 2: Endereço + deslocamento ── */}
          {step===2&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Endereço e deslocamento</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Usamos para mostrar vagas próximas com a distância exata de cada oportunidade.</p>
            <AddressBlock data={data} setData={setData} loading={cepLoading} setLoading={setCepLoading} />
            <Div />
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Como você se desloca?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
              {DESLOCAMENTOS.map(d=>(
                <div key={d} onClick={()=>set("deslocamento",d)}
                  style={{padding:"9px 16px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${data.deslocamento===d?C.green:C.border2}`,background:data.deslocamento===d?C.greenBg:"transparent",...B,fontSize:13,fontWeight:data.deslocamento===d?600:400,color:data.deslocamento===d?C.green:C.sub,transition:"all .15s"}}>
                  {d}
                </div>
              ))}
            </div>
            <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:10}}>RAIO MÁXIMO DE DESLOCAMENTO</div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <input type="range" min="2" max="50" step="2" value={data.raioKm} onChange={e=>set("raioKm",parseInt(e.target.value))}
                style={{flex:1,accentColor:C.green}} />
              <div style={{...H,fontSize:20,fontWeight:900,color:C.green,minWidth:70,textAlign:"right"}}>{data.raioKm} km</div>
            </div>
            <div style={{...B,fontSize:12,color:C.muted,marginTop:6}}>Você aceita vagas num raio de até {data.raioKm}km da sua casa</div>
          </>}

          {/* ── STEP 3: Especialidades ── */}
          {step===3&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Suas especialidades</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Selecione as funções que você exerce. No próximo passo você informa o nível em cada uma.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:18}}>
              {SPECS.map(s=>{const on=data.specs.includes(s.id); return(
                <div key={s.id} className={`chip ${on?"on":""}`} onClick={()=>toggleArr("specs",s.id)}>
                  <span style={{fontSize:18}}>{s.icon}</span>
                  <span style={{...B,fontSize:13,fontWeight:on?600:400,color:on?C.green:C.sub}}>{s.label}</span>
                  {on&&<span style={{color:C.green,fontSize:11}}>✓</span>}
                </div>
              );})}
              {/* Especialidade customizada */}
              {data.specCustom&&(
                <div className={`chip ${data.specs.includes("custom")?"on":""}`} onClick={()=>toggleArr("specs","custom")}>
                  <span style={{fontSize:18}}>⭐</span>
                  <span style={{...B,fontSize:13,fontWeight:data.specs.includes("custom")?600:400,color:data.specs.includes("custom")?C.green:C.sub}}>{data.specCustom}</span>
                  {data.specs.includes("custom")&&<span style={{color:C.green,fontSize:11}}>✓</span>}
                  <span onClick={e=>{e.stopPropagation();set("specCustom","");setData(d=>({...d,specs:d.specs.filter(s=>s!=="custom"),specLevels:{...d.specLevels,custom:undefined}}));}} style={{color:C.red,fontWeight:700,fontSize:13,marginLeft:4,cursor:"pointer"}}>×</span>
                </div>
              )}
            </div>

            {/* Adicionar especialidade customizada */}
            {!data.specCustom&&(
              <div style={{marginBottom:16}}>
                <div style={{...B,fontSize:12,fontWeight:600,color:C.sub,marginBottom:8}}>Não encontrou sua especialidade? Cadastre abaixo:</div>
                <div style={{display:"flex",gap:8}}>
                  <input placeholder="Ex: Sommelier, Confeiteiro, Operador de Câmara Fria..."
                    id="custom-spec-input"
                    style={{flex:1,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,color:C.text,outline:"none"}}
                    onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){set("specCustom",e.target.value.trim());toggleArr("specs","custom");e.target.value="";}}} />
                  <button onClick={()=>{const el=document.getElementById("custom-spec-input");if(el&&el.value.trim()){set("specCustom",el.value.trim());if(!data.specs.includes("custom"))toggleArr("specs","custom");el.value="";}}}
                    style={{padding:"10px 16px",borderRadius:8,background:C.green,border:"none",color:"#fff",...B,fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Adicionar</button>
                </div>
              </div>
            )}

            {data.specs.length>0?<Alert type="success">{data.specs.length} especialidade{data.specs.length>1?"s":""} selecionada{data.specs.length>1?"s":""}. No próximo passo você define o nível em cada uma.</Alert>:<Alert type="warning">Selecione ao menos uma especialidade.</Alert>}
          </>}

          {/* ── STEP 4: Nível por especialidade ── */}
          {step===4&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Nível por especialidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Para cada função, informe seu nível de domínio e quanto tempo tem de experiência nela.</p>
            {selectedSpecs.map(s=>(
              <LevelSelector key={s.id} spec={s} levels={data.specLevels} onChange={setSpecLevel} />
            ))}
            {!allLevelsFilled&&<Alert type="warning">Preencha o nível e o tempo de experiência de todas as especialidades.</Alert>}
          </>}

          {/* ── STEP 5: Disponibilidade ── */}
          {step===5&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Disponibilidade</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Marque os turnos disponíveis em cada dia. Deixe em branco os dias que não quer trabalhar.</p>

            {/* Grid header */}
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"4px"}}>
                <thead>
                  <tr>
                    <th style={{...B,fontSize:12,fontWeight:600,color:C.muted,textAlign:"left",padding:"6px 8px",minWidth:48}}></th>
                    {SHIFTS.map(sh=>(
                      <th key={sh.id} style={{...B,fontSize:12,fontWeight:700,color:sh.color,textAlign:"center",padding:"6px 8px",minWidth:90}}>
                        {sh.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day=>{
                    const dayShifts = data.disponibilidade[day]||[];
                    const hasAny = dayShifts.length>0;
                    const toggle = (shiftId) => {
                      const curr = data.disponibilidade[day]||[];
                      const next = curr.includes(shiftId)?curr.filter(s=>s!==shiftId):[...curr,shiftId];
                      setData(d=>({...d,disponibilidade:{...d.disponibilidade,[day]:next}}));
                    };
                    return (
                      <tr key={day}>
                        <td style={{...H,fontSize:13,fontWeight:700,color:hasAny?C.navy:C.muted,padding:"4px 8px",whiteSpace:"nowrap"}}>{day}</td>
                        {SHIFTS.map(sh=>{
                          const on = dayShifts.includes(sh.id);
                          return (
                            <td key={sh.id} style={{padding:"4px"}}>
                              <div onClick={()=>toggle(sh.id)}
                                style={{padding:"10px 8px",borderRadius:9,cursor:"pointer",border:`1.5px solid ${on?sh.color:C.border2}`,background:on?sh.color+"18":"transparent",textAlign:"center",transition:"all .15s",userSelect:"none"}}>
                                <span style={{...B,fontSize:12,fontWeight:on?700:400,color:on?sh.color:C.muted}}>{on?"✓":""}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            {Object.values(data.disponibilidade).some(t=>t.length>0)&&(
              <div style={{marginTop:16,background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"12px 16px"}}>
                <div style={{...B,fontSize:12,fontWeight:600,color:C.green,marginBottom:8}}>✓ Disponibilidade selecionada</div>
                {DAYS.filter(d=>(data.disponibilidade[d]||[]).length>0).map(d=>(
                  <div key={d} style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                    <span style={{...H,fontSize:12,fontWeight:700,color:C.navy,minWidth:32}}>{d}</span>
                    <div style={{display:"flex",gap:5}}>
                      {(data.disponibilidade[d]||[]).map(sid=>{
                        const sh=SHIFTS.find(s=>s.id===sid);
                        return sh?<span key={sid} style={{...B,fontSize:11,fontWeight:600,color:sh.color,background:sh.color+"15",padding:"2px 8px",borderRadius:5}}>{sh.label}</span>:null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>}

          {/* ── STEP 6: Perfil profissional ── */}
          {step===6&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Perfil profissional</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Três perguntas rápidas que ajudam as empresas a entender seu perfil de trabalho.</p>

            <div style={{...B,fontSize:13,fontWeight:600,color:C.navy,marginBottom:12}}>Você já trabalhou em equipe grande (mais de 10 pessoas)?</div>
            <div style={{display:"flex",gap:10,marginBottom:24}}>
              {[{v:true,l:"Sim, tenho experiência"},{v:false,l:"Não ainda"}].map(({v,l})=>(
                <div key={String(v)} onClick={()=>set("trabalhoEquipe",v)}
                  style={{flex:1,padding:"12px 16px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${data.trabalhoEquipe===v?C.green:C.border2}`,background:data.trabalhoEquipe===v?C.greenBg:"transparent",textAlign:"center",...B,fontSize:13,fontWeight:data.trabalhoEquipe===v?600:400,color:data.trabalhoEquipe===v?C.green:C.sub,transition:"all .15s"}}>
                  {l}
                </div>
              ))}
            </div>

            <div style={{...B,fontSize:13,fontWeight:600,color:C.navy,marginBottom:12}}>Tem experiência com atendimento ao cliente?</div>
            <div style={{display:"flex",gap:10,marginBottom:24}}>
              {[{v:true,l:"Sim, tenho experiência"},{v:false,l:"Não ainda"}].map(({v,l})=>(
                <div key={String(v)} onClick={()=>set("atendCliente",v)}
                  style={{flex:1,padding:"12px 16px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${data.atendCliente===v?C.green:C.border2}`,background:data.atendCliente===v?C.greenBg:"transparent",textAlign:"center",...B,fontSize:13,fontWeight:data.atendCliente===v?600:400,color:data.atendCliente===v?C.green:C.sub,transition:"all .15s"}}>
                  {l}
                </div>
              ))}
            </div>

            <div style={{...B,fontSize:13,fontWeight:600,color:C.navy,marginBottom:12}}>Você prefere trabalho:</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {["Físico (movimentação, estoque)","Operacional (caixa, reposição)","Ambos"].map(t=>(
                <div key={t} onClick={()=>set("tipoTrabalho",t)}
                  style={{flex:1,minWidth:140,padding:"12px 16px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${data.tipoTrabalho===t?C.green:C.border2}`,background:data.tipoTrabalho===t?C.greenBg:"transparent",textAlign:"center",...B,fontSize:13,fontWeight:data.tipoTrabalho===t?600:400,color:data.tipoTrabalho===t?C.green:C.sub,transition:"all .15s"}}>
                  {t}
                </div>
              ))}
            </div>
          </>}

          {/* ── STEP 7: Informações adicionais ── */}
          {step===7&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Informações adicionais</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Última etapa antes da foto e documento.</p>

            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:12}}>Pessoa com deficiência (PCD)?</div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              {[{v:true,l:"Sim, sou PCD"},{v:false,l:"Não"}].map(({v,l})=>(
                <div key={String(v)} onClick={()=>set("pcd",v)}
                  style={{flex:1,padding:"12px 16px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${data.pcd===v?C.green:C.border2}`,background:data.pcd===v?C.greenBg:"transparent",textAlign:"center",...B,fontSize:13,fontWeight:data.pcd===v?600:400,color:data.pcd===v?C.green:C.sub,transition:"all .15s"}}>
                  {l}
                </div>
              ))}
            </div>
            {data.pcd&&(
              <Field label="Tipo de deficiência (opcional)" placeholder="Ex: Auditiva, Visual, Física, Intelectual..." value={data.pcdTipo} onChange={v=>set("pcdTipo",v)} helper="Permite que empresas com cotas PCD priorizem seu perfil" />
            )}
            <Alert type="info">Informação usada para conectar com empresas que possuem cotas PCD.</Alert>
          </>}

          {/* ── STEP 8: Foto ── */}
          {step===8&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Foto de perfil</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:18,lineHeight:1.65}}>Perfis com foto recebem muito mais convites de empresas.</p>
            <Alert type="info">Rosto completamente visível · Sem óculos escuros · Fundo neutro · Boa iluminação · Foto recente</Alert>
            <div className={`upload-zone ${data.fotoRosto?"has":""}`} onClick={()=>photoRef.current?.click()}>
              {data.fotoRosto
                ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                  <img src={data.fotoRosto} alt="" style={{width:130,height:130,borderRadius:65,objectFit:"cover",border:`3px solid ${C.green}`}} />
                  <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Foto enviada</span>
                  <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                 </div>
                :<div><div style={{fontSize:52,marginBottom:12}}>📷</div><div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Clique para enviar sua foto</div><div style={{...B,fontSize:13,color:C.muted}}>JPG ou PNG · máx. 5MB</div></div>}
            </div>
            <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"fotoRosto");}} />
          </>}

          {/* ── STEP 9: Documento + Login ── */}
          {step===9&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Documento e conta</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Envie sua selfie com documento para verificação de identidade e crie seu login.</p>

            <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Tipo de documento</div>
            <div style={{display:"flex",gap:12,marginBottom:18}}>
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
                3. Documento legível, sem reflexos · Fundo simples
              </Alert>
              <div className={`upload-zone ${data.selfieDoc?"has":""}`} onClick={()=>selfieRef.current?.click()} style={{marginBottom:16}}>
                {data.selfieDoc
                  ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
                    <img src={data.selfieDoc} alt="" style={{maxWidth:220,maxHeight:165,borderRadius:10,objectFit:"cover",border:`2px solid ${C.green}`}} />
                    <span style={{...H,fontSize:15,fontWeight:700,color:C.green}}>✓ Selfie enviada</span>
                    <span style={{...B,fontSize:12,color:C.muted}}>Clique para substituir</span>
                   </div>
                  :<div><div style={{fontSize:48,marginBottom:12}}>🤳</div><div style={{...H,fontSize:16,fontWeight:700,color:C.navy,marginBottom:6}}>Selfie segurando o {data.docTipo}</div><div style={{...B,fontSize:13,color:C.muted}}>Foto · máx. 10MB</div></div>}
              </div>
              <input ref={selfieRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)readFile(f,"selfieDoc");}} />
              <div style={{...B,fontSize:11,color:C.muted,textAlign:"center",marginBottom:18}}>🔒 Visível apenas à equipe VORKY.</div>
            </>}

            <Div />
            <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Criar login</div>
            <Field label="E-mail" placeholder="seu@email.com" value={data.email} onChange={v=>set("email",v)} type="email" required />
            <div className="g2">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            {submitError&&<Alert type="error">{submitError}</Alert>}
          </>}
        </div>

        {fieldErrors.length>0&&(
          <div style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:10,padding:"12px 16px",marginTop:14}}>
            <div style={{...B,fontSize:13,fontWeight:600,color:C.red,marginBottom:6}}>⚠ Preencha os campos obrigatórios:</div>
            {fieldErrors.map((e,i)=><div key={i} style={{...B,fontSize:13,color:C.red}}>• {e}</div>)}
          </div>
        )}

        <div style={{marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Já tem conta? <span onClick={onBack} style={{color:C.green,cursor:"pointer",fontWeight:600}}>Fazer login</span></span>
          <Btn label={step===9?"Criar minha conta →":"Continuar →"} variant="primary" size="lg" onClick={handleNext} loading={submitting} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPANY REGISTER — 6 steps (unchanged)
// ═══════════════════════════════════════════════════════════════
function CompanyRegister({ onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [cepLoading, setCepLoading] = useState(false);
  const [uCepLoading, setUCepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cnpjChecking, setCnpjChecking] = useState(false);
  const [data, setData] = useState({
    cnpj:"", cnpjExists:false, razao:"", nomeFant:"", site:"", seg:"",
    cep:"", rua:"", numero:"", complemento:"", bairro:"", cidade:"", estado:"",
    respNome:"", respCargo:"", respTel:"", respEmail:"",
    unidades:[],
    email:"", senha:"", confirma:"",
  });
  const [newUnit, setNewUnit] = useState({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  const set = (k,v) => setData(d=>({...d,[k]:v}));
  const senhaError = data.confirma&&data.senha!==data.confirma?"Senhas não coincidem":"";

  const checkCNPJ = async (cnpj) => {
    const raw = cnpj.replace(/\D/g,"");
    if(raw.length!==14) return;
    setCnpjChecking(true);
    const { data: existing } = await supabase.from("companies").select("id").eq("cnpj", cnpj).maybeSingle();
    setCnpjChecking(false);
    set("cnpjExists", !!existing);
  };

  const addUnit = () => {
    if(!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero) return;
    setData(d=>({...d,unidades:[...d.unidades,{...newUnit,id:Date.now()}]}));
    setNewUnit({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  };

  const canNext = {
    1: data.cnpj.replace(/\D/g,"").length===14&&!data.cnpjExists&&data.razao&&data.seg,
    2: data.cep&&data.rua&&data.numero&&data.bairro&&data.cidade,
    3: data.respNome&&data.respCargo&&data.respTel.replace(/\D/g,"").length>=10&&data.respEmail,
    4: true, 5: true,
    6: data.email&&data.senha.length>=8&&!senhaError,
  }[step];

  const next = async () => {
    if(step<6){ setStep(s=>s+1); return; }
    setSubmitting(true); setSubmitError("");
    try { const saved=await saveCompany(data); onDone({...data,id:saved.id}); }
    catch(e){ setSubmitError(e.message||"Erro ao salvar. Tente novamente."); }
    finally { setSubmitting(false); }
  };
  const back = ()=>step>1?setStep(s=>s-1):onBack();
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
              <div>
                <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>CNPJ <span style={{color:C.red}}>*</span></label>
                <input placeholder="00.000.000/0000-00" value={data.cnpj} maxLength={18}
                  onChange={e=>{ set("cnpjExists",false); set("cnpj",maskCNPJ(e.target.value)); }}
                  onBlur={()=>checkCNPJ(data.cnpj)}
                  style={{width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${data.cnpjExists?C.red:C.border2}`,background:"#fff",...B,fontSize:14,color:C.text,outline:"none"}} />
                {cnpjChecking&&<div style={{...B,fontSize:11,color:C.muted,marginTop:5}}>🔍 Verificando CNPJ...</div>}
                {data.cnpjExists&&<div style={{...B,fontSize:11,color:C.red,marginTop:5}}>⚠ CNPJ já cadastrado — se já tem conta, faça login.</div>}
                {!data.cnpjExists&&!cnpjChecking&&data.cnpj.replace(/\D/g,"").length===14&&<div style={{...B,fontSize:11,color:C.green,marginTop:5}}>✓ CNPJ disponível</div>}
              </div>
              <Field label="Nome fantasia" placeholder="Como aparece no sistema" value={data.nomeFant} onChange={v=>set("nomeFant",v)} />
            </div>
            <Field label="Razão social" placeholder="Nome Fantasia Ltda." value={data.razao} onChange={v=>set("razao",v)} required />
            <Field label="Site" placeholder="https://www.suaempresa.com.br" value={data.site} onChange={v=>set("site",v)} helper="Opcional" />
            <div>
              <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:8}}>Segmento <span style={{color:C.red}}>*</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {SEGS.map(s=><div key={s} onClick={()=>set("seg",s)} style={{padding:"7px 14px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${data.seg===s?C.green:C.border2}`,background:data.seg===s?C.greenBg:"transparent",...B,fontSize:13,fontWeight:data.seg===s?600:400,color:data.seg===s?C.green:C.sub,transition:"all .15s"}}>{s}</div>)}
              </div>
            </div>
          </>}
          {step===2&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Endereço da sede</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Endereço principal. As unidades são configuradas no próximo passo.</p>
            <AddressBlock data={data} setData={setData} loading={cepLoading} setLoading={setCepLoading} />
          </>}
          {step===3&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Responsável</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Quem vai gerenciar as vagas e contratações.</p>
            <Field label="Nome completo" placeholder="Maria Souza" value={data.respNome} onChange={v=>set("respNome",v)} required />
            <Field label="Cargo" placeholder="Gerente de Operações" value={data.respCargo} onChange={v=>set("respCargo",v)} required />
            <div className="g2">
              <Field label="WhatsApp" placeholder="(11) 99999-9999" value={data.respTel} onChange={v=>set("respTel",maskPhone(v))} type="tel" maxLength={15} required />
              <Field label="E-mail direto" placeholder="maria@empresa.com.br" value={data.respEmail} onChange={v=>set("respEmail",v)} type="email" required />
            </div>
          </>}
          {step===4&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Unidades de trabalho</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Cada vaga é vinculada a uma unidade. O colaborador vê a distância exata.</p>
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
            {data.unidades.length===0&&<Alert type="warning" style={{marginTop:14}}>Adicione ao menos uma unidade.</Alert>}
            {data.unidades.length>0&&<Alert type="success" style={{marginTop:14}}>{data.unidades.length} unidade{data.unidades.length>1?"s":""} cadastrada{data.unidades.length>1?"s":""}.</Alert>}
          </>}
          {step===5&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Como o VORKY funciona</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Entenda antes de finalizar.</p>
            {[
              {icon:"👁",t:"Você escolhe quem trabalha",d:"No Talent Browser você vê perfis verificados, filtra por especialidade e nível, e convida diretamente."},
              {icon:"📋",t:"Publique vagas por unidade",d:"Cada vaga é vinculada a uma de suas unidades. Colaboradores veem a distância exata."},
              {icon:"🔒",t:"Perfis verificados",d:"Documentos conferidos antes de aparecerem na plataforma."},
              {icon:"⭐",t:"Avaliação bidirecional",d:"Empresa e colaborador se avaliam ao final de cada turno."},
              {icon:"⚖️",t:"Você é o contratante",d:"O VORKY conecta. O vínculo é entre sua empresa e o colaborador."},
            ].map(({icon,t,d})=>(
              <div key={t} style={{display:"flex",gap:14,marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:40,height:40,borderRadius:10,background:C.greenBg,border:`1px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:3}}>{t}</div><div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65}}>{d}</div></div>
              </div>
            ))}
          </>}
          {step===6&&<>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Criar conta</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Dados de acesso ao painel da empresa.</p>
            <Field label="E-mail de acesso" placeholder="acesso@empresa.com.br" value={data.email} onChange={v=>set("email",v)} type="email" required />
            <div className="g2">
              <Field label="Senha" placeholder="Mínimo 8 caracteres" value={data.senha} onChange={v=>set("senha",v)} type="password" required />
              <Field label="Confirmar senha" placeholder="Repita a senha" value={data.confirma} onChange={v=>set("confirma",v)} type="password" hint={senhaError} required />
            </div>
            <Div />
            <div style={{...B,fontSize:11,color:C.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:12}}>Resumo</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px 24px"}}>
              {[["Empresa",data.nomeFant||data.razao],["CNPJ",data.cnpj],["Segmento",data.seg],["Sede",`${data.cidade}/${data.estado}`],["Responsável",data.respNome],["Unidades",`${data.unidades.length} cadastrada${data.unidades.length!==1?"s":""}`]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                  <span style={{...B,fontSize:12,color:C.navy,fontWeight:600}}>{v||"—"}</span>
                </div>
              ))}
            </div>
            {submitError&&<Alert type="error" style={{marginTop:14}}>{submitError}</Alert>}
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
// SUCCESS SCREENS
// ═══════════════════════════════════════════════════════════════
function CompanySuccess({ data, onEnter }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:480,width:"100%",textAlign:"center"}}>
        <div style={{width:96,height:96,borderRadius:48,background:C.greenBg,border:`3px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 24px",animation:"popIn .4s ease both"}}>🏢</div>
        <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,lineHeight:1,marginBottom:14}}>Cadastro enviado!</h2>
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:22}}><strong style={{color:C.navy}}>{data?.nomeFant||data?.razao}</strong> está em análise. Retorno em até <strong style={{color:C.green}}>24 horas úteis</strong>.</p>
        <Alert type="success">Cadastro salvo com sucesso no sistema VORKY! ✓</Alert>
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
        <p style={{...B,fontSize:15,color:C.sub,lineHeight:1.75,marginBottom:22}}>Nossa equipe vai revisar seu documento. Em até <strong style={{color:C.green}}>48 horas úteis</strong> você receberá confirmação.</p>
        <Alert type="success">Cadastro salvo com sucesso! ✓</Alert>
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
    setLoading(true); await new Promise(r=>setTimeout(r,600)); setLoading(false);
    if(email==="admin@vorky.com"&&pass==="vorky2024") onLogin();
    else setError("E-mail ou senha incorretos.");
  };
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:56,height:56,background:C.navy,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26}}>🔐</div>
          <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,marginBottom:6}}>Admin VORKY</h2>
          <p style={{...B,fontSize:14,color:C.muted}}>Acesso restrito à equipe interna</p>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="admin@vorky.com" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          {error&&<Alert type="error">{error}</Alert>}
          <Btn label="Acessar painel" variant="navy" size="lg" full onClick={handleLogin} loading={loading} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
function AdminPanel() {
  const [tab, setTab] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selCompany, setSelCompany] = useState(null);
  const [selWorker, setSelWorker] = useState(null);
  const [rejectModal,  setRejectModal]  = useState(null);
  const [rejectNote,   setRejectNote]   = useState("");
  const [deleteModal,  setDeleteModal]  = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [search,  setSearch]  = useState("");

  const load = async () => {
    setLoading(true);
    try { const [cos,wos]=await Promise.all([fetchCompanies(),fetchWorkers()]); setCompanies(cos||[]); setWorkers(wos||[]); }
    catch(e){ console.error(e); } finally { setLoading(false); }
  };
  useEffect(()=>{ load(); },[]);

  const updateCo = async (id,changes) => { setSaving(true); await updateCompanyDB(id,changes); setCompanies(cs=>cs.map(c=>c.id===id?{...c,...changes}:c)); setSelCompany(s=>s?.id===id?{...s,...changes}:s); setSaving(false); };
  const updateWo = async (id,changes) => { setSaving(true); await updateWorkerDB(id,changes); setWorkers(ws=>ws.map(w=>w.id===id?{...w,...changes}:w)); setSelWorker(s=>s?.id===id?{...s,...changes}:s); setSaving(false); };

  const deleteCo = async (id) => {
    setSaving(true);
    try { await deleteCompanyDB(id); setCompanies(cs=>cs.filter(c=>c.id!==id)); setSelCompany(null); setDeleteModal(null); }
    catch(e){ alert("Erro ao excluir."); } finally { setSaving(false); }
  };
  const deleteWo = async (id) => {
    setSaving(true);
    try { await deleteWorkerDB(id); setWorkers(ws=>ws.filter(w=>w.id!==id)); setSelWorker(null); setDeleteModal(null); }
    catch(e){ alert("Erro ao excluir."); } finally { setSaving(false); }
  };

  const pending_co  = companies.filter(c=>c.status==="pending").length;
  const pending_wo  = workers.filter(w=>w.status==="pending").length;
  const approved_co = companies.filter(c=>c.status==="approved").length;
  const overdue     = companies.filter(c=>c.pay_status==="overdue").length;
  const fmtDate     = iso => iso?new Date(iso).toLocaleDateString("pt-BR"):"—";
  const levelColors = ["#9CA3AF","#60A5FA","#FBBF24","#F97316","#16A34A"];
  const levelWidth  = [0,25,50,75,100];

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
        <p style={{...B,fontSize:14,color:C.sub,marginBottom:16,lineHeight:1.65}}>Informe o motivo. Será enviado por e-mail.</p>
        <div style={{marginBottom:16}}>
          <label style={{...B,fontSize:12,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>Motivo *</label>
          <textarea value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Ex: Documento ilegível. Por favor reenvie com melhor iluminação."
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

  const AdminDeleteModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:C.white,borderRadius:16,padding:28,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
        <h3 style={{...H,fontSize:20,fontWeight:800,color:C.red,marginBottom:8}}>⚠ Excluir permanentemente</h3>
        <p style={{...B,fontSize:14,color:C.sub,marginBottom:8,lineHeight:1.65}}>Você está prestes a excluir <strong>{deleteModal?.name}</strong>.</p>
        <Alert type="error">Esta ação é irreversível. Todos os dados serão apagados do sistema.</Alert>
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Btn label="Cancelar" variant="ghost" size="md" full onClick={()=>setDeleteModal(null)} />
          <Btn label="Excluir definitivamente" variant="danger" size="md" full loading={saving}
            onClick={()=>deleteModal.type==="company"?deleteCo(deleteModal.id):deleteWo(deleteModal.id)} />
        </div>
      </div>
    </div>
  );

  if(loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh",flexDirection:"column",gap:16}}>
      <span style={{width:36,height:36,borderRadius:18,border:`3px solid ${C.border2}`,borderTopColor:C.green,animation:"spin .8s linear infinite",display:"block"}} />
      <div style={{...B,fontSize:14,color:C.muted}}>Carregando dados...</div>
    </div>
  );

  return (
    <div style={{display:"grid",gridTemplateColumns:"220px 1fr",minHeight:"calc(100vh - 60px)"}}>
      {rejectModal&&<RejectModal />}
      {deleteModal&&<AdminDeleteModal />
      <aside style={{background:C.white,borderRight:`1px solid ${C.border}`,padding:"20px 0",position:"sticky",top:60,height:"calc(100vh - 60px)",overflowY:"auto"}}>
        <div style={{padding:"0 16px 18px",borderBottom:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{...B,fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Painel Interno</div>
          <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Equipe VORKY</div>
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

      <main style={{padding:"28px 32px",background:C.bg,minWidth:0}}>

        {tab==="dashboard"&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Dashboard</h2>
            <p style={{...B,fontSize:14,color:C.muted,marginBottom:24}}>Visão geral da plataforma</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
              {[{v:companies.length,l:"Empresas",c:C.navy,icon:"🏢",sub:`${pending_co} pendentes`},{v:workers.length,l:"Colaboradores",c:C.blue,icon:"👥",sub:`${pending_wo} pendentes`},{v:approved_co,l:"Ativas",c:C.green,icon:"✓",sub:"empresas aprovadas"},{v:overdue,l:"Em atraso",c:C.red,icon:"⚠",sub:"inadimplentes"}].map(({v,l,c,icon,sub})=>(
                <div key={l} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:22}}>{icon}</span><div style={{...H,fontSize:30,fontWeight:900,color:c}}>{v}</div></div>
                  <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{l}</div>
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:2}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Empresas pendentes</div>
                </div>
                {companies.filter(c=>c.status==="pending").length===0?<div style={{padding:32,textAlign:"center",...B,fontSize:13,color:C.muted}}>Nenhuma ✓</div>:companies.filter(c=>c.status==="pending").map(co=>(
                  <div key={co.id} className="card-h" onClick={()=>{setTab("companies");setSelCompany(co);}} style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div>
                    <div style={{...B,fontSize:12,color:C.muted}}>{co.seg} · {co.cidade} · {fmtDate(co.created_at)}</div>
                  </div>
                ))}
              </div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Colaboradores pendentes</div>
                </div>
                {workers.filter(w=>w.status==="pending").length===0?<div style={{padding:32,textAlign:"center",...B,fontSize:13,color:C.muted}}>Nenhum ✓</div>:workers.filter(w=>w.status==="pending").map(wo=>(
                  <div key={wo.id} className="card-h" onClick={()=>{setTab("workers");setSelWorker(wo);}} style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{wo.nome}</div>
                    <div style={{...B,fontSize:12,color:C.muted}}>{wo.cidade} · {wo.specs?.length||0} especialidades · {fmtDate(wo.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab==="companies"&&!selCompany&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:16}}>Empresas</h2>
            <input placeholder="🔍 Buscar por nome ou CNPJ..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",maxWidth:400,padding:"9px 14px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,marginBottom:16,outline:"none"}} />
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                {["Empresa","Segmento","Unidades","Status","Pagamento"].map(h=><div key={h} style={{...B,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
              </div>
              {companies.filter(c=>!search||(c.nome_fant||c.razao||"").toLowerCase().includes(search.toLowerCase())||c.cnpj?.includes(search)).length===0
                ?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhuma empresa encontrada.</div>
                :companies.filter(c=>!search||(c.nome_fant||c.razao||"").toLowerCase().includes(search.toLowerCase())||c.cnpj?.includes(search)).map(co=>(
                <div key={co.id} className="card-h" onClick={()=>setSelCompany(co)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div><div style={{...B,fontSize:12,color:C.muted}}>{co.cnpj} · {co.cidade}/{co.estado}</div></div>
                  <div style={{...B,fontSize:13,color:C.sub}}>{co.seg}</div>
                  <div style={{...B,fontSize:13,color:C.sub}}>{co.company_units?.length||0}</div>
                  <Badge status={co.status} />
                  <Badge status={co.pay_status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="companies"&&selCompany&&(
          <div>
            <button onClick={()=>setSelCompany(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:20,alignItems:"start"}}>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
                  <div><h3 style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:4}}>{selCompany.nome_fant||selCompany.razao}</h3><div style={{...B,fontSize:13,color:C.muted}}>{selCompany.razao}</div></div>
                  <div style={{display:"flex",gap:8}}><Badge status={selCompany.status} /><Badge status={selCompany.pay_status} /></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",marginBottom:20}}>
                  {[["CNPJ",selCompany.cnpj],["Segmento",selCompany.seg],["Site",selCompany.site||"—"],["Cadastro",fmtDate(selCompany.created_at)],["Cidade",`${selCompany.cidade}/${selCompany.estado}`]].map(([k,v])=>(
                    <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div><div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</div></div>
                  ))}
                </div>
                <Div />
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Responsável</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px",marginBottom:20}}>
                  {[["Nome",selCompany.resp_nome],["Cargo",selCompany.resp_cargo],["WhatsApp",selCompany.resp_tel],["E-mail",selCompany.resp_email]].map(([k,v])=>(
                    <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div><div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v||"—"}</div></div>
                  ))}
                </div>
                {selCompany.company_units?.length>0&&<>
                  <Div />
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:12}}>Unidades ({selCompany.company_units.length})</div>
                  {selCompany.company_units.map(u=>(
                    <div key={u.id} style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"12px 16px",marginBottom:8}}>
                      <div style={{...H,fontSize:13,fontWeight:700,color:C.navy}}>{u.nome}</div>
                      <div style={{...B,fontSize:12,color:C.sub,marginTop:2}}>{u.rua}, {u.numero} — {u.cidade}/{u.estado}</div>
                    </div>
                  ))}
                </>}
                {selCompany.reject_note&&<><Div /><Alert type="error"><strong>Motivo da reprovação:</strong> {selCompany.reject_note}</Alert></>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {selCompany.status==="pending"&&(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Decisão</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <Btn label="✓ Aprovar" variant="approve" size="md" full loading={saving} onClick={()=>updateCo(selCompany.id,{status:"approved",pay_status:"trial",plan:"Trial (30 dias)"})} />
                    <Btn label="✕ Reprovar" variant="danger" size="md" full onClick={()=>setRejectModal({id:selCompany.id,type:"company"})} />
                  </div>
                </div>)}
                {selCompany.status==="approved"&&<>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}}>Plano</div>
                    {PLANS.map(p=>(
                      <div key={p} onClick={()=>updateCo(selCompany.id,{plan:p})} style={{padding:"8px 12px",borderRadius:7,cursor:"pointer",border:`1.5px solid ${selCompany.plan===p?C.green:C.border2}`,background:selCompany.plan===p?C.greenBg:"transparent",...B,fontSize:12,color:selCompany.plan===p?C.green:C.sub,marginBottom:5,transition:"all .15s"}}>
                        {selCompany.plan===p?"✓ ":""}{p}
                      </div>
                    ))}
                  </div>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}}>Pagamento</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <Btn label="✓ Marcar como pago" variant="approve" size="sm" full loading={saving} onClick={()=>updateCo(selCompany.id,{pay_status:"paid"})} />
                      <Btn label="! Marcar em atraso" variant="danger" size="sm" full onClick={()=>updateCo(selCompany.id,{pay_status:"overdue"})} />
                    </div>
                  </div>
                </>}
                {selCompany.status==="rejected"&&(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <Btn label="↩ Reabrir para análise" variant="amber" size="sm" full loading={saving} onClick={()=>updateCo(selCompany.id,{status:"pending",reject_note:"",pay_status:"trial"})} />
                </div>)}
                <div style={{background:C.white,border:`1px solid ${C.redBorder}`,borderRadius:12,padding:20}}>
                  <div style={{...H,fontSize:13,fontWeight:700,color:C.red,marginBottom:10}}>Zona de perigo</div>
                  <Btn label="🗑 Excluir empresa" variant="danger" size="sm" full onClick={()=>setDeleteModal({id:selCompany.id,name:selCompany.nome_fant||selCompany.razao,type:"company"})} />
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:8}}>Remove permanentemente todos os dados desta empresa.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="workers"&&!selWorker&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:16}}>Colaboradores</h2>
            <input placeholder="🔍 Buscar por nome ou CPF..." value={search} onChange={e=>setSearch(e.target.value)}
              style={{width:"100%",maxWidth:400,padding:"9px 14px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,marginBottom:16,outline:"none"}} />
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"12px 20px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
                {["Colaborador","Especialidades","Disponibilidade","Status"].map(h=><div key={h} style={{...B,fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</div>)}
              </div>
              {workers.filter(w=>!search||w.nome?.toLowerCase().includes(search.toLowerCase())||w.cpf?.includes(search)).length===0
                ?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhum colaborador encontrado.</div>
                :workers.filter(w=>!search||w.nome?.toLowerCase().includes(search.toLowerCase())||w.cpf?.includes(search)).map(wo=>(
                <div key={wo.id} className="card-h" onClick={()=>setSelWorker(wo)} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{wo.nome}</div><div style={{...B,fontSize:12,color:C.muted}}>{wo.cpf} · {wo.cidade} · {fmtDate(wo.created_at)}</div></div>
                  <div style={{...B,fontSize:12,color:C.sub}}>{wo.specs?.length||0} esp.</div>
                  <div style={{...B,fontSize:12,color:C.sub}}>{wo.dias?.length||0}d</div>
                  <Badge status={wo.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="workers"&&selWorker&&(
          <div>
            <button onClick={()=>setSelWorker(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
              <div>
                {/* Dados pessoais */}
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                    <div><h3 style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:4}}>{selWorker.nome}</h3><div style={{...B,fontSize:13,color:C.muted}}>{selWorker.cidade}/{selWorker.estado} · {selWorker.raio_km||10}km de raio</div></div>
                    <Badge status={selWorker.status} />
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px"}}>
                    {[["CPF",selWorker.cpf],["Nascimento",selWorker.nascimento],["WhatsApp",selWorker.telefone],["E-mail",selWorker.email],["Deslocamento",selWorker.deslocamento||"—"],["PCD",selWorker.pcd?(selWorker.pcd_tipo||"Sim"):"Não"],["Documento",selWorker.doc_tipo||"—"]].map(([k,v])=>(
                      <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div><div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v||"—"}</div></div>
                    ))}
                  </div>
                </div>

                {/* Especialidades com nível */}
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
                  <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Especialidades e experiência</div>
                  {SPECS.filter(s=>selWorker.specs?.includes(s.id)).map(s=>{
                    const sl = selWorker.spec_levels?.[s.id];
                    const nivel = sl?.nivel||0;
                    return (
                      <div key={s.id} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{s.icon}</span><span style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{s.label}</span></div>
                          <div style={{display:"flex",gap:8,alignItems:"center"}}>
                            <span style={{...B,fontSize:12,fontWeight:600,color:levelColors[nivel]}}>{LEVELS[nivel]?.label||"—"}</span>
                            {sl?.experiencia&&<span style={{...B,fontSize:11,color:C.muted}}>· {sl.experiencia}</span>}
                          </div>
                        </div>
                        <div className="level-bar" style={{marginBottom:sl?.empresas?.length>0?8:0}}><div className="level-fill" style={{width:`${levelWidth[nivel]}%`,background:levelColors[nivel]}} /></div>
                        {sl?.empresas?.length>0&&(
                          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                            <span style={{...B,fontSize:11,color:C.muted}}>Trabalhou em:</span>
                            {sl.empresas.map((emp,i)=>(
                              <span key={i} style={{...B,fontSize:11,fontWeight:600,color:C.navy,background:C.bg,border:`1px solid ${C.border2}`,borderRadius:5,padding:"2px 8px"}}>{emp}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(!selWorker.specs||selWorker.specs.length===0)&&<div style={{...B,fontSize:13,color:C.muted}}>Nenhuma especialidade</div>}
                </div>

                {/* Equipamentos + Disponibilidade + Perfil */}
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
                  <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>Disponibilidade</div>
                  {selWorker.disponibilidade&&Object.keys(selWorker.disponibilidade).filter(d=>selWorker.disponibilidade[d]?.length>0).length>0?(
                    <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                      {DAYS.filter(d=>(selWorker.disponibilidade[d]||[]).length>0).map(d=>(
                        <div key={d} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{...H,fontSize:12,fontWeight:700,color:C.navy,minWidth:32}}>{d}</span>
                          <div style={{display:"flex",gap:5}}>
                            {(selWorker.disponibilidade[d]||[]).map(sid=>{
                              const sh=SHIFTS.find(s=>s.id===sid);
                              return sh?<span key={sid} style={{...B,fontSize:11,fontWeight:600,color:sh.color,background:sh.color+"15",padding:"2px 9px",borderRadius:5}}>{sh.label}</span>:null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                      {DAYS.map(d=>{const on=selWorker.dias?.includes(d);return <div key={d} style={{padding:"5px 11px",borderRadius:7,background:on?C.greenBg:C.bg,border:`1px solid ${on?C.greenBorder:C.border}`}}><span style={{...B,fontSize:12,fontWeight:600,color:on?C.green:C.muted}}>{d}</span></div>;})}
                    </div>
                  )}
                  {selWorker.equipamentos?.length>0&&<>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:10}}>Equipamentos</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
                      {selWorker.equipamentos.map(eq=><span key={eq} style={{...B,fontSize:12,background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:7,padding:"5px 11px",color:C.green,fontWeight:500}}>{eq}</span>)}
                    </div>
                  </>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    {[["Trabalho em equipe",selWorker.trabalho_equipe?"Sim":"Não"],["Atend. ao cliente",selWorker.atend_cliente?"Sim":"Não"],["Preferência",selWorker.tipo_trabalho||"—"]].map(([k,v])=>(
                      <div key={k} style={{background:C.bg,borderRadius:9,padding:"12px 14px",textAlign:"center"}}>
                        <div style={{...B,fontSize:11,color:C.muted,marginBottom:4}}>{k}</div>
                        <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos */}
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
                  <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>Documentos enviados</div>
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

                {selWorker.reject_note&&<Alert type="error" style={{marginTop:14}}><strong>Motivo da reprovação:</strong> {selWorker.reject_note}</Alert>}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {selWorker.status==="pending"&&(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>Decisão</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <Btn label="✓ Aprovar perfil" variant="approve" size="md" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"approved"})} />
                    <Btn label="✕ Reprovar" variant="danger" size="md" full onClick={()=>setRejectModal({id:selWorker.id,type:"worker"})} />
                  </div>
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:12,lineHeight:1.6}}>Verifique os documentos antes de aprovar.</div>
                </div>)}
                {selWorker.status==="approved"&&(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <Alert type="success">Perfil ativo na plataforma.</Alert>
                  <Btn label="Suspender" variant="danger" size="sm" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"rejected",reject_note:"Perfil suspenso."})} />
                </div>)}
                {selWorker.status==="rejected"&&(<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
                  <Btn label="↩ Reabrir" variant="amber" size="sm" full loading={saving} onClick={()=>updateWo(selWorker.id,{status:"pending",reject_note:""})} />
                </div>)}
                <div style={{background:C.white,border:`1px solid ${C.redBorder}`,borderRadius:12,padding:20}}>
                  <div style={{...H,fontSize:13,fontWeight:700,color:C.red,marginBottom:10}}>Zona de perigo</div>
                  <Btn label="🗑 Excluir colaborador" variant="danger" size="sm" full onClick={()=>setDeleteModal({id:selWorker.id,name:selWorker.nome,type:"worker"})} />
                  <div style={{...B,fontSize:11,color:C.muted,marginTop:8}}>Remove permanentemente todos os dados deste colaborador.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==="billing"&&(
          <div>
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Cobranças</h2>
            <p style={{...B,fontSize:14,color:C.muted,marginBottom:22}}>Gestão de planos e pagamentos.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:28}}>
              {[{v:companies.filter(c=>c.pay_status==="paid").length,l:"Pagamentos confirmados",c:C.green,icon:"💰"},{v:companies.filter(c=>c.pay_status==="trial").length,l:"Em trial",c:C.blue,icon:"⏱"},{v:overdue,l:"Em atraso",c:C.red,icon:"⚠"}].map(({v,l,c,icon})=>(
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
              {companies.filter(c=>c.status==="approved").length===0?<div style={{padding:48,textAlign:"center",...B,fontSize:14,color:C.muted}}>Nenhuma empresa aprovada ainda.</div>:companies.filter(c=>c.status==="approved").map(co=>(
                <div key={co.id} style={{display:"grid",gridTemplateColumns:"2fr 2fr 1fr 1fr",padding:"14px 20px",borderBottom:`1px solid ${C.border}`,alignItems:"center"}}>
                  <div><div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{co.nome_fant||co.razao}</div><div style={{...B,fontSize:12,color:C.muted}}>{co.seg}</div></div>
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

// ─── AUTH ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
// CEP → LAT/LNG + HAVERSINE DISTANCE
// ═══════════════════════════════════════════════════════════════
const cepToCoords = async (cep) => {
  const d = cep.replace(/\D/g,"");
  try {
    const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const j = await r.json();
    if(j.erro) return null;
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(j.logradouro+", "+j.localidade+", "+j.uf+", Brasil")}&format=json&limit=1`);
    const gj = await geo.json();
    if(gj.length===0) return null;
    return { lat: parseFloat(gj[0].lat), lng: parseFloat(gj[0].lon) };
  } catch { return null; }
};

const haversine = (lat1, lng1, lat2, lng2) => {
  const R=6371, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
};

// ═══════════════════════════════════════════════════════════════
// COMPANY LOGIN (real — loads from Supabase)
// ═══════════════════════════════════════════════════════════════
function CompanyLogin({ onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if(!email||!pass){ setError("Preencha e-mail e senha."); return; }
    setLoading(true); setError("");
    try {
      const { data: company, error: err } = await supabase
        .from("companies")
        .select("*, company_units(*)")
        .eq("email", email)
        .maybeSingle();

      if(err||!company) { setError("E-mail não encontrado."); setLoading(false); return; }
      if(company.status==="pending") { setError("Seu cadastro ainda está em análise. Aguarde a aprovação da equipe VORKY."); setLoading(false); return; }
      if(company.status==="rejected") { setError("Seu cadastro foi reprovado. Entre em contato com a equipe VORKY."); setLoading(false); return; }
      onLogin(company);
    } catch(e) {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <button onClick={onBack} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:24}}>← Voltar</button>
        <SL>Área da Empresa</SL>
        <h2 style={{...H,fontSize:32,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:28}}>Bem-vindo de volta.</h2>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail de acesso" placeholder="acesso@empresa.com.br" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          {error&&<Alert type="error">{error}</Alert>}
          <Btn label="Entrar →" variant="primary" size="lg" full onClick={handleLogin} loading={loading} />
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
            <div style={{flex:1,height:1,background:C.border}} /><span style={{...B,fontSize:12,color:C.muted}}>ou</span><div style={{flex:1,height:1,background:C.border}} />
          </div>
          <Btn label="Cadastrar minha empresa →" variant="ghost" size="lg" full onClick={onRegister} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TALENT BROWSER
// ═══════════════════════════════════════════════════════════════
function TalentBrowser({ company, onLogout, onUpdateCompany }) {
  const [tab,       setTab]       = useState("talent");
  const [selUnit,   setSelUnit]   = useState(null);
  const [workers,   setWorkers]   = useState([]);
  const [filtered,  setFiltered]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [calcMsg,   setCalcMsg]   = useState("");
  const [selWorker, setSelWorker] = useState(null);
  const [units,     setUnits]     = useState(company.company_units||[]);
  const [savingUnit,setSavingUnit]= useState(false);
  const [uCepLoad,  setUCepLoad]  = useState(false);
  const [newUnit,   setNewUnit]   = useState({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
  const [deleteModal, setDeleteModal] = useState(null); // {type, id, name}

  const fSpec  = useState("all");   const [fSpecV,  setFSpec]  = [fSpec[0],  fSpec[1]];
  const fLevel = useState(0);       const [fLevelV, setFLevel] = [fLevel[0], fLevel[1]];
  const fDia   = useState("all");   const [fDiaV,   setFDia]   = [fDia[0],   fDia[1]];
  const fTurno = useState("all");   const [fTurnoV, setFTurno] = [fTurno[0], fTurno[1]];

  const levelColors = ["#9CA3AF","#60A5FA","#FBBF24","#F97316","#16A34A"];
  const levelWidth  = [0,25,50,75,100];

  useEffect(()=>{ if(selUnit) loadWorkers(); },[selUnit]);

  useEffect(()=>{
    let list=workers;
    if(fSpecV!=="all") list=list.filter(w=>w.specs?.includes(fSpecV)&&(w.spec_levels?.[fSpecV]?.nivel||0)>=fLevelV);
    if(fDiaV!=="all")  list=list.filter(w=>(w.disponibilidade?.[fDiaV]||[]).length>0);
    if(fTurnoV!=="all") list=list.filter(w=>Object.values(w.disponibilidade||{}).some(t=>t.includes(fTurnoV)));
    setFiltered(list);
  },[workers,fSpecV,fLevelV,fDiaV,fTurnoV]);

  const loadWorkers = async () => {
    setLoading(true); setCalcMsg("Buscando colaboradores aprovados..."); setWorkers([]); setFiltered([]);
    try {
      const { data: wList } = await supabase.from("workers").select("*").eq("status","approved");
      if(!wList||wList.length===0){ setLoading(false); setCalcMsg("Nenhum colaborador aprovado ainda."); return; }
      setCalcMsg(`Calculando distâncias para ${wList.length} colaboradores...`);
      const unitCoords = await cepToCoords(selUnit.cep);
      const withDist = await Promise.all(wList.map(async w=>{
        try {
          const wCoords = await cepToCoords(w.cep);
          if(!unitCoords||!wCoords) return {...w,distKm:999,distLabel:"—",withinRadius:false};
          const dist = haversine(unitCoords.lat,unitCoords.lng,wCoords.lat,wCoords.lng);
          return {...w,distKm:dist,distLabel:`${dist.toFixed(1)}km`,withinRadius:dist<=(w.raio_km||10)};
        } catch { return {...w,distKm:999,distLabel:"—",withinRadius:false}; }
      }));
      const available = withDist.filter(w=>w.withinRadius).sort((a,b)=>a.distKm-b.distKm);
      setWorkers(available); setFiltered(available);
      setCalcMsg(`${available.length} colaboradores disponíveis na região`);
    } catch(e) { setCalcMsg("Erro ao buscar colaboradores."); }
    finally { setLoading(false); }
  };

  const addUnit = async () => {
    if(!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero) return;
    setSavingUnit(true);
    try {
      const saved = await addUnitToDB(company.id, newUnit);
      const updated = [...units, saved];
      setUnits(updated);
      onUpdateCompany({...company, company_units: updated});
      setNewUnit({nome:"",cep:"",rua:"",numero:"",complemento:"",bairro:"",cidade:"",estado:""});
    } catch(e){ alert("Erro ao salvar unidade."); }
    finally { setSavingUnit(false); }
  };

  const removeUnit = async (unitId) => {
    try {
      await deleteUnitFromDB(unitId);
      const updated = units.filter(u=>u.id!==unitId);
      setUnits(updated);
      if(selUnit?.id===unitId){ setSelUnit(null); setWorkers([]); setFiltered([]); }
    } catch(e){ alert("Erro ao remover unidade."); }
    finally { setDeleteModal(null); }
  };

  const whatsappMsg = (w) => {
    const msg = `Olá ${w.nome.split(" ")[0]}! Sou da empresa *${company.nome_fant||company.razao}* e encontrei seu perfil no VORKY. Temos uma oportunidade de trabalho na nossa unidade *${selUnit?.nome}*. Podemos conversar?`;
    return `https://wa.me/55${w.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;
  };

  // Delete confirmation modal
  const DeleteModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,padding:28,maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
        <h3 style={{...H,fontSize:20,fontWeight:800,color:C.navy,marginBottom:8}}>Remover unidade</h3>
        <p style={{...B,fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.65}}>Tem certeza que deseja remover a unidade <strong>{deleteModal?.name}</strong>? Esta ação não pode ser desfeita.</p>
        <div style={{display:"flex",gap:10}}>
          <Btn label="Cancelar" variant="ghost" size="md" full onClick={()=>setDeleteModal(null)} />
          <Btn label="Remover" variant="danger" size="md" full onClick={()=>removeUnit(deleteModal.id)} />
        </div>
      </div>
    </div>
  );

  const TABS = [{id:"talent",icon:"🔍",label:"Talent Browser"},{id:"profile",icon:"🏢",label:"Meu Perfil"}];

  // Worker detail modal
  if(selWorker) return (
    <div style={{minHeight:"90vh",padding:"28px 32px",background:C.bg}}>
      <div style={{maxWidth:780,margin:"0 auto"}}>
        <button onClick={()=>setSelWorker(null)} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:22}}>← Voltar ao Talent Browser</button>

        <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:20,alignItems:"start"}}>
          <div>
            {/* Header */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
              <div style={{display:"flex",gap:18,alignItems:"center",marginBottom:20}}>
                <div style={{width:72,height:72,borderRadius:36,background:C.greenBg,border:`2px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{...H,fontSize:26,fontWeight:900,color:C.green}}>{selWorker.nome?.[0]}</span>
                </div>
                <div>
                  <h3 style={{...H,fontSize:22,fontWeight:900,color:C.navy,marginBottom:4}}>{selWorker.nome}</h3>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <span style={{...B,fontSize:13,color:C.muted}}>📍 {selWorker.cidade}/{selWorker.estado}</span>
                    <span style={{...B,fontSize:13,color:C.green,fontWeight:600}}>📏 {selWorker.distLabel} da unidade</span>
                    <span style={{...B,fontSize:13,color:C.muted}}>🚗 Raio até {selWorker.raio_km||10}km</span>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 32px"}}>
                {[["Deslocamento",selWorker.deslocamento||"—"],["Tipo de trabalho",selWorker.tipo_trabalho||"—"],["Equipe grande",selWorker.trabalho_equipe?"Sim":"Não"],["Atend. ao cliente",selWorker.atend_cliente?"Sim":"Não"],["PCD",selWorker.pcd?(selWorker.pcd_tipo||"Sim"):"Não"]].map(([k,v])=>(
                  <div key={k} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{...B,fontSize:11,color:C.muted,marginBottom:2}}>{k}</div>
                    <div style={{...B,fontSize:13,color:C.navy,fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Especialidades */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
              <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Especialidades e experiência</div>
              {SPECS.filter(s=>selWorker.specs?.includes(s.id)).map(s=>{
                const sl=selWorker.spec_levels?.[s.id]; const nivel=sl?.nivel||0;
                return (
                  <div key={s.id} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{s.icon}</span><span style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{s.label}</span></div>
                      <div style={{display:"flex",gap:8,alignItems:"center"}}>
                        <span style={{...B,fontSize:12,fontWeight:600,color:levelColors[nivel]}}>{LEVELS[nivel]?.label||"—"}</span>
                        {sl?.experiencia&&<span style={{...B,fontSize:11,color:C.muted}}>· {sl.experiencia}</span>}
                      </div>
                    </div>
                    <div className="level-bar"><div className="level-fill" style={{width:`${levelWidth[nivel]}%`,background:levelColors[nivel]}} /></div>
                    {sl?.empresas?.length>0&&(
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                        <span style={{...B,fontSize:11,color:C.muted}}>Trabalhou em:</span>
                        {sl.empresas.map((emp,i)=><span key={i} style={{...B,fontSize:11,fontWeight:600,color:C.navy,background:C.bg,border:`1px solid ${C.border2}`,borderRadius:5,padding:"2px 8px"}}>{emp}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
              {selWorker.specs?.includes("custom")&&selWorker.spec_levels?.custom&&(
                <div style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>⭐</span><span style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{selWorker.spec_levels.custom.label||"Especialidade própria"}</span></div>
                    <span style={{...B,fontSize:12,fontWeight:600,color:levelColors[selWorker.spec_levels.custom.nivel||0]}}>{LEVELS[selWorker.spec_levels.custom.nivel||0]?.label}</span>
                  </div>
                  <div className="level-bar"><div className="level-fill" style={{width:`${levelWidth[selWorker.spec_levels.custom.nivel||0]}%`,background:levelColors[selWorker.spec_levels.custom.nivel||0]}} /></div>
                </div>
              )}
            </div>

            {/* Disponibilidade */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
              <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Disponibilidade</div>
              {DAYS.filter(d=>(selWorker.disponibilidade?.[d]||[]).length>0).map(d=>(
                <div key={d} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{...H,fontSize:13,fontWeight:700,color:C.navy,minWidth:36}}>{d}</span>
                  <div style={{display:"flex",gap:6}}>
                    {(selWorker.disponibilidade[d]||[]).map(sid=>{
                      const sh=SHIFTS.find(s=>s.id===sid);
                      return sh?<span key={sid} style={{...B,fontSize:12,fontWeight:600,color:sh.color,background:sh.color+"15",padding:"3px 10px",borderRadius:6}}>{sh.label}</span>:null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action panel */}
          <div style={{position:"sticky",top:80}}>
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:22,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
              <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:6}}>Convidar {selWorker.nome.split(" ")[0]}</div>
              <div style={{...B,fontSize:13,color:C.sub,marginBottom:20,lineHeight:1.65}}>
                Uma mensagem pré-formatada será aberta no WhatsApp com o contato deste colaborador.
              </div>
              <a href={whatsappMsg(selWorker)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <div style={{background:"#25D366",borderRadius:10,padding:"14px 20px",textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{fontSize:20}}>💬</span>
                  <span style={{...H,fontSize:15,fontWeight:700,color:"#fff"}}>Convidar pelo WhatsApp</span>
                </div>
              </a>
              <div style={{...B,fontSize:11,color:C.muted,textAlign:"center",marginTop:10,lineHeight:1.6}}>
                Ao clicar, o WhatsApp abre com uma mensagem pronta. Você edita antes de enviar.
              </div>
              <Div />
              <div style={{...B,fontSize:12,color:C.muted}}>📍 Unidade: <strong style={{color:C.navy}}>{selUnit?.nome}</strong></div>
              <div style={{...B,fontSize:12,color:C.muted,marginTop:4}}>📏 Distância: <strong style={{color:C.green}}>{selWorker.distLabel}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"90vh",background:C.bg}}>
      {deleteModal&&<DeleteModal />}

      {/* Header */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"14px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{...H,fontSize:17,fontWeight:900,color:C.navy}}>{company.nome_fant||company.razao}</div>
          <div style={{...B,fontSize:12,color:C.muted}}>{company.seg} · {company.cidade}/{company.estado}</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Badge status={company.status} />
          <Btn label="Sair" variant="ghost" size="sm" onClick={onLogout} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",padding:"0 32px"}}>
        {TABS.map(t=>(
          <button key={t.id} className={`tab-btn ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)} style={{maxWidth:180}}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 32px"}}>

        {/* ── TAB: TALENT BROWSER ── */}
        {tab==="talent"&&<>
          {/* Unit selector */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:22,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Selecione a unidade onde precisa de colaboradores</div>
              {units.length===0&&<Btn label="+ Adicionar unidade" variant="outline" size="sm" onClick={()=>setTab("profile")} />}
            </div>
            {units.length===0
              ? <div style={{background:C.amberBg,border:`1px solid ${C.amberBorder}`,borderRadius:10,padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                  <span style={{fontSize:28}}>⚠️</span>
                  <div>
                    <div style={{...H,fontSize:14,fontWeight:700,color:C.amber,marginBottom:4}}>Nenhuma unidade cadastrada</div>
                    <div style={{...B,fontSize:13,color:C.sub,marginBottom:10}}>Você precisa cadastrar ao menos uma unidade para buscar colaboradores na região.</div>
                    <Btn label="Ir para Meu Perfil →" variant="amber" size="sm" onClick={()=>setTab("profile")} />
                  </div>
                </div>
              : <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {units.map(u=>(
                    <div key={u.id} onClick={()=>{setSelUnit(u);setWorkers([]);setFiltered([]);}}
                      style={{padding:"12px 18px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${selUnit?.id===u.id?C.green:C.border2}`,background:selUnit?.id===u.id?C.greenBg:"#fff",transition:"all .15s"}}>
                      <div style={{...H,fontSize:14,fontWeight:700,color:selUnit?.id===u.id?C.green:C.navy}}>{u.nome}</div>
                      <div style={{...B,fontSize:12,color:C.muted,marginTop:2}}>📍 {u.bairro}, {u.cidade}/{u.estado}</div>
                      <div style={{...B,fontSize:11,color:C.muted,marginTop:1}}>CEP: {u.cep}</div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {selUnit&&<>
            {/* Status bar */}
            <div style={{background:loading?C.amberBg:C.greenBg,border:`1px solid ${loading?C.amberBorder:C.greenBorder}`,borderRadius:10,padding:"10px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
              {loading&&<span style={{width:14,height:14,borderRadius:7,border:`2px solid ${C.amber}`,borderTopColor:"transparent",animation:"spin .7s linear infinite",display:"inline-block",flexShrink:0}} />}
              <span style={{...B,fontSize:13,fontWeight:600,color:loading?C.amber:C.green}}>{calcMsg||`Unidade: ${selUnit.nome}`}</span>
              {!loading&&<Btn label="↻ Atualizar" variant="ghost" size="sm" onClick={loadWorkers} />}
            </div>

            {/* Filters */}
            {!loading&&workers.length>0&&(
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",marginBottom:16,display:"flex",gap:16,flexWrap:"wrap",alignItems:"flex-end"}}>
                <div>
                  <label style={{...B,fontSize:11,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>ESPECIALIDADE</label>
                  <select value={fSpecV} onChange={e=>{setFSpec(e.target.value);setFLevel(0);}}
                    style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,cursor:"pointer"}}>
                    <option value="all">Todas</option>
                    {SPECS.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                  </select>
                </div>
                {fSpecV!=="all"&&(
                  <div>
                    <label style={{...B,fontSize:11,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>NÍVEL MÍNIMO</label>
                    <select value={fLevelV} onChange={e=>setFLevel(parseInt(e.target.value))}
                      style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,cursor:"pointer"}}>
                      {LEVELS.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label style={{...B,fontSize:11,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>DIA</label>
                  <select value={fDiaV} onChange={e=>setFDia(e.target.value)}
                    style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,cursor:"pointer"}}>
                    <option value="all">Todos os dias</option>
                    {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{...B,fontSize:11,fontWeight:600,color:C.sub,display:"block",marginBottom:6}}>TURNO</label>
                  <select value={fTurnoV} onChange={e=>setFTurno(e.target.value)}
                    style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border2}`,background:"#fff",...B,fontSize:13,cursor:"pointer"}}>
                    <option value="all">Todos os turnos</option>
                    {SHIFTS.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div style={{...B,fontSize:12,color:C.muted,marginLeft:"auto"}}>
                  {filtered.length} colaborador{filtered.length!==1?"es":""} encontrado{filtered.length!==1?"s":""}
                </div>
              </div>
            )}

            {!loading&&filtered.length===0&&workers.length===0&&(
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:56,textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:14}}>🔍</div>
                <div style={{...H,fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>Nenhum colaborador encontrado</div>
                <div style={{...B,fontSize:14,color:C.muted}}>Não há colaboradores aprovados dentro do raio de cobertura desta unidade ainda.</div>
              </div>
            )}
            {!loading&&filtered.length===0&&workers.length>0&&(
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:56,textAlign:"center"}}>
                <div style={{fontSize:48,marginBottom:14}}>🎯</div>
                <div style={{...H,fontSize:18,fontWeight:700,color:C.navy,marginBottom:8}}>Nenhum resultado com esses filtros</div>
                <div style={{...B,fontSize:14,color:C.muted}}>Tente remover alguns filtros.</div>
              </div>
            )}
            {!loading&&filtered.length>0&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
                {filtered.map(w=>(
                  <div key={w.id} onClick={()=>setSelWorker(w)}
                    style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:20,cursor:"pointer",transition:"all .18s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.boxShadow="0 4px 16px rgba(22,163,74,.1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
                    <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
                      <div style={{width:46,height:46,borderRadius:23,background:C.greenBg,border:`2px solid ${C.greenBorder}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{...H,fontSize:16,fontWeight:900,color:C.green}}>{w.nome?.[0]}</span>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{...H,fontSize:15,fontWeight:700,color:C.navy}}>{w.nome}</div>
                        <div style={{...B,fontSize:12,color:C.muted}}>{w.cidade}/{w.estado}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{...H,fontSize:16,fontWeight:900,color:C.green}}>{w.distLabel}</div>
                        <div style={{...B,fontSize:10,color:C.muted}}>distância</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                      {SPECS.filter(s=>w.specs?.includes(s.id)).slice(0,3).map(s=>{
                        const nivel=w.spec_levels?.[s.id]?.nivel||0;
                        return <div key={s.id} style={{display:"flex",alignItems:"center",gap:5,background:levelColors[nivel]+"12",border:`1px solid ${levelColors[nivel]}30`,borderRadius:7,padding:"4px 10px"}}><span style={{fontSize:13}}>{s.icon}</span><span style={{...B,fontSize:11,fontWeight:600,color:levelColors[nivel]}}>{s.label}</span></div>;
                      })}
                      {(w.specs?.length||0)>3&&<span style={{...B,fontSize:11,color:C.muted,padding:"4px 6px"}}>+{w.specs.length-3}</span>}
                    </div>
                    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                      {DAYS.filter(d=>(w.disponibilidade?.[d]||[]).length>0).map(d=>(
                        <span key={d} style={{...B,fontSize:10,fontWeight:600,color:C.green,background:C.greenBg,padding:"2px 6px",borderRadius:4}}>{d}</span>
                      ))}
                    </div>
                    <div onClick={e=>{e.stopPropagation();window.open(whatsappMsg(w),"_blank");}}
                      style={{background:"#25D366",borderRadius:8,padding:"9px 14px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                      <span style={{fontSize:15}}>💬</span>
                      <span style={{...H,fontSize:13,fontWeight:700,color:"#fff"}}>Convidar pelo WhatsApp</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>}
        </>}

        {/* ── TAB: MEU PERFIL ── */}
        {tab==="profile"&&<>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
            {/* Dados da empresa */}
            <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28}}>
              <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Dados da empresa</div>
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {[["Razão social",company.razao],["Nome fantasia",company.nome_fant||"—"],["CNPJ",company.cnpj],["Segmento",company.seg],["Site",company.site||"—"],["Cidade",`${company.cidade}/${company.estado}`],["Responsável",company.resp_nome],["WhatsApp",company.resp_tel],["E-mail",company.resp_email]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{...B,fontSize:12,color:C.muted}}>{k}</span>
                    <span style={{...B,fontSize:13,color:C.navy,fontWeight:600,textAlign:"right",maxWidth:"60%"}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:14}}>
                <Badge status={company.status} />
                {company.status==="pending"&&<div style={{...B,fontSize:12,color:C.amber,marginTop:8}}>Seu cadastro está em análise pela equipe VORKY. Em até 24h úteis você receberá retorno.</div>}
              </div>
            </div>

            {/* Unidades */}
            <div>
              <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,marginBottom:14}}>
                <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Unidades de trabalho</div>
                {units.length===0&&<Alert type="warning">Nenhuma unidade cadastrada. Adicione abaixo para poder usar o Talent Browser.</Alert>}
                {units.map(u=>(
                  <div key={u.id} style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>{u.nome}</div>
                      <div style={{...B,fontSize:12,color:C.sub,marginTop:3}}>{u.rua}, {u.numero} — {u.bairro}</div>
                      <div style={{...B,fontSize:12,color:C.muted}}>{u.cidade}/{u.estado} · CEP {u.cep}</div>
                    </div>
                    <button onClick={()=>setDeleteModal({id:u.id,name:u.nome})}
                      style={{background:C.redBg,border:`1px solid ${C.redBorder}`,borderRadius:7,padding:"5px 10px",cursor:"pointer",...B,fontSize:12,color:C.red,flexShrink:0}}>Remover</button>
                  </div>
                ))}
              </div>

              {/* Adicionar unidade */}
              <div style={{background:C.bg,border:`1.5px dashed ${C.border2}`,borderRadius:14,padding:22}}>
                <div style={{...H,fontSize:14,fontWeight:700,color:C.navy,marginBottom:14}}>+ Adicionar unidade</div>
                <Field label="Nome da unidade" placeholder="Ex: Loja Lapa, CD Guarulhos" value={newUnit.nome} onChange={v=>setNewUnit(u=>({...u,nome:v}))} />
                <AddressBlock data={newUnit} setData={setNewUnit} loading={uCepLoad} setLoading={setUCepLoad} />
                <Btn label={savingUnit?"Salvando...":"+ Adicionar unidade"} variant={newUnit.nome&&newUnit.cep&&newUnit.rua&&newUnit.numero?"primary":"ghost"} size="md"
                  onClick={addUnit} disabled={!newUnit.nome||!newUnit.cep||!newUnit.rua||!newUnit.numero} loading={savingUnit} />
              </div>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUTH CHOICE — tela de escolha unificada
// ═══════════════════════════════════════════════════════════════
function AuthChoice({ onNav }) {
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:560,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:10}}>Bem-vindo ao VORKY</h2>
          <p style={{...B,fontSize:15,color:C.muted}}>Como deseja acessar?</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          {/* Empresa */}
          <div onClick={()=>onNav("company-auth")}
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:32,cursor:"pointer",textAlign:"center",transition:"all .18s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.boxShadow="0 4px 20px rgba(22,163,74,.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:48,marginBottom:14}}>🏢</div>
            <div style={{...H,fontSize:20,fontWeight:900,color:C.navy,marginBottom:8}}>Sou uma empresa</div>
            <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65,marginBottom:20}}>Acesse o Talent Browser e encontre colaboradores verificados na sua região.</div>
            <div style={{background:C.green,borderRadius:9,padding:"11px 20px",...H,fontSize:14,fontWeight:700,color:"#fff"}}>Entrar como empresa →</div>
          </div>

          {/* Colaborador */}
          <div onClick={()=>onNav("worker-auth")}
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:32,cursor:"pointer",textAlign:"center",transition:"all .18s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.boxShadow="0 4px 20px rgba(37,99,235,.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="none";}}>
            <div style={{fontSize:48,marginBottom:14}}>👤</div>
            <div style={{...H,fontSize:20,fontWeight:900,color:C.navy,marginBottom:8}}>Sou colaborador</div>
            <div style={{...B,fontSize:13,color:C.sub,lineHeight:1.65,marginBottom:20}}>Acesse sua conta e aguarde convites de empresas na sua região.</div>
            <div style={{background:C.blue,borderRadius:9,padding:"11px 20px",...H,fontSize:14,fontWeight:700,color:"#fff"}}>Entrar como colaborador →</div>
          </div>
        </div>

        {/* Cadastro links */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 24px",display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap"}}>
          <span style={{...B,fontSize:13,color:C.sub}}>Ainda não tem conta?</span>
          <span onClick={()=>onNav("company-register")} style={{...B,fontSize:13,color:C.green,cursor:"pointer",fontWeight:600}}>Cadastrar empresa →</span>
          <span onClick={()=>onNav("worker-register")} style={{...B,fontSize:13,color:C.blue,cursor:"pointer",fontWeight:600}}>Cadastrar como colaborador →</span>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN (worker only) ─────────────────────────────────
function AuthScreen({ type, onLogin, onRegister, onBack }) {
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <button onClick={onBack} style={{...B,fontSize:13,color:C.sub,background:"none",border:"none",cursor:"pointer",marginBottom:24}}>← Voltar</button>
        <SL>Área do Colaborador</SL>
        <h2 style={{...H,fontSize:32,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:28}}>Bem-vindo de volta.</h2>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="seu@email.com" value={email} onChange={setEmail} type="email" />
          <Field label="Senha" placeholder="••••••••" value={pass} onChange={setPass} type="password" />
          <Btn label="Entrar →" variant="primary" size="lg" full onClick={()=>email&&pass&&onLogin()} />
          <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0"}}>
            <div style={{flex:1,height:1,background:C.border}} /><span style={{...B,fontSize:12,color:C.muted}}>ou</span><div style={{flex:1,height:1,background:C.border}} />
          </div>
          <Btn label="Criar conta →" variant="ghost" size="lg" full onClick={onRegister} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function VORKYApp() {
  const [screen,  setScreen]  = useState("home");
  const [wData,   setWData]   = useState(null);
  const [cData,   setCData]   = useState(null);
  const [company, setCompany] = useState(null);
  const [admin,   setAdmin]   = useState(false);

  const userType = admin?"admin":company?"company":null;
  const userName = admin?"Admin":company?(company.nome_fant||company.razao):null;

  const onNav = s => {
    if(s==="home"){ setAdmin(false); if(!company) setScreen("home"); else setScreen("home"); }
    setScreen(s);
  };

  const handleCompanyLogin = (co) => { setCompany(co); setScreen("company-app"); };
  const handleCompanyLogout = () => { setCompany(null); setScreen("home"); };

  return (
    <>
      <GlobalStyles />
      <Header onNav={onNav} user={userName} type={userType} />
      {!admin&&!company&&screen==="home"             &&<Landing          onNav={onNav} />}
      {!admin&&!company&&screen==="auth-choice"      &&<AuthChoice       onNav={onNav} />}
      {!admin&&!company&&screen==="worker-auth"      &&<AuthScreen       type="worker"  onBack={()=>onNav("auth-choice")} onLogin={()=>onNav("worker-app")} onRegister={()=>onNav("worker-register")} />}
      {!admin&&!company&&screen==="worker-register"  &&<WorkerRegister   onBack={()=>onNav("worker-auth")} onDone={d=>{setWData(d);onNav("worker-success");}} />}
      {!admin&&!company&&screen==="worker-success"   &&<WorkerSuccess    data={wData} onEnter={()=>onNav("home")} />}
      {!admin&&!company&&screen==="worker-app"       &&<Landing          onNav={onNav} />}
      {!admin&&!company&&screen==="company-auth"     &&<CompanyLogin     onBack={()=>onNav("auth-choice")} onLogin={handleCompanyLogin} onRegister={()=>onNav("company-register")} />}
      {!admin&&!company&&screen==="company-register" &&<CompanyRegister  onBack={()=>onNav("company-auth")} onDone={d=>{setCData(d);onNav("company-success");}} />}
      {!admin&&!company&&screen==="company-success"  &&<CompanySuccess   data={cData} onEnter={()=>onNav("home")} />}
      {!admin&&company  &&screen==="company-app"     &&<TalentBrowser    company={company} onLogout={handleCompanyLogout} onUpdateCompany={setCompany} />}
      {!admin&&!company&&screen==="admin-login"      &&<AdminLogin       onLogin={()=>setAdmin(true)} />}
      {admin                                         &&<AdminPanel />}
    </>
  );
}
