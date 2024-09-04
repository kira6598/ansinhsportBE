import React, { useCallback, useEffect, useState } from 'react';
import Button from 'devextreme-react/button';
import 'devextreme/dist/css/dx.light.css'; // You can choose a different theme if desired

import DataGrid, {
  Column, Editing, Paging, Lookup,
} from 'devextreme-react/data-grid';
import { employees, states } from './data.ts';
import { useDispatch } from 'react-redux';
import { getAllStadium } from '../../feature/Stadium/StadiumAPI.js';

const App = () => {
  const hostApi = import.meta.env.VITE_HOST_API;

  const dispatch = useDispatch()
  useEffect(()=>{
    const fetchData = async (id) =>{     
       const ret = dispatch(getAllStadium(id))
       console.log(ret);       
    }    
    fetchData(1)
  })
  console.log(hostApi);
  
  const [events, setEvents] = useState([]);
  const logEvent = useCallback((eventName) => {
    setEvents((previousEvents) => [eventName, ...previousEvents]);
  }, []);
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);
  return (
    <React.Fragment>
      <div className='text-center'><span><b>Tình trạng sân đấu</b></span></div>
      <DataGrid
        id="gridContainer"
        dataSource={employees}
        keyExpr="ID"
        allowColumnReordering={true}
        showBorders={true}
        onEditingStart={() => logEvent('EditingStart')}
        onInitNewRow={() => logEvent('InitNewRow')}
        onRowInserting={() => logEvent('RowInserting')}
        onRowInserted={() => logEvent('RowInserted')}
        onRowUpdating={() => logEvent('RowUpdating')}
        onRowUpdated={() => logEvent('RowUpdated')}
        onRowRemoving={() => logEvent('RowRemoving')}
        onRowRemoved={() => logEvent('RowRemoved')}
        onSaving={() => logEvent('Saving')}
        onSaved={() => logEvent('Saved')}
        onEditCanceling={() => logEvent('EditCanceling')}
        onEditCanceled={() => logEvent('EditCanceled')}
      >
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />

        <Column
          dataField="Prefix"
          caption="Sân"
        />
        <Column dataField="FirstName" caption={"Tình trạng"} />
        <Column dataField="LastName" caption={"Số phút"}/>
        <Column
          dataField="Position"
          width={130}
          caption={"Trận đấu"}
        />
        <Column
          dataField="StateID"
          caption="Bảng đấu"
          width={125}
          
        >
          <Lookup
            dataSource={states}
            displayExpr="Name"
            valueExpr="ID"
          />
        </Column>
        <Column
          dataField="BirthDate"
          width={125}
          dataType="date"
          caption={"Ngày thi đấu"}
        />
      </DataGrid>

      <div id="events">
        <div>
          <div className="caption">Fired events</div>
          <Button
            id="clear"
            text="Clear"
            onClick={clearEvents}
          />
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
