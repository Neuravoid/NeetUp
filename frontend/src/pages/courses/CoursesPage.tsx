import { useState, useEffect } from 'react';
import { coursesService, type Course, type UserCourse } from '../../services/courses.service';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const [enrolled, recommended] = await Promise.all([
          coursesService.getUserCourses(),
          coursesService.getRecommendedCourses()
        ]);
        
        setUserCourses(enrolled);
        setRecommendedCourses(recommended);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kurslarım</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Devam eden ve tamamlanan kurslarınız
        </p>
      </div>
      
      {loading ? (
        <div className="card p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Kurslar yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          {/* User's Enrolled Courses */}
          {userCourses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kayıtlı Kurslarım</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {userCourses.map((userCourse) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
                      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                      case 'not_started': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
                    }
                  };

                  const getStatusText = (status: string) => {
                    switch (status) {
                      case 'completed': return 'Tamamlandı';
                      case 'in_progress': return 'Devam Ediyor';
                      case 'not_started': return 'Başlanmadı';
                      default: return 'Bilinmiyor';
                    }
                  };

                  return (
                    <div key={userCourse.id} className="card p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {userCourse.course.title}
                          </h3>
                          {userCourse.course.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {userCourse.course.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userCourse.status)}`}>
                              {getStatusText(userCourse.status)}
                            </span>
                            {userCourse.course.duration_hours && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {userCourse.course.duration_hours} saat
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-3">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${userCourse.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-right text-gray-500 dark:text-gray-400 mb-4">
                            %{userCourse.progress} Tamamlandı
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                          Kursa Devam Et
                        </button>
                        {userCourse.course.url && (
                          <a 
                            href={userCourse.course.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Dış Bağlantı
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommended Courses */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {userCourses.length > 0 ? 'Önerilen Kurslar' : 'Sizin İçin Önerilen Kurslar'}
            </h2>
            {recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedCourses.map((course) => (
                  <div key={course.id} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          {course.title}
                        </h3>
                        {course.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                            {course.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          {course.difficulty_level && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              course.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {course.difficulty_level === 'beginner' ? 'Başlangıç' :
                               course.difficulty_level === 'intermediate' ? 'Orta' : 'İleri'}
                            </span>
                          )}
                          {course.duration_hours && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {course.duration_hours} saat
                            </span>
                          )}
                        </div>
                        {course.provider && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Sağlayıcı: {course.provider}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors">
                        Kursa Kaydol
                      </button>
                      {course.url && (
                        <a 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Önizle
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6">
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Henüz önerilen kurs bulunmuyor</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Kariyer hedeflerinizi belirlemek için roadmap oluşturun.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/roadmap"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Roadmap Oluştur
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesPage;
