let currentStream = null;
let useRearCamera = true;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");
const switchBtn = document.getElementById("switchCamera");
const startCameraBtn = document.getElementById("startCamera");
const uploadInput = document.getElementById("upload");
const status = document.getElementById("status");
const ocrText = document.getElementById("ocrText");
const nutritionData = document.getElementById("nutritionData");
const nutriScoreDisplay = document.getElementById("nutriScore");

function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }
}

async function startCamera() {
  stopCamera();
  const constraints = {
    video: {
      facingMode: useRearCamera ? { exact: "environment" } : "user",
    },
  };
  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (err) {
    console.error("Camera error:", err);
    status.textContent = "Camera access error. Please allow permission.";
  }
}

function captureImage() {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function extractTextFromImage(image) {
  status.textContent = "Scanning...";
  Tesseract.recognize(image, "eng")
    .then(({ data: { text } }) => {
      status.textContent = "Scan complete.";
      ocrText.textContent = text;
      const nutrition = extractNutrition(text);
      nutritionData.textContent = JSON.stringify(nutrition, null, 2);
      const grade = calculateNutriScore(nutrition);
      nutriScoreDisplay.textContent = grade ? `Nutri-Score: ${grade}` : "Unable to calculate Nutri-Score.";
    })
    .catch((err) => {
      console.error(err);
      status.textContent = "Error during OCR.";
    });
}

function extractNutrition(text) {
  const nutrients = {};
  const patterns = [
    { key: "energy", regex: /energy\s*[:\-]?\s*(\d{1,5})\s*k?j/i },
    { key: "sugars", regex: /sugars?\s*[:\-]?\s*(\d{1,2}([.,]\d{1,2})?)\s*g/i },
    { key: "satFat", regex: /saturated fat\s*[:\-]?\s*(\d{1,2}([.,]\d{1,2})?)\s*g/i },
    { key: "sodium", regex: /salt\s*[:\-]?\s*(\d{1,2}([.,]\d{1,2})?)\s*g/i },
    { key: "fiber", regex: /fiber\s*[:\-]?\s*(\d{1,2}([.,]\d{1,2})?)\s*g/i },
    { key: "fruitVeg", regex: /fruit[s& ]*vegetables?\s*[:\-]?\s*(\d{1,3})%/i },
    { key: "protein", regex: /protein\s*[:\-]?\s*(\d{1,2}([.,]\d{1,2})?)\s*g/i },
  ];

  for (const { key, regex } of patterns) {
    const match = text.match(regex);
    if (match) {
      nutrients[key] = parseFloat(match[1].replace(",", "."));
    }
  }
  return nutrients;
}

function calculateNutriScore(n) {
  if (!n.energy || !n.sugars || !n.satFat || !n.sodium || !n.fiber || !n.fruitVeg || !n.protein) return null;

  const pointsNegative =
    energyPoints(n.energy) + sugarPoints(n.sugars) + fatPoints(n.satFat) + sodiumPoints(n.sodium);
  const pointsPositive = fiberPoints(n.fiber) + fruitVegPoints(n.fruitVeg) + proteinPoints(n.protein);

  const score = pointsNegative - pointsPositive;

  if (score <= -1) return "A";
  else if (score <= 2) return "B";
  else if (score <= 10) return "C";
  else if (score <= 18) return "D";
  else return "E";
}

const energyPoints = (val) => (val <= 335 ? 0 : val <= 670 ? 1 : val <= 1005 ? 2 : val <= 1340 ? 3 : val <= 1675 ? 4 : val <= 2010 ? 5 : val <= 2345 ? 6 : val <= 2680 ? 7 : val <= 3015 ? 8 : val <= 3350 ? 9 : 10);
const sugarPoints = (val) => (val <= 4.5 ? 0 : val <= 9 ? 1 : val <= 13.5 ? 2 : val <= 18 ? 3 : val <= 22.5 ? 4 : val <= 27 ? 5 : val <= 31 ? 6 : val <= 36 ? 7 : val <= 40 ? 8 : val <= 45 ? 9 : 10);
const fatPoints = (val) => (val <= 1 ? 0 : val <= 2 ? 1 : val <= 3 ? 2 : val <= 4 ? 3 : val <= 5 ? 4 : val <= 6 ? 5 : val <= 7 ? 6 : val <= 8 ? 7 : val <= 9 ? 8 : val <= 10 ? 9 : 10);
const sodiumPoints = (val) => {
  const mg = val * 1000; // convert g to mg
  return mg <= 90 ? 0 : mg <= 180 ? 1 : mg <= 270 ? 2 : mg <= 360 ? 3 : mg <= 450 ? 4 : mg <= 540 ? 5 : mg <= 630 ? 6 : mg <= 720 ? 7 : mg <= 810 ? 8 : mg <= 900 ? 9 : 10;
};
const fiberPoints = (val) => (val <= 0.9 ? 0 : val <= 1.9 ? 1 : val <= 2.8 ? 2 : val <= 3.7 ? 3 : val <= 4.7 ? 4 : 5);
const fruitVegPoints = (val) => (val <= 40 ? 0 : val <= 60 ? 1 : val <= 80 ? 2 : 5);
const proteinPoints = (val) => (val <= 1.6 ? 0 : val <= 3.2 ? 1 : val <= 4.8 ? 2 : val <= 6.4 ? 3 : val <= 8.0 ? 4 : 5);

captureBtn.addEventListener("click", () => {
  const image = captureImage();
  extractTextFromImage(image);
});

switchBtn.addEventListener("click", () => {
  useRearCamera = !useRearCamera;
  startCamera();
});

startCameraBtn.addEventListener("click", startCamera);

uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      extractTextFromImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }
});
