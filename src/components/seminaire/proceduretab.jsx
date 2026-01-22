import React from 'react';
import { 
  Target, 
  Package, 
  LayoutGrid, 
  Sparkles, 
  Clock, 
  Shield,
  ChevronDown
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Section = ({ icon: Icon, title, children, value }) => (
  <AccordionItem value={value} className="border border-[#e8e4dc] rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#faf9f7] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#935890]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#935890]" />
        </div>
        <span className="font-medium text-[#1a1a1a] text-left">{title}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-6 pb-6 pt-2">
      {children}
    </AccordionContent>
  </AccordionItem>
);

const ListItem = ({ children }) => (
  <li className="flex items-start gap-2 py-1">
    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] mt-2 flex-shrink-0" />
    <span className="text-[#4a4a4a]">{children}</span>
  </li>
);

export default function ProcedureTab() {
  return (
    <div className="p-6">
      <Accordion type="multiple" defaultValue={["objectif", "materiel", "mise-en-place", "nettoyage", "frequence", "securite"]} className="space-y-2">
        
        <Section icon={Target} title="Objectif" value="objectif">
          <p className="text-[#4a4a4a] leading-relaxed">
            Assurer la propreté, l'hygiène et le bon aménagement des salles de séminaire, des espaces boissons et des sanitaires avant et après chaque utilisation.
          </p>
        </Section>

        <Section icon={Package} title="Matériel et produits nécessaires" value="materiel">
          <ul className="space-y-1">
            <ListItem>Chiffons microfibres, éponges</ListItem>
            <ListItem>Produits désinfectants pour surfaces et sanitaires</ListItem>
            <ListItem>Balais, aspirateur, serpillière et seaux</ListItem>
            <ListItem>Gants de protection</ListItem>
            <ListItem>Sac-poubelle</ListItem>
            <ListItem>Produits pour les sanitaires : savons, essuie-mains, papier toilettes</ListItem>
            <ListItem>Produits de nettoyage pour machines à café, fontaine à eau, machine à jus</ListItem>
          </ul>
        </Section>

        <Section icon={LayoutGrid} title="Mise en place des salles" value="mise-en-place">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-[#935890] mb-2">A. Théâtre</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Chaises en rangées face à l'animateur/projection.</ListItem>
                <ListItem>Pas de tables.</ListItem>
                <ListItem>Maximum de places assises.</ListItem>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#935890] mb-2">B. U</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Tables disposées en forme de U, ouverture vers l'animateur.</ListItem>
                <ListItem>Idéal pour échanges et présentations interactives.</ListItem>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#935890] mb-2">C. Classe</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Tables et chaises alignées en rangées face à l'animateur.</ListItem>
                <ListItem>Convient aux formations nécessitant prise de notes.</ListItem>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#935890] mb-2">D. Ilots / Pavés</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Tables regroupées par petits îlots pour travail en équipe.</ListItem>
                <ListItem>Favorise l'échange et les ateliers collaboratifs.</ListItem>
              </ul>
            </div>
            <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg p-4 mt-4">
              <p className="text-[#4a4a4a] text-sm italic">
                <strong>Remarque :</strong> Les nappes du buffet, le matériel audio-visuel et les accessoires doivent être positionnés avant l'arrivée des participants.
              </p>
            </div>
          </div>
        </Section>

        <Section icon={Sparkles} title="Procédure de nettoyage" value="nettoyage">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-[#2D5016] mb-2">A. Salle de séminaire</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Essuyer toutes les tables avec un chiffon désinfectant.</ListItem>
                <ListItem>Passer l'aspirateur puis la serpillière sur tout le sol.</ListItem>
                <ListItem>Vider toutes les poubelles et remplacer les sacs.</ListItem>
                <ListItem>Vérifier le mobilier et remettre les chaises/tables dans la configuration souhaitée.</ListItem>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#2D5016] mb-2">B. Espace boissons et buffet</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Machine à café : vider capsules usagées dans le sac vert, nettoyer l'extérieur.</ListItem>
                <ListItem>Bouilloire : vider l'eau restante et essuyer.</ListItem>
                <ListItem>Machine à jus et fontaine à eau : nettoyer et vérifier le fonctionnement.</ListItem>
                <ListItem>Buffet et nappes : s'assurer qu'ils sont propres et bien rangés.</ListItem>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-[#2D5016] mb-2">C. Sanitaires</h4>
              <ul className="space-y-1 ml-4">
                <ListItem>Nettoyer et désinfecter cuvettes, lavabos, miroirs et sols.</ListItem>
                <ListItem>Vider les poubelles et remplacer les sacs.</ListItem>
                <ListItem>Vérifier et réapprovisionner savon, essuie-mains et papier toilette.</ListItem>
                <ListItem>S'assurer que tout est propre et utilisable.</ListItem>
              </ul>
            </div>
          </div>
        </Section>

        <Section icon={Clock} title="Fréquence" value="frequence">
          <ul className="space-y-1">
            <ListItem><strong>Avant la séance :</strong> vérification rapide et nettoyage léger.</ListItem>
            <ListItem><strong>Après la séance :</strong> nettoyage complet.</ListItem>
            <ListItem><strong>Hebdomadaire :</strong> entretien approfondi (vitres, murs, sols, équipements).</ListItem>
          </ul>
        </Section>

        <Section icon={Shield} title="Consignes de sécurité" value="securite">
          <ul className="space-y-1">
            <ListItem>Porter des gants pour tous les produits chimiques et le nettoyage des sanitaires.</ListItem>
            <ListItem>Éviter le contact des produits avec les équipements électroniques.</ListItem>
            <ListItem>Signaler tout problème ou matériel défectueux.</ListItem>
          </ul>
        </Section>

      </Accordion>
    </div>
  );
}
