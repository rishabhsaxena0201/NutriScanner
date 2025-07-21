const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const uploadInput = document.getElementById("upload");
const outputText = document.getElementById("outputText");
const progressBar = document.getElementById("progressBar");

// Camera Access
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Camera error:", err);
    alert("Camera access failed. Use the upload button instead.");
  });

// Capture from camera
captureButton.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const imageData = canvas.toDataURL("image/png");
  runOCR(imageData);
});

// Upload from file
uploadInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => runOCR(reader.result);
  reader.readAsDataURL(file);
});

// OCR using Tesseract
function runOCR(imageData) {
  outputText.textContent = "Scanning...";
  progressBar.style.width = "10%";

  Tesseract.recognize(
    imageData,
    "eng",
    {
      logger: m => {
        if (m.status === "recognizing text") {
          progressBar.style.width = `${10 + m.progress * 90}%`;
        }
      }
    }
  )
  .then(({ data: { text } }) => {
    outputText.textContent = text.trim() || "No text found.";
    progressBar.style.width = "100%";
    setTimeout(() => (progressBar.style.width = "0%"), 1500);
  })
  .catch(err => {
    console.error("OCR error:", err);
    outputText.textContent = "Error scanning text.";
    progressBar.style.width = "0%";
  });
}
