import { Link } from "react-router-dom";
import { ShieldCheck, Wrench, Truck, CheckCircle2 } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mockData";

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="bg-gray-50 dir-rtl">
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-right">
          <div className="max-w-3xl space-y-4">
            <span className="bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded inline-block">
              الخبرة والموثوقية
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight">
              الأصيل لقطع غيار السيارات <br />
              <span className="text-gray-300">ثقتك الخيار الأول لسيارتك</span>
            </h1>
            <p className="font-body text-base text-gray-300 leading-relaxed">
              نحن مؤسسة متخصصة في توفير واستيراد قطع غيار السيارات الأصلية والبدائل المعتمدة ذات الجودة العالية لجميع أنواع السيارات اليابانية، الكورية، والأمريكية في المملكة العربية السعودية.
            </p>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-right space-y-3">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900">ضمان الجودة والمطابقة</h3>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                جميع القطع المعروضة بالكتالوج مفحوصة ومطابقة لمواصفات المصنع ورقم الهيكل لضمان أداء ممتاز وعمر طويل.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-right space-y-3">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900">فريق فني متكافيء</h3>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                يقوم فريقنا بمساعدتك في اختيار قطع الغيار الصحيحة وتزويدك بالاستشارة الفنية المناسبة قبل عملية الطلب.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-right space-y-3">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-900">توصيل سريع للموقع</h3>
              <p className="font-body text-xs text-gray-600 leading-relaxed">
                نوفر خدمة الشحن الفوري والسريع لمختلف مناطق المملكة العربية السعودية مع إمكانية التنسيق المباشر عبر الواتساب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-3">هل تحتاج إلى قطعة غيار محددة غير معروضة بالكتالوج؟</h2>
          <p className="font-body text-sm text-gray-600 mb-6">تواصل معنا الآن برقم الهيكل وسم اسم القطعة وسنقوم بالبحث عنها فوراً في مخازننا.</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في الاستفسار عن قطعة غيار برقم الهيكل")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-4 font-body font-bold rounded-xl shadow-md text-base"
          >
            تواصل معنا عبر واتساب الآن
          </a>
        </div>
      </section>
    </div>
  );
}
