import { Button } from "antd";
import "./Booking.css";
import React from "react";
import { BookingData } from "../../constant/constant";
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
      onClick={() => handleSelectAction(selectBooking!, "view")}
    >
      VIEW DETAIL
    </Button>
  );
};

export default BtnDetail;
