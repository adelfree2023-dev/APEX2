# 🚀 APEX PLATFORM: The Next-Generation Multi-Tenant SaaS Ecosystem

Welcome to the **APEX Platform**. This is not just a software project; it is a high-performance, strictly engineered SaaS infrastructure designed to power 1,000,000+ tenants with absolute isolation, zero-trust security, and hyper-scalability.

---

## 🏛️ Project Architecture (Triple-Lock Protocol)
APEX follows a strict **Atomic Unit** philosophy. Every feature is delivered across three mandatory layers:
1.  **Frontend (UI/UX)**: Located in `apps/`
2.  **Backend (API/Logic)**: Located in `packages/` or `services/`
3.  **Database (Schema)**: Located in `prisma/`

> [!IMPORTANT]
> **"One Layer is a Crime."** Never commit a frontend change without its matching backend logic and data model.

---

## 📜 Core Documentation (Mandatory Reading)
Before contributing, you **must** read and agree to the following protocols. Failure to follow these results in immediate PR rejection.

-   [**Engineering Protocol**](./ENGINEERING_PROTOCOL.md): The technical contract (No `any`, Tenant Isolation, Security).
-   [**Contribution Guide**](./CONTRIBUTING.md): How we build features at APEX.
-   [**Pull Request Template**](./.github/PULL_REQUEST_TEMPLATE.md): The mandatory checklist for every delivery.
-   [**System Anatomy Setup**](./SYSTEM_ANATOMY_SETUP.md): Initial setup and monorepo rules.
-   [**HQ Dashboard**](http://34.18.154.179:7009/admin/dashboard): Central Platform Management (Super Admin).

## 🌐 Remote Deployment (GCP)
The platform is deployed on a dedicated external server with isolated port mapping.

- **Server IP**: `34.18.154.179`
- **Environment**: Isolated `apex_admin` user.
- **Port Range**: `7000 - 7020`

### Port Mapping Reference
| Service | External Port | Internal Port |
|---|---|---|
| PostgreSQL | 7000 | 5432 |
| Redis | 7001 | 6379 |
| MinIO API | 7002 | 9000 |
| MinIO Console | 7003 | 9001 |
| Adminer | 7004 | 8080 |
| Elasticsearch | 7005 | 9200 |
| Backend API** | **7006** | 4000 |
| **Storefront** | **7007** | 3000 |
| Tenant Admin | 7008 | 3001 |
| Super Admin | 7009 | 3002 |
| Marketing | 7010 | 3003 |

### Storefront Access
Each tenant has its own dedicated storefront accessible via:
```
http://{server-ip}:7007/{tenant-slug}
```

**Example**:
- Tenant "ACME Store" with slug `acme` → `http://34.18.154.179:7007/acme`
- Tenant "Demo Shop" with slug `demo` → `http://34.18.154.179:7007/demo`

> [!IMPORTANT]
> Each storefront is **completely isolated**. Products and data are filtered by `tenantId` to ensure zero data leakage between tenants.

### Authentication
Each tenant has dedicated authentication routes:
```
Register: http://{server-ip}:7007/{tenant-slug}/register
Login:    http://{server-ip}:7007/{tenant-slug}/login
```

**Example**:
- ACME Register: `http://34.18.154.179:7007/acme/register`
- ACME Login: `http://34.18.154.179:7007/acme/login`

> [!WARNING]
> **Users are tenant-isolated**. A user registered in tenant A cannot login to tenant B, even with the same email address.

---

## 🚀 Quick Start (Development)

### Prerequisites
-   **Node.js**: v20+
-   **pnpm**: v8+
-   **Docker**: For PostgreSQL and Redis

### Setup Environment
```bash
# Clone and Install
git clone <repository-url>
pnpm install

# Setup Infrastructure
docker-compose up -d

# Initialize Database
pnpm prisma generate
pnpm prisma migrate dev

# Start Development
pnpm dev
```

---

## 🗺️ Roadmap: The 30-Phase Blueprint
The project execution is divided into 30 forensic phases. See the full plan in the `PHASES/` directory.

| Phase | Title | Focus |
|---|---|---|
| **01** | The Storefront Engine | Customer-facing core |
| **02** | Tenant Command Center | Admin Dashboard |
| **03** | SaaS Super Admin | HQ License Management |
| **04** | Marketing & Onboarding | Multi-step registration wizard |
| **...** | ... | ... |

---

## 🛡️ Security & Compliance
-   **Tenant Isolation**: Strict `Apex-Tenant-ID` header enforcement.
-   **Data Gravity**: Regional data residency support.
-   **Access Control**: Role-Based Access Control (RBAC) at the GraphQL resolver level.

---

## 🙏 Acknowledgments
"Engineering is not an art—it is a discipline."
— **Apex Platform Engineering Team**
