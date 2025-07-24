// Application data
const nutriScoreInfo = {
  description: "EU Nutri-Score system rates foods A-E based on nutritional quality per 100g",
  scale: [
    {"grade": "A", "color": "#2E7D33", "description": "Best nutritional quality", "range": "≤ -1 points"},
    {"grade": "B", "color": "#66BB6A", "description": "Good nutritional quality", "range": "0 to 2 points"},
    {"grade": "C", "color": "#FDD835", "description": "Fair nutritional quality", "range": "3 to 10 points"},
    {"grade": "D", "color": "#FF8F00", "description": "Poor nutritional quality", "range": "11 to 18 points"},
    {"grade": "E", "color": "#E53935", "description": "Very poor nutritional quality", "range": "≥ 19 points"}
  ]
};

const sampleIndianFoods = [
  {
    "name": "Instant Noodles",
    "ingredients": "Wheat flour, Palm oil, Salt, Sugar, Monosodium glutamate, Spices (turmeric, red chili), Thickener (guar gum), Antioxidant (ascorbic acid)",
    "nutritionPer100g": {
      "energy": 1890,
      "saturatedFat": 8.5,
      "sugar": 3.2,
      "salt": 2.8,
      "fiber": 2.1,
      "protein": 9.8,
      "fruitsVeggies": 0
    },
    "expectedScore": "D"
  },
  {
    "name": "Whole Wheat Biscuits",
    "ingredients": "Whole wheat flour, Sugar, Vegetable oil (palm), Salt, Milk powder, Raising agent (sodium bicarbonate), Emulsifier (lecithin)",
    "nutritionPer100g": {
      "energy": 1674,
      "saturatedFat": 12.3,
      "sugar": 18.5,
      "salt": 1.2,
      "fiber": 8.2,
      "protein": 11.4,
      "fruitsVeggies": 0
    },
    "expectedScore": "C"
  },
  {
    "name": "Mixed Dal (Lentils)",
    "ingredients": "Yellow lentils (moong dal), Black gram (urad dal), Pigeon pea (toor dal), Salt, Turmeric powder",
    "nutritionPer100g": {
      "energy": 1230,
      "saturatedFat": 0.8,
      "sugar": 2.1,
      "salt": 0.8,
      "fiber": 18.5,
      "protein": 24.2,
      "fruitsVeggies": 0
    },
    "expectedScore": "A"
  }
];

const indianNutritionApps = [
  {"name": "HealthifyMe", "users": "40 million+", "features": "AI nutritionist, photo tracking, Indian foods database"},
  {"name": "MyFitnessPal", "users": "200 million+", "features": "Barcode scanning, global food database, calorie tracking"},
  {"name": "NutriScan", "users": "1 million+", "features": "Photo scanning, voice assistant, Indian foods focus"}
];

const fssaiInfo = {
  description: "Food Safety and Standards Authority of India regulates nutrition labeling",
  requirements: [
    "Mandatory nutrition facts per 100g/100ml",
    "Energy, protein, carbs, fat, sugar, salt content",
    "Front-of-pack labeling proposed for high fat/sugar/salt foods",
    "Allergen declarations required"
  ]
};

// DOM elements
let currentSection = 'home';
let scoreChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  loadSampleFoods();
  populateEducationSection();
  populateHelpSection();
  bindEvents();
});

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.getAttribute('data-section');
      showSection(section);
    });
  });
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show target section
  document.getElementById(sectionName).classList.remove('hidden');
  
  // Update navigation
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
  
  currentSection = sectionName;
}

function loadSampleFoods() {
  const select = document.getElementById('sampleFood');
  sampleIndianFoods.forEach(food => {
    const option = document.createElement('option');
    option.value = food.name;
    option.textContent = food.name;
    select.appendChild(option);
  });
}

function populateEducationSection() {
  const appsTableWrapper = document.getElementById('appsTableWrapper');
  let tableHTML = '<table style="width:100%; border-collapse: collapse; margin-top: 16px;"><thead><tr style="background-color: var(--color-bg-2);"><th style="padding: 12px; text-align: left; border: 1px solid var(--color-border);">App Name</th><th style="padding: 12px; text-align: left; border: 1px solid var(--color-border);">Users</th><th style="padding: 12px; text-align: left; border: 1px solid var(--color-border);">Features</th></tr></thead><tbody>';
  
  indianNutritionApps.forEach(app => {
    tableHTML += `<tr><td style="padding: 12px; border: 1px solid var(--color-border);">${app.name}</td><td style="padding: 12px; border: 1px solid var(--color-border);">${app.users}</td><td style="padding: 12px; border: 1px solid var(--color-border);">${app.features}</td></tr>`;
  });
  
  tableHTML += '</tbody></table>';
  appsTableWrapper.innerHTML = tableHTML;
}

function populateHelpSection() {
  const fssaiList = document.getElementById('fssaiList');
  fssaiInfo.requirements.forEach(req => {
    const li = document.createElement('li');
    li.textContent = req;
    fssaiList.appendChild(li);
  });
}

function bindEvents() {
  document.getElementById('btnQuickStart').addEventListener('click', () => {
    showSection('input');
  });
  
  document.getElementById('btnCalculate').addEventListener('click', calculateNutriScore);
  
  document.getElementById('btnAnother').addEventListener('click', () => {
    clearForm();
    showSection('input');
  });
  
  document.getElementById('sampleFood').addEventListener('change', loadSampleFood);
}

function loadSampleFood() {
  const selectedName = document.getElementById('sampleFood').value;
  if (!selectedName) return;
  
  const food = sampleIndianFoods.find(f => f.name === selectedName);
  if (!food) return;
  
  document.getElementById('ingredients').value = food.ingredients;
  document.getElementById('energy').value = food.nutritionPer100g.energy;
  document.getElementById('satFat').value = food.nutritionPer100g.saturatedFat;
  document.getElementById('sugar').value = food.nutritionPer100g.sugar;
  document.getElementById('salt').value = food.nutritionPer100g.salt;
  document.getElementById('fiber').value = food.nutritionPer100g.fiber;
  document.getElementById('protein').value = food.nutritionPer100g.protein;
  document.getElementById('fv').value = food.nutritionPer100g.fruitsVeggies;
}

function clearForm() {
  document.getElementById('sampleFood').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('energy').value = '';
  document.getElementById('satFat').value = '';
  document.getElementById('sugar').value = '';
  document.getElementById('salt').value = '';
  document.getElementById('fiber').value = '';
  document.getElementById('protein').value = '';
  document.getElementById('fv').value = '';
}

function calculateNutriScore() {
  // Get input values
  const nutrition = {
    energy: parseFloat(document.getElementById('energy').value) || 0,
    saturatedFat: parseFloat(document.getElementById('satFat').value) || 0,
    sugar: parseFloat(document.getElementById('sugar').value) || 0,
    salt: parseFloat(document.getElementById('salt').value) || 0,
    fiber: parseFloat(document.getElementById('fiber').value) || 0,
    protein: parseFloat(document.getElementById('protein').value) || 0,
    fruitsVeggies: parseFloat(document.getElementById('fv').value) || 0
  };
  
  // Validate required fields
  if (nutrition.energy === 0) {
    alert('Please enter energy content');
    return;
  }
  
  // Calculate Nutri-Score using EU algorithm
  const result = calculateScore(nutrition);
  
  // Display results
  displayResults(result, nutrition);
  showSection('results');
}

function calculateScore(nutrition) {
  // Negative points (bad nutrients)
  let negativePoints = 0;
  
  // Energy points (kJ per 100g)
  if (nutrition.energy <= 335) negativePoints += 0;
  else if (nutrition.energy <= 670) negativePoints += 1;
  else if (nutrition.energy <= 1005) negativePoints += 2;
  else if (nutrition.energy <= 1340) negativePoints += 3;
  else if (nutrition.energy <= 1675) negativePoints += 4;
  else if (nutrition.energy <= 2010) negativePoints += 5;
  else if (nutrition.energy <= 2345) negativePoints += 6;
  else if (nutrition.energy <= 2680) negativePoints += 7;
  else if (nutrition.energy <= 3015) negativePoints += 8;
  else if (nutrition.energy <= 3350) negativePoints += 9;
  else negativePoints += 10;
  
  // Saturated fat points
  if (nutrition.saturatedFat <= 1) negativePoints += 0;
  else if (nutrition.saturatedFat <= 2) negativePoints += 1;
  else if (nutrition.saturatedFat <= 3) negativePoints += 2;
  else if (nutrition.saturatedFat <= 4) negativePoints += 3;
  else if (nutrition.saturatedFat <= 5) negativePoints += 4;
  else if (nutrition.saturatedFat <= 6) negativePoints += 5;
  else if (nutrition.saturatedFat <= 7) negativePoints += 6;
  else if (nutrition.saturatedFat <= 8) negativePoints += 7;
  else if (nutrition.saturatedFat <= 9) negativePoints += 8;
  else if (nutrition.saturatedFat <= 10) negativePoints += 9;
  else negativePoints += 10;
  
  // Sugar points
  if (nutrition.sugar <= 4.5) negativePoints += 0;
  else if (nutrition.sugar <= 9) negativePoints += 1;
  else if (nutrition.sugar <= 13.5) negativePoints += 2;
  else if (nutrition.sugar <= 18) negativePoints += 3;
  else if (nutrition.sugar <= 22.5) negativePoints += 4;
  else if (nutrition.sugar <= 27) negativePoints += 5;
  else if (nutrition.sugar <= 31) negativePoints += 6;
  else if (nutrition.sugar <= 36) negativePoints += 7;
  else if (nutrition.sugar <= 40) negativePoints += 8;
  else if (nutrition.sugar <= 45) negativePoints += 9;
  else negativePoints += 10;
  
  // Salt points (mg per 100g, but input is in g)
  const saltMg = nutrition.salt * 1000;
  if (saltMg <= 90) negativePoints += 0;
  else if (saltMg <= 180) negativePoints += 1;
  else if (saltMg <= 270) negativePoints += 2;
  else if (saltMg <= 360) negativePoints += 3;
  else if (saltMg <= 450) negativePoints += 4;
  else if (saltMg <= 540) negativePoints += 5;
  else if (saltMg <= 630) negativePoints += 6;
  else if (saltMg <= 720) negativePoints += 7;
  else if (saltMg <= 810) negativePoints += 8;
  else if (saltMg <= 900) negativePoints += 9;
  else negativePoints += 10;
  
  // Positive points (good nutrients)
  let positivePoints = 0;
  
  // Fiber points
  if (nutrition.fiber <= 0.9) positivePoints += 0;
  else if (nutrition.fiber <= 1.9) positivePoints += 1;
  else if (nutrition.fiber <= 2.8) positivePoints += 2;
  else if (nutrition.fiber <= 3.7) positivePoints += 3;
  else if (nutrition.fiber <= 4.7) positivePoints += 4;
  else positivePoints += 5;
  
  // Protein points
  if (nutrition.protein <= 1.6) positivePoints += 0;
  else if (nutrition.protein <= 3.2) positivePoints += 1;
  else if (nutrition.protein <= 4.8) positivePoints += 2;
  else if (nutrition.protein <= 6.4) positivePoints += 3;
  else if (nutrition.protein <= 8.0) positivePoints += 4;
  else positivePoints += 5;
  
  // Fruits/vegetables/pulses points
  if (nutrition.fruitsVeggies <= 40) positivePoints += 0;
  else if (nutrition.fruitsVeggies <= 60) positivePoints += 1;
  else if (nutrition.fruitsVeggies <= 80) positivePoints += 2;
  else positivePoints += 5;
  
  const finalScore = negativePoints - positivePoints;
  
  // Determine grade
  let grade;
  if (finalScore <= -1) grade = 'A';
  else if (finalScore <= 2) grade = 'B';
  else if (finalScore <= 10) grade = 'C';
  else if (finalScore <= 18) grade = 'D';
  else grade = 'E';
  
  return {
    negativePoints,
    positivePoints,
    finalScore,
    grade
  };
}

function displayResults(result, nutrition) {
  // Update grade display
  const gradeDisplay = document.getElementById('gradeDisplay');
  gradeDisplay.textContent = result.grade;
  gradeDisplay.className = `grade-display grade-${result.grade}`;
  
  // Update description
  const gradeInfo = nutriScoreInfo.scale.find(s => s.grade === result.grade);
  document.getElementById('gradeDescription').textContent = gradeInfo.description;
  
  // Update breakdown
  document.getElementById('negPoints').textContent = result.negativePoints;
  document.getElementById('posPoints').textContent = result.positivePoints;
  document.getElementById('finalScore').textContent = result.finalScore;
  
  // Create chart
  createScoreChart(result);
  
  // Show recommendations
  showRecommendations(result, nutrition);
}

function createScoreChart(result) {
  const ctx = document.getElementById('scoreChart').getContext('2d');
  
  if (scoreChart) {
    scoreChart.destroy();
  }
  
  scoreChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Negative Points', 'Positive Points', 'Final Score'],
      datasets: [{
        data: [result.negativePoints, result.positivePoints, Math.max(0, result.finalScore)],
        backgroundColor: ['#E53935', '#2E7D33', '#FFC185'],
        borderColor: ['#C62828', '#1B5E20', '#FF8F00'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: Math.max(result.negativePoints + 2, 15)
        }
      }
    }
  });
}

function showRecommendations(result, nutrition) {
  const recommendations = document.getElementById('recommendations');
  let html = '<h3>Recommendations:</h3><ul style="text-align: left;">';
  
  if (result.grade === 'E' || result.grade === 'D') {
    if (nutrition.saturatedFat > 5) {
      html += '<li>Reduce saturated fat content</li>';
    }
    if (nutrition.sugar > 15) {
      html += '<li>Lower sugar content</li>';
    }
    if (nutrition.salt > 1.5) {
      html += '<li>Reduce salt/sodium levels</li>';
    }
    if (nutrition.fiber < 3) {
      html += '<li>Increase fiber content</li>';
    }
  } else if (result.grade === 'C') {
    html += '<li>Good choice! Consider products with more fiber or protein for even better nutrition.</li>';
  } else {
    html += '<li>Excellent choice! This product has good nutritional balance.</li>';
  }
  
  html += '</ul>';
  recommendations.innerHTML = html;
}
