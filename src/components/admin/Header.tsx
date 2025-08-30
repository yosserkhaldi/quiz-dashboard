import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Header({ onRefresh }: { onRefresh: () => void }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-purple-700 flex items-center gap-2">
                    <span>🧠</span> Quiz Dashboard
                </h1>
                <p className="text-base text-gray-600 mt-1">
                    Challenge your brain. Compete with friends. Get smarter every day.
                </p>
            </div>
            <div className="flex gap-2">
                <Button className="border-blue-200" variant="outline" onClick={onRefresh}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>
    );
}
