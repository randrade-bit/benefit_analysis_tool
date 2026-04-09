import React from 'react';
import { fmtDollar, fmtPct, fmtNum } from './format';

export default function ITPanel({ results, inputs }) {
  const r = results;
  return (
    <div className="panel">
      {/* Headline KPIs */}
      <div className="kpi-row">
        <div className="kpi-card accent">
          <div className="kpi-label">Annual Reporting Hours Saved</div>
          <div className="kpi-value">{fmtNum(r.annualReportingHoursSaved)} hrs</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">Annual Reporting Cost Saved</div>
          <div className="kpi-value">{fmtDollar(r.annualReportingCostSaved)}</div>
        </div>
      </div>

      <h3 className="section-heading">Reporting &amp; Digitalization</h3>
      <div className="metric-grid">
        <MetricCard label="Digitalization Reduction" value={fmtPct(inputs.reportingReductionPct)} />
        <MetricCard label="Scheduling Tasks / Month" value={fmtNum(inputs.schedulingTasksPerMonth)} />
        <MetricCard
          label="Time Saved per Task"
          value={`${fmtNum(inputs.avgTimePerTaskManual * (inputs.reportingReductionPct / 100))} min`}
          note={`From ${inputs.avgTimePerTaskManual} min manual avg`}
        />
        <MetricCard
          label="Monthly Time Saved"
          value={`${fmtNum(r.monthlyTimeSavedMin)} min`}
        />
      </div>

      <h3 className="section-heading">Additional Context</h3>
      <div className="metric-grid">
        <MetricCard
          label="Compliance Documentation Value"
          value={fmtDollar(r.complianceDocAnnualValue)}
          note="Additional unquantified value, not included in total"
          muted
        />
      </div>

      <h3 className="section-heading">Financial Summary</h3>
      <div className="metric-grid">
        <MetricCard label="Total Contract Benefit" value={fmtDollar(r.totalContractBenefit)} />
        <MetricCard label="ROI Multiple" value={`${r.roiMultiple.toFixed(1)}×`} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, note, muted }) {
  return (
    <div className={`metric-card${muted ? ' muted' : ''}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {note && <div className="metric-note">{note}</div>}
    </div>
  );
}
