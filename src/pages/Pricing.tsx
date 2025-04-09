
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockPricingPlans } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Choose the plan that best fits your real estate needs, whether you're a property owner,
            buyer, or real estate professional.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockPricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg overflow-hidden transition-all ${
                plan.mostPopular
                  ? "border-2 border-secondary shadow-lg scale-105"
                  : "border border-gray-200"
              }`}
            >
              <div
                className={`p-6 ${
                  plan.mostPopular ? "bg-secondary text-white" : "bg-white"
                }`}
              >
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price !== 0 && <span className="text-sm"> / month</span>}
                </div>
              </div>

              <div className="p-6 bg-white">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check
                        className={`h-5 w-5 mr-2 mt-0.5 ${
                          plan.mostPopular ? "text-secondary" : "text-primary"
                        }`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    className={`w-full ${
                      plan.mostPopular
                        ? "bg-secondary hover:bg-secondary/90"
                        : ""
                    }`}
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/register");
                      } else {
                        // Handle subscription
                        console.log(`Selected plan: ${plan.name}`);
                      }
                    }}
                  >
                    {isAuthenticated ? "Get Started" : "Sign Up Now"}
                  </Button>
                </div>
              </div>
              {plan.mostPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-secondary text-white px-4 py-1 uppercase text-xs font-bold rounded-bl">
                    Most Popular
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Your billing will be
                adjusted prorated accordingly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee. If you're not satisfied with our service,
                contact us within 14 days of your purchase for a full refund.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a long-term contract?</h3>
              <p className="text-gray-600">
                No, all our plans are month-to-month. You can cancel at any time without penalties.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer custom enterprise plans?</h3>
              <p className="text-gray-600">
                Yes, we offer custom plans for large real estate agencies and brokerages. Contact
                our sales team for details.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Yes, we use industry-standard security measures to protect your data. All
                information is encrypted and stored securely.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Our team can create a tailored package to meet the specific needs of your real estate
            business. Get in touch to discuss your requirements.
          </p>
          <Button size="lg">Contact Sales</Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pricing;
