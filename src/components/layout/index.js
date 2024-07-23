import {Outlet} from "react-router-dom";
import classNames from "classnames/bind";
import {useContext} from "react";
import {Context} from "../../store/context";

const Layout = () => {
  const {isRainy} = useContext(Context);

  return(
      <main>
        <div className={classNames('main', {'--rainy': isRainy})}>
          <Outlet />
        </div>
      </main>
  )
}

export default Layout;