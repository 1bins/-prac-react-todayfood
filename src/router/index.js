import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "../pages/home";
import Layout from "../components/layout";

const Router = () => {
  return(
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default Router;