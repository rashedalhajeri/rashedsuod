
import React from 'react';
import SectionsContent from '@/components/section/SectionsContent';
import SectionsHeader from '@/components/section/SectionsHeader';

const Sections = () => {
  return (
    <div className="container mx-auto py-6">
      <SectionsHeader />
      <SectionsContent />
    </div>
  );
};

export default Sections;
