
import React, { useState } from "react";
import { Check, ChevronsUpDown, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Store {
  id: string;
  name: string;
  domain: string;
}

// Mock stores for demo purposes
const stores: Store[] = [
  { id: "1", name: "متجر الإلكترونيات", domain: "electronics.store" },
  { id: "2", name: "متجر الملابس", domain: "fashion.store" },
  { id: "3", name: "متجر الأحذية", domain: "shoes.store" },
];

interface StoreSelectorProps {
  currentStore: Store;
  onStoreChange?: (store: Store) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({ 
  currentStore,
  onStoreChange = () => {} 
}) => {
  const [open, setOpen] = useState(false);

  const handleStoreSelect = (store: Store) => {
    onStoreChange(store);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-dashed hover:border-muted-foreground"
        >
          <Store className="ml-2 h-4 w-4" />
          <span className="ml-auto mr-2 truncate">{currentStore.name}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="ابحث عن متجر..." className="h-9" />
          <CommandEmpty>لم يتم العثور على متاجر</CommandEmpty>
          <CommandGroup>
            {stores.map((store) => (
              <CommandItem
                key={store.id}
                value={store.name}
                onSelect={() => handleStoreSelect(store)}
              >
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    currentStore.id === store.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{store.name}</span>
                  <span className="text-xs text-muted-foreground">{store.domain}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="border-t p-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => setOpen(false)}
            >
              <span className="ml-2">+ إضافة متجر جديد</span>
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSelector;
