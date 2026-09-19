# Roadmap and Decision Log

## Allocation

| Sequence | Investment | Budget | Release evidence |
| --- | --- | --- | --- |
| First | Assignment audit trail | 3 team-weeks | Authorized decisions logged; replay and stale-state behavior verified |
| Parallel where staffing allows | Connector failure recovery | 4 team-weeks | Permission and timeout states recoverable; retry outcomes observable |
| After audit trail | Agent routing suggestions | 4 team-weeks | Human confirmation, queue validation, override capture, and urgent review verified |
| Reserved | Contingency | 1 team-week | Used only for agreed release blockers |

Dependencies concern rollout, not necessarily when design begins. Routing discovery can start early; release waits for auditability.

## Decisions

1. Protect auditability even if a higher-scoring feature appears. It is a release prerequisite in the scenario.
2. Prioritize connector recovery because it addresses a prerequisite to workflow value.
3. Fund routing assistance, not autonomous routing. The companion routing study exposes an urgent miss that a higher confidence threshold does not fix.
4. Defer the dashboard by a narrow margin. Its score is 26.7 versus 27.0 for routing; a small confidence change reverses the choice.
5. Defer summaries because of lower confidence and higher effort. Validate whether summaries change resolution behavior before funding implementation.
6. Defer templates, branding, and mobile approvals to protect the capacity constraint. They remain opportunities, not rejected customer needs.

## Reconsideration triggers

- Routing confidence falls below the modeled 0.60: rerun allocation; at 0.40 choose the dashboard alternative.
- Connector recovery estimate reaches 6 team-weeks: re-scope recovery or review the modeled audit/recovery/branding alternative. Do not let a small item win solely because it fills capacity; confirm its strategic value.
- A release gate fails: spend contingency only if the fix is bounded; otherwise defer release, not the gate.
- Customer evidence changes reach or impact: update the input file and record the rationale before rerunning.

## Validation before commitment

Product interviews target administrators experiencing failed integration attempts and agents handling reassigned tickets. Engineering estimates recovery failure modes; operations defines escalation rules. These activities are proposed, not represented as completed interviews or commitments.
