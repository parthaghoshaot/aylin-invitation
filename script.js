const storyScenes = [
    {
        id: 's1',
        videoSrc: ['videos/scene1_1.mp4', 'videos/scene1_2.mp4'],
        audioSrc: 'audio/scene1.mp3',
        text: 'Hi, I am Aylin! ✨ Psst... I have a little secret, and I cannot wait to share it with you!',
        buttonText: 'Tell me the secret 💫',
        bgColor: 'linear-gradient(135deg, #FFDAB9, #FFD1DC)'
    },
    {
        id: 's2',
        videoSrc: ['videos/scene2.mp4'],
        audioSrc: 'audio/scene2.mp3',
        text: 'My 5th birthday is almost here! I closed my eyes, made the biggest wish ever, and it was all about celebrating with YOU.',
        buttonText: 'Let\'s pack our bags 🧳',
        bgColor: 'linear-gradient(135deg, #FFDAB9, #FFD1DC)'
    },
    {
        id: 's3',
        videoSrc: ['videos/scene3_2.mp4', 'videos/scene3_1mp4.mp4'],
        audioSrc: 'audio/scene3.mp3',
        text: 'Teddy is in, snacks are in, and my suitcase is zipped up tight. Are you ready for an adventure too?',
        buttonText: 'Ready, set, take off! ✈️',
        bgColor: 'linear-gradient(135deg, #FFD1DC, #AEC6CF)'
    },
    {
        id: 's4',
        videoSrc: ['videos/scene5.mp4', 'videos/scene4.mp4' ],
        audioSrc: 'audio/scene4.mp3',
        text: 'Wohoo! Up above the clouds and zooming across the sky, all the way to Bengal. We made it!',
        buttonText: 'Join my birthday party 🏡',
        bgColor: 'linear-gradient(135deg, #AEC6CF, #FFFFFF)'
    },
    {
        id: 's6',
        videoSrc: ['videos/scene6.mp4'],
        audioSrc: 'audio/scene6.mp3',
        text: 'Drums are beating, lights are glowing, and the whole family is waiting. Come celebrate my 5th birthday with me! 🎉',
        buttonText: 'Replay the journey 🔄',
        bgColor: 'linear-gradient(135deg, #FFD700, #FF6347)',
        showOverlay: true
    }
];

let currentSceneIndex = 0;
let currentSubVideoIndex = 0; // Tracks which video segment in the array is playing
let autoTransitionTimer = null; 

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const storyScreen = document.getElementById('story-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const storyVideo = document.getElementById('story-video');
const sceneAudio = document.getElementById('scene-audio');
const invitationOverlay = document.getElementById('invitation-overlay');
const narrativeText = document.getElementById('narrative-text');

startBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    storyScreen.classList.add('active');
    loadScene(0);
});

function loadScene(index) {
    if (autoTransitionTimer) {
        clearTimeout(autoTransitionTimer);
    }

    if (index >= storyScenes.length) {
        index = 0; // Loop back to start
    }
    if (index < 0) {
        index = 0;
    }
    
    currentSceneIndex = index;
    currentSubVideoIndex = 0; // Reset sub-video index for the new scene
    const scene = storyScenes[index];
    
    // Update UI elements
    document.body.style.background = scene.bgColor;
    narrativeText.innerText = scene.text;
    
    if (scene.showOverlay) {
        invitationOverlay.classList.remove('hidden');
    } else {
        invitationOverlay.classList.add('hidden');
    }
    
    nextBtn.innerText = scene.buttonText;
    nextBtn.classList.add('hidden');
    
    if (index === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }
    
    // Play the first video clip of this scene
    playSubVideo();
}

function playSubVideo() {
    const scene = storyScenes[currentSceneIndex];
    storyVideo.src = scene.videoSrc[currentSubVideoIndex];
    storyVideo.play().catch(e => console.log('Video play error:', e));

    // Only restart the audio when the first sub-video of a scene starts
    if (currentSubVideoIndex === 0) {
        if (scene.audioSrc) {
            sceneAudio.src = scene.audioSrc;
            sceneAudio.play().catch(e => console.log('Audio play error:', e));
        } else {
            sceneAudio.pause();
        }
    }
}

// Seamlessly play the next sub-video, or move to the next scene logic if done
storyVideo.addEventListener('ended', () => {
    const scene = storyScenes[currentSceneIndex];
    
    // Are there more video parts for this single scene?
    if (currentSubVideoIndex < scene.videoSrc.length - 1) {
        currentSubVideoIndex++;
        playSubVideo(); // Seamlessly play the next part!
    } else {
        // Entire scene is done, show button and start 5s timer
        nextBtn.classList.remove('hidden');
        
        // Auto-advance disabled for development
        // autoTransitionTimer = setTimeout(() => {
        //     goToNextScene();
        // }, 5000);
    }
});

function goToNextScene() {
    if (autoTransitionTimer) clearTimeout(autoTransitionTimer);
    currentSceneIndex++;
    loadScene(currentSceneIndex);
}

function goToPrevScene() {
    if (autoTransitionTimer) clearTimeout(autoTransitionTimer);
    currentSceneIndex--;
    loadScene(currentSceneIndex);
}

nextBtn.addEventListener('click', goToNextScene);
prevBtn.addEventListener('click', goToPrevScene);
