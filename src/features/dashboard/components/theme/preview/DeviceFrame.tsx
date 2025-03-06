
import React from "react";
import { Phone } from "lucide-react";

interface DeviceFrameProps {
  device: 'mobile' | 'tablet' | 'desktop';
  children: React.ReactNode;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ device, children }) => {
  return (
    <>
      {/* Phone frame header - only show for mobile */}
      {device === 'mobile' && (
        <div className="flex items-center justify-center bg-gray-100 p-2 border-b">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 mr-1">معاينة على الجوال</span>
        </div>
      )}
      
      {/* Content */}
      {children}
    </>
  );
};

export default DeviceFrame;
