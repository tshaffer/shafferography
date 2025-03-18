import React, { useState } from 'react';

export interface ExpandableGroupProps {
  label: string;
  children: React.ReactNode;
}

const ExpandableGroup: React.FC<ExpandableGroupProps> = ({ label, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div>
      <div
        onClick={toggleExpanded}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px 0' }}
      >
        <span style={{ marginRight: 8 }}>
          {isExpanded ? '▼' : '►'}
        </span>
        <span>{label}</span>
      </div>
      {isExpanded && (
        <div style={{ paddingLeft: 16 }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableGroup;
