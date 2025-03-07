
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StatusFiltersProps {
  filterActive: string;
  setFilterActive: (status: string) => void;
  filterCounts: {
    active: number;
    inactive: number;
    archived: number;
  };
}

const StatusFilters: React.FC<StatusFiltersProps> = ({
  filterActive,
  setFilterActive,
  filterCounts,
}) => {
  return (
    <div className="flex overflow-x-auto py-1 scrollbar-hide">
      <div className="flex gap-2">
        <Button
          variant={filterActive === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterActive("active")}
          className={cn(
            "rounded-full text-xs min-w-fit px-3 py-1 h-8",
            filterActive === "active" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700"
          )}
        >
          نشط
          <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
            {filterCounts.active}
          </Badge>
        </Button>
        <Button
          variant={filterActive === "inactive" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterActive("inactive")}
          className={cn(
            "rounded-full text-xs min-w-fit px-3 py-1 h-8",
            filterActive === "inactive" ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-700"
          )}
        >
          غير نشط
          <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
            {filterCounts.inactive}
          </Badge>
        </Button>
        <Button
          variant={filterActive === "archived" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterActive("archived")}
          className={cn(
            "rounded-full text-xs min-w-fit px-3 py-1 h-8",
            filterActive === "archived" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700"
          )}
        >
          مسودة
          <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
            {filterCounts.archived}
          </Badge>
        </Button>
      </div>
    </div>
  );
};

export default StatusFilters;
