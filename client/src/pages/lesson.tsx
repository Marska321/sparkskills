import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, CheckCircle } from "lucide-react";
import SectionNavigation from "@/components/section-navigation";
import InteractiveActivity from "@/components/interactive-activity";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lesson, UserProgress, Section } from "@shared/schema";

export default function LessonPage() {
  const { id } = useParams();
  const lessonId = parseInt(id!);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`],
  });

  const { data: progress } = useQuery<UserProgress>({
    queryKey: [`/api/progress/${lessonId}`],
  });

  const completeSectionMutation = useMutation({
    mutationFn: async (sectionId: number) => {
      const response = await apiRequest("POST", `/api/progress/${lessonId}/section/${sectionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/progress/${lessonId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      
      toast({
        title: "Section Complete! 🎉",
        description: "Great job! You've completed this section.",
      });
    },
  });

  if (lessonLoading || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const currentSection = lesson.sections[currentSectionIndex];
  const isCurrentSectionCompleted = progress?.completedSections?.includes(currentSection.id) || false;
  const canAccessSection = currentSectionIndex === 0 || 
    (progress?.completedSections?.includes(lesson.sections[currentSectionIndex - 1].id) || false);

  const handleCompleteSection = () => {
    if (!isCurrentSectionCompleted) {
      completeSectionMutation.mutate(currentSection.id);
    }
    
    // Move to next section if available
    if (currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleSectionChange = (index: number) => {
    const targetSection = lesson.sections[index];
    const canAccess = index === 0 || 
      (progress?.completedSections?.includes(lesson.sections[index - 1].id) || false);
    
    if (canAccess) {
      setCurrentSectionIndex(index);
    } else {
      toast({
        title: "Section Locked",
        description: "Complete the previous section first!",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = () => {
    if (progress?.isCompleted) return "from-green-500 to-teal-500";
    if (progress?.completedSections?.length) return "from-orange-400 to-pink-500";
    return "from-gray-400 to-gray-500";
  };

  const getStatusText = () => {
    if (progress?.isCompleted) return "COMPLETED";
    if (progress?.completedSections?.length) return "IN PROGRESS";
    return "LOCKED";
  };

  return (
    <div className="min-h-screen">
      {/* Lesson Header */}
      <div className={`bg-gradient-to-r ${getStatusColor()} p-8 text-white`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="secondary" size="icon" className="w-12 h-12 bg-white/20 hover:bg-white/30 border-0">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold">Lesson {lessonId}: {lesson.title}</h1>
                <p className="text-xl opacity-90">{lesson.subtitle}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {getStatusText()}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl mb-2">{lesson.emoji}</div>
              <p className="text-lg font-semibold">{lesson.sections.length} sections</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-gray-50 border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <SectionNavigation
            sections={lesson.sections}
            currentSectionIndex={currentSectionIndex}
            completedSections={progress?.completedSections || []}
            onSectionChange={handleSectionChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {canAccessSection ? (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {currentSection.id}. {currentSection.title}
                    </h2>
                    <p className="text-gray-600">
                      Time: {currentSection.timeMinutes} minutes • Tools: {currentSection.tools.join(", ")}
                    </p>
                  </div>
                  {isCurrentSectionCompleted && (
                    <CheckCircle className="h-8 w-8 text-green-500 ml-auto" />
                  )}
                </div>

                <div className="bg-white rounded-2xl p-6 mb-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {currentSection.content}
                    </p>
                  </div>
                </div>

                {/* Interactive Activities */}
                {currentSection.activities && (
                  <InteractiveActivity
                    activities={currentSection.activities}
                    lessonId={lessonId}
                    sectionId={currentSection.id}
                  />
                )}

                {/* Tips */}
                {currentSection.tips && currentSection.tips.length > 0 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips & Tricks</h4>
                    {currentSection.tips.map((tip, index) => (
                      <p key={index} className="text-yellow-700 mb-1">{tip}</p>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                    disabled={currentSectionIndex === 0}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous Section</span>
                  </Button>

                  <Button
                    onClick={handleCompleteSection}
                    disabled={completeSectionMutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white flex items-center space-x-2"
                  >
                    <span>
                      {isCurrentSectionCompleted ? "Next Section" : "Complete Section"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-100 rounded-3xl shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-gray-600 mb-2">Section Locked</h2>
                <p className="text-gray-500">Complete the previous section to unlock this one!</p>
                <Button
                  onClick={() => setCurrentSectionIndex(currentSectionIndex - 1)}
                  className="mt-4"
                  variant="outline"
                >
                  Go to Previous Section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
