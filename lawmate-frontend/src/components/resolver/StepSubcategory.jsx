import React from 'react';
import Card from '../common/Card';

const SUBCATEGORIES = {
  criminal: [
    { id: 'theft', label: 'Theft / Robbery' },
    { id: 'assault', label: 'Assault / Battery' },
    { id: 'fraud', label: 'Fraud / White Collar Crime' },
    { id: 'drug', label: 'Drug Offenses' },
    { id: 'murder', label: 'Murder / Homicide' },
    { id: 'kidnapping', label: 'Kidnapping / Abduction' },
    { id: 'defamation', label: 'Defamation' },
    { id: 'arms', label: 'Illegal Arms / Weapons' },
    { id: 'rioting', label: 'Rioting / Unlawful Assembly' },
    { id: 'dowry_death', label: 'Dowry Death / 498A' },
    { id: 'sc_st_atrocity', label: 'SC/ST Atrocity' },
    { id: 'forgery', label: 'Forgery / Counterfeiting' },
    { id: 'other_criminal', label: 'Other Criminal Offense' },
  ],
  civil: [
    { id: 'contract', label: 'Contract Dispute' },
    { id: 'tort', label: 'Personal Injury / Tort' },
    { id: 'debt', label: 'Debt Recovery' },
    { id: 'consumer', label: 'Consumer Protection' },
    { id: 'other_civil', label: 'Other Civil Matter' },
  ],
  family: [
    { id: 'divorce', label: 'Divorce / Separation' },
    { id: 'custody', label: 'Child Custody' },
    { id: 'alimony', label: 'Alimony / Maintenance' },
    { id: 'dv', label: 'Domestic Violence' },
    { id: 'other_family', label: 'Other Family Issue' },
  ],
  corporate: [
    { id: 'incorporation', label: 'Company Incorporation' },
    { id: 'compliance', label: 'Regulatory Compliance' },
    { id: 'ip', label: 'Intellectual Property' },
    { id: 'merger', label: 'Mergers & Acquisitions' },
    { id: 'ibc', label: 'Insolvency & Bankruptcy' },
    { id: 'arbitration', label: 'Arbitration & Dispute Resolution' },
    { id: 'fema', label: 'Foreign Exchange (FEMA)' },
    { id: 'other_corporate', label: 'Other Corporate Issue' },
  ],
  property: [
    { id: 'tenant', label: 'Landlord / Tenant Dispute' },
    { id: 'ownership', label: 'Ownership / Title Dispute' },
    { id: 'transfer', label: 'Property Transfer / Sale' },
    { id: 'rera', label: 'RERA Complaint (Builder)' },
    { id: 'land_acquisition', label: 'Government Land Acquisition' },
    { id: 'cooperative_society', label: 'Housing Society Dispute' },
    { id: 'other_property', label: 'Other Property Issue' },
  ],
  cyber: [
    { id: 'hacking', label: 'Hacking / Data Breach' },
    { id: 'harassment', label: 'Online Harassment' },
    { id: 'fraud', label: 'Online / Financial Fraud' },
    { id: 'crypto', label: 'Crypto / Digital Assets Fraud' },
    { id: 'other_cyber', label: 'Other Cyber Issue' },
  ],
  labor: [
    { id: 'termination', label: 'Wrongful Termination' },
    { id: 'wages', label: 'Unpaid Wages' },
    { id: 'harassment_work', label: 'Workplace Harassment (POSH)' },
    { id: 'other_labor', label: 'Other Employment Issue' },
  ],
  traffic: [
    { id: 'accident', label: 'Road Accident' },
    { id: 'challan', label: 'Traffic Challan / Fine' },
    { id: 'drunken_driving', label: 'Drunken Driving' },
    { id: 'license', label: 'License / Registration Issue' },
    { id: 'other_traffic', label: 'Other Traffic Issue' },
  ],
  consumer: [
    { id: 'defective_product', label: 'Defective Product' },
    { id: 'service_deficiency', label: 'Deficiency in Service' },
    { id: 'ecommerce', label: 'E-Commerce Complaint' },
    { id: 'banking', label: 'Banking / Insurance Dispute' },
    { id: 'other_consumer', label: 'Other Consumer Issue' },
  ],
  constitutional: [
    { id: 'fundamental_rights', label: 'Fundamental Rights Violation' },
    { id: 'rti', label: 'Right to Information (RTI)' },
    { id: 'discrimination', label: 'Discrimination / Equality' },
    { id: 'pil', label: 'Public Interest Litigation' },
    { id: 'reservation', label: 'Reservation / Affirmative Action' },
    { id: 'election', label: 'Election Dispute' },
    { id: 'citizenship', label: 'Citizenship Issue' },
    { id: 'other_constitutional', label: 'Other Constitutional Issue' },
  ],
  education: [
    { id: 'admission', label: 'Admission Dispute' },
    { id: 'fee_dispute', label: 'Fee Dispute / Refund' },
    { id: 'ragging', label: 'Ragging / Bullying' },
    { id: 'other_education', label: 'Other Education Issue' },
  ],
  health: [
    { id: 'medical_negligence', label: 'Medical Negligence' },
    { id: 'insurance_claim', label: 'Health Insurance Claim' },
    { id: 'mental_health', label: 'Mental Health Rights' },
    { id: 'food_safety', label: 'Food Adulteration / Safety' },
    { id: 'epidemic', label: 'Epidemic / Public Health' },
    { id: 'other_health', label: 'Other Medical Issue' },
  ],
  humanrights: [
    { id: 'police_excess', label: 'Police Misconduct / Excess' },
    { id: 'child_rights', label: 'Child Rights Violation' },
    { id: 'custodial_death', label: 'Custodial Violence / Death' },
    { id: 'other_humanrights', label: 'Other Human Rights Issue' },
  ],
  tax: [
    { id: 'income_tax', label: 'Income Tax Dispute' },
    { id: 'gst', label: 'GST Dispute' },
    { id: 'customs', label: 'Customs / Import-Export' },
    { id: 'property_tax', label: 'Property Tax' },
    { id: 'other_tax', label: 'Other Tax Issue' },
  ],
  environment: [
    { id: 'pollution', label: 'Air / Water Pollution' },
    { id: 'wildlife', label: 'Wildlife Crime / Poaching' },
    { id: 'forest', label: 'Forest Rights' },
    { id: 'noise', label: 'Noise Pollution' },
    { id: 'waste', label: 'Waste Management' },
    { id: 'other_environment', label: 'Other Environment Issue' },
  ],
  realestate: [
    { id: 'builder_delay', label: 'Builder Delay / RERA' },
    { id: 'illegal_construction', label: 'Illegal Construction' },
    { id: 'encroachment', label: 'Encroachment / Trespass' },
    { id: 'other_realestate', label: 'Other Real Estate Issue' },
  ],
  other: [
    { id: 'not_listed', label: 'My issue is not listed' },
  ],
};

export default function StepSubcategory({ category, onSelect, selected }) {
  const options = SUBCATEGORIES[category] || SUBCATEGORIES['other'];

  return (
    <div>
      <h2 className="text-xl font-semibold text-default mb-4">
        Select a Specific Issue
      </h2>
      <p className="text-muted mb-6">
        Narrow down the specifics of your {category} case.
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {options.map((sub) => (
          <div
            key={sub.id}
            onClick={() => onSelect(sub.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              selected === sub.id
                ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-600 text-indigo-700 dark:text-indigo-300'
                : 'bg-white dark:bg-slate-800 border-border hover:border-indigo-300 text-default'
            }`}
          >
            <span className="font-medium">{sub.label}</span>
            {selected === sub.id && (
              <span className="text-indigo-600 dark:text-indigo-400">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
