import React, { useEffect, useState, useCallback } from "react";

import { List } from "devextreme-react/list";
import StadiumPopup from "../../Popup/PopUp/LeaguagePopup.jsx";
import { useDispatch } from "react-redux";
import { getAllLeaguage } from "../../feature/Leaguage/LeaguageAPI.js";
import LeaguageItem from "./LeaguageItem.jsx";
import { toast } from "react-toastify";
const LeaguageManagement = () => {
    const [isShow, setIsShow] = useState(false);
    const [currentLeaguageId, setCurrentLeaguageId] = useState(0);
    const [isCreateNew, setIsCreateNew] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [selectionMode, setSelectionMode] = useState("all");
    const [selectByClick, setSelectByClick] = useState(false);
    const [selectedItemKeys, setSelectedItemKeys] = useState([]);

    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            const ret = await dispatch(getAllLeaguage());
            console.log(ret);
            if (ret.type === "Leaguage/getAllLeaguage/fulfilled") {
                setDataSource(ret?.payload?.data);
            }
        };
        fetchData();
    }, []);
    const handleItemClick = (e) => {
        const itemId = e.itemData.Id;
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
    const handleSelectItem = () => {
        if (selectedItemKeys.length > 0) {
            localStorage.setItem("leaguageId", selectedItemKeys[0].Id);
            localStorage.setItem("leaguageName", selectedItemKeys[0].LeaguageName);
            toast.success("Chọn giải đấu thành công", { theme: "colored" });
        } else {
            toast.error("Chưa có giải đấu nào được chọn", { theme: "colored" });
        }
    };

    const onSelectedItemKeysChange = useCallback(
        ({ name, value }) => {
            if (name === "selectedItemKeys") {
                if (selectionMode !== "none" || selectedItemKeys.length !== 0) {
                    setSelectedItemKeys(value);
                }
            }
        },
        [selectionMode, selectedItemKeys, setSelectedItemKeys]
    );
    return (
        <React.Fragment>
            <div className="d-flex align-items-center flex-column">
                <div>
                    <b>DANH SÁCH GIẢI ĐẤU</b>
                </div>
                <div>
                    <span>
                        Giải đấu hiện tại:
                        <i>
                            {" "}
                            {localStorage.getItem("leaguageName") !== null
                                ? localStorage.getItem("leaguageName")
                                : "Chưa chọn"}
                        </i>
                    </span>
                </div>
            </div>
            <div className="d-flex justify-content-between  my-2">
                <button onClick={handleSelectItem} className="primary">
                    Chọn giải đấu
                </button>
                <button onClick={handleAddItem}>Thêm giải đấu</button>
            </div>
            <List
                id="Id"
                dataSource={dataSource}
                displayExpr="LeaguageName"
                onItemClick={handleItemClick}
                itemRender={LeaguageItem}
                showSelectionControls={true}
                selectAllMode={"allPages"}
                selectedItemKeys={selectedItemKeys}
                selectByClick={selectByClick}
                selectionMode={"single"}
                onOptionChanged={onSelectedItemKeysChange}
            ></List>

            {isShow && (
                <StadiumPopup
                    isShow={isShow}
                    LeaguageId={currentLeaguageId}
                    isCreateNew={isCreateNew}
                    onClose={handleClosePopup}
                />
            )}
        </React.Fragment>
    );
};
export default LeaguageManagement;
