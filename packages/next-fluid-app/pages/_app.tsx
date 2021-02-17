import { FunctionComponent } from "react";
import "../styles/globals.css";

interface IAppProps {
    Component: any;
    pageProps: any;
}

const App: FunctionComponent<IAppProps> = (props: IAppProps) => {
    return <props.Component {...props.pageProps} />;
};

export default App;
