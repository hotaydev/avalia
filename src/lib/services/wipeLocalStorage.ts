export default function wipeLocalStorage() {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("fairInfo");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("projectsList");
  localStorage.removeItem("projectsListLastUpdated");
  localStorage.removeItem("evaluatorsList");
  localStorage.removeItem("evaluatorsListLastUpdated");
  localStorage.removeItem("evaluatorCode"); // Evaluator login code
}
