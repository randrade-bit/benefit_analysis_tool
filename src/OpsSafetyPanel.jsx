import React from 'react';
import { fmtDollar, fmtPct, fmtInt, fmtNum } from './format';

export default function OpsSafetyPanel({ results, inputs }) {
  const r = results;
  return (
    <div className="panel">
      {/* Headline KPIs */}
      <div className="kpi-row">
        <div className="kpi-card accent">
          <div className="kpi-label">Minutes Recovered / Year</div>
          <div className="kpi-value">{fmtInt(r.totalMinutesRecoveredPerYear)} min</div>
        </div>
        <div className="kpi-card accent">
          <div className="kpi-label">Avoidable Cancellations / Year</div>
          <div className="kpi-value">{fmtInt(r.avoidableCancellations)}</div>
        </div>
      </div>

      <h3 className="section-heading">First Case On-Time Starts (FCOTS)</h3>
      <div className="metric-grid">
        <BeforeAfterCard
          label="FCOTS"
          before={fmtPct(inputs.currentFCOTS)}
          after={fmtPct(r.projectedFCOTS)}
          delta={`+${fmtPct(r.FCOTSImprovementPP)} pp`}
        />
        <MetricCard label="FCOTS Minutes Recovered / Year" value={fmtInt(r.FCOTSMinutesRecoveredPerYear)} />
      </div>

      <h3 className="section-heading">Turnover Time (TOT)</h3>
      <div className="metric-grid">
        <BeforeAfterCard
          label="Turnover Time"
          before={`${fmtInt(inputs.currentTOT)} min`}
          after={`${fmtInt(r.projectedTOT)} min`}
          delta={`-${fmtInt(r.TOTReductionMin)} min`}
        />
        <MetricCard label="TOT Minutes Recovered / Year" value={fmtInt(r.TOTMinutesRecoveredPerYear)} />
        <MetricCard label="Additional Cases from TOT" value={fmtInt(r.additionalCasesFromTOT)} />
      </div>

      <h3 className="section-heading">Cancellations</h3>
      <div className="metric-grid">
        <BeforeAfterCard
          label="Cancellation Rate"
          before={fmtPct(r.computedCancellationRate)}
          after={fmtPct(r.projectedCancellationRate)}
          delta={`-${fmtPct(r.cancellationRateReductionPP)} pp`}
        />
        <MetricCard label="Avoidable Cancellations / Year" value={fmtInt(r.avoidableCancellations)} />
      </div>

      <h3 className="section-heading">Utilization &amp; Efficiency</h3>
      <div className="metric-grid">
        <BeforeAfterCard
          label="Block Utilization"
          before={fmtPct(inputs.currentBlockUtil)}
          after={fmtPct(r.projectedBlockUtil)}
          delta={`+${fmtPct(r.blockUtilImprovementPP)} pp`}
        />
        <BeforeAfterCard
          label="Scheduling Efficiency Score"
          before={fmtPct(r.currentEfficiencyPct)}
          after={fmtPct(r.projectedEfficiencyPct)}
          delta={`+${fmtPct(r.efficiencyImprovementPP)} pp`}
        />
        <BeforeAfterCard
          label="Surgical Success Rate"
          before={fmtPct(r.currentSSR)}
          after={fmtPct(r.projectedSSR)}
          delta={`+${fmtPct(r.ssrImprovementPP)} pp`}
        />
      </div>

      <h3 className="section-heading">Staff Retention</h3>
      <div className="metric-grid">
        <MetricCard label="Turnover Improvement" value={`${fmtPct(r.turnoverImprovementPP)} pp`} />
      </div>

      <h3 className="section-heading">Financial Summary</h3>
      <div className="metric-grid">
        <MetricCard label="Total Annual Benefit" value={fmtDollar(r.totalAnnualBenefit)} />
        <MetricCard label="ROI Multiple" value={`${r.roiMultiple.toFixed(1)}×`} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}

function BeforeAfterCard({ label, before, after, delta }) {
  return (
    <div className="metric-card before-after">
      <div className="metric-label">{label}</div>
      <div className="ba-row">
        <div className="ba-col">
          <span className="ba-label">Current</span>
          <span className="ba-value">{before}</span>
        </div>
        <div className="ba-arrow">→</div>
        <div className="ba-col">
          <span className="ba-label">Projected</span>
          <span className="ba-value projected">{after}</span>
        </div>
        <div className="ba-col">
          <span className="ba-label">Change</span>
          <span className="ba-value delta">{delta}</span>
        </div>
      </div>
    </div>
  );
}
