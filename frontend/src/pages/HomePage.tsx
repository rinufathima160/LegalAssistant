import { Scale, MessageSquare, Bell, Plus } from 'lucide-react';
import { NotificationBell } from '../components/NotificationBell';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    
    <div className="flex items-center gap-2 text-white">
      <Scale className="w-8 h-8" />
      <span className="text-xl font-bold">AI Legal Assistant</span>
    </div>

    <div className="flex items-center gap-4">
      <NotificationBell />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
      >
        Logout
      </button>
    </div>

  </div>
</nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Personal AI Lawyer
          </h1>
          <p className="text-xl text-blue-200">
            Get legal assistance, manage court dates, and stay organized
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <button
            onClick={() => onNavigate('chat')}
            className="bg-white/95 hover:bg-white p-8 rounded-2xl shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Legal Chat</h2>
            <p className="text-gray-600">
              Ask legal questions and get instant AI-powered assistance with chat history
            </p>
          </button>

          <button
            onClick={() => onNavigate('add-reminder')}
            className="bg-white/95 hover:bg-white p-8 rounded-2xl shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Reminder</h2>
            <p className="text-gray-600">
              Schedule court dates, meetings, and document submission deadlines
            </p>
          </button>

          <button
            onClick={() => onNavigate('view-reminders')}
            className="bg-white/95 hover:bg-white p-8 rounded-2xl shadow-xl transition-all hover:scale-105 text-left group"
          >
            <div className="bg-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">View Reminders</h2>
            <p className="text-gray-600">
              Manage all your upcoming and past legal reminders in one place
            </p>
          </button>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-4">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div>
                <h4 className="font-semibold mb-2">24/7 Legal Assistance</h4>
                <p className="text-blue-200 text-sm">Get answers to your legal questions anytime</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Smart Reminders</h4>
                <p className="text-blue-200 text-sm">Never miss important legal deadlines</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Organized History</h4>
                <p className="text-blue-200 text-sm">Access all your past conversations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
