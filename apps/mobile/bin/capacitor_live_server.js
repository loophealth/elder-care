/**
 * Temporarily configures Capacitor to load the app from a server running on the
 * local IP address (instead of the bundled assets). Also starts the development
 * server.
 *
 * After running this script, you can run `npx cap open android` or `npx cap
 * open ios` to open the app in your native IDE and run it on a device
 * simulator. It will load from the development server running on your local
 * machine.
 *
 * When you're done, press Ctrl+C to stop the development server and revert the
 * Capacitor configuration to its original state.
 */

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

// Write the changed Capacitor configuration to disk.
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
