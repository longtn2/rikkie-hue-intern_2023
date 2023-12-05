import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { url } from '../ultils/urlApi';
import { BookingData, token } from '../constant/constant';
import { Card, Descriptions, List, Tag } from 'antd';
import moment from 'moment';
import "./Booking.css"

const ListBookingOfUser = () => {
    const [listBooking, setListBooking] = useState<BookingData[]>([])
    const [perPage, setPerPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const getData = async () => {
        setLoading(true);
        try {
            await axios
                .get(url + "/v1/user/view_booked", {
                    params: {
                        page: currentPage,
                        per_page: perPage,
                    },
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setListBooking(response.data.data.list_bookings);
                    setTotalItems(response.data.data.total_items);
                    setPerPage(response.data.data.per_page);
                });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getData();
    }, [currentPage, perPage]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log(currentPage)
    };
    const handlePageSizeChange = (pageSize: number) => {
        const newPerPage = pageSize;
        const newCurrentPage =
            Math.ceil(((currentPage - 1) * perPage) / newPerPage) + 1;
        setCurrentPage(newCurrentPage);
        console.log(newCurrentPage)
    };
    const pagination = {
        current: currentPage,
        pageSize: perPage,
        total: totalItems,
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
    };
const customLabelStyle = {
        fontWeight: 'bold',
        marginRight: '8px',
        color: 'black'
    };
    const customContentStyle = {
        display: 'flex',
        justifyContent: 'end',
        marginRight: 100
    };

    return (
        <div>
            <h1 className='component-name'>List of scheduled meetings</h1>
            <List
                dataSource={listBooking}
                pagination={pagination}
                renderItem={(item: BookingData) => (
                    <List.Item>
                        <Card
                            className='item-booked'
                            key={item.title}
                            title={<div className='title-booked'>{item.title}</div>}
                        >
                            <div className='info-booked'>
                                <Descriptions className='detail-booked' layout="horizontal" column={2} >
                                    <Descriptions.Item labelStyle={customLabelStyle} contentStyle={customContentStyle} label="ROOM">{item.room_name} </Descriptions.Item>
                                    <Descriptions.Item labelStyle={customLabelStyle} contentStyle={customContentStyle} label="DATE"> {moment(item.time_start).format('DD/MM/YYYY')} </Descriptions.Item>
                                    <Descriptions.Item labelStyle={customLabelStyle} contentStyle={customContentStyle} label="TOTAL PARTICIPATIONS">{(item.user_name)} </Descriptions.Item>
                                    <Descriptions.Item labelStyle={customLabelStyle} contentStyle={customContentStyle} label="TIME START"> {moment(item.time_start).format('HH:mm')} </Descriptions.Item>
                                    <Descriptions.Item>  </Descriptions.Item>
                                    <Descriptions.Item labelStyle={customLabelStyle} contentStyle={customContentStyle} label="TIME END"> {moment(item.time_end).format('HH:mm')} </Descriptions.Item>
                                </Descriptions>
                               <div className='status-booked' >
                               {(item.is_deleted) ? (<Tag className='status-tag' color='#ff0000'>Rejected</Tag>) : (
                                    (item.status) ? (<Tag className='status-tag' color='#009900'>Successed</Tag>) : (
                                        <Tag className='status-tag' color='#ff9933'>Pending</Tag>
                                    )
                                )}
                               </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default ListBookingOfUser
