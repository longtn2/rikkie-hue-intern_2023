import React, { useEffect, useState } from "react";
import { BookingData, DataType, HEADER } from "../../constant/constant";
import { Card, Col, Modal, Row, Spin, Table } from "antd";
import "./Booking.css";
import axios from "axios";
import { url } from "../../ultils/urlApi";
import { ColumnsType } from "antd/es/table";
import { handleErrorShow } from "../../ultils/ultilsApi";
import InfoInvitation from "./InfoInvitation";
import BtnAccept from "./BtnAccept";
import BtnReject from "./BtnReject";
interface DetailBookingWaitProps {
  selectBooking: BookingData | undefined;
  handleAction: (selectBooking: BookingData, key: string) => void;
}
const DetailBookingWait: React.FC<DetailBookingWaitProps> = ({
  selectBooking,
  handleAction,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listUsers, setListUsers] = useState<DataType[]>([]);
  useEffect(() => {
    getUser();
  }, [selectBooking]);
  const getUser = async () => {
    if (selectBooking) {
      try {
        setLoading(true);
        const userPromises = selectBooking.user_ids.map(
          async (userId: number) => {
            const response = await axios.get(`${url}/v1/users/${userId}`, {
              withCredentials: true,
              headers: HEADER,
            });
            return response.data.data;
          }
        );
        const userDataArray = await Promise.all(userPromises);
        setListUsers(userDataArray);
      } catch (error) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
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
  ];
  const handleSelectAction = (selectBooking: BookingData, key: string) => {
    if (selectBooking) {
      key === "accept"
        ? handleAction(selectBooking, "accept")
        : handleAction(selectBooking, "reject");
    }
  };

  return (
    <div>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="spin-loading"
      >
        <Card
          className="item-booking-wait"
          key={selectBooking!.title}
          title={
            <div className="title-booking-wait">{selectBooking!.title}</div>
          }
        >
          <div className="info-booking-wait">
            <InfoInvitation data={selectBooking} />
            <Row className="container-btn">
              <Col>
                <BtnAccept
                  selectBooking={selectBooking}
                  handleSelectAction={async () =>
                    handleSelectAction(selectBooking!, "accept")
                  }
                />
              </Col>
              <Col>
                <BtnReject
                  selectBooking={selectBooking}
                  handleSelectAction={async () =>
                    handleSelectAction(selectBooking!, "reject")
                  }
                />
              </Col>
            </Row>
          </div>
        </Card>
        <Table className="list-user" columns={columns} dataSource={listUsers} />
      </Spin>
    </div>
  );
};
export default DetailBookingWait;
