export default function wipeLocalStorage() {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("fairInfo");
  localStorage.removeItem("projectsList");
  localStorage.removeItem("projectsListLastUpdated");
  localStorage.removeItem("evaluatorsList");
  localStorage.removeItem("evaluatorsListLastUpdated");
  localStorage.removeItem("evaluator");
  localStorage.removeItem("ranking");
  localStorage.removeItem("rankingLastUpdated");
  localStorage.removeItem("fairQuestions");
}
