#!/bin/bash

# Unix Shell Script for Project Migration to "Orbit and Chill"
# Usage: ./scripts/migrate-project.sh [destination-path] [git-repo-url]

echo ""
echo "🚀 Starting Project Migration to \"Orbit and Chill\" (Unix)..."
echo ""

# Pass all arguments to the Node.js script
if [ $# -eq 0 ]; then
    node scripts/migrate-project.js
elif [ $# -eq 1 ]; then
    node scripts/migrate-project.js "$1"
else
    node scripts/migrate-project.js "$1" "$2"
fi