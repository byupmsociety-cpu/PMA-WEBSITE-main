import { ArrowLeft } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import ResourceCard from "@/components/resources/ResourceCard";
import { usePrep } from "@/hooks/usePrepState";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Resource } from "@/lib/resourceCatalog";

const CategoryDetail = ({ slug }: { slug: string }) => {
  const { isMember, goLibrary, goJoin, openResource } = usePrep();
  const category = CATEGORIES.find((c) => c.id === slug);

  const onOpen = async (resource: Resource, categoryId: string, e?: React.MouseEvent) => {
    if (resource.isPaid) {
      e?.preventDefault();
      openResource(resource.title);
      return;
    }
    if (isMember) await supabase.from("resource_clicks").insert({ resource_title: resource.title, category_id: categoryId });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      <button
        type="button"
        onClick={() => goLibrary()}
        className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to all categories
      </button>

      {category ? (
        <AnimatedSection animation="fade-in">
          <div className="mb-8">
            <div className={`mb-4 inline-flex items-center gap-3 rounded-lg bg-gradient-to-r ${category.color} p-4 text-white`}>
              <category.Icon className="h-6 w-6" />
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            <p className="text-lg text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {category.resources.map((resource, idx) => (
              <AnimatedSection key={`${category.id}-${resource.title}`} animation="slide-up" delay={idx * 50} className="h-full">
                <ResourceCard
                  resource={resource}
                  category={category}
                  isPmaMember={isMember}
                  onOpen={onOpen}
                  locked={!isMember}
                  onLocked={goJoin}
                />
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      ) : (
        <p className="text-muted-foreground">That category does not exist anymore. Pick one from the library.</p>
      )}
    </div>
  );
};

export default CategoryDetail;
