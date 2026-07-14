import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/react";
import {
	BadgeDollarSign,
	CreditCard,
	Files,
	LayoutDashboard,
	Menu,
	Share2,
	Upload,
	X,
} from "lucide-react";

const navItems = [
	{
		label: "Dashboard",
		path: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		label: "Upload",
		path: "/upload",
		icon: Upload,
	},
	{
		label: "My Files",
		path: "/my-files",
		icon: Files,
	},
	{
		label: "Subscription",
		path: "/subscription",
		icon: CreditCard,
	},
	{
		label: "Transactions",
		path: "/transcations",
		icon: BadgeDollarSign,
	},
];

const DashboardLayout = ({ title, children }) => {
	const { user } = useUser();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const initials = useMemo(() => {
		const source =
			user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || "U";

		const initialsValue = source
			.split(" ")
			.filter(Boolean)
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();

		return initialsValue || "U";
	}, [user]);

	return (
		<div className="dashboard-shell">
			<header className="dashboard-header">
				<div className="dashboard-header-left">
					<button
						type="button"
						className="menu-toggle"
						onClick={() => setIsSidebarOpen((prev) => !prev)}
						aria-label="Toggle sidebar"
					>
						{isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
					</button>
					<Link to="/dashboard" className="dashboard-logo-link">
						<span className="dashboard-logo-icon">
							<Share2 size={16} />
						</span>
						<span>Cloud Share</span>
					</Link>
				</div>

				<div className="dashboard-header-right">
					<div className="credit-pill">
						<BadgeDollarSign size={14} />
						<span>5 Credits</span>
					</div>
					<div className="dashboard-user-button">
						<UserButton />
					</div>
				</div>
			</header>

			<div className="dashboard-body">
				<aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
					<div className="sidebar-profile">
						<div className="profile-avatar">{initials}</div>
						<h3>{user?.fullName || "Cloud User"}</h3>
					</div>

					<nav className="sidebar-nav">
						{navItems.map(({ icon: Icon, label, path }) => (
							<NavLink
								key={path}
								to={path}
								onClick={() => setIsSidebarOpen(false)}
								className={({ isActive }) =>
									`sidebar-nav-item ${isActive ? "active" : ""}`
								}
							>
								<Icon size={18} />
								<span>{label}</span>
							</NavLink>
						))}
					</nav>
				</aside>

				{isSidebarOpen && (
					<button
						type="button"
						className="sidebar-overlay"
						onClick={() => setIsSidebarOpen(false)}
						aria-label="Close sidebar"
					/>
				)}

				<main className="dashboard-content">
					<div className="dashboard-content-header">
						<h1>{title}</h1>
						<p>Manage your files, monitor usage, and track account activity in one place.</p>
					</div>
					{children}
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
