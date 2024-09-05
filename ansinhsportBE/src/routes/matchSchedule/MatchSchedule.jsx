import React, { useState, useEffect } from "react";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired
import DataGrid, { Column, Editing, Lookup } from "devextreme-react/data-grid";
import { useDispatch } from "react-redux";
import {
  addMatchSchedule,
  deleteMatchScheduleFn,
  getAllMatchSchedule,
  updateMatchSchedule,
} from "../../feature/MatchSchedule/MatchScheduleAPI.js";
import _ from "lodash";
import { toast } from "react-toastify";
import { getAllPlayers } from "../../feature/Player/PlayerAPI.js";
import { getAllStadium } from "../../feature/Stadium/StadiumAPI.js";
import Score from "./Score.jsx";
import { useMedia } from "../../feature/hook.js";
import { Button } from "react-bootstrap";
const matchDataSource = [
  { Id: 1, Name: "Trận 1" },
  { Id: 2, Name: "Trận 2" },
  { Id: 3, Name: "Trận 3" },
  { Id: 4, Name: "Trận 4" },
  { Id: 5, Name: "Trận 5" },
];
const stadium = [1, 2, 3, 4, 5, 6];
const firstColumn = stadium.slice(0, 3);
const secondColumn = stadium.slice(3);

const MatchSchedule = () => {
  const [dataSource, setDataSource] = useState([]);
  const [playerDataSource, setPlayerDataSource] = useState([]);
  const [stadiumDataSource, setStadiumDataSource] = useState([]);
  const leaguageId = localStorage.getItem("leaguageId");
  const [isEditable, setIsEditable] = useState(false);
  const [editedRow, setEditedRow] = useState(null);

  const isMobile = useMedia("(max-width: 800px)");

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async (leaguageId) => {
      const ret = await dispatch(getAllMatchSchedule(leaguageId));
      if (ret.type === "MatchSchedule/GetAllMatchSchedules/fulfilled") {
        const mutableData = ret?.payload?.data.map((item) => _.cloneDeep(item));
        setDataSource(mutableData);
      } else {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
      }
      const ret2 = await dispatch(getAllPlayers(leaguageId));
      if (ret2.type === "Player/GetAllPlayers/fulfilled") {
        const mutableData = ret2?.payload?.data.map((item) =>
          _.cloneDeep(item)
        );
        setPlayerDataSource(mutableData);
      } else {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
      }
      const ret3 = await dispatch(getAllStadium(leaguageId));
      if (ret3.type === "stadium/getAllStadium/fulfilled") {
        const mutableData = ret3?.payload?.data.map((item) =>
          _.cloneDeep(item)
        );
        setStadiumDataSource(mutableData);
      } else {
        toast.error("Có lỗi xảy ra khi lấy dữ liệu", { theme: "colored" });
      }
    };
    if (leaguageId && leaguageId > 0) {
      fetchData(leaguageId);
    } else {
      toast.error("Bạn chưa chọn giải đấu");
    }
  }, []);

  const calculateMinutes = () => {
    setDataSource((prevData) =>
      prevData.map((row) => {
        if (row.MatchDate) {
          const matchDate = new Date(row.MatchDate);
          const now = new Date();
          const minutesPassed = Math.floor((now - matchDate) / 60000); // Calculate minutes
          return { ...row, Minutes: minutesPassed };
        }
        return row;
      })
    );
  };

  // useEffect to update the Minus field every minute
  useEffect(() => {
    // Initial calculation when the component mounts
    if (dataSource.length > 0) {
      calculateMinutes();
    }

    // Set interval to recalculate every minute
    const intervalId = setInterval(calculateMinutes, 60000);

    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const addOrUpdateScheduleAsync = async (payload, isAddSchedule) => {
    if (isAddSchedule) {
      var ret = await dispatch(addMatchSchedule(payload));
      if (ret.type === "MatchSchedule/addMatchSchedule/fulfilled") {
        toast.success("Thêm lịch thi đấu thành công!", { theme: "colored" });
      } else {
        toast.error(
          "Có lỗi xảy ra khi thêm lịch thi đấu, vui lòng liên hệ bộ phận kỹ thuật",
          { theme: "colored" }
        );
      }
    } else {
      var ret2 = await dispatch(updateMatchSchedule(payload));
      if (ret2.type === "MatchSchedule/updateMatchSchedule/fulfilled") {
        toast.success("Cập nhật lịch thi đấu thành công!", {
          theme: "colored",
        });
      } else {
        toast.error(
          "Có lỗi xảy ra khi cập nhật lịch thi đấu, vui lòng liên hệ bộ phận kỹ thuật",
          { theme: "colored" }
        );
      }
    }
  };

  const onEditingStart = (e) => {
    setIsEditable(true);
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
    console.log(updatedRow);
    // setEditedRow(updatedRow);
    if (leaguageId && leaguageId > 0) {
      const datas = updatedRow;
      console.log(editedRow);

      const payload = {
        Id: datas.Id,
        LeaguageId: parseInt(leaguageId),
        MatchDate: datas.MatchDate,
        MatchNumber: datas.MatchNumber,
        FirstTeamId: datas.FirstTeamId,
        SecondTeamId: datas.SecondTeamId,
        StadiumNumber: datas.StadiumNumber,
        FirstTeamPoint: datas.FirstTeamPoint,
        SecondTeamPoint: datas.SecondTeamPoint,
      };
      addOrUpdateScheduleAsync(payload, false);
      setIsEditable(false);
    } else {
      toast.error("Vui lòng chọn giải đấu để tiếp tục", { theme: "colored" });
      return;
    }
    setDataSource((prevDataSource) =>
      prevDataSource.map((item) =>
        item.Id === updatedRow.Id ? { ...updatedRow } : item
      )
    );
  };
  const onRowInserted = (e) => {
    const datas = e.data;
    if (leaguageId && leaguageId > 0) {
      const payload = {
        // Id: datas.Id,
        LeaguageId: parseInt(leaguageId),
        MatchDate: datas.MatchDate,
        MatchNumber: datas.MatchNumber,
        FirstTeamId: datas.FirstTeamId,
        SecondTeamId: datas.SecondTeamId,
        StadiumNumber: datas.StadiumNumber,
        FirstTeamPoint: datas.FirstTeamPoint,
        SecondTeamPoint: datas.SecondTeamPoint,
      };
      addOrUpdateScheduleAsync(payload, true);
    } else {
      toast.error("Vui lòng chọn giải đấu để tiếp tục", { theme: "colored" });
      return;
    }
  };

  useEffect(() => {
    console.log(editedRow);
  }, [editedRow]);
  const onSaved = (e) => {
    // if (leaguageId && leaguageId > 0) {
    //   const datas = editedRow;
    //   console.log(editedRow);
    //   const payload = {
    //     Id: datas.Id,
    //     LeaguageId: parseInt(leaguageId),
    //     MatchDate: datas.MatchDate,
    //     MatchNumber: datas.MatchNumber,
    //     FirstTeamId: datas.FirstTeamId,
    //     SecondTeamId: datas.SecondTeamId,
    //     StadiumId: datas.StadiumId,
    //     FirstTeamPoint: datas.FirstTeamPoint,
    //     SecondTeamPoint: datas.SecondTeamPoint,
    //   };
    //   addOrUpdateScheduleAsync(payload, false);
    //   setIsEditable(false);
    // } else {
    //   toast.error("Vui lòng chọn giải đấu để tiếp tục", { theme: "colored" });
    //   return;
    // }
  };
  const deleteAsync = async (id) => {
    const ret = await dispatch(deleteMatchScheduleFn(id));
    if (ret.type === "MatchSchedule/deleteMatchSchedule/fulfilled") {
      toast.success("Xóa lịch thi đấu thành công", { theme: "colored" });
    } else {
      toast.error("Xóa lịch thi đấu thất bại", { theme: "colored" });
    }
  };
  const onRowRemoved = (e) => {
    console.log(e.data.Id);
    deleteAsync(e.data.Id);
  };
  const onScoreChange = (id, field, value) => {
    setDataSource((prevData) => {
      const updatedData = prevData.map((row) =>
        row.Id === id ? { ...row, [field]: parseInt(value) } : row
      );

      // Trigger onRowUpdated manually after score change
      const updatedRow = updatedData.find((row) => row.Id === id);
      onRowUpdated({ data: updatedRow });

      return updatedData;
    });
  };
  const handleClick = (item) => {
    console.log(item);
  };
  return (
    <React.Fragment>
      {/* <div>
        <span>Lịch thi đấu theo bảng:</span>
        <Button className='px-2 mx-2'><Link >A</Link></Button>
        <Button className='px-2 mx-2'><Link >B</Link></Button>
        <Button className='px-2 mx-2'><Link >C</Link></Button>
        <Button className='px-2 mx-2'><Link >D</Link></Button>
        <Button className='px-2 mx-2'><Link >1/16</Link></Button>
        <Button className='px-2 mx-2'><Link >TK</Link></Button>
        <Button className='px-2 mx-2'><Link >BK</Link></Button>
        <Button className='px-2 mx-2'><Link >CK</Link></Button>
        </div> */}
      {isMobile ? (
        <>
          <div style={{ paddingTop: "15%", paddingBottom: 15 }}>
            Vui lòng chọn sân
          </div>
          <div>
            <div className="container">
              <div className="row">
                <div className="col-6 d-flex flex-column">
                  {firstColumn.map((item, index) => (
                    <Button
                      key={index}
                      variant="primary"
                      className="mb-2"
                      style={{ height: 100 }}
                      onClick={() => handleClick(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
                <div className="col-6 d-flex flex-column">
                  {secondColumn.map((item, index) => (
                    <Button
                      key={index}
                      variant="primary"
                      className="mb-2"
                      style={{ height: 100 }}
                      onClick={() => handleClick(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {/* <Button className="px-2 mx-2">1</Button>
            <Button className="px-2 mx-2">2</Button>
            <Button className="px-2 mx-2">3</Button>
            <Button className="px-2 mx-2">4</Button>
            <Button className="px-2 mx-2">5</Button>
            <Button className="px-2 mx-2">6</Button> */}
          </div>
        </>
      ) : (
        <DataGrid
          id="gridContainer"
          dataSource={dataSource}
          keyExpr="Id"
          allowColumnReordering={true}
          showBorders={true}
          onRowInserted={onRowInserted}
          onRowUpdated={onRowUpdated}
          onRowRemoved={onRowRemoved}
          onEditingStart={onEditingStart}
          onRowUpdating={onRowUpdating}
          onSaved={onSaved}
        >
          <Editing
            mode="row" // Popup on mobile, row otherwise
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
            useIcons={true}
          />

          <Column
            dataField="MatchDate"
            caption="Ngày thi đấu"
            dataType={"datetime"}
            width={170}
          />
          <Column dataField="MatchNumber" caption={"Trận"} width={140}>
            <Lookup
              dataSource={matchDataSource}
              displayExpr={"Name"}
              valueExpr={"Id"}
            />
          </Column>
          <Column
            dataField="Minutes"
            caption={"Số phút"}
            width={140}
            allowEditing={false}
          />
          <Column dataField="FirstTeamId" caption={"Đội 1"} width={140}>
            <Lookup
              dataSource={playerDataSource}
              displayExpr={"FullName"}
              valueExpr={"Id"}
            />
          </Column>

          <Column
            caption="Tỷ số"
            width={300}
            cellRender={(cellData) => (
              <Score
                data={cellData.data}
                onScoreChange={onScoreChange}
                isEditable={isEditable}
              />
            )}
          />
          <Column dataField="SecondTeamId" caption="Đội 2" width={125}>
            <Lookup
              dataSource={playerDataSource}
              displayExpr={"FullName"}
              valueExpr={"Id"}
            />
          </Column>
          <Column dataField="StadiumNumber" width={125} caption={"Sân "}>
            <Lookup
              dataSource={stadiumDataSource}
              displayExpr={"StadiumNumber"}
              valueExpr={"StadiumNumber"}
            />
          </Column>
        </DataGrid>
      )}
    </React.Fragment>
  );
};
export default MatchSchedule;
