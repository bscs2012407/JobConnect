import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
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
  Card,
  Statistic,
  Divider,
  List,
  Timeline,
  Avatar,
} from "antd";
import {
  RiUploadCloud2Line,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiBriefcaseLine,
  RiUserFollowLine,
  RiNewspaperLine,
  RiBuildingLine,
  RiCloseFill,
} from "react-icons/ri";
import axiosInterceptor from "../../../../services/axiosInterceptor";
import axios from "axios";
import TextArea from "antd/lib/input/TextArea";

function JobPosts() {
  const [actionUrl, setActionUrl] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [location, setlocation] = useState("");
  const [skills, setskills] = useState("");
  const [salary, setsalary] = useState(0);
  const [employmentType, setemploymentType] = useState("Full-time");
  const [requirements, setRequirements] = useState("");
  const [token, setToken] = useState(localStorage?.getItem("token"));
  const [Data, setData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApplicantsModalVisible, setIsApplicantsModalVisible] =
    useState(false);
  const [applicants, setApplicants] = useState([]);
  const user = useSelector((state) => state.auth?.user);

  const statsData = {
    totalJobs: 120,
    totalApplications: 350,
    newJobsThisWeek: 15,
    totalCompanies: 40,
  };

  const recentActivity = [
    {
      key: "1",
      date: "2023-04-10",
      content: "Applied for Frontend Developer at Tech Corp.",
    },
    {
      key: "2",
      date: "2023-04-12",
      content: "Software Engineer position at Startup XYZ became available.",
    },
    {
      key: "3",
      date: "2023-04-15",
      content:
        "Your application for Backend Developer at Innovatech was viewed.",
    },
  ];

  const showApplicants = (job) => {
    setApplicants(job.applicants);
    setIsApplicantsModalVisible(true);
  };

  const getUserSkillsMatch = () => {
    let matchedSkillsCount = 0;
    const userSkills = user.technicalSkills.map((userSkill) =>
      userSkill.toLowerCase().trim()
    );
    const jobSkills = selectedJob.skills.map((jobSkill) =>
      jobSkill.toLowerCase().trim()
    );
    jobSkills.forEach((jobSkill) => {
      if (userSkills.includes(jobSkill)) {
        matchedSkillsCount += 1;
      }
    });
    return matchedSkillsCount;
  };

  const showJobDetails = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const columns =
    user.role === "user"
      ? [
          {
            title: "Image",
            dataIndex: "postedBy",
            key: "postedBy",
            render: (record) => (
              <img
                src={`http://localhost:3001${record.profilePicture}`}
                alt="Job"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ),
          },
          {
            title: "Job Title",
            dataIndex: "title",
            key: "title",
            render: (text) => <a>{text}</a>,
          },
          {
            title: "Applications",
            dataIndex: "appplications",
            key: "applications",
            render: (_, record) => {
              return (
                <Tag
                  color={record?.appplications?.length > 0 ? "green" : "red"}
                >
                  {record?.appplications?.length}
                </Tag>
              );
            },
          },
          {
            title: "Company",
            dataIndex: "company",
            key: "company",
          },
          {
            title: "Type",
            dataIndex: "employmentType",
            key: "employmentType",
          },
          {
            title: "Salary",
            dataIndex: "salary",
            key: "salary",
            render: (text, record) => <span>{text} PKR</span>,
          },
          {
            title: "Posted Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
              const dateObj = new Date(text);
              return (
                <span>{`${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`}</span>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => {
              console.log(record.id);
              return (
                <Space size="middle">
                  <Button onClick={() => showJobDetails(record)}>
                    Details
                  </Button>
                </Space>
              );
            },
          },
        ]
      : [
          {
            title: "Image",
            dataIndex: "postedBy",
            key: "postedBy",
            render: (record) => (
              <img
                src={`http://localhost:3001${record.profilePicture}`}
                alt="Job"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            ),
          },
          {
            title: "Job Title",
            dataIndex: "title",
            key: "title",
            render: (text) => <a>{text}</a>,
          },
          {
            title: "Company",
            dataIndex: "company",
            key: "company",
          },
          {
            title: "Type",
            dataIndex: "employmentType",
            key: "employmentType",
          },
          {
            title: "Salary",
            dataIndex: "salary",
            key: "salary",
            render: (text, record) => <span>{text} PKR</span>,
          },
          {
            title: "Posted Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => {
              const dateObj = new Date(text);
              return (
                <span>{`${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`}</span>
              );
            },
          },
          {
            title: "Action",
            key: "action",
            render: (_, record) => {
              console.log(record.id);
              return (
                <Space size="middle">
                  {/* <a>Edit</a>
        <a>Delete</a> */}
                  <Button onClick={() => showJobDetails(record)}>
                    Details
                  </Button>
                  <Button
                    disabled={record?.appplications?.length === 0}
                    onClick={() => showApplicants(record)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "0.5rem",
                    }}
                  >
                    <span>Applicants</span>
                    <Tag
                      color={
                        record?.appplications?.length > 0 ? "green" : "red"
                      }
                    >
                      {record?.appplications?.length}
                    </Tag>
                  </Button>
                </Space>
              );
            },
          },
        ];

  const applicantColumns = [
    {
      title: "Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (_, record) => (
        <img
          src={`http://localhost:3001${record.profilePicture}`}
          alt="applicant-picture"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  const applyForJob = async (jobId) => {
    try {
      const authToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3001/v1/jobpost/${jobId}/apply`,
        {},
        config
      );
      if (response.status === 201) {
        message.success("Job application successful");
      } else {
        message.error("Cannot Reapply for a Job");
      }
      fetchData();
    } catch (error) {
      console.error("Error applying for job:", error?.message);
      message.error("Something went wrong. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      const authToken = await localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get(
        `http://localhost:3001/v1/jobpost`,
        config
      );
      setData(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  const addJob = async () => {
    try {
      const authToken = await localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const jobdata = {
        title,
        salary,
        contactEmail: user?.email,
        company: user?.companyName,
        location,
        description,
        skills: skills?.split(","),
        employmentType,
        requirements: requirements?.split(","),
      };
      const response = await axios.post(
        `http://localhost:3001/v1/jobpost`,
        jobdata,
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

  const JobDetailsModal = ({ user }) => (
    <Modal
      title="Job Details"
      visible={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      footer={
        user.role === "user"
          ? [
              <Button key="back" onClick={() => setIsModalVisible(false)}>
                Return
              </Button>,
              <Button
                key="apply"
                type="primary"
                onClick={(e) => {
                  applyForJob(selectedJob.id);
                  setIsModalVisible(false);
                }}
              >
                Apply Now
              </Button>,
            ]
          : [
              <Button
                type="primary"
                key="back"
                onClick={() => setIsModalVisible(false)}
              >
                Return
              </Button>,
            ]
      }
    >
      {selectedJob && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "0.2rem",
              marginBottom: "1.2rem",
            }}
          >
            <h1
              style={{
                margin: 0,
                padding: 0,
                fontWeight: 600,
                fontSize: "2rem",
              }}
            >
              {selectedJob.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "0.45rem",
              }}
            >
              <p style={{ margin: 0, padding: 0 }}>
                <strong>{selectedJob.company}</strong> · {selectedJob.location}·{" "}
              </p>
              <p style={{ margin: 0, padding: 0, color: "#76838f" }}>
                5 days ago ·{" "}
                {selectedJob.appplications.length > 100 ? "Over" : ""}
                {selectedJob.appplications.length} applicants
              </p>
            </div>
          </div>
          <div>
            <p>
              <strong>Job Type:</strong> {selectedJob.jobType} -{" "}
              {selectedJob.employmentType}
            </p>
            <p>
              <strong>Company Size:</strong>{" "}
              {selectedJob.postedBy.companySize || "11-50 employees"}
            </p>
            <p>
              <strong>Skills Match:</strong>{" "}
              {`${getUserSkillsMatch()} of ${
                selectedJob.skills.length
              } skills match your profile - you may be a good fit`}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );

  const ApplicantsModal = ({ visible, onCancel, applicants }) => (
    <Modal
      title="Applicants"
      visible={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="back" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Table
        columns={applicantColumns}
        dataSource={applicants}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );

  return (
    <div>
      {user?.role == "company" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Button type="primary" onClick={showModal}>
            Post Job
          </Button>
        </div>
      )}

      <Row gutter={16} style={{ marginBottom: "20px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Jobs"
              value={statsData.totalJobs}
              prefix={<RiBriefcaseLine />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Applications"
              value={statsData.totalApplications}
              prefix={<RiUserFollowLine />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="New Jobs This Week"
              value={statsData.newJobsThisWeek}
              prefix={<RiNewspaperLine />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Companies"
              value={statsData.totalCompanies}
              prefix={<RiBuildingLine />}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Job Activity Section */}
      <Row gutter={16}>
        {/* Recent Activity Section */}
        <Col span={24}>
          <Card
            title="Recent Activity"
            bordered={false}
            style={{ marginBottom: 20 }}
          >
            <Timeline>
              {recentActivity.map((activity) => (
                <Timeline.Item key={activity.key}>
                  <p>
                    {activity.date} - {activity.content}
                  </p>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        <Col span={24}>
          <Card
            title={`${user.role === "user" ? "All Jobs" : "Your Posted Jobs"}`}
            bordered={false}
          >
            <Table columns={columns} dataSource={Data} />
          </Card>
        </Col>
      </Row>

      {/* Add Job Modal  */}
      <Modal
        title="Add Job"
        width={800}
        centered
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={
          <RiCloseFill className="remix-icon text-color-black-100" size={24} />
        }
      >
        <Form onFinish={addJob} layout="vertical" name="basic">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true }, { type: "string", min: 4 }]}
                label="Job Title"
                name="title"
              >
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true }, { type: "string", min: 4 }]}
                label="Location"
                name="Location"
              >
                <Input
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            rules={[{ required: true }, { type: "string", min: 350 }]}
            label="Description"
            name="description"
          >
            <TextArea
              rows={2}
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </Form.Item>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label="Skills"
                name="Skills"
                rules={[
                  {
                    required: true,
                    message: "Please input your skills!",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      const skillsArray = value
                        .split(",")
                        .map((skill) => skill.trim());
                      const validSkills = skillsArray.filter(
                        (skill) => skill.length > 0
                      );
                      if (validSkills.length < 3) {
                        return Promise.reject(
                          new Error(
                            "Please enter at least three comma-separated skills."
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  value={skills}
                  onChange={(e) => setskills(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please input job requirements!",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      const requirementsArray = value
                        .split(",")
                        .map((requirement) => requirement.trim());
                      const validRequirements = requirementsArray.filter(
                        (requirement) => requirement.length > 0
                      );
                      if (validRequirements.length < 2) {
                        return Promise.reject(
                          new Error(
                            "Please enter at least two comma-separated requirements like experience and age."
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                label="Requirements"
                name="Requirements"
              >
                <Input
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="Salary" name="" rules={[{ required: true }]}>
                <Input
                  value={salary}
                  onChange={(e) => setsalary(e.target.value)}
                  type="number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Employment Type" name="employmentType">
                <Select
                  defaultValue="Full-time"
                  options={[
                    { value: "Full-time", label: "Full-time" },
                    { value: "Part-time", label: "Part-time" },
                    { value: "Contract", label: "Contract" },
                    { value: "Internship", label: "Internship" },
                  ]}
                  value={employmentType}
                  onChange={(e) => setemploymentType(e)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12} span={24} className="hp-pr-sm-0 hp-pr-12">
              <Button block type="primary" htmlType="submit">
                Add
              </Button>
            </Col>

            <Col md={12} span={24} className="hp-mt-sm-12 hp-pl-sm-0 hp-pl-12">
              <Button block onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Job Details Modal */}
      <JobDetailsModal user={user} />

      {/* Job Applicants Modal */}
      {user.role === "company" && (
        <ApplicantsModal
          visible={isApplicantsModalVisible}
          onCancel={() => setIsApplicantsModalVisible(false)}
          applicants={applicants}
        />
      )}
    </div>
  );
}

export default JobPosts;
