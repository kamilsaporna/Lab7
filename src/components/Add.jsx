import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
import { PlusCircleOutlined } from "@ant-design/icons";

const Add = ({ onAdd }) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [existingProduct, setExistingProduct] = useState([]);

  useEffect(() => {
    // Fetch existing names when component mounts
    axios
      .get(
        "https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/"
      )
      .then((res) => {
        const products = res.data.map((item) => item.productType);
        setExistingProduct(products);
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
    const { productType, quantity } = values;
    if (existingProduct.includes(productType)) {
      message.error("Product already exists. Please enter a different product.");
      return;
    }

    if (productType.length < 3) {
      message.error("Please enter at least three characters for the product.");
      return;
    }

    if (isNaN(quantity) || quantity === "") {
      message.error("Please enter a valid number for the quantity.");
      return;
    }

    axios
      .post(
        "https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/",
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
        title="Add New Product"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="productType"
            label="Prouct Type"
            rules={[{ required: true, message: "Please enter product type" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit (e.g Kilo, Litre, etc)"
            rules={[{ required: true, message: "Please enter unit" }]}
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
