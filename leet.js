document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");

  const usernameInput = document.getElementById("user-input");

  const statsContainer = document.querySelector(".stats-container");

  const easyProgressCircle = document.querySelector(".easy-progress");

  const mediumProgressCircle = document.querySelector(".medium-progress");

  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  //  this function return us true or false value based on rehular expression
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    const regex = /^[A-Za-z0-9_\s'-]+$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      // statsContainer.classList.add("hidden");

      const response = await fetch(
        `https://leetcode-stats-api.herokuapp.com/${username}`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      // display user data on UI
      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = `<p>${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateprogress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy;
    const totalMediumQues = parsedData.totalMedium;
    const totalHardQues = parsedData.totalHard;

    const solvedTotalQues = parsedData.totalSolved;
    const solvedTotalEasyQues = parsedData.easySolved;
    const solvedTotalMediumQues = parsedData.mediumSolved;
    const solvedTotalHardQues = parsedData.hardSolved;

    updateprogress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );

    updateprogress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );

    updateprogress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );

    // cart data
    const cardData = [
      {
        label: "Overall Submission",
        value: parsedData.totalSolved,
        color: "#007bff",
        icon: "fas fa-user-check",
      },
      {
        label: "Overall Easy Submission",
        value: parsedData.totalEasy,
        color: "#007bff",
        icon: "fas fa-user-check",
      },
      {
        label: "Overall Medium Submission",
        value: parsedData.totalMedium,
        color: "#007bff",
        icon: "fas fa-user-check",
      },
      {
        label: "Overall Hard Medium Submission",
        value: parsedData.totalHard,
        color: "#007bff",
        icon: "fas fa-user-check",
      },
    ];
    console.log("Card ka data", cardData);

    cardStatsContainer.innerHTML = cardData
      .map(
        (data) =>
          `
      <div class="card">
      <h4>${data.label}</h4>
      <p>${data.value}</p>
      </div>
      `
      )
      .join("");
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;

    console.log("username value", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
