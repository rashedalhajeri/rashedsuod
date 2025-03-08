
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomerFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: "all" | "active" | "inactive";
  setStatusFilter: (value: "all" | "active" | "inactive") => void;
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3 pr-9"
        />
      </div>
      
      <Select 
        value={statusFilter} 
        onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="تصفية حسب الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">جميع العملاء</SelectItem>
          <SelectItem value="active">العملاء النشطين</SelectItem>
          <SelectItem value="inactive">العملاء غير النشطين</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomerFilters;
