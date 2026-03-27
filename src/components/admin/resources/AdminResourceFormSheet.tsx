import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploadWithCrop } from "@/components/ImageUploadWithCrop";
import { Resource, ResourceCategory } from "./adminResourcesTypes";

interface AdminResourceFormSheetProps {
  resourceSheetOpen: boolean;
  closeResourceSheet: () => void;
  handleSaveResource: (e: React.FormEvent) => void;
  editingResource: Resource | null;
  resourceFormData: Omit<Resource, "id">;
  setResourceFormData: (data: Omit<Resource, "id">) => void;
  tipsText: string;
  setTipsText: (text: string) => void;
  categories: ResourceCategory[];
  showSubcategory: boolean;
  isSaving: boolean;
}

export const AdminResourceFormSheet: React.FC<AdminResourceFormSheetProps> = ({
  resourceSheetOpen,
  closeResourceSheet,
  handleSaveResource,
  editingResource,
  resourceFormData,
  setResourceFormData,
  tipsText,
  setTipsText,
  categories,
  showSubcategory,
  isSaving,
}) => {
  return (
    <Sheet open={resourceSheetOpen} onOpenChange={(open) => !open && closeResourceSheet()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editingResource ? "Edit Resource" : "Add Resource"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSaveResource} className="space-y-4 py-4">
          <div>
            <label htmlFor="res-category" className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={resourceFormData.category_id}
              onValueChange={(value) => setResourceFormData({ ...resourceFormData, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {showSubcategory && (
            <div>
              <label htmlFor="res-subcategory" className="block text-sm font-medium mb-1">Subcategory</label>
              <Select
                value={resourceFormData.subcategory || ""}
                onValueChange={(value) => setResourceFormData({ ...resourceFormData, subcategory: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low - No Code">Low - No Code</SelectItem>
                  <SelectItem value="AI and LLM">AI and LLM</SelectItem>
                  <SelectItem value="Code With AI">Code With AI</SelectItem>
                  <SelectItem value="Automation">Automation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <label htmlFor="res-title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="res-title"
              value={resourceFormData.title}
              onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="res-description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="res-description"
              value={resourceFormData.description}
              onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="res-url" className="block text-sm font-medium mb-1">URL</label>
            <Input
              id="res-url"
              value={resourceFormData.url}
              onChange={(e) => setResourceFormData({ ...resourceFormData, url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <ImageUploadWithCrop
              value={resourceFormData.image_url || null}
              onChange={(url) => setResourceFormData({ ...resourceFormData, image_url: url ?? "" })}
              bucket="resource-images"
              filePrefix="resource"
            />
          </div>
          <div>
            <label htmlFor="res-tips" className="block text-sm font-medium mb-1">Tips (one per line)</label>
            <Textarea
              id="res-tips"
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              rows={4}
              placeholder="Enter tips, one per line..."
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="res-is-featured"
                checked={resourceFormData.is_featured}
                onCheckedChange={(checked) => setResourceFormData({ ...resourceFormData, is_featured: Boolean(checked) })}
              />
              <label htmlFor="res-is-featured" className="text-sm">Featured resource (shows in top carousel)</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="res-is-premium"
                checked={resourceFormData.is_premium}
                onCheckedChange={(checked) => setResourceFormData({ ...resourceFormData, is_premium: Boolean(checked) })}
              />
              <label htmlFor="res-is-premium" className="text-sm">Premium resource (PMA members only)</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="res-is-paid"
                checked={resourceFormData.is_paid}
                onCheckedChange={(checked) => setResourceFormData({ ...resourceFormData, is_paid: Boolean(checked) })}
              />
              <label htmlFor="res-is-paid" className="text-sm">Partner/Paid resource (shows partner badge)</label>
            </div>
          </div>
          <div>
            <label htmlFor="res-order" className="block text-sm font-medium mb-1">Display Order</label>
            <Input
              id="res-order"
              type="number"
              value={resourceFormData.display_order}
              onChange={(e) => setResourceFormData({ ...resourceFormData, display_order: Number(e.target.value) || 0 })}
            />
          </div>
          <SheetFooter className="pt-4">
            <Button type="button" variant="outline" onClick={closeResourceSheet}>Cancel</Button>
            <Button type="submit" disabled={isSaving || !resourceFormData.category_id}>
              {isSaving ? "Saving..." : editingResource ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
