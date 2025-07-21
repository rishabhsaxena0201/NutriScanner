document.getElementById('imageInput').addEventListener('change', async function () {
  const file = this.files[0];
  const resultDiv = document.getElementById('result');
  const scoreDiv = document.getElementById('score');

  if (!file) return;

  resultDiv.textContent = 'Scanning...';
  scoreDiv.textContent = '';

  const image = URL.createObjectURL(file);

  const { data: { text } } = await Tesseract.recognize(image, 'eng', {
    logger: m => console.log(m)
  });

  resultDiv.textContent = text;

  const parsed = parseNutrition(text);
  const grade = calculateNutriScore(parsed);
  scoreDiv.textContent = `Nutri-Score: ${grade}`;
});

// Extract nutrition values from text
function parseNutrition(text) {
  const extract = (label, unit = '', factor = 1) => {
    const regex = new RegExp(`${label}[^\\d]*(\\d+[\\.,]?\\d*)\\s*${unit}`, 'i');
    const match = text.match(regex);
    return match ? parseFloat(match[1].replace(',', '.')) * factor : 0;
  };

  return {
    energy: extract('energy', 'kcal'),
    sugars: extract('sugars?', 'g'),
    saturatedFat: extract('saturates?|sat\\. fat', 'g'),
    sodium: extract('sodium', 'mg', 1/1000),
    fiber: extract('fibre|fiber', 'g'),
    protein: extract('protein', 'g'),
    fruits: extract('fruits|vegetables', '%')
  };
}

// Score calculator
function calculateNutriScore(n) {
  let pointsNegative = 0;
  pointsNegative += score(n.energy, [0, 335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350]);
  pointsNegative += score(n.sugars, [0, 4.5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]);
  pointsNegative += score(n.saturatedFat, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  pointsNegative += score(n.sodium * 1000, [0, 90, 180, 270, 360, 450, 540, 630, 720, 810, 900]);

  let pointsPositive = 0;
  pointsPositive += score(n.fiber, [0.9, 1.9, 2.8, 3.7, 4.7], true);
  pointsPositive += score(n.protein, [1.6, 3.2, 4.8, 6.4, 8], true);
  pointsPositive += score(n.fruits, [40, 60, 80], true);

  let total = pointsNegative - pointsPositive;

  if (pointsNegative >= 11 && score(n.fruits, [40, 60, 80], true) < 5) {
    total = pointsNegative - (score(n.fruits, [40, 60, 80], true) + score(n.fiber, [0.9, 1.9, 2.8, 3.7, 4.7], true));
  }

  if (total <= -1) return 'A';
  if (total <= 2) return 'B';
  if (total <= 10) return 'C';
  if (total <= 18) return 'D';
  return 'E';
}

function score(val, thresholds, reverse = false) {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (val >= thresholds[i]) return reverse ? i + 1 : thresholds.length - i;
  }
  return 0;
}
