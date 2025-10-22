#!/bin/bash
# Setup script for Gemini CLI API key
echo "Gemini CLI Setup"
echo "================="
echo ""
echo "To use the Gemini CLI, you need an API key from Google AI Studio."
echo ""
echo "1. Visit: https://aistudio.google.com/app/apikey"
echo "2. Create or select your API key"
echo "3. Set it as an environment variable:"
echo ""
echo "   export GEMINI_API_KEY=\"your-api-key-here\""
echo ""
echo "4. Or add it to your shell profile (.zshrc, .bashrc, etc.) for permanent use"
echo ""
echo "5. Test with: npx @google/gemini-cli \"Hello world\""
echo ""
echo "Alternative: You can also set it in ~/.gemini/settings.json by adding:"
echo {
echo  "auth": {
echo  "apiKey": "your-api-key-here"
echo  }
echo }

