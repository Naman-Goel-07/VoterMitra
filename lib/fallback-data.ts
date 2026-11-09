// Historical benchmark summary. The fictional review queue below is a separate fixture.
export const FALLBACK_SCORECARD = {
  "total_voters_audited": 15308,
  "audit_execution_seconds": 0.84,
  "planted_anomalies": 40,
  "true_positives_detected": 40,
  "false_positives": 8,
  "false_negatives_missed": 0,
  "precision_pct": 83.33,
  "recall_pct": 100.0,
  "f1_score": 90.91,
  "category_breakdown": {
    "BULK_DELETION": {
      "planted": 10,
      "detected": 10
    },
    "HOUSE_OVERCROWDING": {
      "planted": 10,
      "detected": 10
    },
    "DUPLICATE_EPIC": {
      "planted": 8,
      "detected": 8
    },
    "AGE_DISCREPANCY": {
      "planted": 6,
      "detected": 6
    },
    "SEX_RATIO_DISTORTION": {
      "planted": 6,
      "detected": 6
    }
  }
};

export const FALLBACK_FLAGS = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    anomalyType: 'BULK_DELETION',
    severity: 'HIGH',
    status: 'PENDING',
    acNo: 13,
    acName: 'Rohini',
    partNo: 4,
    sectionNo: 1,
    affectedCount: 12,
    confidence: 0.9,
    z: 4.2,
    primaryFinding: 'Demo scenario: an unusual cluster of removals appeared in the revised roll.',
    evidence: 'Fictional evidence for this review workflow.',
    innocentExplanations: '["Polling part reassignment", "Routine household relocation"]',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    anomalyType: 'DUPLICATE_EPIC',
    severity: 'MEDIUM',
    status: 'PENDING',
    acNo: 6,
    acName: 'Rithala',
    partNo: 1,
    sectionNo: 1,
    affectedCount: 2,
    confidence: 0.75,
    z: 3.1,
    primaryFinding: 'Demo scenario: the same fictional ID appears in two polling parts.',
    evidence: 'Sample voter ZZZ0000003 was planted in two constituencies.',
    innocentExplanations: '["A move between constituencies is still being processed"]',
  },
];
