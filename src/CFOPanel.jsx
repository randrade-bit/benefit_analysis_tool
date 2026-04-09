import React from 'react';
import { fmtDollar, fmtPct, fmtInt } from './format';

export default function CFOPanel({ results }) {
  const r = results;
  return (
    <div className="panel">
      {/* Headline KPIs */}
      <div className="kpi-row">
        <div className="kpi-card accent">
          <div className="kpi-label">Total Annual Benefit</div>
          <div className="kpi-value">{fmtDollar(r.totalAnnualBenefit)}</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">Total Contract Benefit</div>
          <div className="kpi-value">{fmtDollar(r.totalContractBenefit)}</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">ROI Multiple</div>
          <div className="kpi-value">{r.roiMultiple.toFixed(1)}×</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">ROI</div>
          <div className="kpi-value">{fmtPct(r.roiPct)}</div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <h3 className="section-heading">Revenue &amp; Savings Breakdown</h3>
      <div className="metric-grid">
        <MetricCard label="FCOTS Revenue (capacity-capped)" value={fmtDollar(r.FCOTSRevenueCapped)} />
        <MetricCard label="TOT Revenue (capacity-capped)" value={fmtDollar(r.TOTRevenueCapped)} />
        <MetricCard label="Cancellation Revenue" value={fmtDollar(r.cancellationRevenue)} />
        <MetricCard label="Annual Supply Savings" value={fmtDollar(r.annualSupplySavings)} />
        <MetricCard label="Annual Reporting Cost Saved" value={fmtDollar(r.annualReportingCostSaved)} />
        <MetricCard label="Annual Staff Savings" value={fmtDollar(r.annualStaffSavings)} />
      </div>

      {/* Context metrics */}
      <h3 className="section-heading">Additional Context</h3>
      <div className="metric-grid">
        <MetricCard
          label="OR Time Value Recovered"
          value={fmtDollar(r.timeSavingsCostValue)}
          note="Displayed as context only"
          muted
        />
        <MetricCard
          label="Compliance Documentation Value"
          value={fmtDollar(r.complianceDocAnnualValue)}
          note="Additional unquantified value, not included in total"
          muted
        />
      </div>

      {/* Platform costs */}
      <h3 className="section-heading">Platform Costs</h3>
      <div className="metric-grid">
        <MetricCard label="Annual Platform Cost" value={fmtDollar(r.annualPlatformCost)} />
        <MetricCard label="Total Contract Cost" value={fmtDollar(r.totalContractCost)} />
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
