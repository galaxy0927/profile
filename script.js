// 브라우저 저장소(localStorage)에 사용할 키 이름
const THEME_STORAGE_KEY = "profile-theme";
const GOALS_STORAGE_KEY = "profile-goals";

// 화면에서 조작할 HTML 요소들 가져오기
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const goalCheckboxes = document.querySelectorAll(".goal-checkbox");
const goalProgressBadge = document.getElementById("goalProgress");

/**
 * 선택한 테마("light" 또는 "dark")를 화면에 적용합니다.
 */
function applyTheme(theme) {
  const isDark = theme === "dark";

  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "일반 모드";
    themeToggleBtn.setAttribute("aria-pressed", "true");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "다크 모드";
    themeToggleBtn.setAttribute("aria-pressed", "false");
  }
}

/**
 * 저장된 테마가 있으면 불러오고, 없으면 기본 일반 모드를 적용합니다.
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

/**
 * 다크모드 전환 버튼 클릭 시 테마를 바꾸고 브라우저에 저장합니다.
 */
function handleThemeToggle() {
  const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isCurrentlyDark ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

/**
 * 현재 체크된 목표 개수를 세어 진행률 배지를 갱신합니다.
 */
function updateGoalProgress() {
  const totalCount = goalCheckboxes.length;
  let checkedCount = 0;

  goalCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCount += 1;
    }
  });

  goalProgressBadge.textContent = `${checkedCount} / ${totalCount} 달성`;
}

/**
 * 각 목표의 체크 상태를 객체로 묶어 브라우저에 저장합니다.
 */
function saveGoalStates() {
  const states = {};
  goalCheckboxes.forEach((checkbox) => {
    states[checkbox.dataset.goalId] = checkbox.checked;
  });
  localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(states));
}

/**
 * 저장된 목표 체크 상태가 있다면 페이지 열 때 복원합니다.
 */
function initGoals() {
  const savedData = localStorage.getItem(GOALS_STORAGE_KEY);

  if (savedData) {
    try {
      const states = JSON.parse(savedData);
      goalCheckboxes.forEach((checkbox) => {
        const goalId = checkbox.dataset.goalId;
        if (typeof states[goalId] === "boolean") {
          checkbox.checked = states[goalId];
        }
      });
    } catch (error) {
      // 저장된 값이 깨져 있으면 기본 상태를 유지합니다.
      localStorage.removeItem(GOALS_STORAGE_KEY);
    }
  }

  updateGoalProgress();
}

// 이벤트 연결
themeToggleBtn.addEventListener("click", handleThemeToggle);

goalCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    updateGoalProgress();
    saveGoalStates();
  });
});

// 페이지 최초 실행 시 초기화
initTheme();
initGoals();
