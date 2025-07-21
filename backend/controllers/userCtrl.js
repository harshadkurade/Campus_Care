const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
  try {

    // 1. Check if the user has already applied for a doctor account
    const existingDoctor = await doctorModel.findOne({ userId: req.body.userId });
    if (existingDoctor) {
      return res.status(400).send({
        success: false,
        message: "You have already applied for a doctor account.",
      });
    }

    // 2. creating a new doctor entry
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // 3. Notify the admin about the new application
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });

    // 4. Update the admin's notification list
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Docots Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

//BOOK APPOINTMENT
// const bookeAppointmnetController = async (req, res) => {
//   try {
//     req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     req.body.time = moment(req.body.time, "HH:mm").toISOString();
//     req.body.status = "pending";
//     const newAppointment = new appointmentModel(req.body);
//     await newAppointment.save();
//     const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
//     user.notification.push({
//       type: "New-appointment-request",
//       message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
//       onCLickPath: "/user/appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment Book succesfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error While Booking Appointment",
//     });
//   }
// };
const bookAppointmentController = async (req, res) => {
  try {
    // Convert date & time to ISO
    const formattedDate = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const formattedTime = moment(req.body.time, "HH:mm").toISOString();

    // Set the appointment status
    req.body.date = formattedDate;
    req.body.time = formattedTime;
    req.body.status = "pending";

    // Create and save new appointment
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    // ✅ Notify the doctor (as user)
    const doctorUser = await userModel.findById(req.body.doctorInfo.userId);
    if (!doctorUser) {
      return res.status(404).send({
        success: false,
        message: "Doctor's user not found",
      });
    }

    doctorUser.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await doctorUser.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log("Error while booking appointment:", error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};


// booking bookingAvailabilityController
// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const date = moment(req.body.date, "DD-MM-YY").toISOString();

//     const fromTime = moment(req.body.time, "HH:mm")
//       .subtract(1, "hours")
//       .toISOString();
//     const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
//     const doctorId = req.body.doctorId;
//     const appointments = await appointmentModel.find({
//       doctorId,
//       date,
//       time: {
//         $gte: fromTime,
//         $lte: toTime,
//       },
//     });
//     if (appointments.length > 0) {
//       return res.status(200).send({
//         message: "Appointments not Availibale at this time",
//         success: true,
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         message: "Appointments available",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error In Booking",
//     });
//   }
// };
// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findById(req.body.doctorId);
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     const [startTime, endTime] = doctor.timings; // "HH:mm" strings
//     const selectedDate = req.body.date; // e.g., "19-07-2025"
//     const selectedTime = req.body.time; // e.g., "17:30"

//     const selectedDateTime = moment(
//       `${selectedDate} ${selectedTime}`,
//       "DD-MM-YYYY HH:mm"
//     );

//     const startMoment = moment(
//       `${selectedDate} ${startTime}`,
//       "DD-MM-YYYY HH:mm"
//     );
//     const endMoment = moment(
//       `${selectedDate} ${endTime}`,
//       "DD-MM-YYYY HH:mm"
//     );

//     // ✅ Check if selected time is within working hours
//     if (!selectedDateTime.isBetween(startMoment, endMoment, null, "[)")) {
//       return res.status(200).send({
//         success: false,
//         message: "Selected time is outside doctor's working hours",
//       });
//     }

//     // ✅ Check for overlapping appointments (±1 hour)
//     const fromTime = selectedDateTime.clone().subtract(1, "hour").toISOString();
//     const toTime = selectedDateTime.clone().add(1, "hour").toISOString();

//     const appointments = await appointmentModel.find({
//       doctorId: req.body.doctorId,
//       date: moment(selectedDate, "DD-MM-YYYY").toISOString(),
//       time: {
//         $gte: fromTime,
//         $lte: toTime,
//       },
//     });

//     if (appointments.length > 0) {
//       return res.status(200).send({
//         success: false,
//         message: "Appointments not available at this time",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "Appointments available",
//     });
//   } catch (error) {
//     console.log("Booking Availability Error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in checking booking availability",
//       error,
//     });
//   }
// };
const bookingAvailabilityController = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.body.doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const [startTime, endTime] = doctor.timings; // both are "HH:mm"
    const selectedTimeStr = req.body.time;       // e.g., "11:30"
    const selectedTime = moment(selectedTimeStr, "HH:mm");

    const startMoment = moment(startTime, "HH:mm");
    const endMoment = moment(endTime, "HH:mm");

    // ✅ Check if selected time is within doctor's working hours
    if (!selectedTime.isBetween(startMoment, endMoment, null, "[)")) {
      return res.status(200).send({
        success: false,
        message: "Selected time is outside doctor's working hours",
      });
    }

    // ✅ Check for overlapping times (±1 hour) ignoring date
    const fromTime = selectedTime.clone().subtract(1, "hour").format("HH:mm");
    const toTime = selectedTime.clone().add(1, "hour").format("HH:mm");

    // Get all appointments for the doctor (ignoring date)
    const allAppointments = await appointmentModel.find({ doctorId: req.body.doctorId });

    const timeClash = allAppointments.some((appointment) => {
      const bookedTime = moment(appointment.time).utc().format("HH:mm");
      return moment(bookedTime, "HH:mm").isBetween(
        moment(fromTime, "HH:mm"),
        moment(toTime, "HH:mm"),
        null,
        "[)"
      );
    });

    if (timeClash) {
      return res.status(200).send({
        success: false,
        message: "Appointments not available at this time",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointments available",
    });
  } catch (error) {
    console.log("Booking Availability Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in checking booking availability",
      error,
    });
  }
};


const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};