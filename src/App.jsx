import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const VORKER_LOGO = 'data:image/png;base64,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';
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
          <div onClick={handleLogoClick} style={{display:"flex",alignItems:"center",cursor:"pointer"}}>
            <img src={VORKER_LOGO} alt="VORKER" style={{height:44,objectFit:"contain"}} />
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
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Preencha com seus dados reais. Serão verificados pela equipe VORKER.</p>
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
              <div style={{...B,fontSize:11,color:C.muted,textAlign:"center",marginBottom:18}}>🔒 Visível apenas à equipe VORKER.</div>
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
            <h2 style={{...H,fontSize:26,fontWeight:900,color:C.navy,marginBottom:6}}>Como o VORKER funciona</h2>
            <p style={{...B,fontSize:14,color:C.sub,marginBottom:22,lineHeight:1.65}}>Entenda antes de finalizar.</p>
            {[
              {icon:"👁",t:"Você escolhe quem trabalha",d:"No Talent Browser você vê perfis verificados, filtra por especialidade e nível, e convida diretamente."},
              {icon:"📋",t:"Publique vagas por unidade",d:"Cada vaga é vinculada a uma de suas unidades. Colaboradores veem a distância exata."},
              {icon:"🔒",t:"Perfis verificados",d:"Documentos conferidos antes de aparecerem na plataforma."},
              {icon:"⭐",t:"Avaliação bidirecional",d:"Empresa e colaborador se avaliam ao final de cada turno."},
              {icon:"⚖️",t:"Você é o contratante",d:"O VORKER conecta. O vínculo é entre sua empresa e o colaborador."},
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
        <Alert type="success">Cadastro salvo com sucesso no sistema VORKER! ✓</Alert>
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
    if(email==="admin@vorker.com"&&pass==="vorker2024") onLogin();
    else setError("E-mail ou senha incorretos.");
  };
  return (
    <div style={{minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 20px",background:C.bg}}>
      <div style={{maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:56,height:56,background:C.navy,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26}}>🔐</div>
          <h2 style={{...H,fontSize:28,fontWeight:900,color:C.navy,marginBottom:6}}>Admin VORKER</h2>
          <p style={{...B,fontSize:14,color:C.muted}}>Acesso restrito à equipe interna</p>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:28,boxShadow:"0 4px 20px rgba(0,0,0,.06)"}}>
          <Field label="E-mail" placeholder="admin@vorker.com" value={email} onChange={setEmail} type="email" />
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
      {deleteModal&&<AdminDeleteModal />}
      <aside style={{background:C.white,borderRight:`1px solid ${C.border}`,padding:"20px 0",position:"sticky",top:60,height:"calc(100vh - 60px)",overflowY:"auto"}}>
        <div style={{padding:"0 16px 18px",borderBottom:`1px solid ${C.border}`,marginBottom:10}}>
          <div style={{...B,fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Painel Interno</div>
          <div style={{...H,fontSize:14,fontWeight:700,color:C.navy}}>Equipe VORKER</div>
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
      if(company.status==="pending") { setError("Seu cadastro ainda está em análise. Aguarde a aprovação da equipe VORKER."); setLoading(false); return; }
      if(company.status==="rejected") { setError("Seu cadastro foi reprovado. Entre em contato com a equipe VORKER."); setLoading(false); return; }
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
    const msg = `Olá ${w.nome.split(" ")[0]}! Sou da empresa *${company.nome_fant||company.razao}* e encontrei seu perfil no VORKER. Temos uma oportunidade de trabalho na nossa unidade *${selUnit?.nome}*. Podemos conversar?`;
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
    <div style={{minHeight:"90vh",background:C.bg}}>

      {/* Hero banner */}
      <div style={{background:`linear-gradient(135deg, ${C.navy} 0%, #1E3A5F 100%)`,padding:"32px 40px 28px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <button onClick={()=>setSelWorker(null)} style={{...B,fontSize:13,color:"rgba(255,255,255,.6)",background:"none",border:"none",cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:6}}>
            ← Voltar ao Talent Browser
          </button>
          <div style={{display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
            {/* Avatar */}
            <div style={{width:90,height:90,borderRadius:45,background:C.green,border:"3px solid rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{...H,fontSize:36,fontWeight:900,color:"#fff"}}>{selWorker.nome?.[0]}</span>
            </div>
            {/* Name + info */}
            <div style={{flex:1}}>
              <h2 style={{...H,fontSize:30,fontWeight:900,color:"#fff",letterSpacing:-.5,marginBottom:6}}>{selWorker.nome}</h2>
              <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <span style={{...B,fontSize:13,color:"rgba(255,255,255,.7)"}}>📍 {selWorker.cidade}/{selWorker.estado}</span>
                <span style={{...B,fontSize:13,color:"#4ADE80",fontWeight:600}}>📏 {selWorker.distLabel} desta unidade</span>
                <span style={{...B,fontSize:13,color:"rgba(255,255,255,.7)"}}>🔄 Aceita vagas em até {selWorker.raio_km||10}km</span>
                <span style={{...B,fontSize:13,color:"rgba(255,255,255,.7)"}}>🚌 {selWorker.deslocamento||"—"}</span>
              </div>
            </div>
            {/* WhatsApp CTA — hero */}
            <a href={whatsappMsg(selWorker)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",flexShrink:0}}>
              <div style={{background:"#25D366",borderRadius:12,padding:"14px 24px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                <span style={{fontSize:22}}>💬</span>
                <div>
                  <div style={{...H,fontSize:15,fontWeight:700,color:"#fff"}}>Convidar pelo WhatsApp</div>
                  <div style={{...B,fontSize:11,color:"rgba(255,255,255,.8)"}}>Mensagem pré-formatada</div>
                </div>
              </div>
            </a>
          </div>

          {/* Specialty chips in hero */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:20}}>
            {SPECS.filter(s=>selWorker.specs?.includes(s.id)).map(s=>{
              const nivel=selWorker.spec_levels?.[s.id]?.nivel||0;
              const levelColors=["#9CA3AF","#60A5FA","#FBBF24","#F97316","#16A34A"];
              return <div key={s.id} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",borderRadius:20,padding:"5px 12px"}}>
                <span style={{fontSize:14}}>{s.icon}</span>
                <span style={{...B,fontSize:12,fontWeight:600,color:"#fff"}}>{s.label}</span>
                <span style={{...B,fontSize:10,color:levelColors[nivel],background:"rgba(0,0,0,.3)",borderRadius:10,padding:"1px 6px"}}>{LEVELS[nivel]?.label}</span>
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 40px 60px",display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
        <div>

          {/* Perfil comportamental — cards */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:16}}>
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Perfil de trabalho</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[
                {label:"Trabalho em equipe", value:selWorker.trabalho_equipe?"✓ Sim":"✗ Não", ok:selWorker.trabalho_equipe},
                {label:"Atend. ao cliente",  value:selWorker.atend_cliente?"✓ Sim":"✗ Não",  ok:selWorker.atend_cliente},
                {label:"Tipo preferido",     value:selWorker.tipo_trabalho||"—",              ok:!!selWorker.tipo_trabalho},
              ].map(({label,value,ok})=>(
                <div key={label} style={{background:ok?C.greenBg:C.bg,border:`1px solid ${ok?C.greenBorder:C.border}`,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{...B,fontSize:11,color:C.muted,marginBottom:6}}>{label}</div>
                  <div style={{...H,fontSize:14,fontWeight:700,color:ok?C.green:C.sub}}>{value}</div>
                </div>
              ))}
            </div>
            {selWorker.pcd&&(
              <div style={{marginTop:12,background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:9,padding:"10px 14px",...B,fontSize:13,color:C.blue}}>
                ♿ PCD{selWorker.pcd_tipo?` — ${selWorker.pcd_tipo}`:""}
              </div>
            )}
          </div>

          {/* Especialidades */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24,marginBottom:16}}>
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Especialidades e experiência</div>
            {SPECS.filter(s=>selWorker.specs?.includes(s.id)).map(s=>{
              const sl=selWorker.spec_levels?.[s.id]; const nivel=sl?.nivel||0;
              const levelColors=["#9CA3AF","#60A5FA","#FBBF24","#F97316","#16A34A"];
              const levelWidth=[0,25,50,75,100];
              return (
                <div key={s.id} style={{background:C.bg,borderRadius:12,padding:"16px 18px",marginBottom:10,border:`1px solid ${C.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:22}}>{s.icon}</span>
                      <span style={{...H,fontSize:15,fontWeight:700,color:C.navy}}>{s.label}</span>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{...B,fontSize:12,fontWeight:700,color:levelColors[nivel],background:levelColors[nivel]+"18",padding:"3px 10px",borderRadius:20}}>{LEVELS[nivel]?.label||"—"}</span>
                      {sl?.experiencia&&<span style={{...B,fontSize:11,color:C.muted}}>{sl.experiencia}</span>}
                    </div>
                  </div>
                  <div style={{height:8,borderRadius:4,background:C.border,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,background:levelColors[nivel],width:`${levelWidth[nivel]}%`,transition:"width .3s"}} />
                  </div>
                  {sl?.empresas?.length>0&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,alignItems:"center"}}>
                      <span style={{...B,fontSize:11,color:C.muted}}>Trabalhou em:</span>
                      {sl.empresas.map((emp,i)=>(
                        <span key={i} style={{...B,fontSize:12,fontWeight:600,color:C.navy,background:C.white,border:`1px solid ${C.border2}`,borderRadius:6,padding:"3px 10px"}}>{emp}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {selWorker.specs?.includes("custom")&&selWorker.spec_levels?.custom&&(
              <div style={{background:C.bg,borderRadius:12,padding:"16px 18px",border:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>⭐</span><span style={{...H,fontSize:15,fontWeight:700,color:C.navy}}>{selWorker.spec_levels.custom.label||"Especialidade própria"}</span></div>
                  <span style={{...B,fontSize:12,fontWeight:700,color:levelColors[selWorker.spec_levels.custom.nivel||0],background:levelColors[selWorker.spec_levels.custom.nivel||0]+"18",padding:"3px 10px",borderRadius:20}}>{LEVELS[selWorker.spec_levels.custom.nivel||0]?.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Disponibilidade — grade visual */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
            <div style={{...H,fontSize:15,fontWeight:700,color:C.navy,marginBottom:16}}>Disponibilidade</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"separate",borderSpacing:"4px"}}>
                <thead>
                  <tr>
                    <th style={{...B,fontSize:11,fontWeight:600,color:C.muted,textAlign:"left",padding:"4px 8px",minWidth:40}}></th>
                    {SHIFTS.map(sh=><th key={sh.id} style={{...B,fontSize:11,fontWeight:700,color:sh.color,textAlign:"center",padding:"4px 8px",minWidth:80}}>{sh.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day=>{
                    const dayShifts=selWorker.disponibilidade?.[day]||[];
                    const hasAny=dayShifts.length>0;
                    return (
                      <tr key={day}>
                        <td style={{...H,fontSize:13,fontWeight:700,color:hasAny?C.navy:C.muted,padding:"3px 8px"}}>{day}</td>
                        {SHIFTS.map(sh=>{
                          const on=dayShifts.includes(sh.id);
                          return <td key={sh.id} style={{padding:3}}>
                            <div style={{padding:"8px 6px",borderRadius:8,background:on?sh.color+"18":C.bg,border:`1.5px solid ${on?sh.color:C.border}`,textAlign:"center"}}>
                              {on?<span style={{...B,fontSize:11,fontWeight:700,color:sh.color}}>✓</span>:<span style={{...B,fontSize:11,color:C.border}}>—</span>}
                            </div>
                          </td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sticky action panel */}
        <div style={{position:"sticky",top:20}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 4px 24px rgba(0,0,0,.08)"}}>
            <div style={{background:C.navy,padding:"18px 20px"}}>
              <div style={{...H,fontSize:16,fontWeight:800,color:"#fff",marginBottom:2}}>Convidar {selWorker.nome.split(" ")[0]}</div>
              <div style={{...B,fontSize:12,color:"rgba(255,255,255,.6)"}}>para a unidade {selUnit?.nome}</div>
            </div>
            <div style={{padding:20}}>
              <div style={{background:C.greenBg,border:`1px solid ${C.greenBorder}`,borderRadius:10,padding:"12px 14px",marginBottom:16}}>
                <div style={{...B,fontSize:11,color:C.muted,marginBottom:4}}>Distância até a unidade</div>
                <div style={{...H,fontSize:24,fontWeight:900,color:C.green}}>{selWorker.distLabel}</div>
                <div style={{...B,fontSize:11,color:C.muted,marginTop:2}}>Raio aceito: {selWorker.raio_km||10}km ✓</div>
              </div>

              <div style={{...B,fontSize:12,color:C.sub,marginBottom:14,lineHeight:1.65}}>
                O WhatsApp vai abrir com uma mensagem já pronta para {selWorker.nome.split(" ")[0]}. Você pode editar antes de enviar.
              </div>

              <a href={whatsappMsg(selWorker)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <div style={{background:"#25D366",borderRadius:10,padding:"14px 18px",textAlign:"center",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <span style={{fontSize:22}}>💬</span>
                  <span style={{...H,fontSize:15,fontWeight:700,color:"#fff"}}>Abrir WhatsApp</span>
                </div>
              </a>

              <Div />
              <div style={{...B,fontSize:12,color:C.muted,lineHeight:1.7}}>
                <div>📍 <strong style={{color:C.navy}}>{selUnit?.nome}</strong></div>
                <div style={{marginTop:4}}>🔄 Se desloca de <strong style={{color:C.navy}}>{selWorker.deslocamento||"—"}</strong></div>
              </div>
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
      <div style={{background:C.navy,padding:"20px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src={VORKER_LOGO} alt="VORKER" style={{height:52,objectFit:"contain",filter:"brightness(0) invert(1)",flexShrink:0}} />
          <div>
            <div style={{...H,fontSize:18,fontWeight:900,color:"#fff"}}>{company.nome_fant||company.razao}</div>
            <div style={{...B,fontSize:12,color:"rgba(255,255,255,.5)"}}>{company.seg} · {company.cidade}/{company.estado}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <Badge status={company.status} />
          <button onClick={onLogout} style={{...B,fontSize:13,fontWeight:600,color:"rgba(255,255,255,.7)",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,padding:"7px 16px",cursor:"pointer"}}>Sair</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:C.navy,borderBottom:`3px solid rgba(255,255,255,.08)`,display:"flex",padding:"0 32px",gap:4}}>
        {[
          {id:"talent", icon:"🔍", label:"Talent Browser"},
          {id:"profile", icon:"🏢", label:"Meu Perfil"},
          {id:"vorker-team", icon:"⚡", label:"Time VORKER", soon:true},
        ].map(t=>(
          <button key={t.id}
            onClick={()=>!t.soon&&setTab(t.id)}
            style={{
              ...B, fontSize:13, fontWeight:600,
              padding:"14px 20px",
              background:"transparent",
              border:"none",
              borderBottom:`3px solid ${tab===t.id?"#fff":"transparent"}`,
              color: t.soon?"rgba(255,255,255,.3)": tab===t.id?"#fff":"rgba(255,255,255,.6)",
              cursor:t.soon?"default":"pointer",
              display:"flex", alignItems:"center", gap:7,
              transition:"all .15s",
              marginBottom:-3,
            }}>
            <span style={{fontSize:15}}>{t.icon}</span>
            {t.label}
            {t.soon&&<span style={{...B,fontSize:10,fontWeight:700,color:"rgba(255,255,255,.35)",background:"rgba(255,255,255,.08)",borderRadius:10,padding:"2px 8px",letterSpacing:.5}}>EM BREVE</span>}
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
                {company.status==="pending"&&<div style={{...B,fontSize:12,color:C.amber,marginTop:8}}>Seu cadastro está em análise pela equipe VORKER. Em até 24h úteis você receberá retorno.</div>}
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
          <h2 style={{...H,fontSize:34,fontWeight:900,color:C.navy,letterSpacing:-1.2,marginBottom:10}}>Bem-vindo ao VORKER</h2>
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
export default function VORKERApp() {
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
      {!admin&&!company&&<Header onNav={onNav} user={userName} type={userType} />}
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
