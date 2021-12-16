import React from 'react';
import { SocketContext, socket } from './context/socket';

import Form from './components/Form';

const App = () => (
  <SocketContext.Provider value={socket}>
    <Form />
  </SocketContext.Provider>
);

export default App;
