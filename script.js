const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('captureBtn');
const uploadInput = document.getElementById('uploadInput');
const extractedTextDiv = document.getElementById('extractedText');
const loadingIndicator = document.getElementById('loadingIndicator');

// Start rear camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    video.srcObject = stream;
    video.style.display = 'block';
    captureBtn.disabled = false;
  } catch (err) {
    alert("Could not access camera.");
    console.error(err);
  }
}

// Run OCR using Tesseract
async function extractTextFromImage(imageData) {
  loadingIndicator.style.display = 'block';
  extractedTextDiv.innerText = '';

  try {
    const result = await Tesseract.recognize(imageData, 'eng', {
      logger: m => console.log(m)
    });
    extractedTextDiv.innerText = result.data.text;
  } catch (error) {
    extractedTextDiv.innerText = 'Error extracting text.';
    console.error(error);
  } finally {
    loadingIndicator.style.display = 'none';
  }
}

// Capture from camera
captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(blob => extractTextFromImage(blob));
});

// Upload image from gallery
uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const img = new Image();
  const reader = new FileReader();

  reader.onload = function (e) {
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => extractTextFromImage(blob));
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

// Initialize on page load
window.addEventListener('load', () => {
  startCamera();
});
