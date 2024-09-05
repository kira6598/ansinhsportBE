import React, { useState, useEffect } from "react";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired
import DataGrid, { Column, Editing, Lookup } from "devextreme-react/data-grid";
import { useDispatch } from "react-redux";
import {
  addMatchSchedule,
  deleteMatchScheduleFn,
  getAllMatchSchedule,
  getCurrentStadium,
  updateMatchSchedule,
} from "../../feature/MatchSchedule/MatchScheduleAPI.js";
import { Button, Modal, Form } from 'react-bootstrap'; // Adjust imports based on your library
import _ from "lodash";
import { toast } from "react-toastify";
import { getAllPlayers } from "../../feature/Player/PlayerAPI.js";
import { getAllStadium } from "../../feature/Stadium/StadiumAPI.js";
import Score from "./Score.jsx";
import { useMedia } from "../../feature/hook.js";
const matchDataSource = [
  { Id: 1, Name: "Trận 1" },
  { Id: 2, Name: "Trận 2" },
  { Id: 3, Name: "Trận 3" },
  { Id: 4, Name: "Trận 4" },
  { Id: 5, Name: "Trận 5" },
];
const IsEndState = [
  {Id:0,Name:"Chưa đấu"},{Id:1,Name:"Đang đấu"},{Id:2,Name:"Đã đấu"}]
const stadium = [1, 2, 3, 4, 5, 6];
const firstColumn = stadium.slice(0, 3);
const secondColumn = stadium.slice(3);
const findNameById = (id,arr) => {
  
  if(Array.isArray(arr) && arr.length>0){
    const item = arr.find(x=>x.Id === id);
    
    return item ? item.FullName : "Unknow!";
  }else{
    toast.error("Array is empty or invalid!");
    return "Unknow!";
  }
 
};
const MatchSchedule = () => {
  const [dataSource, setDataSource] = useState([]);
  const [playerDataSource, setPlayerDataSource] = useState([]);
  const [stadiumDataSource, setStadiumDataSource] = useState([]);
  const leaguageId = localStorage.getItem("leaguageId");
  const [isEditable, setIsEditable] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [itemData, setItemData] = useState(null);

  useEffect(()=>{
    console.log(itemData);
    
  },[itemData])
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
        if(ret?.payload?.error){
          toast.error(
            ret?.payload?.error,
            { theme: "colored" }
          );
          throw new Error(ret?.payload?.error);
        }else{
          toast.success("Thêm lịch thi đấu thành công!", { theme: "colored" });
        }
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
        IsEnd:datas.IsEnd,
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
        IsEnd:datas.IsEnd,
      };
      addOrUpdateScheduleAsync(payload, true).catch((ex)=>{
        e.component.cancelEditData(); 

      });
    } else {
      toast.error("Vui lòng chọn giải đấu để tiếp tục", { theme: "colored" });
      e.component.cancelEditData(); // Cancel the insertion if no league is selected

      throw new Error("Insertion process terminated due to an error");
    }
  };


  // const onSaved = (e) => {
  
  // };
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
  // const handleClick = (item) => {
  //   console.log(item);
  // };
  const handleSave = (item ) =>{
     
    const datas = {
      ...itemData,
    }
    const payload = {
      Id: datas.Id,
      LeaguageId: parseInt(leaguageId),
      MatchDate: datas.MatchDate,
      MatchNumber: datas.MatchNumber,
      FirstTeamId: datas.FirstTeamId,
      SecondTeamId: datas.SecondTeamId,
      StadiumNumber: datas.StadiumNumber,
      FirstTeamPoint: parseInt(datas.FirstTeamPoint),
      SecondTeamPoint: parseInt(datas.SecondTeamPoint),
      IsEnd:datas.IsEnd,
    };
    console.log(payload);
    
    addOrUpdateScheduleAsync(payload, false);
    handleClose()
  }
  const handleButtonClick = async (data) => {
    var ret = await dispatch(getCurrentStadium(data));
    if(ret?.payload?.error){
      toast.error(
        ret?.payload?.error,
        { theme: "colored" }
      );
      return;
    }else{
      console.log(ret.payload.data);
      setItemData(ret.payload.data);

    setShowPopup(true);
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setItemData(null);
  };
  const updatePoint = (e) =>{
    const filedName = e.target.name;
    const newValue = e.target.value;
    setItemData({
      ...itemData,
      [filedName]:newValue
    })

  }
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
                      onClick={() => handleButtonClick(item)}
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
                      onClick={() => handleButtonClick(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {/* Popup */}
      <Modal show={showPopup} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center"><b>Sân {itemData?itemData.StadiumNumber:0}</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemData && (
            <Form>
              <Form.Group>
                <Form.Label>Đội 1:</Form.Label>
                <Form.Control
                  type="text"
                  value={findNameById(itemData.FirstTeamId,playerDataSource)}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Đội 2</Form.Label>
                <Form.Control
                  type="text"
                  value={findNameById(itemData.SecondTeamId,playerDataSource)}
                  readOnly
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Điểm đội 1:</Form.Label>
                <Form.Control
                  type="number"
                  name="FirstTeamPoint"
                  value={itemData.FirstTeamPoint}
                  onChange={updatePoint}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Điểm đội 2:</Form.Label>
                <Form.Control
                  type="number"
                  name="SecondTeamPoint"
                  value={itemData.SecondTeamPoint}
                  onChange={updatePoint}
                />
              </Form.Group>
              {/* Add additional fields as needed */}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => handleSave(itemData)}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
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
          // onSaved={onSaved}
        >
          <Editing
            mode="row" // Popup on mobile, row otherwise
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
            useIcons={true}
          />
          <Column dataField="StadiumNumber" width={125} caption={"Sân "}>
            <Lookup
              dataSource={stadiumDataSource}
              displayExpr={"StadiumNumber"}
              valueExpr={"StadiumNumber"}
            />
          </Column>
          <Column
            dataField="MatchDate"
            caption="Ngày thi đấu"
            dataType={"datetime"}
            width={170}
          />
          <Column
            dataField="IsEnd"
            caption="Trạng thái"
            // dataType={"datetime"}
            width={170}
          >
            <Lookup dataSource={IsEndState} displayExpr={"Name"} valueExpr={"Id"}/>
          </Column>
          <Column dataField="MatchNumber" caption={"Trận"} width={140}>
            <Lookup
              dataSource={matchDataSource}
              displayExpr={"Name"}
              valueExpr={"Id"}
            />
          </Column>
          {/* <Column
            dataField="Minutes"
            caption={"Số phút"}
            width={140}
            allowEditing={false}
          /> */}
          <Column dataField="FirstTeamId" caption={"Đội 1"} width={140}>
            <Lookup
              dataSource={playerDataSource}
              displayExpr={"FullName"}
              valueExpr={"Id"}
            />
          </Column>

          <Column
            caption="Tỷ số"
            width={250}
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

        </DataGrid>
      )}
    </React.Fragment>
  );
};
export default MatchSchedule;
