import CTASection from "../components/landing/CTASection";
import FeatureSection from "../components/landing/FeatureSection";
import FooterSection from "../components/landing/FooterSection";
import HeroSection from "../components/landing/HeroSection";
import { features, pricingPlans, testimonials } from "../assets/data.js";
import PricingSection from "../components/landing/PricingSection";
import Testimonials from "../components/landing/Testimonials";
import { useClerk, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Landing = () => {
    const { openSignIn, openSignUp } =useClerk();
    const { isSignedIn } =  useUser();
    const navigate =useNavigate();

    useEffect(()=>{
        if(isSignedIn){
            navigate("/dashboard");
        }

    },[isSignedIn,navigate]);

    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Hero Section */}
            <HeroSection openSignIn={openSignIn} openSignUp={openSignUp} />

            {/* Features section */}
            <FeatureSection  features={features}/>

            {/* Pricing section */}
            <PricingSection pricingPlans={pricingPlans}/>

            {/* Testimonials section */}
            <Testimonials testimonials={testimonials}/>

            {/* CTA section */}
            <CTASection/>

            {/* Footer section */}
            <FooterSection/>
        </div>
    );
}

export default Landing;