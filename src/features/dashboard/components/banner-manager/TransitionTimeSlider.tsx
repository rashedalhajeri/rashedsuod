
import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TransitionTimeSliderProps {
  transitionTime: number;
  setTransitionTime: (time: number) => void;
}

const TransitionTimeSlider: React.FC<TransitionTimeSliderProps> = ({ 
  transitionTime, 
  setTransitionTime 
}) => {
  return (
    <div className="border rounded-md p-4">
      <Label className="mb-2 block">وقت التبديل بين البنرات (بالثواني)</Label>
      <div className="flex items-center gap-4">
        <Slider 
          value={[transitionTime]} 
          min={2} 
          max={10} 
          step={1} 
          onValueChange={(values) => setTransitionTime(values[0])}
          className="flex-1"
        />
        <span className="text-lg font-medium w-8 text-center">{transitionTime}</span>
      </div>
    </div>
  );
};

export default TransitionTimeSlider;
