"""Reproduce the portfolio's synthetic analyses. Python 3 standard library only."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def read(path):
    return json.loads((ROOT / path).read_text())

def best_bundle(rows, budget=11):
    best = None
    for mask in range(1 << len(rows)):
        chosen = [row for i, row in enumerate(rows) if mask & (1 << i)]
        ids = {row["id"] for row in chosen}
        if any(row["mandatory"] and row["id"] not in ids for row in rows):
            continue
        if any(row["dependency"] and row["dependency"] not in ids for row in chosen):
            continue
        cost = sum(row["effort"] for row in chosen)
        if cost > budget:
            continue
        value = sum(row["reach"]*row["impact"]*row["confidence"] for row in chosen)
        if best is None or (value, -cost) > (best[0], -best[1]):
            best = (value, cost, sorted(ids))
    return best

def roadmap():
    rows = read("data/opportunities.json")
    print("\nROADMAP — fictional planning inputs")
    for row in sorted(rows, key=lambda r: r["reach"]*r["impact"]*r["confidence"]/r["effort"], reverse=True):
        score = row["reach"]*row["impact"]*row["confidence"]/row["effort"]
        print(f'{row["id"]}: score={score:.1f}')
    baseline = best_bundle(rows)
    lower_confidence = [dict(r, confidence=.4) if r["id"] == "routing" else dict(r) for r in rows]
    higher_effort = [dict(r, effort=6) if r["id"] == "recovery" else dict(r) for r in rows]
    print("Baseline (value, effort, choices):", baseline)
    print("Lower routing confidence:", best_bundle(lower_confidence))
    print("Higher recovery effort:", best_bundle(higher_effort))
    assert baseline == (480.0, 11, ["audit", "recovery", "routing"])
    assert best_bundle(lower_confidence) == (452.0, 10, ["audit", "dashboard", "recovery"])
    assert best_bundle(higher_effort) == (388.0, 11, ["audit", "branding", "recovery"])


if __name__ == "__main__":
    roadmap()
