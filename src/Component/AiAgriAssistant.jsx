import React, { useState, useEffect } from 'react';
// import { getAgriculturalInsights } from '../services/aiService';
import { Tractor, Bot, CloudSun, Sprout, BarChart2, Bug } from 'lucide-react';

const AiAgriAssistant = ({ language, userRegion, currentCrop }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('weather');

    const quickPrompts = [
        {
            icon: <CloudSun size={18} />,
            text: language === 'mr' ? 'आजचे हवामान अंदाज' : "Today's weather forecast",
            tab: 'weather'
        },
        {
            icon: <Sprout size={18} />,
            text: language === 'mr' ? `${currentCrop} साठी सल्ला` : `Advice for ${currentCrop}`,
            tab: 'crop'
        },
        {
            icon: <BarChart2 size={18} />,
            text: language === 'mr' ? 'बाजार भाव विश्लेषण' : 'Market price analysis',
            tab: 'market'
        },
        {
            icon: <Bug size={18} />,
            text: language === 'mr' ? 'कीटक सल्ला' : 'Pest advisory',
            tab: 'pest'
        }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        const aiResponse = await getAgriculturalInsights(
            `User location: ${userRegion}. Current crop: ${currentCrop}. Query: ${query}`,
            language
        );
        setResponse(aiResponse);
        setIsLoading(false);
    };

    const handleQuickPrompt = async (tab) => {
        setActiveTab(tab);
        setIsLoading(true);

        let prompt = '';
        switch (tab) {
            case 'weather':
                prompt = language === 'mr'
                    ? `${userRegion} साठी 7-दिवसीय हवामान अंदाज सांगा`
                    : `Give 7-day weather forecast for ${userRegion}`;
                break;
            case 'crop':
                prompt = language === 'mr'
                    ? `${currentCrop} लागवडीसाठी सध्याचे शिफारसी सांगा`
                    : `Give current recommendations for ${currentCrop} cultivation`;
                break;
            case 'market':
                prompt = language === 'mr'
                    ? `${currentCrop} च्या बाजारभावाचे विश्लेषण सांगा`
                    : `Analyze current market prices for ${currentCrop}`;
                break;
            case 'pest':
                prompt = language === 'mr'
                    ? `${currentCrop} साठी कीटक नियंत्रण सल्ला`
                    : `Give pest control advice for ${currentCrop}`;
                break;
        }

        const aiResponse = await getAgriculturalInsights(prompt, language);
        setResponse(aiResponse);
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-4">
                <Bot className="text-green-600" size={24} />
                <h3 className="font-semibold">
                    {language === 'mr' ? 'कृषी एआय सहाय्यक' : 'AI Agri Assistant'}
                </h3>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {quickPrompts.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickPrompt(item.tab)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm whitespace-nowrap ${activeTab === item.tab
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {item.icon}
                        {item.text}
                    </button>
                ))}
            </div>

            <form
                // onSubmit={handleSubmit}
                className="mb-4">

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={
                            language === 'mr'
                                ? 'तुमचा प्रश्न टाइप करा...'
                                : 'Type your question...'
                        }
                        className="w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:bg-gray-400"
                    >
                        {isLoading ? (
                            <div className="animate-spin">↻</div>
                        ) : (
                            '→'
                        )}
                    </button>
                </div>
            </form>

            {isLoading ? (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    <p className="mt-2 text-gray-600">
                        {language === 'mr' ? 'प्रतिक्रिया तयार होत आहे...' : 'Generating response...'}
                    </p>
                </div>
            ) : (
                response && (
                    <div className="bg-green-50 rounded-lg p-4 whitespace-pre-wrap">
                        {response}
                    </div>
                )
            )}
        </div>
    );
};

export default AiAgriAssistant;