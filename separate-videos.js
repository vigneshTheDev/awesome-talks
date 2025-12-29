const fs = require('fs');

const videosJsonPath = './videos.json';
const data = JSON.parse(fs.readFileSync(videosJsonPath, 'utf8'));

const originalVideos = [];
const curatedVideos = [];

data.data.videoses.forEach(video => {
    if (video.id && video.id.startsWith('awesome_')) {
        curatedVideos.push(video);
    } else {
        originalVideos.push(video);
    }
});

// Write original videos back to videos.json
fs.writeFileSync(videosJsonPath, JSON.stringify({
    data: { videoses: originalVideos }
}, null, 2));

// Write curated videos to curated-videos.json
fs.writeFileSync('./curated-videos.json', JSON.stringify({
    data: { videoses: curatedVideos }
}, null, 2));

console.log(`Original videos: ${originalVideos.length}`);
console.log(`Curated videos: ${curatedVideos.length}`);
