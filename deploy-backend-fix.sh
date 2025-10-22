#!/bin/bash

# Deploy Backend Fix for Comment Posting Issue
# This script deploys the updated Edge Function with CORS fix

echo "🚀 Deploying Backend Fix to Supabase..."
echo ""
echo "This will fix the comment posting issue by updating CORS configuration."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Error: Supabase CLI not found"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

# Check if logged in
echo "Checking authentication..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  You need to login to Supabase first"
    echo "Run: supabase login"
    exit 1
fi

echo "✅ Authentication verified"
echo ""

# Deploy the function
echo "Deploying Edge Function..."
cd supabase/functions

supabase functions deploy server --project-ref qiaichppehdzfhyvneoy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Test comment posting on your site"
    echo "2. Check browser console for any errors"
    echo "3. Verify comments persist after page refresh"
    echo ""
    echo "Test endpoint:"
    echo "curl https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/health \\"
    echo "  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'"
else
    echo ""
    echo "❌ Deployment failed"
    echo "Check the error messages above"
    exit 1
fi
