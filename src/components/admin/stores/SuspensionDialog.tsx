
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";

interface SuspensionDialogProps {
  open: boolean;
  suspensionReason: string;
  onSuspensionReasonChange: (value: string) => void;
  onClose: () => void;
  onSuspend: () => void;
}

const SuspensionDialog: React.FC<SuspensionDialogProps> = ({
  open,
  suspensionReason,
  onSuspensionReasonChange,
  onClose,
  onSuspend
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>تعليق المتجر</DialogTitle>
          <DialogDescription>
            الرجاء إدخال سبب تعليق المتجر. سيتم عرض هذا السبب لصاحب المتجر.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="سبب التعليق..."
            value={suspensionReason}
            onChange={(e) => onSuspensionReasonChange(e.target.value)}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            variant="destructive"
            onClick={onSuspend}
            disabled={!suspensionReason}
          >
            تعليق المتجر
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuspensionDialog;
