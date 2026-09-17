import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitMessage } from "@/lib/supabaseApi";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mockData";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setSubmitting(true);
    try {
      await submitMessage(form);
      toast.success("تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error("حدث خطأ أثناء إرسال الرسالة.");
    } finally {
      setSubmitting(false);
    }
  };

  const directWhatsappText = form.name || form.message
    ? `الاسم: ${form.name}\nرقم الهاتف: ${form.phone}\nالرسالة / طلب قطة الغيار: ${form.message}`
    : "السلام عليكم، أرغب في الاستفسار عن قطع غيار لسيارتي";
  
  const directWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(directWhatsappText)}`;

  return (
    <div data-testid="contact-page" className="py-8 sm:py-12 bg-gray-50 dir-rtl min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-8 text-right">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">نحن هنا لخدمتك</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-1">تواصل معنا ولطلب القطع</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form */}
          <div data-testid="contact-form" className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm text-right">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">أرسل استفسارك أو طلبك</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  data-testid="contact-name-input"
                  placeholder="الاسم الكريم *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg border-gray-300 font-body text-right"
                  required
                />
                <Input
                  data-testid="contact-phone-input"
                  placeholder="رقم الجوال *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-lg border-gray-300 font-body text-right"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  data-testid="contact-email-input"
                  placeholder="البريد الإلكتروني (اختياري)"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg border-gray-300 font-body text-right"
                />
                <Input
                  data-testid="contact-subject-input"
                  placeholder="نوع السيارة والموديل"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="rounded-lg border-gray-300 font-body text-right"
                />
              </div>
              <Textarea
                data-testid="contact-message-input"
                placeholder="اكتب أسماء قطع الغيار المطلوبة أو تفاصيل الرسالة *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right min-h-[140px]"
                required
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  data-testid="contact-submit-btn"
                  disabled={submitting}
                  className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg px-6 py-4 font-body font-bold flex-1"
                >
                  {submitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-lg font-body font-bold flex items-center justify-center gap-2 text-sm"
                >
                  طلب مباشر عبر واتساب
                </a>
              </div>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-6 text-right">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">معلومات التواصل والمقر</h2>
              <div className="space-y-4 font-body text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-brand-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">المقر الرئيسي</h3>
                    <p className="text-gray-600">المملكة العربية السعودية - الرياض / جدة</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-brand-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">خدمة العملاء والواتساب</h3>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-brand-accent font-bold hover:underline dir-ltr inline-block">
                      +966 50 000 0000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-brand-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">أوقات العمل</h3>
                    <p className="text-gray-600">من السبت إلى الخميس: 8:00 صباحاً - 10:00 مساءً</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-6 rounded-2xl text-right space-y-3">
              <h3 className="font-heading text-lg font-bold text-gray-900">هل تحتاج تسعيرة سريعة برقم الهيكل (VIN)؟</h3>
              <p className="font-body text-xs text-gray-700 leading-relaxed">
                أرسل صورة استمارة السيارة أو رقم الهيكل عبر الواتساب وسيقوم مهندس المبيعات بتوفير التسعيرة الدقيقة خلال دقائق!
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في تسعيرة قطع غيار برقم الهيكل")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-sm font-body font-bold rounded-lg shadow-sm"
              >
                تواصل فوراً عبر واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
