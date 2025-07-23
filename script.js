const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('startCamera');
const switchBtn = document.getElementById('switchCameraButton');
const captureBtn = document.getElementById('captureButton');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const ocrOutput = document.getElementById('ocrOutput');
const nutData = document.getElementById('nutritionOutput');
const scoreOut = document.getElementById('scoreOutput');

let stream;
let useRear = true;

async function startCamera() {
  if (stream) stream.getTracks().forEach(t => t.stop());

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: useRear ? 'environment' : 'user' }
    });
    video.srcObject = stream;
    status.textContent = 'Camera ready.';
  } catch (e) {
    status.textContent = 'Camera error. ' + e.message;
  }
}

switchBtn.onclick = () => { useRear = !useRear; startCamera(); };
startBtn.onclick = startCamera;

captureBtn.onclick = () => {
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  processImage(canvas.toDataURL());
};

fileInput.onchange = () => {
  if (fileInput.files[0]) {
    processImage(URL.createObjectURL(fileInput.files[0]));
  }
};

async function processImage(src) {
  status.textContent = 'Scanning image for text…';
  ocrOutput.textContent = '';
  nutData.textContent = '';
  scoreOut.textContent = '';

  try {
    const { data: { text } } = await Tesseract.recognize(src, 'eng', {
      logger: m => status.textContent = m.status
    });
    status.textContent = 'OCR complete.';
    ocrOutput.textContent = text.trim();

    const nutrients = extractNutrition(text);
    nutData.textContent = JSON.stringify(nutrients, null, 2);

    const grade = calculateScore(nutrients);
    scoreOut.textContent = grade ? `Nutri-Score: ${grade}` : 'Could not calculate Nutri-Score.';
  } catch (e) {
    status.textContent = 'Error during OCR: ' + e.message;
  }
}

function extractNutrition(t) {
  const txt = t.toLowerCase();
  const get = (re) => {
    const m = txt.match(re);
    return m ? parseFloat(m[1].replace(',', '.')) : null;
  };
  return {
    energy: get(/energy[^\d]*(\d+([.,]\d+)?)/),
    sugar: get(/sugar[^\d]*(\d+([.,]\d+)?)/),
    satFat: get(/saturat(ed)? fat[^\d]*(\d+([.,]\d+)?)/),
    sodium: get(/sodium[^\d]*(\d+([.,]\d+)?)/) || get(/salt[^\d]*(\d+([.,]\d+)?)/),
    fiber: get(/fib(er|re)[^\d]*(\d+([.,]\d+)?)/),
    fruit: get(/(\d+([.,]\d+)?)\s*%[^\n]*(fruit|veg)/),
    protein: get(/protein[^\d]*(\d+([.,]\d+)?)/)
  };
}

function calculateScore(n) {
  if (!n.energy || !n.sugar || !n.satFat || !n.sodium) return null;
  const neg = pts(n.energy / 0.239) + pts(n.sugar,4.5) + pts(n.satFat) + pts(n.sodium / 1);
  const pos = (n.fiber?pts(n.fiber,0.9):0)+(n.fruit?fruitPts(n.fruit):0)+(n.protein?pts(n.protein,1.6):0);

  const total = neg - pos;
  if (total <= -1) return 'A';
  if (total <= 2) return 'B';
  if (total <= 10) return 'C';
  if (total <= 18) return 'D';
  return 'E';
}

function pts(val, step=1) { return Math.floor(val/step); }
function fruitPts(p) {
  if (p > 80) return 5;
  if (p > 60) return 2;
  if (p > 40) return 1;
  return 0;
}

startCamera();
