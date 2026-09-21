# Enterprise Roadmap: Invest Within Capacity

## Start here

**Problem:** Choose a set of features that fits team capacity while honoring dependencies.

**What is built:** An independent Python prototype or analysis, with product documents and synthetic data.

**Code to run:** `python3 reproduce.py`

**What you will see:** Scores opportunities, evaluates all 256 combinations, and compares the selected roadmap under changed assumptions.

**Scope:** Runs locally in a terminal. No live customer integration, deployed application, or real AI model call is included.


**Status:** Completed decision-model case study. **Demonstrates:** Prioritization, opportunity cost, dependencies, uncertainty, and stakeholder communication.

## Recommendation

Allocate 3 team-weeks to an assignment audit trail, 4 to connector recovery, and 4 to agent routing suggestions. Keep 1 team-week as contingency within the 12 team-week capacity.

All inputs are fictional planning assumptions. A team-week is an aggregate effort unit, not a promised calendar delivery date.

## Model

Score = reach × impact × confidence / effort. Reach is quarterly accounts benefiting; impact is a relative 1–3 value judgment; confidence is a 0–1 evidence discount; effort is team-weeks.

| Opportunity | Reach | Impact | Confidence | Effort | Score |
| --- | --- | --- | --- | --- | --- |
| Assignment audit trail | 100 | 2 | 0.90 | 3 | 60.0 |
| Connector failure recovery | 80 | 3 | 0.80 | 4 | 48.0 |
| Agent routing suggestions | 60 | 3 | 0.60 | 4 | 27.0 |
| Workflow starter templates | 50 | 2 | 0.70 | 3 | 23.3 |
| Adoption dashboard | 100 | 1 | 0.80 | 3 | 26.7 |
| AI ticket summary | 75 | 2 | 0.50 | 5 | 15.0 |
| Custom portal branding | 20 | 1 | 0.80 | 2 | 8.0 |
| Mobile admin approvals | 30 | 2 | 0.40 | 5 | 4.8 |

Auditability is a mandatory prerequisite for AI-assisted ticket actions. The score alone does not create that obligation.

## Capacity-constrained check

The script enumerates all 256 subsets, requires auditability, enforces dependencies, reserves one team-week, and maximizes total reach × impact × confidence. Under these assumptions, the selected bundle uses 11 team-weeks and has 480 modeled value units.

These units are decision aids, not dollars or additive unique customers. Overlapping audiences may make additive benefits optimistic.

## Sensitivity

If routing confidence drops from 0.60 to 0.40, its score falls to 18.0. The preferred feasible bundle becomes audit trail + connector recovery + adoption dashboard: 10 team-weeks and 452 modeled value units.

If connector recovery effort rises from 4 to 6 team-weeks, the preferred bundle becomes audit trail + connector recovery + custom portal branding: 11 team-weeks and 388 modeled value units. The small branding item fits the remaining capacity; this is a model result to review for strategic coherence, not an automatic commitment.

## Artifacts

- [Populated opportunity inputs](data/opportunities.json)
- [Roadmap and decision log](DECISIONS.md)
- [Stakeholder memo](STAKEHOLDER_MEMO.md)
- [Reproducible enumeration and sensitivity checks](reproduce.py)

## Limitations

There is no customer research behind these estimates, no negotiated engineering sizing, and no revenue attribution. The exercise demonstrates transparent reasoning; real investment requires validated inputs.

## Run locally

Requires Python 3. No additional packages or API keys are needed.

```bash
git clone https://github.com/bsaikrishnapm-source/enterprise-roadmap.git
cd enterprise-roadmap
python3 reproduce.py
```

[Full PM portfolio](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source) · [Portfolio roadmap](https://github.com/bsaikrishnapm-source/bsaikrishnapm-source/blob/main/ROADMAP.md) · [Project backlog](https://github.com/bsaikrishnapm-source/enterprise-roadmap/issues) · [Planning board](https://github.com/users/bsaikrishnapm-source/projects/1)

## Inspect the data in Excel

```bash
python3 export_data.py --output exports
```

Creates CSV tables from the bundled synthetic data. The terminal output identifies each table and its row count. For a different JSON file, add `--input path/to/data.json`. Existing table CSV files in the output directory are replaced. These exports contain scenario inputs, not production results.
