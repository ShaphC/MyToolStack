"use client";

import { useEffect, useState } from "react";
import ToolHeader from "@/app/components/ToolHeader";

type Template = {
  name: string;
  content: string;
};

export default function MessageRepeater() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);

  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  const [variables, setVariables] = useState<string[]>([]);
  const [valuesList, setValuesList] = useState<any[]>([{}]);
  const [outputs, setOutputs] = useState<string[]>([]);

  const [error, setError] = useState("");

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem("msgTemplates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  // SAVE
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem("msgTemplates", JSON.stringify(templates));
    }
  }, [templates]);

  const extractVariables = (text: string) => {
    const matches = [...text.matchAll(/{(.*?)}/g)];
    return [...new Set(matches.map((m) => m[1]))];
  };

  const selectTemplate = (t: Template) => {
    setSelected(t);
    const vars = extractVariables(t.content);
    setVariables(vars);
    setValuesList([{}]);
    setOutputs([]);
  };

  const addTemplate = () => {
    if (!templateName.trim()) {
      setError("Template name is required");
      return;
    }

    if (!templateContent.trim()) {
      setError("Template content cannot be empty");
      return;
    }

    setTemplates((prev) => [
      ...prev,
      { name: templateName, content: templateContent },
    ]);

    setTemplateName("");
    setTemplateContent("");
    setError("");
  };

  const updateValue = (rowIndex: number, key: string, value: string) => {
    const updated = [...valuesList];
    updated[rowIndex][key] = value;
    setValuesList(updated);
  };

  const addRow = () => {
    setValuesList([...valuesList, {}]);
  };

  const generateMessages = () => {
    if (!selected) {
      setError("Select a template first");
      return;
    }

    const results = valuesList.map((row) => {
      let msg = selected.content;

      variables.forEach((v) => {
        msg = msg.replaceAll(`{${v}}`, row[v] || "");
      });

      return msg;
    });

    setOutputs(results);
    setError("");
  };

  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <ToolHeader title="📨 Message Repeater" />

        {/* ERROR */}
        {error && <div style={styles.error}>{error}</div>}

        {/* CREATE TEMPLATE */}
        <div style={styles.card}>
          <h3>Create Template</h3>

          <input
            placeholder="Template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Template (use {variables})"
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={addTemplate} style={styles.button}>
            Save Template
          </button>
        </div>

        {/* TEMPLATE LIST */}
        <div style={styles.card}>
          <h3>Templates</h3>

          {templates.length === 0 && <div>No templates yet</div>}

          {templates.map((t, i) => (
            <div
              key={i}
              style={{
                ...styles.templateItem,
                border:
                  selected?.name === t.name
                    ? "2px solid #1d4ed8"
                    : "1px solid #1d4ed8",
              }}
              onClick={() => selectTemplate(t)}
            >
              {t.name}
            </div>
          ))}
        </div>

        {/* VARIABLES */}
        {selected && (
          <div style={styles.card}>
            <h3>Fill Variables</h3>

            {valuesList.map((row, rowIndex) => (
              <div key={rowIndex} style={styles.row}>
                {variables.map((v) => (
                  <input
                    key={v}
                    placeholder={v}
                    value={row[v] || ""}
                    onChange={(e) =>
                      updateValue(rowIndex, v, e.target.value)
                    }
                    style={styles.input}
                  />
                ))}
              </div>
            ))}

            <button onClick={addRow} style={styles.secondary}>
              + Add Another Message
            </button>

            <button onClick={generateMessages} style={styles.button}>
              Generate Messages
            </button>
          </div>
        )}

        {/* OUTPUT */}
        {outputs.length > 0 && (
          <div style={styles.card}>
            <h3>Generated Messages</h3>

            {outputs.map((msg, i) => (
              <div key={i} style={styles.output}>
                <div>{msg}</div>

                <button
                  onClick={() => copyToClipboard(msg)}
                  style={styles.smallBtn}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },

  container: {
    width: "100%",
    maxWidth: "700px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  card: {
    border: "2px solid #1d4ed8",
    borderRadius: "10px",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  input: {
    padding: "0.5rem",
    border: "2px solid #1d4ed8",
    borderRadius: "6px",
    color: "#000000",
  },

  textarea: {
    padding: "0.5rem",
    border: "2px solid #1d4ed8",
    borderRadius: "6px",
    minHeight: "80px",
    color: "#000000",
  },

  button: {
    background: "#1d4ed8",
    color: "#ffffff",
    padding: "0.6rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondary: {
    background: "#eee",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },

  templateItem: {
    padding: "0.5rem",
    borderRadius: "6px",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  output: {
    border: "1px solid #1d4ed8",
    padding: "0.5rem",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallBtn: {
    padding: "0.3rem 0.6rem",
    border: "1px solid #1d4ed8",
    background: "transparent",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #dc2626",
  },
};