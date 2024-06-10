import { useState, useEffect } from "react";
import { Button, Table, Modal, message, Typography } from "antd";
import axios from "axios";
import Update from "./Update";
import Add from "./Add";

const DataForm = () => {
  const [data, setData] = useState([]);
  const [updateMode, setUpdateMode] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/"
      )
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  function handleDelete(id) {
    axios
      .delete(
        `https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/${id}`
      )
      .then(() => {
        setData(data.filter((item) => item._id !== id));
        message.success("Data deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
      });
  }

  const handleUpdateClick = (record) => {
    setUpdateRecord(record);
    setUpdateMode(true);
  };

  const handleUpdate = (id, updatedData) => {
    setData(
      data.map((item) => (item._id === id ? { ...item, ...updatedData } : item))
    );
    setUpdateMode(false); // After update, close the modal
  };

  const handleAdd = (newData, callback) => {
    // Update the state with the new data
    setData((prevData) => [...prevData, newData]);

    // Close the add modal if a callback function is provided
    if (callback) {
      callback();

      // Additionally, update the state immediately after adding to reflect changes in the table
      axios
        .get(
          "https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/"
        )
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  };

  const showModal = (id) => {
    setIsModalVisible(true);
    setDeleteId(id);
  };

  const handleOk = () => {
    handleDelete(deleteId);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Product Type",
      dataIndex: "productType",
      key: "productType",
      width: "30%",
      className:
        "px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
      className:
        "px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider",
    },
    {
      title: "Unit (eg. kg, litre)",
      dataIndex: "unit",
      key: "unit",
      width: "30%",
      className:
        "px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "30%",
      className:
        "px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider",
    },
    {
      title: (
        <span className="flex items-center px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">
          Action
          <Add onAdd={handleAdd} />
        </span>
      ),
      key: "action",
      className:
        "px-6 py-3 bg-gray-50 text-left text-sm font-bold text-gray-500 uppercase tracking-wider",
      render: (text, record) => (
        <span className="flex gap-3">
          <Button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleUpdateClick(record)}
          >
            Update
          </Button>
          <Button
            className="text-red-600 hover:text-red-900"
            type="primary"
            danger
            onClick={() => showModal(record._id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="mt-4">
      <Typography.Title level={2} className="text-center">
        Inventory Management
      </Typography.Title>
      <Table
        className="w-full divide-y divide-gray-200"
        columns={columns}
        dataSource={data}
      />
      {updateMode && (
        <Update
          record={updateRecord}
          onCancel={() => setUpdateMode(false)}
          onUpdate={handleUpdate}
        />
      )}
      <Modal
        title="Are you sure you want to delete this data?"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      ></Modal>
    </div>
  );
};

export default DataForm;
