import { Routes, Route, Navigate } from "react-router-dom";
import { Root } from "./layouts/Root";
import { Self } from "./pages/Self/Self.page";
import { Timeline } from "./pages/Timeline/Timeline.page";
import { NoMatch } from "./pages/NoMatch/NoMatch.page";
import { LoginForm } from "./pages/Login/Login.page";
import { useEffect } from "react";
import { useStores } from "./stores/RootStore";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  const { fetchAppVariables, token, appLoaded } = useStores();

  useEffect(() => {
    fetchAppVariables();
  }, []);

  return (
    appLoaded && (
      <>
        {/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
        <Routes>
          <Route path="/" element={token ? <Root /> : <Navigate to={"login"} />}>
            <Route index element={<Navigate to="my" />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="my" element={<Self />} />
            {/* <ProtectedRoute path= */}

            {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
            <Route path="*" element={<NoMatch />} />
          </Route>
          <Route path="login" element={token ? <Navigate to={"/"} /> : <LoginForm />} />
        </Routes>
      </>
    )
  );
});

export default App;
