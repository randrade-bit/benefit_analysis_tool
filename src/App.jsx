import React, { useState, useMemo } from 'react';
import { calculate } from './calculate';
import CFOPanel from './CFOPanel';
import ITPanel from './ITPanel';
import OpsSafetyPanel from './OpsSafetyPanel';

const DEFAULTS = {
  staffedORs: 8,
  operatingDays: 250,
  scheduledCases: 3000,
  performedCases: 2800,
  avgCaseDuration: 90,
  revenuePerCase: 15000,
  supplyPerCase: 800,
  currentFCOTS: 68,
  currentTOT: 38,
  currentPrimeTimeUtil: 72,
  currentBlockUtil: 68,
  costPerMinute: 62,
  schedulingTasksPerMonth: 120,
  avgTimePerTaskManual: 8,
  reportingReductionPct: 22,
  reportingHourlyCost: 65,
  burnoutReductionPct: 15,
  nursingFTEs: 40,
  avgNurseReplacementCost: 52000,
  implementationCost: 50000,
  insightsPerOR: 8000,
  orDashboardPerOR: 0,
  dayOfBoardsPerOR: 0,
  contractLength: 3,
  benefitRetention: 85,
};

const INPUT_SECTIONS = [
  {
    title: 'OR Operations',
    fields: [
      { key: 'staffedORs', label: 'Staffed ORs' },
      { key: 'operatingDays', label: 'Operating days/year' },
      { key: 'scheduledCases', label: 'Scheduled cases/year' },
      { key: 'performedCases', label: 'Performed cases/year' },
      { key: 'avgCaseDuration', label: 'Avg case duration (min)' },
    ],
  },
  {
    title: 'Financial',
    fields: [
      { key: 'revenuePerCase', label: 'Revenue per case ($)' },
      { key: 'supplyPerCase', label: 'Supply cost per case ($)' },
      { key: 'costPerMinute', label: 'OR cost per minute ($)' },
    ],
  },
  {
    title: 'Current Performance',
    fields: [
      { key: 'currentFCOTS', label: 'Current FCOTS (%)' },
      { key: 'currentTOT', label: 'Current turnover time (min)' },
      { key: 'currentPrimeTimeUtil', label: 'Prime time utilization (%)' },
      { key: 'currentBlockUtil', label: 'Block utilization (%)' },
    ],
  },
  {
    title: 'Reporting & Staffing',
    fields: [
      { key: 'schedulingTasksPerMonth', label: 'Scheduling tasks/month' },
      { key: 'avgTimePerTaskManual', label: 'Avg time per task - manual (min)' },
      { key: 'reportingReductionPct', label: 'Digitalization reduction (%)' },
      { key: 'reportingHourlyCost', label: 'Reporting hourly cost ($)' },
      { key: 'burnoutReductionPct', label: 'Burnout reduction (%)' },
      { key: 'nursingFTEs', label: 'OR nursing FTEs' },
      { key: 'avgNurseReplacementCost', label: 'Avg nurse replacement cost ($)' },
    ],
  },
  {
    title: 'Contract',
    fields: [
      { key: 'implementationCost', label: 'Implementation cost ($)' },
      { key: 'insightsPerOR', label: 'Insights cost per OR/yr ($)' },
      { key: 'orDashboardPerOR', label: 'OR Dashboard per OR/yr ($)' },
      { key: 'dayOfBoardsPerOR', label: 'Day-of boards per OR/yr ($)' },
      { key: 'contractLength', label: 'Contract length (years)' },
      { key: 'benefitRetention', label: 'Benefit retention (%)' },
    ],
  },
];

const TABS = [
  { id: 'cfo', label: 'CFO' },
  { id: 'it', label: 'IT' },
  { id: 'ops', label: 'Ops & Safety' },
];

export default function App() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [activeTab, setActiveTab] = useState('cfo');

  const handleChange = (key, value) => {
    const num = value === '' ? 0 : Number(value);
    setInputs((prev) => ({ ...prev, [key]: num }));
  };

  const results = useMemo(() => calculate(inputs), [inputs]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>LiveData Insights</h1>
        <p className="subtitle">Perioperative Workflow Benefits Analysis</p>
      </header>

      {/* Shared Input Form */}
      <div className="input-form">
        {INPUT_SECTIONS.map((section) => (
          <fieldset key={section.title} className="input-section">
            <legend>{section.title}</legend>
            <div className="input-grid">
              {section.fields.map((f) => (
                <div key={f.key} className="input-field">
                  <label htmlFor={f.key}>{f.label}</label>
                  <input
                    id={f.key}
                    type="number"
                    value={inputs[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="panel-container">
        {activeTab === 'cfo' && <CFOPanel results={results} />}
        {activeTab === 'it' && <ITPanel results={results} inputs={inputs} />}
        {activeTab === 'ops' && <OpsSafetyPanel results={results} inputs={inputs} />}
      </div>
    </div>
  );
}
