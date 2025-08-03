import React, { useState, useEffect, useCallback } from 'react';
import { Plus, BookCopy, Trash2, X, ChevronDown, Check, Coffee } from 'lucide-react';
import weeklyPlanService, { WeeklyTask, WeeklyTaskCreate, WeeklyTaskUpdate } from '../services/weeklyPlanService';
import { ROADMAP_TEMPLATES } from '../services/roadmap.service';

const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// --- ANA UYGULAMA BİLEŞENİ ---
export default function WeeklyPlanPage() {
  const [tasks, setTasks] = useState<Record<string, WeeklyTask[]>>({});
  const [roadmapsData, setRoadmapsData] = useState<Array<{ career_path_name: string; stages: any[] }>>([]);
  const [modalInfo, setModalInfo] = useState<{ isOpen: boolean; task: any | null }>({ isOpen: false, task: null });
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await weeklyPlanService.getTasks();
      const tasksByDay = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [] }), {} as Record<string, WeeklyTask[]>);
      fetchedTasks.forEach(task => {
        if (tasksByDay[task.day]) {
          tasksByDay[task.day].push(task);
        }
      });
      setTasks(tasksByDay);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }, []);

    useEffect(() => {
    fetchTasks();
    // Convert ROADMAP_TEMPLATES object to an array for easier rendering
    const roadmapArray = Object.entries(ROADMAP_TEMPLATES).map(([key, value]) => ({
      career_path_name: key,
      stages: value
    }));
    setRoadmapsData(roadmapArray);
  }, [fetchTasks]);

  const getCategoryColor = (category: string, type = 'bg') => {
    const colors: Record<string, Record<string, string>> = {
      'UX TASARIMI': { 
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50', 
        text: 'text-purple-700', 
        border: 'border-purple-200', 
        accent: 'bg-purple-500' 
      },
      'BACKEND GELİŞTİRME': { 
        bg: 'bg-gradient-to-r from-blue-50 to-indigo-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200', 
        accent: 'bg-blue-500' 
      },
      'VERİ ANALİZİ': { 
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50', 
        text: 'text-green-700', 
        border: 'border-green-200', 
        accent: 'bg-green-500' 
      },
      'PROJE YÖNETİMİ': { 
        bg: 'bg-gradient-to-r from-orange-50 to-amber-50', 
        text: 'text-orange-700', 
        border: 'border-orange-200', 
        accent: 'bg-orange-500' 
      },
      'Özel Görev': { 
        bg: 'bg-gradient-to-r from-violet-50 to-purple-50', 
        text: 'text-violet-700', 
        border: 'border-violet-200', 
        accent: 'bg-violet-500' 
      },
    };
    return colors[category] ? colors[category][type] : (type === 'bg' ? 'bg-gray-50' : 'text-gray-600');
  };

  const handleAddTask = async (day: string, task: { text: string; category: string; }) => {
    try {
      const newTaskData: WeeklyTaskCreate = { ...task, day };
      const createdTask = await weeklyPlanService.createTask(newTaskData);
      setTasks(prevTasks => ({
        ...prevTasks,
        [day]: [...(prevTasks[day] || []), createdTask],
      }));
      closeModal();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await weeklyPlanService.deleteTask(taskId);
      fetchTasks(); // Re-fetch tasks
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggleTask = async (task: WeeklyTask) => {
    try {
      const updatedTask: WeeklyTaskUpdate = { completed: !task.completed };
      await weeklyPlanService.updateTask(task.id, updatedTask);
      fetchTasks(); // Re-fetch tasks
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const openModal = (task: any | null = null) => setModalInfo({ isOpen: true, task });
  const closeModal = () => setModalInfo({ isOpen: false, task: null });
  const toggleCategory = (category: string) => setOpenCategory(prev => (prev === category ? null : category));

  const AddTaskModal = () => {
    if (!modalInfo.isOpen) return null;
    const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
    const [customTaskText, setCustomTaskText] = useState('');
    const isCustomTask = !modalInfo.task;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isCustomTask) {
        if (customTaskText.trim()) handleAddTask(selectedDay, { text: customTaskText, category: 'Özel Görev' });
      } else {
        handleAddTask(selectedDay, modalInfo.task);
      }
    };

    return (
      <div className="absolute inset-0 flex justify-center items-start pt-20 z-50 p-4">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{isCustomTask ? "Yeni Görev Oluştur" : "Görevi Plana Ekle"}</h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-all">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Görev:</label>
              {isCustomTask ? (
                <input 
                  type="text" 
                  value={customTaskText} 
                  onChange={(e) => setCustomTaskText(e.target.value)} 
                  placeholder="Örn: Proje sunumunu hazırla" 
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  autoFocus 
                />
              ) : (
                <div className={`p-4 rounded-xl border ${getCategoryColor(modalInfo.task.category, 'bg')} ${getCategoryColor(modalInfo.task.category, 'border')}`}>
                  <p className={`font-medium ${getCategoryColor(modalInfo.task.category, 'text')}`}>{modalInfo.task.text}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Hangi Gün?</label>
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)} 
                className="w-full p-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={closeModal} 
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
              >
                İptal
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Plana Ekle
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-gray-900 p-4 sm:p-6">
      <div className="max-w-screen-2xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800">Haftalık Planım</h1>
            <p className="text-slate-500 mt-1 text-lg">Yeni hedeflere ulaşmak için harika bir hafta!</p>
          </div>
          <button onClick={() => openModal()} className="mt-4 sm:mt-0 flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:scale-105">
            <Plus size={20} />
            Özel Görev Ekle
          </button>
        </header>

        {/* Weekly Task Board */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
            {daysOfWeek.map(day => (
                <div key={day} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 w-80 flex-shrink-0 hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-gray-800">{day}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200">
                                {tasks[day]?.length || 0} görev
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3 h-full">
                        {tasks[day] && tasks[day].length > 0 ? tasks[day].map((task, index) => (
                            <div key={task.id || `task-${day}-${index}`} className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                                task.completed 
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 shadow-sm' 
                                    : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md'
                            }`}>
                                {/* Category accent bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${getCategoryColor(task.category, 'accent')}`}></div>
                                
                                <div className="p-4 pl-5">
                                    <div className="flex items-start gap-3">
                                        <button 
                                            onClick={() => handleToggleTask(task)} 
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center mt-0.5 ${
                                                task.completed 
                                                    ? 'bg-green-500 border-green-500 text-white scale-110' 
                                                    : 'border-gray-300 hover:border-green-400 hover:bg-green-50 hover:scale-105'
                                            }`}
                                        >
                                            {task.completed && <Check size={14} strokeWidth={3} />}
                                        </button>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium leading-relaxed break-words transition-all duration-200 ${
                                                task.completed 
                                                    ? 'line-through text-gray-500' 
                                                    : 'text-gray-800'
                                            }`}>
                                                {task.text || 'Görev metni yok'}
                                            </p>
                                            
                                            {task.category && (
                                                <div className={`mt-3 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                                                    getCategoryColor(task.category, 'bg')
                                                } ${
                                                    getCategoryColor(task.category, 'text')
                                                } ${
                                                    getCategoryColor(task.category, 'border')
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full mr-2 ${getCategoryColor(task.category, 'accent')}`}></div>
                                                    {task.category}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDeleteTask(task.id)} 
                                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            title="Görevi sil"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                                <Coffee size={32} className="mb-2 opacity-50"/>
                                <p className="text-sm font-medium">Henüz görev yok</p>
                                <p className="text-xs text-gray-400 mt-1">Aşağıdan görev ekleyebilirsin</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Task Pool */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3"><BookCopy /> Görev Havuzu</h2>
            <div className="space-y-4">
                                {roadmapsData.map((roadmap: { career_path_name: string; stages: any[] }) => (
                    <div key={roadmap.career_path_name} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <button onClick={() => toggleCategory(roadmap.career_path_name)} className={`w-full flex justify-between items-center p-5 font-bold text-xl ${getCategoryColor(roadmap.career_path_name, 'bg')} ${getCategoryColor(roadmap.career_path_name, 'text')}`}>
                            <span>{roadmap.career_path_name}</span>
                            <ChevronDown className={`transition-transform duration-300 ${openCategory === roadmap.career_path_name ? 'rotate-180' : ''}`} />
                        </button>
                        {openCategory === roadmap.career_path_name && (
                            <div className="p-5 space-y-3">
                                                                {roadmap.stages.map((stage: any, index: number) => (
                                    <div key={`${roadmap.career_path_name}-stage-${index}`} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-lg">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="font-semibold text-slate-800">{stage.title}</p>
                                            <p className="text-sm text-slate-600">{stage.description}</p>
                                        </div>
                                        <button onClick={() => openModal({ text: stage.description, category: roadmap.career_path_name })} className="ml-auto sm:ml-4 flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
                                            Plana Ekle
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
      <AddTaskModal />
    </div>
  );
}
