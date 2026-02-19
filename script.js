// --- 1. SCROLL ANIMATION LOGIC ---
const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 240;
const currentFrame = index => (
  `./frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const imageSequence = { frame: 0 };

// Preload images
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  const img = images[imageSequence.frame];
  if (img) {
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

window.addEventListener("scroll", () => {
  const scrollTop = html.scrollTop;
  const maxScrollTop = html.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  
  imageSequence.frame = frameIndex;
  requestAnimationFrame(render);
});

const html = document.documentElement;
images[0].onload = render;

// --- 2. CHATBOX LOGIC ---
const SYSTEM_PROMPT = `
You are an assistant for Mohamed Kassali Jubair S. 
STRICT RULE: Answer ONLY using the information provided below. 
If the information is not in this text, say "I'm sorry, Jubair's resume doesn't provide details on that."

RESUME CONTENT:
[cite_start]Name: Mohamed Kassali Jubair S [cite: 1]
[cite_start]Role: Design Verification / ECE Student [cite: 2, 25]
[cite_start]Skills: Strategic Planning, Problem Solving, VLSI Design, Embedded Systems, Python, IoT, Machine Learning [cite: 8, 9, 26, 42]
Projects: 
1. [cite_start]AI Warning System (Random Forest/Linear Regression) [cite: 38, 42]
2. [cite_start]Automatic Railway Gate (Arduino, IR Sensors) [cite: 43, 44]
3. [cite_start]Smart Gas Leakage Detection (MQ-2/MQ-6, GSM, SMS alerts) [cite: 45, 46, 48]
[cite_start]Education: B.E. in ECE at Government College of Engineering, Tirunelveli (CGPA 8.2) [cite: 35, 36]
[cite_start]Contact: 8608177246, mohamedkassalijubair18@gmail.com [cite: 4, 5]
`;

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBody = document.getElementById('chat-body');

async function askGemini(prompt) {
    // This is a placeholder for the Gemini API call
    // You would typically use the @google/generative-ai SDK here
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_API_KEY', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "Connection error. Please check your API key.";
    }
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return;

    chatBody.innerHTML += `<div class="user-msg"><b>You:</b> ${text}</div>`;
    userInput.value = '';

    const botResponse = await askGemini(text);
    chatBody.innerHTML += `<div class="bot-msg"><b>AI:</b> ${botResponse}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
});
