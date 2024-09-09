import React, { useState, useEffect } from "react";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired
import _ from "lodash";
import { toast } from "react-toastify";

import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
} from "devextreme-react/data-grid";
// import { employees, states } from "./data.ts";
import { useDispatch } from "react-redux";
import {
  addPlayer,
  deletePlayerFn,
  getAllPlayers,
  updatePlayer,
} from "../../feature/Player/PlayerAPI.js";
import { convertToUTC } from "../StadiumManagement/StadiumManagement.jsx";
const Gender = [
  { Id: 0, Name: "Nam" },
  { Id: 1, Name: "Nữ" },
];
const Status = [
  { Id: 0, Name: "Chưa thi đấu" },
  { Id: 1, Name: "Đã thi đấu" },
];
const PlayersManagement = () => {
  // const [events, setEvents] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();
  const leaguageId = localStorage.getItem("leaguageId");
  const [selectedImage, setSelectedImage] = useState(null);
  const ligoHost = import.meta.env.VITE_HOST;

  const handleImageChange = (e, data) => {
    const file = e.target.files[0];
    if (file) {
      // Set selected image for rendering in UI or API call
      setSelectedImage(file);
      // Handle file upload to the server using API
      // uploadImageToAPI(file, data);
    }
  };
  useEffect(() => {
    console.log(selectedImage);
  }, [selectedImage]);
  useEffect(() => {
    const fetchData = async (leaguageId) => {
      const ret = await dispatch(getAllPlayers(leaguageId));
      if (ret.type === "Player/GetAllPlayers/fulfilled") {
        const mutableData = ret?.payload?.data.map((item) => _.cloneDeep(item));
        setDataSource(mutableData);
      } else {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
      }
    };
    const leaguageId = localStorage.getItem("leaguageId");
    if (leaguageId && leaguageId > 0) {
      fetchData(leaguageId);
    } else {
      toast.error("Bạn chưa chọn giải đấu");
    }
  }, []);
  // const logEvent = useCallback((eventName) => {
  //   setEvents((previousEvents) => [eventName, ...previousEvents]);
  // }, []);
  // const clearEvents = useCallback(() => {
  //   setEvents([]);
  // }, []);

  const addOrUpdatePlayerAsync = async (payload, isAddPlayer) => {
    if (isAddPlayer) {
      var ret = await dispatch(addPlayer(payload));
      if (ret.type === "Player/addPlayer/fulfilled") {
        toast.success("Thêm vận động viên thành công!", { theme: "colored" });
      } else {
        toast.error(
          "Có lỗi xảy ra khi thêm vận động viên, vui lòng liên hệ bộ phận kỹ thuật",
          { theme: "colored" }
        );
      }
    } else {
      var ret2 = await dispatch(updatePlayer(payload));
      if (ret2.type === "Player/updatePlayer/fulfilled") {
        toast.success("Cập nhật vận động viên thành công!", {
          theme: "colored",
        });
      } else {
        toast.error(
          "Có lỗi xảy ra khi cập nhật vận động viên, vui lòng liên hệ bộ phận kỹ thuật",
          { theme: "colored" }
        );
      }
    }
  };

  // const onRowInserted = (e) => {
  //   logEvent("RowInserted");
  //   console.log(e);
  //   if (leaguageId && leaguageId > 0) {
  //     const payload = {
  //       LeaguageId:parseInt(leaguageId),
  //       Address:e.data.Address ,
  //       FullName: e.data.FullName,
  //       Gender: e.data.Gender,
  //       Status: e.data.Status,
  //       RegisterDate: convertToUTC(e.data.RegisterDate),
  //       Team:e.data.Team
  //     };
  //     console.log(payload);

  //     addOrUpdatePlayerAsync(payload, true);
  //   } else {
  //     toast.error("Vui lòng chọn giải đấu để tiếp tục");
  //     return;
  //   }
  // };
  const onEditingStart = (e) => {
    e.data = _.cloneDeep(e.data);
  };

  const onRowUpdating = (e) => {
    const oldData = _.cloneDeep(e.oldData);
    const newData = _.cloneDeep(e.newData);

    // Merge old data with new data
    e.newData = { ...oldData, ...newData };
  };
  const onRowUpdated = (e) => {
    const updatedRow = e.data;

    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.Id === updatedRow.Id ? { ...updatedRow } : item
      )
    );
  };
  const onSaved = (e) => {
    if (leaguageId && leaguageId > 0) {
      const change = e.changes;
      const formData = new FormData();
      if (selectedImage != null) {
        formData.append("Capture", selectedImage);
      }
      console.log(change);

      if (Array.isArray(change) && change.length > 0) {
        const datas = e.changes[0].data;

        if (Number.isInteger(datas.Id)) {
          // update
          // const payload = {
          //   Id: datas.Id,
          //   LeaguageId: parseInt(leaguageId),
          //   Address: datas.Address,
          //   FullName: datas.FullName,
          //   Gender: datas.Gender,
          //   Status: datas.Status,
          //   RegisterDate: convertToUTC(datas.RegisterDate),
          //   Team: datas.Team,
          // };
          formData.append("Id", datas.Id);
          formData.append("LeaguageId", parseInt(leaguageId));
          formData.append("Address", datas.Address);
          formData.append("FullName", datas.FullName);
          formData.append("Status", datas.Gender);
          formData.append("RegisterDate", convertToUTC(datas.RegisterDate));
          formData.append("Team", datas.Team);
          addOrUpdatePlayerAsync(formData, false);
        } else {
          // add new
          // const payload = {
          //   LeaguageId: parseInt(leaguageId),
          //   Address: datas.Address,
          //   FullName: datas.FullName,
          //   Gender: datas.Gender,
          //   Status: datas.Status,
          //   RegisterDate: convertToUTC(datas.RegisterDate),
          //   Team: datas.Team,
          // };
          // formData.append('Id',datas.Id);
          formData.append("LeaguageId", parseInt(leaguageId));
          formData.append("Address", datas.Address);
          formData.append("FullName", datas.FullName);
          formData.append("Status", datas.Gender);
          formData.append("RegisterDate", convertToUTC(datas.RegisterDate));
          formData.append("Team", datas.Team);
          addOrUpdatePlayerAsync(formData, true);
        }
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật.", { theme: "colored" });
      }
    } else {
      toast.error("Vui lòng chọn giải đấu để tiếp tục", { theme: "colored" });
      return;
    }
  };
  const deleteAsync = async (id) => {
    const ret = await dispatch(deletePlayerFn(id));
    if (ret.type === "Player/deletePlayer/fulfilled") {
      toast.success("Xóa vận động viên thành công", { theme: "colored" });
    } else {
      toast.error("Xóa vận động viên thất bại", { theme: "colored" });
    }
  };
  const onRowRemoved = (e) => {
    console.log(e.data.Id);
    deleteAsync(e.data.Id);
    // dispatch(deleteStadiums(e.data.Id))
  };
  function onCellPrepared(e) {
    if (e.rowType == "header") {
      e.cellElement.style.textAlign = "center";
      e.cellElement.style.fontWeight = "500";
      e.cellElement.style.color = "black";
    }
  }
  return (
    <React.Fragment>
      <div className="text-center">
        {" "}
        <span>
          <b>Danh sách vận động viên tham gia giải đấu</b>
        </span>
      </div>
      <DataGrid
        id="Id"
        dataSource={dataSource}
        keyExpr="Id"
        allowColumnReordering={true}
        showBorders={true}
        // onRowInserted={onRowInserted}
        onRowUpdated={onRowUpdated}
        onRowRemoved={onRowRemoved}
        onEditingStart={onEditingStart}
        onRowUpdating={onRowUpdating}
        onSaved={onSaved}
        onCellPrepared={onCellPrepared}
      >
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
          useIcons
        />

        <Column dataField="Gender" caption="Giới tính">
          <Lookup dataSource={Gender} valueExpr={"Id"} displayExpr={"Name"} />
        </Column>
        <Column
          dataField="ImageUrl"
          caption="Ảnh đại diện"
          editCellComponent={({ data }) => (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, data)}
                color="red"
              />
              {selectedImage && (
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected Avatar"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              )}
            </div>
          )}
          cellRender={({ data }) =>
            data.ImageUrl ? (
              <img
                src={`${ligoHost}/${data.ImageUrl}`}
                alt="Avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <img
                src={`https://media.istockphoto.com/id/1498453978/vi/vec-to/logo-pickleball-v%E1%BB%9Bi-v%E1%BB%A3t-ch%C3%A9o-v%C3%A0-b%C3%B3ng-ph%C3%ADa-tr%C3%AAn-ch%C3%BAng.jpg?s=2048x2048&w=is&k=20&c=O0OrAU257oDl0f2s9gnWRglgL8vw6F0tiIn03dHmRgs=`}
                alt="Avatar"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )
          }
        />
        <Column dataField="FullName" caption={"Họ và tên"} />
        <Column dataField="Status" caption={"Đang đấu"}>
          <Lookup dataSource={Status} valueExpr={"Id"} displayExpr={"Name"} />
        </Column>
        <Column dataField="Address" width={130} caption={"Địa chỉ"} />
        <Column dataField="Team" caption="Tên đội">
          {/* <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" /> */}
        </Column>
        <Column
          dataField="RegisterDate"
          width={125}
          dataType="date"
          caption={"Ngày đăng ký"}
        />
      </DataGrid>
    </React.Fragment>
  );
};
export default PlayersManagement;
