import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Space,
  Card,
  List,
  Avatar,
  Select,
  Table,
  Tag,
  message,
  Modal,
} from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import JobConnectLogo from "../../../assets/images/logo/logo2.jpeg";
import HeroImage from "../../../assets/images/logo/hero.jpg";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logoutUser } from "../../../redux/auth/authActions";
import axios from "axios";

const jobsData = [
  {
    key: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcTWEl75mWeOwltCfCd86KFLPX-nyq8pPMLOvGyzJGA&s",
    title: "Data Analyst",
    company: "Jobia Ltd",
    jobType: "Full-Time",
    location: "Karachi",
    salary: "90000",
    postedDate: "01 Jan 2024",
    description:
      "As a Data Analyst at Jobia Ltd, you will be instrumental in interpreting data and analyzing the results using statistical techniques. Your primary goal will be to help our company analyze trends to make better decisions and provide strategic business insights. You will develop analysis and reporting capabilities while also monitoring performance and quality control plans to identify improvements. You will work closely with our teams to prioritize business needs, manage data analytics, ensure data accuracy, and create dashboards that will aid in decision-making processes. By interpreting data to discover patterns and trends, your role will be central in transforming raw data into vital business strategies.",
  },
  {
    key: "2",
    image:
      "https://media.designrush.com/agencies/169650/conversions/Folio3-logo-profile.jpg", // Replace with actual image paths
    title: "Mechanical Engineer",
    company: "Jobia Ltd",
    jobType: "Full-Time",
    location: "Karachi",
    salary: "90000",
    postedDate: "01 Jan 2024",
    description:
      "The Mechanical Engineer role at Jobia Ltd involves the application of engineering principles to design products and systems that will meet the company's needs. You will be expected to conduct experiments methodically, analyze data and interpret results, which will involve complex problem-solving skills. Your daily tasks will include designing, fabricating, and testing machine parts and systems, and developing blueprints using Computer Aided Design (CAD). Collaboration with project managers and other engineers to ensure the reliability and quality of products is key, as is adhering to budgets and timelines. You will be the cornerstone in bringing to life the mechanical aspects of our innovative solutions.",
  },
  {
    key: "3",
    image: "https://www.netapp.com/media/Zones-logo_tcm19-33314.png?v=89106", // Replace with actual image paths
    title: "Graphic Designer",
    company: "Creative Souls",
    jobType: "Part-Time",
    location: "Karachi",
    salary: "15000",
    postedDate: "02 Jan 2024",
    description:
      "As a Graphic Designer with Creative Souls, your creative skills will be put to the test as you work to develop visual stories that resonate with our audiences. You'll collaborate with a dynamic team to craft designs that effectively communicate brand messages and create impactful visual communications. Your role involves creating concepts, graphics, and layouts for product illustrations, company logos, websites, and social media. Your artistic touch will be seen across various media as you work to understand project needs, conceptualize creative ideas, and deliver aesthetically pleasing design solutions. Precision in design and attention to detail are crucial, as is the ability to manage time effectively to meet deadlines.",
  },
  {
    key: "4",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_nEz9QTpzbwsTAgKs_Pj6Vjty8EJjGwQXwHqZKfSZA&s", // Replace with actual image paths
    title: "Software Developer",
    company: "ZepTo Systems",
    jobType: "Full-Time",
    location: "Karachi",
    salary: "dd",
    postedDate: "03 Jan 2024",
    description:
      "ZepTo Systems is looking for a Software Developer with a passion for coding and a knack for creating intuitive user experiences. You will be involved in the design, development, and deployment of software solutions that drive our business operations. Your responsibilities will include writing clean, scalable code using .NET programming languages, revising, updating, refactoring and debugging code, and developing documentation throughout the software development life cycle (SDLC). This role demands a strong understanding of structural patterns and a commitment to collaborative problem-solving, sophisticated design, and quality product creation. You will contribute to a team-oriented environment and use your technical expertise to tackle complex problems and produce innovative solutions.",
  },
  {
    key: "5",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_nEz9QTpzbwsTAgKs_Pj6Vjty8EJjGwQXwHqZKfSZA&s", // Replace with actual image paths
    title: "Software Developer",
    company: "ZepTo Systems",
    jobType: "Full-Time",
    location: "Karachi",
    salary: "dd",
    postedDate: "03 Jan 2024",
    description:
      "The Software Developer position at ZepTo Systems is a challenging role that offers the opportunity to engage with the full spectrum of software development activities. From establishing and analyzing user requirements to developing software system plans, you'll work closely with our product teams and other developers. Your role includes writing and testing code, refining and rewriting it as necessary, and communicating with any programmers involved in the project. Additionally, you will be expected to research, design, and write new software programs, evaluate the software and systems that make computers and hardware work, and integrate existing software products to create a new system. Your innovative solutions will be integral to the company’s growth and success.",
  },
  {
    key: "6",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV6Z9YqR3oYNJGvUugoeZtnmrY537XjKtKxjBuYkabzg&s", // Replace with actual image paths
    title: "Software Engineer",
    company: "Arbisoft",
    jobType: "Full-Time",
    location: "Karachi",
    salary: "150000",
    postedDate: "03 Jan 2024",
    description:
      "As a Software Engineer at Arbisoft, you will play a pivotal role in developing cutting-edge software that pushes the boundaries of technology. You will be tasked with designing, developing, and installing software solutions that align with our business goals and meet customer needs. Your responsibilities will include writing well-designed, testable code, developing software verification plans, and quality assurance procedures. The position demands a high level of technical expertise, including the ability to model and design complex systems and manage multiple projects in a fast-paced environment. You will collaborate with other team members to set specifications for new applications and lead the entire software development life cycle, from concept to deployment and maintenance.",
  },
];

function HomePage() {
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const [Data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/v1/jobPost/getAllJobs`
      );
      setData(response?.data);
    } catch (error) {
      console.error("Error fetching projects:", error?.message);
    }
  };

  const handleSearch = () => {
    document.getElementById("job-table").scrollIntoView({ behavior: "smooth" });
  };

  const getFilteredData = (data, searchText) => {
    return data.filter((job) =>
      Object.keys(job).some((key) =>
        String(job[key]).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const filteredData = useMemo(
    () => getFilteredData(Data, searchText),
    [Data, searchText]
  );

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
        message.error("You have already applied for this job!");
      }
      fetchData();
    } catch (error) {
      console.error("Error applying for job:", error?.message);
      message.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = () => {
    dispatch(logoutUser());
  };

  const showModal = (job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const columns = [
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
          <Tag color={record?.appplications?.length > 0 ? "green" : "red"}>
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
            <Button onClick={() => showModal(record)}>Details</Button>
          </Space>
        );
      },
    },
  ];

  const JobDetailsModal = () => (
    <Modal
      title="Job Details"
      visible={isModalVisible}
      onOk={() => setIsModalVisible(false)}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsModalVisible(false)}>
          Return
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={() => {
            if (isLoggedIn) {
              applyForJob(selectedJob.id);
              setIsModalVisible(false);
            } else {
              message.error(
                "Please log in with your account to apply for the job."
              );
            }
          }}
        >
          Apply Now
        </Button>,
      ]}
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
                <strong>{selectedJob.company}</strong> · {selectedJob.location}{" "}
                ·
              </p>
              <p style={{ margin: 0, padding: 0, color: "#76838f" }}>
                5 days ago · Over 100 applicants
              </p>
            </div>
          </div>
          <div>
            <p>
              <strong>Job Type:</strong> {selectedJob.jobType} -{" "}
              {selectedJob.location}
            </p>
            <p>
              <strong>Company Size:</strong>{" "}
              {selectedJob.companySize || "11-50 employees"}
            </p>
            <p>
              <strong>Skills Match:</strong>{" "}
              {selectedJob.skillsMatch ||
                "8 of 10 skills match your profile - you may be a good fit"}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <main>
      <header
        style={{
          width: "100%",
          padding: "1rem",
          position: "sticky",
          top: 0,
          left: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          zIndex: 1000,
          backgroundColor: "#fff",
        }}
      >
        <img
          style={{
            width: "4rem",
            borderRadius: "50%",
          }}
          src={JobConnectLogo}
          alt="logo"
          onClick={() => history.push("/")}
        />
        <nav>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              textTransform: "uppercase",
              columnGap: "2rem",
              fontSize: "1.2rem",
              fontWeight: 500,
            }}
          >
            <li>
              <Link
                to="#"
                style={{
                  color: "black",
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                style={{
                  color: "black",
                }}
              >
                Find a Job
              </Link>
            </li>
            <li>
              <Link
                style={{
                  color: "black",
                }}
                to="#"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                style={{
                  color: "black",
                }}
                to="#"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        <nav>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              textTransform: "uppercase",
              columnGap: "2rem",
              fontSize: "1.2rem",
              fontWeight: 500,
            }}
          >
            {!isLoggedIn && (
              <>
                <li>
                  <Link
                    style={{
                      color: "black",
                    }}
                    to="/pages/authentication/login"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    style={{
                      color: "black",
                    }}
                    to="/pages/authentication/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    style={{
                      color: "black",
                    }}
                    to="/pages/workspace"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    style={{
                      color: "black",
                    }}
                    to="/pages/authentication/login"
                    onClick={logout}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <section
        style={{
          padding: "3.5rem 6rem",
          display: "flex",
          columnGap: "5rem",
        }}
      >
        <div
          style={{
            flex: 0.6,
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
        >
          <h1
            style={{
              fontSize: "6rem",
              lineHeight: "6rem",
              margin: 0,
              padding: 0,
            }}
          >
            The Easy Way To Get Your New Job
          </h1>

          <p
            style={{
              margin: 0,
              padding: 0,
              fontSize: "1.5rem",
              textAlign: "justify",
            }}
          >
            Jobia provides a platform for both job seekers and organizations to
            fulfill their needs. The portal provides employment opportunities to
            the job seekers and reduces the effort of searching job of desired
            position. It facilitates the organization by filtering all the
            appropriate resumes according to the job description which
            eventually minimizes human resource work and screening process.
          </p>

          <div style={{ display: "flex", columnGap: "2rem" }}>
            <Input
              style={{ flex: 0.5 }}
              size="middle"
              placeholder="Keywords such as jobs etc"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              style={{ flex: 0.5 }}
              showSearch
              placeholder="Select Experience"
              optionFilterProp="children"
              onChange={(value) => setSearchText(value)}
              onSearch={onSearch}
              filterOption={filterOption}
              options={[
                { value: "", label: "" },
                {
                  value: "1y",
                  label: "1 Year",
                },
                {
                  value: "2y",
                  label: "2 Years",
                },
                {
                  value: "3y",
                  label: "3 Years",
                },
                {
                  value: "4y",
                  label: "4 Years",
                },
                {
                  value: "5y",
                  label: "5+ Years",
                },
              ]}
            />
          </div>

          <div style={{ display: "flex", columnGap: "2rem" }}>
            <Input
              style={{ flex: 0.5 }}
              size="middle"
              placeholder="Select Location"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              style={{ flex: 0.5 }}
              showSearch
              placeholder="Select Job Location"
              optionFilterProp="children"
              onChange={(value) => setSearchText(value)}
              onSearch={onSearch}
              filterOption={filterOption}
              options={[
                { value: "", label: "" },
                { value: "Karachi", label: "Karachi" },
                { value: "Lahore", label: "Lahore" },
                { value: "Islamabad", label: "Islamabad" },
                { value: "Faisalabad", label: "Faisalabad" },
                { value: "Rawalpindi", label: "Rawalpindi" },
                { value: "Multan", label: "Multan" },
                { value: "NYC", label: "New York City" },
                { value: "Los Angeles", label: "Los Angeles" },
                { value: "Chicago", label: "Chicago" },
                { value: "Houston", label: "Houston" },
                { value: "Phoenix", label: "Phoenix" },
                { value: "Philadelphia", label: "Philadelphia" },
                { value: "Sydney", label: "Sydney" },
                { value: "Melbourne", label: "Melbourne" },
                { value: "Brisbane", label: "Brisbane" },
                { value: "Perth", label: "Perth" },
                { value: "Adelaide", label: "Adelaide" },
                { value: "Canberra", label: "Canberra" },
              ]}
            />
          </div>

          <div>
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>

          <div>
            <p
              style={{
                margin: 0,
                padding: 0,
                fontSize: "1.5rem",
                textAlign: "justify",
              }}
            >
              Tending Keywords: UI designer, Web Developer, Graphic Designer
            </p>
          </div>
        </div>

        <div style={{ flex: 0.4 }}>
          <img
            src={HeroImage}
            style={{ width: "100%", height: "40rem", borderRadius: "12px" }}
            alt="hero-image"
          />
        </div>
      </section>

      <section
        style={{
          padding: "3.5rem 6rem",
          display: "flex",
          columnGap: "5rem",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Contour
          </p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYcTWEl75mWeOwltCfCd86KFLPX-nyq8pPMLOvGyzJGA&s"
            alt="contour-logo"
            style={{ width: "5rem" }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Folio3
          </p>
          <img
            src="https://media.designrush.com/agencies/169650/conversions/Folio3-logo-profile.jpg"
            alt="folio3-logo"
            style={{ width: "5rem" }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Zones, LLC
          </p>
          <img
            src="https://www.netapp.com/media/Zones-logo_tcm19-33314.png?v=89106"
            alt="zones-llc-logo"
            style={{ width: "5rem" }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.2rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Creative <br /> Souls
          </p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_nEz9QTpzbwsTAgKs_Pj6Vjty8EJjGwQXwHqZKfSZA&s"
            alt="cs-logo"
            style={{ width: "4rem" }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            ZEPTO <br /> SYSTEMS
          </p>
          <img
            src="https://zeptosystems.com/wp-content/uploads/2021/11/zepto-large.png"
            alt="zs-logo"
            style={{ width: "5rem" }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            backgroundColor: "#fff",
            width: "10rem",
            height: "10rem",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              margin: 0,
              padding: 0,
              fontWeight: 600,
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            arbisoft
          </p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV6Z9YqR3oYNJGvUugoeZtnmrY537XjKtKxjBuYkabzg&s"
            alt="arbisoft-logo"
            style={{ width: "5rem" }}
          />
        </div>
      </section>

      <section>
        <Input
          placeholder="Search jobs"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200, marginBottom: 16, float: "right" }}
          prefix={<SearchOutlined />}
        />
        <Table
          id="job-table"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
        />
        <JobDetailsModal />
      </section>
    </main>
  );
}

export default HomePage;
