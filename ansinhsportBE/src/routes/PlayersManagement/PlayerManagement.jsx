import React, { useCallback, useState, useEffect } from "react";
import Button from "devextreme-react/button";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired

import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
} from "devextreme-react/data-grid";
import { employees, states } from "./data.ts";
import { useDispatch } from "react-redux";

const PlayersManagement = () => {
  const [events, setEvents] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();
  const leaguageId = localStorage.getItem("leaguageId");
  // useEffect(() => {
  //   const fetchData = async (leaguageId) => {
  //     // const ret = await dispatch(getall(leaguageId));
  //     if (ret.type === "stadium/getAllStadium/fulfilled") {
  //       const mutableData = ret?.payload?.data.map((item) => _.cloneDeep(item));
  //       setDataSource(mutableData);
  //     } else {
  //       toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
  //     }
  //     console.log(ret);
  //   };
  //   const leaguageId = localStorage.getItem("leaguageId");
  //   if (leaguageId && leaguageId > 0) {
  //     fetchData(leaguageId);
  //   } else {
  //     toast.error("Bạn chưa chọn giải đấu");
  //   }
  // }, []);
  const logEvent = useCallback((eventName) => {
    setEvents((previousEvents) => [eventName, ...previousEvents]);
  }, []);
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  return (
    <React.Fragment>
      <div className="text-center">
        {" "}
        <span>
          <b>Danh sách vận động viên tham gia giải đấu</b>
        </span>
      </div>
      <DataGrid
        id="gridContainer"
        dataSource={employees}
        keyExpr="ID"
        allowColumnReordering={true}
        showBorders={true}
        onEditingStart={() => logEvent("EditingStart")}
        onInitNewRow={() => logEvent("InitNewRow")}
        onRowInserting={() => logEvent("RowInserting")}
        onRowInserted={() => logEvent("RowInserted")}
        onRowUpdating={() => logEvent("RowUpdating")}
        onRowUpdated={() => logEvent("RowUpdated")}
        onRowRemoving={() => logEvent("RowRemoving")}
        onRowRemoved={() => logEvent("RowRemoved")}
        onSaving={() => logEvent("Saving")}
        onSaved={() => logEvent("Saved")}
        onEditCanceling={() => logEvent("EditCanceling")}
        onEditCanceled={() => logEvent("EditCanceled")}
      >
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />

        <Column dataField="Prefix" caption="Giới tính" />
        <Column dataField="FirstName" caption={"Họ và tên"} />
        <Column dataField="LastName" caption={"Đang đấu"} />
        <Column dataField="Position" width={130} caption={"Địa chỉ"} />
        <Column dataField="StateID" caption="Đội" width={125}>
          <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
        </Column>
        <Column
          dataField="BirthDate"
          width={125}
          dataType="date"
          caption={"Ngày đăng ký"}
        />
      </DataGrid>

      <div id="events">
        <div>
          <div className="caption">Fired events</div>
          <Button id="clear" text="Clear" onClick={clearEvents} />
        </div>
        <ul>
          {events.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};
export default PlayersManagement;
