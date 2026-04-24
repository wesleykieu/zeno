import { DigestCard } from "@/components/dashboard/digest-card";
import { ScheduleWidget } from "@/components/dashboard/schedule-widget";
import { WatchersWidget } from "@/components/dashboard/watchers-widget";
import { PriorityWidget } from "@/components/dashboard/priority-widget";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Greeting } from "@/components/dashboard/greeting";

export default function DashboardPage() {
  return (
    <div className="relative h-[calc(100vh-3rem)] overflow-hidden flex items-center justify-center px-6">
      <div className="absolute top-4 left-4">
        <Greeting />
      </div>
      <div className="absolute top-0 left-0 h-full flex flex-col justify-center p-4 w-80">
        <PriorityWidget />
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <SearchBar />
      </div>
      <DigestCard />
      <div className="absolute top-0 right-0 h-full overflow-y-auto scrollbar-none flex flex-col gap-4 p-4 w-72">
        <ScheduleWidget />
        <WatchersWidget />
      </div>
    </div>
  );
}
