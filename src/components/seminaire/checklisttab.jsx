import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  LayoutGrid, 
  Building2, 
  Coffee, 
  Bath, 
  Shield,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { base44 } from '@/api/base44Client';
import ChecklistSection from './ChecklistSection';

const CHECKLIST_DATA = {
  mise_en_place: {
    title: "Mise en place des salles",
    icon: LayoutGrid,
    tasks: [
      { id: 1, label: "Vérifier la configuration de la salle selon l'événement (Théâtre / U / Classe / Ilots)" },
      { id: 2, label: "Placer les tables correctement" },
      { id: 3, label: "Placer les chaises correctement" },
      { id: 4, label: "Disposer le matériel audio-visuel et accessoires" },
      { id: 5, label: "Vérifier la propreté des nappes du buffet" },
      { id: 6, label: "Préparer le buffet (verres, assiettes, couverts si nécessaire)" },
    ]
  },
  salle_seminaire: {
    title: "Salle de séminaire",
    icon: Building2,
    tasks: [
      { id: 1, label: "Essuyer toutes les tables avec un chiffon désinfectant" },
      { id: 2, label: "Nettoyer les chaises si nécessaire" },
      { id: 3, label: "Passer l'aspirateur sur le sol" },
      { id: 4, label: "Passer la serpillière sur tout le sol" },
      { id: 5, label: "Vider toutes les poubelles et remplacer les sacs" },
      { id: 6, label: "Vérifier le mobilier et remettre les chaises/tables dans la configuration souhaitée" },
    ]
  },
  espace_boissons: {
    title: "Espace boissons et buffet",
    icon: Coffee,
    tasks: [
      { id: 1, label: "Vider la machine à café (capsules recyclées dans le sac vert)" },
      { id: 2, label: "Nettoyer l'extérieur de la machine à café" },
      { id: 3, label: "Vider et essuyer la bouilloire" },
      { id: 4, label: "Nettoyer et vérifier la machine à jus de fruits" },
      { id: 5, label: "Nettoyer et vérifier la fontaine à eau" },
      { id: 6, label: "Vérifier la propreté et rangement des nappes du buffet" },
    ]
  },
  sanitaires: {
    title: "Sanitaires",
    icon: Bath,
    tasks: [
      { id: 1, label: "Nettoyer et désinfecter les cuvettes des toilettes" },
      { id: 2, label: "Nettoyer et désinfecter les lavabos" },
      { id: 3, label: "Nettoyer et essuyer les miroirs" },
      { id: 4, label: "Passer la serpillière sur le sol" },
      { id: 5, label: "Vider les poubelles et remplacer les sacs" },
      { id: 6, label: "Vérifier et réapprovisionner le savon" },
      { id: 7, label: "Vérifier et réapprovisionner les essuie-mains" },
      { id: 8, label: "Vérifier et réapprovisionner le papier toilette" },
      { id: 9, label: "Vérifier que tout est propre et utilisable" },
    ]
  },
  securite: {
    title: "Consignes de sécurité",
    icon: Shield,
    tasks: [
      { id: 1, label: "Porter des gants pour tous les produits chimiques et le nettoyage des sanitaires" },
      { id: 2, label: "Éviter le contact des produits avec les équipements électroniques" },
      { id: 3, label: "Signaler tout problème ou matériel défectueux" },
    ]
  }
};

// Calculate total tasks
const TOTAL_TASKS = Object.values(CHECKLIST_DATA).reduce(
  (sum, section) => sum + section.tasks.length, 0
);

export default function ChecklistTab({ currentSession, onSessionUpdate, onNewSession }) {
  const [date, setDate] = useState(currentSession?.date || format(new Date(), 'yyyy-MM-dd'));
  const [personName, setPersonName] = useState(currentSession?.person_name || '');
  const [taskStates, setTaskStates] = useState(currentSession?.tasks || {});
  const [isValidating, setIsValidating] = useState(false);
  const [isLocked, setIsLocked] = useState(currentSession?.status === 'valide');
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Sync with current session
  useEffect(() => {
    if (currentSession) {
      setDate(currentSession.date || format(new Date(), 'yyyy-MM-dd'));
      setPersonName(currentSession.person_name || '');
      setTaskStates(currentSession.tasks || {});
      setIsLocked(currentSession.status === 'valide');
    }
  }, [currentSession]);

  // Auto-save with debounce
  const saveSession = useCallback(async (newTaskStates, newDate, newPersonName) => {
    if (!currentSession?.id) return;
    
    await base44.entities.ChecklistSession.update(currentSession.id, {
      date: newDate,
      person_name: newPersonName,
      tasks: newTaskStates
    });
    onSessionUpdate();
  }, [currentSession?.id, onSessionUpdate]);

  const handleTaskToggle = (taskKey) => {
    if (isLocked) return;
    
    const newTaskStates = {
      ...taskStates,
      [taskKey]: !taskStates[taskKey]
    };
    setTaskStates(newTaskStates);
    
    // Debounced save
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(() => {
      saveSession(newTaskStates, date, personName);
    }, 500));
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(() => {
      saveSession(taskStates, newDate, personName);
    }, 500));
  };

  const handleNameChange = (newName) => {
    setPersonName(newName);
    if (saveTimeout) clearTimeout(saveTimeout);
    setSaveTimeout(setTimeout(() => {
      saveSession(taskStates, date, newName);
    }, 500));
  };

  const completedTasks = Object.values(taskStates).filter(Boolean).length;
  const progress = (completedTasks / TOTAL_TASKS) * 100;
  
  const canValidate = date && personName.trim();

  const generateEmailHTML = () => {
    const validatedDate = new Date();
    const validatedTime = format(validatedDate, "HH:mm", { locale: fr });
    const validatedDateStr = format(validatedDate, "d MMMM yyyy", { locale: fr });
    
    const sections = [
      {
        title: "Mise en place des salles",
        key: "mise_en_place",
        tasks: CHECKLIST_DATA.mise_en_place.tasks
      },
      {
        title: "Salle de séminaire",
        key: "salle_seminaire",
        tasks: CHECKLIST_DATA.salle_seminaire.tasks
      },
      {
        title: "Espace boissons et buffet",
        key: "espace_boissons",
        tasks: CHECKLIST_DATA.espace_boissons.tasks
      },
      {
        title: "Sanitaires",
        key: "sanitaires",
        tasks: CHECKLIST_DATA.sanitaires.tasks
      },
      {
        title: "Consignes de sécurité",
        key: "securite",
        tasks: CHECKLIST_DATA.securite.tasks
      }
    ];
    
    let sectionsHTML = '';
    sections.forEach(section => {
      let tasksHTML = '';
      section.tasks.forEach(task => {
        const taskKey = `${section.key}_${task.id}`;
        const isChecked = taskStates[taskKey] || false;
        const icon = isChecked ? '✅' : '⬜';
        const textColor = isChecked ? '#935890' : '#666666';
        const textDecoration = isChecked ? 'none' : 'none';
        
        tasksHTML += `
          <tr>
            <td style="padding: 10px 15px; border-bottom: 1px solid #eeeeee;">
              <span style="font-size: 16px; margin-right: 8px;">${icon}</span>
              <span style="color: ${textColor}; font-size: 14px; text-decoration: ${textDecoration};">${task.label}</span>
            </td>
          </tr>
        `;
      });
      
      sectionsHTML += `
        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #935890 0%, #7d4a79 100%); color: white; padding: 12px 20px; border-radius: 8px 8px 0 0; font-weight: 600; font-size: 16px;">
            ${section.title}
          </div>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 0 0 8px 8px; overflow: hidden;">
            <tbody>
              ${tasksHTML}
            </tbody>
          </table>
        </div>
      `;
    });
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #935890 0%, #7d4a79 100%); padding: 30px 40px; text-align: center;">
                    <div style="display: inline-block; width: 50px; height: 50px; background-color: #C9A227; border-radius: 50%; margin-bottom: 15px; line-height: 50px; text-align: center;">
                      <span style="color: #935890; font-size: 24px; font-weight: bold;">G</span>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 26px; font-weight: 300; letter-spacing: 1px;">
                      Salles de Séminaire
                    </h1>
                    <p style="margin: 8px 0 0 0; color: #C9A227; font-size: 14px; letter-spacing: 2px;">
                      RAPPORT DE PRÉPARATION
                    </p>
                  </td>
                </tr>
                
                <!-- Info Block -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #fafafa; border-bottom: 1px solid #eeeeee;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #888888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nom</span>
                          <div style="color: #1a1a1a; font-size: 16px; font-weight: 500; margin-top: 4px;">${personName}</div>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="color: #888888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Date</span>
                          <div style="color: #1a1a1a; font-size: 16px; font-weight: 500; margin-top: 4px;">${validatedDateStr}</div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding: 15px 0 0 0;">
                          <span style="color: #888888; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Heure de validation</span>
                          <div style="color: #1a1a1a; font-size: 16px; font-weight: 500; margin-top: 4px;">${validatedTime}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Progress Bar -->
                <tr>
                  <td style="padding: 25px 40px; background-color: white; border-bottom: 1px solid #eeeeee;">
                    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                      <span style="color: #1a1a1a; font-size: 14px; font-weight: 600;">Progression</span>
                      <span style="background-color: #935890; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                        ${completedTasks} / ${TOTAL_TASKS} tâches
                      </span>
                    </div>
                    <div style="width: 100%; height: 12px; background-color: #e8e4dc; border-radius: 6px; overflow: hidden;">
                      <div style="height: 100%; background: linear-gradient(90deg, #935890 0%, #a66ba1 100%); width: ${progress}%; border-radius: 6px;"></div>
                    </div>
                  </td>
                </tr>
                
                <!-- Checklist Sections -->
                <tr>
                  <td style="padding: 30px 40px;">
                    ${sectionsHTML}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #fafafa; padding: 25px 40px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; color: #935890; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">
                      Garrigae – Manoir de Beauvoir ★★★
                    </p>
                    <p style="margin: 8px 0 0 0; color: #888888; font-size: 12px;">
                      Ce rapport a été généré automatiquement
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  const handleValidate = async () => {
    if (!canValidate || !currentSession?.id) return;
    
    setIsValidating(true);
    
    // Update session status
    await base44.entities.ChecklistSession.update(currentSession.id, {
      status: 'valide',
      validated_at: new Date().toISOString(),
      tasks: taskStates
    });
    
    // Generate and send HTML email
    const emailHTML = generateEmailHTML();
    await base44.integrations.Core.SendEmail({
      to: 'aliarsene0@gmail.com',
      subject: 'Salles de Seminaire prete',
      body: emailHTML
    });
    
    setIsLocked(true);
    setIsValidating(false);
    onSessionUpdate();
  };

  return (
    <div className="p-6">
      {/* Validated Badge */}
      {isLocked && (
        <div className="mb-6 bg-[#935890] text-white rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-medium">Checklist validée</p>
            <p className="text-sm text-white/70">
              {currentSession?.validated_at && 
                `Validée le ${format(new Date(currentSession.validated_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}`
              }
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6 bg-white border border-[#e8e4dc] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#1a1a1a]">Progression globale</span>
          <Badge variant="outline" className={`${
            completedTasks === TOTAL_TASKS 
              ? 'bg-[#935890] text-white border-[#935890]' 
              : 'bg-[#C9A227]/10 text-[#C9A227] border-[#C9A227]'
          }`}>
            {completedTasks} / {TOTAL_TASKS} tâches
          </Badge>
        </div>
        <div className="w-full h-3 bg-[#e8e4dc] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#935890] to-[#a66ba1] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#888] mt-2">{Math.round(progress)}% complété</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="date" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Date *
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={isLocked}
            className="h-12 border-[#e8e4dc] focus:border-[#935890] focus:ring-[#935890]"
          />
        </div>
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-[#1a1a1a] mb-2 block">
            Nom de la personne *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Entrez votre nom"
            value={personName}
            onChange={(e) => handleNameChange(e.target.value)}
            disabled={isLocked}
            className="h-12 border-[#e8e4dc] focus:border-[#935890] focus:ring-[#935890]"
          />
        </div>
      </div>

      {/* Checklist Sections */}
      {Object.entries(CHECKLIST_DATA).map(([key, section]) => (
        <ChecklistSection
          key={key}
          sectionKey={key}
          title={section.title}
          icon={section.icon}
          tasks={section.tasks}
          taskStates={taskStates}
          onTaskToggle={handleTaskToggle}
          isLocked={isLocked}
        />
      ))}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        {!isLocked ? (
          <Button
            onClick={handleValidate}
            disabled={!canValidate || isValidating}
            className={`flex-1 h-14 text-lg font-medium rounded-xl transition-all ${
              canValidate 
                ? 'bg-[#935890] hover:bg-[#7d4a79] text-white shadow-lg hover:shadow-xl' 
                : 'bg-[#e8e4dc] text-[#888] cursor-not-allowed'
            }`}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Validation en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Valider la préparation
              </>
            )}
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg font-medium rounded-xl border-[#935890] text-[#935890] hover:bg-[#935890]/5"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Nouvelle session
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Créer une nouvelle session ?</AlertDialogTitle>
                <AlertDialogDescription>
                  La session actuelle sera archivée dans l'historique. Une nouvelle checklist vierge sera créée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={onNewSession}
                  className="bg-[#935890] hover:bg-[#7d4a79]"
                >
                  Créer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Validation Requirements */}
      {!isLocked && !personName.trim() && (
        <div className="mt-4 p-4 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-xl">
          <p className="text-sm text-[#8a7320] font-medium">
            ⚠️ Veuillez renseigner votre nom pour commencer.
          </p>
        </div>
      )}
    </div>
  );
}
