import { TABS } from "@/features/products/mocks/productsMockData";

export default function ProductTabs({ activeTab, onChange }) {
  return (
    <div className="flex items-center gap-6 border-b border-gray-200">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`pb-3 text-sm font-medium -mb-px border-b-2 transition-colors ${
              isActive
                ? "text-gray-900 border-gray-900"
                : "text-gray-400 border-transparent hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
