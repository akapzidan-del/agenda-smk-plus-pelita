/**
 * Helper to export data to CSV with UTF-8 BOM for Microsoft Excel compatibility
 */
import { sanitizeFilename, sanitizeCsvCell } from "../security"

export function exportToCSV(filename, headers, rows) {
  const safeFilename = sanitizeFilename(filename)

  const processCell = (val) => {
    const cleaned = sanitizeCsvCell(val)
    const stringVal = cleaned.replace(/"/g, '""')
    return `"${stringVal}"`
  }

  const csvRows = [
    (headers || []).map((h) => `"${sanitizeCsvCell(h).replace(/"/g, '""')}"`).join(","),
    ...(rows || []).map((row) => (row || []).map(processCell).join(",")),
  ]

  const csvContent = "\uFEFF" + csvRows.join("\r\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  try {
    link.setAttribute("href", url)
    link.setAttribute("download", safeFilename.endsWith(".csv") ? safeFilename : `${safeFilename}.csv`)
    document.body.appendChild(link)
    link.click()
  } finally {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

