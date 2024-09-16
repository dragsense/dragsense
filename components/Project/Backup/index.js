import React, { } from "react";


import Backups from './Backups';

export function BackupComponent({ projectId, SetTotalBackups = () => {} }) {

    return  <Backups projectId={projectId} SetTotalBackups={SetTotalBackups} />



};


