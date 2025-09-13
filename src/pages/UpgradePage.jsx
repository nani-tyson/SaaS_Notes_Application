import { useAuth } from '../contexts/AuthContext';
import { upgradeTenantPlan } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheckCircle, FiZap,  } from 'react-icons/fi';

const UpgradePage = () => {
    const { user, refreshSession } = useAuth();
    const navigate = useNavigate();

    const handleUpgrade = async () => {
        try {
            const response = await upgradeTenantPlan(user.slug);
            alert('Upgrade successful!');
            refreshSession(response.newtoken);
            navigate('/');
        } catch (error) {
            alert(`Upgrade failed: ${error.message}`);
        }
    };

    return (
        <>
            <Helmet><title>Upgrade Plan | SaaS Notes</title></Helmet>
            <div className="p-4 md:p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade Your Plan</h1>
                <p className="text-gray-500 mb-8">Choose the plan that's right for you.</p>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="border-2 border-gray-200 rounded-lg p-8 text-center"><h2 className="text-2xl font-semibold text-gray-500">Free</h2><p className="text-4xl font-bold my-4">$0 <span className="text-lg font-normal text-gray-400">/ month</span></p><ul className="space-y-3 text-gray-500 mb-8"><li className="flex items-center justify-center"><FiCheckCircle className="text-green-500 mr-2" /> Up to 3 notes</li><li className="flex items-center justify-center"><FiCheckCircle className="text-green-500 mr-2" /> Basic support</li></ul><button disabled className="w-full bg-gray-200 text-gray-500 font-bold py-3 rounded-lg">Your Current Plan</button></div>
                    <div className="border-2 border-indigo-600 rounded-lg p-8 text-center shadow-2xl relative"><span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full absolute -top-4">RECOMMENDED</span><h2 className="text-2xl font-semibold text-indigo-600">Pro</h2><p className="text-4xl font-bold my-4">$10 <span className="text-lg font-normal text-gray-400">/ month</span></p><ul className="space-y-3 text-gray-600 mb-8"><li className="flex items-center justify-center"><FiZap className="text-indigo-500 mr-2" /> Unlimited notes</li><li className="flex items-center justify-center"><FiZap className="text-indigo-500 mr-2" /> Priority support</li><li className="flex items-center justify-center"><FiZap className="text-indigo-500 mr-2" /> API Access</li></ul><button onClick={handleUpgrade} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300">Upgrade to Pro</button></div>
                </div>
            </div>
        </>
    );
};
export default UpgradePage;