export function calculate(inputs) {
  const {
    staffedORs,
    operatingDays,
    scheduledCases,
    performedCases,
    avgCaseDuration,
    revenuePerCase,
    supplyPerCase,
    currentFCOTS,
    currentTOT,
    currentPrimeTimeUtil,
    currentBlockUtil,
    costPerMinute,
    schedulingTasksPerMonth,
    avgTimePerTaskManual,
    reportingReductionPct,
    reportingHourlyCost,
    burnoutReductionPct,
    nursingFTEs,
    avgNurseReplacementCost,
    implementationCost,
    insightsPerOR,
    orDashboardPerOR,
    dayOfBoardsPerOR,
    contractLength,
    benefitRetention,
  } = inputs;

  // Step 0 — Base values
  const annualCancellationsTotal = Math.max(0, scheduledCases - performedCases);
  const computedCancellationRate = (annualCancellationsTotal / scheduledCases) * 100;
  const casesPerORPerDay = performedCases / (staffedORs * operatingDays);

  // Block 1 — FCOTS
  const FCOTSGap = Math.max(0, 88.3 - currentFCOTS);
  const FCOTSImprovementPP = FCOTSGap * 0.19;
  const projectedFCOTS = currentFCOTS + FCOTSImprovementPP;
  const FCOTSMinutesRecoveredPerYear =
    (FCOTSImprovementPP / 100) * 12 * staffedORs * operatingDays;
  const casesRecoveredFCOTS =
    (FCOTSImprovementPP / 100) * casesPerORPerDay * operatingDays * staffedORs;
  const FCOTSRevenue = casesRecoveredFCOTS * revenuePerCase;

  // Block 2 — TOT
  const TOTExcess = Math.max(0, currentTOT - 25);
  const TOTReductionMin = TOTExcess * 0.4;
  const projectedTOT = currentTOT - TOTReductionMin;
  const TOTMinutesRecoveredPerYear =
    TOTReductionMin * casesPerORPerDay * operatingDays * staffedORs;
  const additionalCasesFromTOT = Math.floor(TOTMinutesRecoveredPerYear / avgCaseDuration);
  const TOTRevenue = additionalCasesFromTOT * revenuePerCase;

  // Block 3 — Combined time recovery
  const totalMinutesRecoveredPerYear =
    FCOTSMinutesRecoveredPerYear + TOTMinutesRecoveredPerYear;
  const timeSavingsCostValue = totalMinutesRecoveredPerYear * costPerMinute;
  const potentialCasesFromMinutes = Math.floor(totalMinutesRecoveredPerYear / avgCaseDuration);
  const potentialRevenueFromMinutes = potentialCasesFromMinutes * revenuePerCase;

  // Block 4 — Capacity cap
  const totalAvailableORMinutesPerYear = staffedORs * operatingDays * 480;
  const currentlyUsedMinutes = performedCases * avgCaseDuration;
  const maxAdditionalMinutes = Math.max(
    0,
    totalAvailableORMinutesPerYear - currentlyUsedMinutes
  );
  const totalRecoveredMinutes = FCOTSMinutesRecoveredPerYear + TOTMinutesRecoveredPerYear;
  const cappedRecoveredMinutes = Math.min(totalRecoveredMinutes, maxAdditionalMinutes);
  const capacityRatio =
    totalRecoveredMinutes > 0 ? cappedRecoveredMinutes / totalRecoveredMinutes : 1;
  const FCOTSRevenueCapped = FCOTSRevenue * capacityRatio;
  const TOTRevenueCapped = TOTRevenue * capacityRatio;

  // Block 5 — Block utilization
  const totalAllocatedBlockMinutes = staffedORs * operatingDays * 480;
  const blockUtilImprovementPP = (cappedRecoveredMinutes / totalAllocatedBlockMinutes) * 100;
  const projectedBlockUtil = Math.min(currentBlockUtil + blockUtilImprovementPP, 100);

  // Block 6 — Cancellations
  const addressableCancellations = annualCancellationsTotal * 0.496;
  const avoidableCancellations = Math.floor(addressableCancellations * 0.6);
  const cancellationRevenue = avoidableCancellations * revenuePerCase;
  const projectedCancellationRate = computedCancellationRate * (1 - 0.496 * 0.6);

  // Block 7 — Supply savings
  const annualSupplySavings = performedCases * supplyPerCase * 0.0654;

  // Block 8 — Reporting efficiency
  const monthlyTimeSavedMin =
    schedulingTasksPerMonth * avgTimePerTaskManual * (reportingReductionPct / 100);
  const annualReportingHoursSaved = (monthlyTimeSavedMin / 60) * 12;
  const annualReportingCostSaved = annualReportingHoursSaved * reportingHourlyCost;

  // Block 9 — Staff retention
  const turnoverImprovementPP = burnoutReductionPct * 0.12;
  const annualStaffSavings = turnoverImprovementPP * nursingFTEs * avgNurseReplacementCost;

  // Block 10 — Compliance (display only)
  const complianceDocAnnualValue = 15 * performedCases;

  // Block 11 — Financial totals
  const totalAnnualBenefit =
    FCOTSRevenueCapped +
    TOTRevenueCapped +
    cancellationRevenue +
    annualSupplySavings +
    annualReportingCostSaved +
    annualStaffSavings;

  const totalContractBenefit =
    totalAnnualBenefit * contractLength * (benefitRetention / 100);

  // Block 12 — Platform costs & ROI
  const annualPlatformCost =
    (insightsPerOR + orDashboardPerOR + dayOfBoardsPerOR) * staffedORs;
  const totalContractCost = implementationCost + annualPlatformCost * contractLength;
  const roiMultiple = totalContractCost > 0 ? totalContractBenefit / totalContractCost : 0;
  const roiPct =
    totalContractCost > 0
      ? ((totalContractBenefit - totalContractCost) / totalContractCost) * 100
      : 0;

  // Block 13 — Scheduling efficiency score
  const currentEfficiency =
    (currentPrimeTimeUtil / 100) * (1 - computedCancellationRate / 100);
  const projectedEfficiency =
    (currentPrimeTimeUtil / 100) * (1 - projectedCancellationRate / 100);

  // Block 14 — Surgical success rate
  const currentSSR =
    (currentFCOTS / 100) * (1 - computedCancellationRate / 100) * 100;
  const projectedSSR =
    (projectedFCOTS / 100) * (1 - projectedCancellationRate / 100) * 100;

  // Display helpers — keeps all math out of components
  const timeSavedPerTask = avgTimePerTaskManual * (reportingReductionPct / 100);
  const currentEfficiencyPct = currentEfficiency * 100;
  const projectedEfficiencyPct = projectedEfficiency * 100;
  const efficiencyImprovementPP = (projectedEfficiency - currentEfficiency) * 100;
  const cancellationRateReductionPP = computedCancellationRate - projectedCancellationRate;
  const ssrImprovementPP = projectedSSR - currentSSR;

  return {
    annualCancellationsTotal,
    computedCancellationRate,
    casesPerORPerDay,
    FCOTSGap,
    FCOTSImprovementPP,
    projectedFCOTS,
    FCOTSMinutesRecoveredPerYear,
    casesRecoveredFCOTS,
    FCOTSRevenue,
    TOTExcess,
    TOTReductionMin,
    projectedTOT,
    TOTMinutesRecoveredPerYear,
    additionalCasesFromTOT,
    TOTRevenue,
    totalMinutesRecoveredPerYear,
    timeSavingsCostValue,
    potentialCasesFromMinutes,
    potentialRevenueFromMinutes,
    totalAvailableORMinutesPerYear,
    currentlyUsedMinutes,
    maxAdditionalMinutes,
    totalRecoveredMinutes,
    cappedRecoveredMinutes,
    capacityRatio,
    FCOTSRevenueCapped,
    TOTRevenueCapped,
    totalAllocatedBlockMinutes,
    blockUtilImprovementPP,
    projectedBlockUtil,
    addressableCancellations,
    avoidableCancellations,
    cancellationRevenue,
    projectedCancellationRate,
    annualSupplySavings,
    monthlyTimeSavedMin,
    annualReportingHoursSaved,
    annualReportingCostSaved,
    turnoverImprovementPP,
    annualStaffSavings,
    complianceDocAnnualValue,
    totalAnnualBenefit,
    totalContractBenefit,
    annualPlatformCost,
    totalContractCost,
    roiMultiple,
    roiPct,
    currentEfficiency,
    projectedEfficiency,
    currentSSR,
    projectedSSR,
    timeSavedPerTask,
    currentEfficiencyPct,
    projectedEfficiencyPct,
    efficiencyImprovementPP,
    cancellationRateReductionPP,
    ssrImprovementPP,
  };
}
