// const doctorModel = require("../models/doctorModel");
// const userModel = require("../models/userModels");

// const getAllUsersController = async (req, res) => {
//   try {
//     const users = await userModel.find({});
//     res.status(200).send({
//       success: true,
//       message: "users data list",
//       data: users,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "erorr while fetching users",
//       error,
//     });
//   }
// };

// const getAllDoctorsController = async (req, res) => {
//   try {
//     const doctors = await doctorModel.find({});
//     res.status(200).send({
//       success: true,
//       message: "Doctors Data list",
//       data: doctors,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "error while getting doctors data",
//       error,
//     });
//   }
// };

// // doctor account status
// const changeAccountStatusController = async (req, res) => {
//   try {
//     const { doctorId, status } = req.body;

//     // 1. Update doctor status
//     const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    
//     // 2. Find corresponding user
//     const user = await userModel.findOne({ _id: doctor.userId });
//     if (!user) {
//       return res.status(404).send({ success: false, message: "User not found" });
//     }

//     // 3. Update user's isDoctor flag and notification array
//     const notification = user.notification;
//     notification.push({
//       type: "doctor-account-request-updated",
//       message: `Your Doctor Account Request Has ${status} `,
//       onClickPath: "/notification",
//     });

//     user.isDoctor = status === "approved" ? true : false;
//     user.notification = notification;
//     await user.save();
    
//     res.status(201).send({
//       success: true,
//       message: "Account Status Updated",
//       data: doctor,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Eror in Account Status",
//       error,
//     });
//   }
// };

// module.exports = {
//   getAllDoctorsController,
//   getAllUsersController,
//   changeAccountStatusController,
// };



const prisma = require("../config/prisma");
const { parseJsonField, stringifyJsonField } = require("../utils/jsonHelpers");
const { formatUserResponse } = require("../utils/responseHelpers");


// const getAllUsersController = async (req, res) => {
//   try {
//     // Get all non-admin users with selected fields only
//     const users = await prisma.user.findMany({
//       where: {
//         isAdmin: false // Exclude admin users from the list
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         isDoctor: true,
//         isAdmin: true,
//         createdAt: true,
//         updatedAt: true
//         // We exclude password and notification fields for security
//       }
//     });
    
//     res.status(200).send({
//       success: true,
//       message: "users data list",
//       data: users,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "error while fetching users",
//       error: error.message, // Send only error message for security
//     });
//   }
// };

const { formatUsersResponse } = require("../utils/responseHelpers");

const getAllUsersController = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isAdmin: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        isDoctor: true,
        isAdmin: true,
        notification: true,
        seenNotification: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    const formattedUsers = formatUsersResponse(users);
    
    res.status(200).send({
      success: true,
      message: "users data list",
      data: formattedUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error: error.message,
    });
  }
};
const getAllDoctorsController = async (req, res) => {
  try {
    // Get all doctors with their related user information
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Newest doctors first
      }
    });
    
    res.status(200).send({
      success: true,
      message: "Doctors Data list",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while getting doctors data",
      error: error.message,
    });
  }
};

// doctor account status
// const changeAccountStatusController = async (req, res) => {
//   try {
//     const { doctorId, status } = req.body;
    
//     // Update doctor status
//     const doctor = await prisma.doctor.update({
//       where: { 
//         id: parseInt(doctorId) 
//       },
//       data: { 
//         status: status 
//       }
//     });
    
//     // Get user associated with the doctor
//     const user = await prisma.user.findUnique({
//       where: { 
//         id: doctor.userId 
//       }
//     });
    
//     if (!user) {
//       return res.status(404).send({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     // Parse existing notifications and add new one
//     const existingNotifications = parseJsonField(user.notification);
//     const updatedNotifications = [
//       ...existingNotifications,
//       {
//         type: "doctor-account-request-updated",
//         message: `Your Doctor Account Request Has ${status}`,
//         onClickPath: "/notification",
//       }
//     ];

//     await prisma.user.update({
//       where: { 
//         id: user.id 
//       },
//       data: { 
//         notification: stringifyJsonField(updatedNotifications) 
//       }
//     });
    
//     res.status(200).send({ 
//       success: true, 
//       message: "Account Status Updated" 
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Account Status",
//       error: error.message,
//     });
//   }
// };


// const changeAccountStatusController = async (req, res) => {
//   try {
//     console.log("changeAccountStatusController called with:", req.body);
    
//     const { userId, status } = req.body;
    
//     if (!userId || !status) {
//       return res.status(400).send({
//         success: false,
//         message: "Doctor ID and status are required",
//       });
//     }
    
//     // Update doctor status
//     const doctor = await prisma.doctor.update({
//       where: { 
//         id: parseInt(userId) 
//       },
//       data: { 
//         status: status 
//       }
//     });
    
//     console.log("Doctor updated:", doctor);
    
//     // Get user associated with the doctor
//     const user = await prisma.user.findUnique({
//       where: { 
//         id: doctor.userId 
//       }
//     });
    
//     if (!user) {
//       return res.status(404).send({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }

//     console.log("User found:", user.id);

//     // Parse existing notifications and add new one
//     const existingNotifications = parseJsonField(user.notification);
//     const updatedNotifications = [
//       ...existingNotifications,
//       {
//         type: "doctor-account-request-updated",
//         message: `Your Doctor Account Request Has ${status}`,
//         onClickPath: "/notification",
//       }
//     ];

//     console.log("Updating user notifications...");
    
//     await prisma.user.update({
//       where: { 
//         id: user.id 
//       },
//       data: { 
//         notification: stringifyJsonField(updatedNotifications) 
//       }
//     });
    
//     console.log("User notifications updated successfully");
    
//     res.status(200).send({ 
//       success: true, 
//       message: "Account Status Updated" 
//     });
//   } catch (error) {
//     console.log("Error in changeAccountStatusController:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Account Status",
//       error: error.message,
//     });
//   }
// };

// const changeAccountStatusController = async (req, res) => {
//   try {
//     console.log("changeAccountStatusController called with:", req.body);
    
//     const { doctorId, status } = req.body;
//     console.log("Received userId:", doctorId, "status:", status);
    
//     // Validate input
//     if (!doctorId || !status) {
//       return res.status(400).send({
//         success: false,
//         message: "Doctor ID and status are required",
//       });
//     }
    
//     // Validate and parse userId
//     // const userIdInt = parseInt(userId);
//     // if (isNaN(userIdInt)) {
//     //   return res.status(400).send({
//     //     success: false,
//     //     message: "Invalid User ID format",
//     //   });
//     // }
    
//     // First, check if the user exists
//     const user = await prisma.user.findUnique({
//       where: { id: parseInt(doctorId) }
//     });
    
//     if (!doctor) {
//       return res.status(404).send({ 
//         success: false, 
//         message: "User not found" 
//       });
//     }
    
//     console.log("User found:", user.id, user.name);
    
//     // Find doctor by userId
//     const doctor = await prisma.doctor.findFirst({
//       where: { 
//         id: Number(doctorId) 
//       }
//     });

//     console.log("Doctor record fetched:", doctor);
    
//     if (!doctor) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor application not found for this user",
//       });
//     }
    
//     console.log("Doctor found:", doctor.id, "for user:", doctor.userId);
    
//     // Update doctor status using the doctor's ID (not user ID)
//     const updatedDoctor = await prisma.doctor.update({
//       where: { 
//         id: doctor.id // Use the doctor record's ID, not user ID
//       },
//       data: { 
//         status: status 
//       }
//     });
    
//     console.log("Doctor status updated:", updatedDoctor.status);
    
//     // Parse existing notifications and add new one
//     // const existingNotifications = parseJsonField(user.notification);
//     // const updatedNotifications = [
//     //   ...existingNotifications,
//     //   {
//     //     type: "doctor-account-request-updated",
//     //     message: `Your Doctor Account Request Has Been ${status}`,
//     //     onClickPath: "/notification",
//     //     date: new Date().toISOString()
//     //   }
//     // ];

//     // // Update user notifications and isDoctor status
//     // const updatedUser = await prisma.user.update({
//     //   where: { 
//     //     id: userIdInt 
//     //   },
//     //   data: { 
//     //     notification: stringifyJsonField(updatedNotifications),
//     //     isDoctor: status === "approved" // Update user's doctor status
//     //   }
//     // });
    
//     // Parse existing notifications (no JSON.parse needed)

// const existingNotifications = user.notification || [];

// const updatedNotifications = [
//   ...existingNotifications,
//   {
//     type: "doctor-account-request-updated",
//     message: `Your Doctor Account Request Has Been ${status}`,
//     onClickPath: "/notification",
//     date: new Date().toISOString(),
//   },
// ];

// // Update user notifications and isDoctor status
// const updatedUser = await prisma.user.update({
//   where: { id: doctor.userId },
//   data: { 
//     notification: updatedNotifications, // Prisma handles JSON
//     isDoctor: status === "approved"
//   }
// });



//     console.log("User updated - isDoctor:", updatedUser.isDoctor);
    
//     res.status(200).send({ 
//       success: true, 
//       message: `Doctor Account ${status} Successfully`,
//       data: {
//         doctor: updatedDoctor,
//         user: {
//           id: updatedUser.id,
//           name: updatedUser.name,
//           email: updatedUser.email,
//           isDoctor: updatedUser.isDoctor
//         }
//       }
//     });
//   } catch (error) {
//     console.log("Error in changeAccountStatusController:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error updating account status",
//       error: error.message,
//     });
//   }
// };
const changeAccountStatusController = async (req, res) => {
  try {
    console.log("changeAccountStatusController called with:", req.body);

    const { doctorId, status } = req.body;
    console.log("Received doctorId:", doctorId, "status:", status);

    // Validate input
    if (!doctorId || !status) {
      return res.status(400).send({
        success: false,
        message: "Doctor ID and status are required",
      });
    }

    // Validate doctorId
    const doctorIdInt = parseInt(doctorId);
    if (isNaN(doctorIdInt)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Doctor ID format",
      });
    }

    // Find doctor first
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorIdInt },
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor application not found",
      });
    }

    console.log("Doctor found:", doctor.id, "linked userId:", doctor.userId);

    // Update doctor status
    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorIdInt },
      data: { status },
    });

    console.log("Doctor status updated:", updatedDoctor.status);

    // Find linked user
    const user = await prisma.user.findUnique({
      where: { id: doctor.userId },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Linked user not found",
      });
    }

    // Add notification
    const existingNotifications = user.notification || [];
    const updatedNotifications = [
      ...existingNotifications,
      {
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request has been ${status}`,
        onClickPath: "/notification",
        date: new Date().toISOString(),
      },
    ];

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: doctor.userId },
      data: {
        notification: updatedNotifications,
        isDoctor: status === "approved",
      },
    });

    console.log("User updated - isDoctor:", updatedUser.isDoctor);

    res.status(200).send({
      success: true,
      message: `Doctor Account ${status} Successfully`,
      data: {
        doctor: updatedDoctor,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isDoctor: updatedUser.isDoctor,
        },
      },
    });
  } catch (error) {
    console.log("Error in changeAccountStatusController:", error);
    res.status(500).send({
      success: false,
      message: "Error updating account status",
      error: error.message,
    });
  }
};


module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
};