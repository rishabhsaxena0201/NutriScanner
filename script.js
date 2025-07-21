const imageUpload = document.getElementById('imageUpload');
const startCamera = document.getElementById('startCamera');
const cameraSelect = document.getElementById('cameraSelect');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const output = document.getElementById('output');

let stream;

// Load available cameras
navigator.mediaDevices.enumerateDevices().then(devices => {
  devices.forEach(device => {
    if (device.kind === 'videoinput') {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.text = device.label || `Camera ${cameraSelect.length + 1}`;
      cameraSelect.appendChild(option);
    }
  });
});

startCamera.onclick = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  const selectedDeviceId = cameraSelect.value;
  navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      facingMode: { ideal: 'environment' }
    }
  }).then(s => {
    stream = s;
    video.srcObject = stream;
  }).catch(err => {
    alert("Camera access error: " + err);
  });
};

captureButton.onclick = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const imageData = canvas.toDataURL();
  scanImage(imageData);
};

imageUpload.onchange = () => {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => scanImage(reader.result);
    reader.readAsDataURL(file);
  }
};

function scanImage(imageData) {
  output.innerHTML = `<p><em>Scanning text...</em></p>`;
  Tesseract.recognize(imageData, 'eng', {
    logger: m => console.log(m)
  }).then(({ data: { text } }) => {
    if (!text || text.trim() === "") {
      output.innerHTML = `<p><strong>No text detected.</strong></p>`;
    } else {
      output.innerHTML = `
        <p><strong>Extracted Text:</strong><br>${text}</p>
        <p><strong>Scoring:</strong> (Coming Soon...)</p>
      `;
    }
  }).catch(err => {
    output.innerHTML = `<p>Error: ${err.message}</p>`;
  });
}
