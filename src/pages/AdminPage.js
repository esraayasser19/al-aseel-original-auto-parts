import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Package, Mail, Trash2, ShoppingCart, Users, BarChart3,
  Upload, Check, X, Bell, RefreshCw,
  Edit2, Grid, Image,
  Download, Search, FileText, Home, LogOut, Star,
  ArrowUp, ArrowDown, Settings, Car, Plus, ExternalLink
} from "lucide-react";
import {
  adminGetStats, adminGetProducts, createProduct, updateProduct, deleteProduct,
  adminGetCategories, createCategory, updateCategory, deleteCategory,
  adminGetBrands, createBrand, updateBrand, deleteBrand,
  adminGetMessages, markMessageRead,
  adminGetReviews, approveReview,
  adminGetBanners, createBanner, updateBanner, deleteBanner,
  uploadImage,
} from "@/lib/supabaseApi";
import { mockCategories } from "@/data/mockData";

// ─── أداة تصدير ملفات CSV ────────────────────────────────
function exportCSV(data, filename) {
  if (!data || !data.length) { toast.error("لا توجد بيانات لتصديرها"); return; }
  const keys = Object.keys(data[0]);
  const header = keys.join(",");
  const rows = data.map(row =>
    keys.map(k => {
      const val = row[k] ?? "";
      const str = typeof val === "object" ? JSON.stringify(val) : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename + ".csv"; a.click();
  URL.revokeObjectURL(url);
  toast.success(`تم تصدير ${data.length} عنصر بنجاح`);
}

// ─── فلترة بالتاريخ ───────────────────────────────
function filterByDate(items, field, from, to) {
  return items.filter(item => {
    const d = new Date(item[field]);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to + "T23:59:59")) return false;
    return true;
  });
}

// ─── كارت الإحصائيات ─────────────────────────────────────────
function StatCard({ label, value, icon: Icon, gradient, trend }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {trend && (
        <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
          {trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

// ─── تبويب الإحصائيات ─────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState(null);
  useEffect(() => { adminGetStats().then(setStats).catch(() => {}); }, []);
  if (!stats) return <div className="space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="إجمالي قطع الغيار" value={stats.products} icon={Package} gradient="bg-gradient-to-br from-brand-primary to-blue-700" />
        <StatCard label="الطلبات والاستفسارات" value={stats.orders || 0} icon={ShoppingCart} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard label="العملاء المسجلين" value={stats.customers || 0} icon={Users} gradient="bg-gradient-to-br from-cyan-500 to-blue-600" />
        <StatCard label="إجمالي التقييمات" value={stats.reviews || 0} icon={Star} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard label="تقييمات قيد المراجعة" value={stats.pending_reviews || 0} icon={Star} gradient="bg-gradient-to-br from-yellow-500 to-amber-600" />
        <StatCard label="إجمالي الرسائل" value={stats.messages || 0} icon={Mail} gradient="bg-gradient-to-br from-teal-500 to-cyan-600" />
        <StatCard label="رسائل جديدة غير مقروءة" value={stats.unread_messages || 0} icon={Bell} gradient="bg-gradient-to-br from-red-500 to-rose-600" />
      </div>

      {stats.recent_orders?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">أحدث الطلبات المستلمة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-right">رقم الطلب</th>
                  <th className="px-5 py-3 text-right">العميل</th>
                  <th className="px-5 py-3 text-right">المبلغ الإجمالي</th>
                  <th className="px-5 py-3 text-right">الحالة</th>
                  <th className="px-5 py-3 text-right">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recent_orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{o.id?.slice(0,8).toUpperCase()}</td>
                    <td className="px-5 py-3 font-medium text-gray-800">{o.user_name}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{o.total?.toLocaleString("ar-SA")} ر.س</td>
                    <td className="px-5 py-3"><span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{o.status}</span></td>
                    <td className="px-5 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString("ar-SA")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── تبويب البنرات والعروض ───────────────────────────────────────
function BannersTab() {
  const [banners, setBanners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const emptyForm = { title: "", subtitle: "", image: "", link: "/shop", button_text: "تصفح الكتالوج", active: true, sort_order: 0 };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(() => { adminGetBanners().then(setBanners).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setForm(f => ({...f, image: url})); toast.success("تم رفع الصورة بنجاح!"); }
    catch { toast.error("فشل في رفع الصورة"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateBanner(editing, form); toast.success("تم تحديث البنر بنجاح!"); }
      else { await createBanner(form); toast.success("تمت إضافة البنر بنجاح!"); }
      setForm(emptyForm); setEditing(null); load();
    } catch(err) { toast.error(err.message || "حدث خطأ"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا البنر؟")) return;
    try { await deleteBanner(id); toast.success("تم الحذف بنجاح"); load(); } catch { toast.error("فشل الحذف"); }
  };

  const toggleActive = async (id, current) => {
    try { await updateBanner(id, { active: !current }); load(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{editing ? "تعديل البنر الترويجي" : "إضافة بنر ترويجي جديد"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="عنوان البنر *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required className="rounded-lg border-gray-200" />
          <Input placeholder="العنوان الفرعي (اختياري)" value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} className="rounded-lg border-gray-200" />
          <div className="space-y-2">
            <Input placeholder="رابط صورة البنر (URL)" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="rounded-lg border-gray-200" />
            <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-accent text-sm text-gray-500">
              <Upload className="w-4 h-4" />{uploading ? "جاري الرفع..." : "أو رفع صورة من الجهاز"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            {form.image && <img src={form.image} alt="" className="h-24 rounded-lg object-cover border" />}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="الرابط (مثال: /shop)" value={form.link} onChange={e=>setForm({...form,link:e.target.value})} className="rounded-lg border-gray-200" />
            <Input placeholder="نص الزر (مثال: اطلب الآن)" value={form.button_text} onChange={e=>setForm({...form,button_text:e.target.value})} className="rounded-lg border-gray-200" />
            <Input type="number" placeholder="ترتيب العرض" value={form.sort_order} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} className="rounded-lg border-gray-200" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> نشط (يظهر في الصفحة الرئيسية)
          </label>
          <div className="flex gap-3">
            <Button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg">{editing ? "حفظ التعديلات" : "إضافة البنر"}</Button>
            {editing && <Button type="button" variant="outline" onClick={()=>{setEditing(null);setForm(emptyForm);}} className="rounded-lg">إلغاء</Button>}
          </div>
        </form>
      </div>
      <div className="space-y-3">
        {banners.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 p-4">
            {b.image && <img src={b.image} alt={b.title} className="w-20 h-12 object-cover rounded-lg border shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{b.title}</p>
              {b.subtitle && <p className="text-xs text-gray-500">{b.subtitle}</p>}
              <p className="text-xs text-gray-400">{b.link} · الترتيب: {b.sort_order}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(b.id, b.active)} className={`px-3 py-1 rounded-full text-xs font-semibold ${b.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {b.active ? "مفعل" : "مخفي"}
              </button>
              <Button size="sm" variant="outline" onClick={() => { setEditing(b.id); setForm({title:b.title,subtitle:b.subtitle||"",image:b.image,link:b.link||"/shop",button_text:b.button_text||"تصفح الكتالوج",active:b.active,sort_order:b.sort_order||0}); }} className="rounded-lg text-xs"><Edit2 className="w-3 h-3" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(b.id)} className="rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
        {banners.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">لا توجد بنرات حالياً. أضف بنراً جديداً بالأعلى!</p>}
      </div>
    </div>
  );
}

// ─── تبويب قطع الغيار والمنتجات ──────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const emptyForm = { 
    name:"", 
    description:"", 
    short_description:"", 
    price:"", 
    original_price:"", 
    category:"فلاتر زيت", 
    car_type:"جميع الموديلات", 
    brand:"أصلي OEM", 
    status:"متوفر بالمخزون", 
    size:"طقم حبة واحدة", 
    image:"", 
    bestseller:false, 
    featured:false, 
    active:true, 
    stock:"100" 
  };
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(() => {
    setLoading(true);
    adminGetProducts().then(setProducts).catch(() => toast.error("فشل في تحميل البيانات")).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (p) => {
    setEditing(p.id);
    setForm({ 
      name: p.name || "", 
      description: p.description || "", 
      short_description: p.short_description || "", 
      price: String(p.price || ""), 
      original_price: p.original_price ? String(p.original_price) : "", 
      category: p.category || "فلاتر زيت", 
      car_type: p.car_type || "جميع الموديلات", 
      brand: p.brand || "أصلي OEM", 
      status: p.status || "متوفر بالمخزون", 
      size: p.size || "طقم حبة واحدة", 
      image: p.image || "", 
      bestseller: !!p.bestseller, 
      featured: !!p.featured, 
      active: p.active !== false, 
      stock: String(p.stock || 100) 
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setForm(prev => ({...prev, image: url})); toast.success("تم رفع صورة القطعة!"); }
    catch { toast.error("فشل في رفع الصورة"); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { 
      ...form, 
      price: parseFloat(form.price), 
      original_price: form.original_price ? parseFloat(form.original_price) : null, 
      stock: parseInt(form.stock) || 100 
    };
    try {
      if (editing) { await updateProduct(editing, payload); toast.success("تم تحديث قطعة الغيار!"); }
      else { await createProduct(payload); toast.success("تمت إضافة قطعة الغيار بنجاح!"); }
      setForm(emptyForm); setEditing(null); load();
    } catch(err) { toast.error(err.message || "حدث خطأ أثناء الحفظ"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف قطعة الغيار هذه؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    try { await deleteProduct(id); toast.success("تم حذف القطعة بنجاح"); load(); } catch(err) { toast.error(err.message || "فشل الحذف"); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{editing ? "تعديل بيانات قطعة الغيار" : "إضافة قطعة غيار جديدة"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="اسم قطعة الغيار *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="rounded-lg border-gray-200" />
            <div className="space-y-2">
              <Input placeholder="رابط صورة القطعة (URL)" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="rounded-lg border-gray-200" />
              <label className="flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-accent text-xs text-gray-500">
                <Upload className="w-3 h-3" />{uploading ? "جاري الرفع..." : "أو رفع صورة من الجهاز"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
              {form.image && <img src={form.image} alt="" className="w-12 h-12 object-cover rounded-lg border" />}
            </div>
          </div>

          <Input placeholder="وصف مختصر للقطعة" value={form.short_description} onChange={e=>setForm({...form,short_description:e.target.value})} className="rounded-lg border-gray-200" />
          <Textarea placeholder="التفاصيل والمواصفات الكاملة للقطعة *" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required className="rounded-lg border-gray-200 min-h-[60px]" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">السعر الحالي (ر.س) *</label>
              <Input placeholder="السعر *" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required className="rounded-lg border-gray-200" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">السعر قبل الخصم (ر.س)</label>
              <Input placeholder="السعر الأصلي" type="number" value={form.original_price} onChange={e=>setForm({...form,original_price:e.target.value})} className="rounded-lg border-gray-200" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">المقاس / الحجم / العدد</label>
              <Input placeholder="مثال: طقم 4 حبات" value={form.size} onChange={e=>setForm({...form,size:e.target.value})} className="rounded-lg border-gray-200" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">الكمية بالمخزون</label>
              <Input placeholder="الكمية" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="rounded-lg border-gray-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">القسم والتصنيف</label>
              <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full h-9 px-3 border border-gray-200 bg-white text-sm rounded-lg">
                {mockCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">نوع وموديلات السيارات المتوافقة</label>
              <Input placeholder="مثال: تويوتا كامري / كورولا" value={form.car_type} onChange={e=>setForm({...form,car_type:e.target.value})} className="rounded-lg border-gray-200" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">الشركة المصنعة / الماركة</label>
              <Input placeholder="مثال: أصلي OEM أو Denso" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})} className="rounded-lg border-gray-200" />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-gray-600 pt-2">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.bestseller} onChange={e=>setForm({...form,bestseller:e.target.checked})} /> الأكثر طلباً</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /> مميز في الصفحة الرئيسية</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> متوفر ونشط للعملاء</label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg">{editing ? "حفظ التعديلات" : "إضافة قطعة الغيار"}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setForm(emptyForm); setEditing(null); }} className="rounded-lg">إلغاء</Button>}
          </div>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input placeholder="ابحث في قطع الغيار..." value={search} onChange={e=>setSearch(e.target.value)} className="pr-9 rounded-lg border-gray-200" />
        </div>
        <Button variant="outline" size="sm" onClick={() => exportCSV(filtered.map(p => ({
          "اسم القطعة": p.name,
          "السعر": p.price,
          "السعر الأصلي": p.original_price || "",
          "القسم": p.category,
          "السيارة": p.car_type || "",
          "المخزون": p.stock,
          "نشط": p.active ? "نعم" : "لا",
          "الأكثر طلباً": p.bestseller ? "نعم" : "لا"
        })), "قطع-الغيار")} className="rounded-lg gap-2">
          <Download className="w-4 h-4" />تصدير CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={load} className="rounded-lg"><RefreshCw className="w-4 h-4" /></Button>
      </div>

      {loading ? <p className="text-sm text-gray-400">جاري التحميل...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-right">قطعة الغيار</th>
                <th className="px-4 py-3 text-right">السعر</th>
                <th className="px-4 py-3 text-right">المخزون</th>
                <th className="px-4 py-3 text-right">التصنيف والخصائص</th>
                <th className="px-4 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border shrink-0" />}
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category} {p.car_type && `· ${p.car_type}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{p.price?.toLocaleString("ar-SA")} ر.س</p>
                    {p.original_price && <p className="text-xs text-gray-400 line-through">{p.original_price?.toLocaleString("ar-SA")} ر.س</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.stock ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.bestseller && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">الأكثر طلباً</span>}
                      {p.featured && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">مميز</span>}
                      {!p.active && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">غير نشط</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(p)} className="rounded-lg text-xs"><Edit2 className="w-3 h-3 ml-1" />تعديل</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">لم يتم العثور على قطع غيار مطابقة للبحث</p>}
        </div>
      )}
    </div>
  );
}

// ─── تبويب تصنيفات وأقسام القطع ────────────────────────────────────
function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", slug:"", description:"", active:true, sort_order:0 });

  const load = useCallback(() => { adminGetCategories().then(setCategories).catch(() => {}); }, []);
  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateCategory(editing, form); toast.success("تم تحديث القسم بنجاح!"); }
      else { await createCategory(form); toast.success("تمت إضافة القسم الجديد بنجاح!"); }
      setForm({ name:"", slug:"", description:"", active:true, sort_order:0 }); setEditing(null); load();
    } catch(err) { toast.error(err.message || "حدث خطأ أثناء الحفظ"); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">{editing ? "تعديل بيانات القسم" : "إضافة قسم جديد"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="اسم القسم (مثال: فلاتر زيت) *" value={form.name} onChange={e=>setForm({...form,name:e.target.value,slug:editing?form.slug:e.target.value.toLowerCase().replace(/\s+/g,"-")})} required className="rounded-lg border-gray-200" />
            <Input placeholder="المعرف الإنجليزي في الرابط (Slug مثل: oil-filters) *" value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} required className="rounded-lg border-gray-200" />
          </div>
          <Textarea placeholder="وصف توضيحي للقسم (اختياري)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-lg border-gray-200 min-h-[50px]" />
          <div className="flex items-center gap-4">
            <Input type="number" placeholder="ترتيب الظهور" value={form.sort_order} onChange={e=>setForm({...form,sort_order:parseInt(e.target.value)||0})} className="rounded-lg border-gray-200 w-32" />
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> نشط في الموقع</label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg">{editing ? "حفظ التعديل" : "إضافة القسم"}</Button>
            {editing && <Button type="button" variant="outline" onClick={()=>{setEditing(null);setForm({name:"",slug:"",description:"",active:true,sort_order:0});}} className="rounded-lg">إلغاء</Button>}
          </div>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {categories.map(c => (
            <div key={c.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug} · الترتيب: {c.sort_order}</p>
              </div>
              <div className="flex items-center gap-2">
                {!c.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">غير نشط</span>}
                <Button size="sm" variant="outline" onClick={() => { setEditing(c.id); setForm({ name:c.name, slug:c.slug, description:c.description||"", active:c.active, sort_order:c.sort_order||0 }); }} className="rounded-lg text-xs"><Edit2 className="w-3 h-3 ml-1" />تعديل</Button>
                <Button size="sm" variant="ghost" onClick={async () => { if(!window.confirm("هل ترغب بحذف هذا القسم؟")) return; try { await deleteCategory(c.id); toast.success("تم الحذف بنجاح"); load(); } catch { toast.error("فشل الحذف"); } }} className="rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── تبويب إدارة العلامات التجارية والموديلات ────────────────────────────────────
function BrandsTab() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [viewingBrandProducts, setViewingBrandProducts] = useState(null);

  const emptyForm = {
    nameAr: "",
    nameEn: "",
    slug: "",
    logo: "",
    active: true,
    sort_order: 0,
    models: []
  };
  const [form, setForm] = useState(emptyForm);
  const [newModelName, setNewModelName] = useState("");
  const [newModelKeys, setNewModelKeys] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminGetBrands()
      .then(setBrands)
      .catch(() => toast.error("فشل في تحميل العلامات التجارية"))
      .finally(() => setLoading(false));
    adminGetProducts().then(setProducts).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = brands.filter(b => 
    !search || 
    b.nameAr?.toLowerCase().includes(search.toLowerCase()) || 
    b.nameEn?.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, logo: url }));
      toast.success("تم رفع شعار العلامة التجارية بنجاح!");
    } catch {
      toast.error("فشل في رفع الشعار");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditing(brand.id);
    setForm({
      nameAr: brand.nameAr || "",
      nameEn: brand.nameEn || "",
      slug: brand.slug || "",
      logo: brand.logo || "",
      active: brand.active !== false,
      sort_order: brand.sort_order || 0,
      models: brand.models || []
    });
    setNewModelName("");
    setNewModelKeys("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddModel = () => {
    if (!newModelName.trim()) return;
    const modelId = `${form.slug || "model"}-${Date.now()}`;
    const keys = newModelKeys.trim() 
      ? newModelKeys.split(/[,،]/).map(k => k.trim()).filter(Boolean)
      : [newModelName.trim()];

    setForm(prev => ({
      ...prev,
      models: [
        ...prev.models,
        { id: modelId, nameAr: newModelName.trim(), matchKeys: keys }
      ]
    }));
    setNewModelName("");
    setNewModelKeys("");
  };

  const handleRemoveModel = (idx) => {
    setForm(prev => ({
      ...prev,
      models: prev.models.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      sort_order: parseInt(form.sort_order) || 0
    };

    try {
      if (editing) {
        await updateBrand(editing, payload);
        toast.success("تم تحديث بيانات العلامة التجارية!");
      } else {
        await createBrand(payload);
        toast.success("تمت إضافة العلامة التجارية بنجاح!");
      }
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه العلامة التجارية؟ سيتم حذف الموديلات التابعة لها أيضاً.")) return;
    try {
      await deleteBrand(id);
      toast.success("تم حذف العلامة التجارية بنجاح");
      load();
    } catch {
      toast.error("فشل حذف العلامة التجارية");
    }
  };

  // Products associated with a brand
  const getBrandProducts = (brand) => {
    if (!brand) return [];
    const brandNameAr = brand.nameAr.toLowerCase();
    const brandNameEn = brand.nameEn?.toLowerCase() || "";
    const allMatchKeys = (brand.models || []).flatMap(m => m.matchKeys || []);

    return products.filter(p => {
      const carType = (p.car_type || "").toLowerCase();
      const prodBrand = (p.brand || "").toLowerCase();
      const matchesName = carType.includes(brandNameAr) || prodBrand.includes(brandNameAr) || (brandNameEn && (carType.includes(brandNameEn) || prodBrand.includes(brandNameEn)));
      const matchesModel = allMatchKeys.some(key => carType.includes(key.toLowerCase()));
      return matchesName || matchesModel;
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">
          {editing ? "تعديل العلامة التجارية" : "إضافة علامة تجارية جديدة"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">اسم العلامة بالعربية *</label>
              <Input
                placeholder="مثال: تويوتا"
                value={form.nameAr}
                onChange={e => setForm({
                  ...form,
                  nameAr: e.target.value,
                  slug: editing ? form.slug : (form.nameEn ? form.nameEn.toLowerCase().replace(/\s+/g, "-") : form.slug)
                })}
                required
                className="rounded-lg border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">الاسم بالإنجليزية (اختياري)</label>
              <Input
                placeholder="مثال: Toyota"
                value={form.nameEn}
                onChange={e => setForm({
                  ...form,
                  nameEn: e.target.value,
                  slug: editing ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, "-")
                })}
                className="rounded-lg border-gray-200"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">المعرف في الرابط (Slug) *</label>
              <Input
                placeholder="مثال: toyota"
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                required
                className="rounded-lg border-gray-200"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 block mb-1">شعار العلامة التجارية (Logo)</label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Input
                placeholder="رابط صورة الشعار (URL)"
                value={form.logo}
                onChange={e => setForm({ ...form, logo: e.target.value })}
                className="rounded-lg border-gray-200 flex-1"
              />
              <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-accent text-xs text-gray-600 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? "جاري الرفع..." : "رفع شعار من الجهاز"}
                <input type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} disabled={uploading} />
              </label>
              {form.logo && (
                <div className="w-12 h-12 rounded-lg border bg-gray-50 p-1 flex items-center justify-center shrink-0">
                  <img src={form.logo} alt="معاينة" className="max-w-full max-h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Models Management */}
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 block">
                موديلات السيارات التابعة للعلامة ({form.models.length})
              </label>
              <span className="text-[11px] text-gray-400">تساعد في فلترة وربط قطع الغيار تلقائياً</span>
            </div>

            {form.models.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.models.map((m, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 shadow-xs">
                    <Car className="w-3 h-3 text-brand-primary" />
                    <strong>{m.nameAr}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveModel(idx)}
                      className="text-red-400 hover:text-red-600 transition-colors ml-1"
                      title="حذف الموديل"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="اسم الموديل (مثال: كامري)"
                value={newModelName}
                onChange={e => setNewModelName(e.target.value)}
                className="rounded-lg border-gray-200 text-xs h-8 sm:w-1/3 bg-white"
              />
              <Input
                placeholder="كلمات المطابقة بقطع الغيار مفصولة بفاصلة (اختياري، مثل: كامري, camry)"
                value={newModelKeys}
                onChange={e => setNewModelKeys(e.target.value)}
                className="rounded-lg border-gray-200 text-xs h-8 flex-1 bg-white"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddModel}
                className="rounded-lg h-8 text-xs shrink-0 gap-1 bg-white"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة موديل
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">ترتيب الظهور:</label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="rounded-lg border-gray-200 w-24 h-8 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
              />
              نشطة ومتاحة في الكتالوج
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg text-xs sm:text-sm">
              {editing ? "حفظ تعديلات العلامة" : "إضافة العلامة التجارية"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => { setEditing(null); setForm(emptyForm); }}
                className="rounded-lg text-xs sm:text-sm"
              >
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Search & Export Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="ابحث في العلامات التجارية..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pr-9 rounded-lg border-gray-200 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportCSV(filtered.map(b => ({
            "العلامة": b.nameAr,
            "الاسم بالإنجليزية": b.nameEn || "",
            "المعرف": b.slug,
            "عدد الموديلات": b.models?.length || 0,
            "الحالة": b.active ? "نشطة" : "غير نشطة",
            "الترتيب": b.sort_order
          })), "العلامات-التجارية")}
          className="rounded-lg gap-2 text-xs"
        >
          <Download className="w-4 h-4" /> تصدير CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={load} className="rounded-lg">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Brands List Table */}
      {loading ? (
        <p className="text-sm text-gray-400">جاري تحميل العلامات التجارية...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-right">العلامة التجارية</th>
                <th className="px-5 py-3 text-right">الموديلات المتوفرة</th>
                <th className="px-5 py-3 text-right">قطع الغيار المرتبطة</th>
                <th className="px-5 py-3 text-right">الحالة</th>
                <th className="px-5 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(brand => {
                const brandProducts = getBrandProducts(brand);
                return (
                  <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border p-1 flex items-center justify-center shrink-0">
                          {brand.logo ? (
                            <img src={brand.logo} alt={brand.nameAr} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <Car className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{brand.nameAr}</p>
                          <p className="text-xs text-gray-400">{brand.nameEn || brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-800">{brand.models?.length || 0} موديل</span>
                        {brand.models?.length > 0 && (
                          <span className="text-[11px] text-gray-400">
                            ({brand.models.slice(0, 3).map(m => m.nameAr).join("، ")}{brand.models.length > 3 ? "..." : ""})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setViewingBrandProducts(brand)}
                        className="inline-flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-accent font-bold hover:underline"
                        title="عرض القطع المرتبطة بهذه العلامة"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{brandProducts.length} قطعة متوفرة</span>
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${brand.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {brand.active ? "نشطة" : "معطلة"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/brands/${brand.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors"
                          title="معاينة في الموقع"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(brand)}
                          className="rounded-lg text-xs"
                        >
                          <Edit2 className="w-3 h-3 ml-1" /> تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(brand.id)}
                          className="rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-gray-400 text-sm">لم يتم العثور على علامات تجارية مطابقة</p>
          )}
        </div>
      )}

      {/* Modal to view products associated with a brand */}
      {viewingBrandProducts && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setViewingBrandProducts(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto space-y-4 text-right dir-rtl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center p-1">
                  {viewingBrandProducts.logo ? (
                    <img src={viewingBrandProducts.logo} alt="" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Car className="w-4 h-4 text-brand-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    قطع الغيار المرتبطة بـ: {viewingBrandProducts.nameAr}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {getBrandProducts(viewingBrandProducts).length} قطعة متطابقة في المخزون
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingBrandProducts(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {getBrandProducts(viewingBrandProducts).map(p => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {p.image && <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg border shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category} · {p.car_type || "عام"}</p>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="font-bold text-brand-primary text-sm">{p.price?.toLocaleString("ar-SA")} ر.س</span>
                  </div>
                </div>
              ))}
              {getBrandProducts(viewingBrandProducts).length === 0 && (
                <p className="py-8 text-center text-gray-400 text-sm">لا توجد قطع غيار مسجلة لهذه العلامة التجارية حالياً.</p>
              )}
            </div>

            <div className="pt-2 text-left">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingBrandProducts(null)}
                className="rounded-lg text-xs"
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── تبويب رسائل واستفسارات العملاء ──────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    adminGetMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = filterByDate(
    messages.filter(m => !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase())),
    "created_at", fromDate, toDate
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input placeholder="بحث في الرسائل..." value={search} onChange={e=>setSearch(e.target.value)} className="pr-9 rounded-lg border-gray-200" />
        </div>
        <Input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="rounded-lg border-gray-200 w-36" />
        <Input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="rounded-lg border-gray-200 w-36" />
        <Button variant="outline" size="sm" onClick={() => exportCSV(filtered.map(m => ({
          "الاسم": m.name,
          "البريد الإلكتروني": m.email,
          "الهاتف": m.phone || "",
          "نص الرسالة": m.message,
          "التاريخ": new Date(m.created_at).toLocaleDateString("ar-SA")
        })), "رسائل-العملاء")} className="rounded-lg gap-2"><Download className="w-4 h-4" />تصدير CSV</Button>
        <Button variant="ghost" size="sm" onClick={load} className="rounded-lg"><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <p className="text-sm text-gray-500">{filtered.filter(m=>!m.read).length} رسائل غير مقروءة من أصل {filtered.length}</p>
      {loading ? <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div> : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className={`rounded-xl border p-5 ${!m.read ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-800">{m.name}</span>
                    <span className="text-xs text-gray-500">{m.email}</span>
                    {m.phone && <span className="text-xs text-gray-400">{m.phone}</span>}
                    {!m.read && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">جديدة</span>}
                  </div>
                  <p className="text-sm text-gray-700">{m.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString("ar-SA")}</p>
                </div>
                {!m.read && (
                  <Button size="sm" variant="outline" onClick={async () => { try { await markMessageRead(m.id); setMessages(ms => ms.map(x => x.id === m.id ? {...x, read:true} : x)); } catch {} }} className="rounded-lg text-xs shrink-0">
                    <Check className="w-3 h-3 ml-1" />تمت القراءة
                  </Button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">لا توجد رسائل واردة حالياً</p>}
        </div>
      )}
    </div>
  );
}

// ─── تبويب آراء وتقييمات العملاء ───────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    adminGetReviews().then(setReviews).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const filtered = filterByDate(
    reviews.filter(r => filter === "all" || (filter === "pending" ? !r.approved : r.approved)),
    "created_at", fromDate, toDate
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-600">
          <option value="all">جميع التقييمات</option>
          <option value="pending">بانتظار الموافقة</option>
          <option value="approved">تمت الموافقة</option>
        </select>
        <Input type="date" value={fromDate} onChange={e=>setFromDate(e.target.value)} className="rounded-lg border-gray-200 w-36" />
        <Input type="date" value={toDate} onChange={e=>setToDate(e.target.value)} className="rounded-lg border-gray-200 w-36" />
        <Button variant="outline" size="sm" onClick={() => exportCSV(filtered.map(r => ({
          "اسم العميل": r.customer_name,
          "التقييم": r.rating,
          "العنوان": r.title || "",
          "نص التقييم": r.review_text,
          "المنتج": r.product_name || "",
          "معتمد": r.approved ? "نعم" : "لا",
          "التاريخ": new Date(r.created_at).toLocaleDateString("ar-SA")
        })), "تقييمات-العملاء")} className="rounded-lg gap-2"><Download className="w-4 h-4" />تصدير CSV</Button>
        <Button variant="ghost" size="sm" onClick={load} className="rounded-lg"><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <p className="text-sm text-gray-500">{reviews.filter(r=>!r.approved).length} تقييمات قيد المراجعة · {filtered.length} معروضة</p>
      {loading ? <div className="space-y-3">{[1,2].map(i=><div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div> : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className={`rounded-xl border p-5 ${!r.approved ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-800">{r.customer_name}</span>
                    <span className="text-amber-500 text-sm">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                    {r.title && <span className="text-sm italic text-gray-500">"{r.title}"</span>}
                    {!r.approved && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-bold">بانتظار المراجعة</span>}
                  </div>
                  <p className="text-sm text-gray-600">{r.review_text}</p>
                  {r.product_name && <p className="text-xs text-brand-accent mt-1">القطعة: {r.product_name}</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.created_at).toLocaleDateString("ar-SA")}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.approved ? (
                    <Button size="sm" onClick={async () => { try { await approveReview(r.id, true); toast.success("تمت الموافقة بنجاح!"); load(); } catch { toast.error("فشل الإجراء"); } }} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs">
                      <Check className="w-3 h-3 ml-1" />موافقة ونشر
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={async () => { try { await approveReview(r.id, false); toast.success("تم إخفاء التقييم"); load(); } catch { toast.error("فشل الإجراء"); } }} className="rounded-lg text-xs text-red-500 border-red-200">
                      <X className="w-3 h-3 ml-1" />إخفاء
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400 text-sm">لا توجد تقييمات مطابقة</p>}
        </div>
      )}
    </div>
  );
}

// ─── تبويب إعدادات الموقع ─────────────────────────────────────
function SettingsTab() {
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem("mm_logo_url") || "");
  const [siteName, setSiteName] = useState(localStorage.getItem("mm_site_name") || "الأصيل لقطع الغيار");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setLogoUrl(url); toast.success("تم رفع الشعار!"); }
    catch { toast.error("فشل رفع الشعار"); }
    finally { setUploading(false); }
  };

  const handleSave = () => {
    localStorage.setItem("mm_logo_url", logoUrl);
    localStorage.setItem("mm_site_name", siteName);
    toast.success("تم حفظ الإعدادات بنجاح! حدّث الصفحة لمشاهدة التغييرات.");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-gray-800">هوية وبيانات المتجر</h3>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">اسم المتجر</label>
          <Input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="الأصيل لقطع الغيار" className="rounded-lg border-gray-200" />
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-2">شعار المتجر (Logo)</label>
          <Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="رابط صورة الشعار" className="rounded-lg border-gray-200 mb-2" />
          <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-accent text-sm text-gray-500">
            <Upload className="w-4 h-4" />{uploading ? "جاري الرفع..." : "أو رفع شعار من الجهاز"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          {logoUrl && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
              <img src={logoUrl} alt="معاينة الشعار" className="h-10 object-contain" />
              <span className="text-xs text-gray-500">معاينة الشعار</span>
            </div>
          )}
        </div>
        <Button onClick={handleSave} className="bg-brand-primary hover:bg-brand-accent text-white rounded-lg">حفظ الإعدادات</Button>
      </div>
    </div>
  );
}

// ─── قائمة التنقل الجانبية ───────────────────────────────────────
const navItems = [
  { id:"dashboard",  label:"لوحة الإحصائيات",     icon:BarChart3  },
  { id:"products",   label:"قطع الغيار والأسعار",  icon:Package    },
  { id:"categories", label:"تصنيفات القطع",        icon:Grid       },
  { id:"brands",     label:"العلامات التجارية",    icon:Car        },
  { id:"banners",    label:"البنرات والعروض",       icon:Image      },
  { id:"reviews",    label:"آراء العملاء",         icon:Star       },
  { id:"messages",   label:"رسائل الاستفسارات",    icon:Mail       },
  { id:"settings",   label:"إعدادات الموقع",      icon:Settings   },
];

// ─── الصفحة الرئيسية للوحة التحكم ───────────────────────────────────
export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dir-rtl">
      <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  const tabContent = {
    dashboard:  <DashboardTab />,
    products:   <ProductsTab />,
    categories: <CategoriesTab />,
    brands:     <BrandsTab />,
    banners:    <BannersTab />,
    reviews:    <ReviewsTab />,
    messages:   <MessagesTab />,
    settings:   <SettingsTab />,
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden dir-rtl text-right">
      {/* خلفية معتمة للجوال */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* الشريط الجانبي */}
      <aside className={`fixed inset-y-0 right-0 w-64 z-50 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0 ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "#15232d" }}>
        {/* الشعار */}
        <div className="px-5 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #203342" }}>
          <p className="text-white font-bold text-lg tracking-tight font-heading">الأصيل لقطع الغيار</p>
          <p className="text-xs mt-0.5 text-gray-400">لوحة تحكم وإدارة الكتالوج</p>
        </div>

        {/* عناصر التنقل */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-150 ${activeTab === id ? "bg-brand-primary text-white shadow-sm" : "text-gray-300 hover:bg-gray-800"}`}>
              <Icon className="w-4 h-4 shrink-0" />{label}
            </button>
          ))}
        </nav>

        {/* المستخدم وتسجيل الخروج */}
        <div className="px-4 py-4 flex-shrink-0 space-y-3" style={{ borderTop: "1px solid #203342" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{(user.name||user.email||"أ")[0].toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-gray-800 hover:bg-gray-700">
              <Home className="w-3.5 h-3.5" /> الكتالوج
            </Link>
            <button onClick={logout} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700">
              <LogOut className="w-3.5 h-3.5" /> خروج
            </button>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* شريط العنوان العلوي */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <Grid className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-gray-800 text-lg">لوحة إدارة قطع الغيار والمحتوى</h1>
              <p className="text-xs text-gray-400 hidden sm:block">أهلاً بك، {user.name} · تصفح وتعديل قطع الغيار والتصنيفات والأسعار بسهولة</p>
            </div>
          </div>
          <div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full text-white bg-brand-primary">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> مدير النظام
            </span>
          </div>
        </header>

        {/* مساحة العرض */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
