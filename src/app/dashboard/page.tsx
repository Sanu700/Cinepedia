import DashboardClient from "@/components/dashboard/DashboardClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    return (
        // The client component handles auth checks and data fetching
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <DashboardClient />
        </Suspense>
    );
}
