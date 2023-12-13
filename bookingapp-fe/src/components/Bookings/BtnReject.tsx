import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React from "react";
interface BtnProps {
  selectBooking: BookingData | undefined;
  onChange: (status: boolean) => void;
  onReject: (booking: BookingData | undefined) => Promise<void>;
}
const BtnReject: React.FC<BtnProps> = ({
  onChange,
  onReject,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn--reject"
      onClick={() => {
        onReject(selectBooking);
        onChange(false);
      }}
    >
      REJECT
    </Button>
  );
};

export default BtnReject;
