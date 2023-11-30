import {
  Tag,
  Space,
  Button,
  Spin,
} from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import axios from "axios";
import getCookie from "../route/Cookie";
import Search from "antd/es/input/Search";
import { SearchOutlined } from "@ant-design/icons";

const UsersManager = () => {
  const token = getCookie("token");
  const url = "https://e920-117-2-6-32.ngrok-free.app";
  interface DataType {
    user_id: number;
    role_id: number[];
    user_name: string;
    role_name: string[];
    phone_number: string;
    email: string;
    is_deleted: boolean;
  }

  const [list_users, setListUsers] = useState([] as DataType[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/users", {
          params: {
            page: currentPage,
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setListUsers(res.data.data.users);
        });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);
  const columns: ColumnsType<DataType> = [
    {
      align: "center",
      title: "User ID",
      key: "user_id",
      dataIndex: "user_id",
    },
    {
      align: "center",
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      align: "center",
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      align: "center",
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      align: "center",
      title: "Role Name",
      dataIndex: "role_name",
      render: (_, { role_name }) => (
        <>
          {role_name.map((role_name, key) => {
            let color = role_name === "admin" ? "pink" : "green";
            return (
              <Tag color={color} key={key}>
                {role_name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },

    {
      align: "center",
      title: "Action",
      key: "action",
      render: (_text, user) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      getData();
    } else {
      await axios
        .get(`${url}/v1/users/search`, {
          params: {
            search: value,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            'ngrok-skip-browser-warning': true

          },
        })
        .then((response) => {
          setListUsers(response.data.data.users);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      {loading ? (
        <Spin
        size="large"
        tip="Loading..."
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "24px",
          color: "#ff0000",
        }}
      />
      ) : (
        <>
          <Space
            style={{
              marginBottom: 20,
              justifyContent: "space-between",
              columnGap: 20,
              width: "100%",
            }}
            className="search"
          >
            <Search
              placeholder="Search..."
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
            <Button type="primary">
              Add New User
            </Button>
          </Space>

          <Table columns={columns} dataSource={list_users} pagination={{}} />       
         
        </>
      )}
    </>
  );
};

export default UsersManager;
