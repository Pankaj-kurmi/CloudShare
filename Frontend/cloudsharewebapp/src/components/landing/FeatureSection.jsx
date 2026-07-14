import { ArrowUpCircle, CreditCard, Share2, Shield } from "lucide-react";

const iconMap = {
  ArrowUpCircle,
  Shield,
  Share2,
  CreditCard,
};

const FeatureSection = ({features}) => {
    return (
       <div className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Everything you need for the file sharing
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                CloudShare provides all the tools you need to manage your digital content
            </p>
        </div>

        <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                   <div
  key={index}
  className="pt-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-md"
>
  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
    <div className="-mt-6">
      <div className="inline-flex items-center justify-center rounded-md bg-white p-3 shadow-sm ring-1 ring-gray-100">
        {(() => {
          const Icon = iconMap[feature.iconName];

          return Icon ? <Icon className={`h-6 w-6 ${feature.iconColor}`} /> : null;
        })()}
      </div>

      <h3 className="mt-5 text-lg font-medium text-gray-900 tracking-tight">
        {feature.title}
      </h3>
      <p className="mt-2 text-base text-gray-500">
    {feature.description}
</p>
    </div>
  </div>
</div>
                ))}
            </div>
        </div>
    </div>
</div>
    );
}

export default FeatureSection;