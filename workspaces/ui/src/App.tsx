import { socket, SocketContext } from './context/socket';

import Home from './features/Home';

const App = () => (
  <>
    <SocketContext.Provider value={socket}>
      <Home />
    </SocketContext.Provider>
    <footer
      className="padding-2 display-flex position-fixed bottom-0 text-base-lightest width-full flex-justify"
      style={{ background: '#2c2c2c' }}
    >
      <div>© Coforma {new Date().getFullYear()}</div>
      <div>
        <a
          className="text-base-lightest"
          href="https://coforma.io/"
          target="blank"
        >
          Coforma
        </a>
        &nbsp;|&nbsp;
        <a
          className="text-base-lightest"
          href="https://www.regulations.gov/"
          target="blank"
        >
          Regulations.gov
        </a>
      </div>
    </footer>
  </>
);

export default App;
