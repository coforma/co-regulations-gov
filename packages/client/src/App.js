import React from 'react';
import { SocketContext, socket } from './context/socket';

import Home from './components/Home';

const App = () => (
  <SocketContext.Provider value={socket}>
    <Home />
  </SocketContext.Provider>
);

export default App;
