import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";
import type { Section } from "@shared/schema";

interface SectionNavigationProps {
  sections: Section[];
  currentSectionIndex: number;
  completedSections: number[];
  onSectionChange: (index: number) => void;
}

export default function SectionNavigation({
  sections,
  currentSectionIndex,
  completedSections,
  onSectionChange,
}: SectionNavigationProps) {
  const getSectionStatus = (section: Section, index: number) => {
    const isCompleted = completedSections.includes(section.id);
    const isCurrent = index === currentSectionIndex;
    const canAccess = index === 0 || completedSections.includes(sections[index - 1].id);

    return { isCompleted, isCurrent, canAccess };
  };

  return (
    <div className="flex space-x-4 overflow-x-auto">
      {sections.map((section, index) => {
        const { isCompleted, isCurrent, canAccess } = getSectionStatus(section, index);

        return (
          <Button
            key={section.id}
            onClick={() => onSectionChange(index)}
            disabled={!canAccess}
            variant={isCurrent ? "default" : "outline"}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap min-w-fit ${
              isCompleted
                ? "bg-green-500 text-white hover:bg-green-600"
                : isCurrent
                ? "bg-orange-400 text-white border-4 border-white hover:bg-orange-500"
                : canAccess
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
              isCompleted
                ? "bg-white/20"
                : isCurrent
                ? "bg-white text-orange-400 font-bold"
                : canAccess
                ? "bg-white"
                : "bg-gray-200"
            }`}>
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : 
               !canAccess ? <Lock className="h-4 w-4" /> : 
               section.id}
            </span>
            <span>{section.id}. {section.title}</span>
          </Button>
        );
      })}
    </div>
  );
}
