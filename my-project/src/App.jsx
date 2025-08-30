import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import ReactMarkdown from 'react-markdown';

const firebaseConfig = {
    apiKey: "AIzaSyCOzHBrdm-TKcYVAcpTtbC6xP_iwNWC8Pw",
    authDomain: "yoga-assistant-878ad.firebaseapp.com",
    projectId: "yoga-assistant-878ad",
    storageBucket: "yoga-assistant-878ad.appspot.com",
    messagingSenderId: "265057578602",
    appId: "1:265057578602:web:8abd2cb3bbeb5510e7e413",
    measurementId: "G-8LZ77J8FYK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DetailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CoachIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const JournalHistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CoachHistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div></div>;
    return user ? <Dashboard user={user} /> : <AuthScreen />;
}

// --- Authentication Screen Component (No Changes) ---
function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const handleAuthAction = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) await createUserWithEmailAndPassword(auth, email, password);
            else await signInWithEmailAndPassword(auth, email, password);
        } catch (err) { setError(err.message.replace('Firebase: ', '')); }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
                <div className="text-center mb-8"><h1 className="text-4xl font-bold text-white">ZenFlow</h1><p className="text-purple-200">Your Personal Yoga Journey</p></div>
                <form onSubmit={handleAuthAction}>
                    <div className="mb-4"><input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/20 text-white placeholder-purple-200 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300" required /></div>
                    <div className="mb-6"><input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/20 text-white placeholder-purple-200 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-300" required /></div>
                    {error && <p className="text-red-300 text-sm text-center mb-4">{error}</p>}
                    <div className="flex flex-col gap-4">
                        <button type="submit" className="bg-white text-indigo-800 font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-purple-100 transition-all duration-300">{isRegistering ? 'Create Account' : 'Sign In'}</button>
                        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-center text-sm text-purple-200 hover:text-white">{isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- Dashboard Component ---
function Dashboard({ user }) {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [journalEntries, setJournalEntries] = useState([]);
    const [coachPlans, setCoachPlans] = useState([]);

    const sessionDetailRef = useRef(null);

    const BACKEND_URL = "http://127.0.0.1:8001";

    const fetchData = async (endpoint, setter) => {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${BACKEND_URL}/${endpoint}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setter(await response.json());
            } else {
                console.error(`Failed to fetch ${endpoint}`);
                setter([]);
            }
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
    };

    useEffect(() => {
        fetchData('get-sessions', setSessions);
        fetchData('get-journal-entries', setJournalEntries);
        fetchData('get-plans', setCoachPlans);
    }, [user]);

    const handleSelectSession = (session) => {
        setSelectedSession(session);
        if (sessionDetailRef.current) {
            sessionDetailRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between h-16"><div className="flex items-center"><h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">ZenFlow</h1></div><div className="flex items-center"><span className="text-gray-600 mr-4 hidden sm:block">{user.email}</span><button onClick={() => signOut(auth)} className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:scale-105 transition-transform">Logout</button></div></div></div>
            </nav>
            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* UPDATED prop: onSelectSession */}
                        <SessionHistory sessions={sessions} onSelectSession={handleSelectSession} />
                        {/* NEW: Add ref to the component */}
                        {selectedSession && <SessionDetailView ref={sessionDetailRef} session={selectedSession} onClose={() => setSelectedSession(null)} />}
                        <JournalHistory entries={journalEntries} />
                        <CoachHistory plans={coachPlans} />
                    </div>
                    <div className="space-y-8">
                        <VideoAnalysis onAnalysisComplete={() => fetchData('get-sessions', setSessions)} user={user} backendUrl={BACKEND_URL} />
                        <Journal onEntrySaved={() => fetchData('get-journal-entries', setJournalEntries)} user={user} backendUrl={BACKEND_URL} />
                        <AICoach onPlanGenerated={() => fetchData('get-plans', setCoachPlans)} user={user} backendUrl={BACKEND_URL} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function VideoAnalysis({ onAnalysisComplete, user, backendUrl }) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);
    
    const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

    const handleUpload = async () => {
        if (!selectedFile || !user) return;
        setIsLoading(true);
        setUploadError('');
        const token = await user.getIdToken();
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000);
            const response = await fetch(`${backendUrl}/analyze-session/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData, signal: controller.signal });
            clearTimeout(timeoutId);
            if (response.ok) {
                onAnalysisComplete();
            } else {
                setUploadError(`Analysis failed: ${(await response.json()).detail || 'Unknown error'}`);
            }
        } catch (err) { setUploadError('Analysis timed out or failed to connect to the server.'); } 
        finally { setIsLoading(false); setSelectedFile(null); }
    };

    const handleAnalyzeClick = () => {
        if (selectedFile) {
            handleUpload();
        } else {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center"><UploadIcon /> Analyze a Session</h2>
            <div className="flex flex-col space-y-4">
                {/* The label is now just for appearance */}
                <label htmlFor="file-upload" className="w-full cursor-pointer bg-gray-100 text-gray-700 rounded-lg p-4 text-center border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    {selectedFile ? selectedFile.name : "Choose a video file..."}
                </label>
                {/* NEW: Add ref to the input and hide it */}
                <input id="file-upload" type="file" onChange={handleFileChange} ref={fileInputRef} className="hidden"/>
                {/* UPDATED: Call the new combined handler */}
                <button onClick={handleAnalyzeClick} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:bg-gray-400 disabled:from-gray-400 disabled:scale-100">
                    {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div> : 'Analyze Session'}
                </button>
            </div>
            {uploadError && <p className="text-red-500 mt-4 text-sm">{uploadError}</p>}
        </div>
    );
}

const SessionDetailView = React.forwardRef(({ session, onClose }, ref) => {
    return (
        <div ref={ref} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><DetailIcon /> Session Details</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yoga Pose</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (s)</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {session.summary.map((poseData, index) => (
                            <tr key={index}>
                                <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">{poseData['Yoga Pose']}</td>
                                <td className="py-3 px-4 whitespace-nowrap">{poseData['Total Time (s)']}</td>
                                <td className="py-3 px-4 whitespace-nowrap">{poseData['Repetitions']}</td>
                                <td className="py-3 px-4 whitespace-nowrap font-semibold text-indigo-600">{poseData['Average Accuracy (%)']}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

function SessionHistory({ sessions, onSelectSession }) {

    const calculateSessionAvgAccuracy = (session) => {
        if (!session.summary || session.summary.length === 0) return 0;
        const accuracies = session.summary.map(pose => pose['Average Accuracy (%)']);
        const sum = accuracies.reduce((a, b) => a + b, 0);
        return (sum / accuracies.length).toFixed(1);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <HistoryIcon /> Your Past Sessions
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poses</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Accuracy</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sessions.length > 0 ? (
                            sessions.map(session => (
                                <tr key={session.id} className="hover:bg-purple-50 transition-colors">
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {new Date(session.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {session.total_time}s
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {session.summary.length}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap font-medium text-indigo-600">
                                        {calculateSessionAvgAccuracy(session)}%
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => onSelectSession(session)} 
                                            className="text-indigo-600 font-semibold transition-all duration-200 hover:text-indigo-900 hover:bg-indigo-50 px-3 py-1 rounded-md"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">
                                    No sessions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Journal({ user, backendUrl, onEntrySaved }) {
    const [entry, setEntry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!entry.trim()) return;
        
        setIsSubmitting(true);
        setMessage('');

        const token = await user.getIdToken();
        
        try {
            const controller = new AbortController();
            // Increased timeout to 2 minutes
            const timeoutId = setTimeout(() => controller.abort(), 120000); 
            const response = await fetch(`${backendUrl}/add-journal-entry/`, { 
                method: 'POST', 
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ entry_text: entry }), 
                signal: controller.signal 
            });
            clearTimeout(timeoutId);

            if (response.ok) { 
                setMessageType('success');
                setMessage('Your journal entry has been saved!'); 
                setEntry(''); 
                onEntrySaved();
            } else { 
                const errorData = await response.json();
                console.error("Failed to save entry. Server responded with:", errorData);
                setMessageType('error');
                setMessage('Failed to save entry. Please try again.'); 
            }
        } catch (err) { 
            console.error("A network error occurred:", err);
            setMessageType('error');
            setMessage('Error: Could not connect to the server.'); 
        } 
        finally { 
            setIsSubmitting(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg"><h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center"><JournalIcon /> Daily Journal</h2><form onSubmit={handleSubmit}><textarea value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="How are you feeling today? Any thoughts on your practice?" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" rows="4"></textarea><button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:bg-gray-400 disabled:from-gray-400 disabled:scale-100">{isSubmitting ? 'Saving...' : 'Save Entry'}</button>{message && <p className={`text-center mt-4 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}</form></div>
    );
}

function AICoach({ user, backendUrl, onPlanGenerated }) {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        setResponse(null);
        const token = await user.getIdToken();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);
            const res = await fetch(`${backendUrl}/ask-gemini/`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query_text: query }), signal: controller.signal });
            clearTimeout(timeoutId);
            if (res.ok) {
                setResponse(await res.json());
                onPlanGenerated();
                setQuery('');
            } else {
                setResponse({ response_text: "Sorry, the AI coach is unavailable right now. Please try again." });
            }
        } catch (err) { setResponse({ response_text: "Error: The request timed out or could not connect to the AI coach." }); } 
        finally { setIsLoading(false); }
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg"><h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center"><CoachIcon /> Ask Your AI Coach</h2><form onSubmit={handleSubmit}><textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask for a weekly plan, or a suggestion..." className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400" rows="3"></textarea><button type="submit" disabled={isLoading} className="w-full mt-4 bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform disabled:bg-gray-400 disabled:from-gray-400 disabled:scale-100">{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div> : 'Ask Zen'}</button></form>
        {response && <div className="mt-6 prose max-w-none prose-p:my-2 prose-h3:mb-2 prose-h3:mt-4 prose-ul:my-2"><ReactMarkdown>{response.response_text}</ReactMarkdown></div>}</div>
    );
}

function SentimentIndicator({ label, score }) {
    const sentiment = label?.toUpperCase();
    const color = sentiment === 'POSITIVE' ? 'text-green-600' : sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-gray-500';
    const emoji = sentiment === 'POSITIVE' ? '😊' : sentiment === 'NEGATIVE' ? '😞' : '😐';

    if (!sentiment || typeof score !== 'number') {
        return null; // Don't render if data is missing
    }

    return (
        <div className="mt-2 text-sm font-medium">
            <span className={`font-bold ${color}`}>{sentiment}</span>
            <span className="text-gray-500 ml-2">{`${(score * 100).toFixed(0)}%`}</span>
            <span className="ml-2">{emoji}</span>
        </div>
    );
}

function JournalHistory({ entries }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <JournalHistoryIcon /> Journal History
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {entries.length > 0 ? (
                    entries.map(entry => (
                        <div key={entry.id} className="border-l-4 border-teal-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                            <p className="font-semibold text-gray-500 text-sm">
                                {new Date(entry.date).toLocaleString()}
                            </p>
                            <p className="text-gray-700 mt-1">{entry.entry_text}</p>
                            {/* NEW: Render the sentiment indicator here */}
                            <SentimentIndicator label={entry.sentiment} score={entry.sentiment_score} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No journal entries yet.</p>
                )}
            </div>
        </div>
    );
}

function CoachHistory({ plans }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <CoachHistoryIcon /> AI Coach History
            </h2>
            <div className="space-y-6 max-h-[40rem] overflow-y-auto pr-2">
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <div key={plan.id} className="border rounded-lg p-4">
                            <p className="font-semibold text-gray-500 text-sm mb-2">
                                {new Date(plan.created_date).toLocaleString()}
                            </p>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <p className="font-bold text-gray-800">You asked:</p>
                                <p className="text-gray-700 italic">"{plan.query_text}"</p>
                            </div>
                            <div className="mt-4 prose prose-sm max-w-none">
                                <p className="font-bold text-gray-800">Zen replied:</p>
                                <ReactMarkdown>{plan.plan_data.response_text}</ReactMarkdown>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-4">No conversations with the AI coach yet.</p>
                )}
            </div>
        </div>
    );
}