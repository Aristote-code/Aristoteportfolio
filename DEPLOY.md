# Deployment Instructions

1.  **Login to Firebase** (if not already logged in):
    ```bash
    npx -p firebase-tools firebase login
    ```
2.  **Deploy the Rules**:
    ```bash
    npx -p firebase-tools firebase deploy --only firestore:rules --project portfolio-366ac
    ```
