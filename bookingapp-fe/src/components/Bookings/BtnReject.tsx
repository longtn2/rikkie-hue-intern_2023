import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React from "react";
interface BtnProps {
  selectBooking: BookingData | undefined;
  handleSelectAction: (selectBooking: BookingData, key: string) => void;
}
const BtnReject: React.FC<BtnProps> = ({
  handleSelectAction,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn--reject"
      type="text"
      onClick={() => handleSelectAction(selectBooking!, "reject")}
    >
      REJECT
    </Button>
  );
};

export default BtnReject;
