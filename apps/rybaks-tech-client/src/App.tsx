import { Routes, Route, Navigate } from "react-router-dom";
import { Root } from "./layouts/Root";
import { Self } from "./pages/Self/Self.page";
import { Timeline } from "./pages/Timeline/Timeline.page";
import { NoMatch } from "./pages/NoMatch/NoMatch.page";
import { LoginForm } from "./pages/Login/Login.page";
import { useEffect } from "react";
import { useStores } from "./stores/RootStore";
import { observer } from "mobx-react-lite";
import { getCookieByName } from "./utils/utils";
import { Logger } from "./utils/logger";

const App = observer(() => {
  const { checkToken, tokenOK, appLoaded, setAppLoaded } = useStores();

  useEffect(() => {
    const token = getCookieByName("access_token");

    Logger.info(`App started. Some token exists: ${!!token}`);

    if (token) {
      checkToken(token);
    } else {
      setAppLoaded(true);
    }
  }, []);

  return (
    appLoaded && (
      <Routes>
        <Route path="/" element={tokenOK ? <Root /> : <Navigate to={"login"} />}>
          <Route index element={<Navigate to="my" />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="my" element={<Self />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="login" element={tokenOK ? <Navigate to={"/"} /> : <LoginForm />} />
      </Routes>
    )
  );
});

export default App;
