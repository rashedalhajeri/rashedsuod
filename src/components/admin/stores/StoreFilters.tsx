
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface StoreFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="بحث..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-9 w-full md:w-64"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-full md:w-40">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-400 ml-2" />
            <SelectValue placeholder="جميع المتاجر" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع المتاجر</SelectItem>
          <SelectItem value="active">المتاجر النشطة</SelectItem>
          <SelectItem value="suspended">المتاجر المعلقة</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StoreFilters;
