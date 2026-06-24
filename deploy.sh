#!/bin/bash

echo "Starting local build..."
npm run build

echo "Creating next-build.zip..."
rm -f next-build.zip
tar.exe -a -cf next-build.zip .next

echo "====================================="
echo "Deployment package ready!"
echo "Upload next-build.zip to server and run: unzip -o next-build.zip"
echo "====================================="
