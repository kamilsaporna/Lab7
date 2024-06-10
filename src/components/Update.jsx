import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";

const Update = ({ record, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(true);
  const [existingProduct, setExistingProduct] = useState([]);

  useEffect(() => {
    // Fetch existing names when component mounts
    axios
      .get("https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/")
      .then((res) => {
        const products = res.data.map((item) => item.productType);
        setExistingProduct(products);
      })
      .catch((error) => {
        console.error("Error fetching existing data: ", error);
      });
  }, []);

  const handleCancel = () => {
    setVisible(false);
    onCancel(); // Call onCancel function provided by parent component
  };

  const onFinish = async (values) => {
    const { productType } = values;

    if (
      existingProduct.includes(productType) &&
      productType !== record.productType
    ) {
      message.error(
        "Product already exists. Please enter a different product."
      );
      return;
    }

    if (productType.length < 3) {
      message.error("Please enter at least three characters for the product.");
      return;
    }

    try {
      // Check if quantity is 0
      if (values.quantity === 0) {
        values.status = "Out of stock";
        const userConfirmation = window.confirm(
          "Are you sure you want to update the quantity to 0? This will mark the product as out of stock."
        );
        if (userConfirmation) {
          window.location.reload();
        }
      } else {
        values.status = "In stock";
      }

      await axios.put(
        `https://idyllic-crumble-4ee68d.netlify.app/.netlify/functions/api/${record._id}`,
        values
      );
      message.success("Data updated successfully");
      onUpdate(record._id, values); // Call onUpdate function provided by parent component
      form.resetFields();
      setVisible(false);
      onCancel(); // Call onCancel function provided by parent component
    } catch (error) {
      console.error("Error updating data: ", error);
      message.error("Failed to update data");
    }
  };

  return (
    <div>
      <Modal
        title="Update Author"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          initialValues={{
            productType: record.productType,
            quantity: record.quantity,
            unit: record.unit,
          }}
        >
          <Form.Item
            name="productType"
            label="Product Type"
            rules={[{ required: true, message: "Please input the product!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantit"
            rules={[
              { required: true, message: "Please input the age!" },
              () => ({
                validator(_, value) {
                  if (!value || !isNaN(Number(value))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please enter a valid number for the age!")
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit (e.g Kilo, Litre, etc)"
            rules={[{ required: true, message: "Please input the address!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// PropTypes validation
Update.propTypes = {
  record: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Update;
