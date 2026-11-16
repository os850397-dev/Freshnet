{
  "name": "freshnet",
  "version": "1.0.0",
  "private": true,
  "description": "Freshnet secure frontend with Supabase-ready auth and PWA shell",
  "scripts": {
    "dev": "npx serve . -l 8080",
    "build": "echo 'No build step required for this static frontend.'",
    "cap:sync": "npx cap sync android",
    "cap:open:android": "npx cap open android",
    "cap:run:android": "npx cap run android"
  },
  "dependencies": {
    "@capacitor/android": "^6.1.2",
    "@capacitor/cli": "^6.1.2",
    "@capacitor/core": "^6.1.2"
  }
}
