import "./App.css";

import Disqus from "disqus-react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import { RecoilRoot } from "recoil";

import { AppHeaderSection } from "./HeaderFooter/AppHeaderSection";
import { FullDiv } from "./styles/HomeStyles";
import { MetroListAll } from "./USPage/AdminMetro";
import { AdminNewVenueImport } from "./USPage/AdminNewVenueImport";
import { AdminNewVenuesRepopulate } from "./USPage/AdminNewVenuesRepopulate";
import { MetroListTBD } from "./USPage/AdminTBDMetro";
import { ListsPage } from "./USPage/ListsPage";
import { VenueEditFromURL } from "./USPage/VenueEdit";
import { VenuePage } from "./USPage/VenuePage";
import Clarity from "@microsoft/clarity";

interface IRoute {
  path: string;
  component: any;
  name: string; // Used to update page infon and title.
}

const routes: IRoute[] = [
  {
    path: "/",
    component: ListsPage,
    name: "YumYum",
  },
  {
    path: "/metro/:metro/list/:listname",
    component: ListsPage,
    name: "List",
  },
  {
    path: "/metro/:metro/venue/:venue_id",
    component: VenuePage,
    name: "Venue",
  },
  {
    path: "/metro/:metro/admin",
    component: MetroListAll,
    name: "Manage Metro",
  },
  {
    path: "/metro/:metro/import",
    component: AdminNewVenueImport,
    name: "Metro Data Import",
  },
  {
    path: "/metro/:metro/repopulate",
    component: AdminNewVenuesRepopulate,
    name: "Metro Repopulate Data",
  },
  {
    path: "/metro/:metro/tbd",
    component: MetroListTBD,
    name: "Metro TBD",
  },
  {
    path: "/admin/venue/:venue_id",
    component: VenueEditFromURL,
    name: "Edit Venue",
  },
];

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>Oops something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
      <button onClick={resetErrorBoundary}>
        <Link to="/">Home</Link>
      </button>
    </div>
  );
}

export interface IApplicationProps {}
const App: React.FunctionComponent<IApplicationProps> = (props) => {
  const projectId = "p2ulb8lwpw";
  Clarity.init(projectId);
  console.log("clarity initialized");

  return (
    <div className="App">
      <header className="App-header">
        <RecoilRoot>
          <FullDiv>
            <Router>
              <AppHeaderSection />
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Switch>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      exact={true}
                      render={(routeProps: RouteComponentProps<any>) => {
                        return <route.component {...routeProps} />;
                      }}
                    />
                  ))}
                  <Route render={() => <Redirect to="/" />} />
                </Switch>
              </ErrorBoundary>
            </Router>
            <FooterSection />
          </FullDiv>
        </RecoilRoot>
      </header>
    </div>
  );
};

const FooterSection = () => {
  const disqusShortname = "yumyumlife";
  const disqusConfig = {
    url: "https://yumyum.life",
    identifier: "yummain",
    title: "YumYum.life Michelin Reservations Made Easy",
  };
  return (
    <FullDiv>
      <Disqus.DiscussionEmbed
        shortname={disqusShortname}
        config={disqusConfig}
      />
    </FullDiv>
  );
};

export default App;
