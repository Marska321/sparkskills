import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Lesson, UserProgress } from "@shared/schema";

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserProgress;
}

export default function LessonCard({ lesson, progress }: LessonCardProps) {
  const isCompleted = progress?.isCompleted || false;
  const isInProgress = progress && progress.completedSections.length > 0 && !progress.isCompleted;
  const isLocked = !progress && lesson.id > 1;
  
  const completedSections = progress?.completedSections.length || 0;
  const totalSections = lesson.sections.length;

  const getStatusColor = () => {
    if (isCompleted) return "border-green-500";
    if (isInProgress) return "border-orange-400";
    if (isLocked) return "border-gray-300";
    return "border-blue-500";
  };

  const getStatusBadge = () => {
    if (isCompleted) return <Badge className="bg-green-500 text-white">COMPLETED</Badge>;
    if (isInProgress) return <Badge className="bg-orange-400 text-white animate-pulse">IN PROGRESS</Badge>;
    if (isLocked) return <Badge variant="secondary">LOCKED</Badge>;
    return <Badge className="bg-blue-500 text-white">AVAILABLE</Badge>;
  };

  const getGradientClass = () => {
    if (isCompleted) return "from-green-500 to-teal-500";
    if (isInProgress) return "from-orange-400 to-pink-500";
    if (isLocked) return "from-gray-400 to-gray-500";
    return "from-blue-500 to-purple-500";
  };

  const getSectionIndicators = () => {
    return Array.from({ length: totalSections }, (_, index) => {
      const sectionNumber = index + 1;
      const isCompleted = progress?.completedSections.includes(sectionNumber) || false;
      
      return (
        <span
          key={sectionNumber}
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            isCompleted
              ? "bg-green-500 text-white"
              : isLocked
              ? "bg-gray-200 text-gray-400"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isCompleted ? "✓" : sectionNumber}
        </span>
      );
    });
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isLocked) {
      return (
        <div className={`lesson-card bg-gray-100 rounded-3xl shadow-lg overflow-hidden border-l-8 ${getStatusColor()} opacity-60 cursor-not-allowed`}>
          {children}
        </div>
      );
    }
    
    return (
      <Link href={`/lesson/${lesson.id}`}>
        <div className={`lesson-card bg-white rounded-3xl shadow-xl overflow-hidden border-l-8 ${getStatusColor()} cursor-pointer hover:shadow-2xl transition-all`}>
          {children}
        </div>
      </Link>
    );
  };

  return (
    <CardWrapper>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          {getStatusBadge()}
          <div className="flex space-x-1">
            {getSectionIndicators()}
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass()} rounded-full flex items-center justify-center`}>
            <span className="text-2xl">{lesson.emoji}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Lesson {lesson.id}</h3>
            <p className={`font-semibold ${
              isCompleted ? "text-green-600" : 
              isInProgress ? "text-orange-500" : 
              isLocked ? "text-gray-500" : "text-blue-600"
            }`}>
              {lesson.title}
            </p>
          </div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{totalSections} sections</span> • {lesson.duration}
          </div>
          {progress && (
            <div className="text-sm text-gray-600">
              {completedSections}/{totalSections} complete
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="flex space-x-1 mt-4 justify-center">
            <span className="text-xl">🏆</span>
            <span className="text-xl">⭐</span>
          </div>
        )}
      </CardContent>
    </CardWrapper>
  );
}
