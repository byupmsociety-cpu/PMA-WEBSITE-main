import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import { ImageUploadWithCrop } from "@/components/ImageUploadWithCrop";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, ExternalLink, FolderOpen, FileText, Star } from "lucide-react";

interface ResourceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
}

interface Resource {
  id: string;
  category_id: string;
  subcategory: string | null;
  title: string;
  description: string;
  url: string;
  image_url: string;
  tips: string[] | null;
  is_paid: boolean;
  is_premium: boolean;
  is_featured: boolean;
  display_order: number;
}

const ICON_OPTIONS = [
  { value: "Cpu", label: "CPU (AI Tools)" },
  { value: "FileText", label: "File Text (Documents)" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Building2", label: "Building (Company)" },
  { value: "Coffee", label: "Coffee (Networking)" },
  { value: "Briefcase", label: "Briefcase (Jobs)" },
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "BookOpen", label: "Book Open" },
  { value: "Users", label: "Users" },
  { value: "Lightbulb", label: "Lightbulb" },
];

const COLOR_OPTIONS = [
  { value: "from-violet-500 to-purple-500", label: "Violet to Purple" },
  { value: "from-blue-500 to-cyan-500", label: "Blue to Cyan" },
  { value: "from-blue-600 to-blue-400", label: "Blue Gradient" },
  { value: "from-purple-500 to-pink-500", label: "Purple to Pink" },
  { value: "from-amber-500 to-orange-500", label: "Amber to Orange" },
  { value: "from-green-500 to-emerald-500", label: "Green to Emerald" },
  { value: "from-red-500 to-rose-500", label: "Red to Rose" },
  { value: "from-teal-500 to-cyan-500", label: "Teal to Cyan" },
];

const emptyCategory = {
  slug: "",
  title: "",
  description: "",
  icon: "FileText",
  color: "from-blue-500 to-cyan-500",
  display_order: 0,
};

const emptyResource = {
  category_id: "",
  subcategory: "",
  title: "",
  description: "",
  url: "",
  image_url: "",
  tips: [] as string[],
  is_paid: false,
  is_premium: false,
  is_featured: false,
  display_order: 0,
};

const AdminResourcesPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("resources");

  // Categories state
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ResourceCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<typeof emptyCategory>({ ...emptyCategory });
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  // Resources state
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceSheetOpen, setResourceSheetOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceFormData, setResourceFormData] = useState<typeof emptyResource>({ ...emptyResource });
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [tipsText, setTipsText] = useState("");

  // Loading states
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin && !isSuperAdmin) {
        navigate("/");
      } else {
        void loadCategories();
        void loadResources();
      }
    }
  }, [loading, user, isAdmin, isSuperAdmin, navigate]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase
      .from("resource_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading categories", error);
      toast({
        title: "Error loading categories",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      setCategories(data ?? []);
    }
    setLoadingCategories(false);
  };

  const loadResources = async () => {
    setLoadingResources(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading resources", error);
      toast({
        title: "Error loading resources",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      setResources(data ?? []);
    }
    setLoadingResources(false);
  };

  // Category handlers
  const openAddCategorySheet = () => {
    setEditingCategory(null);
    setCategoryFormData({ ...emptyCategory });
    setCategorySheetOpen(true);
  };

  const openEditCategorySheet = (category: ResourceCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      slug: category.slug,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      display_order: category.display_order,
    });
    setCategorySheetOpen(true);
  };

  const closeCategorySheet = () => {
    setCategorySheetOpen(false);
    setEditingCategory(null);
    setCategoryFormData({ ...emptyCategory });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = categoryFormData.slug || generateSlug(categoryFormData.title);

    if (editingCategory) {
      setSavingId(editingCategory.id);
      const { error } = await supabase
        .from("resource_categories")
        .update({
          slug,
          title: categoryFormData.title,
          description: categoryFormData.description,
          icon: categoryFormData.icon,
          color: categoryFormData.color,
          display_order: categoryFormData.display_order,
        })
        .eq("id", editingCategory.id);

      if (error) {
        toast({
          title: "Error saving category",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Category updated" });
        closeCategorySheet();
        await loadCategories();
      }
      setSavingId(null);
    } else {
      setSavingId("create");
      const { error } = await supabase.from("resource_categories").insert({
        slug,
        title: categoryFormData.title,
        description: categoryFormData.description,
        icon: categoryFormData.icon,
        color: categoryFormData.color,
        display_order: categoryFormData.display_order,
      });

      if (error) {
        toast({
          title: "Error creating category",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Category created" });
        closeCategorySheet();
        await loadCategories();
      }
      setSavingId(null);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("resource_categories").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting category",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Category deleted" });
      await loadCategories();
      await loadResources();
    }
    setDeletingId(null);
    setDeleteCategoryId(null);
  };

  // Resource handlers
  const openAddResourceSheet = () => {
    setEditingResource(null);
    setResourceFormData({ ...emptyResource });
    setTipsText("");
    setResourceSheetOpen(true);
  };

  const openEditResourceSheet = (resource: Resource) => {
    setEditingResource(resource);
    setResourceFormData({
      category_id: resource.category_id,
      subcategory: resource.subcategory ?? "",
      title: resource.title,
      description: resource.description,
      url: resource.url,
      image_url: resource.image_url,
      tips: resource.tips ?? [],
      is_paid: resource.is_paid,
      is_premium: resource.is_premium,
      is_featured: resource.is_featured,
      display_order: resource.display_order,
    });
    setTipsText((resource.tips ?? []).join("\n"));
    setResourceSheetOpen(true);
  };

  const closeResourceSheet = () => {
    setResourceSheetOpen(false);
    setEditingResource(null);
    setResourceFormData({ ...emptyResource });
    setTipsText("");
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();

    const tips = tipsText
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingResource) {
      setSavingId(editingResource.id);
      const { error } = await supabase
        .from("resources")
        .update({
          category_id: resourceFormData.category_id,
          subcategory: resourceFormData.subcategory || null,
          title: resourceFormData.title,
          description: resourceFormData.description,
          url: resourceFormData.url,
          image_url: resourceFormData.image_url,
          tips,
          is_paid: resourceFormData.is_paid,
          is_premium: resourceFormData.is_premium,
          is_featured: resourceFormData.is_featured,
          display_order: resourceFormData.display_order,
        })
        .eq("id", editingResource.id);

      if (error) {
        toast({
          title: "Error saving resource",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Resource updated" });
        closeResourceSheet();
        await loadResources();
      }
      setSavingId(null);
    } else {
      setSavingId("create");
      const { error } = await supabase.from("resources").insert({
        category_id: resourceFormData.category_id,
        subcategory: resourceFormData.subcategory || null,
        title: resourceFormData.title,
        description: resourceFormData.description,
        url: resourceFormData.url,
        image_url: resourceFormData.image_url,
        tips,
        is_paid: resourceFormData.is_paid,
        is_premium: resourceFormData.is_premium,
        is_featured: resourceFormData.is_featured,
        display_order: resourceFormData.display_order,
      });

      if (error) {
        toast({
          title: "Error creating resource",
          description: getAdminErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({ title: "Resource created" });
        closeResourceSheet();
        await loadResources();
      }
      setSavingId(null);
    }
  };

  const handleDeleteResource = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting resource",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Resource deleted" });
      await loadResources();
    }
    setDeletingId(null);
    setDeleteResourceId(null);
  };

  const filteredResources = filterCategoryId === "all"
    ? resources
    : resources.filter((r) => r.category_id === filterCategoryId);

  const getCategoryTitle = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.title ?? "Unknown";
  };

  const selectedCategory = categories.find((c) => c.id === resourceFormData.category_id);
  const showSubcategory = selectedCategory?.slug === "ai-tools";

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setSavingId(id);
    const { error } = await supabase
      .from("resources")
      .update({ is_featured: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating resource",
        description: getAdminErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({ title: "Featured status updated" });
      await loadResources();
    }
    setSavingId(null);
  };

  const isSaving = savingId !== null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Resources</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Manage the tools and resources that appear on the Resources page.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="resources" className="gap-2">
              <FileText className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Category Sheet */}
      <Sheet open={categorySheetOpen} onOpenChange={(open) => !open && closeCategorySheet()}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4 py-4">
            <div>
              <label htmlFor="cat-title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="cat-title"
                value={categoryFormData.title}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="cat-slug" className="block text-sm font-medium mb-1">
                Slug
              </label>
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
              <label htmlFor="cat-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="cat-description"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="cat-icon" className="block text-sm font-medium mb-1">
                Icon
              </label>
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
              <label htmlFor="cat-color" className="block text-sm font-medium mb-1">
                Color
              </label>
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
              <label htmlFor="cat-order" className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <Input
                id="cat-order"
                type="number"
                value={categoryFormData.display_order}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, display_order: Number(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
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

      {/* Resource Sheet */}
      <Sheet open={resourceSheetOpen} onOpenChange={(open) => !open && closeResourceSheet()}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingResource ? "Edit Resource" : "Add Resource"}
            </SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSaveResource} className="space-y-4 py-4">
            <div>
              <label htmlFor="res-category" className="block text-sm font-medium mb-1">
                Category
              </label>
              <Select
                value={resourceFormData.category_id}
                onValueChange={(value) => setResourceFormData({ ...resourceFormData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showSubcategory && (
              <div>
                <label htmlFor="res-subcategory" className="block text-sm font-medium mb-1">
                  Subcategory
                </label>
                <Select
                  value={resourceFormData.subcategory}
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
              <label htmlFor="res-title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="res-title"
                value={resourceFormData.title}
                onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="res-description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="res-description"
                value={resourceFormData.description}
                onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="res-url" className="block text-sm font-medium mb-1">
                URL
              </label>
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
              <label htmlFor="res-tips" className="block text-sm font-medium mb-1">
                Tips (one per line)
              </label>
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
                  onCheckedChange={(checked) =>
                    setResourceFormData({ ...resourceFormData, is_featured: Boolean(checked) })
                  }
                />
                <label htmlFor="res-is-featured" className="text-sm">
                  Featured resource (shows in top carousel)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="res-is-premium"
                  checked={resourceFormData.is_premium}
                  onCheckedChange={(checked) =>
                    setResourceFormData({ ...resourceFormData, is_premium: Boolean(checked) })
                  }
                />
                <label htmlFor="res-is-premium" className="text-sm">
                  Premium resource (PMA members only)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="res-is-paid"
                  checked={resourceFormData.is_paid}
                  onCheckedChange={(checked) =>
                    setResourceFormData({ ...resourceFormData, is_paid: Boolean(checked) })
                  }
                />
                <label htmlFor="res-is-paid" className="text-sm">
                  Partner/Paid resource (shows partner badge)
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="res-order" className="block text-sm font-medium mb-1">
                Display Order
              </label>
              <Input
                id="res-order"
                type="number"
                value={resourceFormData.display_order}
                onChange={(e) =>
                  setResourceFormData({ ...resourceFormData, display_order: Number(e.target.value) || 0 })
                }
              />
            </div>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeResourceSheet}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !resourceFormData.category_id}>
                {isSaving ? "Saving..." : editingResource ? "Save" : "Create"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Category Confirmation */}
      <AlertDialog
        open={deleteCategoryId !== null}
        onOpenChange={(open) => !open && setDeleteCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category and all its resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => deleteCategoryId && handleDeleteCategory(deleteCategoryId)}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Resource Confirmation */}
      <AlertDialog
        open={deleteResourceId !== null}
        onOpenChange={(open) => !open && setDeleteResourceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this resource from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => deleteResourceId && handleDeleteResource(deleteResourceId)}
            >
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminResourcesPage;
