import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../components/layout";

const Router = () => {
  return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default Router;