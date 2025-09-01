import React from "react";
import "./StepIndicator.css";

type Step = { id: number; title: string; subtitle: string };

interface Props {
  steps: Step[];
  currentStep: number;
}

const ICONS: Record<number, string> = {
      1: "/assets/registration/tor.svg",
      2: "/assets/registration/team profile.svg",
      3: "/assets/registration/document.svg",
};

const StepIndicator: React.FC<Props> = ({ steps, currentStep }) => {
  return (
    <div className="si">
      {/* garis penghubung */}
      <div className="si__rail" aria-hidden />

      {steps.map((s, idx) => {
        const active = s.id === currentStep;

                 return (
           <div key={s.id} className="si__item">
             {/* circle + icon */}
             <div className={`si__circle ${active ? "is-active" : ""}`}>
               <img src={ICONS[s.id]} alt={s.title} />
             </div>

             {/* text */}
             <div className={`si__text ${active ? "is-active" : ""}`}>
               <div className="si__title">{s.title}</div>
               <div className="si__subtitle">{s.subtitle}</div>
             </div>
           </div>
         );
      })}
    </div>
  );
};

export default StepIndicator;
