import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Upload,
  message,
  Space,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Card,
  Timeline,
  Badge,
  List,
} from "antd";
import {
  RiUploadCloud2Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiCloseFill,
} from "react-icons/ri";
import axiosInterceptor from "../../../../services/axiosInterceptor";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";

function Experience() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [token, setToken] = useState(localStorage?.getItem("token"));
  const [Data, setData] = useState([]);

  const onChangeStartDate = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(date);
  };
  const onChangeEndtDate = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(date);
  };

  const getFormattedDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`;
  };

  const columns = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => {
        const dateObj = new Date(text);
        return (
          <span>{`${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`}</span>
        );
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "graduationYear",
      render: (text) => {
        const dateObj = new Date(text);
        return (
          <span>{`${dateObj.getDate()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`}</span>
        );
      },
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>Edit</a>
    //       <a>Delete</a>
    //     </Space>
    //   ),
    // },
  ];

  const dateFormat = "YYYY-MM-DD";

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };

      const response = await axios.get(
        `http://localhost:3001/v1/users/experience`,
        config
      );
      console.log(response);
      setData(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  const addExperience = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const experienceData = {
        company,
        position,
        startDate,
        endDate,
      };
      const response = await axios.post(
        `http://localhost:3001/v1/users/experience`,
        experienceData,
        config
      );
      console.log(response);
      fetchData();

      handleCancel();
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const user = useSelector((state) => state.auth?.user);
  console.log(user);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <Button type="primary" onClick={showModal}>
          Add Experience
        </Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
        {Data.map((exp, index) => (
          <Col span={8} key={index}>
            <Card
              title={exp.company}
              actions={[
                <EditOutlined key="edit" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <p>
                <Badge status="processing" text={exp.position} />
              </p>
              <p>Start Date: {getFormattedDate(exp.startDate)}</p>
              <p>End Date: {getFormattedDate(exp.endDate)}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Add Experience"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={addExperience}>
          {/* Adjusted Form Items for better UX */}
          <Form.Item
            label="Company"
            name="company"
            rules={[
              { required: true, message: "Please input the company name!" },
            ]}
          >
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please input the position!" }]}
          >
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[
              { required: true, message: "Please select the start date!" },
            ]}
          >
            <DatePicker
              onChange={(date, dateString) => setStartDate(dateString)}
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "Please select the end date!" }]}
          >
            <DatePicker
              onChange={(date, dateString) => setEndDate(dateString)}
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Button type="primary" htmlType="submit" block>
                Save
              </Button>
            </Col>
            <Col span={12}>
              <Button onClick={handleCancel} block>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={Data} />
    </div>
  );
}

export default Experience;
