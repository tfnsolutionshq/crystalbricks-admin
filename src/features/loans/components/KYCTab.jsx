import { Link } from "react-router-dom";

import Card from "@/shared/components/Card";

import formatCurrency from "@/shared/utils/formatCurrency";

const TYPE_LABEL = {
  bvn: "BVN",
  business_profile: "Business Profile",
  tax: "Tax Document",
  guarantors: "Guarantors",
  id_verification: "ID Verification",
  collateral: "Collateral",
};

function RequirementValue({ type, data }) {
  if (type === "bvn") {
    return <p className="text-sm text-gray-900 mt-1">{data.bvn}</p>;
  }

  if (type === "business_profile") {
    return (
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-500">Business Name</p>
        <p className="text-sm text-gray-900">{data.business_name}</p>
        <p className="text-sm text-gray-500 mt-2">CAC Registration Number</p>
        <p className="text-sm text-gray-900">{data.cac_registration_number}</p>
      </div>
    );
  }

  if (type === "tax") {
    return (
      <Link
        to={`${import.meta.env.VITE_WALLET_STORAGE_URL}/${data.file_path}`}
        target="__blank"
        className="text-sm font-medium text-gray-900 underline underline-offset-2"
      >
        Click to view document
      </Link>
    );
  }

  if (type === "guarantors") {
    return (
      <div className="mt-1 space-y-2">
        {(data.guarantors ?? []).map((g, i) => (
          <div key={i} className="text-sm">
            <p className="text-gray-500">Name</p>
            <p className="text-gray-900">{g.full_name}</p>
            <p className="text-gray-500 mt-1">Phone Number</p>
            <p className="text-gray-900">{g.phone_number}</p>
            <p className="text-gray-500 mt-1">Email</p>
            <p className="text-gray-900">{g.email || "N/A"}</p>
          </div>
        ))}
      </div>
    );
  }

  if (type === "id_verification") {
    return (
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-500">ID Type</p>
        <p className="text-sm text-gray-900">{data.id_type.toUpperCase()}</p>
        <p className="text-sm text-gray-500 mt-2">ID Number</p>
        <p className="text-sm text-gray-900">{data.id_number}</p>
      </div>
    );
  }

  if (type === "collateral") {
    return (
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-500">Asset Photo</p>
        <Link
          to={`${import.meta.env.VITE_WALLET_STORAGE_URL}/${data.asset_photo}`}
          target="__blank"
          className="text-sm font-medium text-gray-900 underline underline-offset-2"
        >
          Click to view document
        </Link>
        <p className="text-sm text-gray-500">Asset Details</p>
        <p className="text-sm text-gray-900">{data.asset_details}</p>
        <p className="text-sm text-gray-500">Collateral Type</p>
        <p className="text-sm text-gray-900">{data.collateral_type}</p>
        <p className="text-sm text-gray-500">Estimated Value</p>
        <p className="text-sm text-gray-900">
          {formatCurrency(data.estimated_value)}
        </p>
        <p className="text-sm text-gray-500">Ownership Document</p>
        <Link
          to={`${import.meta.env.VITE_WALLET_STORAGE_URL}/${data.ownership_document}`}
          target="__blank"
          className="text-sm font-medium text-gray-900 underline underline-offset-2"
        >
          Click to view document
        </Link>
      </div>
    );
  }

  return <p className="text-sm text-gray-500 mt-1">-</p>;
}

export default function KYCTab({ kycDetails }) {
  if (!kycDetails || kycDetails.length === 0) return null;

  return (
    <Card>
      <h3 className="text-base font-bold text-gray-900 mb-5">KYC</h3>
      <div className="divide-y divide-gray-100">
        {kycDetails.map((item) => (
          <div
            key={item.id ?? item.requirement_type}
            className="py-4 first:pt-0"
          >
            <p className="text-sm font-semibold text-gray-900">
              {TYPE_LABEL[item.requirement_type] ?? item.requirement_type}
            </p>
            <RequirementValue
              type={item.requirement_type}
              data={item.requirement_data}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
