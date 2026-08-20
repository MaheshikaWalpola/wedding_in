/* ============================================================
   CONFIG — the only file you need to edit to go live.

   1. Deploy the Apps Script (see README.md / apps-script/Code.gs)
   2. Paste its Web App URL into SCRIPT_URL below
   3. Set DEMO_MODE to false
   ============================================================ */

const CONFIG = {
  // EDIT: paste the INDIAN Apps Script web app URL here
  SCRIPT_URL: "",
  DEMO_MODE: true,  // stays demo until the Indian Apps Script above is deployed
};

/* Sample guests used only while DEMO_MODE is true.
   In live mode the guest list lives ONLY in your Google Sheet —
   the site looks up one guest at a time and never downloads the list.

   Try the seat finder with any of these names, or open a
   personalized invitation link, e.g.  index.html?g=nimali01     */

const SAMPLE_GUESTS = [
  { id: "arjun01",  name: "Arjun Reddy",              table: 3, note: "So happy you're celebrating with us!" },
  { id: "priya02",  name: "Priya Nair",               table: 5, note: "Save a dance for the newlyweds!" },
  { id: "kavya03",  name: "Kavya Subramanian",        table: 2, note: "You're seated with the university crew." },
  { id: "rohit04",  name: "Rohit Sharma",             table: 7, note: "Right by the dance floor — you're welcome!" },
  { id: "ananya05", name: "Ananya Rao",               table: 1, note: "Family table, front and centre." },
  { id: "vikram06", name: "Vikram & Meera Iyer",      table: 4, note: "A lovely view from your seats." },
];
