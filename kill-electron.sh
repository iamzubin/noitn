#!/bin/bash
# Kill all Electron processes

# Kill by process name
pkill -f "Electron" 2>/dev/null
pkill -f "noitn" 2>/dev/null

# Also kill any orphaned electron processes
pkill -f "electron" 2>/dev/null

echo "Killed Electron processes"
