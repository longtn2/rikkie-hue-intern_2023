import React, { useEffect, useState } from "react";
import { BookingData, DataType, HEADER } from "../../constant/constant";
import { Card, Spin, Table } from "antd";
import "./Booking.css";
import axios from "axios";
import { url } from "../../ultils/urlApi";
import { ColumnsType } from "antd/es/table";
import { handleErrorShow } from "../../ultils/ultilsApi";
import InfoInvitation from "./InfoInvitation";
import BtnAccept from "./BtnAccept";
import BtnReject from "./BtnReject";
import "./Booking.css";
interface DetailBookingWaitProps {
  selectBooking: BookingData | undefined;
  onChange: (status: boolean) => void;
  onSucces: (booking: BookingData | undefined) => Promise<void>;
  onReject: (booking: BookingData | undefined) => Promise<void>;

}
const DetailBookingWait: React.FC<DetailBookingWaitProps> = ({
  selectBooking,
  onChange,
  onSucces,
  onReject,
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
              headers: HEADER
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
  useEffect(() => {
    getUser();
  }, []);
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

  return (
    <div>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="loading"
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
            <div className="group-btn-action">
              <BtnAccept
                selectBooking={selectBooking}
                onChange={onChange}
                onSucces={onSucces}
              />
              <BtnReject
                selectBooking={selectBooking}
                onChange={onChange}
                onReject={onReject}
              />
            </div>
          </div>
        </Card>
        <Table className="list-user" columns={columns} dataSource={listUsers} />
      </Spin>
  </div>
  );
};

export default DetailBookingWait;
