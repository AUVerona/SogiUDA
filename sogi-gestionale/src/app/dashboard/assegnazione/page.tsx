'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './assegnazione.module.css';
import { curriculumModel } from '@/data/curriculum';

type LevelType = 'Alpha' | 'Primo' | 'Secondo' | 'SecondoLivello';

interface Subtopic {
  id: string;
  code: string;
  label: string;
  hours: number;
  distanceHours: number;
}

interface Section {
  id: string;
  title: string;
  totalHours: number;
  isFacoltativa?: boolean;
  subtopics: Subtopic[];
}

export default function AssegnazionePage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [step, setStep] = useState<'main' | 'primo-livello' | 'secondo-livello' | 'indirizzo' | 'voce' | 'periodo' | 'classe' | 'details'>('main');
  const [selectedLevel, setSelectedLevel] = useState<LevelType | null>(null);
  const [selectedIndirizzo, setSelectedIndirizzo] = useState<string | null>(null);
  const [selectedVoce, setSelectedVoce] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string | null>(null);
  const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  // Carica assegnazione da modificare se c'è l'ID nei parametri
  useEffect(() => {
    if (editId) {
      console.log('[PARENT] Trovato editId:', editId);
      setIsLoadingEdit(true);
      // Carica i dati dell'assegnazione solo per impostare il livello
      fetch(`/api/assignments/${editId}`)
        .then(res => res.json())
          .then(data => {
            console.log('[PARENT] Dati ricevuti:', data);
            if (data && data.assignment) {
              console.log('[PARENT] Tutte le chiavi assignment:', Object.keys(data.assignment));
              console.log('[PARENT] assignment.livello:', data.assignment.livello);
              if (data.assignment.livello) {
                setSelectedLevel(data.assignment.livello as LevelType);
                setStep('details');
                console.log('[PARENT] Step impostato a "details"');
              } else {
                console.log('[PARENT] PROBLEMA: assignment.livello non trovato!');
              }
            } else {
              console.log('[PARENT] PROBLEMA: data.assignment non trovato!');
            }
          })
        .catch(error => {
          console.error('[PARENT] Errore caricamento livello:', error);
        })
        .finally(() => {
          setIsLoadingEdit(false);
        });
    }
  }, [editId]);

  const handleMainSelect = (choice: 'alpha' | 'primo-livello' | 'secondo-livello') => {
    if (choice === 'alpha') {
      setSelectedLevel('Alpha');
      setStep('details');
    } else {
      setStep(choice);
    }
  };

  const handlePrimoLivelloSelect = (periodo: 'primo' | 'secondo') => {
    setSelectedLevel(periodo === 'primo' ? 'Primo' : 'Secondo');
    setStep('details');
  };

  // Stepper per Secondo Livello
  const handleSecondoLivelloSelect = (indirizzo: string) => {
    setSelectedLevel('SecondoLivello');
    setSelectedIndirizzo(indirizzo);
    setStep('voce');
  };

  const handleVoceSelect = (voce: string) => {
    setSelectedVoce(voce);
    setStep('periodo');
  };

  const handlePeriodoSelect = (periodo: string) => {
    setSelectedPeriodo(periodo);
    setStep('classe');
  };

  const handleClasseSelect = (classe: string) => {
    setSelectedClasse(classe);
    setStep('details');
  };

  const handleBack = () => {
    if (step === 'details') {
      if (selectedLevel === 'Alpha') {
        setStep('main');
        setSelectedLevel(null);
      } else if (selectedLevel === 'Primo' || selectedLevel === 'Secondo') {
        setStep('primo-livello');
        setSelectedLevel(null);
      } else if (selectedLevel === 'SecondoLivello') {
        if (selectedClasse) {
          setStep('classe');
          setSelectedClasse(null);
        } else if (selectedPeriodo) {
          setStep('periodo');
          setSelectedPeriodo(null);
        } else if (selectedVoce) {
          setStep('voce');
          setSelectedVoce(null);
        } else if (selectedIndirizzo) {
          setStep('indirizzo');
          setSelectedIndirizzo(null);
        } else {
          setStep('secondo-livello');
        }
      }
    } else if (step === 'classe') {
      setStep('periodo');
      setSelectedClasse(null);
    } else if (step === 'periodo') {
      setStep('voce');
      setSelectedPeriodo(null);
    } else if (step === 'voce') {
      setStep('secondo-livello');
      setSelectedVoce(null);
    } else if (step === 'secondo-livello') {
      setStep('main');
      setSelectedLevel(null);
    } else {
      setStep('main');
      setSelectedLevel(null);
    }
  };

  console.log('[PARENT] Current step:', step, 'selectedLevel:', selectedLevel, 'editId:', editId);

  return (
    <div className={styles.container}>
      {/* Schermata principale - Scelta tra Alpha, Primo Livello, Secondo Livello */}
      {step === 'main' && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <span className={styles.welcomeEyebrow}>Piano formativo modulare</span>
            <h1>Distribuisci le ore tra gli obiettivi di apprendimento</h1>
            <p>
              Scegli il percorso formativo e assegna le ore previste a ciascun descrittore.
              Il sistema ti guida nel rispettare i vincoli orari di ogni voce.
            </p>
          </div>

          <div className={styles.levelSelectionGrid}>
            <button
              type="button"
              className={styles.levelCard}
              onClick={() => handleMainSelect('alpha')}
            >
              <div className={styles.levelCardIcon}>A</div>
              <h2 className={styles.levelCardTitle}>Alpha</h2>
              <p className={styles.levelCardDescription}>
                Livello base di alfabetizzazione
              </p>
            </button>

            <button
              type="button"
              className={styles.levelCard}
              onClick={() => handleMainSelect('primo-livello')}
            >
              <div className={styles.levelCardIcon}>1°</div>
              <h2 className={styles.levelCardTitle}>Primo Livello</h2>
              <p className={styles.levelCardDescription}>
                Primo e secondo periodo didattico
              </p>
            </button>

            <button
              type="button"
              className={styles.levelCard}
              onClick={() => handleMainSelect('secondo-livello')}
            >
              <div className={styles.levelCardIcon}>2°</div>
              <h2 className={styles.levelCardTitle}>Secondo Livello</h2>
              <p className={styles.levelCardDescription}>
                Indirizzi tecnico, professionale, artistico, liceale
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Schermata Primo Livello - Scelta tra Primo Periodo e Secondo Periodo */}
      {step === 'primo-livello' && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              ← Indietro
            </button>
            <h1>Primo Livello</h1>
            <p>Seleziona il periodo didattico</p>
          </div>

          <div className={styles.levelSelectionGrid}>
            <button
              type="button"
              className={styles.levelCard}
              onClick={() => handlePrimoLivelloSelect('primo')}
            >
              <div className={styles.levelCardIcon}>1P</div>
              <h2 className={styles.levelCardTitle}>Primo Periodo</h2>
              <p className={styles.levelCardDescription}>
                Primo periodo didattico
              </p>
            </button>

            <button
              type="button"
              className={styles.levelCard}
              onClick={() => handlePrimoLivelloSelect('secondo')}
            >
              <div className={styles.levelCardIcon}>2P</div>
              <h2 className={styles.levelCardTitle}>Secondo Periodo</h2>
              <p className={styles.levelCardDescription}>
                Secondo periodo didattico
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Schermata Secondo Livello - Scelta tra indirizzi */}
      {step === 'secondo-livello' && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              ← Indietro
            </button>
            <h1>Secondo Livello</h1>
            <p>Seleziona l'indirizzo</p>
          </div>
          <div className={styles.levelSelectionGrid}>
            {curriculumModel.SecondoLivello.indirizzi && Object.entries(curriculumModel.SecondoLivello.indirizzi).map(([indirizzoKey, indirizzo]) => (
              <button
                key={indirizzoKey}
                type="button"
                className={styles.levelCard}
                onClick={() => handleSecondoLivelloSelect(indirizzoKey)}
              >
                <div className={styles.levelCardIcon}>{indirizzoKey.charAt(0).toUpperCase()}</div>
                <h2 className={styles.levelCardTitle}>{indirizzo.name}</h2>
                <p className={styles.levelCardDescription}>
                  {indirizzo.voci ? Object.keys(indirizzo.voci).join(', ').toUpperCase() : ''}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schermata Voce (es. AFM) */}
      {step === 'voce' && selectedIndirizzo && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              ← Indietro
            </button>
            <h1>{curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].name}</h1>
            <p>Seleziona la voce</p>
          </div>
          <div className={styles.levelSelectionGrid}>
            {Object.entries(curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci).map(([voceKey, voce]) => (
              <button
                key={voceKey}
                type="button"
                className={styles.levelCard}
                onClick={() => handleVoceSelect(voceKey)}
              >
                <div className={styles.levelCardIcon}>{voceKey.toUpperCase()}</div>
                <h2 className={styles.levelCardTitle}>{(voce as any).name}</h2>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schermata Periodo Didattico */}
      {step === 'periodo' && selectedIndirizzo && selectedVoce && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              ← Indietro
            </button>
            <h1>{curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].name}</h1>
            <p>Seleziona il periodo didattico</p>
          </div>
          <div className={styles.levelSelectionGrid}>
            {Object.entries(curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods).map(([periodoKey, periodo]) => (
              <button
                key={periodoKey}
                type="button"
                className={styles.levelCard}
                onClick={() => handlePeriodoSelect(periodoKey)}
              >
                <div className={styles.levelCardIcon}>{periodoKey.charAt(0).toUpperCase()}</div>
                <h2 className={styles.levelCardTitle}>{(periodo as any).name}</h2>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schermata Classe */}
      {step === 'classe' && selectedIndirizzo && selectedVoce && selectedPeriodo && (
        <div className={styles.welcomeScreen}>
          <div className={styles.welcomeBox}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              ← Indietro
            </button>
            <h1>{curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].name}</h1>
            <p>Seleziona la classe</p>
          </div>
          <div className={styles.levelSelectionGrid}>
            {curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes &&
              Object.entries(curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes).map(([classeKey, classe]) => (
                <button
                  key={classeKey}
                  type="button"
                  className={styles.levelCard}
                  onClick={() => handleClasseSelect(classeKey)}
                >
                  <div className={styles.levelCardIcon}>{(classe as any).name}</div>
                  <h2 className={styles.levelCardTitle}>{(classe as any).name}</h2>
                </button>
              ))}
          </div>
        </div>
      )}

      {step === 'details' && selectedLevel && (
        <div className={styles.detailsScreen}>
          {/* Per SecondoLivello custom, passa i dati della classe selezionata */}
          {selectedLevel === 'SecondoLivello' && selectedIndirizzo && selectedVoce && selectedPeriodo && selectedClasse ? (
            <AssegnazioneDetails
              level={selectedLevel}
              onBack={handleBack}
              editId={editId}
              customSections={
                curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes
                  ? curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes[selectedClasse].sections
                  : []
              }
              customTitle={
                curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes
                  ? curriculumModel.SecondoLivello.indirizzi[selectedIndirizzo].voci[selectedVoce].periods[selectedPeriodo].classes[selectedClasse].name
                  : ''
              }
            />
          ) : (
            <AssegnazioneDetails level={selectedLevel} onBack={handleBack} editId={editId} />
          )}
        </div>
      )}
    </div>
  );
}

interface AssegnazioneDetailsProps {
  level: LevelType;
  onBack: () => void;
  editId: string | null;
}

interface CustomCompetenza {
  id: string;
  title: string;
  hours: number;
  distanceHours: number;
}

// customSections e customTitle sono opzionali e usati per SecondoLivello custom
function AssegnazioneDetails({ level, onBack, editId, customSections, customTitle }: AssegnazioneDetailsProps & { customSections?: any[]; customTitle?: string }) {
  const curriculum = (curriculumModel as any)[level];

  // Funzione per inizializzare i dati con 1h minima per ogni subtopic
  const loadCurriculum = () => {
    if (customSections) {
      // Per SecondoLivello custom, usa direttamente le sezioni passate
      return { sections: JSON.parse(JSON.stringify(customSections)) };
    }
    if (!curriculum || !curriculum.levels || !Array.isArray(curriculum.levels) || !curriculum.levels[0]) {
      return null;
    }
    const data = JSON.parse(JSON.stringify(curriculum.levels[0]));
    // Imposta 1h come minimo per ogni subtopic
    data.sections.forEach((section: any) => {
      section.subtopics.forEach((subtopic: any) => {
        if (subtopic.hours === 0) {
          subtopic.hours = 1;
        }
        if (!subtopic.distanceHours) {
          subtopic.distanceHours = 0;
        }
      });
    });
    return data;
  };

  const [assignments, setAssignments] = useState<any>(loadCurriculum());
  const [viewMode, setViewMode] = useState<'originale' | 'semplificata'>('originale');
  const [customCompetenzeIncremento, setCustomCompetenzeIncremento] = useState<CustomCompetenza[]>([]);
  const [newCompetenzaTitle, setNewCompetenzaTitle] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(!!editId);

  const DISTANCE_CAP_RATIO = 0.2;
  const MINIMUM_HOURS = 1;
  const MAX_INCREMENTO_HOURS = 200;

  // Funzione per mostrare notifiche
  const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Scompare dopo 5 secondi
  };

  // Carica assegnazione da modificare
  useEffect(() => {
    if (editId) {
      console.log('Caricamento assegnazione con ID:', editId);
      fetch(`/api/assignments/${editId}`)
        .then(res => res.json())
        .then(data => {
          console.log('Dati ricevuti:', data);
          if (data && data.assignment && data.assignment.assegnazioni) {
            // Ricostruisci lo stato assignments dalle assegnazioni salvate
            const newAssignments = loadCurriculum();
            console.log('Assignments iniziali:', newAssignments);
            console.log('Assegnazioni da caricare:', data.assignment.assegnazioni);
            let incrementoCompetenze: CustomCompetenza[] = [];
            // Carica le ore assegnate per ogni sezione
            data.assignment.assegnazioni.forEach((savedSection: any) => {
              if (savedSection.sectionId === 'competenze-incremento') {
                // Gestione competenze incremento personalizzate
                incrementoCompetenze = savedSection.subtopics.map((comp: any) => ({
                  id: comp.id,
                  title: comp.label,
                  hours: comp.hours,
                  distanceHours: comp.distanceHours || 0,
                }));
              } else {
                const section = newAssignments.sections.find((s: any) => s.title === savedSection.sectionTitle);
                console.log(`Cercando sezione "${savedSection.sectionTitle}":`, section ? 'Trovata' : 'NON TROVATA');
                if (section) {
                  savedSection.subtopics.forEach((savedSub: any) => {
                    const subtopic = section.subtopics.find((sub: any) => sub.label === savedSub.label);
                    console.log(`  - Cercando subtopic "${savedSub.label}":`, subtopic ? 'Trovato' : 'NON TROVATO');
                    if (subtopic) {
                      subtopic.hours = savedSub.hours;
                      subtopic.distanceHours = savedSub.distanceHours || 0;
                      console.log(`    Impostato: ${savedSub.hours}h (${savedSub.distanceHours}h distanza)`);
                    }
                  });
                }
              }
            });
            console.log('Assignments dopo caricamento:', newAssignments);
            setAssignments(newAssignments);
            setCustomCompetenzeIncremento(incrementoCompetenze);
            setIsSaved(true); // È già salvato
            setIsLoadingData(false);
            showNotification('Assegnazione caricata per la modifica', 'success');
          }
        })
        .catch(error => {
          console.error('Errore caricamento:', error);
          setIsLoadingData(false);
          showNotification('Errore nel caricamento dell\'assegnazione', 'error');
        });
    }
  }, [editId]);

  // Calcola ore allocate per sezione
  const sectionAllocated = (section: Section) => {
    return section.subtopics.reduce((sum, sub) => sum + sub.hours, 0);
  };

  // Calcola ore rimanenti per sezione
  const sectionRemaining = (section: Section) => {
    return Math.max(0, section.totalHours - sectionAllocated(section));
  };

  // Calcola ore a distanza allocate per sezione
  const sectionDistanceAllocated = (section: Section) => {
    return section.subtopics.reduce((sum, sub) => sum + (sub.distanceHours || 0), 0);
  };

  // Calcola limite ore a distanza per sezione
  const sectionDistanceCap = (section: Section) => {
    return Math.floor((section.totalHours || 0) * DISTANCE_CAP_RATIO);
  };

  // Calcola ore a distanza rimanenti per sezione
  const sectionDistanceRemaining = (section: Section) => {
    return Math.max(0, sectionDistanceCap(section) - sectionDistanceAllocated(section));
  };

  // Calcola ore totali rimanenti da assegnare
  const getTotalRemainingHours = () => {
    let total = 0;
    assignments.sections.forEach((section: Section) => {
      const allocated = section.subtopics.reduce((sum, sub) => sum + sub.hours, 0);
      total += section.totalHours - allocated;
    });
    
    // Aggiungi ore di Incremento per Alpha se presenti
    if (level === 'Alpha' && customCompetenzeIncremento.length > 0) {
      const incrementoAllocated = customCompetenzeIncremento.reduce((sum, comp) => sum + comp.hours, 0);
      total += MAX_INCREMENTO_HOURS - incrementoAllocated;
    }
    
    return total;
  };

  const handleHourChange = (sectionId: string, subtopicId: string, value: number) => {
    setIsSaved(false); // Resetta lo stato di salvataggio quando si modifica
    setAssignments((prev: any) => {
      const newAssignments = { ...prev };
      const section = newAssignments.sections.find((s: Section) => s.id === sectionId);
      if (section) {
        const subtopic = section.subtopics.find((st: Subtopic) => st.id === subtopicId);
        if (subtopic) {
          // Calcola quante ore sono già assegnate ad altri subtopic
          const otherSubtopicsTotal = section.subtopics
            .filter((st: Subtopic) => st.id !== subtopic.id)
            .reduce((sum: number, st: Subtopic) => sum + st.hours, 0);
          
          // Calcola il massimo che posso assegnare a questo subtopic
          const maxAvailable = section.totalHours - otherSubtopicsTotal;
          
          // Assicurati che non superi il massimo disponibile
          subtopic.hours = Math.max(MINIMUM_HOURS, Math.min(value, maxAvailable));
          
          // Limita anche le ore a distanza se necessario
          if (subtopic.distanceHours > subtopic.hours) {
            subtopic.distanceHours = subtopic.hours;
          }
        }
      }
      return newAssignments;
    });
  };

  const handleDistanceChange = (sectionId: string, subtopicId: string, value: number) => {
    setIsSaved(false); // Resetta lo stato di salvataggio quando si modifica
    setAssignments((prev: any) => {
      const newAssignments = { ...prev };
      const section = newAssignments.sections.find((s: Section) => s.id === sectionId);
      if (section) {
        const subtopic = section.subtopics.find((st: Subtopic) => st.id === subtopicId);
        if (subtopic) {
          const sectionCap = sectionDistanceCap(section);
          const distanceAllocated = sectionDistanceAllocated(section);
          const currentDistance = subtopic.distanceHours || 0;
          const otherDistance = distanceAllocated - currentDistance;
          const remainingForSection = Math.max(0, sectionCap - otherDistance);
          
          // Limita al minimo tra le ore totali del subtopic e il limite della sezione
          const maxAllowed = Math.min(subtopic.hours, remainingForSection);
          subtopic.distanceHours = Math.max(0, Math.min(value, maxAllowed));
        }
      }
      return newAssignments;
    });
  };

  const buildSliderGradient = (percent: number) => {
    const filled = '#0066cc';
    const empty = '#e2e8f0';
    return `linear-gradient(to right, ${filled} 0%, ${filled} ${percent}%, ${empty} ${percent}%, ${empty} 100%)`;
  };

  const buildDistanceSliderGradient = (percent: number) => {
    const filled = '#38b2ac';
    const empty = '#e2e8f0';
    return `linear-gradient(to right, ${filled} 0%, ${filled} ${percent}%, ${empty} ${percent}%, ${empty} 100%)`;
  };

  // Navigazione con frecce nella tabella
  const handleKeyNavigation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

    e.preventDefault();
    const currentInput = e.target as HTMLInputElement;
    const allInputs = Array.from(document.querySelectorAll('.tableInput')) as HTMLInputElement[];
    const currentIndex = allInputs.indexOf(currentInput);

    if (currentIndex === -1) return;

    let targetIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
        targetIndex = currentIndex + 2; // Prossima riga (2 input per riga: ore + distanza)
        break;
      case 'ArrowUp':
        targetIndex = currentIndex - 2; // Riga precedente
        break;
      case 'ArrowRight':
        targetIndex = currentIndex + 1; // Prossimo campo
        break;
      case 'ArrowLeft':
        targetIndex = currentIndex - 1; // Campo precedente
        break;
    }

    if (targetIndex >= 0 && targetIndex < allInputs.length) {
      allInputs[targetIndex].focus();
      allInputs[targetIndex].select();
    }
  };

  // Funzioni per Competenze di Incremento
  const getTotalIncrementoHours = () => {
    return customCompetenzeIncremento.reduce((sum, comp) => sum + comp.hours, 0);
  };

  const getRemainingIncrementoHours = () => {
    return MAX_INCREMENTO_HOURS - getTotalIncrementoHours();
  };

  const getIncrementoDistanceCap = () => {
    const totalHours = getTotalIncrementoHours();
    return Math.min(40, Math.floor(totalHours * DISTANCE_CAP_RATIO));
  };

  const getTotalIncrementoDistanceHours = () => {
    return customCompetenzeIncremento.reduce((sum, comp) => sum + (comp.distanceHours || 0), 0);
  };

  const getRemainingIncrementoDistanceHours = () => {
    return getIncrementoDistanceCap() - getTotalIncrementoDistanceHours();
  };

  const addCompetenzaIncremento = () => {
    if (!newCompetenzaTitle.trim()) {
      alert('Il titolo è obbligatorio!');
      return;
    }
    
    const newCompetenza: CustomCompetenza = {
      id: `incremento-${Date.now()}`,
      title: newCompetenzaTitle.trim(),
      hours: 1,
      distanceHours: 0,
    };

    setCustomCompetenzeIncremento([...customCompetenzeIncremento, newCompetenza]);
    setNewCompetenzaTitle('');
  };

  const removeCompetenzaIncremento = (id: string) => {
    setCustomCompetenzeIncremento(customCompetenzeIncremento.filter(c => c.id !== id));
  };

  const updateIncrementoHours = (id: string, newHours: number) => {
    setIsSaved(false); // Resetta lo stato di salvataggio quando si modifica
    setCustomCompetenzeIncremento(prev => {
      // Prima aggiorna le ore
      const updated = prev.map(comp => {
        if (comp.id === id) {
          const otherHours = prev.filter(c => c.id !== id).reduce((sum, c) => sum + c.hours, 0);
          const maxAvailable = MAX_INCREMENTO_HOURS - otherHours;
          const validHours = Math.max(MINIMUM_HOURS, Math.min(newHours, maxAvailable));
          return { ...comp, hours: validHours };
        }
        return comp;
      });

      // Poi ricalcola il cap delle ore a distanza e valida
      const totalHours = updated.reduce((sum, c) => sum + c.hours, 0);
      const newDistanceCap = Math.min(40, Math.floor(totalHours * DISTANCE_CAP_RATIO));
      const totalDistance = updated.reduce((sum, c) => sum + (c.distanceHours || 0), 0);

      // Se il totale ore a distanza supera il nuovo cap, riduci proporzionalmente
      if (totalDistance > newDistanceCap) {
        return updated.map(comp => ({
          ...comp,
          distanceHours: Math.floor((comp.distanceHours / totalDistance) * newDistanceCap)
        }));
      }

      return updated;
    });
  };

  const updateIncrementoDistance = (id: string, newDistance: number) => {
    setIsSaved(false); // Resetta lo stato di salvataggio quando si modifica
    setCustomCompetenzeIncremento(prev => {
      return prev.map(comp => {
        if (comp.id === id) {
          const distanceCap = getIncrementoDistanceCap();
          const otherDistance = prev.filter(c => c.id !== id).reduce((sum, c) => sum + (c.distanceHours || 0), 0);
          const maxAvailable = distanceCap - otherDistance;
          const validDistance = Math.max(0, Math.min(newDistance, maxAvailable));
          return { ...comp, distanceHours: validDistance };
        }
        return comp;
      });
    });
  };

  const handleSave = async () => {
    try {
      // Validazione: verifica che tutte le ore disponibili siano state assegnate
      let allHoursUsed = true;
      let sectionsWithRemainingHours: string[] = [];

      assignments.sections.forEach((section: Section) => {
        const allocated = section.subtopics.reduce((sum, sub) => sum + sub.hours, 0);
        const remaining = section.totalHours - allocated;
        
        if (remaining > 0) {
          allHoursUsed = false;
          sectionsWithRemainingHours.push(`${section.title} (mancano ${remaining} ore)`);
        }
      });

      // Per Alpha, controlla anche le ore di Incremento se presenti
      if (level === 'Alpha' && customCompetenzeIncremento.length > 0) {
        const incrementoAllocated = customCompetenzeIncremento.reduce((sum, comp) => sum + comp.hours, 0);
        const incrementoRemaining = MAX_INCREMENTO_HOURS - incrementoAllocated;
        
        if (incrementoRemaining > 0) {
          allHoursUsed = false;
          sectionsWithRemainingHours.push(`Competenze di Incremento (mancano ${incrementoRemaining} ore)`);
        }
      }

      if (!allHoursUsed) {
        showNotification(
          `Devi utilizzare tutte le ore disponibili.\n\nSezioni con ore non ancora assegnate:\n- ${sectionsWithRemainingHours.join('\n- ')}`,
          'warning'
        );
        return;
      }

      // Mappa i dati nella struttura richiesta dal backend
      const mappedAssegnazioni = assignments.sections.map((section: Section) => ({
        sectionId: section.id,
        sectionTitle: section.title,
        totalHours: section.totalHours,
        subtopics: section.subtopics.map((subtopic: Subtopic) => ({
          id: subtopic.id,
          code: subtopic.code || '',
          label: subtopic.label,
          hours: subtopic.hours,
          distanceHours: subtopic.distanceHours || 0,
        })),
      }));

      // Aggiungi le competenze di incremento solo per Alpha
      if (level === 'Alpha' && customCompetenzeIncremento.length > 0) {
        mappedAssegnazioni.push({
          sectionId: 'competenze-incremento',
          sectionTitle: 'Competenze di Incremento',
          totalHours: MAX_INCREMENTO_HOURS,
          subtopics: customCompetenzeIncremento.map((comp) => ({
            id: comp.id,
            code: '',
            label: comp.title,
            hours: comp.hours,
            distanceHours: comp.distanceHours,
          })),
        });
      }

      console.log('Invio dati:', {
        livello: level,
        livelloNome: curriculum.name,
        assegnazioni: mappedAssegnazioni,
      });

      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          livello: level,
          livelloNome: curriculum.name,
          assegnazioni: mappedAssegnazioni,
        }),
      });

      const data = await response.json();
      console.log('Risposta server:', data);

      if (response.ok) {
        setIsSaved(true);
        showNotification('Assegnazione salvata con successo!', 'success');
      } else {
        console.error('Errore risposta:', data);
        showNotification('Errore nel salvataggio: ' + (data.error || 'Errore sconosciuto'), 'error');
      }
    } catch (error) {
      console.error('Errore catch:', error);
      showNotification('Errore di rete: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'), 'error');
    }
  };

  // Se la struttura non è supportata (es. SecondoLivello custom), mostra placeholder
  // Se non ci sono dati, mostra una tabella vuota con intestazioni e un messaggio
  // Stato locale per materie e UDA (solo fallback demo)

  // Stato materie AFM stile competenze incremento
    const [materie, setMaterie] = React.useState([
      { id: 'mat-ita', nome: 'Lingua e letteratura italiana', ore: 99, distanza: 0, uda: [] },
      { id: 'mat-ing', nome: 'Lingua Inglese', ore: 66, distanza: 0, uda: [] },
      { id: 'mat-sci', nome: 'Scienze integrate', ore: 99, distanza: 0, uda: [] },
      { id: 'mat-mat', nome: 'Matematica', ore: 99, distanza: 0, uda: [] },
    ]);

    // Carica dati assegnazione se editId è presente (modifica)
    React.useEffect(() => {
      if (!editId) return;
      // Carica dal backend
      fetch(`/api/assignments/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.assignment && Array.isArray(data.assignment.assegnazioni)) {
            // Mappa le assegnazioni su materie/uda
            setMaterie(prevMaterie => prevMaterie.map(mat => {
              const found = data.assignment.assegnazioni.find((a: any) => a.sectionId === mat.id);
              if (!found) return { ...mat, uda: [] };
              return {
                ...mat,
                uda: found.subtopics.map((u: any, idx: number) => ({
                  id: u.id || `uda-${idx+1}`,
                  nome: u.label,
                  orePresenza: u.hours,
                  oreDistanza: u.distanceHours
                }))
              };
            }));
          }
        });
    }, [editId]);
  const [newUDA, setNewUDA] = React.useState({});
  const [newMateria, setNewMateria] = React.useState('');
  const [newOre, setNewOre] = React.useState('');
  const [newDistanza, setNewDistanza] = React.useState('');
  const MIN_HOURS = 1;
  const MAX_HOURS = 99;

  if ((!curriculum && !customSections) || !assignments || !assignments.sections || assignments.sections.length === 0) {
    // Copia struttura Alpha: ogni materia = sezione, ogni UDA = subtopic
    // Stato salvataggio e ore rimanenti demo
    const [isSaved, setIsSaved] = React.useState(false);
    const [notification, setNotification] = React.useState<{message: string, type: 'success' | 'error' | 'warning'} | null>(null);
    const getTotalRemainingHours = () => {
      let tot = 0;
      materie.forEach(m => {
        const used = m.uda.reduce((sum, u) => sum + (u.orePresenza || 0) + (u.oreDistanza || 0), 0);
        tot += Math.max(0, m.ore - used);
      });
      return tot;
    };

    // Funzione per mostrare notifiche
    const showNotification = (message: string, type: 'success' | 'error' | 'warning') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
    };

    // Salva su DB
    const handleSaveAFM = async () => {
      // Permetti il salvataggio anche se non tutte le ore sono assegnate, ma mostra warning
      let allHoursUsed = true;
      let materieConOreMancanti: string[] = [];
      materie.forEach(m => {
        const used = m.uda.reduce((sum, u) => sum + (u.orePresenza || 0) + (u.oreDistanza || 0), 0);
        if (m.ore - used > 0) {
          allHoursUsed = false;
          materieConOreMancanti.push(`${m.nome} (mancano ${m.ore - used} ore)`);
        }
      });
      // Mappa i dati come richiesto dal backend
      const assegnazioni = materie.map(m => ({
        sectionId: m.id,
        sectionTitle: m.nome,
        totalHours: m.ore,
        subtopics: m.uda.map(u => ({
          id: u.id,
          code: '',
          label: u.nome,
          hours: u.orePresenza,
          distanceHours: u.oreDistanza
        }))
      }));
      try {
        const response = await fetch('/api/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            livello: 'SecondoLivello',
            livelloNome: 'Percorso AFM',
            assegnazioni
          })
        });
        const data = await response.json();
        if (response.ok) {
          setIsSaved(true);
          if (!allHoursUsed) {
            showNotification(
              `Attenzione: non tutte le ore sono state assegnate.\n\nMaterie con ore non ancora assegnate:\n- ${materieConOreMancanti.join('\n- ')}\n\nAssegnazione salvata comunque!`,
              'warning'
            );
          } else {
            showNotification('Assegnazione salvata con successo!', 'success');
          }
        } else {
          showNotification('Errore nel salvataggio: ' + (data.error || 'Errore sconosciuto'), 'error');
        }
      } catch (error) {
        showNotification('Errore di rete: ' + (error instanceof Error ? error.message : 'Errore sconosciuto'), 'error');
      }
    };

    return (
      <div className={styles.detailsContainer}>
        {/* Notifica Toast */}
        {notification && (
          <div className={`${styles.notification} ${styles[notification.type]}`}>
            <div className={styles.notificationContent}>
              {notification.type === 'success' && <span className={styles.notificationIcon}>✓</span>}
              {notification.type === 'error' && <span className={styles.notificationIcon}>✕</span>}
              {notification.type === 'warning' && <span className={styles.notificationIcon}>⚠</span>}
              <span className={styles.notificationMessage}>{notification.message}</span>
            </div>
            <button 
              className={styles.notificationClose}
              onClick={() => setNotification(null)}
            >✕</button>
          </div>
        )}
        <div className={styles.header} style={{justifyContent:'center',flexDirection:'column',alignItems:'center',textAlign:'center',gap:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
            <button type="button" className={styles.backButton} onClick={onBack}>
              ← Indietro
            </button>
            <button className={styles.saveButton} style={{margin:'0 8px'}} onClick={handleSaveAFM}>Salva Assegnazione</button>
          </div>
          <h1 style={{margin:'16px 0 0 0',fontWeight:700,fontSize:28}}>Percorso AFM</h1>
          <p style={{fontSize:16,color:'#444',margin:'8px 0 0 0'}}>Livelli A1 e A2 del Quadro Comune Europeo di Riferimento per le lingue.</p>
        </div>
        <div className={styles.infoPanel} style={{margin:'24px 0',justifyContent:'flex-start',textAlign:'left',alignItems:'center',display:'flex',flexDirection:'row',gap:'32px'}}>
          <div className={styles.infoPanelItem}>
            <span className={styles.infoPanelLabel}>Ore rimanenti da assegnare:</span>
            <span className={`${styles.infoPanelValue} ${getTotalRemainingHours() === 0 ? styles.success : styles.warning}`}>{getTotalRemainingHours()} ore</span>
          </div>
          <div className={styles.infoPanelItem}>
            <span className={styles.infoPanelLabel}>Stato salvataggio:</span>
            <span className={`${styles.infoPanelValue} ${isSaved ? styles.success : styles.warning}`}>{isSaved ? '✓ Salvato' : '⚠ Non salvato'}</span>
          </div>
        </div>
        <div className={styles.sectionsContainer}>
          <div className={styles.tableView}>
            <table className={styles.competenzeTable}>
              <thead>
                <tr>
                  <th className={styles.competenzaCol}>Materia / UDA</th>
                  <th className={styles.oreCol}>Ore in presenza</th>
                  <th className={styles.oreCol}>Ore a distanza</th>
                </tr>
              </thead>
              <tbody>
                {materie.map((mat) => (
                  <React.Fragment key={mat.id}>
                    {/* Riga Titolo Materia */}
                    <tr className={styles.sectionHeaderRow}>
                      <td colSpan={3} className={styles.sectionHeaderCell} style={{padding:'18px 16px',fontSize:'18px',fontWeight:700,background:'#f7fafc',borderBottom:'2px solid #e2e8f0'}}>
                        <span style={{color:'#0066cc'}}>{mat.nome}</span>
                        <span style={{marginLeft:16,background:'#e6f0fa',color:'#0066cc',borderRadius:6,padding:'2px 10px',fontSize:15,fontWeight:600}}>{mat.ore} h totali</span>
                      </td>
                    </tr>
                    {/* Se non ci sono UDA, mostra solo messaggio, NON mostrare input ore */}
                    {mat.uda.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{textAlign:'center',color:'#888',fontSize:14,padding:'18px 0'}}>Aggiungi almeno una UDA per questa materia</td>
                      </tr>
                    ) : (
                      mat.uda.map((uda, idx) => {
                        // Calcola la somma delle ore assegnate a tutte le UDA tranne questa
                        const otherOre = mat.uda.reduce((sum, u, i) => i !== idx ? sum + (u.orePresenza || 0) + (u.oreDistanza || 0) : sum, 0);
                        const maxOrePresenza = mat.ore - otherOre - (uda.oreDistanza || 0);
                        const maxOreDistanza = Math.min(Math.floor(mat.ore * 0.2), mat.ore - otherOre - (uda.orePresenza || 0));
                        return (
                          <tr key={uda.id}>
                            <td className={styles.competenzaCell} style={{ paddingLeft: 32, display:'flex', alignItems:'center', gap:8 }}>
                              <span className={styles.competenzaTitleEdit}>{uda.nome}</span>
                              <button
                                style={{marginLeft:8,background:'#fff',border:'1px solid #e53e3e',color:'#e53e3e',borderRadius:4,padding:'2px 8px',fontSize:13,cursor:'pointer'}}
                                title="Elimina UDA"
                                onClick={() => {
                                  setMaterie(prev => prev.map(m => {
                                    if (m.id !== mat.id) return m;
                                    return {
                                      ...m,
                                      uda: m.uda.filter((u, i) => i !== idx)
                                    };
                                  }));
                                }}
                              >Elimina</button>
                            </td>
                            <td className={styles.oreCell}>
                              <input
                                type="number"
                                className={`${styles.tableInput} tableInput`}
                                min={0}
                                max={maxOrePresenza >= 0 ? maxOrePresenza : 0}
                                value={uda.orePresenza}
                                onChange={e => {
                                  let val = parseInt(e.target.value) || 0;
                                  if (val > maxOrePresenza) val = maxOrePresenza >= 0 ? maxOrePresenza : 0;
                                  if (val < 0) val = 0;
                                  setMaterie(materie.map(m => m.id === mat.id ? {
                                    ...m,
                                    uda: m.uda.map((u, i) => i === idx ? { ...u, orePresenza: val } : u)
                                  } : m));
                                }}
                              />
                            </td>
                            <td className={styles.oreCell}>
                              <input
                                type="number"
                                className={`${styles.tableInput} tableInput`}
                                min={0}
                                max={maxOreDistanza >= 0 ? maxOreDistanza : 0}
                                value={uda.oreDistanza}
                                onChange={e => {
                                  let val = parseInt(e.target.value) || 0;
                                  if (val > maxOreDistanza) val = maxOreDistanza >= 0 ? maxOreDistanza : 0;
                                  if (val < 0) val = 0;
                                  setMaterie(materie.map(m => {
                                    if (m.id !== mat.id) return m;
                                    return {
                                      ...m,
                                      uda: m.uda.map((u, i) => {
                                        if (i !== idx) return u;
                                        // Se la somma supera il totale materia, abbassa orePresenza
                                        let orePresenza = u.orePresenza || 0;
                                        if (orePresenza + val > mat.ore) {
                                          orePresenza = mat.ore - val;
                                          if (orePresenza < 0) orePresenza = 0;
                                        }
                                        return { ...u, oreDistanza: val, orePresenza };
                                      })
                                    };
                                  }));
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                    {/* Form per aggiungere nuova UDA */}
                    <tr className={styles.addCompetenzaRow}>
                      <td colSpan={3} className={styles.addCompetenzaCell}>
                        <div className={styles.addCompetenzaFormTable}>
                          <input
                            type="text"
                            className={styles.competenzaTitleInputTable}
                            placeholder="Nome nuova UDA"
                            value={newUDA[mat.id]?.nome || ''}
                            onChange={e => setNewUDA({ ...newUDA, [mat.id]: { ...newUDA[mat.id], nome: e.target.value } })}
                            disabled={mat.uda.reduce((sum, u) => sum + (u.orePresenza || 0) + (u.oreDistanza || 0), 0) >= mat.ore}
                          />
                          <button
                            className={styles.addCompetenzaButtonTable}
                            onClick={() => {
                              const used = mat.uda.reduce((sum, u) => sum + (u.orePresenza || 0) + (u.oreDistanza || 0), 0);
                              if (newUDA[mat.id]?.nome && used < mat.ore) {
                                setMaterie(materie.map(m => m.id === mat.id ? {
                                  ...m,
                                  uda: [
                                    ...m.uda,
                                    {
                                      id: 'uda-' + (m.uda.length + 1),
                                      nome: newUDA[mat.id].nome,
                                      orePresenza: 0,
                                      oreDistanza: 0
                                    }
                                  ]
                                } : m));
                                setNewUDA({ ...newUDA, [mat.id]: { nome: '' } });
                              }
                            }}
                            disabled={mat.uda.reduce((sum, u) => sum + (u.orePresenza || 0) + (u.oreDistanza || 0), 0) >= mat.ore}
                          >+ UDA</button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Mostra loading se sta caricando i dati
  if (isLoadingData) {
    return (
      <div className={styles.detailsContainer}>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Caricamento assegnazione in corso...</h2>
          <p>ID: {editId}</p>
        </div>
      </div>
    );
  }

  if (!assignments) {
    return (
      <div className={styles.detailsContainer}>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Nessun dato disponibile</h2>
          <p>Seleziona un percorso valido per visualizzare i dettagli.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      {/* Notifica Toast */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            {notification.type === 'success' && <span className={styles.notificationIcon}>✓</span>}
            {notification.type === 'error' && <span className={styles.notificationIcon}>✕</span>}
            {notification.type === 'warning' && <span className={styles.notificationIcon}>⚠</span>}
            <span className={styles.notificationMessage}>{notification.message}</span>
          </div>
          <button 
            className={styles.notificationClose}
            onClick={() => setNotification(null)}
          >
            ✕
          </button>
        </div>
      )}

      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Indietro
      </button>
      <div className={styles.header}>
        <div>
          <h1>{customTitle ? customTitle : curriculum.name}</h1>
          <p>{curriculum && curriculum.description}</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewModeToggle}>
            <button
              className={`${styles.toggleButton} ${viewMode === 'originale' ? styles.active : ''}`}
              onClick={() => setViewMode('originale')}
            >
              Originale
            </button>
            <button
              className={`${styles.toggleButton} ${viewMode === 'semplificata' ? styles.active : ''}`}
              onClick={() => setViewMode('semplificata')}
            >
              Semplificata
            </button>
          </div>
          <button className={styles.saveButton} onClick={handleSave}>
            Salva Assegnazione
          </button>
        </div>
      </div>

      {/* Pannello Informativo */}
      <div className={styles.infoPanel}>
        <div className={styles.infoPanelItem}>
          <span className={styles.infoPanelLabel}>Ore rimanenti da assegnare:</span>
          <span className={`${styles.infoPanelValue} ${getTotalRemainingHours() === 0 ? styles.success : styles.warning}`}>
            {getTotalRemainingHours()} ore
          </span>
        </div>
        <div className={styles.infoPanelItem}>
          <span className={styles.infoPanelLabel}>Stato salvataggio:</span>
          <span className={`${styles.infoPanelValue} ${isSaved ? styles.success : styles.warning}`}>
            {isSaved ? '✓ Salvato' : '⚠ Non salvato'}
          </span>
        </div>
      </div>

      <div className={styles.sectionsContainer}>
        {viewMode === 'originale' ? (
          // MODALITÀ ORIGINALE - Tabella unica con tutte le sezioni
          <div className={styles.tableView}>
            <table className={styles.competenzeTable}>
              <thead>
                <tr>
                  <th className={styles.competenzaCol}>Competenze Alfabetizzazione</th>
                  <th className={styles.oreCol}>Monte Ore in presenza</th>
                  <th className={styles.oreCol}>Monte Ore a distanza</th>
                </tr>
              </thead>
              <tbody>
                {assignments.sections.map((section: Section) => {
                  const distanceCap = sectionDistanceCap(section);
                  return (
                    <React.Fragment key={section.id}>
                      {/* Riga Titolo Sezione */}
                      <tr className={styles.sectionHeaderRow}>
                        <td colSpan={3} className={styles.sectionHeaderCell}>
                          <strong>{section.title}</strong> ({section.totalHours} ore totali)
                        </td>
                      </tr>
                      {/* Righe Competenze */}
                      {section.subtopics.map((subtopic: Subtopic) => {
                        const maxDistanceForSubtopic = Math.min(subtopic.hours, distanceCap);
                        // Ore in presenza = ore totali - ore a distanza
                        const presenza = Math.max(0, subtopic.hours - (subtopic.distanceHours || 0));
                        return (
                          <tr key={subtopic.id}>
                            <td className={styles.competenzaCell}>
                              {subtopic.code && <span className={styles.codeLabel}>{subtopic.code}.</span>}
                              {subtopic.label}
                            </td>
                            <td className={styles.oreCell}>
                              <input
                                type="number"
                                className={`${styles.tableInput} tableInput`}
                                min={MINIMUM_HOURS}
                                max={section.totalHours}
                                value={presenza}
                                onChange={(e) => {
                                  // Modifica solo le ore in presenza, mantenendo le ore a distanza
                                  const newPresenza = parseInt(e.target.value) || MINIMUM_HOURS;
                                  const newTotale = newPresenza + (subtopic.distanceHours || 0);
                                  handleHourChange(section.id, subtopic.id, newTotale);
                                }}
                                onKeyDown={handleKeyNavigation}
                              />
                            </td>
                            <td className={styles.oreCell}>
                              <input
                                type="number"
                                className={`${styles.tableInput} tableInput`}
                                min={0}
                                max={maxDistanceForSubtopic}
                                value={subtopic.distanceHours || 0}
                                onChange={(e) =>
                                  handleDistanceChange(section.id, subtopic.id, parseInt(e.target.value) || 0)
                                }
                                disabled={distanceCap === 0}
                                onKeyDown={handleKeyNavigation}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}

                {/* Sezione Competenze di Incremento - Solo per Alpha */}
                {level === 'Alpha' && (
                  <React.Fragment>
                    {/* Riga Titolo Sezione Incremento */}
                    <tr className={styles.sectionHeaderRow}>
                      <td colSpan={3} className={styles.sectionHeaderCell}>
                        <strong>Competenze di Incremento</strong> (200 ore totali)
                      </td>
                    </tr>

                    {/* Righe Competenze Personalizzate */}
                    {customCompetenzeIncremento.map((comp) => {
                      const distanceCap = getIncrementoDistanceCap();
                      const otherDistance = customCompetenzeIncremento
                        .filter(c => c.id !== comp.id)
                        .reduce((sum, c) => sum + (c.distanceHours || 0), 0);
                      const maxAvailableDistance = distanceCap - otherDistance;
                      
                      return (
                        <tr key={comp.id}>
                          <td className={styles.competenzaCell}>
                            <input
                              type="text"
                              className={styles.competenzaTitleEdit}
                              value={comp.title}
                              onChange={(e) => {
                                const newTitle = e.target.value;
                                setCustomCompetenzeIncremento(prev => 
                                  prev.map(c => 
                                    c.id === comp.id ? { ...c, title: newTitle } : c
                                  )
                                );
                              }}
                              placeholder="Nome competenza"
                            />
                            <button
                              className={styles.deleteCompetenzaButton}
                              onClick={() => removeCompetenzaIncremento(comp.id)}
                              title="Elimina competenza"
                            >
                              Elimina
                            </button>
                          </td>
                          <td className={styles.oreCell}>
                            <input
                              type="number"
                              className={`${styles.tableInput} tableInput`}
                              min={MINIMUM_HOURS}
                              max={getRemainingIncrementoHours() + comp.hours}
                              value={comp.hours}
                              onChange={(e) => updateIncrementoHours(comp.id, parseInt(e.target.value) || MINIMUM_HOURS)}
                              onKeyDown={handleKeyNavigation}
                            />
                          </td>
                          <td className={styles.oreCell}>
                            <input
                              type="number"
                              className={`${styles.tableInput} tableInput`}
                              min={0}
                              max={maxAvailableDistance}
                              value={comp.distanceHours}
                              onChange={(e) => updateIncrementoDistance(comp.id, parseInt(e.target.value) || 0)}
                              onKeyDown={handleKeyNavigation}
                            />
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Riga Form Aggiungi Competenza - IN BASSO */}
                    <tr className={styles.addCompetenzaRow}>
                      <td colSpan={3} className={styles.addCompetenzaCell}>
                        <div className={styles.addCompetenzaFormTable}>
                          <input
                            type="text"
                            className={styles.competenzaTitleInputTable}
                            placeholder="Titolo nuova competenza (obbligatorio)"
                            value={newCompetenzaTitle}
                            onChange={(e) => setNewCompetenzaTitle(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCompetenzaIncremento();
                              }
                            }}
                          />
                          <button
                            className={styles.addCompetenzaButtonTable}
                            onClick={addCompetenzaIncremento}
                            disabled={getRemainingIncrementoHours() === 0}
                          >
                            + Aggiungi Competenza
                          </button>
                          <span className={styles.incrementoCounter}>
                            {getTotalIncrementoHours()} / {MAX_INCREMENTO_HOURS} ore - {getRemainingIncrementoHours()} disponibili
                          </span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // MODALITÀ SEMPLIFICATA - Card separate con progress bar
          assignments.sections.map((section: Section) => {
          const allocated = sectionAllocated(section);
          const remaining = sectionRemaining(section);
          const completion = section.totalHours > 0 
            ? Math.min(100, Math.round((allocated / section.totalHours) * 100)) 
            : 0;
          const distanceCap = sectionDistanceCap(section);
          const distanceAllocated = sectionDistanceAllocated(section);
          const distanceRemaining = sectionDistanceRemaining(section);

          return (
            <div key={section.id} className={`${styles.sectionCard} ${remaining === 0 && section.totalHours > 0 ? styles.complete : ''}`}>
              <div className={styles.sectionTop}>
                <div className={styles.sectionMeta}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <span className={styles.capsule}>{section.totalHours} ore totali</span>
                </div>
                <div className={`${styles.sectionFeedback} ${remaining === 0 ? '' : styles.warning}`}>
                  <span className={styles.feedbackCounter}>
                    Assegnate <strong>{allocated}</strong> ore
                  </span>
                  <span className={styles.feedbackStatus}>
                    {remaining === 0 && section.totalHours > 0
                      ? 'Distribuzione completata'
                      : `Ore da assegnare: ${remaining}`}
                  </span>
                </div>
              </div>

              <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${completion}%` }}></div>
              </div>

              {(distanceAllocated > 0 || distanceCap > 0) && (
                <div className={`${styles.sectionDistance} ${distanceRemaining === 0 && distanceCap > 0 ? styles.limit : ''}`}>
                  <span className={styles.distanceCounter}>
                    Ore distanza: <strong>{distanceAllocated}</strong>
                    {distanceCap > 0 ? ` / ${distanceCap}` : ''}
                  </span>
                  <span className={styles.distanceStatus}>
                    {distanceCap === 0
                      ? 'Nessuna attività a distanza consentita per questa sezione.'
                      : distanceRemaining === 0
                      ? 'Limite ore distanza raggiunto.'
                      : `Ore a distanza disponibili: ${distanceRemaining}`}
                  </span>
                </div>
              )}

              <div className={styles.subtopics}>
                {section.subtopics.length > 0 ? (
                  section.subtopics.map((subtopic: Subtopic) => {
                    const presenceHours = Math.max(0, subtopic.hours - (subtopic.distanceHours || 0));
                    const percent = section.totalHours > 0
                      ? Math.round(((subtopic.hours - MINIMUM_HOURS) / (section.totalHours - MINIMUM_HOURS)) * 100)
                      : 0;
                    const distancePercent = distanceCap > 0
                      ? Math.min(100, Math.round(((subtopic.distanceHours || 0) / distanceCap) * 100))
                      : 0;

                    return (
                      <div key={subtopic.id} className={styles.subtopic}>
                        <div className={styles.subtopicHeader}>
                          <div className={styles.subtopicInfo}>
                            {subtopic.code && (
                              <span className={styles.subtopicCode}>{subtopic.code}.</span>
                            )}
                            <span className={styles.subtopicTitle}>{subtopic.label}</span>
                          </div>
                          <div className={styles.subtopicBadges}>
                            {subtopic.hours > 0 && (
                              <span className={styles.subtopicHours}>{subtopic.hours} h totali</span>
                            )}
                            {(subtopic.distanceHours || 0) > 0 && (
                              <span className={styles.subtopicDistanceTag}>
                                {subtopic.distanceHours} h distanza
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.subtopicDistribution}>
                          <span>Presenza: <strong>{presenceHours}</strong> h</span>
                          <span>Distanza: <strong>{subtopic.distanceHours || 0}</strong> h</span>
                        </div>

                        <div className={styles.subtopicControls}>
                          <div className={styles.sliderGroup}>
                            <label>Ore totali</label>
                            <input
                              type="range"
                              className={styles.subtopicSlider}
                              min={MINIMUM_HOURS}
                              max={section.totalHours}
                              value={subtopic.hours}
                              onChange={(e) =>
                                handleHourChange(section.id, subtopic.id, parseInt(e.target.value))
                              }
                              style={{ background: buildSliderGradient(percent) }}
                            />
                          </div>

                          <div className={styles.sliderGroup}>
                            <label>Ore a distanza</label>
                            <input
                              type="range"
                              className={styles.distanceSlider}
                              min={0}
                              max={Math.min(subtopic.hours, distanceCap)}
                              value={subtopic.distanceHours || 0}
                              onChange={(e) =>
                                handleDistanceChange(section.id, subtopic.id, parseInt(e.target.value))
                              }
                              disabled={distanceCap === 0}
                              style={{ background: buildDistanceSliderGradient(distancePercent) }}
                            />
                          </div>

                          <div className={styles.inputsRow}>
                            <div className={styles.inputGroup}>
                              <label htmlFor={`input-${subtopic.id}`}>Ore totali</label>
                              <input
                                type="number"
                                id={`input-${subtopic.id}`}
                                min={MINIMUM_HOURS}
                                max={section.totalHours}
                                value={subtopic.hours}
                                onChange={(e) =>
                                  handleHourChange(section.id, subtopic.id, parseInt(e.target.value) || MINIMUM_HOURS)
                                }
                                className={styles.numberInput}
                              />
                            </div>

                            <div className={styles.inputGroup}>
                              <label htmlFor={`distance-${subtopic.id}`}>Ore distanza</label>
                              <input
                                type="number"
                                id={`distance-${subtopic.id}`}
                                min={0}
                                max={Math.min(subtopic.hours, distanceCap)}
                                value={subtopic.distanceHours || 0}
                                onChange={(e) =>
                                  handleDistanceChange(section.id, subtopic.id, parseInt(e.target.value) || 0)
                                }
                                disabled={distanceCap === 0}
                                className={styles.numberInput}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className={styles.emptyMessage}>Nessuna competenza disponibile.</p>
                )}
              </div>
            </div>
          );
        })
        )}

        {/* Sezione Competenze di Incremento - Solo per Alpha - Modalità Semplificata */}
        {level === 'Alpha' && viewMode === 'semplificata' && (
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Competenze di Incremento</h2>
                <p className={styles.sectionMeta}>200 ore totali</p>
              </div>
              <div className={styles.sectionProgress}>
                <div className={styles.progressInfo}>
                  <span className={styles.progressLabel}>Usate</span>
                  <span className={styles.progressValue}>{getTotalIncrementoHours()} / 200 ore</span>
                </div>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${Math.min(100, (getTotalIncrementoHours() / MAX_INCREMENTO_HOURS) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.competenzeList}>
              {/* Form Aggiungi Competenza */}
              <div className={styles.addCompetenzaCard}>
                <input
                  type="text"
                  className={styles.competenzaTitleInput}
                  placeholder="Titolo nuova competenza (obbligatorio)"
                  value={newCompetenzaTitle}
                  onChange={(e) => setNewCompetenzaTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCompetenzaIncremento();
                    }
                  }}
                />
                <button
                  className={styles.addCompetenzaButton}
                  onClick={addCompetenzaIncremento}
                  disabled={getRemainingIncrementoHours() === 0}
                >
                  + Aggiungi Competenza
                </button>
                <span className={styles.remainingHours}>
                  {getRemainingIncrementoHours()} ore disponibili
                </span>
              </div>

              {/* Lista Competenze */}
              {customCompetenzeIncremento.map((comp) => {
                const distanceCap = getIncrementoDistanceCap();
                const otherDistance = customCompetenzeIncremento
                  .filter(c => c.id !== comp.id)
                  .reduce((sum, c) => sum + (c.distanceHours || 0), 0);
                const maxAvailableDistance = distanceCap - otherDistance;
                const percent = Math.round((comp.hours / MAX_INCREMENTO_HOURS) * 100);
                const distancePercent = distanceCap > 0 
                  ? Math.min(100, Math.round((comp.distanceHours / distanceCap) * 100))
                  : 0;
                const presenceHours = comp.hours - (comp.distanceHours || 0);

                return (
                  <div key={comp.id} className={styles.subtopicCard}>
                    <div className={styles.subtopicHeader}>
                      <div className={styles.subtopicInfo}>
                        <input
                          type="text"
                          className={styles.competenzaTitleEditCard}
                          value={comp.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            setCustomCompetenzeIncremento(prev => 
                              prev.map(c => 
                                c.id === comp.id ? { ...c, title: newTitle } : c
                              )
                            );
                          }}
                          placeholder="Nome competenza"
                        />
                      </div>
                      <div className={styles.subtopicBadges}>
                        {comp.hours > 0 && (
                          <span className={styles.subtopicHours}>{comp.hours} h totali</span>
                        )}
                        {comp.distanceHours > 0 && (
                          <span className={styles.subtopicDistanceTag}>
                            {comp.distanceHours} h distanza
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.subtopicDistribution}>
                      <span>Presenza: <strong>{presenceHours}</strong> h</span>
                      <span>Distanza: <strong>{comp.distanceHours}</strong> h</span>
                    </div>

                    <div className={styles.subtopicControls}>
                      <div className={styles.sliderGroup}>
                        <label>Ore totali</label>
                        <input
                          type="range"
                          className={styles.subtopicSlider}
                          min={MINIMUM_HOURS}
                          max={MAX_INCREMENTO_HOURS}
                          value={comp.hours}
                          onChange={(e) => updateIncrementoHours(comp.id, parseInt(e.target.value))}
                          style={{ background: buildSliderGradient(percent) }}
                        />
                      </div>

                      <div className={styles.sliderGroup}>
                        <label>Ore a distanza</label>
                        <input
                          type="range"
                          className={styles.distanceSlider}
                          min={0}
                          max={maxAvailableDistance}
                          value={comp.distanceHours}
                          onChange={(e) => updateIncrementoDistance(comp.id, parseInt(e.target.value))}
                          disabled={distanceCap === 0}
                          style={{ background: buildDistanceSliderGradient(distancePercent) }}
                        />
                      </div>

                      <div className={styles.inputsRow}>
                        <div className={styles.inputGroup}>
                          <label>Ore totali</label>
                          <input
                            type="number"
                            min={MINIMUM_HOURS}
                            max={getRemainingIncrementoHours() + comp.hours}
                            value={comp.hours}
                            onChange={(e) => updateIncrementoHours(comp.id, parseInt(e.target.value) || MINIMUM_HOURS)}
                            className={styles.numberInput}
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label>Ore distanza</label>
                          <input
                            type="number"
                            min={0}
                            max={maxAvailableDistance}
                            value={comp.distanceHours}
                            onChange={(e) => updateIncrementoDistance(comp.id, parseInt(e.target.value) || 0)}
                            disabled={distanceCap === 0}
                            className={styles.numberInput}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className={styles.deleteCompetenzaButtonCard}
                      onClick={() => removeCompetenzaIncremento(comp.id)}
                      title="Elimina competenza"
                    >
                      Elimina Competenza
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
