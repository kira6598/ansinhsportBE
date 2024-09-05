import React, { useCallback, useEffect, useState } from "react";
import Button from "devextreme-react/button";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired
import _ from "lodash";

import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
} from "devextreme-react/data-grid";
import { useDispatch } from "react-redux";
import {
  addStadium,
  deleteStadiums,
  getAllStadium,
  updateStadium,
} from "../../feature/Stadium/StadiumAPI.js";
import { toast } from "react-toastify";
const StadiumUseState = [
  { Id: 0, Name: "Chưa sử dụng" },
  { Id: 1, Name: "Đang sử dụng" },
];
const StadiumState = [
  { Id: 0, Name: "Chưa gọi" },
  { Id: 1, Name: "Đã gọi" },
  { Id: 2, Name: "Đã đặt" },
  { Id: 3, Name: "Hủy đặt" },
  { Id: 4, Name: "Đã chơi" },
];
export function convertToUTC(localTime) {
  let date = new Date(localTime);
  return date.toISOString(); // returns in UTC format
}
const App = () => {
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState([]);
  const leaguageId = localStorage.getItem("leaguageId");
  useEffect(() => {
    const fetchData = async (leaguageId) => {
      const ret = await dispatch(getAllStadium(leaguageId));
      if (ret.type === "stadium/getAllStadium/fulfilled") {
        const mutableData = ret?.payload?.data.map((item) => _.cloneDeep(item));
        setDataSource(mutableData);
      } else {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
      }
      console.log(ret);
    };
    const leaguageId = localStorage.getItem("leaguageId");
    if (leaguageId && leaguageId > 0) {
      fetchData(leaguageId);
    } else {
      toast.error("Bạn chưa chọn giải đấu");
    }
  }, []);

  const [events, setEvents] = useState([]);
  // const logEvent = useCallback((eventName) => {
  //   setEvents((previousEvents) => [eventName, ...previousEvents]);
  // }, []);
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  const addOrUpdateStadiumAsync = async (payload, isAddStadium) => {
    if (isAddStadium) {
      var ret = await dispatch(addStadium(payload));
      if (ret.type === "stadium/addStadium/fulfilled") {
        toast.success("Thêm sân thành công!", { theme: "colored" });
      } else {
        toast.error(
          "Có lỗi xảy ra khi thêm sân, vui lòng liên hệ bộ phận kỹ thuật",
          { theme: "colored" }
        );
      }
    } else {
      var ret2 = await dispatch(updateStadium(payload));
      if (ret2.type === "stadium/updateStadium/fulfilled") {
        toast.success("Cập nhật sân thành công!", { theme: "colored" });
      } else {
        toast.error(
          "Có lỗi xảy ra khi cập nhật sân, vui lòng liên hệ bộ phận kỹ thuật",
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
  //       LeaguageId: parseInt(leaguageId),
  //       MatchDate: convertToUTC(e.data.MatchDate),
  //       MatchName: e.data.MatchName,
  //       Name: e.data.StadiumName,
  //       Status: e.data.Status,
  //       StartDate: convertToUTC(e.data.StartDate),
  //     };
  //     console.log(payload);

  //     addOrUpdateStadiumAsync(payload, true);
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
      if (Array.isArray(change) && change.length == 0) {
        toast.info("Bạn chưa chỉnh sửa gì!", { theme: "colored" });
        return;
      }
      if (Array.isArray(change) && change.length > 0) {
        const datas = e.changes[0].data;
        if (Number.isInteger(datas.Id)) {
          const payload = {
            Id: datas.Id,
            LeaguageId: parseInt(leaguageId),
            // MatchDate: convertToUTC(datas.MatchDate),
            // MatchName: datas.MatchName,
            StadiumNumber: datas.StadiumNumber,
            Status: datas.Status,
            // StartDate: convertToUTC(datas.StartDate),
          };
          addOrUpdateStadiumAsync(payload, false);
        } else {
          const payload = {
            // Id: datas.Id,
            LeaguageId: parseInt(leaguageId),
            // MatchDate: convertToUTC(datas.MatchDate),
            // MatchName: datas.MatchName,
            StadiumNumber: datas.StadiumNumber,
            Status: datas.Status,
            // StartDate: convertToUTC(datas.StartDate),
          };
          addOrUpdateStadiumAsync(payload, true);
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
    const ret = await dispatch(deleteStadiums(id));
    if (ret.type === "stadium/deleteStadium/fulfilled") {
      toast.success("Xóa sân thành công", { theme: "colored" });
    } else {
      toast.error("Xóa sân thất bại", { theme: "colored" });
    }
  };
  const onRowRemoved = (e) => {
    console.log(e.data.Id);
    deleteAsync(e.data.Id);
    // dispatch(deleteStadiums(e.data.Id))
  };
  return (
    <React.Fragment>
      <div className="text-center">
        <span>
          <b>Tình trạng sân đấu</b>
        </span>
      </div>
      <DataGrid
        id="gridContainer"
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
      >
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          // allowDeleting={true}
          allowAdding={true}
        />

        <Column dataField="StadiumNumber" caption="Sân" />
        <Column dataField="Status" caption={"Tình trạng đặt sân"}>
          <Lookup dataSource={StadiumState} displayExpr="Name" valueExpr="Id" />
        </Column>
        <Column dataField="Status" caption={"Tình trạng sử dụng"}>
          <Lookup
            dataSource={StadiumUseState}
            displayExpr="Name"
            valueExpr="Id"
          />
        </Column>

        {/* <Column
          dataField="StartDate"
          caption={"Giờ bắt đầu"}
          dataType={"datetime"}
        />
        <Column dataField="MatchName" width={130} caption={"Trận đấu"} />

        <Column
          dataField="MatchDate"
          width={125}
          dataType="date"
          caption={"Ngày thi đấu dự kiến"}
        /> */}
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
export default App;
