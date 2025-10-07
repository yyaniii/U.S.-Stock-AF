import React, { useMemo } from 'react';
import type { Post } from '../types';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { ChevronDoubleLeftIcon } from './icons/ChevronDoubleLeftIcon';

interface SidebarProps {
  posts: Post[];
  selectedCompany: string | null;
  onSelectCompany: (company: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentView: 'list' | 'bookmarks';
  onSelectView: (view: 'list' | 'bookmarks') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  posts,
  selectedCompany,
  onSelectCompany,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse,
  currentView,
  onSelectView,
}) => {
  const companies = useMemo(() => {
    const companySet = new Set<string>(posts.map(p => p.ticker).filter(Boolean));
    return Array.from(companySet).sort();
  }, [posts]);

  return (
    <aside className={`bg-gray-800 p-4 border-r border-gray-700 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto">
        <div>
          {!isCollapsed && <h2 className="text-lg font-bold text-gray-100 mb-4">目錄</h2>}
          
          {isCollapsed ? (
             <div className="flex justify-center items-center h-[42px]">
                <button className="p-2 rounded-md hover:bg-gray-700" aria-label="Search">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </button>
            </div>
          ) : (
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="查找話題或關鍵字..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <nav className="flex-1 flex flex-col space-y-4">
          <button 
            onClick={() => onSelectView('bookmarks')}
            className={`flex items-center space-x-3 text-gray-300 px-2 py-1.5 rounded-md transition-colors ${isCollapsed && 'justify-center'} ${
                currentView === 'bookmarks' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 hover:text-white'
            }`}>
            <BookmarkIcon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>我的書櫃</span>}
          </button>
          <div className="space-y-1">
              <button
                  onClick={() => onSelectCompany(null)}
                  className={`w-full text-left flex items-center space-x-3 px-2 py-1.5 rounded-md transition-colors ${isCollapsed && 'justify-center'} ${
                  currentView === 'list' && !selectedCompany ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
                  }`}
              >
                  <BuildingOfficeIcon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>所有公司</span>}
              </button>
            {companies.map(company => (
              <button
                key={company}
                onClick={() => onSelectCompany(company)}
                className={`w-full text-left flex items-center space-x-3 px-2 py-1.5 rounded-md transition-colors ${isCollapsed && 'justify-center'} ${
                  currentView === 'list' && selectedCompany === company ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <BuildingOfficeIcon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{`$${company}`}</span>}
              </button>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="pt-4 border-t border-gray-700">
        <button
          onClick={onToggleCollapse}
          className={`w-full flex items-center p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          aria-label={isCollapsed ? '展開目錄' : '收合目錄'}
        >
          <ChevronDoubleLeftIcon className={`w-6 h-6 transition-transform duration-300 flex-shrink-0 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
          {!isCollapsed && (
            <span className="ml-3 font-semibold">收合目錄</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;