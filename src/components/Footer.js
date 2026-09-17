import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Wrench } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mockData";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-gray-900 text-white dir-rtl text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand-accent flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">القمة لقطع الغيار</h3>
            </div>
            <p className="font-body text-xs text-gray-400 leading-relaxed">
              متخصصون في توفير قطع غيار السيارات الأصلية والتجارية المضمونة في جميع أنحاء المملكة العربية السعودية.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm font-bold text-gray-200 mb-4">روابط سريعة</h4>
            <nav className="flex flex-col gap-2.5 font-body text-xs text-gray-400">
              <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <Link to="/shop" className="hover:text-white transition-colors">كتالوج قطع الغيار</Link>
              <Link to="/about" className="hover:text-white transition-colors">من نحن</Link>
              <Link to="/reviews" className="hover:text-white transition-colors">آراء العملاء</Link>
              <Link to="/contact" className="hover:text-white transition-colors">اتصل بنا</Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-sm font-bold text-gray-200 mb-4">تصنيفات المنتجات</h4>
            <nav className="flex flex-col gap-2.5 font-body text-xs text-gray-400">
              <Link to="/shop?category=فلاتر زيت" className="hover:text-white transition-colors">فلاتر زيت</Link>
              <Link to="/shop?category=فلاتر هواء" className="hover:text-white transition-colors">فلاتر هواء</Link>
              <Link to="/shop?category=تيل فرامل" className="hover:text-white transition-colors">تيل فرامل</Link>
              <Link to="/shop?category=بوجيهات" className="hover:text-white transition-colors">بوجيهات</Link>
              <Link to="/shop?category=بطاريات سيارات" className="hover:text-white transition-colors">بطاريات سيارات</Link>
              <Link to="/shop?category=طرمبة مياه" className="hover:text-white transition-colors">طرمبة مياه</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-bold text-gray-200 mb-4">التواصل والطلب</h4>
            <div className="flex flex-col gap-2.5 font-body text-xs text-gray-400">
              <p>المملكة العربية السعودية</p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] font-bold hover:underline dir-ltr text-right block"
              >
                واتساب المبيعات: +966 50 000 0000
              </a>
              <p>ساعات العمل: 8:00 ص - 10:00 م</p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-gray-500">
          <p>&copy; {new Date().getFullYear()} القمة لقطع غيار السيارات. جميع الحقوق محفوظة.</p>
          <p>كتالوج منتجات إلكتروني - المملكة العربية السعودية</p>
        </div>
      </div>
    </footer>
  );
}
