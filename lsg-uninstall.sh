#!/bin/bash

# LSG Uninstaller — removes the desktop shortcut created by lsg-install.sh

DESKTOP_FILE_NAME="lsg.desktop"
DESKTOP_DIR="$HOME/.local/share/applications"
DESKTOP_FILE_PATH="$DESKTOP_DIR/$DESKTOP_FILE_NAME"

if [ -f "$DESKTOP_FILE_PATH" ]; then
    rm "$DESKTOP_FILE_PATH"
    echo "✅ Desktop shortcut removed: $DESKTOP_FILE_PATH"
else
    echo "ℹ️  No desktop shortcut found at $DESKTOP_FILE_PATH — nothing to remove."
fi

# Refresh the desktop database so the menu updates immediately
update-desktop-database "$DESKTOP_DIR" 2>/dev/null

echo "Uninstall complete. The project files remain in place — delete the folder manually if needed."

exit 0
