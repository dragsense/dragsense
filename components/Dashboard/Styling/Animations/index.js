import React from 'react';
import { Button, Card } from 'antd';
import {useSession } from 'next-auth/react';
import Router from "next/router";

const AnimationsComponent = () => {

   const { data: session } = useSession();


   const handleOpenAppClick = async () => {

      try {

         if (!session.user)
            throw new Error("Unauthorized Access or Session Expired");


         const projectId = localStorage.getItem("project");

         const info = {
             pageType: 'animation',
             projectId,
         };

         const encodedInfo = encodeURIComponent(JSON.stringify(info));

         Router.push(`/admin/editor?info=${encodedInfo}`);

      } catch (e) {
         message.error(e?.message || "Something was wrong.")
      }


   };

   return (
      <Card>
         <Button type="primary" size="large" onClick={handleOpenAppClick}>
            Open Animation Editor Desktop App
         </Button>
      </Card>
   );
};

export default AnimationsComponent;