import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react'
import {io} from 'socket.io-client'
import 'ag-grid-enterprise'

const socket = io("http://localhost:4000/users");
const TableCRUD = () => {
    const gridRef = useRef();
    const colDef = [
        { field: 'id', headerName: 'ID', flex:1 },
        { field: 'name', headerName: 'Name', flex:1 },
        {field:'std',headerName:"Standard",flex:1},
        { field: 'age', headerName: 'Age', flex:1 },
        {field:'gender', headerName:'Gender',flex:1},
        {field:'school_name',headerName:'School Name',flex:1}
    ]
    const datasource = {
        getRows:(params)=>{ 
            const req = params?.request;
            try {
                socket.emit("get-row",req,(data)=>{
                    if(data){
                        console.log(data);
                        params.success({rowData:data?.userData,rowCount:data?.total});
                    }
                });
            } catch (error) {
                
            }
        }
    }
    const onGridReady = (params)=>{
        if(params?.api){
            gridRef.current = params.api;
            params.api.setGridOption("serverSideDatasource",datasource);
        }
    }
  return (
    <div className='flex h-[100vh] w-[100vw] bg-blue-900 justify-center items-center'>
        <div className='h-[80%] w-[80%]'>
            <AgGridReact 
            onGridReady={onGridReady}
            rowModelType='serverSide'
            columnDefs={colDef}
            cacheBlockSize={50}
            // pagination={true}
            />
        </div>
    </div>
  )
}

export default TableCRUD;