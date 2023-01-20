import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.loophealth.loopnext",
  appName: "loopnext",
  webDir: "build",
  bundledWebRuntime: false,
  ios: {
    contentInset: "automatic",
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: true,
      providers: ["phone"],
    },
  },
};

export default config;
