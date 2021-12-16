import React from 'react';
import { SocketContext, socket } from './context/socket';
import './App.css';

import Form from './components/Form';

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Form />
    </SocketContext.Provider>
  );
};

export default App;
