import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Calendar, Clock } from "lucide-react";
import Layout from "@/shared/components/DashboardComponents/Layout.jsx";
import { RATE_PRODUCTS } from "./RateConfigPage.jsx";

/* -------------------------------------------------------------------------- */
/* Dummy data                                                                  */
/* -------------------------------------------------------------------------- */

const AMOUNT_TIERS = [
  {
    id: "tier-1",
    label: "\u20a650,000 - \u20a699,999",
    rates: { 3: "9.00", 6: "9.25", 9: "9.50", 12: "9.75" },
  },
  {
    id: "tier-2",
    label: "\u20a6100,000 - \u20a6249,999",
    rates: { 3: "9.25", 6: "9.50", 9: "9.75", 12: "10.00" },
  },
  {
    id: "tier-3",
    label: "\u20a6250,000 - \u20a6499,999",
    rates: { 3: "9.50", 6: "9.75", 9: "10.00", 12: "10.50" },
  },
  {
    id: "tier-4",
    label: "\u20a6500,000 and above",
    rates: { 3: "10.50", 6: "10.75", 9: "11.00", 12: "11.50" },
  },
];

const PLAN_DURATIONS = [
  { key: "3", label: "3 months plan" },
  { key: "6", label: "6 months plan" },
  { key: "9", label: "9 months plan" },
  { key: "12", label: "12 months plan" },
];

/* -------------------------------------------------------------------------- */
/* Rate input cell                                                             */
/* -------------------------------------------------------------------------- */

function RateInput({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-pink-300">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm text-gray-900 focus:outline-none disabled:text-gray-500 disabled:cursor-default bg-transparent"
      />
      <span className="text-sm text-gray-400">%</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Configure Rates table                                                       */
/* -------------------------------------------------------------------------- */

function RatesTable({ tiers, isEditing, onRateChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm font-semibold text-gray-900 border-b border-gray-100">
            <th className="pb-4 pr-6 font-semibold">Amount Tier</th>
            {PLAN_DURATIONS.map((plan) => (
              <th
                key={plan.key}
                className="pb-4 pr-6 font-semibold whitespace-nowrap"
              >
                {plan.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier) => (
            <tr key={tier.id} className="border-b border-gray-50">
              <td className="py-3.5 pr-6 text-sm text-gray-700 whitespace-nowrap">
                {tier.label}
              </td>
              {PLAN_DURATIONS.map((plan) => (
                <td key={plan.key} className="py-3.5 pr-6">
                  <div className="w-32">
                    <RateInput
                      value={tier.rates[plan.key]}
                      disabled={!isEditing}
                      onChange={(val) => onRateChange(tier.id, plan.key, val)}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Effective date & time fields                                               */
/* -------------------------------------------------------------------------- */

function DateTimeField({
  label,
  value,
  onChange,
  icon: Icon,
  disabled,
  helperText,
}) {
  return (
    <div className="flex-1 min-w-55">
      <label className="block text-sm text-gray-500 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-900 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300"
        />
        <Icon
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{helperText}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

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
    // TODO: persist `tiers`, `effectiveDate`, `effectiveTime` to the backend
    setIsEditing(false);
  };

  return (
    <Layout activeNavItem="Rate Config">
      <div className="p-6 space-y-6 max-w-[1600px]">
        {/* Page header */}
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

        {/* Rates table */}
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

        {/* Effective date & time */}
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
