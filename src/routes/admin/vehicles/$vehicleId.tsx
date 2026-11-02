import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import imageCompression from "browser-image-compression";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/admin/vehicles/$vehicleId")({ component: EditVehicle });
const field = "mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm";
type VehicleForm = { name:string; brand:string; year:number; mileage:number; fuel:string; transmission:string; price:number; body:string; engine:string; location:string; history:string; description:string; status:string; features:string[]; images:string[] };
const empty: VehicleForm = { name:"", brand:"", year:new Date().getFullYear(), mileage:0, fuel:"Diesel", transmission:"Automatique", price:1, body:"SUV", engine:"", location:"Bamako, Korofina Sud", history:"", description:"", status:"AVAILABLE", features:[], images:[] };

function EditVehicle() {
  const { vehicleId } = Route.useParams();
  const nav = useNavigate();
  const { data:session, isPending } = authClient.useSession();
  const [vehicle,setVehicle] = useState<VehicleForm>(empty);
  const [brands,setBrands] = useState<string[]>([]);
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [error,setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user.role !== "admin") { void nav({to:"/admin/login"}); return; }
    let active = true;
    Promise.all([
      fetch("/api/admin/vehicles?id="+encodeURIComponent(vehicleId)).then(async r => { const d=await r.json(); if(!r.ok) throw new Error(d.error || "Véhicule introuvable."); return d.vehicle; }),
      fetch("/api/admin/brands").then(async r => { const d=await r.json(); if(!r.ok) throw new Error(d.error || "Chargement des marques impossible."); return d.brands as string[]; })
    ]).then(([v,b]) => { if(!active)return; setVehicle({name:v.name,brand:v.brand,year:v.year,mileage:v.mileage,fuel:v.fuel,transmission:v.transmission,price:v.price,body:v.body,engine:v.engine,location:v.location,history:v.history,description:v.description,status:v.status,features:v.features || [],images:v.images || []}); setBrands(b); })
      .catch(e => { if(active)setError(e instanceof Error?e.message:"Erreur de chargement."); })
      .finally(() => { if(active)setLoading(false); });
    return () => { active=false; };
  },[isPending,session?.user.id,vehicleId]);

  const update = (key:keyof VehicleForm,value:string|number) => setVehicle(old=>({...old,[key]:value}));
  async function upload(files:FileList|null) {
    if(!files)return;
    setUploading(true);setError("");
    try {
      for(const file of Array.from(files).slice(0,12-vehicle.images.length)) {
        const compressed=await imageCompression(file,{maxSizeMB:1,maxWidthOrHeight:1920,useWebWorker:true,fileType:"image/webp"});
        const form=new FormData();form.append("file",compressed,"vehicle.webp");
        const response=await fetch("/api/admin/upload",{method:"POST",body:form});const data=await response.json();
        if(!response.ok)throw new Error(data.error||"Upload échoué.");
        setVehicle(old=>({...old,images:[...old.images,data.url]}));
      }
    } catch(e) { setError(e instanceof Error?e.message:"Erreur image."); }
    finally { setUploading(false); }
  }
  function moveImage(index:number,direction:-1|1) {
    setVehicle(old=>{const next=[...old.images],target=index+direction;if(target<0||target>=next.length)return old;[next[index],next[target]]=[next[target],next[index]];return {...old,images:next};});
  }
  async function submit(e:FormEvent) {
    e.preventDefault();setBusy(true);setError("");
    const response=await fetch("/api/admin/vehicles?id="+encodeURIComponent(vehicleId),{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...vehicle,year:Number(vehicle.year),mileage:Number(vehicle.mileage),price:Number(vehicle.price)})});
    const data=await response.json();setBusy(false);
    if(!response.ok){setError(data.error||"Modification impossible.");return;}
    await nav({to:"/admin"});
  }
  if(isPending||loading)return <main className="p-10">Chargement…</main>;
  if(!session||session.user.role!=="admin")return <main className="p-10">Accès refusé.</main>;
  if(error&&!vehicle.name)return <main className="mx-auto max-w-3xl p-10"><p role="alert">{error}</p><Link to="/admin">Retour au dashboard</Link></main>;

  const textInput=(key:Exclude<keyof VehicleForm,"features"|"images">,label:string,type="text")=><label className="block text-sm font-medium">{label}<input required={["name","brand","year","price","description"].includes(key)} type={type} value={vehicle[key] as string|number} onChange={e=>update(key,type==="number"?Number(e.target.value):e.target.value)} className={field}/></label>;
  return <main className="min-h-screen bg-background px-5 py-10"><div className="mx-auto max-w-4xl">
    <Link to="/admin" className="text-sm text-muted-foreground">← Retour au tableau de bord</Link>
    <div className="mt-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-muted-foreground">Gestion du stock</p><h1 className="mt-2 text-3xl font-semibold">Modifier le véhicule</h1><p className="mt-1 text-sm text-muted-foreground">Les modifications seront visibles sur le site après enregistrement.</p></div><span className="rounded-full bg-secondary px-3 py-2 text-xs">{vehicle.status==="AVAILABLE"?"Disponible":vehicle.status==="RESERVED"?"Réservé":"Vendu"}</span></div>
    <form onSubmit={submit} className="mt-8 space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6"><div className="flex justify-between gap-3"><div><h2 className="font-semibold">Photos du véhicule</h2><p className="mt-1 text-sm text-muted-foreground">12 photos maximum. La première photo est utilisée comme couverture.</p></div><span className="text-sm text-muted-foreground">{vehicle.images.length}/12</span></div>
        <input type="file" accept="image/*" multiple disabled={uploading||vehicle.images.length>=12} onChange={e=>void upload(e.target.files)} className="mt-4 block w-full text-sm"/>
        {uploading&&<p className="mt-2 text-sm text-muted-foreground">Compression et upload en cours…</p>}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{vehicle.images.map((url,i)=><div key={url} className="overflow-hidden rounded-xl border border-border"><img src={url} alt={"Photo "+(i+1)} className="aspect-[4/3] w-full object-cover"/><div className="flex items-center justify-between p-2 text-xs"><span>{i===0?"Couverture": "Photo "+(i+1)}</span><div className="flex gap-1"><button type="button" disabled={i===0} onClick={()=>moveImage(i,-1)} aria-label="Déplacer à gauche" className="rounded border px-2 py-1 disabled:opacity-30">←</button><button type="button" disabled={i===vehicle.images.length-1} onClick={()=>moveImage(i,1)} aria-label="Déplacer à droite" className="rounded border px-2 py-1 disabled:opacity-30">→</button><button type="button" onClick={()=>setVehicle(old=>({...old,images:old.images.filter((_,n)=>n!==i)}))} aria-label="Retirer la photo" className="rounded border px-2 py-1 text-destructive">×</button></div></div></div>)}</div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-6"><h2 className="font-semibold">Caractéristiques</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
        {textInput("name","Nom du véhicule")}
        <label className="block text-sm font-medium">Marque<select required value={vehicle.brand} onChange={e=>update("brand",e.target.value)} className={field}><option value="">Choisir une marque</option>{brands.map(b=><option key={b}>{b}</option>)}</select></label>
        {textInput("year","Année","number")}{textInput("price","Prix en FCFA","number")}{textInput("mileage","Kilométrage","number")}{textInput("engine","Motorisation")}{textInput("location","Localisation")}
        <label className="block text-sm font-medium">Carrosserie<select value={vehicle.body} onChange={e=>update("body",e.target.value)} className={field}>{["SUV","Berline","Pickup","Utilitaire","Citadine","Coupé"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="block text-sm font-medium">Carburant<select value={vehicle.fuel} onChange={e=>update("fuel",e.target.value)} className={field}>{["Essence","Diesel","Hybride","Électrique"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="block text-sm font-medium">Transmission<select value={vehicle.transmission} onChange={e=>update("transmission",e.target.value)} className={field}>{["Automatique","Manuelle"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className="block text-sm font-medium">Disponibilité<select value={vehicle.status} onChange={e=>update("status",e.target.value)} className={field}><option value="AVAILABLE">Disponible</option><option value="RESERVED">Réservé</option><option value="SOLD">Vendu</option></select></label>
      </div>
      <label className="mt-4 block text-sm font-medium">Historique<input value={vehicle.history} onChange={e=>update("history",e.target.value)} className={field}/></label>
      <label className="mt-4 block text-sm font-medium">Description<textarea required minLength={10} maxLength={5000} value={vehicle.description} onChange={e=>update("description",e.target.value)} rows={5} className={field}/></label>
      <label className="mt-4 block text-sm font-medium">Équipements (un par ligne)<textarea value={vehicle.features.join("\n")} onChange={e=>setVehicle(old=>({...old,features:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)}))} rows={4} className={field}/></label>
      </section>
      {error&&<p role="alert" className="rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3"><Link to="/admin" className="rounded-full border border-border px-5 py-3 text-sm">Annuler</Link><button disabled={busy||uploading||vehicle.images.length===0} className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground disabled:opacity-50">{busy?"Enregistrement…":"Enregistrer les modifications"}</button></div>
    </form>
  </div></main>;
}
