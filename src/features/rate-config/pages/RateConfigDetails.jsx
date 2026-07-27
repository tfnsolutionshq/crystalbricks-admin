import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Calendar, Clock } from "lucide-react";

import Layout from "@/shared/components/Layout.jsx";
import RatesTable from "@/features/rate-config/components/RatesTable";
import DateTimeField from "@/features/rate-config/components/DateTimeField";
import { RATE_PRODUCTS, AMOUNT_TIERS } from "@/features/rate-config/mocks/rateConfigMockData";

export default function RateConfigDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = RATE_PRODUCTS.find((p) => p.id === productId) ?? {
    name: "SmartSaver Plan",
    status: "Active",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [tiers, setTiers] = useState(AMOUNT_TIERS);
  const [effectiveDate, setEffectiveDate] = useState("Jan 4, 2026");
  const [effectiveTime, setEffectiveTime] = useState("00:09:02");

  const handleRateChange = (tierId, planKey, value) => {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === tierId
          ? { ...tier, rates: { ...tier.rates, [planKey]: value } }
          : tier,
      ),
    );
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <Layout activeNavItem="Rate Config">
      <div className="p-6 space-y-6 max-w-[1600px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <span className="text-sm font-medium text-emerald-600">
              {product.status}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                className="bg-pink-600 hover:bg-pink-700 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-lg"
              >
                Save Configuration
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-pink-50 hover:bg-pink-100 transition-colors text-pink-600 text-sm font-medium px-4 py-2.5 rounded-lg"
              >
                Edit
              </button>
            )}
            <button
              type="button"
              aria-label="More options"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <MoreHorizontal size={16} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            {isEditing ? "Configure Rates" : "Rates"}
          </h3>
          <RatesTable
            tiers={tiers}
            isEditing={isEditing}
            onRateChange={handleRateChange}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            {isEditing ? "Set Effective Date & Time" : "Effective Date & Time"}
          </h3>
          <div className="flex flex-wrap gap-6">
            <DateTimeField
              label="Effective Date"
              value={effectiveDate}
              onChange={setEffectiveDate}
              icon={Calendar}
              disabled={!isEditing}
              helperText="Select the date when the new rates will become effective"
            />
            <DateTimeField
              label="Time"
              value={effectiveTime}
              onChange={setEffectiveTime}
              icon={Clock}
              disabled={!isEditing}
              helperText="Select the time when the new rates will become effective"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
