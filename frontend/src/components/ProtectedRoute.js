// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { hideLoading, showLoading } from "../redux/features/alertSlice";
// import { setUser } from "../redux/features/userSlice";

// export default function ProtectedRoute({ children }) {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.user);

//   //get user
//   //eslint-disable-next-line
//   const getUser = async () => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post(
//         "/api/v1/user/getUserData",
//         { token: localStorage.getItem("token") },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       dispatch(hideLoading());
//       if (res.data.success) {
//         dispatch(setUser(res.data.data));
//       } else {
//         localStorage.clear();
//         <Navigate to="/login" />;
//       }
//     } catch (error) {
//       localStorage.clear();
//       dispatch(hideLoading());
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       getUser();
//     }
//   }, [user, getUser]);

//   if (localStorage.getItem("token")) {
//     return children;
//   } else {
//     return <Navigate to="/login" />;
//   }
// }

import React, { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [ready, setReady] = useState(false);

  const getUser = useCallback(async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/getUserData",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
        setReady(true);
      } else {
        localStorage.clear();
        setReady(true); // allow redirect
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      console.log(error);
      setReady(true); // allow redirect
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      setReady(true); // already logged in
    }
  }, [user, getUser]);

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  if (!ready) {
    return null; // don't render children or redirect until ready
  }

  return children;
}
