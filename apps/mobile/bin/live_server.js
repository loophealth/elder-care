const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const address = require("address");

const capacitorConfig = require("../capacitor.config.json");

// Find IP address and add it to the Capacitor configuration.
const ipAddress = address.ip();
capacitorConfig.server = {
  url: `http://${ipAddress}:3000`,
  cleartext: true,
};
fs.writeFileSync(
  path.join(__dirname, "../capacitor.config.json"),
  JSON.stringify(capacitorConfig, null, 2)
);

// Copy the changed Capacitor configuration into the native project.
child_process.execSync("npx cap copy", { stdio: "inherit" });

// Run the development server.
const proc = child_process.spawn("npm", ["start"], { stdio: "inherit" });

// Handle Ctrl+C.
process.on("SIGINT", () => {
  // Kill the development server.
  proc.kill("SIGINT");

  // Remove the IP address from the Capacitor configuration.
  delete capacitorConfig.server;
  fs.writeFileSync(
    path.join(__dirname, "../capacitor.config.json"),
    JSON.stringify(capacitorConfig, null, 2)
  );
});
