const storyScenes = [
    {
        id: 's1',
        //videoSrc: ['videos/scene1_1.mp4', 'videos/scene1_2.mp4'],
        videoSrc: ['videos/scene1_1.mp4'],
        audioSrc: 'audio/scene1.m4a',
        text: 'I have a secret, small but sweet. Come along for a birthday treat!',
        buttonText: 'What’s the secret?',
        textBn: 'একটা মিষ্টি গোপন কথা, জন্মদিনে হবে মজা!',
        buttonTextBn: 'গোপন কথাটা কী?',
        bgColor: 'linear-gradient(135deg, #FFDAB9, #FFD1DC)'
    },
    {
        id: 's2',
        videoSrc: ['videos/scene2.mp4'],
        audioSrc: 'audio/scene2.m4a',
        text: 'Five candles bright, one wish to do: My birthday wish is time with you!',
        buttonText: 'Let\'s pack our bags 🧳',
        textBn: 'পাঁচটি মোমে জ্বলে আলো, তোমায় পেলে লাগবে ভালো!',
        buttonTextBn: 'চলো, ব্যাগ গুছাই!',
        bgColor: 'linear-gradient(135deg, #FFDAB9, #FFD1DC)'
    },
    {
        id: 's3',
        videoSrc: ['videos/scene3_2.mp4', 'videos/scene3_1.mp4'],
        audioSrc: 'audio/scene3.m4a',
        text: 'My bag is packed, my teddy’s tight. Let’s go exploring, what a sight!',
        buttonText: 'Off we fly!',
        textBn: 'ব্যাগ গুছিয়ে, টেডি সাথে, চলো ঘুরি নতুন পথে!',
        buttonTextBn: 'চলো উড়ে যাই!',
        bgColor: 'linear-gradient(135deg, #FFD1DC, #AEC6CF)'
    },
    {
        id: 's4',
        videoSrc: ['videos/scene4.mp4', 'videos/scene5.mp4'],
        audioSrc: 'audio/scene4.m4a',
        text: 'We made it here, hooray, hooray! In Chandannagar, let’s laugh and play!',
        buttonText: 'Let\'s join the party!',
        textBn: 'চন্দননগর, এসে গেছি! হাসি-গানে মেতে উঠি!',
        buttonTextBn: 'আমার পার্টিতে আসবেন তো?',
        bgColor: 'linear-gradient(135deg, #AEC6CF, #FFFFFF)'
    },
    {
        id: 's6',
        videoSrc: ['videos/scene6.mp4'],
        text: 'Clap your hands and tap your feet! Turning five is such a treat!',
        buttonText: 'Let’s go again!',
        textBn: 'এসো সবাই, আনন্দ ভাগ করি, হাসি-খুশিতে দিনটা ভরি!',
        buttonTextBn: 'চলো আবার দেখি!',
        bgColor: 'linear-gradient(135deg, #FFD700, #FF6347)',
        showOverlay: true
    }
];

const bengaliCopy = {
    pageTitle: 'আইলিনের পঞ্চম জন্মদিন',
    welcomeHeading: 'তোমায় জানাই নিমন্ত্রণ!',
    welcomeText: 'আইলিনের সাথে চলো, জাদুর দেশে!',
    startButton: 'চলো, খুলে দেখি!',
    backButton: 'ফিরে দেখা',
    invitationTitle: 'আইলিনের পঞ্চম জন্মদিন',
    invitationDate: '৬ নভেম্বর, ২০২৬, শুক্রবার',
    invitationVenue: 'মাঙ্কুন্ডু, দিঘি গার্ডেনস',
    invitationTime: 'সকাল ১১টা থেকে'
};

const isBengali = new URLSearchParams(window.location.search).get('lang') === 'bn';

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
const bgSong = new Audio('audio/scene6.m4a');
bgSong.loop = true;
bgSong.playbackRate = 0.7;
bgSong.volume = 0.4;
const invitationOverlay = document.getElementById('invitation-overlay');
const narrativeText = document.getElementById('narrative-text');

if (isBengali) {
    document.documentElement.lang = 'bn';
    document.title = bengaliCopy.pageTitle;
    document.getElementById('welcome-heading').innerText = bengaliCopy.welcomeHeading;
    document.getElementById('welcome-text').innerText = bengaliCopy.welcomeText;
    startBtn.innerText = bengaliCopy.startButton;
    prevBtn.innerText = bengaliCopy.backButton;
    document.getElementById('invitation-title').innerText = bengaliCopy.invitationTitle;
    document.getElementById('invitation-date').innerText = bengaliCopy.invitationDate;
    document.getElementById('invitation-venue').innerText = bengaliCopy.invitationVenue;
    document.getElementById('invitation-time').innerText = bengaliCopy.invitationTime;
}

startBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    storyScreen.classList.add('active');
    bgSong.play().catch(e => console.log('Song play error:', e));
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
    narrativeText.innerText = isBengali ? scene.textBn : scene.text;
    
    if (scene.showOverlay) {
        invitationOverlay.classList.remove('hidden');
    } else {
        invitationOverlay.classList.add('hidden');
    }
    
    nextBtn.innerText = isBengali ? scene.buttonTextBn : scene.buttonText;
    nextBtn.classList.remove('hidden');
    
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
