import { FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const UpgradePrompt = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center">
            <FiZap size={24} className="mr-4" />
            <div>
                <h4 className="font-bold text-lg">Free Plan Limit Reached!</h4>
                <p className="text-sm">Upgrade to the Pro plan for unlimited notes.</p>
            </div>
        </div>
        <Link to="/upgrade" className="bg-white text-indigo-600 font-bold py-2 px-5 rounded-lg hover:bg-gray-200 transition duration-300 shadow-md flex-shrink-0">
            Upgrade Now
        </Link>
    </div>
);

export default UpgradePrompt;