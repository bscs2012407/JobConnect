import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Col, Row, Card, Avatar, Space, Skeleton } from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

import JobConnectLogo from "../../../../assets/images/logo/logo2.jpeg";
import BriefCaseIcon from "../../../../assets/images/logo/briefcase.png";
import SaveLogo from "../../../../assets/images/logo/floppy-disk.svg";

const { Meta } = Card;

function Workspace() {
  const [analytics, setAnalytics] = useState({
    jobPostsCount: 0,
    applicantsCount: 0,
    jobsAppliedCount: 0,
    graphData: [],
  });
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth?.user);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/v1/users/analytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  const statCard = (icon, title, value) => (
    <Card>
      <Space>
        {icon}
        <div>
          <div>{title}</div>
          <strong>{value}</strong>
        </div>
      </Space>
    </Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1.5rem" }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card bordered={false}>
                <Meta
                  avatar={<Avatar size="large" src={JobConnectLogo} />}
                  title={user.role === "user" ? user?.name : user?.companyName}
                  description={
                    <>
                      <p>
                        <EnvironmentOutlined /> Location: {user?.location}
                      </p>
                      <p>
                        <MailOutlined /> Email: {user?.email}
                      </p>
                    </>
                  }
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={8}>
              {statCard(
                <Avatar src={BriefCaseIcon} />,
                "Job Posts",
                analytics.jobPostsCount
              )}
            </Col>
            <Col span={8}>
              {statCard(
                <Avatar src={SaveLogo} />,
                user.role === "user" ? "Jobs Applied" : "Applicants",
                user.role === "user"
                  ? analytics.jobsAppliedCount
                  : analytics.applicantsCount
              )}
            </Col>
            <Col span={8}>
              {statCard(<UserOutlined />, "Profile Views", "123")}
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24} style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.graphData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey={
                      user.role === "user" ? "Applications" : "Applicants"
                    }
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Workspace;
