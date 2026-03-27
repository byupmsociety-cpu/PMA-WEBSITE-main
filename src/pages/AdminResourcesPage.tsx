import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAdminErrorMessage } from "@/lib/admin-utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderOpen, FileText } from "lucide-react";

import { ResourceCategory, Resource, emptyCategory, emptyResource } from "@/components/admin/resources/adminResourcesTypes";
import { AdminCategoriesTab } from "@/components/admin/resources/AdminCategoriesTab";
import { AdminResourcesTab } from "@/components/admin/resources/AdminResourcesTab";
import { AdminCategoryFormSheet } from "@/components/admin/resources/AdminCategoryFormSheet";
import { AdminResourceFormSheet } from "@/components/admin/resources/AdminResourceFormSheet";

const AdminResourcesPage = () => {
  const { user, isAdmin, isSuperAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("resources");

  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ResourceCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Omit<ResourceCategory, "id">>({ ...emptyCategory });
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [resourceSheetOpen, setResourceSheetOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceFormData, setResourceFormData] = useState<Omit<Resource, "id">>({ ...emptyResource });
  const [deleteResourceId, setDeleteResourceId] = useState<string | null>(null);
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [tipsText, setTipsText] = useState("");

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
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
        toast({ title: "Error saving category", description: getAdminErrorMessage(error), variant: "destructive" });
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
        toast({ title: "Error creating category", description: getAdminErrorMessage(error), variant: "destructive" });
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
      toast({ title: "Error deleting category", description: getAdminErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Category deleted" });
      await loadCategories();
      await loadResources();
    }
    setDeletingId(null);
    setDeleteCategoryId(null);
  };

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
    const tips = tipsText.split("\n").map((t) => t.trim()).filter((t) => t.length > 0);
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
        toast({ title: "Error saving resource", description: getAdminErrorMessage(error), variant: "destructive" });
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
        toast({ title: "Error creating resource", description: getAdminErrorMessage(error), variant: "destructive" });
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
      toast({ title: "Error deleting resource", description: getAdminErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Resource deleted" });
      await loadResources();
    }
    setDeletingId(null);
    setDeleteResourceId(null);
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setSavingId(id);
    const { error } = await supabase.from("resources").update({ is_featured: !currentStatus }).eq("id", id);
    if (error) {
      toast({ title: "Error updating resource", description: getAdminErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Featured status updated" });
      await loadResources();
    }
    setSavingId(null);
  };

  const getCategoryTitle = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.title ?? "Unknown";
  };

  const filteredResources = filterCategoryId === "all" ? resources : resources.filter((r) => r.category_id === filterCategoryId);
  const selectedCategory = categories.find((c) => c.id === resourceFormData.category_id);
  const showSubcategory = selectedCategory?.slug === "ai-tools";
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
            <AdminResourcesTab
              filteredResources={filteredResources}
              categories={categories}
              loadingResources={loadingResources}
              filterCategoryId={filterCategoryId}
              setFilterCategoryId={setFilterCategoryId}
              openAddResourceSheet={openAddResourceSheet}
              openEditResourceSheet={openEditResourceSheet}
              setDeleteResourceId={setDeleteResourceId}
              handleToggleFeatured={handleToggleFeatured}
              getCategoryTitle={getCategoryTitle}
              savingId={savingId}
              deletingId={deletingId}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <AdminCategoriesTab
              categories={categories}
              resources={resources}
              loadingCategories={loadingCategories}
              openAddCategorySheet={openAddCategorySheet}
              openEditCategorySheet={openEditCategorySheet}
              setDeleteCategoryId={setDeleteCategoryId}
              savingId={savingId}
              deletingId={deletingId}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AdminCategoryFormSheet
        categorySheetOpen={categorySheetOpen}
        closeCategorySheet={closeCategorySheet}
        handleSaveCategory={handleSaveCategory}
        editingCategory={editingCategory}
        categoryFormData={categoryFormData}
        setCategoryFormData={setCategoryFormData}
        isSaving={isSaving}
        generateSlug={generateSlug}
      />

      <AdminResourceFormSheet
        resourceSheetOpen={resourceSheetOpen}
        closeResourceSheet={closeResourceSheet}
        handleSaveResource={handleSaveResource}
        editingResource={editingResource}
        resourceFormData={resourceFormData}
        setResourceFormData={setResourceFormData}
        tipsText={tipsText}
        setTipsText={setTipsText}
        categories={categories}
        showSubcategory={showSubcategory}
        isSaving={isSaving}
      />

      <AlertDialog open={deleteCategoryId !== null} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category and all its resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={!!deletingId} onClick={() => deleteCategoryId && handleDeleteCategory(deleteCategoryId)}>
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteResourceId !== null} onOpenChange={(open) => !open && setDeleteResourceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resource?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this resource from the website. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={!!deletingId} onClick={() => deleteResourceId && handleDeleteResource(deleteResourceId)}>
              {deletingId ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminResourcesPage;
