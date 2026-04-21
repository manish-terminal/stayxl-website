const { Jimp } = require('jimp');

async function main() {
    const imgPath = process.argv[2];
    console.log("Reading image:", imgPath);
    try {
        const image = await Jimp.read(imgPath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        console.log(`Image size: ${width}x${height}`);

        const visited = new Uint8Array(width * height);
        const boxes = [];

        const isWhite = (hex) => {
            const r = (hex >>> 24) & 255;
            const g = (hex >>> 16) & 255;
            const b = (hex >>> 8) & 255;
            return r > 240 && g > 240 && b > 240;
        };

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                if (visited[idx]) continue;
                visited[idx] = 1;

                const hex = image.getPixelColor(x, y);
                if (isWhite(hex)) continue;

                // Found a non-white pixel, start BFS to find connected component
                let minX = x, minY = y, maxX = x, maxY = y;
                const queue = [[x, y]];
                let area = 0;

                while (queue.length > 0) {
                    const [cx, cy] = queue.shift();
                    area++;
                    if (cx < minX) minX = cx;
                    if (cx > maxX) maxX = cx;
                    if (cy < minY) minY = cy;
                    if (cy > maxY) maxY = cy;

                    // Check neighbors
                    const neighbors = [
                        [cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]
                    ];

                    for (const [nx, ny] of neighbors) {
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nIdx = ny * width + nx;
                            if (!visited[nIdx]) {
                                visited[nIdx] = 1;
                                const nHex = image.getPixelColor(nx, ny);
                                if (!isWhite(nHex)) {
                                    queue.push([nx, ny]);
                                }
                            }
                        }
                    }
                }

                if (area > 100) { // Filter out small noise
                    boxes.push({ minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1, area });
                }
            }
        }

        console.log("Found boxes:");
        boxes.sort((a, b) => b.area - a.area);
        for (let i = 0; i < Math.min(20, boxes.length); i++) {
            console.log(boxes[i]);
        }
    } catch (e) {
        console.error(e);
    }
}

main();
