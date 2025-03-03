
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, User, Mail, Phone, Calendar, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import CustomerStats from "@/components/customer/CustomerStats";

// نوع البيانات للعملاء
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  totalOrders: number;
  totalSpent: number;
  avatar?: string;
}

// بيانات وهمية للعملاء (سيتم استبدالها بالبيانات الحقيقية)
const dummyCustomers: Customer[] = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "966500000001",
    joinDate: new Date(2023, 0, 15),
    totalOrders: 5,
    totalSpent: 850,
  },
  {
    id: "2",
    name: "سارة علي",
    email: "sarah@example.com",
    phone: "966500000002",
    joinDate: new Date(2023, 1, 20),
    totalOrders: 3,
    totalSpent: 600,
  },
  {
    id: "3",
    name: "محمد عبدالله",
    email: "mohammed@example.com",
    phone: "966500000003",
    joinDate: new Date(2023, 2, 10),
    totalOrders: 7,
    totalSpent: 1200,
  },
  {
    id: "4",
    name: "فاطمة خالد",
    email: "fatima@example.com",
    phone: "966500000004",
    joinDate: new Date(2023, 3, 5),
    totalOrders: 2,
    totalSpent: 450,
  },
  {
    id: "5",
    name: "علي حسن",
    email: "ali@example.com",
    phone: "966500000005",
    joinDate: new Date(2023, 4, 15),
    totalOrders: 4,
    totalSpent: 780,
  },
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // تصفية العملاء حسب البحث
  const filteredCustomers = dummyCustomers.filter((customer) => {
    return (
      searchQuery === "" ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">العملاء</h1>
        <p className="text-muted-foreground mt-1">إدارة قاعدة عملائك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CustomerStats 
          newCustomers={2}
          totalCustomers={dummyCustomers.length}
          activeCustomers={4}
          averageSpend={775}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-lg font-semibold">قائمة العملاء</h2>
          <span className="text-muted-foreground text-sm bg-muted px-1.5 py-0.5 rounded-md">
            {filteredCustomers.length}
          </span>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن عميل..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)] w-full">
            <div className="space-y-0.5">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <React.Fragment key={customer.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {customer.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {customer.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {format(customer.joinDate, "dd/MM/yyyy", { locale: ar })}
                          </span>
                        </div>
                        <div className="w-32 text-left">
                          <div className="font-medium">
                            {customer.totalOrders} طلب
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {customer.totalSpent.toLocaleString()} ريال إجمالي
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/dashboard/customers/${customer.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
                ))
              ) : (
                <div className="py-12 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    لا يوجد عملاء مطابقون لعملية البحث
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
