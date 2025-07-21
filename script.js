let currentStream = null;
let useRearCamera = true;

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const textResult = document.getElementById('textResult');
const imageUpload = document.getElementById('imageUpload');

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    const constraints = {
      video: {
        facingMode: useRearCamera ? { exact: 'environment' } : 'user'
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream = stream;
    video.srcObject = stream;
  } catch (error) {
    alert('Error accessing camera: ' + error.message);
  }
}

document.getElementById('startCamera').addEventListener('click', startCamera);

document.getElementById('switchCamera').addEventListener('click', () => {
  useRearCamera = !useRearCamera;
  startCamera();
});

imageUpload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);

    textResult.textContent = 'Scanning...';

    const { data: { text } } = await Tesseract.recognize(canvas, 'eng');
    textResult.textContent = text || 'No text found.';
  };
  img.src = URL.createObjectURL(file);
});
