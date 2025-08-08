import React, { useState, useRef, useEffect } from 'react';

// --- Import images from src/assets ---
import ammaImg from './assets/amma.png';
import ammayiImg from './assets/ammayi.png';
import ammavanImg from './assets/ammavan.png';
import nriImg from './assets/nri.png';
import ammomaImg from './assets/ammoma.jpg';
import njanNintePrayathilImg from './assets/njnan ninte prayathil.jpg';
import healthConsciousImg from './assets/health concious.jpeg';
import achaImg from './assets/dad.png';
import kunjaniyanImg from './assets/aniyan.png';
import chechiImg from './assets/chechi.jpg';
import groupIcon from './assets/kudumbam.png';

// --- MOCK CHAT DATA ---
const initialChatData = {
    "kudumbam_group": {
        id: "kudumbam_group",
        name: "KUDUMBAM",
        image: groupIcon,
        type: 'group',
        messages: [
            { sender: "AI Amma", text: "Good morning எல்லாரும்! Breakfast കഴിച്ചோ?", timestamp: "8:15 AM" },
            { sender: "Chill Acha", text: "👍", timestamp: "8:16 AM" },
        ]
    },
    "ai_amma": { id: "ai_amma", name: "AI Amma", image: ammaImg, type: 'individual', messages: [{ sender: "AI Amma", text: "Nee nerathe ezhunetto?", timestamp: "Yesterday" }] },
    "inquisitive_ammayi": { id: "inquisitive_ammayi", name: "Inquisitive Ammayi", image: ammayiImg, type: 'individual', messages: [{ sender: "Inquisitive Ammayi", text: "Monu/Mole, ninte koode jolli cheyyunna aa kutty evidaa?", timestamp: "Yesterday" }] },
    "american_ammavan": { id: "american_ammavan", name: "American Ammavan", image: ammavanImg, type: 'individual', messages: [{ sender: "American Ammavan", text: "In America, we start work by 8 AM sharp.", timestamp: "9:00 AM" }] },
    "nri_cousin": { id: "nri_cousin", name: "NRI Cousin", image: nriImg, type: 'individual', messages: [{ sender: "NRI Cousin", text: "Just landed in Dubai. The airport here is amazing!", timestamp: "11:30 PM" }] },
    "adoring_ammumma": { id: "adoring_ammumma", name: "Adoring Ammumma", image: ammomaImg, type: 'individual', messages: [{ sender: "Adoring Ammumma", text: "Ente kutty വല്ലതും കഴിച്ചോ?", timestamp: "1:10 PM" }] },
    "njan_ninte_prayathil": { id: "njan_ninte_prayathil", name: "Njan-Ninte-Prayathil Ammavan", image: njanNintePrayathilImg, type: 'individual', messages: [{ sender: "Njan-Ninte-Prayathil Ammavan", text: "WiFi okke undo?", timestamp: "Yesterday" }] },
    "health_conscious_appooppa": { id: "health_conscious_appooppa", name: "Health-Conscious Appooppa", image: healthConsciousImg, type: 'individual', messages: [{ sender: "Health-Conscious Appooppa", text: "Don't eat fried items.", timestamp: "Yesterday" }] },
    "chill_acha": { id: "chill_acha", name: "Chill Acha", image: achaImg, type: 'individual', messages: [{ sender: "Chill Acha", text: "Amma parayunnathu kettittu nee tension aavanda.", timestamp: "Yesterday" }] },
    "kunjaniyan": { id: "kunjaniyan", name: "Kunjaniyan", image: kunjaniyanImg, type: 'individual', messages: [{ sender: "Kunjaniyan", text: "Chetta/Chechi, 500 roopa tharumo?", timestamp: "Yesterday" }] },
    "loving_chechi": { id: "loving_chechi", name: "Loving Chechi", image: chechiImg, type: 'individual', messages: [{ sender: "Loving Chechi", text: "Did you see Amma's message? Call her back.", timestamp: "Yesterday" }] },
};

// --- WhatsApp UI Components ---
const ChatListItem = ({ chat, onClick }) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    return (
        <div onClick={onClick} className="flex items-center p-3 hover:bg-black/10 cursor-pointer transition-colors border-b border-white/10">
            <img src={chat.image} alt={chat.name} className="w-16 h-16 rounded-full object-cover bg-gray-300 mr-4" />
            <div className="flex-grow">
                <div className="flex justify-between"><h3 className="font-bold text-white text-2xl">{chat.name}</h3><p className="text-sm text-white/60">{lastMessage?.timestamp}</p></div>
                {/* --- MODIFIED: Handle case where last message is an image --- */}
                <p className="text-white/70 text-lg truncate">{lastMessage?.sender === 'You' ? `You: ${lastMessage?.text || '📷 Image'}` : (lastMessage?.text || '📷 Image')}</p>
            </div>
        </div>
    );
};

// --- MODIFIED: MessageBubble can now display images ---
const MessageBubble = ({ message, chatType }) => {
    const isYou = message.sender === 'You';
    const bubbleStyles = isYou ? "bg-[#FF1493] text-white self-end" : "bg-[#37474F] text-white self-start";
    const showSenderName = chatType === 'group' && !isYou;
    return (
        <div className={`flex flex-col w-full ${isYou ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md p-1 rounded-2xl mb-2 ${bubbleStyles}`}>
                {showSenderName && <div className="text-xs text-pink-400 font-bold px-2 pt-1">{message.sender}</div>}
                {message.image && <img src={message.image} alt="Chat content" className="rounded-xl w-full h-auto" />}
                {message.text && <p className="text-lg p-2">{message.text}</p>}
                <p className="text-xs text-white/70 text-right mt-1 px-2 pb-1">{message.timestamp}</p>
            </div>
        </div>
    );
};

const ChatListPage = ({ chats, onChatSelect, onNavigateBack }) => (
    <div className="w-full max-w-4xl mx-auto bg-[#263238] bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
        <header className="p-4 text-center flex items-center" style={{ backgroundColor: '#FFF8E1' }}>
             <button onClick={onNavigateBack} className="text-3xl mr-3" style={{ color: '#263238' }}>&larr;</button>
            <h1 className="font-bold text-3xl tracking-wide flex-grow" style={{ color: '#263238' }}>AI Kudumbam</h1>
        </header>
        <main className="max-h-[75vh] overflow-y-auto">{Object.values(chats).map(chat => <ChatListItem key={chat.id} chat={chat} onClick={() => onChatSelect(chat.id)} />)}</main>
    </div>
);

// --- MODIFIED: ChatViewPage now handles image uploads ---
const ChatViewPage = ({ chat, onNavigateBack, onSendMessage }) => {
    const [inputValue, setInputValue] = useState("");
    const [imageFile, setImageFile] = useState(null); // --- NEW: State for image file
    const [imagePreview, setImagePreview] = useState(null); // --- NEW: State for image preview URL
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null); // --- NEW: Ref for hidden file input

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat.messages]);
    
    // --- NEW: Handle image selection ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- MODIFIED: handleSend now sends text and/or image ---
    const handleSend = () => { 
        if (inputValue.trim() || imageFile) { 
            onSendMessage(chat.id, inputValue, imageFile); 
            setInputValue("");
            setImageFile(null);
            setImagePreview(null);
        } 
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-[90vh] bg-[#37474F] bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white/20">
            <header className="flex items-center p-3" style={{ backgroundColor: '#FFF8E1' }}>
                <button onClick={onNavigateBack} className="text-3xl mr-3" style={{ color: '#263238' }}>&larr;</button>
                <img src={chat.image} alt={chat.name} className="w-12 h-12 rounded-full object-cover bg-gray-300 mr-4" />
                <h2 className="font-bold text-2xl" style={{ color: '#263238' }}>{chat.name}</h2>
            </header>
            <main className="flex-grow p-4 space-y-2 overflow-y-auto flex flex-col">{chat.messages.map((msg, index) => <MessageBubble key={index} message={msg} chatType={chat.type} />)}<div ref={messagesEndRef} /></main>
            <footer className="p-3 bg-black/20">
                {/* --- NEW: Image preview --- */}
                {imagePreview && (
                    <div className="relative w-32 mb-2">
                        <img src={imagePreview} alt="Preview" className="rounded-lg"/>
                        <button onClick={() => {setImageFile(null); setImagePreview(null);}} className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">X</button>
                    </div>
                )}
                <div className="flex items-center">
                    {/* --- NEW: Hidden file input and attachment button --- */}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                    <button onClick={() => fileInputRef.current.click()} className="mr-3 text-white/80 p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                    <input type="text" placeholder="Message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-grow p-3 rounded-full bg-white/90 text-gray-800 focus:outline-none" />
                    <button onClick={handleSend} className="ml-3 bg-[#FF1493] text-white p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};

// --- Container for the WhatsApp UI ---
const WhatsAppPage = ({ onNavigateBack }) => {
    const [chats, setChats] = useState(initialChatData);
    const [activeChatId, setActiveChatId] = useState(null);

    // --- MODIFIED: handleSendMessage now sends multipart/form-data ---
    const handleSendMessage = async (chatId, text, imageFile) => {
        const newMessage = { 
            sender: 'You', 
            text, 
            image: imageFile ? URL.createObjectURL(imageFile) : null, // Use preview URL for optimistic update
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };

        // Optimistically update the UI
        const updatedChats = { ...chats };
        updatedChats[chatId].messages.push(newMessage);
        setChats(updatedChats);

        // --- NEW: Use FormData for multipart requests ---
        const formData = new FormData();
        formData.append('persona', chatId); // The backend expects 'persona', which is our chatId
        if (text) {
            formData.append('text', text);
        }
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            // --- MODIFIED: Fetch call points to the new endpoint and uses FormData ---
            const response = await fetch('http://127.0.0.1:5000/api/personal-chat', {
                method: 'POST',
                // DO NOT set 'Content-Type' header, browser does it automatically for FormData
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            console.log(chatId);
            const data = await response.json();

            const aiResponse = { 
                sender: chats[chatId].name, 
                text: data.text, 
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            };
            
            // Update the state with the AI's response
            setChats(currentChats => {
                const finalChats = { ...currentChats };
                finalChats[chatId].messages.push(aiResponse);
                return finalChats;
            });

        } catch (error) {
            console.error("Error sending message:", error);
            const errorResponse = {
                sender: 'System',
                text: 'Sorry, I could not connect to the server.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChats(currentChats => {
                const finalChats = { ...currentChats };
                finalChats[chatId].messages.push(errorResponse);
                return finalChats;
            });
        }
    };

    if (activeChatId) {
        // --- MODIFIED: Pass the new onSendMessage to the ChatViewPage ---
        return <ChatViewPage chat={chats[activeChatId]} onNavigateBack={() => setActiveChatId(null)} onSendMessage={handleSendMessage} />;
    }
    return <ChatListPage chats={chats} onChatSelect={setActiveChatId} onNavigateBack={onNavigateBack} />;
};

export default WhatsAppPage;