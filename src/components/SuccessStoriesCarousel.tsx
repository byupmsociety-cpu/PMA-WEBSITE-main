import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStory {
  id: string;
  student_name: string;
  school_year: string | null;
  story_text: string;
  outcome: string | null;
}

const SuccessStoriesCarousel = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuccessStories();
  }, []);

  const loadSuccessStories = async () => {
    const { data, error } = await supabase
      .from("success_stories")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading success stories:", error);
      setLoading(false);
      return;
    }

    setStories(data || []);
    setLoading(false);
  };

  const nextStory = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Student Success Stories</h2>
        <p className="text-muted-foreground">See how PMA members landed their dream PM roles</p>
      </div>

      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8 md:p-12">
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-12 w-12 text-primary/20" />
            <div className="space-y-6">
              <p className="text-lg md:text-xl italic leading-relaxed pl-8">
                "{currentStory.story_text}"
              </p>
              
              <div className="space-y-2 pl-8">
                <p className="font-semibold text-lg">{currentStory.student_name}</p>
                {currentStory.school_year && (
                  <p className="text-muted-foreground">{currentStory.school_year}</p>
                )}
                {currentStory.outcome && (
                  <p className="text-primary font-semibold">→ {currentStory.outcome}</p>
                )}
              </div>
            </div>
          </div>

          {stories.length > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={prevStory}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex gap-2">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? "w-8 bg-primary" 
                        : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextStory}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessStoriesCarousel;
