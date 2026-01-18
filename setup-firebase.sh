#!/bin/bash

# Firebase Setup Helper Script
# This script guides you through getting your Firebase credentials

echo "🔥 Firebase Setup Helper"
echo "========================"
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Open: https://console.firebase.google.com/"
echo "2. Click 'Add project' (or select existing project)"
echo "3. Follow prompts to create project (2-3 clicks)"
echo "4. Click the web icon '</>' to add a web app"
echo "5. Copy the firebaseConfig object that appears"
echo ""
echo "Then paste your config values below:"
echo ""

read -p "Enter apiKey: " API_KEY
read -p "Enter authDomain: " AUTH_DOMAIN
read -p "Enter projectId: " PROJECT_ID
read -p "Enter storageBucket: " STORAGE_BUCKET
read -p "Enter messagingSenderId: " MESSAGING_SENDER_ID
read -p "Enter appId: " APP_ID

# Create the client.ts file
cat > src/utils/firebase/client.ts << EOF
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "${API_KEY}",
  authDomain: "${AUTH_DOMAIN}",
  projectId: "${PROJECT_ID}",
  storageBucket: "${STORAGE_BUCKET}",
  messagingSenderId: "${MESSAGING_SENDER_ID}",
  appId: "${APP_ID}"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
EOF

echo ""
echo "✅ Firebase config created!"
echo "📁 File: src/utils/firebase/client.ts"
echo ""
echo "🚀 Now run: npm run dev"
echo "Your comments should work with real-time updates!"
