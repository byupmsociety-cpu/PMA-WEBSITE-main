import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCategory, ICON_OPTIONS, COLOR_OPTIONS } from "./adminResourcesTypes";

interface AdminCategoryFormSheetProps {
  categorySheetOpen: boolean;
  closeCategorySheet: () => void;
  handleSaveCategory: (e: React.FormEvent) => void;
  editingCategory: ResourceCategory | null;
  categoryFormData: Omit<ResourceCategory, "id">;
  setCategoryFormData: (data: Omit<ResourceCategory, "id">) => void;
  isSaving: boolean;
  generateSlug: (title: string) => string;
}

export const AdminCategoryFormSheet: React.FC<AdminCategoryFormSheetProps> = ({
  categorySheetOpen,
  closeCategorySheet,
  handleSaveCategory,
  editingCategory,
  categoryFormData,
  setCategoryFormData,
  isSaving,
  generateSlug,
}) => {
  return (
    <Sheet open={categorySheetOpen} onOpenChange={(open) => !open && closeCategorySheet()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingCategory ? "Edit Category" : "Add Category"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSaveCategory} className="space-y-4 py-4">
          <div>
            <label htmlFor="cat-title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="cat-title"
              value={categoryFormData.title}
              onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="cat-slug" className="block text-sm font-medium mb-1">Slug</label>
            <Input
              id="cat-slug"
              value={categoryFormData.slug}
              onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
              placeholder={generateSlug(categoryFormData.title) || "auto-generated-from-title"}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to auto-generate from title
            </p>
          </div>
          <div>
            <label htmlFor="cat-description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="cat-description"
              value={categoryFormData.description}
              onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="cat-icon" className="block text-sm font-medium mb-1">Icon</label>
            <Select
              value={categoryFormData.icon}
              onValueChange={(value) => setCategoryFormData({ ...categoryFormData, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="cat-color" className="block text-sm font-medium mb-1">Color</label>
            <Select
              value={categoryFormData.color}
              onValueChange={(value) => setCategoryFormData({ ...categoryFormData, color: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                      {opt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="cat-order" className="block text-sm font-medium mb-1">Display Order</label>
            <Input
              id="cat-order"
              type="number"
              value={categoryFormData.display_order}
              onChange={(e) => setCategoryFormData({ ...categoryFormData, display_order: Number(e.target.value) || 0 })}
            />
            <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
          </div>
          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={closeCategorySheet}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingCategory ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
