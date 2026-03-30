/**
 * Google Apps Script — SLIC Index Visitor Tracker
 *
 * Deploy as a Web App (Execute as: Me, Access: Anyone) in the Google Sheet:
 *   https://docs.google.com/spreadsheets/d/1if9nlDBaq6jDJmmK7azVnyo-woj8QpGOCY7piyzXLNg
 *
 * Setup:
 *   1. Open the Google Sheet → Extensions → Apps Script
 *   2. Paste this entire file into Code.gs (replace any existing code)
 *   3. Deploy → New deployment → Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copy the deployment URL
 *   5. Update TRACKING_ENDPOINT in src/visitorTracking.ts with the new URL
 *
 * The sheet should have a tab named "Visitors" (created automatically on first POST).
 *
 * Columns written:
 *   Timestamp | IP | Country | Region | City | User Agent | Referrer | Page | Version
 */

// ── Configuration ──────────────────────────────────────────────────────────
var SHEET_NAME = "Visitors";

var COLUMNS = [
  "Timestamp",
  "IP",
  "Country",
  "Region",
  "City",
  "User Agent",
  "Referrer",
  "Page",
  "Version"
];

// ── Web App entry points ───────────────────────────────────────────────────

/**
 * Handle POST requests from the SLIC Index front-end.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date(),                       // Timestamp
      data.ip       || "Unknown",       // IP
      data.country  || "Unknown",       // Country
      data.region   || "Unknown",       // Region
      data.city     || "Unknown",       // City
      data.userAgent|| "Unknown",       // User Agent
      data.referrer || "Direct",        // Referrer
      data.page     || "/",             // Page path (new in V2)
      data.version  || "v1"             // Version tag (new in V2)
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (health check / browser test).
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      service: "SLIC Visitor Tracker",
      sheetId: SpreadsheetApp.getActiveSpreadsheet().getId()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Get the "Visitors" sheet, creating it with headers if it doesn't exist.
 */
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}
