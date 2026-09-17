import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Wrench } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/admin";
  const [form, setForm] = useState({ email: "admin@spareparts.com", password: "password" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
      toast.success("أهلاً بك! تم تسجيل الدخول بنجاح.");
    } catch (err) {
      toast.error("بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-[70vh] flex items-center justify-center py-12 px-4 dir-rtl text-right">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center mx-auto mb-2">
            <Wrench className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            دخول لوحة التحكم والإدارة
          </h1>
          <p className="font-body text-xs text-gray-500">
            سجل الدخول لإدارة كتالوج قطع الغيار والأسعار والصور
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs font-bold text-gray-700 block mb-1">البريد الإلكتروني</label>
            <Input
              data-testid="login-email-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border-gray-300 font-body text-right"
              required
            />
          </div>
          <div>
            <label className="font-body text-xs font-bold text-gray-700 block mb-1">كلمة المرور</label>
            <Input
              data-testid="login-password-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-lg border-gray-300 font-body text-right"
              required
            />
          </div>

          <Button
            type="submit"
            data-testid="auth-submit-btn"
            disabled={loading}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary/90 rounded-lg py-3 font-body font-bold"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="p-3 bg-gray-50 rounded-lg text-center border border-gray-100">
          <p className="font-body text-xs text-gray-500">بيانات التسلجيل الافتراضية محددة تلقائياً للتحكم بالكتالوج</p>
        </div>
      </div>
    </div>
  );
}
