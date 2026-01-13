# 🔗 دليل الروابط الشامل - تجربة جميع المراحل على السيرفر الحي

**السيرفر**: 34.18.154.179  
**التاريخ**: 2026-01-13T17:35:00+02:00  
**المستخدم**: apex_platform  
**المشروع**: /home/apex_platform/apex-platform

---

## 📊 ملخص المراحل

| المرحلة | الحالة | الملفات | الروابط |
|---------|--------|---------|---------|
| Phase 1: Core Trinity | ✅ | 15 | Backend API |
| Phase 2: Admin HQ | ✅ | 8 | Admin Dashboard |
| Phase 3: Storefront | ✅ | 5 | Tenant Storefronts |
| Phase 4: Auth & Registration | ✅ | 9 | Register/Login |
| Phase 5: Products & Catalog | ✅ | 9 | Shop & Products |

**Total**: 46 ملف | 5 مراحل مكتملة

---

## 🌐 الروابط القابلة للتجربة

### المرحلة الأولى: Core Trinity (Backend Infrastructure)

#### 🔧 Backend API
```
Base URL: http://34.18.154.179:7006
```

**اختبار Health Check**:
```bash
curl http://34.18.154.179:7006/health
```
**النتيجة المتوقعة**: `{"status": "ok"}`

---

### المرحلة الثانية: Admin HQ Setup

#### 🏢 Super Admin Dashboard
```
URL: http://34.18.154.179:7009/admin/dashboard
```

**الصفحات**:
- **Dashboard**: http://34.18.154.179:7009/admin/dashboard
- **Tenants**: http://34.18.154.179:7009/admin/tenants
- **Licenses**: http://34.18.154.179:7009/admin/licenses

**ملاحظة**: يتطلب `Apex-Tenant-ID: hq` header

---

### المرحلة الثالثة: Storefront Setup

#### 🛍️ Tenant Storefronts
**Format**: `http://34.18.154.179:7007/{tenant-slug}`

**أمثلة للتجربة**:
```
ACME Store:  http://34.18.154.179:7007/acme
Demo Store:  http://34.18.154.179:7007/demo
Test Store:  http://34.18.154.179:7007/test
```

**اختبار API**:
```bash
# جلب منتجات ACME
curl -H "Apex-Tenant-ID: acme" \
     http://34.18.154.179:7007/api/products?tenantId=acme
```

---

### المرحلة الرابعة: Auth & Registration

#### 🔐 Authentication Pages

**ACME Store**:
- **Register**: http://34.18.154.179:7007/acme/register
- **Login**: http://34.18.154.179:7007/acme/login

**Demo Store**:
- **Register**: http://34.18.154.179:7007/demo/register
- **Login**: http://34.18.154.179:7007/demo/login

**اختبار التسجيل (عبر API)**:
```bash
# تسجيل مستخدم جديد في ACME
curl -X POST http://34.18.154.179:7007/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Apex-Tenant-ID: acme" \
  -d '{
    "tenantId": "acme",
    "email": "test@acme.com",
    "password": "SecurePass123"
  }'
```
**النتيجة المتوقعة**: JWT token + user object

**اختبار تسجيل الدخول**:
```bash
curl -X POST http://34.18.154.179:7007/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Apex-Tenant-ID: acme" \
  -d '{
    "tenantId": "acme",
    "email": "test@acme.com",
    "password": "SecurePass123"
  }'
```

**اختبار العزل (يجب أن يفشل)**:
```bash
# محاولة الدخول بحساب ACME في متجر Demo
curl -X POST http://34.18.154.179:7007/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Apex-Tenant-ID: demo" \
  -d '{
    "tenantId": "demo",
    "email": "test@acme.com",
    "password": "SecurePass123"
  }'
```
**النتيجة المتوقعة**: `401 Unauthorized - Invalid credentials`

---

### المرحلة الخامسة: Products & Catalog

#### 🛒 Shop Pages

**ACME Shop**:
- **Shop Listing**: http://34.18.154.179:7007/acme/shop
- **Product Detail**: http://34.18.154.179:7007/acme/product/{slug}

**Demo Shop**:
- **Shop Listing**: http://34.18.154.179:7007/demo/shop
- **Product Detail**: http://34.18.154.179:7007/demo/product/{slug}

**اختبار إنشاء منتج (عبر API)**:
```bash
# إنشاء منتج في ACME
curl -X POST http://34.18.154.179:7007/api/products \
  -H "Content-Type: application/json" \
  -H "Apex-Tenant-ID: acme" \
  -d '{
    "tenantId": "acme",
    "name": "Blue T-Shirt",
    "slug": "blue-tshirt",
    "price": 29.99,
    "description": "Comfortable blue t-shirt",
    "status": "published"
  }'
```
**النتيجة المتوقعة**: Product object created

**اختبار جلب المنتجات**:
```bash
# جلب منتجات ACME فقط
curl -H "Apex-Tenant-ID: acme" \
     "http://34.18.154.179:7007/api/products?tenantId=acme"
```

**اختبار نفس الـ Slug في مستأجر مختلف (يجب أن ينجح)**:
```bash
# إنشاء منتج بنفس الـ slug في Demo
curl -X POST http://34.18.154.179:7007/api/products \
  -H "Content-Type: application/json" \
  -H "Apex-Tenant-ID: demo" \
  -d '{
    "tenantId": "demo",
    "name": "Blue T-Shirt (Demo)",
    "slug": "blue-tshirt",
    "price": 19.99,
    "status": "published"
  }'
```
**النتيجة المتوقعة**: Success (slug فريد per tenant)

---

## 🧪 اختبارات العزل الحرجة

### اختبار #1: عزل المنتجات بين المستأجرين
```bash
# إنشاء منتج في ACME
curl -X POST http://34.18.154.179:7007/api/products \
  -H "Apex-Tenant-ID: acme" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"acme","name":"ACME Product","slug":"test-product","price":99.99,"status":"published"}'

# محاولة جلبه من Demo (يجب أن لا يظهر)
curl -H "Apex-Tenant-ID: demo" \
     "http://34.18.154.179:7007/api/products?tenantId=demo"
```
**النتيجة المتوقعة**: مصفوفة فارغة أو منتجات Demo فقط

---

### اختبار #2: Draft Products غير مرئية للعملاء
```bash
# إنشاء منتج Draft
curl -X POST http://34.18.154.179:7007/api/products \
  -H "Apex-Tenant-ID: acme" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"acme","name":"Unreleased","slug":"unreleased","price":199.99,"status":"draft"}'

# جلب المنتجات (كعميل)
curl -H "Apex-Tenant-ID: acme" \
     "http://34.18.154.179:7007/api/products?tenantId=acme"
```
**النتيجة المتوقعة**: المنتج Draft لا يظهر (published فقط)

---

### اختبار #3: نفس البريد الإلكتروني في مستأجرين مختلفين
```bash
# تسجيل في ACME
curl -X POST http://34.18.154.179:7007/api/auth/register \
  -H "Apex-Tenant-ID: acme" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"acme","email":"shared@email.com","password":"pass123"}'

# تسجيل بنفس البريد في Demo (يجب أن ينجح)
curl -X POST http://34.18.154.179:7007/api/auth/register \
  -H "Apex-Tenant-ID: demo" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"demo","email":"shared@email.com","password":"pass456"}'
```
**النتيجة المتوقعة**: Both succeed (email unique per tenant)

---

## 📋 قائمة تحقق الجودة

### على السيرفر (SSH)
```bash
ssh -i "C:\Users\Dell\.ssh\gcp_key" apex_platform@34.18.154.179
cd apex-platform
```

**اختبار #1: عدم وجود `any`**:
```bash
grep -r ': any' packages/ apps/ test/ || echo "✅ NO ANY FOUND"
```

**اختبار #2: التحقق من Schema**:
```bash
cat prisma/schema.prisma | grep -A 15 'model Product'
```
**يجب أن يحتوي على**:
- `price Float`
- `description String?`
- `images Json?`
- `@@unique([slug, tenantId])`
- `@@index([tenantId, status])`

**اختبار #3: التحقق من الملفات**:
```bash
ls -la apps/storefront/app/[tenant]/shop/
ls -la apps/storefront/app/[tenant]/product/[slug]/
ls -la apps/storefront/app/api/products/
```

---

## 🚀 سيناريوهات تجربة كاملة

### السيناريو #1: ACME Store (من البداية للنهاية)

1. **التسجيل**:
   - افتح: http://34.18.154.179:7007/acme/register
   - سجل بـ email: `customer@acme.com`

2. **تسجيل الدخول**:
   - افتح: http://34.18.154.179:7007/acme/login
   - استخدم نفس البيانات

3. **تصفح المتجر**:
   - افتح: http://34.18.154.179:7007/acme/shop

4. **عرض منتج**:
   - افتح: http://34.18.154.179:7007/acme/product/blue-tshirt

---

### السيناريو #2: اختبار العزل

1. **إنشاء مستخدم في ACME**:
   ```bash
   curl -X POST http://34.18.154.179:7007/api/auth/register \
     -H "Apex-Tenant-ID: acme" \
     -d '{"tenantId":"acme","email":"test@example.com","password":"pass123"}'
   ```

2. **محاولة الدخول في Demo (يجب أن يفشل)**:
   ```bash
   curl -X POST http://34.18.154.179:7007/api/auth/login \
     -H "Apex-Tenant-ID: demo" \
     -d '{"tenantId":"demo","email":"test@example.com","password":"pass123"}'
   ```

3. **تسجيل في Demo بنفس البريد (يجب أن ينجح)**:
   ```bash
   curl -X POST http://34.18.154.179:7007/api/auth/register \
     -H "Apex-Tenant-ID: demo" \
     -d '{"tenantId":"demo","email":"test@example.com","password":"demo456"}'
   ```

---

## 🎯 الروابط السريعة

### للتجربة المباشرة من المتصفح:

**Admin HQ**:
- http://34.18.154.179:7009/admin/dashboard

**ACME Store**:
- http://34.18.154.179:7007/acme (Home)
- http://34.18.154.179:7007/acme/register
- http://34.18.154.179:7007/acme/login
- http://34.18.154.179:7007/acme/shop

**Demo Store**:
- http://34.18.154.179:7007/demo
- http://34.18.154.179:7007/demo/register
- http://34.18.154.179:7007/demo/login
- http://34.18.154.179:7007/demo/shop

---

## 📊 حالة السيرفر

**Git Status**:
```bash
cd /home/apex_platform/apex-platform
git log --oneline -5
```

**آخر Commit**: d38628e (Phase 5 Complete)  
**Total Commits**: 15+  
**Files**: 46 ملف

---

## ✅ التحقق النهائي

**قائمة تحقق**:
- [x] جميع الملفات موجودة على السيرفر
- [x] عدم وجود `any` في الكود
- [x] Tenant isolation مُطبَّق
- [x] Auth system يعمل
- [x] Products catalog جاهز
- [x] SEO-friendly URLs (`@@unique([slug, tenantId])`)

---

**تاريخ التحقق**: 2026-01-13T17:35:00+02:00  
**الحالة**: ✅ **جميع المراحل جاهزة للتجربة**
