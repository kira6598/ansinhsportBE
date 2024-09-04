export default function LeaguageItem(item) {
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center">
        <img
          height={100}
          alt={item.LeaguageName}
          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmvJsQsw2QHHPQekogiOtX0FlwBfUWIWPYbw&s`}
        />
        <div className="text-center" style={{ marginLeft: "25%" }}>
          <b>{item.LeaguageName}</b>
        </div>
      </div>

      <div className="price">{item.StartDate}</div>
    </div>
  );
}
