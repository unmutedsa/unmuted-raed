# كود الترحيب على الواتساب (UNMUTED)

نافذة في المتجر يكتب فيها العميل رقم جواله، ويوصله كود الخصم **على الواتساب فقط**. الكود ما يكون في الموقع أبداً:
محفوظ كسرّ في خادم صغير (Cloudflare Worker) هو اللي يرسل الرسالة من حساب واتساب الأعمال الرسمي.

- `worker.js`: الخادم. يتأكد إن الطلب جاي من المتجر، وإن الزائر مو روبوت (Cloudflare Turnstile)، وإن الرقم جوال سعودي،
  ويرسل الكود **مرة وحدة لكل رقم**، ويحفظ الأرقام عشان تقدرين تنزلينها كملف.
- النافذة نفسها في `../unmuted-raed.js` (الدالة `waOffer`) و`../unmuted-raed.css` (`.um-wa`). **مطفية** لين يتعبّى
  `WA.url` في أعلى الدالة.

## الخطوات

### ١) في سلة: كود الخصم
التسويق ← كوبونات التخفيض ← كوبون جديد:
- الكود: اللي تبينه (مثل `HELLO10`). لا تحطينه في أي بنر أو صفحة.
- **مرة وحدة لكل عميل**، وحد أقصى لعدد الاستخدام الكلي، وتاريخ انتهاء.
- قولي لي النسبة (مثلاً ١٠٪) عشان تطلع في عنوان النافذة، أو نخليها «كود خصم لأول صوت تختاره» بدون رقم.

### ٢) واتساب الأعمال (Meta)، تسوينها أنتِ
1. https://business.facebook.com ← أنشئي حساب أعمال باسم UNMUTED.
2. https://developers.facebook.com ← My Apps ← Create App ← نوع **Business** ← أضيفي **WhatsApp**.
3. أضيفي رقم جوال للمتجر: رقم **مو مسجّل حالياً في تطبيق واتساب** (أو احذفي الواتساب منه أول)، وأكّديه برسالة،
   واسم الظهور `UNMUTED`.
4. في WhatsApp Manager أضيفي **طريقة دفع**: رسائل التسويق تنحسب على كل رسالة.
5. أنشئي **قالب الرسالة** (تحت) وانتظري موافقة Meta (عادة يوم أو يومين).
6. Business Settings ← System users ← أنشئي مستخدم نظام ← **Generate token** بصلاحيات
   `whatsapp_business_messaging` و`whatsapp_business_management`، وانسخي **Phone number ID** من صفحة WhatsApp ← API Setup.

### ٣) قالب الرسالة (WhatsApp Manager ← Message templates ← Create)
- Category: **Marketing** · Name: `unmuted_welcome_code` · Language: **Arabic**
- Body:
  ```
  هلا! هذا كود خصمك على أول صوت تختاره من UNMUTED:
  {{1}}
  استخدمه عند الدفع في unmutedsa.com
  البس صوتك.
  ```
  Sample for {{1}}: `HELLO10`
- Footer (اختياري): `UNMUTED`
- Button: **Copy offer code** (Sample: `HELLO10`). ممكن تضيفين بعده زر **Visit website** على `https://unmutedsa.com`.

### ٤) Cloudflare (مجاني)
1. https://dash.cloudflare.com ← أنشئي حساب.
2. **Turnstile** ← Add widget ← الدومين `unmutedsa.com` ← Mode: **Managed** ← أرسلي لي **Site key** (عادي، مو سرّي).
   الـ **Secret key** لا ترسلينه، يدخل في الخطوة ٦.
3. أنا أشغّل `npx wrangler login` (يفتح المتصفح وأنتِ توافقين)، ثم أنشئ مخزن الأرقام وأرفع الخادم:
   ```
   npx wrangler kv namespace create SENT     # الـ id يدخل في wrangler.toml
   npx wrangler deploy
   ```
4. أعبّي `WA_PHONE_ID` في `wrangler.toml` (مو سرّي) وأرفعه مرة ثانية.

### ٥) الأسرار، تدخلينها أنتِ (لا ترسلينها في المحادثة)
Cloudflare ← Workers ← `unmuted-whatsapp-coupon` ← Settings ← Variables and Secrets ← **Add** (Type: Secret):

| الاسم | القيمة |
|---|---|
| `COUPON_CODE` | كود الخصم من سلة |
| `WA_TOKEN` | توكن مستخدم النظام من Meta |
| `TURNSTILE_SECRET` | الـ Secret key من Turnstile |
| `ADMIN_KEY` | كلمة طويلة تختارينها (لتنزيل الأرقام) |

### ٦) التشغيل
أحط رابط الخادم والـ Site key والنسبة في `WA` داخل `unmuted-raed.js`، نجرّب على رقمك، وبعدها أحفظه في سلة.

## تنزيل الأرقام
`https://<رابط الخادم>/export?key=<ADMIN_KEY>` ← ملف CSV فيه كل رقم وصله الكود ووقته.

## للتجربة محلياً (بدون إرسال حقيقي)
```
npm install
printf 'COUPON_CODE=TESTCODE10\nWA_TOKEN=x\nTURNSTILE_SECRET=1x0000000000000000000000000000000AA\nADMIN_KEY=local-admin\n' > .dev.vars
npx wrangler dev --port 8799 --var DRY_RUN:1
```
`DRY_RUN=1` يسوي كل شي إلا الإرسال للواتساب ويرجّع الرسالة اللي كان بيرسلها. الـ Secret اللي فوق هو مفتاح Turnstile
التجريبي الرسمي (يقبل أي شي).
