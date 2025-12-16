
import { Suspense } from "react";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <AdminDashboardClient />
        </Suspense>
    );
}
