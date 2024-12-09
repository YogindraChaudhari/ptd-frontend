// import MapComponent from "../components/MapComponent";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";

// const HomePage = () => {
//   const [showBackToTop, setShowBackToTop] = useState(false);
//   // Scroll listener for showing the "Back to Top" button
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 300) {
//         setShowBackToTop(true);
//       } else {
//         setShowBackToTop(false);
//       }
//     };
//     // Attach the event listener
//     window.addEventListener("scroll", handleScroll);

//     // Clean up the event listener on component unmount
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Scroll to top function
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className=" min-h-screen">
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-3xl font-bold text-center mb-6 text-emerald-600">
//           Welcome to the Plant Tracker App
//         </h1>
//         <p className="text-md text-center text-green-800 mb-8">
//           Use this app to Track, Register, and Update information on various
//           plants around you.
//         </p>
//         {/* Buttons Section */}
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-bold"> */}
//         <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 overflow-x-auto font-bold">
//           {/* Register Plant */}
//           <Link to="/register-plant">
//             <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300">
//               Register Plant
//             </button>
//           </Link>

//           {/* Update Plant */}
//           <Link to="/update-plant">
//             <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300">
//               Update Plant
//             </button>
//           </Link>

//           {/* Delete Plant */}
//           <Link to="/delete-plant">
//             <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
//               Delete Plant
//             </button>
//           </Link>

//           {/* Zone Wise Plant Details */}
//           <Link to="/zone-wise-plant-details">
//             <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
//               Zone Wise Plant Details
//             </button>
//           </Link>

//           {/* All Plant Details */}
//           <Link to="/all-plant-details">
//             <button className="bg-gradient-to-r from-cyan-500 to-indigo-800 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
//               All Plant Details
//             </button>
//           </Link>
//         </div>

//         {/* Map Section */}
//         <div className="mt-8 overflow-hidden md:overflow-auto">
//           <MapComponent />
//         </div>

//         {/* Back to Top Button for Mobile View */}
//         {showBackToTop && (
//           <button
//             onClick={scrollToTop}
//             className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
//             style={{ zIndex: 1000 }}
//           >
//             ↑ Back To Top
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import MapComponent from "../components/MapComponent";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const HomePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Access the auth context
  const { auth } = useContext(AuthContext);

  // Check user role
  const isAdmin =
    auth.user?.role === "zonal-admin" || auth.user?.role === "super-admin";

  // Scroll listener for showing the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    // Attach the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-600">
          Welcome to the Plant Tracker App
        </h1>
        <p className="text-md text-center text-green-800 mb-8">
          Use this app to Track, Register, and Update information on various
          plants around you.
        </p>
        {/* Buttons Section */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 overflow-x-auto font-bold">
          {/* Conditionally Render Admin Buttons */}
          {isAdmin && (
            <>
              {/* Register Plant */}
              <Link to="/register-plant">
                <button className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 w-full max-w-[220px] shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300">
                  Register Plant
                </button>
              </Link>

              {/* Update Plant */}
              <Link to="/update-plant">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-300">
                  Update Plant
                </button>
              </Link>

              {/* Delete Plant */}
              <Link to="/delete-plant">
                <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300">
                  Delete Plant
                </button>
              </Link>
            </>
          )}

          {/* Zone Wise Plant Details */}
          <Link to="/zone-wise-plant-details">
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
              Zone Wise Plant Details
            </button>
          </Link>

          {/* All Plant Details */}
          <Link to="/all-plant-details">
            <button className="bg-gradient-to-r from-cyan-500 to-indigo-800 text-white rounded-xl p-4 shadow-lg hover:scale-105 active:scale-90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300">
              All Plant Details
            </button>
          </Link>
        </div>

        {/* Map Section */}
        <div className="mt-8 overflow-hidden md:overflow-auto">
          <MapComponent />
        </div>

        {/* Back to Top Button for Mobile View */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
            style={{ zIndex: 1000 }}
          >
            ↑ Back To Top
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
