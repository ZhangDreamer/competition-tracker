// scripts/scripts.js

// Sample progress data
const progressData = {
  relags: 25,
  dreamer: 26
};

function updateProgress() {
  // Get progress elements
  const relagsProgress = document.getElementById('relags-progress');
  const dreamerProgress = document.getElementById('dreamer-progress');
  const relagsPercentage = document.getElementById('relags-percentage');
  const dreamerPercentage = document.getElementById('dreamer-percentage');

  // Update progress bars
  relagsProgress.style.width = progressData.relags + '%';
  dreamerProgress.style.width = progressData.dreamer + '%';

  // Update percentage text
  relagsPercentage.textContent = progressData.relags + '%';
  dreamerPercentage.textContent = progressData.dreamer + '%';
}

function logProgress() {
  const participant = document.getElementById('participant').value;
  const progressInput = document.getElementById('progress-input').value;
  const commentInput = document.getElementById('comment-input').value;

  if (progressInput >= 0 && progressInput <= 100) {
      progressData[participant] = progressInput;
      updateProgress();
      addHistoryLog(participant, progressInput, commentInput);
  } else {
      alert('Please enter a valid progress percentage between 0 and 100.');
  }
}

function addHistoryLog(participant, progress, comment) {
  const historyLog = document.getElementById('history-log');
  const logEntry = document.createElement('p');
  logEntry.textContent = `${participant.charAt(0).toUpperCase() + participant.slice(1)} logged progress: ${progress}% - ${comment}`;
  historyLog.appendChild(logEntry);
}

// Initial update
updateProgress();
