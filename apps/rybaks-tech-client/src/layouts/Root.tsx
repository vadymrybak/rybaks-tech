import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/AppBar.component";
import { useEffect } from "react";
import { useStores } from "../stores/RootStore";

export const Root = observer(() => {
  const { loadApp, viewLoaded } = useStores();

  useEffect(() => {
    loadApp();
  }, []);

  return (
    viewLoaded && (
      <>
        <AppHeader />
        <Outlet />
      </>
    )
  );
});
