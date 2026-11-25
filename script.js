// 브라우저 저장소(localStorage)에 사용할 키 이름
const THEME_STORAGE_KEY = "profile-theme";
const GOALS_STORAGE_KEY = "profile-goals";

// 상단 타자기 인사말 문구와 출력 속도(밀리초)
const GREETING_MESSAGE = "안녕하세요! 이정욱의 자기소개 페이지에 오신 걸 환영합니다 👋";
const TYPING_SPEED_MS = 70;

// 화면에서 조작할 HTML 요소들 가져오기
const typingTextElement = document.getElementById("typingText");
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const interestCards = document.querySelectorAll(".interest-card");
const goalCheckboxes = document.querySelectorAll(".goal-checkbox");
const goalProgressBadge = document.getElementById("goalProgress");

/**
 * localStorage에서 안전하게 값을 읽어옵니다.
 */
function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

/**
 * localStorage에 안전하게 값을 저장합니다.
 */
function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // 저장소 사용이 제한된 브라우저 환경에서는 오류 없이 넘어갑니다.
  }
}

/**
 * 페이지 맨 위 인사말을 타자 치듯 한 글자씩 출력합니다.
 */
function startTypingGreeting() {
  if (!typingTextElement) return;

  // 이모지가 깨지지 않도록 문자열을 글자 단위 배열로 나눕니다.
  const characters = Array.from(GREETING_MESSAGE);
  let currentIndex = 0;

  typingTextElement.textContent = "";

  function typeNextChar() {
    if (currentIndex >= characters.length) return;

    typingTextElement.textContent += characters[currentIndex];
    currentIndex += 1;
    setTimeout(typeNextChar, TYPING_SPEED_MS);
  }

  typeNextChar();
}

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
  const savedTheme = getStoredValue(THEME_STORAGE_KEY);
  applyTheme(savedTheme === "dark" ? "dark" : "light");
}

/**
 * 다크모드 전환 버튼 클릭 시 테마를 바꾸고 브라우저에 저장합니다.
 */
function handleThemeToggle() {
  const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
  const nextTheme = isCurrentlyDark ? "light" : "dark";
  applyTheme(nextTheme);
  setStoredValue(THEME_STORAGE_KEY, nextTheme);
}

/**
 * 관심 분야 카드를 클릭할 때 아래 설명이 펼쳐지거나 접히도록 설정합니다.
 */
function initInterestCards() {
  interestCards.forEach((card) => {
    const toggleBtn = card.querySelector(".card-toggle");
    const hintText = card.querySelector(".card-hint");

    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));

      if (hintText) {
        hintText.textContent = isOpen ? "접기" : "자세히 보기";
      }
    });
  });
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
  setStoredValue(GOALS_STORAGE_KEY, JSON.stringify(states));
}

/**
 * 저장된 목표 체크 상태가 있다면 페이지 열 때 복원합니다.
 */
function initGoals() {
  const savedData = getStoredValue(GOALS_STORAGE_KEY);

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
      try {
        localStorage.removeItem(GOALS_STORAGE_KEY);
      } catch (removeError) {
        // 무시
      }
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
initInterestCards();
initGoals();
startTypingGreeting();
