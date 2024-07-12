// scripts/scripts.js

// Sample progress data
const progressData = {
  relags: 25,
  dreamer: 26
};

// Reference to the Firebase Realtime Database
const database = firebase.database();

// Update progress data from Firebase
function updateProgress() {
  database.ref('/progress').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
          progressData.relags = data.relags || 0;
          progressData.dreamer = data.dreamer || 0;
      }

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
  });
}

// Log progress to Firebase
function logProgress() {
  const participant = document.getElementById('participant').value;
  const progressInput = document.getElementById('progress-input').value;
  const commentInput = document.getElementById('comment-input').value;

  if (progressInput >= 0 && progressInput <= 100) {
      progressData[participant] = parseInt(progressInput);
      database.ref('/progress').set(progressData);
      addHistoryLog(participant, progressInput, commentInput);
  } else {
      alert('Please enter a valid progress percentage between 0 and 100.');
  }
}

// Add history log to Firebase
function addHistoryLog(participant, progress, comment) {
  const historyRef = database.ref('/history').push();
  historyRef.set({
      participant: participant,
      progress: progress,
      comment: comment,
      timestamp: Date.now()
  });

  const historyLog = document.getElementById('history-log');
  const logEntry = document.createElement('p');
  logEntry.textContent = `${participant.charAt(0).toUpperCase() + participant.slice(1)} logged progress: ${progress}% - ${comment}`;
  historyLog.appendChild(logEntry);
}

// Fetch history from Firebase
function fetchHistory() {
  const historyLog = document.getElementById('history-log');
  database.ref('/history').on('child_added', (snapshot) => {
      const data = snapshot.val();
      const logEntry = document.createElement('p');
      logEntry.textContent = `${data.participant.charAt(0).toUpperCase() + data.participant.slice(1)} logged progress: ${data.progress}% - ${data.comment}`;
      historyLog.appendChild(logEntry);
  });
}

// Adding and displaying milestones
function addMilestone() {
  const milestoneInput = document.getElementById('milestone-input').value;
  const milestoneRef = database.ref('/milestones').push();
  milestoneRef.set({description: milestoneInput});
  document.getElementById('milestone-input').value = ''; // Clear input
}

function displayMilestones() {
  const milestonesList = document.getElementById('milestone-list');
  database.ref('/milestones').on('child_added', (snapshot) => {
      const data = snapshot.val();
      const milestoneEntry = document.createElement('li');
      milestoneEntry.textContent = data.description;
      milestonesList.appendChild(milestoneEntry);
  });
}

// Updating and displaying the leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  database.ref('/progress').on('value', (snapshot) => {
      const data = snapshot.val();
      leaderboardList.innerHTML = `
          <tr>
              <th>Participant</th>
              <th>Progress (%)</th>
          </tr>`; // Reset leaderboard HTML
      Object.keys(data).forEach(participant => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${participant.charAt(0).toUpperCase() + participant.slice(1)}</td><td>${data[participant]}%</td>`;
          leaderboardList.appendChild(row);
      });
  });
}

// Initialization functions
function initialize() {
  updateProgress();
  fetchHistory();
  displayMilestones();
  updateLeaderboard();
}

initialize();
