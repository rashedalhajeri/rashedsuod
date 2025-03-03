
import React from "react";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  product_count: number;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>اسم القسم</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>ترتيب العرض</TableHead>
            <TableHead>عدد المنتجات</TableHead>
            <TableHead className="text-left">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-xs">
                <span className="line-clamp-1">{category.description || "-"}</span>
              </TableCell>
              <TableCell>{category.display_order || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-primary-50 text-primary-700 hover:bg-primary-100">
                  {category.product_count}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
