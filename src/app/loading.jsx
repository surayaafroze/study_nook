import React from 'react';
import { PuffLoader } from 'react-spinners';


const loading = () => {
  return (
    <div className=' min-h-screen flex justify-center items-center'>
      <PuffLoader />
    </div>
  );
};

export default loading;