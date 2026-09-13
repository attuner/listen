function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Clear and set signaling state
    if (data.action === "reset") {
      sheet.clear();
      sheet.appendRow(["key", "value"]);
    } else if (data.action === "set") {
      sheet.appendRow([data.key, JSON.stringify(data.value)]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const result = {};
  
  // Convert rows into a key-value object
  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    const val = rows[i][1];
    if (key.startsWith("candidate_")) {
      if (!result[key]) result[key] = [];
      result[key].push(JSON.parse(val));
    } else {
      result[key] = JSON.parse(val);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
