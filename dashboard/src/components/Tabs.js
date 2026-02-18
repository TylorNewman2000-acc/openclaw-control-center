'use client';

import { useState } from 'react';

export function Tabs({ children, defaultTab = 0, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };
  
  const tabs = children.filter(child => child.type === Tab);
  
  return (
    <div>
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                }
              `}
            >
              {tab.props.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {tabs[activeTab]}
      </div>
    </div>
  );
}

export function Tab({ children }) {
  return <div>{children}</div>;
}
