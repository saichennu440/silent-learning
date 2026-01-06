// CourseDetailPage.jsx
import React, { useState, useMemo } from 'react';
import { useApp } from './App'; // however you import your context hook
import { X, Award, Check } from 'lucide-react'; // or whatever icon imports you use

const CourseDetailPage = ({ course }) => {
  const { openEnquiry, navigateTo } = useApp(); // if navigateTo in context, else use navigateTo
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
          <button onClick={() => {
        navigateTo('courses');
        window.history.pushState({}, '', '/courses');
      }}
       className="mt-4 text-blue-600">Back to courses</button>
        </div>
      </div>
    );
  }

  const current = durations[selectedIdx] || { label: course.duration || '', priceText: course.priceText || '' };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img src={course.image} alt={course.title} className="w-full h-64 object-cover" />
          <button
            onClick={() => {navigateTo('courses');
        window.history.pushState({}, '', '/courses');}}
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

          <div className="flex flex-wrap gap-2 mb-4 text-sm text-gray-500 items-center">
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

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Curriculum</h3>
            <div className="space-y-4">
              {course.curriculum.map((module, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{module.title}</h4>
                  <ul className="space-y-1">
                    {module.topics.map((topic, idx) => (
                      <li key={idx} className="text-gray-800 flex items-start">
                        <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-1" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Projects & Capstone</h3>
            <ul className="space-y-2">
              {course.projects.map((project, index) => (
                <li key={index} className="flex items-start text-gray-800">
                  <Check className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                  {project}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Tools & Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {course.tools.map((tool, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-gray-900">Career Outcomes</h3>
            <ul className="space-y-2">
              {course.outcomes.map((outcome, index) => (
                <li key={index} className="flex items-start text-gray-800">
                  <Award className="w-5 h-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button onClick={() => openEnquiry(course)} className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700">
              Apply Now
            </button>
            <button onClick={() => openEnquiry(course)} className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg">
              Contact Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
