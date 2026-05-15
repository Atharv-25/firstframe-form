// ============================================
// GOOGLE APPS SCRIPT — Paste this in Google Apps Script Editor
// ============================================
//
// SETUP INSTRUCTIONS:
// 1. Open Google Sheets → create a new spreadsheet
// 2. Name the first sheet "Creators"
// 3. Add headers in Row 1:
//    A1: Timestamp | B1: Full Name | C1: Email | D1: Phone
//    E1: City | F1: Address | G1: Instagram | H1: Followers | I1: Niches
// 4. Go to Extensions → Apps Script
// 5. Delete any existing code and paste this entire file
// 6. Click Deploy → New Deployment
// 7. Select type: "Web app"
// 8. Set "Execute as": Me
// 9. Set "Who has access": Anyone
// 10. Click Deploy and copy the Web App URL
// 11. Paste that URL into script.js as GOOGLE_SHEET_URL
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Creators");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName("Creators");
      sheet.appendRow([
        "Timestamp", "Name", "City", "Instagram Link", "Follower Count", "Niche"
      ]);
    }

    // Handle both form data (e.parameter) and JSON body
    var data;
    if (e.parameter && e.parameter.fullName) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = {};
    }

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.fullName || "",
      data.city || "",
      data.instagramLink || "",
      data.followers || "",
      data.niches || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Creator Form API is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}
