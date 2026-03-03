const fs = require("fs");
const path = require("path");
const os = require("os");
const http = require("http");
const https = require("https");

function joinUrl(baseUrl, urlPath) {
  if (!baseUrl) return urlPath;
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const trimmedPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;
  return `${trimmedBase}${trimmedPath}`;
}

function probeHealth(baseUrl, timeoutMs = 800) {
  return new Promise((resolve) => {
    try {
      const healthUrl = joinUrl(baseUrl, "/health");
      const client = healthUrl.startsWith("https:") ? https : http;
      const req = client.get(
        healthUrl,
        {
          timeout: timeoutMs,
          headers: {
            Accept: "application/json",
          },
        },
        (res) => {
          res.resume();
          resolve(res.statusCode >= 200 && res.statusCode < 500);
        }
      );
      req.on("timeout", () => {
        req.destroy(new Error("timeout"));
      });
      req.on("error", () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  const allAddresses = [];

  // Collect all valid IPv4 addresses
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        allAddresses.push({ name, address: iface.address });
      }
    }
  }

  // Priority 1: en0 (standard Mac WiFi)
  const en0 = allAddresses.find((idx) => idx.name === "en0");
  if (en0) return en0.address;

  // Priority 2: 192.168.0.x (common home WiFi subnet)
  const zeroSubnet = allAddresses.find((idx) => idx.address.startsWith("192.168.0."));
  if (zeroSubnet) return zeroSubnet.address;

  // Priority 3: First available
  if (allAddresses.length > 0) return allAddresses[0].address;

  return "localhost";
}

const envPath = path.resolve(__dirname, "../.env");
const localIp = getLocalIpAddress();

const backendUrlOverride = process.env.EXPO_PUBLIC_BACKEND_URL || null;
let port = process.env.EXPO_PUBLIC_BACKEND_PORT || "8001";

console.log(`Detected Local IP: ${localIp}`);

async function main() {
  try {
    let envContent = fs.readFileSync(envPath, "utf8");

    const candidateUrls = [];
    if (backendUrlOverride) candidateUrls.push(backendUrlOverride);
    candidateUrls.push(`http://stock-verify.local:${port}`);
    candidateUrls.push(`http://${localIp}:${port}`);
    candidateUrls.push(`http://localhost:${port}`);

    // De-dupe while preserving order
    const uniqueCandidates = [...new Set(candidateUrls.filter(Boolean))];

    let computedBackendUrl = backendUrlOverride || `http://${localIp}:${port}`;
    for (const candidate of uniqueCandidates) {
      // If backend isn't running yet, don't block; we'll fall back below.
      // But if a candidate IS reachable, prefer it.
      // eslint-disable-next-line no-await-in-loop
      const ok = await probeHealth(candidate);
      if (ok) {
        computedBackendUrl = candidate;
        break;
      }
    }

    const frontendUrlRegex = /^EXPO_PUBLIC_BACKEND_URL=.*$/m;
    const newFrontendUrlLine = `EXPO_PUBLIC_BACKEND_URL=${computedBackendUrl}`;

    const filesToUpdate = [envPath, path.resolve(__dirname, "../.env.lan")];

    for (const filePath of filesToUpdate) {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, "utf8");
        if (frontendUrlRegex.test(content)) {
          content = content.replace(frontendUrlRegex, newFrontendUrlLine);
        } else {
          content += `\n${newFrontendUrlLine}`;
        }

        // Also ensure PORT is consistent
        const portRegex = /^EXPO_PUBLIC_BACKEND_PORT=.*$/m;
        if (portRegex.test(content)) {
          content = content.replace(portRegex, `EXPO_PUBLIC_BACKEND_PORT=${port}`);
        }

        fs.writeFileSync(filePath, content);
        console.log(`Successfully updated ${path.basename(filePath)} to ${computedBackendUrl}`);
      }
    }
  } catch (error) {
    console.error("Error updating .env file:", error);
    process.exit(1);
  }
}

main();
