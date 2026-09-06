/* Guest photos: pick, shrink in the browser, send to the couple's Drive folder.
   Upload only. Nothing on this page can list, edit or delete what is in the folder. */

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.85;
const MAX_FILES = 12;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("upload-form");
  if (!form) return;
  const nameInput = document.getElementById("upload-name");
  const fileInput = document.getElementById("upload-files");
  const pick = document.getElementById("upload-pick");
  const status = document.getElementById("upload-status");
  const configured = typeof PHOTO_UPLOAD_URL === "string" && PHOTO_UPLOAD_URL.startsWith("https://");

  const say = (text, kind) => { status.textContent = text; status.className = "upload-status" + (kind ? " " + kind : ""); };

  pick.addEventListener("click", () => {
    if (!configured) { say("Photo uploads open very soon. Please check back in a few days.", "muted"); return; }
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const files = Array.from(fileInput.files || []).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return;
    if (files.length > MAX_FILES) { say(`Up to ${MAX_FILES} photos at a time, please.`, "error"); fileInput.value = ""; return; }
    pick.disabled = true;
    let sent = 0;
    try {
      for (const file of files) {
        say(`Sending ${sent + 1} of ${files.length}…`, "busy");
        const base64 = await shrink(file);
        const res = await fetch(PHOTO_UPLOAD_URL, {
          method: "POST",
          body: JSON.stringify({ action: "photo", name: (nameInput.value || "").trim(), filename: file.name.replace(/\.[^.]+$/, "") + ".jpg", mimeType: "image/jpeg", data: base64 }),
        });
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || "rejected");
        sent++;
      }
      say(sent === 1 ? "Thank you! Your photo is with us." : `Thank you! ${sent} photos are with us.`, "ok");
      form.reset();
    } catch (e) {
      say(sent ? `${sent} sent, then something went wrong. Please try the rest again.` : "Sorry, that did not go through. Please try again in a moment.", "error");
    } finally {
      pick.disabled = false;
      fileInput.value = "";
    }
  });
});

/* Downscale to MAX_EDGE px JPEG and return the base64 body */
function shrink(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/jpeg", JPEG_QUALITY).split(",")[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}
