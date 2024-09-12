import "./App.css";
import AuthContextProvider from "./Hooks/UseAuth";
import { Route, Routes } from "react-router-dom";

import PublicRoute from "./RouteLayout/PublicRoute";
import Login from "./App/Login/Login";
import ErrorPage from "./components/Error/ErrorPage";
import AdminPrivateRoute from "./RouteLayout/AdminPrivateRoute";
import AdminProfile from "./AdminDashboard/Admin/AdminProfile";
import AdminProtected from "./Utils/AdminProtected";
import CatogeryCreate from "./AdminDashboard/Catogery/CatogeryCreate";
import ProductCreate from "./AdminDashboard/Product/ProductCreate";
import TableCreate from "./AdminDashboard/Table/TableCreate";
import CreateStock from "./AdminDashboard/Stock/CreateStock";
import OrderNow from "./AdminDashboard/OrderTable/OrderNow";
import SingleTable from "./AdminDashboard/OrderTable/SingleTable";
import SingleBill from "./AdminDashboard/Bill/SingleBill";

// import CreateMenu from "./AdminDashboard/CreateMenu";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route element={<AdminProtected />}>
            <Route element={<AdminPrivateRoute />}>
              <Route path="/adminprofile" element={<AdminProfile />} />
              <Route path="/catogery" element={<CatogeryCreate />} />
              <Route path="/product" element={<ProductCreate />} />
              <Route path="/createtabe" element={<TableCreate />} />
              <Route path="/stock" element={<CreateStock />} />
              <Route path="/order" element={<OrderNow />} />
              <Route path="/singletable/:id" element={<SingleTable />} />
              <Route path="/singlebill/:id" element={<SingleBill />} />
            </Route>
          </Route>
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
