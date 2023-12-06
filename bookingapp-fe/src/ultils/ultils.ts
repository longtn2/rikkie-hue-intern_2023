import moment from "moment";
export const formatTime = (time: moment.MomentInput) => {
  return moment(time).format("HH:mm");
};
export const formatDate = (time: moment.MomentInput) => {
  return moment(time).format("DD/MM/YYYY");
};

