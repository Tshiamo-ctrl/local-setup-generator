# LSG (Local Setup Generator)

LSG is a powerful local tool for quickly generating setup and initialization scripts for Python web frameworks like Django and FastAPI. It runs as an Electron-based desktop application on your local machine.

## Features
- **Project Setup Scripts:** Automate virtual environment creation, dependency installation (`pip` or `poetry`), database initialization, and configuration (`.env` setup).
- **Environment Management:** Clear logic for blowing away testing states (destroying venvs or clearing out everything but the git repository).
- **Framework Support:** Pre-configured paths for popular setups (Horilla, Saleor, Wagtail, FastAPI, Flask, Bookwyrm).
- **Native Experience:** Operates exclusively as a local application ensuring full user-machine control, saving scripts exactly where you need them.

## Installation

Use `lsg-install.sh` to install LSG as a native desktop application on your Linux system.

1. Clone or navigate to this repository directory.
2. Run the installer script:
   ```bash
   ./lsg-install.sh
   ```
3. The script will install NPM dependencies if missing and create a desktop shortcut.
4. Open your applications menu and launch **Local Setup Generator**.

## Uninstallation

To remove the desktop shortcut from your application menu:

```bash
./lsg-uninstall.sh
```

This removes only the menu entry. To fully remove LSG, delete the project folder afterwards.

## Testing Notes
If testing the Bookwyrm target environment, utilize the built-in terminal launchers natively available within the Desktop application, as running this application locally bypasses potential sandbox restrictions sometimes found when running standard `npm start` environments inside heavily constrained terminals.
