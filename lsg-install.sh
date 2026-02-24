#!/bin/bash

# Configuration
APP_NAME="Local Setup Generator"
DESKTOP_FILE_NAME="lsg.desktop"
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE_PATH="$DESKTOP_DIR/$DESKTOP_FILE_NAME"

# Get absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ICON_PATH="$PROJECT_DIR/icon.png"

# Ensure desktop application directory exists
mkdir -p "$DESKTOP_DIR"

echo "Creating desktop shortcut for $APP_NAME..."
echo "Project Directory: $PROJECT_DIR"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Ensure dependencies are installed
echo "Checking dependencies..."
cd "$PROJECT_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing missing dependencies..."
    npm install
fi

# Create the .desktop file
cat << EOF > "$DESKTOP_FILE_PATH"
[Desktop Entry]
Version=1.0
Type=Application
Name=$APP_NAME
Comment=Generate automated setup scripts for Python web projects
Exec=sh -c "cd '$PROJECT_DIR' && npm start"
Icon=$ICON_PATH
Terminal=false
Categories=Development;Utility;
Keywords=python;django;fastapi;flask;generator;
StartupNotify=true
StartupWMClass=local-setup-generator
EOF

# Make it executable
chmod +x "$DESKTOP_FILE_PATH"

echo "✅ Successfully installed!"
echo "You can now launch '$APP_NAME' from your application menu."
echo "Desktop file created at: $DESKTOP_FILE_PATH"

exit 0
