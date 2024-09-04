import React, { useCallback, useState } from "react";
import Button from "devextreme-react/button";
import "devextreme/dist/css/dx.light.css"; // You can choose a different theme if desired
import { Link } from "react-router-dom";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
} from "devextreme-react/data-grid";
import { employees, states } from "./data.ts";

const MatchTable = () => {
  const [events, setEvents] = useState([]);
  const leaguageId = localStorage.getItem("leaguageId");
  const logEvent = useCallback((eventName) => {
    setEvents((previousEvents) => [eventName, ...previousEvents]);
  }, []);
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  return (
    <React.Fragment>
      <div>
        <span>Lịch thi đấu theo bảng:</span>
        <Button className="px-2 mx-2">
          <Link>A</Link>
        </Button>
        <Button className="px-2 mx-2">
          <Link>B</Link>
        </Button>
        <Button className="px-2 mx-2">
          <Link>C</Link>
        </Button>
        <Button className="px-2 mx-2">
          <Link>D</Link>
        </Button>

        {/* <Link>1/16</Link>
        <Link>TK</Link>
        <Link>BK</Link>
        <Link>CK</Link> */}
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

        <Column dataField="Prefix" caption="TT" />
        <Column dataField="FirstName" caption={"Ngày"} />
        <Column dataField="LastName" caption={"Bảng"} />
        <Column dataField="Position" width={130} caption={"Đội 1"} />
        <Column dataField="StateID" caption="Tỷ số" width={125}>
          <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
        </Column>
        <Column dataField="StateID" caption="Đội 2" width={125}>
          <Lookup dataSource={states} displayExpr="Name" valueExpr="ID" />
        </Column>
        <Column
          dataField="BirthDate"
          width={125}
          dataType="date"
          caption={"Sân vận động"}
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
export default MatchTable;
