import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Activity } from "@shared/schema";

interface InteractiveActivityProps {
  activities: Activity[];
  lessonId: number;
  sectionId: number;
}

export default function InteractiveActivity({ 
  activities, 
  lessonId, 
  sectionId 
}: InteractiveActivityProps) {
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [cardData, setCardData] = useState({
    title: "SparkCraft Kits",
    pitch: "Fun, easy crafts for kids at home for just R20!",
    color: "bg-purple-500",
    emoji: "🎨"
  });
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const saveActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/activities", {
        userId: 1,
        lessonId,
        sectionId,
        type: "response",
        data,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity Saved! 💾",
        description: "Your responses have been saved.",
      });
    },
  });

  const handleResponseChange = (index: number, value: string) => {
    setResponses(prev => ({ ...prev, [index]: value }));
  };

  const handleSaveResponses = () => {
    saveActivityMutation.mutate({
      responses,
      cardData,
    });
  };

  const renderActivity = (activity: Activity, index: number) => {
    const value = responses[index] || "";

    switch (activity.type) {
      case "input":
        return (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              {activity.prompt}
            </Label>
            <Input
              placeholder={activity.placeholder}
              value={value}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              className="border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-colors"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              {activity.prompt}
            </Label>
            <Textarea
              placeholder={activity.placeholder}
              value={value}
              onChange={(e) => handleResponseChange(index, e.target.value)}
              className="border-2 border-gray-200 rounded-xl h-24 focus:border-purple-500 transition-colors"
            />
          </div>
        );

      case "creation":
        return (
          <div key={index} className="space-y-4">
            <h4 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <span>🎨</span>
              <span>Digital Pitch Card Creator</span>
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Creator Tool */}
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Idea Name
                  </Label>
                  <Input
                    placeholder="SparkCraft Kits"
                    value={cardData.title}
                    onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Pitch
                  </Label>
                  <Textarea
                    placeholder="SparkCraft Kits! Fun, easy crafts for kids at home for just R20!"
                    value={cardData.pitch}
                    onChange={(e) => setCardData(prev => ({ ...prev, pitch: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl h-24 focus:border-purple-500 transition-colors"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Choose Card Color
                  </Label>
                  <div className="flex space-x-2">
                    {["bg-blue-500", "bg-green-500", "bg-orange-400", "bg-purple-500", "bg-pink-500"].map(color => (
                      <button
                        key={color}
                        onClick={() => setCardData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 ${color} rounded-full border-2 ${
                          cardData.color === color ? "border-gray-800" : "border-white"
                        } shadow-lg`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Add Emoji
                  </Label>
                  <div className="grid grid-cols-6 gap-2">
                    {["🎨", "⭐", "🚀", "💡", "🏆", "✨"].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => setCardData(prev => ({ ...prev, emoji }))}
                        className={`w-10 h-10 ${
                          cardData.emoji === emoji ? "bg-purple-200" : "bg-gray-100"
                        } rounded-lg text-2xl hover:bg-gray-200 transition-colors`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className={`bg-gradient-to-br ${cardData.color.replace('bg-', 'from-')} to-pink-500 p-1 rounded-2xl`}>
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {cardData.title || "Your Idea Name"}
                    </h3>
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-4xl">
                      {cardData.emoji}
                    </div>
                    <p className="text-lg text-gray-700 font-semibold">
                      {cardData.pitch || "Your amazing pitch goes here!"}
                    </p>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">By Alex SparkStar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white rounded-2xl border-2 border-dashed border-purple-500 mb-6">
      <CardContent className="p-6">
        <div className="space-y-6">
          {activities.map((activity, index) => renderActivity(activity, index))}
          
          <Button
            onClick={handleSaveResponses}
            disabled={saveActivityMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
          >
            {saveActivityMutation.isPending ? "Saving..." : "Save My Work! 💾"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
