const fs = require('fs');

const readmePath = './awesome-talks-source/README.md';
const videosJsonPath = './videos.json';

const readme = fs.readFileSync(readmePath, 'utf8');
const existingData = JSON.parse(fs.readFileSync(videosJsonPath, 'utf8'));

// Parse YouTube videos from README
const youtubeRegex = /\* \[(.*?)\]\((https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^)&]+)[^)]*)\) by \*\*(.*?)\*\*(.*?)(?:\[(\d+:\d+(?::\d+)?)\])?/g;

const newVideos = [];
let match;
let idCounter = 1;

while ((match = youtubeRegex.exec(readme)) !== null) {
    const [, title, fullUrl, videoId, speaker, rest, duration] = match;

    // Parse duration to seconds
    let durationSeconds = 0;
    if (duration) {
        const parts = duration.split(':').map(Number);
        if (parts.length === 3) {
            durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            durationSeconds = parts[0] * 60 + parts[1];
        }
    }

    // Extract event/conference info
    const eventMatch = rest.match(/\((.*?)\)/);
    const event = eventMatch ? eventMatch[1].trim() : '';

    newVideos.push({
        id: `awesome_${idCounter++}`,
        link: videoId,
        views: 0,
        likes: null,
        duration: durationSeconds,
        publishedAt: null,
        description: title,
        tags: [],
        speaker: [{
            id: `speaker_${speaker.toLowerCase().replace(/\s+/g, '_')}`,
            name: speaker
        }],
        event: event
    });
}

// Merge with existing videos
const mergedData = {
    data: {
        videoses: [...existingData.data.videoses, ...newVideos]
    }
};

fs.writeFileSync(videosJsonPath, JSON.stringify(mergedData, null, 2));

console.log(`Added ${newVideos.length} videos from awesome-talks`);
console.log(`Total videos: ${mergedData.data.videoses.length}`);
