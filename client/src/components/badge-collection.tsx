import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Badge, UserBadge } from "@shared/schema";

export default function BadgeCollection() {
  const { data: userBadges = [] } = useQuery<(UserBadge & { badge: Badge })[]>({
    queryKey: ["/api/badges"],
  });

  const { data: allBadges = [] } = useQuery<Badge[]>({
    queryKey: ["/api/badges/all"],
  });

  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Your Badge Collection 🏆
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          const userBadge = userBadges.find(ub => ub.badgeId === badge.id);

          return (
            <Card
              key={badge.id}
              className={`rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow ${
                isEarned ? "bg-white" : "bg-gray-100"
              }`}
            >
              <CardContent className="p-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isEarned
                      ? `bg-gradient-to-r ${badge.color}`
                      : "bg-gray-300"
                  }`}
                >
                  <span className="text-2xl">
                    {isEarned ? badge.emoji : "🔒"}
                  </span>
                </div>
                <h4 className={`font-bold text-sm ${
                  isEarned ? "text-gray-800" : "text-gray-600"
                }`}>
                  {badge.name}
                </h4>
                <p className={`text-xs ${
                  isEarned ? "text-gray-600" : "text-gray-500"
                }`}>
                  {badge.description}
                </p>
                {isEarned && userBadge && (
                  <p className="text-xs text-green-600 mt-1">
                    Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
