import { Button } from "antd";
import "./Booking.css";
import { BookingData } from "../../constant/constant";
import React from "react";
interface BtnProps {
  selectBooking: BookingData | undefined;
  onChange: (status: boolean) => void;
  onSucces: (booking: BookingData | undefined) => Promise<void>;
}
const BtnAccept: React.FC<BtnProps> = ({
  onChange,
  onSucces,
  selectBooking,
}) => {
  return (
    <Button
      className="btn-action btn--accept"
      onClick={() => {
        onSucces(selectBooking);
        onChange(false);
      }}
    >
      ACCEPT
    </Button>
  );
};

export default BtnAccept;
