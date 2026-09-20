# MY QUESTION ARCHIVE

## الملفات كلها بجوار index.html
بعد فك الضغط ستجد:
- index.html
- supabase-schema.sql
- student-accounts.txt
- auth-login.ts
- admin-api.ts
- chat.ts
- README.md

## رفع الموقع
ارفع `index.html` وباقي الملفات إلى جذر GitHub Repository.
لا يوجد مجلد إضافي يحتوي المشروع.

## قاعدة البيانات
شغّل `supabase-schema.sql` مرة واحدة في:
Supabase → SQL Editor → Run

## Edge Functions
الملفات:
- auth-login.ts
- admin-api.ts
- chat.ts

هذه الملفات تم وضعها بجوار index.html لتسهيل إدارة المشروع ورفعه.

عند إنشاء Edge Function من Supabase Dashboard:
- أنشئ Function باسم `auth-login` وانسخ محتوى `auth-login.ts` داخل index.ts.
- أنشئ Function باسم `admin-api` وانسخ محتوى `admin-api.ts`.
- أنشئ Function باسم `chat` وانسخ محتوى `chat.ts`.

إذا كنت تستخدم Supabase CLI، انقل كل ملف إلى:
`supabase/functions/<اسم-function>/index.ts`
قبل تنفيذ deploy.

## Secrets المطلوبة داخل Supabase Edge Functions
- SUPABASE_SERVICE_ROLE_KEY
- APP_SESSION_SECRET

لا تضع Service Role Key داخل index.html أو GitHub.

## الحسابات
ملف `student-accounts.txt` يحتوي 110 حساب طالب وحساب الأدمن المميز.

## التصميم
تم الحفاظ على تصميم:
Vintage / Dark Retro / Old Archive / Gothic / Mystery
