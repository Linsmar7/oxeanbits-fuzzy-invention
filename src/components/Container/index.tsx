import './styles.css';

import { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className='container'>
      {children}
    </div>
  );
};
