const fs = require('fs');

const readmePath = './awesome-talks-source/README.md';
const readme = fs.readFileSync(readmePath, 'utf8');

// Parse categories and their videos
const categoryRegex = /####\s+(.+)/g;
const youtubeRegex = /\* \[(.*?)\]\((https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^)&]+)[^)]*)\) by \*\*(.*?)\*\*(.*?)(?:\[(\d+:\d+(?::\d+)?)\])?/g;

const lines = readme.split('\n');
let currentCategory = null;
const videos = [];
let idCounter = 1;

for (const line of lines) {
    // Check if this is a category header
    const categoryMatch = line.match(/####\s+(.+)/);
    if (categoryMatch) {
        currentCategory = categoryMatch[1].trim();
        continue;
    }

    // Check if this is a video entry
    const videoMatch = line.match(/\* \[(.*?)\]\((https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([^)&]+)[^)]*)\) by \*\*(.*?)\*\*(.*?)(?:\[(\d+:\d+(?::\d+)?)\])?/);
    if (videoMatch && currentCategory) {
        const [, title, fullUrl, videoId, speaker, rest, duration] = videoMatch;

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

        videos.push({
            id: `awesome_${idCounter++}`,
            link: videoId,
            views: 0,
            likes: null,
            duration: durationSeconds,
            publishedAt: null,
            description: title,
            tags: [{
                id: `category_${currentCategory.toLowerCase().replace(/\s+/g, '_')}`,
                name: currentCategory
            }],
            speaker: [{
                id: `speaker_${speaker.toLowerCase().replace(/\s+/g, '_')}`,
                name: speaker
            }],
            event: event,
            category: currentCategory
        });
    }
}

// Write to curated-videos.json
const output = {
    data: { videoses: videos }
};

fs.writeFileSync('./curated-videos.json', JSON.stringify(output, null, 2));

console.log(`Parsed ${videos.length} videos across categories`);

// Count videos per category
const categoryCounts = {};
videos.forEach(v => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
});

console.log('\nVideos per category:');
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});
