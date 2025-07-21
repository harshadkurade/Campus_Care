import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="card-header">
          Dr. {doctor.firstName} {doctor.lastName}
        </div>
        <div className="card-body">
          <p>
            <b>Specialization</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience</b> {doctor.experience}
          </p>
          <p>
            <b>Fees Per Cunsaltation</b> {doctor.feesPerCunsaltation}
          </p>
          <p>
            <b>Timings</b> {doctor.timings[0]} - {doctor.timings[1]}
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DoctorList = () => {
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       try {
//         const response = await fetch("/api/doctors", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         });
//         const data = await response.json();
//         setDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctor data", error);
//       }
//     };
//     fetchDoctorData();
//   }, []);

//   return (
//     <div>
//       {doctors.map((doctor) => (
//         <div
//           className="card m-2"
//           key={doctor._id}
//           style={{ cursor: "pointer" }}
//           onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
//         >
//           <div className="card-header">
//             Dr. {doctor.firstName} {doctor.lastName}
//           </div>
//           <div className="card-body">
//             <p>
//               <b>Specialization:</b> {doctor.specialization}
//             </p>
//             <p>
//               <b>Experience:</b> {doctor.experience} years
//             </p>
//             <p>
//               <b>Fees Per Consultation:</b> {doctor.feesPerCunsaltation}
//             </p>
//             <p>
//               <b>Timings:</b>{" "}
//               {doctor.timings && doctor.timings.length >= 2
//                 ? `${doctor.timings[0]} - ${doctor.timings[1]}`
//                 : "Not available"}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DoctorList;