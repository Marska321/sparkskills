import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@shared/schema";

interface ProgressOverviewProps {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  user?: User;
}

export default function ProgressOverview({ 
  overallProgress, 
  completedLessons, 
  totalLessons, 
  user 
}: ProgressOverviewProps) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <section className="mb-12">
      <Card className="bg-white rounded-3xl shadow-xl border-l-8 border-green-500">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Progress */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 progress-ring">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#10B981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-gray-800">Overall Progress</h3>
              <p className="text-sm text-gray-600">
                {completedLessons} of {totalLessons} lessons
              </p>
            </div>

            {/* Badges Earned */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">🏅</span>
              </div>
              <h3 className="font-bold text-gray-800">Badges Earned</h3>
              <p className="text-2xl font-bold text-orange-400">
                {user?.totalBadges || 0}
              </p>
            </div>

            {/* Current Streak */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-800">Current Streak</h3>
              <p className="text-2xl font-bold text-purple-500">
                {user?.currentStreak || 0} days
              </p>
            </div>

            {/* Ideas Created */}
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="font-bold text-gray-800">Ideas Created</h3>
              <p className="text-2xl font-bold text-pink-500">
                {user?.ideasCreated || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
