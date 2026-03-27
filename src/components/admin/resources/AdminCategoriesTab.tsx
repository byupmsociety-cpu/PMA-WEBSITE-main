import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ResourceCategory, Resource } from "./adminResourcesTypes";

interface AdminCategoriesTabProps {
  categories: ResourceCategory[];
  resources: Resource[];
  loadingCategories: boolean;
  openAddCategorySheet: () => void;
  openEditCategorySheet: (cat: ResourceCategory) => void;
  setDeleteCategoryId: (id: string) => void;
  savingId: string | null;
  deletingId: string | null;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  resources,
  loadingCategories,
  openAddCategorySheet,
  openEditCategorySheet,
  setDeleteCategoryId,
  savingId,
  deletingId,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>All Categories</CardTitle>
        <Button onClick={openAddCategorySheet} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {loadingCategories ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-md animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No categories yet.</p>
            <Button onClick={openAddCategorySheet} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add your first category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-24">Resources</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => {
                const resourceCount = resources.filter((r) => r.category_id === cat.id).length;
                return (
                  <TableRow key={cat.id}>
                    <TableCell>
                      <div
                        className={`h-10 w-10 rounded-md bg-gradient-to-r ${cat.color} flex items-center justify-center text-white text-xs`}
                      >
                        {cat.icon.slice(0, 2)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{cat.title}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {cat.slug}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {cat.display_order}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {resourceCount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditCategorySheet(cat)}
                          disabled={savingId === cat.id || deletingId === cat.id}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteCategoryId(cat.id)}
                          disabled={savingId === cat.id || deletingId === cat.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
