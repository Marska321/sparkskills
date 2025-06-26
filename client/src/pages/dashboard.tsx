import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LessonCard from "@/components/lesson-card";
import ProgressOverview from "@/components/progress-overview";
import BadgeCollection from "@/components/badge-collection";
import type { User, Lesson, UserProgress } from "@shared/schema";

export default function Dashboard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: lessons = [] } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const getProgressForLesson = (lessonId: number) => {
    return progress.find(p => p.lessonId === lessonId);
  };

  const completedLessons = progress.filter(p => p.isCompleted).length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">SparkSkill</h1>
                <p className="text-sm text-gray-600">Young Entrepreneur Academy</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
                  <span className="text-2xl">🏆</span>
                  <span className="font-semibold text-blue-600">{user.totalBadges}</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xl">{user.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">Level {user.level} Entrepreneur</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <ProgressOverview 
          overallProgress={overallProgress}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          user={user}
        />

        {/* Lesson Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-800">Your SparkSkill Journey</h2>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-sm font-semibold text-gray-700">
                {completedLessons}/{totalLessons} Complete
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {lessons.map((lesson) => {
              const lessonProgress = getProgressForLesson(lesson.id);
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  progress={lessonProgress}
                />
              );
            })}
          </div>
        </section>

        {/* Badge Collection */}
        <BadgeCollection />

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded-2xl h-auto hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">📝</div>
                  <h3 className="font-bold text-lg">My Ideas Journal</h3>
                  <p className="text-sm opacity-90">Review and edit your business ideas</p>
                </div>
              </Button>
              
              <Button className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 rounded-2xl h-auto hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">🎨</div>
                  <h3 className="font-bold text-lg">Creative Tools</h3>
                  <p className="text-sm opacity-90">Access drawing and design tools</p>
                </div>
              </Button>
              
              <Button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-6 rounded-2xl h-auto hover:shadow-lg transition-all transform hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="text-4xl">👥</div>
                  <h3 className="font-bold text-lg">Share & Connect</h3>
                  <p className="text-sm opacity-90">Share ideas with friends and family</p>
                </div>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Help */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-xl text-white text-2xl hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse">
          ❓
        </Button>
      </div>
    </div>
  );
}
