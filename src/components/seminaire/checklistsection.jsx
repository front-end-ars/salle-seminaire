import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function ChecklistSection({ 
  title, 
  icon: Icon, 
  tasks, 
  taskStates, 
  onTaskToggle,
  isLocked,
  sectionKey
}) {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const completedCount = tasks.filter(task => taskStates[`${sectionKey}_${task.id}`]).length;
  const totalCount = tasks.length;
  const isComplete = completedCount === totalCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <div className={`border rounded-xl overflow-hidden transition-all ${
        isComplete ? 'border-[#935890] bg-[#935890]/5' : 'border-[#e8e4dc] bg-white'
      }`}>
        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#faf9f7]/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isComplete ? 'bg-[#935890]' : 'bg-[#935890]/10'
            }`}>
              {isComplete ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Icon className="w-5 h-5 text-[#935890]" />
              )}
            </div>
            <div className="text-left">
              <span className="font-medium text-[#1a1a1a]">{title}</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-1.5 bg-[#e8e4dc] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#935890] rounded-full transition-all duration-300"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#888]">{completedCount}/{totalCount}</span>
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-[#888] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-5 pb-4 pt-2 space-y-2">
            {tasks.map((task) => {
              const taskKey = `${sectionKey}_${task.id}`;
              const isChecked = taskStates[taskKey] || false;
              
              return (
                <label
                  key={task.id}
                  className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                    isLocked ? 'cursor-not-allowed opacity-70' : 'hover:bg-[#faf9f7]'
                  } ${isChecked ? 'bg-[#2D5016]/5' : ''}`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => !isLocked && onTaskToggle(taskKey)}
                    disabled={isLocked}
                    className={`mt-0.5 h-6 w-6 rounded-md border-2 transition-all ${
                      isChecked 
                        ? 'bg-[#935890] border-[#935890] text-white' 
                        : 'border-[#ccc]'
                    }`}
                  />
                  <span className={`text-[15px] leading-relaxed transition-all ${
                    isChecked ? 'text-[#935890]' : 'text-[#4a4a4a]'
                  }`}>
                    {task.label}
                  </span>
                </label>
              );
            })}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
