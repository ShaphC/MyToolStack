"use client";

import { useMemo, useState } from "react";

import PageLayout from "@/app/components/PageLayout";

import EntryEditor from "@/app/components/work-log/EntryEditor";
import EntryTimeline from "@/app/components/work-log/EntryTimeline";
import Filters from "@/app/components/work-log/Filters";
import MetadataCards from "@/app/components/work-log/MetadataCards";

export default function WorkLogPage() {
  const [entries, setEntries] =
    useState<any[]>([]);

  const [filter, setFilter] =
    useState("");

  const filteredEntries = useMemo(() => {
    if (!filter.trim()) return entries;

    return entries.filter((entry) => {
      const searchable = `
        ${entry.summary || ""}
        ${entry.client || ""}
        ${(entry.locations || []).join(" ")}
        ${(entry.equipment || []).join(" ")}
        ${(entry.tasks || []).join(" ")}
      `.toLowerCase();

      return searchable.includes(
        filter.toLowerCase()
      );
    });
  }, [entries, filter]);

  const allClients = useMemo(() => {
    return Array.from(
      new Set(
        entries
          .map((e) => e.client)
          .filter(Boolean)
      )
    );
  }, [entries]);

  const allEquipment = useMemo(() => {
    return Array.from(
      new Set(
        entries.flatMap(
          (e) => e.equipment || []
        )
      )
    );
  }, [entries]);

  const allLocations = useMemo(() => {
    return Array.from(
      new Set(
        entries.flatMap(
          (e) => e.locations || []
        )
      )
    );
  }, [entries]);

  return (
    <PageLayout>
      <main style={styles.page}>
        <div style={styles.container}>
          {/* HERO */}

          <div style={styles.hero}>
            <div style={styles.badge}>
              AI Work Documentation
            </div>

            <h1 style={styles.title}>
              WorkLog
            </h1>

            <p style={styles.subtitle}>
              Capture work activity,
              client visits, equipment
              usage, and field notes
              using voice or text.
            </p>
          </div>

          {/* EDITOR */}

          <EntryEditor
            onSave={(entry) =>
              setEntries((prev) => [
                entry,
                ...prev,
              ])
            }
          />

          {/* FILTERS */}

          <Filters
            filter={filter}
            setFilter={setFilter}
          />

          {/* METADATA */}

          {entries.length > 0 && (
            <div style={styles.metadataGrid}>
              <MetadataCards
                title="Clients"
                items={allClients}
              />

              <MetadataCards
                title="Equipment"
                items={allEquipment}
              />

              <MetadataCards
                title="Locations"
                items={allLocations}
              />
            </div>
          )}

          {/* TIMELINE */}

          <div style={styles.timelineSection}>
            <div style={styles.timelineTop}>
              <div>
                <div style={styles.sectionTitle}>
                  Activity Timeline
                </div>

                <div
                  style={
                    styles.sectionSubtitle
                  }
                >
                  {filteredEntries.length}{" "}
                  entries
                </div>
              </div>
            </div>

            {filteredEntries.length ===
            0 ? (
              <div style={styles.emptyCard}>
                <div
                  style={
                    styles.emptyTitle
                  }
                >
                  No entries yet
                </div>

                <div
                  style={
                    styles.emptySubtitle
                  }
                >
                  Record work activity
                  using voice or typing.
                </div>
              </div>
            ) : (
              <EntryTimeline
                entries={
                  filteredEntries
                }
              />
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    padding: "2rem",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  hero: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "0.45rem 0.8rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.12)",
    color: "#60a5fa",
    fontSize: "0.85rem",
    fontWeight: "bold",
    border:
      "1px solid rgba(37,99,235,0.2)",
  },

  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    letterSpacing: "-0.04em",
    color: "var(--text)",
    margin: 0,
  },

  subtitle: {
    color: "var(--muted)",
    fontSize: "1.05rem",
    lineHeight: 1.8,
    maxWidth: "700px",
  },

  metadataGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "1rem",
  },

  timelineSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  timelineTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  sectionSubtitle: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.95rem",
  },

  emptyCard: {
    border: "1px dashed var(--border)",
    borderRadius: "20px",
    padding: "3rem 2rem",
    background: "var(--card)",
    textAlign: "center",
  },

  emptyTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  emptySubtitle: {
    marginTop: "0.75rem",
    color: "var(--muted)",
    lineHeight: 1.7,
  },
};