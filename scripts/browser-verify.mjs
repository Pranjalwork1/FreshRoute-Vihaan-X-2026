import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9335;

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

async function runBrowserTest() {
  console.log("Launching Edge on remote debugging port", port);
  const browser = spawn(edgePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--disable-gpu",
    "--window-size=1280,1000",
    "http://localhost:3000",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
    const pageTarget = targets.find((t) => t.type === "page");
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    let id = 1;
    const send = (method, params = {}) =>
      new Promise((resolve) => {
        const msgId = id++;
        const onMessage = (e) => {
          const res = JSON.parse(e.data);
          if (res.id === msgId) {
            ws.removeEventListener("message", onMessage);
            resolve(res.result);
          }
        };
        ws.addEventListener("message", onMessage);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });

    await new Promise((resolve) => ws.addEventListener("open", resolve));
    await send("Page.enable");
    await send("Runtime.enable");

    // Scroll to produce cards
    await send("Runtime.evaluate", {
      expression: `
        const el = document.querySelector('.pc');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    const shotCards = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/verified-cards.png", Buffer.from(shotCards.data, "base64"));
    console.log("Captured: public/verified-cards.png");

    // Scroll back to top and click #loc-btn
    await send("Runtime.evaluate", {
      expression: `
        window.scrollTo(0, 0);
        document.getElementById('loc-btn')?.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    const shotModal = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync("public/verified-modal.png", Buffer.from(shotModal.data, "base64"));
    console.log("Captured: public/verified-modal.png");

    ws.close();
    browser.kill();
  } catch (err) {
    console.error("Browser test error:", err);
    browser.kill();
  }
}

runBrowserTest();
