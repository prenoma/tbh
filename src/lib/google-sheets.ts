import { google } from "googleapis";

// Validation at startup — fail fast if credentials are missing
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

type SheetRow = [string, string, string, string, string, string];

let sheets: ReturnType<typeof google.sheets> | null = null;

function getClient() {
  if (!SERVICE_EMAIL || !PRIVATE_KEY || !SHEET_ID) {
    return null;
  }

  if (sheets) return sheets;

  const auth = new google.auth.JWT({
    email: SERVICE_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function appendRow(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  comments: string;
}): Promise<{ success: boolean; error?: string }> {
  const client = getClient();

  if (!client) {
    console.warn(
      "[Google Sheets] Missing credentials — skipping sheet write. " +
      "Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID in .env.local"
    );
    return { success: false, error: "Google Sheets not configured" };
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
  const row: SheetRow = [
    timestamp,
    data.name,
    data.email,
    data.phone,
    data.address,
    data.comments || "",
  ];

  try {
    const response = await client.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "waitlist!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    if (response.status === 200) {
      console.log(`[Google Sheets] Row appended to range: ${response.data.updates?.updatedRange}`);
      return { success: true };
    }

    return { success: false, error: "Failed to append row" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Google Sheets] Error appending row: ${message}`);
    return { success: false, error: message };
  }
}

export function isConfigured(): boolean {
  return !!(SERVICE_EMAIL && PRIVATE_KEY && SHEET_ID);
}
