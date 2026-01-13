# 🔥 أوامر فتح Firewall Ports على Google Cloud Platform

**المشكلة**: البورتات مقفولة - Connection timeout  
**الحل**: فتح Firewall rules لجميع البورتات المطلوبة

---

## 📋 البورتات المطلوبة

| Service | Port | Protocol |
|---------|------|----------|
| Backend API | 7006 | TCP |
| Storefront | 7007 | TCP |
| Tenant Admin | 7008 | TCP |
| Super Admin | 7009 | TCP |
| Marketing | 7010 | TCP |
| PostgreSQL (SaaS) | 5432 | TCP |
| PostgreSQL (Vendure) | 5433 | TCP |
| Redis | 6379 | TCP |

---

## 🚀 الأوامر (نفذها في Google Cloud Shell)

### الطريقة الأولى: فتح كل البورتات دفعة واحدة (الأسرع)

```bash
gcloud compute firewall-rules create apex-platform-all \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:5432,tcp:5433,tcp:6379,tcp:7006,tcp:7007,tcp:7008,tcp:7009,tcp:7010 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Platform - All required ports"
```

---

### الطريقة الثانية: فتح كل بورت على حدة (للتحكم الدقيق)

#### 1. Backend API (Port 7006)
```bash
gcloud compute firewall-rules create apex-backend-api \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:7006 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Backend API"
```

#### 2. Storefront (Port 7007)
```bash
gcloud compute firewall-rules create apex-storefront \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:7007 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Storefront"
```

#### 3. Tenant Admin (Port 7008)
```bash
gcloud compute firewall-rules create apex-tenant-admin \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:7008 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Tenant Admin"
```

#### 4. Super Admin (Port 7009)
```bash
gcloud compute firewall-rules create apex-super-admin \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:7009 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Super Admin"
```

#### 5. Marketing (Port 7010)
```bash
gcloud compute firewall-rules create apex-marketing \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:7010 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Marketing"
```

#### 6. PostgreSQL - SaaS DB (Port 5432)
```bash
gcloud compute firewall-rules create apex-postgres-saas \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:5432 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX PostgreSQL SaaS"
```

#### 7. PostgreSQL - Vendure DB (Port 5433)
```bash
gcloud compute firewall-rules create apex-postgres-vendure \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:5433 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX PostgreSQL Vendure"
```

#### 8. Redis (Port 6379)
```bash
gcloud compute firewall-rules create apex-redis \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:6379 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Redis"
```

---

## ✅ التحقق من القواعد

بعد تنفيذ الأوامر، تحقق من القواعد:

```bash
gcloud compute firewall-rules list | grep apex
```

**النتيجة المتوقعة**:
```
apex-backend-api       default  INGRESS    1000      0.0.0.0/0  tcp:7006
apex-storefront        default  INGRESS    1000      0.0.0.0/0  tcp:7007
apex-tenant-admin      default  INGRESS    1000      0.0.0.0/0  tcp:7008
apex-super-admin       default  INGRESS    1000      0.0.0.0/0  tcp:7009
apex-marketing         default  INGRESS    1000      0.0.0.0/0  tcp:7010
apex-postgres-saas     default  INGRESS    1000      0.0.0.0/0  tcp:5432
apex-postgres-vendure  default  INGRESS    1000      0.0.0.0/0  tcp:5433
apex-redis             default  INGRESS    1000      0.0.0.0/0  tcp:6379
```

---

## 🧪 اختبار الاتصال

بعد فتح البورتات، اختبر الاتصال:

```bash
# اختبار Super Admin (7009)
curl -I http://34.18.154.179:7009

# اختبار Storefront (7007)
curl -I http://34.18.154.179:7007

# اختبار Backend API (7006)
curl http://34.18.154.179:7006/health
```

---

## ⚠️ ملاحظات أمنية

### للإنتاج (Production):
استبدل `--source-ranges=0.0.0.0/0` بـ IP محدد:

```bash
# مثال: السماح فقط من IP معين
--source-ranges=YOUR_IP_ADDRESS/32
```

### للحذف (إذا احتجت):
```bash
# حذف قاعدة واحدة
gcloud compute firewall-rules delete apex-super-admin

# حذف جميع القواعد
gcloud compute firewall-rules delete apex-backend-api apex-storefront apex-tenant-admin apex-super-admin apex-marketing apex-postgres-saas apex-postgres-vendure apex-redis
```

---

## 🎯 الخطوات السريعة (Copy & Paste)

1. **افتح Google Cloud Shell**: https://shell.cloud.google.com
2. **انسخ والصق الأمر التالي**:

```bash
gcloud compute firewall-rules create apex-platform-all \
    --direction=INGRESS \
    --priority=1000 \
    --network=default \
    --action=ALLOW \
    --rules=tcp:5432,tcp:5433,tcp:6379,tcp:7006,tcp:7007,tcp:7008,tcp:7009,tcp:7010 \
    --source-ranges=0.0.0.0/0 \
    --description="APEX Platform - All required ports"
```

3. **انتظر التأكيد**:
```
Created [https://www.googleapis.com/compute/v1/projects/.../firewall-rules/apex-platform-all].
```

4. **اختبر الآن**:
```bash
curl http://34.18.154.179:7009
```

---

## 🔍 إذا استمرت المشكلة

### تحقق من Docker containers:
```bash
ssh apex_platform@34.18.154.179
docker ps
```

### تأكد أن الخدمات تعمل:
```bash
docker ps | grep apex
```

**يجب أن ترى**:
- apex-manager (Port 3000 → 7006)
- apex-storefront (Port 3000 → 7007)
- apex-super-admin (Port 3002 → 7009)

---

**تاريخ**: 2026-01-13T17:47:00+02:00  
**الحالة**: جاهز للتنفيذ
