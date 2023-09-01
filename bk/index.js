import React from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import the useRouter hook

export default function Home({ isLoggedin, user }) {
  const router = useRouter(); // Initialize the useRouter hook

  // Check if the user is logged in
  if (!isLoggedin) {
    // If not logged in, redirect to the login page
    router.push("/auth/login");
    return null; // Return null to prevent rendering anything on this page
  }

  // If logged in, redirect to the admin/projects page
  router.push("/admin/projects");
  return null; // Return null to prevent rendering anything on this page
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  let isLoggedin = false;
  if (session && session?.user) {
    isLoggedin = true;
  }

  return {
    props: { isLoggedin },
  };
}