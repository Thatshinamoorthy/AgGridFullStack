import { AgGridReact } from "ag-grid-react";
import { useRef, useState } from "react";
import { io } from "socket.io-client";
import "ag-grid-enterprise";
import { Button, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Form, Input, Modal, Select } from "antd";

const socket = io("http://localhost:4000/users");
const TableCRUD = () => {
  const form = Form.useForm();
  const gridRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const colDef = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "std", headerName: "Standard", flex: 1 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "gender", headerName: "Gender", flex: 1 },
    { field: "school_name", headerName: "School Name", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <div className="flex gap-2 items-center">
            <IconButton color="primary">
              <EditOutlinedIcon />
            </IconButton>
            <IconButton color="error">
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];
  const datasource = {
    getRows: (params) => {
      const req = params?.request;
      try {
        socket.emit("get-row", req, (data) => {
          if (data) {
            console.log(data);
            params.success({ rowData: data?.userData, rowCount: data?.total });
          }
        });
      } catch (error) {}
    },
  };
  const onGridReady = (params) => {
    if (params?.api) {
      gridRef.current = params.api;
      params.api.setGridOption("serverSideDatasource", datasource);
    }
  };
  const handleModalCancel = () => {
    setModalOpen(false);
  };
  return (
    <div className="flex h-[100vh] w-[100vw] bg-blue-950 flex-col justify-center items-center gap-2">
      <div className="flex justify-end w-[80%]">
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          add+
        </Button>
      </div>
      <Modal open={modalOpen} onCancel={handleModalCancel} okText="Submit">
        <Form layout="vertical" form={form}>
          <Form.Item label="ID" name="id">
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Standard" name="std">
            <Input />
          </Form.Item>
          <Form.Item label="Age" name="age">
            <Input />
          </Form.Item>
          <Form.Item label="Gender">
            <Select
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Others", value: "Others" },
              ]}
            />
          </Form.Item>
          <Form.Item label="School Name" name="school_name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <div className="h-[80%] w-[80%]">
        <AgGridReact
          onGridReady={onGridReady}
          rowModelType="serverSide"
          columnDefs={colDef}
          cacheBlockSize={50}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default TableCRUD;