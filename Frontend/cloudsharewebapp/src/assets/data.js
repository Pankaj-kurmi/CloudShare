export const features = [
	{
		iconName: "ArrowUpCircle",
		iconColor: "text-purple-500",
		title: "Easy File Upload",
		description: "Quickly upload your files with our intuitive drag-and-drop interface.",
	},
	{
		iconName: "Shield",
		iconColor: "text-green-500",
		title: "Secure Storage",
		description: "Your files are encrypted and stored securely in our cloud infrastructure.",
	},
	{
		iconName: "Share2",
		iconColor: "text-purple-500",
		title: "Simple Sharing",
		description: "Share files with anyone using secure links that you control.",
	},
	{
		iconName: "CreditCard",
		iconColor: "text-orange-500",
		title: "Flexible Plans",
		description: "Choose a subscription plan that fits your storage and sharing needs.",
	},
];

export const pricingPlans = [
	{
		name: "Starter",
		description: "A simple plan for personal use and light file sharing.",
		price: "₹0",
		period: "/month",
		highlighted: false,
		buttonText: "Get Started",
		features: ["5 GB storage", "Basic sharing links", "Community support"],
	},
	{
		name: "Pro",
		description: "Best for creators and small teams that share files daily.",
		price: "₹100",
		period: "/month",
		highlighted: true,
		buttonText: "Choose Pro",
		features: ["100 GB storage", "Password-protected links", "Priority support"],
	},
	{
		name: "Business",
		description: "Advanced collaboration features for growing teams.",
		price: "₹299",
		period: "/month",
		highlighted: false,
		buttonText: "Contact Sales",
		features: ["1 TB storage", "Team access controls", "Dedicated support"],
	},
];

export const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Marketing Director",
		company: "CreativeMinds Inc.",
		rating: 5,
		quote:
			"CloudShare has transformed how our team collaborates on creative assets. The secure sharing and intuitive interface have made file management a breeze.",
		initials: "SJ",
		avatarClass: "from-amber-400 via-orange-400 to-pink-500",
	},
	{
		name: "Michael Chen",
		role: "Freelance Designer",
		company: "Self-employed",
		rating: 5,
		quote:
			"As a freelancer, I need to share large design files with clients securely. CloudShare's simple interface and reasonable pricing make it my go-to solution.",
		initials: "MC",
		avatarClass: "from-slate-300 via-slate-400 to-slate-500",
	},
	{
		name: "Priya Sharma",
		role: "Project Manager",
		company: "TechSolutions Ltd.",
		rating: 4,
		quote:
			"Managing project files across multiple teams used to be a nightmare until we found CloudShare. Now everything is organized and accessible exactly when we need it.",
		initials: "PS",
		avatarClass: "from-cyan-400 via-sky-400 to-blue-500",
	},
];
