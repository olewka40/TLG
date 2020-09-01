import React from "react";
import io from "socket.io-client";
import SocketService from "../../services/SocketService";
import axios from "axios";
import { DialogsContext } from "../../context/listDialogs";
import { Layout } from "../Layout";
import { withRouter } from "next/router";
import cookies from "next-cookies";
import browserCookies from "browser-cookies";
import { UserContext } from "../../context/user";
import { apiMessageToMessage } from "../../utils/converter";

axios.defaults.baseURL = "http://localhost:3000/";

export default function withContextPage(Component) {
  class Page extends React.Component {
    constructor(props) {
      super(props);
      if (process.browser) {
        this.socket = io({
          query: {
            userid: browserCookies.get("userId")
          }
        });
        SocketService.init(this.socket);
      }

      this.state = {
        dialogs: props.dialogs.map(apiMessageToMessage)
      };
    }

    componentDidMount() {
      console.log("didmount", this.props);
    }
    componentDidUpdate(prevProps) {
      if (this.props.dialogs !== prevProps.dialogs) {
        console.log("didUpdate", this.props);
        this.setState({ dialogs: this.props.dialogs.map(apiMessageToMessage) });
      }
    }

    updateDialog = (dialogid, params) => {
      const { dialogs } = this.state;
      const dialogIndex = dialogs.findIndex(dialog => dialog._id === dialogid);

      const newDialog = { ...dialogs[dialogIndex], ...params };

      dialogs[dialogIndex] = apiMessageToMessage(newDialog);

      this.setState({ dialogs });
    };

    static async getInitialProps(appContext) {
      // calls page's `getInitialProps` and fills `appProps.pageProps`
      const appProps =
        Component.getInitialProps &&
        (await Component.getInitialProps(appContext));
      const { userId } = cookies(appContext);
      const {
        data: { data: dialogs }
      } = await axios.get(`/api/getDialogs/${userId}`, { headers: { userId } });
      const {
        data: { users }
      } = await axios.get(`/api/getUsers`, {
        headers: { userId }
      });
      const newDialogs = dialogs.map(dialog => {
        return {
          ...dialog,
          users: dialog.users.map(({ userId }) => {
            return users.find(user => user._id === userId);
          })
        };
      });
      console.log(newDialogs);
      return {
        ...appProps,
        userId: userId,
        dialogs: newDialogs
      };
    }
    render() {
      const {
        router: { route },
        userId,
        ...appProps
      } = this.props;
      const { dialogs } = this.state;
      // экшены
      const { updateDialog } = this;
      return (
        <UserContext.Provider value={{ userId }}>
          <DialogsContext.Provider value={{ dialogs, updateDialog, userId }}>
            <Layout isLogin={route === "/login"}>
              <Component {...appProps} />
            </Layout>
          </DialogsContext.Provider>
        </UserContext.Provider>
      );
    }
  }
  return withRouter(Page);
}
