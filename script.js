const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const startBtn = document.getElementById('start-camera');
const switchBtn = document.getElementById('switch-camera');
const uploadInput = document.getElementById('image-upload');
const outputDiv = document.getElementById('output');

let currentStream = null;
let usingFrontCamera = false;

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: {
      facingMode: usingFrontCamera ? 'user' : { ideal: 'environment' }
    },
    audio: false
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
    video.style.display = 'block';
    captureBtn.disabled = false;
  } catch (err) {
    alert("Unable to access camera.");
    console.error(err);
  }
}

switchBtn.addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera();
});

startBtn.addEventListener('click', () => {
  startCamera();
});

captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  const imageData = canvas.toDataURL('image/png');
  outputDiv.innerHTML = `<p>Captured Image:</p><img src="${imageData}" />`;
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      outputDiv.innerHTML = `<p>Uploaded Image:</p><img src="${e.target.result}" />`;
    };
    reader.readAsDataURL(file);
  }
});

// Start with rear camera
startCamera();
