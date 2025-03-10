
import React from "react";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface SectionDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  sectionName: string;
  onDelete: () => Promise<void>;
}

const SectionDeleteDialog: React.FC<SectionDeleteDialogProps> = ({
  isOpen,
  onOpenChange,
  sectionName,
  onDelete
}) => {
  return (
    <DeleteConfirmDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      title="تأكيد حذف القسم"
      description={
        <div className="text-center">
          <p>هل أنت متأكد من رغبتك في حذف القسم:</p>
          <p className="font-bold mt-1 text-black">{sectionName}؟</p>
          <p className="mt-2 text-sm">سيتم حذف جميع المعلومات المرتبطة بهذا القسم.</p>
        </div>
      }
      onDelete={onDelete}
      itemName={sectionName}
      itemType="قسم"
    />
  );
};

export default SectionDeleteDialog;
