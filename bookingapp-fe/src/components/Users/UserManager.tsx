import { Tag, Space, Modal, Button, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { url } from "../../ultils/urlApi";
import FormAdd from "./FormAdd";
import { DataType, HEADER, TYPE_USER } from "../../constant/constant";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import FormEdit from "./FormEdit";

const UsersManager = () => {
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType>();
  const [perPage, setPerPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(url + "/v1/users", {
          params: {
            page: currentPage,
            per_page: perPage,
          },
          withCredentials: true,
          headers: HEADER,
        })
        .then((response) => {
          setListUsers(response.data.data.users);
          setTotalItems(response.data.data.total_items);
          setPerPage(response.data.data.per_page);
        });
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (value: string) => {
    if (value.length === 0) {
      getData();
    } else {
      try {
        await axios
          .get(url + "/v1/users/search", {
            params: {
              search: value,
            },
            headers: HEADER,
          })
          .then((response) => {
            setListUsers(response.data.data.users);
            setTotalItems(response.data.data.total_items);
          });
      } catch (error) {
        handleErrorShow(error);
      }
    }
  };
  const handleEditUser = (editUser: DataType) => {
    if (selectedUser) {
      setListUsers((prevListUsers) =>
        prevListUsers.map((user) =>
          user.user_id === selectedUser.user_id
            ? { ...user, ...editUser }
            : user
        )
      );
    }
  };

  const handleDelete = (_id: any) => {
    if (selectedUser) {
      try {
        axios
          .delete(url + "/v1/users/" + selectedUser.user_id, {
            headers: HEADER,
          })
          .then((response) => {
            setListUsers(response.data.users);
            handleSuccessShow(response);
            setIsModalDeleteOpen(false);
            getData();
          });
      } catch (error) {
        handleErrorShow(error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const newPerPage = pageSize;
    const newCurrentPage =
      Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
    setCurrentPage(newCurrentPage);
  };
  const pagination = {
    current: currentPage,
    pageSize: perPage,
    total: totalItems,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
  };
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
            let color = role_name === TYPE_USER.ADMIN ? "pink" : "green";
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
          <EditOutlined onClick={() => handleSelectUser(user)} />
          <DeleteOutlined onClick={() => handleToggleDelete(user)} />
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalDeleteOpen(false);
    handleModalEditUser(false);
    handleModalAddUser(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleAddUser = (user: DataType) => {
    const users = { ...user, role_name: [""] };
    const listUserSet = listUsers.concat(users);
    setListUsers(listUserSet);
  };
  const handleModalAddUser = (status: boolean) => {
    setIsModalOpen(status);
  };
  const handleModalEditUser = (status: boolean) => {
    setIsModalEditOpen(status);
  };
  const handleToggleDelete = (user: DataType) => {
    setSelectedUser(user);
    setIsModalDeleteOpen(true);
  };
  const handleSelectUser = (user: DataType) => {
    handleModalEditUser(true);
    setSelectedUser(user);
  };

  return (
    <>
      <div className="header-component">
        <h1 className="component-name">User Manager</h1>
      </div>
      <Space className="search">
        <Search
          placeholder="Search..."
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
        <Button type="primary" onClick={showModal}>
          Add New User
        </Button>
      </Space>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="spin-loading"
      >
        <Table
          columns={columns}
          dataSource={listUsers}
          pagination={pagination}
        />
      </Spin>

      <Modal
        title="User Infomation"
        destroyOnClose={true}
        open={isModalOpen}
        footer={[]}
        onCancel={handleCancel}
      >
        <FormAdd
          onModalAddUser={handleModalAddUser}
          onAddUser={handleAddUser}
        />
      </Modal>

      <Modal
        title="Edit User Information"
        className="small-modal"
        open={isModalEditOpen}
        destroyOnClose={true}
        footer={[]}
        onCancel={handleCancel}
      >
        <FormEdit
          onModalEditUser={handleModalEditUser}
          data={selectedUser}
          onEditUser={handleEditUser}
        />
      </Modal>

      <Modal
        title="Delete"
        open={isModalDeleteOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Confirm delete this user ??</p>
      </Modal>
    </>
  );
};

export default UsersManager;
