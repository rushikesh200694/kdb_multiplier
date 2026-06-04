import React from 'react';

const CreatorBadge = () => {
  return (
    <div className="fixed bottom-4 right-4 z-[60] bg-white shadow-premium rounded-lg p-2 flex items-center gap-3 border border-gray-100 hover:scale-105 transition-transform" style={{ maxWidth: '200px' }}>
      <div className="w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
        RP
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] uppercase font-bold text-text-gray tracking-wider">Creator</span>
        <span className="text-xs font-bold text-text-dark truncate">Rushikesh Patil</span>
        <span className="text-xs font-semibold text-primary-green truncate">9422634509</span>
      </div>
    </div>
  );
};

export default CreatorBadge;
