import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mockData";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const whatsappText = `السلام عليكم، أرغب في الاستفسار عن كود القطعة / المنتج: ${product.name} (السعر: ${product.price} ر.س)`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }
  };

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden premium-card flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover product-card-image"
          loading="lazy"
        />
        {product.bestseller && (
          <span
            data-testid={`bestseller-badge-${product.id}`}
            className="absolute top-3 right-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded shadow"
          >
            قطع أصلية الأكثر طلباً
          </span>
        )}
        {discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            خصم {discount}%
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
          {product.brand || "أصلي"}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500 font-body">
            <span>{product.category}</span>
            {product.car_type && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">{product.car_type}</span>}
          </div>
          
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-heading text-base sm:text-lg text-gray-900 font-bold leading-snug hover:text-brand-accent transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.short_description || product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-gray-100 space-y-3">
          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-lg font-extrabold text-brand-primary">
                {product.price.toLocaleString("ar-SA")} <span className="text-xs font-body font-normal">ر.س</span>
              </span>
              {product.original_price && (
                <span className="font-body text-xs text-gray-400 line-through">
                  {product.original_price.toLocaleString("ar-SA")} ر.س
                </span>
              )}
            </div>

            {/* Status pill */}
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {product.status || "متوفر بالمخزون"}
            </span>
          </div>

          {/* Action Buttons: WhatsApp & Add to Cart */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`whatsapp-order-${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-3 rounded-lg text-xs sm:text-sm font-body font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm group-hover:shadow"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>واتساب</span>
            </a>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              data-testid={`add-to-cart-${product.id}`}
              title={added ? "تمت الإضافة للسلة" : "إضافة إلى السلة"}
              aria-label="إضافة إلى السلة"
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center shrink-0 ${
                added
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-brand-primary text-white border-brand-primary hover:bg-brand-accent hover:border-brand-accent"
              }`}
            >
              {added ? (
                <Check className="w-4 h-4 animate-in fade-in" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
