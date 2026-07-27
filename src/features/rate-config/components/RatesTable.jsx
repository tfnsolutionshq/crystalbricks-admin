import RateInput from "@/features/rate-config/components/RateInput";
import { PLAN_DURATIONS } from "@/features/rate-config/mocks/rateConfigMockData";

export default function RatesTable({ tiers, isEditing, onRateChange }) {
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
