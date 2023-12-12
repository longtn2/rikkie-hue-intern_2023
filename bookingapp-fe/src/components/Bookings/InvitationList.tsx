import { Button, Card, List, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { BookingData, DataType, HEADER } from "../../constant/constant";
import axios from "axios";
import { url } from "../../ultils/urlApi";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import DetailInvitation from "./DetailInvitation";
import getCookie from "../../Route/Cookie";
import InfoInvitation from "./InfoInvitation";

const InvitationList = () => {
  const [listInvitation, setListInvitation] = useState<BookingData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectInvite, setSelectInvite] = useState<BookingData>();
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false);

  const formatData = (data: any) => {
    const userId = parseInt(getCookie("id"), 10);
    const updatedData = data.map((item: BookingData) => {
      const user = item.booking_users.find(
        (user: DataType) => user.user_id === userId
      ) as unknown as DataType;
      return { ...item, status: user ? user.is_attending : null };
    });
    setListInvitation(updatedData);
  };
  const getDataInvitation = async () => {
    setLoading(true);
    try {
      await axios
        .get(`${url}/v1/user/view_list_invite`, {
          params: {
            page: currentPage,
            per_page: perPage,
          },
          withCredentials: true,
          headers: HEADER,
        })
        .then((response) => {
          formatData(response?.data?.data);
          setTotalItems(response?.data?.data?.total_items);
          setPerPage(response?.data?.data?.per_page);
        });
    } catch (error: any) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataInvitation();
  }, [currentPage, perPage]);
  const handleAccept = async (item: BookingData) => {
    if (item) {
      try {
        await axios
          .put(
            `${url}/v1/user/bookings/${item.booking_id}/confirm`,
            {},
            {
              headers: HEADER,
            }
          )
          .then((response) => {
            setListInvitation(response?.data?.data);
            setTotalItems(response?.data?.data?.total_items);
            setPerPage(response?.data?.data?.per_page);
            handleSuccessShow(response);
          });
      } catch (error: any) {
        handleErrorShow(error);
      }
    }
  };
  const handleReject = async (item: BookingData) => {
    if (item) {
      try {
        await axios
          .put(
            `${url}/v1/user/bookings/${item.booking_id}/decline`,
            {},
            {
              headers: HEADER,
            }
          )
          .then((response) => {
            setListInvitation(response?.data?.data);
            setTotalItems(response?.data?.data?.total_items);
            setPerPage(response?.data?.data?.per_page);
            handleSuccessShow(response);
          });
      } catch (error: any) {
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
  const handelModalViewDetail = (status: boolean) => {
    setIsModalDetail(status);
  };
  const handleViewDetail = (booking: BookingData) => {
    setSelectInvite(booking);
    handelModalViewDetail(true);
  };
  return (
    <>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="loading"
      >
        <List
          dataSource={listInvitation}
          pagination={pagination}
          renderItem={(item: BookingData) => (
            <List.Item>
              <Card
                className="item-booked"
                key={item.title}
                title={<div className="item-booked-title">{item.title}</div>}
              >
                <div className="item-booked-info">
                  <InfoInvitation data={item} />
                  <div className="container-button">
                    <Button
                      className="button-action"
                      onClick={() => {
                        handleViewDetail(item);
                      }}
                    >
                      VIEW DETAIL
                    </Button>
                    <Button
                      className="button-action"
                      style={{
                        backgroundColor:
                          item.status !== null && item.status
                            ? "green"
                            : "white",
                        color: item.status ? "white" : "black",
                      }}
                      onClick={() => {
                        handleAccept(item);
                      }}
                    >
                      COMFIRM
                    </Button>
                    <Button
                      className="button-action"
                      style={{
                        backgroundColor:
                          item.status !== null && !item.status
                            ? "red"
                            : "white",
                        color: !item.status ? "black" : "white",
                      }}
                      onClick={() => {
                        handleReject(item);
                      }}
                    >
                      DECLINE
                    </Button>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Spin>

      <Modal
        open={isModalDetail}
        onCancel={() => handelModalViewDetail(false)}
        width={"80%"}
        footer={[]}
      >
        <DetailInvitation selectInvite={selectInvite} />
      </Modal>
    </>
  );
};

export default InvitationList;
