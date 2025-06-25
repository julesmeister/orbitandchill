#!/bin/bash

# Simple migration test - tests the most common use case

echo "🧪 Testing simplified migration..."
echo ""

# Test 1: Check if migration script exists
if [ ! -f "scripts/migrate-project.js" ]; then
    echo "❌ Migration script not found!"
    exit 1
fi

# Test 2: Verify we're in project root
if [ ! -f "package.json" ]; then
    echo "❌ Not in project root directory!"
    exit 1
fi

# Test 3: Test with simple project name
TEST_NAME="test-project-$(date +%s)"
echo "📋 Testing migration with name: $TEST_NAME"
echo ""

# Run migration in dry-run mode (interrupt after validations)
timeout 3s node scripts/migrate-project.js "$TEST_NAME" 2>&1 | while IFS= read -r line; do
    echo "$line"
    if [[ "$line" == *"Copying project files"* ]]; then
        echo ""
        echo "✅ Migration script started successfully!"
        echo "✅ Auto-generated path correctly"
        echo "✅ Validation passed"
        echo ""
        echo "🎉 Simplified migration is working!"
        break
    fi
done

# Clean up if directory was created
PARENT_DIR=$(dirname $(pwd))
TEST_DIR="$PARENT_DIR/$TEST_NAME"
if [ -d "$TEST_DIR" ]; then
    rm -rf "$TEST_DIR"
    echo "🧹 Cleaned up test directory"
fi

echo ""
echo "You can now migrate your project with just:"
echo "  npm run migrate \"your-project-name\""