// const userModel = require("../models/userModels");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const doctorModel = require("../models/doctorModel");
// const appointmentModel = require("../models/appointmentModel");
// const moment = require("moment");
// //register callback
// const registerController = async (req, res) => {
//   try {
//     const exisitingUser = await userModel.findOne({ email: req.body.email });
//     if (exisitingUser) {
//       return res
//         .status(200)
//         .send({ message: "User Already Exist", success: false });
//     }
//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     req.body.password = hashedPassword;
//     const newUser = new userModel(req.body);
//     await newUser.save();
//     res.status(201).send({ message: "Register Sucessfully", success: true });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: `Register Controller ${error.message}`,
//     });
//   }
// };

// // login callback
// const loginController = async (req, res) => {
//   try {
//     const user = await userModel.findOne({ email: req.body.email });
//     if (!user) {
//       return res
//         .status(200)
//         .send({ message: "user not found", success: false });
//     }
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return res
//         .status(200)
//         .send({ message: "Invlid EMail or Password", success: false });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });
//     res.status(200).send({ message: "Login Success", success: true, token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
//   }
// };

// const authController = async (req, res) => {
//   try {
//     const user = await userModel.findById({ _id: req.body.userId });
//     user.password = undefined;
//     if (!user) {
//       return res.status(200).send({
//         message: "user not found",
//         success: false,
//       });
//     } else {
//       res.status(200).send({
//         success: true,
//         data: user,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "auth error",
//       success: false,
//       error,
//     });
//   }
// };

// // APpply DOctor CTRL
// const applyDoctorController = async (req, res) => {
//   try {

//     // 1. Check if the user has already applied for a doctor account
//     const existingDoctor = await doctorModel.findOne({ userId: req.body.userId });
//     if (existingDoctor) {
//       return res.status(400).send({
//         success: false,
//         message: "You have already applied for a doctor account.",
//       });
//     }

//     // 2. creating a new doctor entry
//     const newDoctor = await doctorModel({ ...req.body, status: "pending" });
//     await newDoctor.save();

//     // 3. Notify the admin about the new application
//     const adminUser = await userModel.findOne({ isAdmin: true });
//     const notification = adminUser.notification;
//     notification.push({
//       type: "apply-doctor-request",
//       message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
//       data: {
//         doctorId: newDoctor._id,
//         name: newDoctor.firstName + " " + newDoctor.lastName,
//         onClickPath: "/admin/docotrs",
//       },
//     });

//     // 4. Update the admin's notification list
//     await userModel.findByIdAndUpdate(adminUser._id, { notification });
//     res.status(201).send({
//       success: true,
//       message: "Doctor Account Applied SUccessfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error WHile Applying For Doctotr",
//     });
//   }
// };

// //notification ctrl
// const getAllNotificationController = async (req, res) => {
//   try {
//     const user = await userModel.findOne({ _id: req.body.userId });
//     const seennotification = user.seennotification;
//     const notification = user.notification;
//     seennotification.push(...notification);
//     user.notification = [];
//     user.seennotification = notification;
//     const updatedUser = await user.save();
//     res.status(200).send({
//       success: true,
//       message: "all notification marked as read",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Error in notification",
//       success: false,
//       error,
//     });
//   }
// };

// // delete notifications
// const deleteAllNotificationController = async (req, res) => {
//   try {
//     const user = await userModel.findOne({ _id: req.body.userId });
//     user.notification = [];
//     user.seennotification = [];
//     const updatedUser = await user.save();
//     updatedUser.password = undefined;
//     res.status(200).send({
//       success: true,
//       message: "Notifications Deleted successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "unable to delete all notifications",
//       error,
//     });
//   }
// };

// //GET ALL DOC
// const getAllDocotrsController = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({ status: "approved" });
//     res.status(200).send({
//       success: true,
//       message: "Docots Lists Fetched Successfully",
//       data: doctors,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Errro WHile Fetching DOcotr",
//     });
//   }
// };

// //BOOK APPOINTMENT
// // const bookeAppointmnetController = async (req, res) => {
// //   try {
// //     req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
// //     req.body.time = moment(req.body.time, "HH:mm").toISOString();
// //     req.body.status = "pending";
// //     const newAppointment = new appointmentModel(req.body);
// //     await newAppointment.save();
// //     const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
// //     user.notification.push({
// //       type: "New-appointment-request",
// //       message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
// //       onCLickPath: "/user/appointments",
// //     });
// //     await user.save();
// //     res.status(200).send({
// //       success: true,
// //       message: "Appointment Book succesfully",
// //     });
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).send({
// //       success: false,
// //       error,
// //       message: "Error While Booking Appointment",
// //     });
// //   }
// // };
// const bookAppointmentController = async (req, res) => {
//   try {
//     // Convert date & time to ISO
//     const formattedDate = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     const formattedTime = moment(req.body.time, "HH:mm").toISOString();

//     // Set the appointment status
//     req.body.date = formattedDate;
//     req.body.time = formattedTime;
//     req.body.status = "pending";

//     // Create and save new appointment
//     const newAppointment = new appointmentModel(req.body);
//     await newAppointment.save();

//     // ✅ Notify the doctor (as user)
//     const doctorUser = await userModel.findById(req.body.doctorInfo.userId);
//     if (!doctorUser) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor's user not found",
//       });
//     }

//     doctorUser.notification.push({
//       type: "New-appointment-request",
//       message: `A new Appointment Request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });
//     await doctorUser.save();

//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//     });
//   } catch (error) {
//     console.log("Error while booking appointment:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error while booking appointment",
//       error,
//     });
//   }
// };


// // booking bookingAvailabilityController
// // const bookingAvailabilityController = async (req, res) => {
// //   try {
// //     const date = moment(req.body.date, "DD-MM-YY").toISOString();

// //     const fromTime = moment(req.body.time, "HH:mm")
// //       .subtract(1, "hours")
// //       .toISOString();
// //     const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
// //     const doctorId = req.body.doctorId;
// //     const appointments = await appointmentModel.find({
// //       doctorId,
// //       date,
// //       time: {
// //         $gte: fromTime,
// //         $lte: toTime,
// //       },
// //     });
// //     if (appointments.length > 0) {
// //       return res.status(200).send({
// //         message: "Appointments not Availibale at this time",
// //         success: true,
// //       });
// //     } else {
// //       return res.status(200).send({
// //         success: true,
// //         message: "Appointments available",
// //       });
// //     }
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).send({
// //       success: false,
// //       error,
// //       message: "Error In Booking",
// //     });
// //   }
// // };
// // const bookingAvailabilityController = async (req, res) => {
// //   try {
// //     const doctor = await doctorModel.findById(req.body.doctorId);
// //     if (!doctor) {
// //       return res.status(404).send({
// //         success: false,
// //         message: "Doctor not found",
// //       });
// //     }

// //     const [startTime, endTime] = doctor.timings; // "HH:mm" strings
// //     const selectedDate = req.body.date; // e.g., "19-07-2025"
// //     const selectedTime = req.body.time; // e.g., "17:30"

// //     const selectedDateTime = moment(
// //       `${selectedDate} ${selectedTime}`,
// //       "DD-MM-YYYY HH:mm"
// //     );

// //     const startMoment = moment(
// //       `${selectedDate} ${startTime}`,
// //       "DD-MM-YYYY HH:mm"
// //     );
// //     const endMoment = moment(
// //       `${selectedDate} ${endTime}`,
// //       "DD-MM-YYYY HH:mm"
// //     );

// //     // ✅ Check if selected time is within working hours
// //     if (!selectedDateTime.isBetween(startMoment, endMoment, null, "[)")) {
// //       return res.status(200).send({
// //         success: false,
// //         message: "Selected time is outside doctor's working hours",
// //       });
// //     }

// //     // ✅ Check for overlapping appointments (±1 hour)
// //     const fromTime = selectedDateTime.clone().subtract(1, "hour").toISOString();
// //     const toTime = selectedDateTime.clone().add(1, "hour").toISOString();

// //     const appointments = await appointmentModel.find({
// //       doctorId: req.body.doctorId,
// //       date: moment(selectedDate, "DD-MM-YYYY").toISOString(),
// //       time: {
// //         $gte: fromTime,
// //         $lte: toTime,
// //       },
// //     });

// //     if (appointments.length > 0) {
// //       return res.status(200).send({
// //         success: false,
// //         message: "Appointments not available at this time",
// //       });
// //     }

// //     return res.status(200).send({
// //       success: true,
// //       message: "Appointments available",
// //     });
// //   } catch (error) {
// //     console.log("Booking Availability Error:", error);
// //     res.status(500).send({
// //       success: false,
// //       message: "Error in checking booking availability",
// //       error,
// //     });
// //   }
// // };
// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findById(req.body.doctorId);
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     const [startTime, endTime] = doctor.timings; // both are "HH:mm"
//     const selectedTimeStr = req.body.time;       // e.g., "11:30"
//     const selectedTime = moment(selectedTimeStr, "HH:mm");

//     const startMoment = moment(startTime, "HH:mm");
//     const endMoment = moment(endTime, "HH:mm");

//     // ✅ Check if selected time is within doctor's working hours
//     if (!selectedTime.isBetween(startMoment, endMoment, null, "[)")) {
//       return res.status(200).send({
//         success: false,
//         message: "Selected time is outside doctor's working hours",
//       });
//     }

//     // ✅ Check for overlapping times (±1 hour) ignoring date
//     const fromTime = selectedTime.clone().subtract(1, "hour").format("HH:mm");
//     const toTime = selectedTime.clone().add(1, "hour").format("HH:mm");

//     // Get all appointments for the doctor (ignoring date)
//     const allAppointments = await appointmentModel.find({ doctorId: req.body.doctorId });

//     const timeClash = allAppointments.some((appointment) => {
//       const bookedTime = moment(appointment.time).utc().format("HH:mm");
//       return moment(bookedTime, "HH:mm").isBetween(
//         moment(fromTime, "HH:mm"),
//         moment(toTime, "HH:mm"),
//         null,
//         "[)"
//       );
//     });

//     if (timeClash) {
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


// const userAppointmentsController = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find({
//       userId: req.body.userId,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Users Appointments Fetch SUccessfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error In User Appointments",
//     });
//   }
// };

// module.exports = {
//   loginController,
//   registerController,
//   authController,
//   applyDoctorController,
//   getAllNotificationController,
//   deleteAllNotificationController,
//   getAllDocotrsController,
//   bookAppointmentController,
//   bookingAvailabilityController,
//   userAppointmentsController,
// };


































const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { parseJsonField, stringifyJsonField } = require("../utils/jsonHelpers");
const { formatUserResponse } = require("../utils/responseHelpers");

//register callback
const registerController = async (req, res) => {
  try {
    // Check if user already exists
    const exisitingUser = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    
    // Hash password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: req.body.isAdmin || false,
        isDoctor: req.body.isDoctor || false,
        notification: [],
        seenNotification: []
      }
    });
    
    res.status(201).send({ 
      message: "Register Successfully", 
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
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
    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    });
    
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    
    // Use user.id (integer) instead of user._id (MongoDB ObjectId)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    res.status(200).send({ 
      message: "Login Success", 
      success: true, 
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isDoctor: user.isDoctor
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ 
      message: `Error in Login CTRL ${error.message}`,
      error: error.message 
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.body.userId) },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        isDoctor: true,
        notification: true,
        seenNotification: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }
    
    const formattedUser = formatUserResponse(user);
    
    res.status(200).send({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth error",
      success: false,
      error: error.message,
    });
  }
};

// const applyDoctorController = async (req, res) => {
//   try {
//     // 1. Check if the user has already applied for a doctor account
//     const existingDoctor = await prisma.doctor.findFirst({
//       where: { userId: parseInt(req.body.userId) }
//     });
    
//     if (existingDoctor) {
//       return res.status(400).send({
//         success: false,
//         message: "You have already applied for a doctor account.",
//       });
//     }

//     // 2. Create a new doctor entry
//     const newDoctor = await prisma.doctor.create({
//       data: {
//         userId: parseInt(req.body.userId),
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         phone: req.body.phone,
//         email: req.body.email,
//         website: req.body.website,
//         address: req.body.address,
//         specialization: req.body.specialization,
//         experience: req.body.experience,
//         feesPerCunsaltation: parseInt(req.body.feesPerCunsaltation),
//         timings: JSON.parse(req.body.timings), // Assuming timings is sent as JSON string
//         status: "pending"
//       }
//     });

//     // 3. Notify the admin about the new application
//     const adminUser = await prisma.user.findFirst({
//       where: { isAdmin: true }
//     });
    
//     if (adminUser) {
//       const updatedNotification = [
//   ...JSON.parse(adminUser.notification || "[]"), // Parse JSON string to array
//   {
//     type: "apply-doctor-request",
//     message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
//     data: {
//       doctorId: newDoctor.id,
//       name: `${newDoctor.firstName} ${newDoctor.lastName}`,
//       onClickPath: "/admin/doctors",
//     },
//   }
// ];

// await prisma.user.update({
//   where: { id: adminUser.id },
//   data: { 
//     notification: JSON.stringify(updatedNotification) // Convert back to JSON string
//   }
// });
//     }
    
//     res.status(201).send({
//       success: true,
//       message: "Doctor Account Applied Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error: error.message,
//       message: "Error While Applying For Doctor",
//     });
//   }
// };
const applyDoctorController = async (req, res) => {
  try {
    // 1. Check if the user has already applied for a doctor account
    const existingDoctor = await prisma.doctor.findFirst({
      where: { userId: parseInt(req.body.userId) }
    });
    
    if (existingDoctor) {
      return res.status(400).send({
        success: false,
        message: "You have already applied for a doctor account.",
      });
    }

    // 2. Create a new doctor entry
    const newDoctor = await prisma.doctor.create({
      data: {
        userId: parseInt(req.body.userId),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        website: req.body.website || "",
        address: req.body.address,
        specialization: req.body.specialization,
        experience: req.body.experience,
        feesPerCunsaltation: parseInt(req.body.feesPerCunsaltation) || 0,
        timings: typeof req.body.timings === 'string' ? JSON.parse(req.body.timings) : req.body.timings,
        status: "pending"
      }
    });

    // 3. Notify the admin about the new application
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true }
    });
    
    if (adminUser) {
      // Parse existing notifications safely
      const existingNotifications = parseJsonField(adminUser.notification);
      
      // Add new notification
      const updatedNotifications = [
        ...existingNotifications,
        {
          type: "apply-doctor-request",
          message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
          data: {
            doctorId: newDoctor.id,
            name: `${newDoctor.firstName} ${newDoctor.lastName}`,
            onClickPath: "/admin/doctors",
          },
        }
      ];

      // 4. Update the admin's notification list
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { 
          notification: stringifyJsonField(updatedNotifications) 
        }
      });
    }
    
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error While Applying For Doctor",
    });
  }
};


const getAllNotificationController = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.body.userId) },
      select: { notification: true, seenNotification: true }
    });
    
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    
    // Parse JSON strings to arrays
    const seenNotifications = parseJsonField(user.seenNotification);
    const notifications = parseJsonField(user.notification);
    
    // Move all notifications to seenNotifications
    const updatedSeenNotifications = [...seenNotifications, ...notifications];
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.body.userId) },
      data: {
        notification: stringifyJsonField([]),
        seenNotification: stringifyJsonField(updatedSeenNotifications)
      }
    });
    
    // Format response with parsed arrays
    const responseData = formatUserResponse(updatedUser);
    
    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error: error.message,
    });
  }
};



// const getAllNotificationController = async (req, res) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(req.body.userId) },
//       select: { notification: true, seenNotification: true }
//     });
    
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "User not found",
//       });
//     }
    
//     // Parse JSON strings to arrays
//     const seenNotifications = parseJsonField(user.seenNotification);
//     const notifications = parseJsonField(user.notification);
    
//     // Move all notifications to seenNotifications
//     const updatedSeenNotifications = [...seenNotifications, ...notifications];
    
//     // Update user
//     const updatedUser = await prisma.user.update({
//       where: { id: parseInt(req.body.userId) },
//       data: {
//         notification: stringifyJsonField([]), // Empty array
//         seenNotification: stringifyJsonField(updatedSeenNotifications)
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         notification: true,
//         seenNotification: true
//       }
//     });
    
//     // Parse the JSON fields for response
//     const responseData = {
//       ...updatedUser,
//       notification: parseJsonField(updatedUser.notification),
//       seenNotification: parseJsonField(updatedUser.seenNotification)
//     };
    
//     res.status(200).send({
//       success: true,
//       message: "all notification marked as read",
//       data: responseData,
//     });
//   } catch (error) {
//     // ... error handling ...
//   }
// };

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.body.userId) },
      data: {
        notification: stringifyJsonField([]),
        seenNotification: stringifyJsonField([])
      }
    });
    
    // Format response with parsed arrays
    const responseData = formatUserResponse(user);
    
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error: error.message,
    });
  }
};



// const deleteAllNotificationController = async (req, res) => {
//   try {
//     const user = await prisma.user.update({
//       where: { id: parseInt(req.body.userId) },
//       data: {
//         notification: stringifyJsonField([]), // Empty array as JSON string
//         seenNotification: stringifyJsonField([]) // Empty array as JSON string
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         notification: true,
//         seenNotification: true,
//         isAdmin: true,
//         isDoctor: true
//       }
//     });
    
//     // Parse JSON fields for response
//     const responseData = {
//       ...user,
//       notification: parseJsonField(user.notification),
//       seenNotification: parseJsonField(user.seenNotification)
//     };
    
//     res.status(200).send({
//       success: true,
//       message: "Notifications Deleted successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     // ... error handling ...
//   }
// };



//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { status: "approved" },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Optional: order by creation date
      }
    });
    
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error While Fetching Doctors",
    });
  }
};

// const bookAppointmentController = async (req, res) => {
//   try {
//     // Convert date & time to proper format
//     const formattedDate = moment(req.body.date, "DD-MM-YYYY").toISOString();
//     const formattedTime = moment(req.body.time, "HH:mm").toISOString();

//     // Create and save new appointment
//     const newAppointment = await prisma.appointment.create({
//       data: {
//         userId: parseInt(req.body.userId),
//         doctorId: parseInt(req.body.doctorId),
//         doctorInfo: req.body.doctorInfo, // Store as string or JSON
//         userInfo: req.body.userInfo,     // Store as string or JSON
//         date: formattedDate,
//         time: formattedTime,
//         status: "pending"
//       }
//     });

//     // Notify the doctor (as user)
//     const doctorUser = await prisma.user.findUnique({
//       where: { id: parseInt(req.body.doctorInfo.userId) }
//     });
    
//     if (!doctorUser) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor's user not found",
//       });
//     }

//     const updatedNotification = [
//       ...doctorUser.notification,
//       {
//         type: "New-appointment-request",
//         message: `A new Appointment Request from ${req.body.userInfo.name}`,
//         onClickPath: "/doctor/appointments", // Changed to doctor path
//       }
//     ];

//     await prisma.user.update({
//       where: { id: parseInt(req.body.doctorInfo.userId) },
//       data: { notification: updatedNotification }
//     });

//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//       data: newAppointment
//     });
//   } catch (error) {
//     console.log("Error while booking appointment:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error while booking appointment",
//       error: error.message,
//     });
//   }
// };

// const bookAppointmentController = async (req, res) => {
//   try {
//     // Just store as strings (already formatted on frontend)
//     const { userId, doctorId, doctorInfo, userInfo, date, time } = req.body;

//     const newAppointment = await prisma.appointment.create({
//       data: {
//         userId: parseInt(userId),
//         doctorId: parseInt(doctorId),
//         doctorInfo, // JSON string
//         userInfo,   // JSON string
//         date: req.body.date,       // "DD-MM-YYYY"
//         time:  req.body.time,     // "HH:mm"
//         status: "pending",
//       },
//     });

//     // Parse doctorInfo and userInfo (since stored as JSON strings)
//     const doctorObj = JSON.parse(doctorInfo);
//     const userObj = JSON.parse(userInfo);

//     // Notify the doctor (doctorObj.userId must exist)
//     const doctorUser = await prisma.user.findUnique({
//       where: { id: parseInt(doctorObj.userId) },
//     });

//     if (doctorUser) {
//       const updatedNotification = [
//         ...doctorUser.notification,
//         {
//           type: "New-appointment-request",
//           message: `A new Appointment Request from ${userObj.name}`,
//           onClickPath: "/doctor/appointments",
//         },
//       ];

//       await prisma.user.update({
//         where: { id: doctorUser.id },
//         data: { notification: updatedNotification },
//       });
//     }

//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//       data: newAppointment,
//     });
//   } catch (error) {
//     console.log("Error while booking appointment:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error while booking appointment",
//       error: error.message,
//     });
//   }
// };

const bookAppointmentController = async (req, res) => {
  try {
    const { userId, doctorId, doctorInfo, userInfo, date, time } = req.body;

    // Run atomic check + insert inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if the slot is already booked
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId: parseInt(doctorId),
          date,
          time,
          status: { not: "cancelled" }, // ignore cancelled ones
        },
      });

      if (existing) {
        throw new Error("This slot is already booked");
      }

      // 2. Create new appointment
      const newAppointment = await tx.appointment.create({
        data: {
          userId: parseInt(userId),
          doctorId: parseInt(doctorId),
          doctorInfo,
          userInfo,
          date,
          time,
          status: "pending",
        },
      });

      return newAppointment;
    });

    // Notify doctor (after commit)
    const doctorObj = JSON.parse(doctorInfo);
    const userObj = JSON.parse(userInfo);

    const doctorUser = await prisma.user.findUnique({
      where: { id: parseInt(doctorObj.userId) },
    });

    if (doctorUser) {
      const updatedNotification = [
        ...doctorUser.notification,
        {
          type: "New-appointment-request",
          message: `A new Appointment Request from ${userObj.name}`,
          onClickPath: "/doctor/appointments",
        },
      ];

      await prisma.user.update({
        where: { id: doctorUser.id },
        data: { notification: updatedNotification },
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error while booking appointment:", error);
    res.status(400).send({
      success: false,
      message: error.message || "Error while booking appointment",
    });
  }
};



// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const doctor = await prisma.doctor.findUnique({
//       where: { id: parseInt(req.body.doctorId) }
//     });
    
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }

//     // Parse doctor timings (stored as JSON in Prisma)
//     const timings = doctor.timings;
//     const [startTime, endTime] = [timings.start, timings.end]; // Assuming timings is {start: "HH:mm", end: "HH:mm"}
    
//     const selectedTimeStr = req.body.time; // e.g., "11:30"
//     const selectedTime = moment(selectedTimeStr, "HH:mm");

//     const startMoment = moment(startTime, "HH:mm");
//     const endMoment = moment(endTime, "HH:mm");

//     // Check if selected time is within doctor's working hours
//     if (!selectedTime.isBetween(startMoment, endMoment, null, "[)")) {
//       return res.status(200).send({
//         success: false,
//         message: "Selected time is outside doctor's working hours",
//       });
//     }

//     // Check for overlapping times (±1 hour)
//     const fromTime = selectedTime.clone().subtract(1, "hour").toISOString();
//     const toTime = selectedTime.clone().add(1, "hour").toISOString();

//     // Get all appointments for the doctor on the same date
//     const appointments = await prisma.appointment.findMany({
//       where: {
//         doctorId: parseInt(req.body.doctorId),
//         date: req.body.date // Check same date
//       }
//     });

//     const timeClash = appointments.some((appointment) => {
//       const bookedTime = moment(appointment.time);
//       return bookedTime.isBetween(
//         moment(fromTime),
//         moment(toTime),
//         null,
//         "[)"
//       );
//     });

//     if (timeClash) {
//       return res.status(200).send({
//         success: false,
//         message: "Appointment slot not available at this time",
//       });
//     }

//     return res.status(200).send({
//       success: true,
//       message: "Appointment slot available",
//     });
//   } catch (error) {
//     console.log("Booking Availability Error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in checking booking availability",
//       error: error.message,
//     });
//   }
// };

const bookingAvailabilityController = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(req.body.doctorId) },
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Parse doctor timings (assuming ["09:00", "17:00"])
    const [startTime, endTime] = doctor.timings;

    const selectedTime = moment(req.body.time, "HH:mm");
    const startMoment = moment(startTime, "HH:mm");
    const endMoment = moment(endTime, "HH:mm");

    // Check if selected time is within doctor's working hours
    if (!selectedTime.isBetween(startMoment, endMoment, null, "[)")) {
      return res.status(200).send({
        success: false,
        message: "Selected time is outside doctor's working hours",
      });
    }

    // Check for overlapping appointments (±1 hour)
    const fromTime = selectedTime.clone().subtract(1, "hour");
    const toTime = selectedTime.clone().add(1, "hour");

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parseInt(req.body.doctorId),
        date: req.body.date, // must match format
      },
    });

    const timeClash = appointments.some((appointment) => {
      const bookedTime = moment(appointment.time, "HH:mm");
      return bookedTime.isBetween(fromTime, toTime, null, "[)");
    });

    if (timeClash) {
      return res.status(200).send({
        success: false,
        message: "Appointment slot not available at this time",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointment slot available",
    });
  } catch (error) {
    console.log("Booking Availability Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in checking booking availability",
      error: error.message,
    });
  }
};


const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: parseInt(req.body.userId)
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc' // Show most recent appointments first
      }
    });
    
    res.status(200).send({
      success: true,
      message: "User Appointments Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error In User Appointments",
    });
  }
};

// Add the other controller functions (getAllNotificationController, 
// deleteAllNotificationController, getAllDocotrsController, etc.)
// following the same pattern

module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController
  // Export other functions here
};