import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {

  console.log("BookingPage rendered");


  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();

const [isAvailable, setIsAvailable] = useState(false); // ✅ moved up

useEffect(() => {
  console.log("Availability changed to:", isAvailable); // ✅ now safe to use
}, [isAvailable]);
useEffect(() => {
  if (!date || !time) {
    setIsAvailable(false);
  }
}, [date, time]);

useEffect(() => {
  console.log("User updated:", user);
}, [user]); 

  
const dispatch = useDispatch();
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ============ handle availiblity
  // const handleAvailability = async () => {
  //   try {
  //     dispatch(showLoading());
  //     const res = await axios.post(
  //       "/api/v1/user/booking-availbility",
  //       { doctorId: params.doctorId, date, time },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );
  //     dispatch(hideLoading());
  //     if (res.data.success) {
  //       setIsAvailable(true);
  //       console.log(isAvailable);
  //       message.success(res.data.message);
  //     } else {
  //       message.error(res.data.message);
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     console.log(error);
  //   }
  // };
const handleAvailability = async () => {

  console.log("Check Availability Clicked");


  try {
    dispatch(showLoading());
    const res = await axios.post(
      "/api/v1/user/booking-availbility",
      { doctorId: params.doctorId, date, time },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    dispatch(hideLoading());

    if (res.data.success) {
      setIsAvailable(true);
      message.success(res.data.message);
    } else {
      setIsAvailable(false); // 🛠 Reset if not available
      message.error(res.data.message);
    }
  } catch (error) {
    dispatch(hideLoading());
    setIsAvailable(false); // 🛠 Reset if there's an error
    console.log(error);
    message.error("Something went wrong");
  }
};



  // =============== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesPerCunsaltation}</h4>
            <h4>
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
  className="m-2"
  format="DD-MM-YYYY"
  value={date ? moment(date, "DD-MM-YYYY") : null}
  onChange={(value) => {
    setDate(moment(value).format("DD-MM-YYYY"));
    setIsAvailable(false); // reset when changed
  }}
/>

<TimePicker
  format="HH:mm"
  className="mt-3"
  value={time ? moment(time, "HH:mm") : null}
  onChange={(value) => {
    setTime(moment(value).format("HH:mm"));
    setIsAvailable(false); // reset when changed
  }}
/>


              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button
              type="button"
  className="btn btn-dark mt-2"
  onClick={handleBooking}
  // disabled={!isAvailable}  // disables when not available
>
  Book Now
</button>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;