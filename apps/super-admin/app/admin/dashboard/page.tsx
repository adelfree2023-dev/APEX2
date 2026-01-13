// apps/super-admin/app/admin/dashboard/page.tsx
import { Card, Title, Text, Metric, Grid, AreaChart } from "@tremor/react";

export default function AdminDashboard() {
    // Requirement: Fetch metrics from /api/analytics with Apex-Tenant-ID: hq
    return (
        <main className="p-10 bg-slate-50 min-h-screen">
            <Title className="text-3xl font-bold mb-6 text-slate-800">Admin HQ Dashboard</Title>

            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mb-10">
                <Card decoration="top" decorationColor="indigo">
                    <Text>Platform MRR</Text>
                    <Metric>$42,500</Metric>
                </Card>
                <Card decoration="top" decorationColor="emerald">
                    <Text>Active Tenants</Text>
                    <Metric>124</Metric>
                </Card>
                <Card decoration="top" decorationColor="amber">
                    <Text>Critical Alerts</Text>
                    <Metric>2</Metric>
                </Card>
            </Grid>

            <Card className="mt-6">
                <Title>Revenue Growth (Projected)</Title>
                <AreaChart
                    className="h-72 mt-4"
                    data={[]}
                    index="date"
                    categories={["MRR"]}
                    colors={["indigo"]}
                />
            </Card>
        </main>
    );
}
