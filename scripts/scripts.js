// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, onValue, push, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

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
  relags: 0,
  dreamer: 0
};

function fetchGoals() {
  const goalsRef = ref(database, '/goals');
  onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
          document.getElementById('relags-goal').textContent = data.relags;
          document.getElementById('dreamer-goal').textContent = data.dreamer;
      }
  });
}


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
  const today = dayjs();
  const dateString = today.format(' -MMM M, H:mm');

  const participant = document.getElementById('participant').value;
  const progressInput = document.getElementById('progress-input').value;
  const commentInput = (document.getElementById('comment-input').value) + dateString;

  if (progressInput >= 0 && progressInput <= 100) {
    const progressRef = ref(database, '/progress');
    get(progressRef).then((snapshot) => {
      const currentProgress = snapshot.val() || {}; // Use existing data or an empty object if none exists
      currentProgress[participant] = parseInt(progressInput); // Update the specific participant's progress

      set(progressRef, currentProgress) // Write back the updated progress to Firebase
        .then(() => {
          document.getElementById('history-log').innerHTML = '';
          addHistoryLog(participant, progressInput, commentInput); // Log the change after successful update
        })
        .catch((error) => {
          console.error('Failed to update progress:', error);
        });
    }).catch((error) => {
      console.error('Failed to fetch current progress:', error);
    });
  } else {
    alert('Please enter a valid progress percentage between 0 and 100.');
  }
}



document.addEventListener('DOMContentLoaded', () => {
  const logButton = document.getElementById('logButton'); // Ensure your button has an id="logButton"
  if (logButton) {
    logButton.addEventListener('click', () => {
      logProgress();
    });
  }
});

// Example function to update goals
function updateGoals() {
  const relagsGoal = document.getElementById('relags-goal');
  const dreamerGoal = document.getElementById('dreamer-goal');

  // Set goal titles
  relagsGoal.textContent = "Build a Web App";  // Example goal for Relags
  dreamerGoal.textContent = "Complete Portfolio";  // Example goal for Dreamer
}

// Call this function on page load or after fetching data
updateGoals();


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

}

// Fetch history from Firebase
function fetchHistory() {
  const historyLog = document.getElementById('history-log');
  historyLog.innerHTML = ''; // Clear previous logs before fetching and displaying new ones

  const historyRef = ref(database, '/history');
  onValue(historyRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const logEntry = document.createElement('p');
      logEntry.textContent = `${data.participant.charAt(0).toUpperCase() + data.participant.slice(1)} logged progress: ${data.progress}% - ${data.comment}`;
      historyLog.appendChild(logEntry);
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

document.addEventListener('DOMContentLoaded', function() {
  // Event listener for setting the goal for Relags
  document.getElementById('set-relags-goal').addEventListener('click', function() {
    const goal = document.getElementById('relags-goal-input').value;
    setGoal('relags', goal);
  });

  // Event listener for setting the goal for Dreamer
  document.getElementById('set-dreamer-goal').addEventListener('click', function() {
    const goal = document.getElementById('dreamer-goal-input').value;
    setGoal('dreamer', goal);
  });
});

function setGoal(participant, goal) {
  const goalRef = ref(database, `/goals/${participant}`);
  set(goalRef, goal).then(() => {
      document.getElementById(`${participant}-goal`).textContent = goal;
  }).catch((error) => {
      console.error('Error updating goal:', error);
  });
}



// Initialization functions
function initialize() {
  updateProgress();
  fetchHistory();
  displayMilestones();
  updateLeaderboard();
  fetchGoals();
}

initialize();
