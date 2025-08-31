// const appointmentModel = require("../models/appointmentModel");
// const doctorModel = require("../models/doctorModel");
// const userModel = require("../models/userModels");
// const getDoctorInfoController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     res.status(200).send({
//       success: true,
//       message: "doctor data fetch success",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Fetching Doctor Details",
//     });
//   }
// };

// // update doc profile
// const updateProfileController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOneAndUpdate(
//       { userId: req.body.userId },
//       req.body
//     );
//     res.status(201).send({
//       success: true,
//       message: "Doctor Profile Updated",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Doctor Profile Update issue",
//       error,
//     });
//   }
// };

// //get single docotor
// const getDoctorByIdController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
//     res.status(200).send({
//       success: true,
//       message: "Sigle Doc Info Fetched",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Erro in Single docot info",
//     });
//   }
// };

// const doctorAppointmentsController = async (req, res) => {
//   try {
//     const doctor = await doctorModel.findOne({ userId: req.body.userId });
//     const appointments = await appointmentModel.find({
//       doctorId: doctor._id,
//     });
//     res.status(200).send({
//       success: true,
//       message: "Doctor Appointments fetch Successfully",
//       data: appointments,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Doc Appointments",
//     });
//   }
// };

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status } = req.body;
//     const appointments = await appointmentModel.findByIdAndUpdate(
//       appointmentsId,
//       { status }
//     );
//     const user = await userModel.findOne({ _id: appointments.userId });
//     const notifcation = user.notifcation;
//     notifcation.push({
//       type: "status-updated",
//       message: `your appointment has been updated ${status}`,
//       onCLickPath: "/doctor-appointments",
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Appointment Status Updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error In Update Status",
//     });
//   }
// };

// module.exports = {
//   getDoctorInfoController,
//   updateProfileController,
//   getDoctorByIdController,
//   doctorAppointmentsController,
//   updateStatusController,
// };







const prisma = require("../config/prisma");
const { parseJsonField, stringifyJsonField } = require("../utils/jsonHelpers");
const { formatUserResponse } = require("../utils/responseHelpers");


const getDoctorInfoController = async (req, res) => {
  try {
    // Find doctor by userId (now an integer, not MongoDB ObjectId)
    const doctor = await prisma.doctor.findFirst({
      where: { 
        userId: parseInt(req.body.userId) 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isDoctor: true
          }
        }
      }
    });
    
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Fetching Doctor Details",
    });
  }
};

// update doc profile
const updateProfileController = async (req, res) => {
  try {
    // Find the doctor by userId and update their profile
    const doctor = await prisma.doctor.update({
      where: { 
        userId: parseInt(req.body.userId) 
      },
      data: req.body,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error: error.message,
    });
  }
};

//get single doctor
// const getDoctorByIdController = async (req, res) => {
//   try {
//     const doctor = await prisma.doctor.findUnique({
//       where: { 
//         id: parseInt(req.body.doctorId) 
//       },
//       include: {
//         user: {
//           select: {
//             name: true,
//             email: true,
//             phone: true
//           }
//         },
//         appointments: {
//           include: {
//             user: {
//               select: {
//                 name: true,
//                 email: true
//               }
//             }
//           },
//           orderBy: {
//             date: 'desc'
//           }
//         }
//       }
//     });
    
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor not found",
//       });
//     }
    
//     res.status(200).send({
//       success: true,
//       message: "Single Doctor Info Fetched",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error: error.message,
//       message: "Error in Single doctor info",
//     });
//   }
// };
const getDoctorByIdController = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    const doctorId = parseInt(req.body.doctorId || req.params.doctorId);

    if (!doctorId) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: { select: { name: true, email: true } },
        appointments: {
          include: {
            user: { select: { name: true, email: true } }
          },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Single doctor info",
    });
  }
};


const doctorAppointmentsController = async (req, res) => {
  try {
    // First find the doctor by userId
    const doctor = await prisma.doctor.findFirst({
      where: { 
        userId: parseInt(req.body.userId) 
      }
    });
    
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    
    // Then get all appointments for this doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true
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
      message: "Doctor Appointments fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Doctor Appointments",
    });
  }
};

// const updateStatusController = async (req, res) => {
//   try {
//     const { appointmentsId, status } = req.body;
    
//     // Update the appointment status
//     const appointment = await prisma.appointment.update({
//       where: { 
//         id: parseInt(appointmentsId) 
//       },
//       data: { 
//         status: status 
//       },
//       include: {
//         user: true // Include user data for notification
//       }
//     });
    
//     // Update user notification
//     const user = await prisma.user.findUnique({
//       where: { 
//         id: appointment.userId 
//       }
//     });
    
//     const updatedNotification = [
//       ...user.notification,
//       {
//         type: "status-updated",
//         message: `Your appointment has been updated to ${status}`,
//         onClickPath: "/doctor-appointments",
//       }
//     ];
    
//     await prisma.user.update({
//       where: { 
//         id: user.id 
//       },
//       data: { 
//         notification: updatedNotification 
//       }
//     });
    
//     res.status(200).send({
//       success: true,
//       message: "Appointment Status Updated",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error: error.message,
//       message: "Error In Update Status",
//     });
//   }
// };

// const updateStatusController = async (req, res) => {
//   try {
//     // ... update appointment status ...
    
//     // Get user to send notification
//     const user = await prisma.user.findUnique({
//       where: { id: appointment.userId }
//     });
    
//     // Parse existing notifications
//     const existingNotifications = parseJsonField(user.notification);
    
//     // Add new notification
//     const updatedNotifications = [
//       ...existingNotifications,
//       {
//         type: "status-updated",
//         message: `Your appointment status has been updated to ${status}`,
//         onClickPath: "/appointments",
//       }
//     ];
    
//     await prisma.user.update({
//       where: { id: user.id },
//       data: { 
//         notification: stringifyJsonField(updatedNotifications) 
//       }
//     });
    
//     res.status(200).send({ success: true, message: "Appointment Status Updated" });
//   } catch (error) {
//     // ... error handling ...
//   }
// };
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    
    // Update the appointment status
    const appointment = await prisma.appointment.update({
      where: { 
        id: parseInt(appointmentsId) 
      },
      data: { 
        status: status 
      },
      include: {
        user: true
      }
    });
    
    // Update user notification
    const user = await prisma.user.findUnique({
      where: { 
        id: appointment.userId 
      }
    });
    
    // Parse existing notifications and add new one
    const existingNotifications = parseJsonField(user.notification);
    const updatedNotifications = [
      ...existingNotifications,
      {
        type: "status-updated",
        message: `Your appointment status has been updated to ${status}`,
        onClickPath: "/appointments",
      }
    ];
    
    await prisma.user.update({
      where: { 
        id: user.id 
      },
      data: { 
        notification: stringifyJsonField(updatedNotifications) 
      }
    });
    
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};