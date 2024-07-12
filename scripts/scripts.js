// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSbg8KGS72_yYJLmSniy2pWCbFNMbRXLI",
  authDomain: "my-tracking-project-b74d5.firebaseapp.com",
  databaseURL: "https://my-tracking-project-b74d5-default-rtdb.firebaseio.com",
  projectId: "my-tracking-project-b74d5",
  storageBucket: "my-tracking-project-b74d5.appspot.com",
  messagingSenderId: "744592760906",
  appId: "1:744592760906:web:1a01c6d260e756b29846b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const progressData = {
  relags: 25,
  dreamer: 26
};

// Update progress data from Firebase
function updateProgress() {
  const progressRef = ref(database, '/progress');
  onValue(progressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
          const relagsProgress = document.getElementById('relags-progress');
          const dreamerProgress = document.getElementById('dreamer-progress');
          const relagsPercentage = document.getElementById('relags-percentage');
          const dreamerPercentage = document.getElementById('dreamer-percentage');

          relagsProgress.style.width = data.relags + '%';
          dreamerProgress.style.width = data.dreamer + '%';
          relagsPercentage.textContent = data.relags + '%';
          dreamerPercentage.textContent = data.dreamer + '%';
      }
  });
}

// Log progress to Firebase
function logProgress() {
  const participant = document.getElementById('participant').value;
  const progressInput = document.getElementById('progress-input').value;
  const commentInput = document.getElementById('comment-input').value;

  if (progressInput >= 0 && progressInput <= 100) {
    progressData[participant] = parseInt(progressInput);  // Update progressData with new input
    // Assuming 'database' is correctly initialized and available
    const progressRef = ref(database, '/progress');
    set(progressRef, progressData);  // Update Firebase database
    addHistoryLog(participant, progressInput, commentInput);  // Log the change
  } else {
    alert('Please enter a valid progress percentage between 0 and 100.');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const logButton = document.getElementById('logButton'); // Ensure your button has an id="logButton"
  if (logButton) {
    logButton.addEventListener('click', logProgress);
  }
});


// Add history log to Firebase
function addHistoryLog(participant, progress, comment) {
  const historyRef = ref(database, '/history');
  const newHistoryRef = push(historyRef);
  set(newHistoryRef, {
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
  const historyRef = ref(database, '/history');
  onValue(historyRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const logEntry = document.createElement('p');
        logEntry.textContent = `${data.participant.charAt(0).toUpperCase() + data.participant.slice(1)} logged progress: ${data.progress}% - ${data.comment}`;
        document.getElementById('history-log').appendChild(logEntry);
      });
  });
}

// Adding and displaying milestones
function addMilestone() {
  const milestoneInput = document.getElementById('milestone-input').value;
  const milestonesRef = ref(database, '/milestones');
  const newMilestoneRef = push(milestonesRef);
  set(newMilestoneRef, {description: milestoneInput});
  document.getElementById('milestone-input').value = ''; // Clear input
}

function displayMilestones() {
  const milestonesRef = ref(database, '/milestones');
  onValue(milestonesRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const milestoneEntry = document.createElement('li');
        milestoneEntry.textContent = data.description;
        document.getElementById('milestone-list').appendChild(milestoneEntry);
      });
  });
}

// Updating and displaying the leaderboard
function updateLeaderboard() {
  const leaderboardList = document.getElementById('leaderboard-list');
  const progressRef = ref(database, '/progress');
  onValue(progressRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === 'object') {  // Check if data exists and is an object
          leaderboardList.innerHTML = `<tr><th>Participant</th><th>Progress (%)</th></tr>`; // Reset leaderboard HTML
          Object.keys(data).forEach(participant => {
              const row = document.createElement('tr');
              row.innerHTML = `<td>${participant.charAt(0).toUpperCase() + participant.slice(1)}</td><td>${data[participant]}%</td>`;
              leaderboardList.appendChild(row);
          });
      } else {
          console.log('No data available at /progress');
          leaderboardList.innerHTML = `<tr><td colspan="2">No data available</td></tr>`; // Handle no data scenario
      }
  }, {
      onlyOnce: true,
      onError: (error) => console.error('Failed to read data', error)
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
