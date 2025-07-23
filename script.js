// script.js

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const switchCameraButton = document.getElementById('switchCameraButton');
const fileInput = document.getElementById('fileInput');
const ocrOutput = document.getElementById('ocrOutput');
const nutritionOutput = document.getElementById('nutritionOutput');
const scoreOutput = document.getElementById('scoreOutput');

let currentStream;
let useRearCamera = true;

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  const constraints = {
    video: {
      facingMode: useRearCamera ? 'environment' : 'user'
    }
  };
  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (err) {
    console.error('Camera access error:', err);
  }
}

switchCameraButton.addEventListener('click', () => {
  useRearCamera = !useRearCamera;
  startCamera();
});

captureButton.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async blob => {
    const { data: { text } } = await Tesseract.recognize(blob, 'eng');
    processOCRText(text);
  });
});

fileInput.addEventListener('change', async e => {
  const file = e.target.files[0];
  if (file) {
    const { data: { text } } = await Tesseract.recognize(file, 'eng');
    processOCRText(text);
  }
});

function processOCRText(text) {
  ocrOutput.textContent = text;
  const nutrition = extractNutrition(text);
  nutritionOutput.textContent = JSON.stringify(nutrition, null, 2);
  const grade = calculateNutriScore(nutrition);
  scoreOutput.textContent = grade ? `Nutri-Score: ${grade}` : 'Unable to calculate Nutri-Score.';
}

function extractValue(regex, text) {
  const match = text.match(regex);
  return match ? parseFloat(match[1].replace(',', '.')) : null;
}

function extractNutrition(text) {
  const lower = text.toLowerCase();
  return {
    energy: extractValue(/energy[^\d]*(\d+(?:[.,]\d+)?)/i, lower),
    sugar: extractValue(/total sugar[^\d]*(\d+(?:[.,]\d+)?)/i, lower),
    saturatedFat: extractValue(/saturated fat[^\d]*(\d+(?:[.,]\d+)?)/i, lower),
    sodium: extractValue(/sodium[^\d]*(\d+(?:[.,]\d+)?)/i, lower),
    fiber: extractValue(/dietary fibre[^\d]*(\d+(?:[.,]\d+)?)/i, lower),
    fruitPercent: extractValue(/(\d+(?:[.,]\d+)?)%[^\n]*fruit/i, lower),
    protein: extractValue(/protein[^\d]*(\d+(?:[.,]\d+)?)/i, lower)
  };
}

function calculateNutriScore(n) {
  if (!n.energy || !n.sugar || !n.saturatedFat || !n.sodium) return null;
  const pointsA = (
    scoreEnergy(n.energy) +
    scoreSugar(n.sugar) +
    scoreSatFat(n.saturatedFat) +
    scoreSodium(n.sodium)
  );

  const pointsC = (
    scoreFiber(n.fiber) +
    scoreFruit(n.fruitPercent) +
    scoreProtein(n.protein)
  );

  const totalScore = pointsA - pointsC;

  if (totalScore <= -1) return 'A';
  if (totalScore <= 2) return 'B';
  if (totalScore <= 10) return 'C';
  if (totalScore <= 18) return 'D';
  return 'E';
}

function scoreEnergy(kcal) {
  return kcal > 3350 ? 10 : Math.floor(kcal / 335);
}

function scoreSugar(g) {
  return g > 45 ? 10 : Math.floor(g / 4.5);
}

function scoreSatFat(g) {
  return g > 10 ? 10 : Math.floor(g);
}

function scoreSodium(mg) {
  return mg > 900 ? 10 : Math.floor(mg / 90);
}

function scoreFiber(g) {
  if (!g) return 0;
  if (g > 4.7) return 5;
  return Math.floor(g);
}

function scoreFruit(p) {
  if (!p) return 0;
  if (p > 80) return 5;
  if (p > 60) return 2;
  if (p > 40) return 1;
  return 0;
}

function scoreProtein(g) {
  if (!g) return 0;
  if (g > 8) return 5;
  return Math.floor(g);
}

startCamera();
