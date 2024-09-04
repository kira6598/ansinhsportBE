import React, { useState } from "react";

import { List } from "devextreme-react/list";
import { products } from "./products";
import StadiumPopup from "../../feature/PopUp/StadiumPopup.jsx";

const LeaguageManagement = () => {
  const [isShow, setIsShow] = useState(false);
  const [currentLeaguageId, setCurrentLeaguageId] = useState(0);
  const [isCreateNew, setIsCreateNew] = useState(false);
  const handleItemClick = (e) => {
    const itemId = e.itemData.ID;
    setCurrentLeaguageId(itemId);
    setIsShow(true);
    setIsCreateNew(false);
  };
  const handleClosePopup = () => {
    setIsShow(false); // Hide the popup when closed
  };
  const handleAddItem = () => {
    setIsCreateNew(true);
    setIsShow(true);
  };
  return (
    <React.Fragment>
      <div className="text-center">
        <b>DANH SÁCH GIẢI ĐẤU</b>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleAddItem}>Thêm giải đấu</button>
      </div>
      <List
        id="list"
        dataSource={products}
        displayExpr="Name"
        onItemClick={handleItemClick}
      ></List>

      <StadiumPopup
        isShow={isShow}
        LeaguageId={currentLeaguageId}
        isCreateNew={isCreateNew}
        onClose={handleClosePopup}
      />
    </React.Fragment>
  );
};
export default LeaguageManagement;
