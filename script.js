const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const uploadInput = document.getElementById('uploadInput');
const outputDiv = document.getElementById('output');
const switchBtn = document.getElementById('switchCameraBtn');

let currentFacingMode = 'environment';
let currentStream = null;

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacingMode },
      audio: false
    });

    currentStream = stream;
    video.srcObject = stream;
  } catch (error) {
    outputDiv.innerHTML = `<p>Camera error: ${error.message}</p>`;
  }
}

switchBtn.addEventListener('click', () => {
  currentFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
  startCamera();
});

captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL('image/png');
  outputDiv.innerHTML = `<p>Scanning text...</p><img src="${imageData}" />`;

  Tesseract.recognize(imageData, 'eng')
    .then(({ data: { text } }) => {
      outputDiv.innerHTML += `<p><strong>Extracted Text:</strong><br>${text}</p>`;
    })
    .catch(err => {
      outputDiv.innerHTML += `<p>Error scanning text: ${err.message}</p>`;
    });
});

uploadInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    outputDiv.innerHTML = `<p>Scanning text...</p><img src="${imageData}" />`;

    Tesseract.recognize(imageData, 'eng')
      .then(({ data: { text } }) => {
        outputDiv.innerHTML += `<p><strong>Extracted Text:</strong><br>${text}</p>`;
      })
      .catch(err => {
        outputDiv.innerHTML += `<p>Error scanning text: ${err.message}</p>`;
      });
  };
  reader.readAsDataURL(file);
});

// Start with rear camera
startCamera();
