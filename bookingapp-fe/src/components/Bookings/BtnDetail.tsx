import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React from "react";
interface BtnProps {
  selectBooking: BookingData | undefined;
  handleSelectAction: (selectBooking: BookingData, key: string) => void;
}
const BtnDetail: React.FC<BtnProps> = ({
  handleSelectAction,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn--view"
      type="text"
      onClick={() => handleSelectAction(selectBooking!, "view")}
    >
      VIEW DETAIL
    </Button>
  );
};

export default BtnDetail;
