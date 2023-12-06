import moment from "moment";
export const formatTime = (time: any) => {
    return moment(time).format("HH:mm");
  };
  export const formatDate = (time: any) => {
    return moment(time).format("DD:MM:YYYY");
  };
  