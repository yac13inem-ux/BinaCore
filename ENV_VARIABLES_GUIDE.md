# 📋 دليل متغيرات البيئة لـ Supabase

## 🔑 أهم متغيرات البيئة (مطلوبة لـ BinaCore)

### ✅ المتغيرات العامة (Public - Client-Side)

هذان المتغيران ضروريان جداً لتشغيل BinaCore:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hgofrwwoasdwkezpdtac.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Nna8krj8BEPYfmaIuT0T1Q_F9fcysDJ
```

**مكان العثور عليها في Supabase:**
1. انتقل إلى: https://supabase.com/dashboard/project/hgofrwwoasdwkezpdtac/settings/api
2. ستجد:
   - **Project URL** = `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key = `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 🔒 متغيرات الخادم (Server-Side - اختيارية حالياً)

هذه المتغيرات للاستخدام المستقبلي (مثل Prisma ORM):

```env
# Connection String with Pooling
DATABASE_URL=postgresql://postgres.hgofrwwoasdwkezpdtac:d8Ar57lIgaVFg75W@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct Connection
DIRECT_URL=postgresql://postgres.hgofrwwoasdwkezpdtac:d8Ar57lIgaVFg75W@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**مكان العثور عليها في Supabase:**
1. انتقل إلى: https://supabase.com/dashboard/project/hgofrwwoasdwkezpdtac/settings/database
2. ستجد:
   - **URI** (نسخه كـ `DATABASE_URL`)
   - **Connection string** (نسخه كـ `DIRECT_URL`)
3. استبدل `YOUR-PASSWORD` بكلمة المرور: `d8Ar57lIgaVFg75W`

---

## 🚀 إعداد المتغيرات على Vercel

### الخطوة 1: فتح صفحة Environment Variables
1. انتقل إلى: https://vercel.com/dashboard
2. اختر مشروع **BinaCore**
3. اذهب إلى: **Settings** → **Environment Variables**

### الخطوة 2: إضافة المتغيرات الأساسية

**المتغير الأول:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://hgofrwwoasdwkezpdtac.supabase.co
```

**المتغير الثاني:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_Nna8krj8BEPYfmaIuT0T1Q_F9fcysDJ
```

### الخطوة 3: حفظ وإعادة النشر
1. اضغط **Save** لكل متغير
2. **مهم جداً**: تأكد من تحديد هذه الخانات:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
3. اذهب إلى **Deployments**
4. اضغط على النقاط الثلاث (⋮) بجانب آخر نشر
5. اختر **Redeploy**

---

## 🔍 شرح كل متغير

| المتغير | الوصف | مطلوب؟ | مكان الاستخدام |
|---------|---------|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase | ✅ نعم | Client-side |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | المفتاح العام للوصول | ✅ نعم | Client-side |
| `DATABASE_URL` | اتصال قاعدة البيانات مع pooling | ⚪ اختياري | Server-side (Prisma) |
| `DIRECT_URL` | اتصال مباشر بقاعدة البيانات | ⚪ اختياري | Server-side (Migrations) |

---

## ⚠️ ملاحظات مهمة

### 1. أمان المفاتيح
- ✅ المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` آمنة للاستخدام في client-side
- ✅ مفتاح `anon` (anonymous) صُمم للوصول العام وآمن
- ❌ **لا تستخدم** مفتاح `service_role` في client-side (يمنح وصول كامل غير مقيد!)

### 2. اختلاف بين الأنواع من المفاتيح

| نوع المفتاح | الوصف | متى تستخدمه |
|-------------|---------|--------------|
| `anon` (public) | مفتاح عام محدود | ✅ Client-side apps (مثل BinaCore) |
| `service_role` | مفتاح كامل للوصول | ⚪ Server-side فقط (مثل API routes) |
| `session` | مفتاح جلسة المستخدم | ⚪ عند تسجيل الدخول |

### 3. أسماء المتغيرات المختلفة

قد ترى هذه الأسماء في Supabase، وهي متطابقة:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ≈ `anon public` key ≈ `publishable` key
- جميعها تُشير لنفس المفتاح العام

---

## 📊 التحقق من الإعداد الصحيح

### اختبار 1: فتح التطبيق
- إذا فتح التطبيق بدون أخطاء → ✅ المتغيرات صحيحة
- إذا ظهر خطأ "Supabase not configured" → ❌ المتغيرات غير مضافة

### اختبار 2: التحقق من Console المتصفح
1. افتح DevTools (F12)
2. انتقل إلى tab **Console**
3. ابحث عن:
   - ✅ لا رسائل تحذير → جيد
   - ❌ `Supabase environment variables are not set` → أضف المتغيرات

### اختبار 3: إنشاء مشروع
1. حاول إنشاء مشروع جديد
2. إذا تم الإنشاء بنجاح → ✅ كل شيء يعمل
3. إذا فشل → تحقق من Row Level Security (RLS) في Supabase

---

## 🛠️ حل المشاكل الشائعة

### المشكلة: "Supabase not configured"
**الحل:**
- تأكد من إضافة المتغيرين الأساسيين في Vercel
- تأكد من أن أسماء المتغيرات تطابق تماماً (حساس للحالة الكبيرة)
- بعد الإضافة، أعد نشر التطبيق (Redeploy)

### المشكلة: "Row level security policy violation"
**الحل:**
1. انتقل إلى: https://supabase.com/dashboard/project/hgofrwwoasdwkezpdtac/auth/policies
2. تأكد من وجود سياسات RLS تسمح بالوصول العام للجداول:
   - `projects`
   - `blocks`
   - `floors`
   - `reports`
   - `problems`

### المشكلة: "CORS error"
**الحل:**
1. انتقل إلى: https://supabase.com/dashboard/project/hgofrwwoasdwkezpdtac/settings/api
2. أضف نطاق Vercel إلى **CORS allowed origins**:
   - `https://bina-core.vercel.app`
   - `https://*.vercel.app`

---

## 📝 القيم النهائية لاستخدامها

انسخ هذه القيم مباشرة إلى Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://hgofrwwoasdwkezpdtac.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Nna8krj8BEPYfmaIuT0T1Q_F9fcysDJ
```

هذه هي المتغيرات الوحيدة المطلوبة حالياً لـ BinaCore! 🎯
