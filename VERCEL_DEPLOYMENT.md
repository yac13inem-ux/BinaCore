# 🚀 تعليمات النشر على Vercel

## الخطوات الأساسية

### 1️⃣ إعداد المستودع
```bash
git add .
git commit -m "تحديث"
git push origin main
```

### 2️⃣ الاتصال بـ Vercel
1. انتقل إلى [vercel.com](https://vercel.com)
2. قم بتسجيل الدخول أو إنشاء حساب
3. اضغط على "Add New Project"
4. استورد المستودع من GitHub: `adelbenbelaid091-cpu/BinaCore-V1`

### 3️⃣ إعداد المتغيرات البيئية (مهم جداً!)

بعد استيراد المشروع في Vercel، انتقل إلى:
1. **Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://hgofrwwoasdwkezpdtac.supabase.co
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_Nna8krj8BEPYfmaIuT0T1Q_F9fcysDJ
```

3. **مهم جداً**: تأكد من تحديد:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. اضغط على **Save**

### 4️⃣ إعادة النشر

بعد إضافة المتغيرات البيئية:
1. انتقل إلى **Deployments**
2. اضغط على النقاط الثلاث (⋮) بجانب آخر عملية نشر
3. اختر **Redeploy**

## 🔍 حل المشاكل الشائعة

### المشكلة: "Application error: a client-side exception has occurred"

**السبب:** المتغيرات البيئية غير مضبوطة بشكل صحيح.

**الحل:**
1. تأكد من أن المتغيرات البيئية مضافة في Vercel
2. تأكد من أن:
   - `NEXT_PUBLIC_SUPABASE_URL` يبدأ بـ `https://` (بدون `//` إضافية)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` يحتوي على المفتاح الصحيح
3. انتقل إلى Deployments واضغط **Redeploy**

### المشكلة: الصفحة تظهر فارغة أو تحميل لفترة طويلة

**السبب:** Supabase لا يستجيب.

**الحل:**
1. تحقق من لوحة تحكم Supabase: https://supabase.com/dashboard
2. تأكد من أن الجداول موجودة:
   - `projects`
   - `blocks`
   - `floors`
   - `reports`
   - `problems`
3. تأكد من أن Row Level Security (RLS) يسمح بالوصول العام

### المشكلة: "Supabase not configured"

**السبب:** المتغيرات البيئية غير موجودة أو خاطئة.

**الحل:** راجع الخطوة 3️⃣ أعلاه.

## 📊 التحقق من الحالة

بعد النشر، يمكنك التحقق من الحالة من:
- لوحة تحكم Vercel: عرض سجلات البناء
- لوحة تحكم Supabase: عرض اتصالات API
- console المتصفح: عرض أخطاء JavaScript

## 🔧 المتغيرات البيئية المطلوبة

```
NEXT_PUBLIC_SUPABASE_URL=https://hgofrwwoasdwkezpdtac.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Nna8krj8BEPYfmaIuT0T1Q_F9fcysDJ
```

## 📝 ملاحظات مهمة

- جميع المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` ستكون متاحة في client-side
- تأكد من عدم استخدام `//` مزدوجة في URL (مثل `https://` وليس `https://`)
- بعد إضافة المتغيرات، يجب إعادة نشر التطبيق لتفعيلها
