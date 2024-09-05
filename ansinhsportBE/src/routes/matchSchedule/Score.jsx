import { useEffect, useState } from "react";

const Score = ({ data, onScoreChange, isEditable }) => {
  const [firstScore, setFirstScore] = useState(data.FirstTeamPoint);
  const [secondScore, setSecondScore] = useState(data.SecondTeamPoint);
  // Handle changes for First Team's score
  const handleFirstScoreChange = (e) => {
    const newScore = e.target.value;
    setFirstScore(newScore);
    onScoreChange(data.Id, "FirstTeamPoint", newScore);
  };

  // Handle changes for Second Team's score
  const handleSecondScoreChange = (e) => {
    const newScore = e.target.value;
    setSecondScore(newScore);
    onScoreChange(data.Id, "SecondTeamPoint", newScore);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        defaultValue={firstScore}
        onChange={handleFirstScoreChange}
        style={{ width: "70px", textAlign: "center" }}
        readOnly={!isEditable}
      />
      <span> - </span>
      <input
        type="text"
        defaultValue={secondScore}
        onChange={handleSecondScoreChange}
        style={{ width: "70px", textAlign: "center" }}
        readOnly={!isEditable}
      />
    </div>
  );
};
export default Score;
