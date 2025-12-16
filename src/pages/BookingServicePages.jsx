import React from "react";
import Header from "../components/Header";
import UserBooking from "../components/UserBooking";
import UserBookingMobile from "@/components/UserBookingMobile";

const BookingServicePages = () => {
  return (
    <>
      <Header />

      {/* Desktop & Tablet */}
      <div className="hidden md:block">
        <UserBooking />
      </div>

      {/* Mobile only */}
      <div className="block md:hidden">
        <UserBookingMobile />
      </div>
    </>
  );
};

export default BookingServicePages;
