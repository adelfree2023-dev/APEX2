// apps/super-admin/app/admin/licenses/page.tsx
import { Card, Title, Subtitle } from "@tremor/react";

export default function LicensesPage() {
    return (
        <main className="p-10">
            <Title>License & Subscriptions</Title>
            <Subtitle>Manage platform-wide usage rights and expirations</Subtitle>

            <Card className="mt-6">
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-slate-400 italic">License Grid (Shadcn V2) with Expiry Tracking will be rendered here</p>
                </div>
            </Card>
        </main>
    );
}
