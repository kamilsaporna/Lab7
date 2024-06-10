import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import { PlusCircleOutlined } from "@ant-design/icons";

const Add = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    // Fetch existing names when component mounts
    axios
      .get(
        "https://cerulean-salamander-862797.netlify.app/.netlify/functions/api/"
      )
      .then((res) => {
        const names = res.data.map((item) => item.name);
        setExistingNames(names);
      })
      .catch((error) => {
        console.error("Error fetching existing data: ", error);
      });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    const { name, age } = values;
    if (existingNames.includes(name)) {
      message.error("Name already exists. Please enter a different name.");
      return;
    }

    if (name.length < 3) {
      message.error("Please enter at least three characters for the name.");
      return;
    }

    if (isNaN(age) || age === "") {
      message.error("Please enter a valid number for the age.");
      return;
    }

    axios
      .post(
        "https://cerulean-salamander-862797.netlify.app/.netlify/functions/api/",
        values
      )
      .then((res) => {
        onAdd(res.data, () => {
          message.success("Data added successfully");
          form.resetFields();
          setVisible(false);
        });
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
      });
  };

  return (
    <>
      <Button
        className="flex justify-center items-center left-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="primary"
        onClick={showModal}
      >
        <PlusCircleOutlined className="mr-2" /> New Author
      </Button>
      <Modal
        title="Add New Author"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter addres" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

// PropTypes validation
Add.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

export default Add;
