import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/react";

const ClerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
	<ClerkProvider publishableKey={ClerkPubKey}>
		<App />
	</ClerkProvider>
);
