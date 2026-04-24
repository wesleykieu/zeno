import { DigestCard } from "@/components/dashboard/digest-card";
import { ScheduleWidget } from "@/components/dashboard/schedule-widget";
import { WatchersWidget } from "@/components/dashboard/watchers-widget";
import { PriorityWidget } from "@/components/dashboard/priority-widget";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Greeting } from "@/components/dashboard/greeting";

export default function DashboardPage() {
  return (
    <div className="h-[calc(100dvh-7rem)] overflow-hidden grid grid-cols-[300px_minmax(0,1fr)_260px] grid-rows-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 max-w-[1800px] mx-auto">

      {/* Row 1, Col 1 — greeting, always top-left */}
      <div className="col-start-1 row-start-1 flex items-end">
        <Greeting />
      </div>

      {/* Row 1, Col 2 — search bar, top-center */}
      <div className="col-start-2 row-start-1 flex items-end justify-center">
        <SearchBar />
      </div>

      {/* Col 3, rows 1–2 — right widgets span the full height so nothing clips */}
      <div className="col-start-3 row-start-1 row-span-2 min-h-0 flex flex-col gap-3 overflow-y-auto scrollbar-none">
        <ScheduleWidget />
        <WatchersWidget />
      </div>

      {/* Row 2, Col 1 — priority card fills the row */}
      <div className="col-start-1 row-start-2 h-full min-h-0">
        <PriorityWidget />
      </div>

      {/* Row 2, Col 2 — digest card fills the row, centered horizontally */}
      <div className="col-start-2 row-start-2 h-full min-h-0 flex flex-col items-center">
        <DigestCard />
      </div>

    </div>
  );
}
