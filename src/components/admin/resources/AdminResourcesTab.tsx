import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import { ResourceCategory, Resource } from "./adminResourcesTypes";

interface AdminResourcesTabProps {
  filteredResources: Resource[];
  categories: ResourceCategory[];
  loadingResources: boolean;
  filterCategoryId: string;
  setFilterCategoryId: (v: string) => void;
  openAddResourceSheet: () => void;
  openEditResourceSheet: (r: Resource) => void;
  setDeleteResourceId: (id: string) => void;
  handleToggleFeatured: (id: string, currentStatus: boolean) => void;
  getCategoryTitle: (id: string) => string;
  savingId: string | null;
  deletingId: string | null;
}

export const AdminResourcesTab: React.FC<AdminResourcesTabProps> = ({
  filteredResources,
  categories,
  loadingResources,
  filterCategoryId,
  setFilterCategoryId,
  openAddResourceSheet,
  openEditResourceSheet,
  setDeleteResourceId,
  handleToggleFeatured,
  getCategoryTitle,
  savingId,
  deletingId,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>All Resources</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filterCategoryId} onValueChange={setFilterCategoryId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openAddResourceSheet} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loadingResources ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-md animate-pulse" />
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No resources found.</p>
            <Button onClick={openAddResourceSheet} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add your first resource
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-24">Type</TableHead>
                <TableHead className="w-24 text-center">Featured</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                      {r.image_url ? (
                        <img
                          src={r.image_url}
                          alt={r.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `<div class="h-full w-full flex items-center justify-center text-muted-foreground text-xs font-bold bg-muted-foreground/10">${r.title.charAt(0)}</div>`;
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                          —
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{r.title}</span>
                      {r.subcategory && (
                        <span className="text-xs text-muted-foreground">{r.subcategory}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCategoryTitle(r.category_id)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.display_order}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {r.is_premium && <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Premium</Badge>}
                      {r.is_paid && <Badge variant="secondary">Partner</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${r.is_featured ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground"}`}
                      onClick={() => handleToggleFeatured(r.id, r.is_featured)}
                      title={r.is_featured ? "Unfeature resource" : "Feature resource"}
                      disabled={savingId === r.id}
                    >
                      <Star className={`h-4 w-4 ${r.is_featured ? "fill-current" : ""}`} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.url && r.url !== "#" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={r.url} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditResourceSheet(r)}
                        disabled={savingId === r.id || deletingId === r.id}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteResourceId(r.id)}
                        disabled={savingId === r.id || deletingId === r.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
