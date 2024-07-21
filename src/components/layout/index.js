import {Outlet} from "react-router-dom";

const Layout = () => {
  return(
      <main>
        <div className="main">
          <Outlet />
        </div>
      </main>
  )
}

export default Layout;