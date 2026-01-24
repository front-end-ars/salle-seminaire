import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, ClipboardCheck, History, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import Header from '@/components/seminaire/Header';
import ProcedureTab from '@/components/seminaire/ProcedureTab';
import ChecklistTab from '@/components/seminaire/ChecklistTab';

export default function SallesSeminaire() {
  const [activeTab, setActiveTab] = useState('checklist');
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load or create session
  const loadSessions = async () => {
    const allSessions = await base44.entities.ChecklistSession.list('-created_date');
    setSessions(allSessions);
    
    // Find active session (en_cours) or create new one
    const activeSession = allSessions.find(s => s.status === 'en_cours');
    if (activeSession) {
      setCurrentSession(activeSession);
    } else if (allSessions.length === 0 || allSessions[0]?.status === 'valide') {
      // Create new session
      const newSession = await base44.entities.ChecklistSession.create({
        date: format(new Date(), 'yyyy-MM-dd'),
        person_name: '',
        status: 'en_cours',
        tasks: {}
      });
      setCurrentSession(newSession);
      setSessions([newSession, ...allSessions]);
    } else {
      setCurrentSession(allSessions[0]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadSessions();
    
    // Subscribe to real-time updates
    const unsubscribe = base44.entities.ChecklistSession.subscribe((event) => {
      if (event.type === 'update' && currentSession?.id === event.id) {
        setCurrentSession(event.data);
      } else if (event.type === 'create') {
        setSessions(prev => [event.data, ...prev]);
      }
      loadSessions();
    });
    
    return () => unsubscribe();
  }, []);

  // Warn before leaving if tasks are checked but not validated
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentSession?.status === 'en_cours' && 
          currentSession?.tasks && 
          Object.values(currentSession.tasks).some(Boolean)) {
        e.preventDefault();
        e.returnValue = 'Vous avez des tâches cochées non validées. Êtes-vous sûr de vouloir quitter ?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSession]);

  const handleNewSession = async () => {
    const newSession = await base44.entities.ChecklistSession.create({
      date: format(new Date(), 'yyyy-MM-dd'),
      person_name: '',
      status: 'en_cours',
      tasks: {}
    });
    setCurrentSession(newSession);
    setSessions([newSession, ...sessions]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#935890] mx-auto mb-4" />
          <p className="text-[#666]">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-14 bg-white border border-[#e8e4dc] rounded-xl p-1 mb-6">
            <TabsTrigger 
              value="procedure" 
              className="flex-1 h-full rounded-lg data-[state=active]:bg-[#935890] data-[state=active]:text-white transition-all"
            >
              <FileText className="w-4 h-4 mr-2" />
              Procédure
            </TabsTrigger>
            <TabsTrigger 
              value="checklist"
              className="flex-1 h-full rounded-lg data-[state=active]:bg-[#935890] data-[state=active]:text-white transition-all"
            >
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Checklist
            </TabsTrigger>
          </TabsList>

          <div className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden shadow-sm">
            <TabsContent value="procedure" className="m-0">
              <ProcedureTab />
            </TabsContent>
            
            <TabsContent value="checklist" className="m-0">
              <ChecklistTab 
                currentSession={currentSession}
                onSessionUpdate={loadSessions}
                onNewSession={handleNewSession}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Session History */}
        {sessions.filter(s => s.status === 'valide').length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-[#1a1a1a] mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#935890]" />
              Historique des sessions validées
            </h3>
            <div className="space-y-3">
              {sessions.filter(s => s.status === 'valide').slice(0, 5).map((session) => (
                <div 
                  key={session.id}
                  className="bg-white border border-[#e8e4dc] rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-[#1a1a1a]">
                      {session.date && format(new Date(session.date), 'd MMMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-sm text-[#666]">Par {session.person_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#935890]/10 text-[#935890] text-sm font-medium">
                      Validé
                    </span>
                    {session.validated_at && (
                      <p className="text-xs text-[#888] mt-1">
                        {format(new Date(session.validated_at), "HH:mm", { locale: fr })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
