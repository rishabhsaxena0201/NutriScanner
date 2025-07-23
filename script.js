let videoStream;
let currentCamera = 'environment'; // rear by default

const video = document.getElementById('camera');
const captureBtn = document.getElementById('captureBtn');
const uploadInput = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const outputDiv = document.getElementById('output');
const switchCameraBtn = document.getElementById('switchCamera');

async function startCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: { facingMode: currentCamera }
  };

  try {
    videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = videoStream;
  } catch (err) {
    alert('Camera access failed: ' + err.message);
  }
}

switchCameraBtn.addEventListener('click', () => {
  currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
  startCamera();
});

captureBtn.addEventListener('click', () => {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');
  processImage(imageData);
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      processImage(reader.result);
    };
    reader.readAsDataURL(file);
  }
});

function processImage(imageDataUrl) {
  outputDiv.innerHTML = '<p>Scanning...</p>';

  Tesseract.recognize(
    imageDataUrl,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    outputDiv.innerHTML = '';
    const extracted = extractNutritionData(text);
    const score = calculateNutriScore(extracted);
    displayResults(extracted, score);
  });
}

function extractNutritionData(text) {
  const extract = (label) => {
    const match = text.match(new RegExp(`${label}.*?(\\d+[.,]?\\d*)`, 'i'));
    return match ? parseFloat(match[1].replace(',', '.')) : 0;
  };

  return {
    energy: extract('energy|kcal|kj'),
    sugar: extract('sugar'),
    satFat: extract('saturated'),
    sodium: extract('sodium|salt'),
    fiber: extract('fiber'),
    protein: extract('protein'),
    fruits: extract('fruit|vegetable')
  };
}

function calculateNutriScore(data) {
  let score = 0;

  const negative = (data.energy / 335) + (data.sugar / 4.5) + (data.satFat / 1) + (data.sodium / 90);
  const positive = (data.fiber / 0.9) + (data.protein / 1.6) + (data.fruits / 40);

  score = negative - positive;

  if (score <= -1) return 'A';
  else if (score <= 2) return 'B';
  else if (score <= 10) return 'C';
  else if (score <= 18) return 'D';
  else return 'E';
}

function displayResults(data, grade) {
  outputDiv.innerHTML = `
    <h3>Extracted Data</h3>
    <ul>
      <li><strong>Energy:</strong> ${data.energy} kJ</li>
      <li><strong>Sugars:</strong> ${data.sugar} g</li>
      <li><strong>Saturated Fat:</strong> ${data.satFat} g</li>
      <li><strong>Sodium:</strong> ${data.sodium} mg</li>
      <li><strong>Fiber:</strong> ${data.fiber} g</li>
      <li><strong>Protein:</strong> ${data.protein} g</li>
      <li><strong>Fruits/Veg %:</strong> ${data.fruits}%</li>
    </ul>
    <h2>Nutri-Score: <span class="grade grade-${grade}">${grade}</span></h2>
  `;
}
