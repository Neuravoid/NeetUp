import React from 'react';
import { RoadmapStep, UserRoadmap } from '../../services/roadmap.service';
import Button from '../common/Button';
import Badge from '../common/Badge';
import './RoadmapTimeline.css';
// Next.js router yerine window.location kullanacağız

interface RoadmapTimelineProps {
  roadmap: UserRoadmap;
  onStepStatusUpdate: (stepId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => void;
}

// Simple icon components to replace heroicons
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowPathIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LightningBoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ roadmap, onStepStatusUpdate }) => {
  // Router kaldırıldı, window.location kullanacağız
  
  // Sort steps by order
  const sortedSteps = [...roadmap.steps].sort((a, b) => {
    // Eğer order özelliği varsa ona göre sırala, yoksa id'den çıkarılan numaraya göre sırala
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    
    // id'den numara çıkar (örn: "step-1" -> 1)
    const aNum = parseInt(a.id.replace('step-', ''));
    const bNum = parseInt(b.id.replace('step-', ''));
    return aNum - bNum;
  });
  
  // Determine the recommended starting step index
  const recommendedStartIndex = roadmap.recommended_start_index || 0;

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge color="green">Tamamlandı</Badge>;
      case 'in_progress':
        return <Badge color="blue">Devam Ediyor</Badge>;
      default:
        return <Badge color="gray">Başlanmadı</Badge>;
    }
  };

  // Helper function to get step node class based on status
  const getStepNodeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'step-node step-node-completed';
      case 'in_progress':
        return 'step-node step-node-in-progress';
      default:
        return 'step-node step-node-not-started';
    }
  };
  
  // Aşamaya tıklandığında kurs sayfasına yönlendirme
  const handleStepClick = (step: RoadmapStep) => {
    if (step.course_link) {
      window.location.href = step.course_link;
    }
  };

  return (
    <div className="roadmap-timeline">
      {/* Road path background */}
      <div className="road-path"></div>
      
      {/* Road markings (dashed line) */}
      <div className="road-markings"></div>
      
      {/* Timeline steps */}
      <div className="space-y-16">
        {sortedSteps.map((step, index) => {
          const isRecommendedStart = index === recommendedStartIndex;
          const isEvenStep = index % 2 === 0;
          
          return (
            <div key={step.id} className="relative">
              {/* Step node (circle with number) */}
              <div className="flex justify-center mb-4">
                <div 
                  className={`${getStepNodeClass(step.status)} ${step.course_link ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
                  onClick={() => step.course_link && handleStepClick(step)}
                >
                  {index + 1}
                </div>
              </div>
              
              {/* Step card */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 relative`}>
                {/* Empty column for odd steps on left side */}
                {!isEvenStep && <div className="hidden md:block"></div>}
                
                {/* Step content */}
                <div 
                  className={`step-card bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm ${step.course_link ? 'cursor-pointer hover:border-primary hover:shadow-md transition-all' : ''}`}
                  onClick={() => step.course_link && handleStepClick(step)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                    {isRecommendedStart && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        Buradan Başlayın
                      </span>
                    )}
                  </h3>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <ArrowPathIcon className="h-4 w-4 mr-1" />
                      <span>{step.tasks_count} görev</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <LightningBoltIcon className="h-4 w-4 mr-1" />
                      <span>{step.duration}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Öğrenilecekler:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-1">
                      {Array.isArray(step.learning_objectives) 
                        ? step.learning_objectives.map((objective, i) => (
                            <li key={i}>{objective}</li>
                          ))
                        : step.learning_objectives?.split(',').map((objective, i) => (
                            <li key={i}>{objective.trim()}</li>
                          ))
                      }
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>{getStatusBadge(step.status)}</div>
                    
                    <div className="flex space-x-2">
                      {step.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation(); // Tıklamanın üst elemanlara yayılmasını engelle
                            onStepStatusUpdate(step.id, 'completed');
                          }}
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Tamamlandı
                        </Button>
                      )}
                      
                      {step.course_link && (
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={(e) => {
                            e.stopPropagation(); // Tıklamanın üst elemanlara yayılmasını engelle
                            handleStepClick(step);
                          }}
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Kursa Git
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Empty column for even steps on right side */}
                {isEvenStep && <div className="hidden md:block"></div>}
              </div>
              
              {/* Recommended start indicator */}
              {isRecommendedStart && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                  <div className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-3 py-1 rounded-full text-xs font-medium inline-flex items-center">
                    <LightningBoltIcon className="h-3 w-3 mr-1" />
                    Önerilen Başlangıç
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
