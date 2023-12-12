import { Button, Descriptions, Image, Modal, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { DataType, HEADER } from "../../constant/constant";
import { url } from "../../ultils/urlApi";
import { handleErrorShow } from "../../ultils/ultilsApi";

import avatar from "../../../public/avatar.png";
import "./InfoAccount.css";
import getCookie from "../../Route/Cookie";
import FormEdit from "../Users/FormEdit";

const InfoUser = () => {
  const [infoUser, setInfoUser] = useState<DataType>();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const id = getCookie("id");
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get(url + "/v1/users/" + id, {
          withCredentials: true,
          headers: HEADER,
        })
        .then((response) => {
          setInfoUser(response.data.data);
        });
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (editUser: DataType) => {
    if (editUser) {
      setInfoUser((prevUser: any) => ({
        ...prevUser,
        ...editUser,
      }));
    }
  };
  const handleModalEditUser = (status: boolean) => {
    setIsModalEditOpen(status);
  };
  const customLabelStyle = {
    fontWeight: "bold",
    marginRight: "8px",
    color: "black",
  };
  const customContentStyle = {
    display: "flex",
    justifyContent: "end",
    marginRight: 50,
  };
  return (
    <>
      <h1 className="component-name">Account information</h1>
      <div className="show-info">
        <Spin
          spinning={loading}
          size="large"
          tip="Loading..."
          className="loading"
        >
          <Descriptions className="info-detail" layout="horizontal" column={1}>
            <Descriptions.Item
              contentStyle={customContentStyle}
              labelStyle={customLabelStyle}
              label="User Name"
            >
              {infoUser?.user_name}
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={customContentStyle}
              labelStyle={customLabelStyle}
              label="Email"
            >
              {infoUser?.email}
            </Descriptions.Item>
            <Descriptions.Item
              contentStyle={customContentStyle}
              labelStyle={customLabelStyle}
              label="Phone number"
            >
              {infoUser?.phone_number}
            </Descriptions.Item>
            <Descriptions.Item>
              <div className="btn-edit-info">
                <Button
                  style={{ marginTop: 20 }}
                  type="primary"
                  htmlType="submit"
                  onClick={() => handleModalEditUser(false)}
                >
                  Edit
                </Button>
              </div>
            </Descriptions.Item>
          </Descriptions>
          <Image width={200} src={avatar} />
        </Spin>
      </div>
      <Modal
        title="Edit User Information"
        open={isModalEditOpen}
        destroyOnClose={true}
        footer={[]}
        onCancel={() => handleModalEditUser(false)}
        style={{ width: "500px", textAlign: "center" }}
      >
        <FormEdit
          onModalEditUser={handleModalEditUser}
          data={infoUser}
          onEditUser={handleEditUser}
        />
      </Modal>
    </>
  );
};

export default InfoUser;
