import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppBar";

export const Root = observer(() => {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
});
