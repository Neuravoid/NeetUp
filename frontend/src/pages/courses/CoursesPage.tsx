import { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, CheckCircle, Circle } from 'lucide-react';
import { coursesData, type Course } from '../../data/coursesData';

interface CompletedResources {
  [key: string]: boolean;
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [completedResources, setCompletedResources] = useState<CompletedResources>({});

  useEffect(() => {
    const stored = localStorage.getItem('completedResources');
    if (stored) {
      setCompletedResources(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedResources', JSON.stringify(completedResources));
  }, [completedResources]);

  const toggleResource = (resourceId: string) => {
    setCompletedResources(prev => ({
      ...prev,
      [resourceId]: !prev[resourceId]
    }));
  };

  const toggleStage = (stageName: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageName]: !prev[stageName]
    }));
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setExpandedStages({});
  };

  const generateResourceId = (courseName: string, stageName: string, resourceIndex: number) => {
    return `${courseName}-${stageName}-${resourceIndex}`.replace(/\s+/g, '-').toLowerCase();
  };

  const renderCourseDetails = (courseName: string, course: Course) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 animate-fade-in">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={handleBackToCourses}
            className="inline-flex items-center gap-2 text-gray-600 font-semibold mb-8 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32-11.32L154.34,136H80a8,8,0,0,1,0-16h74.34l-39.66-39.66a8,8,0,0,1,11.32-11.32Z"/>
            </svg>
            Tüm Kurslara Dön
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${course.color} text-white shadow-lg`}>
              {course.icon}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">{courseName}</h1>
          </div>

          <div className="space-y-6">
            {Object.entries(course.stages).map(([stageName, stage]) => (
              <div key={stageName} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleStage(stageName)}
                  className="w-full p-6 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
                >
                  <div className="text-left">
                    <h3 className="font-bold text-lg text-gray-700">{stageName}</h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span><strong className="font-medium text-gray-600">Süre:</strong> {stage.details['Süre']}</span>
                      <span><strong className="font-medium text-gray-600">Görev:</strong> {stage.details['Görev sayısı']}</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedStages[stageName] ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedStages[stageName] && (
                  <div className="border-t border-gray-200/80 animate-fade-in-down">
                    <div className="p-6 bg-gray-50/50">
                      <p className="text-sm text-gray-600 mb-4">
                        <strong className="font-semibold text-gray-700">Öğrenilecekler:</strong> {stage.details['Öğrenilecekler']}
                      </p>
                    </div>
                    
                    <ul className="p-6 space-y-4 bg-white">
                      {stage.resources.map((resource, resourceIndex) => {
                        const resourceId = generateResourceId(courseName, stageName, resourceIndex);
                        const isCompleted = completedResources[resourceId];
                        
                        return (
                          <li key={resourceId} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200/80 hover:border-gray-300 transition-all">
                            <button
                              onClick={() => toggleResource(resourceId)}
                              className="mt-1 flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-300" />
                              )}
                            </button>
                            <div className="flex-grow">
                              <h4 className={`font-semibold text-gray-800 ${isCompleted ? 'line-through text-gray-500' : ''}`}>{resource.name}</h4>
                              <p className={`text-sm text-gray-500 mt-1 ${isCompleted ? 'text-gray-400' : ''}`}>{resource.desc}</p>
                            </div>
                            <a href={resource.link} target="_blank" rel="noopener noreferrer" className="self-center ml-4 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderCourseList = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 animate-fade-in">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-4 tracking-tight">Kurslar</h1>
          <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">Kariyer hedeflerinize ulaşmak için tasarlanmış, kapsamlı ve etkileşimli öğrenme yollarını keşfedin.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(coursesData).map(([name, course]) => (
              <div
                key={name}
                onClick={() => setSelectedCourse(name)}
                className={`relative p-8 rounded-3xl overflow-hidden cursor-pointer group bg-gradient-to-r ${course.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="relative z-10">
                  <div className="mb-4">
                    {course.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">{name}</h2>
                  <p className="opacity-90 mb-6 text-gray-800">{course.description}</p>
                  <div className="inline-flex items-center gap-2 font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full group-hover:bg-white/30 transition-colors text-gray-900">
                    Başla
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.49a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse && coursesData[selectedCourse]) {
    return renderCourseDetails(selectedCourse, coursesData[selectedCourse]);
  }

  return renderCourseList();
}
