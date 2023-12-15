import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React from "react";
interface BtnProps {
  selectBooking: BookingData | undefined;
  handleSelectAction: (selectBooking: BookingData, key: string) => void;
}
const BtnAccept: React.FC<BtnProps> = ({
  handleSelectAction,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn--accept"
      onClick={() => handleSelectAction(selectBooking!, "accept")}
    >
      VIEW DETAIL
    </Button>
  );
};

export default BtnAccept;
