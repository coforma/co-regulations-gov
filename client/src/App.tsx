import React from 'react';
import { socket, SocketContext } from './context/socket';

import Home from './features/Home';

const App = () => (
  <SocketContext.Provider value={socket}>
    <Home />
  </SocketContext.Provider>
);

export default App;
