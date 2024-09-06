import { useCallback, useState } from "react";
import { debounce } from "../../feature/hook";
const Score = ({ data, onScoreChange }) => {
  const [firstScore, setFirstScore] = useState(data.FirstTeamPoint);
  const [secondScore, setSecondScore] = useState(data.SecondTeamPoint);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnScoreChange = useCallback(
    debounce((id, field, value) => {
      onScoreChange(id, field, value);
    }, 500),
    [onScoreChange]
  );
  // Handle changes for First Team's score
  const handleFirstScoreChange = (e) => {
    const newScore = e.target.value;
    setFirstScore(newScore);
    debouncedOnScoreChange(data.Id, "FirstTeamPoint", newScore);
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
      />
      <span> - </span>
      <input
        type="text"
        defaultValue={secondScore}
        onChange={handleSecondScoreChange}
        style={{ width: "70px", textAlign: "center" }}
      />
    </div>
  );
};
export default Score;
