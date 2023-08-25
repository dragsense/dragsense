import React, { useState, useEffect } from "react";

import ThemeList from "./ThemeList";
import AddComponent from './Add';
import { fetcher } from "@/lib/fetch";
import { Card, message } from "antd";

export function ThemeComponent({ isLoading, themes, setThemes,project }) {

    return (
      
            <div className="">
           
               <Card loading={isLoading}> <ThemeList themes={themes} project={project} setThemes={setThemes}/> </Card>
            </div>
       
    );
};


