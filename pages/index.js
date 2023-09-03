import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react"; // Import useEffect to perform side effects

export default function Home({ isLoggedin, user }) {
  const router = useRouter();

  // Use the useEffect hook to perform redirection on the client side
  useEffect(() => {
    // Check if the user is logged in
    if (!isLoggedin) {
      // If not logged in, redirect to the login page
      router.push("/auth/login");
    } else {
      // If logged in, redirect to the admin/projects page
      router.push("/admin/projects");
    }
  }, [isLoggedin, router]); // Add isLoggedin and router to the dependency array

  return null;
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  let isLoggedin = false;
  if (session && session?.user) {
    isLoggedin = true;
  }

  return {
    props: { isLoggedin },
  };
}