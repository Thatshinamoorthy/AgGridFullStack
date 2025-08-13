import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "ag-grid-enterprise";
import { Button, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Form, Input, Modal, Select } from "antd";

const socket = io("http://localhost:4000/users");
const TableCRUD = () => {
  const [form] = Form.useForm();
  const gridRef = useRef();
  const [isEdit, setEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const handleEdit = (data) => {
    setEdit(true);
    setModalOpen(true);
    console.log(data);
    form.setFieldsValue(data);
  };
  const handleEditUser = () => {};
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
            <IconButton
              color="primary"
              onClick={() => handleEdit(params?.data)}
            >
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
            params.success({ rowData: data?.userData, rowCount: data?.total });
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
  };
  const onGridReady = (params) => {
    if (params?.api) {
      gridRef.current = params.api;
      params.api.setGridOption("serverSideDatasource", datasource);
    }
  };
  const handleModalCancel = () => {
    form.resetFields();
    setModalOpen(false);
  };
  const handleAddUserData = () => {
    try {
      form
        .validateFields()
        .then((values) => {
          const finalData = {
            ...values,
            id: Number(values?.id),
            std: Number(values?.std),
            age: Number(values?.age),
          };
          console.log(finalData);
          socket.emit("add-user", finalData, (res) => {
            console.log(res);
            if (res?.success) {
              handleModalCancel();
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    socket.on("user-added", (res) => {
      console.log(res);

      if (res?.success) {
        if (gridRef?.current) {
          const addData = {
            id: String(res?.data?.id),
            name: res?.data?.name,
            age: String(res?.data?.age),
            gender: res?.data?.gender,
            std: String(res?.data?.std),
            school_name: res?.data?.school_name,
          };
          gridRef.current.applyServerSideTransaction({
            add: [addData],
          });
        }
        handleModalCancel();
      }
    });
  }, []);
  return (
    <div className="flex h-[100vh] w-[100vw] bg-blue-950 flex-col justify-center items-center gap-2">
      <div className="flex justify-end w-[80%]">
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          add+
        </Button>
      </div>
      <Modal
        open={modalOpen}
        onCancel={handleModalCancel}
        okText={isEdit ? "Update" : "Submit"}
        onOk={isEdit ? handleEditUser : handleAddUserData}
      >
        <Form
          layout="vertical"
          form={form}
          labelCol={{ style: { paddingBottom: "1px" } }}
        >
          <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: "Please Enter your ID!" }]}
            style={{ marginBottom: "9px" }}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please Enter your Name!" }]}
            style={{ marginBottom: "9px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Standard"
            name="std"
            rules={[{ required: true, message: "Please Enter your Standard!" }]}
            style={{ marginBottom: "9px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please Enter your Age!" }]}
            style={{ marginBottom: "9px" }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "please select gender" }]}
            style={{ marginBottom: "9px" }}
          >
            <Select
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Others", value: "Others" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="School Name"
            name="school_name"
            rules={[
              { required: true, message: "Please Enter your School Name!" },
            ]}
            style={{ marginBottom: "9px" }}
          >
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
          getRowId={(params) => params?.data?.id.toString()}
        />
      </div>
    </div>
  );
};

export default TableCRUD;
