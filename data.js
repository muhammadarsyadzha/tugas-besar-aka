const courses = [
  { name: "Teori Peluang", sks: 3, benefit: 5 },
  { name: "Analisis Kompleksitas Algoritma", sks: 2, benefit: 3 },
  { name: "Teori Bahasa dan Automata", sks: 2, benefit: 3 },
  { name: "Struktur Data", sks: 4, benefit: 7 },
  { name: "Sistem Operasi", sks: 3, benefit: 5 },
  { name: "Sistem Basis Data", sks: 3, benefit: 5 },
  { name: "Matematika Diskrit", sks: 2, benefit: 3 },
  { name: "Algoritma Pemograman", sks: 3, benefit: 5 },
  { name: "Bahasa Inggris", sks: 2, benefit: 3 },
  { name: "Bahasa Indonesia", sks: 2, benefit: 3 },
  { name: "Pemodelan Basis Data", sks: 3, benefit: 5 },
  { name: "Kalkulus Lanjut", sks: 3, benefit: 5 },
];

const sksLimit = 24;
const coursesList = document.getElementById("courses-list");
const totalSksElem = document.getElementById("total-sks");
const autoSelectBtn = document.getElementById("auto-select-btn");
const uncheckAllBtn = document.getElementById("uncheck-all-btn");
const submitBtn = document.getElementById("submit-btn");

let selectedSks = 0;

function renderCourses() {
  coursesList.innerHTML = "";
  courses.forEach((course, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
              <td><input type="checkbox" class="course-checkbox" data-index="${index}" /></td>
              <td>${course.name}</td>
              <td>${course.sks}</td>
              <td>${course.benefit}</td>
          `;
    coursesList.appendChild(row);
  });
}

function updateTotalSks() {
  totalSksElem.textContent = `Total SKS: ${selectedSks}/${sksLimit}`;
}

function handleCheckboxChange() {
  const checkboxes = document.querySelectorAll(".course-checkbox");
  selectedSks = 0;

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      selectedSks += courses[index].sks;
    }
  });

  checkboxes.forEach((checkbox, index) => {
    if (!checkbox.checked && selectedSks + courses[index].sks > sksLimit) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });

  updateTotalSks();
}

function knapsackRecursive(courses, n, sksLimit) {
  if (n === 0 || sksLimit === 0) {
    return 0;
  }

  if (courses[n - 1].sks > sksLimit) {
    return knapsackRecursive(courses, n - 1, sksLimit);
  }

  const include =
    courses[n - 1].benefit +
    knapsackRecursive(courses, n - 1, sksLimit - courses[n - 1].sks);
  const exclude = knapsackRecursive(courses, n - 1, sksLimit);
  return Math.max(include, exclude);
}

function getSelectedCoursesRecursive(courses, sksLimit) {
  const n = courses.length;
  const selectedCourses = [];

  let maxBenefit = knapsackRecursive(courses, n, sksLimit);

  let w = sksLimit;
  for (let i = n; i > 0 && w > 0; i--) {
    if (maxBenefit !== knapsackRecursive(courses, i - 1, w)) {
      selectedCourses.push(courses[i - 1]);
      w -= courses[i - 1].sks;
      maxBenefit -= courses[i - 1].benefit;
    }
  }

  return selectedCourses.reverse();
}

function autoSelectWithKnapsack() {
  const selectedCourses = getSelectedCoursesRecursive(courses, sksLimit);
  selectedSks = selectedCourses.reduce((sum, course) => sum + course.sks, 0);

  document
    .querySelectorAll(".course-checkbox")
    .forEach((checkbox) => (checkbox.checked = false));

  selectedCourses.forEach((course) => {
    document.querySelector(
      `.course-checkbox[data-index="${courses.indexOf(course)}"]`
    ).checked = true;
  });

  handleCheckboxChange();
}

function handleSubmit() {
  const selectedCourses = [];
  document.querySelectorAll(".course-checkbox:checked").forEach((checkbox) => {
    const index = checkbox.dataset.index;
    selectedCourses.push(courses[index]);
  });

  const resultContainer = document.getElementById("selected-courses-list");
  resultContainer.innerHTML = "";

  if (selectedCourses.length === 0) {
    resultContainer.innerHTML = "<li>Tidak ada mata kuliah yang dipilih.</li>";
  } else {
    selectedCourses.forEach((course) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${course.name} (SKS: ${course.sks}, Benefit: ${course.benefit})`;
      resultContainer.appendChild(listItem);
    });
  }
}

function uncheckAll() {
  document.querySelectorAll(".course-checkbox").forEach((checkbox) => {
    checkbox.checked = false;
  });
  selectedSks = 0;
  updateTotalSks();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCourses();
  updateTotalSks();

  document
    .querySelectorAll(".course-checkbox")
    .forEach((checkbox) =>
      checkbox.addEventListener("change", handleCheckboxChange)
    );

  autoSelectBtn.addEventListener("click", autoSelectWithKnapsack);
  submitBtn.addEventListener("click", handleSubmit);
  uncheckAllBtn.addEventListener("click", uncheckAll);
});
