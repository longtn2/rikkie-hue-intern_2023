import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../ultils/urlApi";
import { BookingData, HEADER } from "../../constant/constant";
<<<<<<< HEAD
import { Button, Card, Descriptions, List, Modal, Spin } from "antd";
import "./Booking.css";
import { formatDate, formatTime } from "../../ultils/ultils";
import DetailBookingWait from "./DetailBookingWait";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
=======
import "./Booking.css";
import DetailBookingWait from "./DetailBookingWait";
import { Button, Card, List, Modal, Spin } from "antd";
import { handleErrorShow, handleSuccessShow } from "../../ultils/ultilsApi";
import InfoInvitation from "./InfoInvitation";
>>>>>>> 066d471 (WIBA-534 ui waiting booking list)

const WaitingBookingList = () => {
  const [listBooking, setListBooking] = useState<BookingData[]>([]);
  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectBooking, setSelectBooking] = useState<BookingData>();
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false);
  const [isModalAction, setIsModalAction] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    getData();
  }, [currentPage, perPage]);
  const getData = async () => {
    setLoading(true);
    try {
      await axios
        .get(`${url}/v1/admin/view_booking_pending`, {
          params: {
            page: currentPage,
            per_page: perPage,
          },
          withCredentials: true,
          headers: HEADER,
        })
        .then((response) => {
          setListBooking(response?.data?.data?.list_bookings);
          setTotalItems(response?.data?.data?.total_items);
          setPerPage(response?.data?.data?.per_page);
        });
    } catch (error) {
      handleErrorShow(error);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
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
  const customLabelStyle = {
    fontWeight: "bold",
    marginRight: "8px",
    color: "black",
  };
  const customContentStyle = {
    display: "flex",
    justifyContent: "end",
    marginRight: 100,
  };
  const handelViewDetail = (status: boolean) => {
    setIsModalDetail(status);
  };
  const handleModalAction = (status: boolean) => {
    setIsModalAction(status);
  };
  const handleShowModalAction = (booking: BookingData, key: string) => {
    setSelectBooking(booking);
    if (key === "view") {
      handelViewDetail(true);
    } else {
      handleModalAction(true);
      Modal.confirm({
        title: key,
        content:
          key === "accept" ? (
            <p>Are you sure to accept this booking?</p>
          ) : (
            <p>Are you sure to reject this booking?</p>
          ),
        okText: key,
        open: isModalAction,
        onOk: () => handleAction(key),
      });
    }
  };
  const handleAction = async (key: string) => {
    if (selectBooking) {
      try {
        setLoading(true);
        await axios
          .put(
            `${url}/v1/bookings/${selectBooking.booking_id}/${key}`,
            {},
            {
              headers: HEADER,
            }
          )
          .then((response) => {
            setListBooking(response?.data?.data?.list_bookings);
            handleSuccessShow(response);
            handleModalAction(false);
            getData();
          });
      } catch (error: any) {
        handleErrorShow(error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <div className="header-component">
        <h1 className="component-name">List of waiting booking</h1>
      </div>
      <Spin
        spinning={loading}
        size="large"
        tip="Loading..."
        className="loading"
      >
        <List
          dataSource={listBooking}
          pagination={pagination}
          renderItem={(item: BookingData) => (
            <List.Item>
              <Card
                className="item-booking-wait"
                key={item.title}
                title={<div className="title-booking-wait">{item.title}</div>}
              >
                <div className="info-booking-wait">
                  <Descriptions
                    className="detail-booking-wait"
                    layout="horizontal"
                    column={2}
                  >
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="ROOM"
                    >
                      {item.room_name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="DATE"
                    >
                      {formatDate(item.time_start)}
                    </Descriptions.Item>
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="CREATOR"
                    >
                      {item.creator_name}
                    </Descriptions.Item>
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="TOTAL PARTICIPATIONS"
                    >
                      {item.user_ids.length}
                    </Descriptions.Item>
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="TIME START"
                    >
                      {formatTime(item.time_start)}
                    </Descriptions.Item>
                    <Descriptions.Item
                      labelStyle={customLabelStyle}
                      contentStyle={customContentStyle}
                      label="TIME END"
                    >
                      {formatTime(item.time_end)}
                    </Descriptions.Item>
                  </Descriptions>
                  <div className="container-btn">
                    <Button
                      className="btn-action btn--view"
                      onClick={() => {
                        handleShowModalAction(item, "view");
                      }}
                    >
                      VIEW DETAIL
                    </Button>
                    <Button
                      className="btn-action btn--accept"
                      onClick={() => {
                        handleShowModalAction(item, "accept");
                      }}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      className="btn-action btn--reject"
                      onClick={() => {
                        handleShowModalAction(item, "reject");
                      }}
                    >
                      REJECT
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
        onCancel={() => handelViewDetail(false)}
        width={"80%"}
        footer={[]}
      >
        <DetailBookingWait
          onChange={handelViewDetail}
          selectBooking={selectBooking}
        />
      </Modal>
    </div>
  );
};

=======
    const handelViewDetail = (status: boolean) => {
      setIsModalDetail(status);
    };
    const handleModalAction = (status: boolean) => {
      setIsModalAction(status);
    };
    const handleShowModalAction = (booking: BookingData, key: string) => {
      setSelectBooking(booking);
      if (key === "view") {
        handelViewDetail(true);
      } else {
        handleModalAction(true);
        Modal.confirm({
          title: key,
          content:
            key === "accept" ? (
              <p>Are you sure to accept this booking?</p>
            ) : (
              <p>Are you sure to reject this booking?</p>
            ),
          okText: key,
          open: isModalAction,
          onOk: () => handleAction(key),
        });
      }
    };
    const handleAction = async (key: string) => {
      if (selectBooking) {
        try {
          setLoading(true);
          await axios
            .put(
              `${url}/v1/bookings/${selectBooking.booking_id}/${key}`,
              {},
              {
                headers: HEADER,
              }
            )
            .then((response) => {
              setListBooking(response?.data?.data?.list_bookings);
              handleSuccessShow(response);
              handleModalAction(false);
              getData();
            });
        } catch (error: any) {
          handleErrorShow(error);
        } finally {
          setLoading(false);
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
    return (
      <div>
        <div className="header-component">
          <h1 className="component-name">List of waiting booking</h1>
        </div>
        <Spin
          spinning={loading}
          size="large"
          tip="Loading..."
          className="loading"
        >
          <List
            dataSource={listBooking}
            pagination={pagination}
            renderItem={(item: BookingData) => (
              <List.Item>
                <Card
                  className="item-booking-wait"
                  key={item.title}
                  title={<div className="title-booking-wait">{item.title}</div>}
                >
                  <div className="info-booking-wait">
                    <InfoInvitation data={item} />
                    <div className="container-btn">
                      <Button
                        className="btn-action btn--view"
                        onClick={() => {
                          handleShowModalAction(item, "view");
                        }}
                      >
                        VIEW DETAIL
                      </Button>
                      <Button
                        className="btn-action btn--accept"
                        onClick={() => {
                          handleShowModalAction(item, "accept");
                        }}
                      >
                        ACCEPT
                      </Button>
                      <Button
                        className="btn-action btn--reject"
                        onClick={() => {
                          handleShowModalAction(item, "reject");
                        }}
                      >
                        REJECT
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
          onCancel={() => handelViewDetail(false)}
          width={"80%"}
          footer={[]}
        >
          <DetailBookingWait
            onChange={handelViewDetail}
            selectBooking={selectBooking}
          />
        </Modal>
      </div>
    );
  };
};
>>>>>>> 066d471 (WIBA-534 ui waiting booking list)
export default WaitingBookingList;
