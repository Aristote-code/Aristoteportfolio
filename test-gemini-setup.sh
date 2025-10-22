#!/bin/bash
echo "Testing Gemini CLI setup..."
echo ""

# Check if API key is set in environment
if [ -n "$GEMINI_API_KEY" ]; then
    echo "✅ GEMINI_API_KEY environment variable is set"
    echo "Testing with environment variable..."
    npx @google/gemini-cli "Hello! Are you working?" || echo "❌ Test failed - check your API key"
else
    echo "⚠️  GEMINI_API_KEY environment variable not set"
fi

echo ""
echo "Checking settings file..."
if grep -q "YOUR_API_KEY_HERE" ~/.gemini/settings.json; then
    echo "⚠️  Please replace YOUR_API_KEY_HERE in ~/.gemini/settings.json with your actual API key"
else
    echo "✅ Settings file appears configured"
fi

echo ""
echo "To get started:"
echo "1. Get API key from: https://aistudio.google.com/app/apikey"
echo "2. Either set environment variable: export GEMINI_API_KEY=\"your-key\""
echo "3. Or edit ~/.gemini/settings.json and replace YOUR_API_KEY_HERE"

