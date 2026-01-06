// CourseDetailPage.jsx
import React, { useState, useMemo } from 'react';
import { useApp } from './App'; // adjust path if needed
import { X, Award, Check } from 'lucide-react';

const CourseDetailPage = ({ course }) => {
  const { openEnquiry, navigateTo } = useApp();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const durations = useMemo(() => {
    if (!course) return [];
    if (Array.isArray(course.durations) && course.durations.length > 0) {
      return course.durations.map((d) =>
        typeof d === 'string' ? { label: d, priceText: course.priceText || '' } : { label: d.label || '', priceText: d.priceText || '' }
      );
    }
    return [{ label: course.duration || '', priceText: course.priceText || '' }];
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Course not found</h3>
          <button
            onClick={() => {
              if (navigateTo) navigateTo('courses');
              window.history.pushState({}, '', '/courses');
            }}
            className="mt-4 text-blue-600"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const current = durations[selectedIdx] || { label: course.duration || '', priceText: course.priceText || '' };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Grid: left = main content, right = sidebar (sticky) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Main content (span 2 on large screens) */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative">
              <img src={course.image} alt={course.title} className="w-full h-64 object-cover rounded-t-xl" />
              <button
                onClick={() => {
                  if (navigateTo) navigateTo('courses');
                  window.history.pushState({}, '', '/courses');
                }}
                className="absolute top-4 left-4 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                aria-label="Back"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">{course.category}</span>
              </div>

              <h2 className="text-3xl font-bold mb-4 text-blue-900">{course.title}</h2>

              <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-500 items-center">
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-1" /> {course.level}
                </span>
                <span>•</span>

                {durations.length > 1 ? (
                  <div className="flex items-center gap-2">
                    <select
                      aria-label="Select duration"
                      value={selectedIdx}
                      onChange={(e) => setSelectedIdx(Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      {durations.map((d, idx) => (
                        <option key={idx} value={idx}>
                          {d.label || `Option ${idx + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span>{current.label || '—'}</span>
                )}

                <span>•</span>
                <span className="text-xl font-semibold text-blue-600">₹{current.priceText || '—'}</span>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Overview</h3>
                <p className="text-gray-800 leading-relaxed">{course.fullDescription}</p>
              </div>

              {/* Curriculum */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Curriculum</h3>

                {/* Make modules flow nicely. Each module stays a block; within topics we use columns on md+ */}
                <div className="space-y-6">
                  {Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
                    course.curriculum.map((module, index) => (
                      <div key={index} className="border-l-4 border-blue-600 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>

                        {/* topics split into two columns on md+ to reduce vertical length */}
                        <ul className="text-gray-800 list-none columns-1 md:columns-2 gap-4">
                          {Array.isArray(module.topics) && module.topics.length > 0 ? (
                            module.topics.map((topic, idx) => (
                              <li key={idx} className="mb-2 break-inside-avoid">
                                <div className="flex items-start">
                                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
                                  <span>{topic}</span>
                                </div>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-600">No topics listed</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Curriculum details not available.</p>
                  )}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Projects & Capstone</h3>
                {Array.isArray(course.projects) && course.projects.length > 0 ? (
                  <ul className="space-y-2">
                    {course.projects.map((project, index) => (
                      <li key={index} className="flex items-start text-gray-800">
                        <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No projects listed.</p>
                )}
              </div>

              {/* Tools */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Tools & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(course.tools) && course.tools.length > 0 ? (
                    course.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600">No tools listed.</span>
                  )}
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Career Outcomes</h3>
                {Array.isArray(course.outcomes) && course.outcomes.length > 0 ? (
                  <ul className="space-y-2">
                    {course.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start text-gray-800">
                        <Award className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No outcomes listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar (summary) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-xl shadow p-6 border">
                <div className="text-sm text-gray-500 mb-2">Duration</div>
                <div className="text-lg font-semibold mb-3">{current.label || '—'}</div>

                <div className="text-sm text-gray-500">Price</div>
                <div className="text-2xl font-bold text-blue-600 mb-4">₹{current.priceText || '—'}</div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Level</div>
                    <div className="font-medium">{course.level || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className={`text-sm font-semibold ${course.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                      {course.status || (course.is_active ? 'Active' : 'Inactive')}
                    </div>
                  </div>
                </div>

                {/* Brochure link (if present) */}
                {course.brochure_url && (
                  <a
                    href={course.brochure_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-blue-600 underline mb-4"
                  >
                    Download Brochure
                  </a>
                )}

                <button
                  onClick={() => openEnquiry(course)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Apply Now
                </button>

                <button
                  onClick={() => openEnquiry(course)}
                  className="w-full mt-3 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50"
                >
                  Contact Advisor
                </button>
              </div>

              {/* small card with short description or highlights */}
              <div className="bg-white rounded-xl shadow p-4 border">
                <h4 className="font-semibold text-gray-900 mb-2">Quick Highlights</h4>
                <p className="text-sm text-gray-700">{course.shortDescription || course.subtitle || '—'}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
