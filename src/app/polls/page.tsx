import PollClient from "@/components/polls/PollClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function PollsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
            <PollClient />
        </Suspense>
    );
}
