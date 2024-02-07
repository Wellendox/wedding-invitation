"use client";

import Cards from "@/components/Cards";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";
export default function Home() {
  return (
    <>
      <div className="p-4">
        <Cards />
        <div className="p-4 ">
          <SignupForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
