
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useDoc, useMemoFirebase } from "@/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, FileText, Vote } from "lucide-react";
import type { SiteAnalytics } from "@/lib/types";

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function AdminDashboardClient() {
    const router = useRouter();
    const { isAdmin, isLoading: isAdminLoading } = useAdminStatus();
    const firestore = getFirestore();

    const analyticsRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'analytics', 'stats');
    }, [firestore]);
    
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useDoc<SiteAnalytics>(analyticsRef);

    useEffect(() => {
        // This effect handles redirection based on admin status.
        // It only runs when the loading state is `false`.
        if (!isAdminLoading) {
            // If loading is complete and the user is NOT an admin, redirect them.
            if (!isAdmin) {
                router.push('/dashboard');
            }
        }
    }, [isAdmin, isAdminLoading, router]);

    // Show a loading spinner while we are verifying admin status.
    // This prevents the redirect logic from firing prematurely.
    if (isAdminLoading || isAnalyticsLoading) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    // After loading, if the user is not an admin, they will have already been redirected.
    // We can render a fallback or null here just in case the redirect hasn't happened yet.
    if (!isAdmin) {
        return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    // Prepare data for the chart
    const dailySignups = analyticsData?.dailySignups || {};
    const chartData = Object.entries(dailySignups)
        .map(([date, count]) => ({ date, signups: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-4xl font-headline font-bold">Admin Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">An overview of site activity and statistics.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={analyticsData?.totalUsers ?? 0} icon={Users} />
                <StatCard title="Total Reviews" value={analyticsData?.totalReviews ?? 0} icon={FileText} />
                <StatCard title="Total Votes Cast" value={analyticsData?.totalVotes ?? 0} icon={Vote} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Signups</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="signups" fill="hsl(var(--primary))" name="New Users" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
