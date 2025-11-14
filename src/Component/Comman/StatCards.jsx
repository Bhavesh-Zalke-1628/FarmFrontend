import { TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = "blue", gradient = false }) => (
    <div className={`${gradient
        ? `bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`
        : `bg-white border border-${color}-100`
        } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group hover:-translate-y-1 relative overflow-hidden`}>
        {gradient && (
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-xl ${gradient ? 'bg-white/20' : `bg-${color}-100`} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className={gradient ? 'text-white' : `text-${color}-600`} />
                </div>
                {trend && (
                    <div className={`flex items-center text-sm px-3 py-1 rounded-full ${gradient ? 'bg-white/20 text-white' :
                        trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
                        <span className="ml-1 font-medium">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <h3 className={`text-3xl font-black mb-2 ${gradient ? 'text-white' : 'text-gray-900'}`}>
                {value}
            </h3>
            <p className={`text-sm font-medium mb-1 ${gradient ? 'text-white/90' : 'text-gray-700'}`}>
                {title}
            </p>
            {subtitle && (
                <p className={`text-xs ${gradient ? 'text-white/70' : 'text-gray-500'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

export {
    StatCard
}