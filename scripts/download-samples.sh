#!/bin/bash

# Download sample images from CDN to local public directory
# This avoids CORS issues and reduces server load

echo "📥 Downloading sample images..."

mkdir -p public/imgs/samples

curl -L -o public/imgs/samples/sample-1.webp https://files.picturetodrawing.com/sample/sample-1.webp
curl -L -o public/imgs/samples/sample-2.webp https://files.picturetodrawing.com/sample/sample-2.webp
curl -L -o public/imgs/samples/sample-3.webp https://files.picturetodrawing.com/sample/sample-3.webp
curl -L -o public/imgs/samples/sample-4.webp https://files.picturetodrawing.com/sample/sample-4.webp

echo "✅ Sample images downloaded successfully!"
echo "📁 Location: public/imgs/samples/"
ls -lh public/imgs/samples/
