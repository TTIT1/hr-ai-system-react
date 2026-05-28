import { createContext, useContext, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export function Tabs({
  children,
  defaultTab,
}: {
  children: React.ReactNode;
  defaultTab: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function TabList({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap gap-1 rounded-xl border border-[#c8c4d5] bg-[#f6f2fc] p-1 dark:border-[#2e2a3d] dark:bg-[#1a1826]">
      {children}
    </div>
  );
}

export function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const isActive = context.activeTab === id;

  return (
    <button
      type="button"
      className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'text-[#1b1b22] dark:text-[#e8e4f0]'
          : 'text-[#58566a] hover:text-[#1b1b22] dark:text-[#9490a8] dark:hover:text-[#e8e4f0]'
      }`}
      onClick={() => context.setActiveTab(id)}
    >
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-[#252235]"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  return context.activeTab === id ? <div className="animate-fade-in">{children}</div> : null;
}
