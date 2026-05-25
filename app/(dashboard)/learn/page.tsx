'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Star, Users, Clock, ChevronRight, TrendingUp, BookOpen } from 'lucide-react';
import { courses as mockCourses } from '@/lib/mockData';
import { api } from '@/lib/api-client';
import type { Course } from '@/types';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

const categories = ['All', 'Business', 'Marketing', 'AI Tools', 'Design', 'Finance', 'Freelancing'];

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-blue-100 text-blue-700',
  Advanced: 'bg-purple-100 text-purple-700',
};

export default function LearnPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [courseList, setCourseList] = useState<Course[]>(mockCourses);
  const { enrollCourse, isEnrolled, getCourseProgress } = useAppStore();

  useEffect(() => {
    fetch('/api/courses', { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCourseList(json.data);
      })
      .catch(() => setCourseList(mockCourses));
  }, []);

  const featured = courseList[0];
  const filtered = activeCategory === 'All' ? courseList : courseList.filter((c) => c.category === activeCategory);
  const enrolledList = courseList
    .filter((c) => isEnrolled(c.id))
    .map((c) => ({ ...c, progress: getCourseProgress(c.id) ?? c.progress }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1F2E] flex items-center gap-2">
          Learn Hub <span className="text-[#4A7C24]">✦</span>
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">Master the skills to grow your global business</p>
      </div>

      {/* Featured Course Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        style={{ minHeight: 200 }}
      >
        <img src={featured.thumbnail} alt={featured.title} className="w-full h-52 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A3A08]/90 via-[#2D5016]/70 to-transparent" />
        <div className="absolute inset-0 p-8 flex items-center">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3" /> Featured Course
            </span>
            <h2 className="text-2xl font-bold text-white mb-2">{featured.title}</h2>
            <div className="flex items-center gap-4 text-sm text-white/80 mb-5">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {featured.rating}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {featured.students} students</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featured.duration}</span>
            </div>
            <Link
              href={`/learn/${featured.id}`}
              className="inline-flex items-center gap-2 bg-[#4A7C24] hover:bg-[#3A6B1A] text-white font-semibold px-5 py-2.5 rounded-xl shadow-[0_2px_8px_rgba(74,124,36,0.4)] transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Continue Learning
            </Link>
          </div>
          {featured.progress !== undefined && (
            <div className="ml-auto hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 w-48">
                <p className="text-xs text-white/70 mb-1">Your Progress</p>
                <p className="text-2xl font-bold text-white mb-2">{featured.progress}%</p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${featured.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">Keep going!</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scroll-hide pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0',
              activeCategory === cat
                ? 'bg-[#3A6B1A] text-white shadow-sm'
                : 'bg-white border border-[#c8dae8] text-[#374151] hover:border-[#4A7C24] hover:text-[#4A7C24]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Enrolled Courses */}
      {activeCategory === 'All' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1A1F2E] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#4A7C24]" /> Continue Learning
            </h2>
            <button className="text-sm text-[#4A7C24] font-medium flex items-center gap-1 hover:text-[#3A6B1A]">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {enrolledList.map((course, i) => (
              <Link key={course.id} href={`/learn/${course.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                className="group bg-white rounded-2xl border border-[#c8dae8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className={cn('absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm', difficultyColors[course.difficulty])}>
                    {course.difficulty}
                  </span>
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-[#4A7C24] fill-[#4A7C24] ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="p-4">
                  <span className={cn('text-xs font-medium px-1.5 py-0.5 rounded-md', 'bg-blue-100 text-blue-700')}>
                    {course.category}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold text-[#1A1F2E] line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <img src={course.instructorAvatar} alt={course.instructor} className="w-5 h-5 rounded-full app-image-bg" />
                    <span className="text-xs text-[#6B7280]">{course.instructor}</span>
                  </div>
                  {course.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#9CA3AF]">Progress</span>
                        <span className="text-xs font-semibold text-[#4A7C24]">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="h-full bg-[#4A7C24] rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All / Filtered Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1A1F2E]">
            {activeCategory === 'All' ? 'All Courses' : activeCategory}
          </h2>
          <span className="text-sm text-[#9CA3AF]">{filtered.length} courses</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((course, i) => {
            const enrolled = isEnrolled(course.id);
            return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="group bg-white rounded-2xl border border-[#c8dae8] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer"
            >
              <div className="relative h-36 overflow-hidden app-image-bg">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className={cn('absolute top-2 left-2 text-xs font-medium px-1.5 py-0.5 rounded-md', difficultyColors[course.difficulty])}>
                  {course.difficulty}
                </span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 text-[#4A7C24] fill-[#4A7C24] ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3.5">
                <span className="text-xs font-medium px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                  {course.category}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-[#1A1F2E] line-clamp-2 leading-snug">{course.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <img src={course.instructorAvatar} alt={course.instructor} className="w-5 h-5 rounded-full app-image-bg" />
                  <span className="text-xs text-[#6B7280] truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#9CA3AF]">
                  <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {course.rating}</span>
                  <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {course.students}</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {course.duration}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={cn('text-base font-bold', course.price === 'Free' ? 'text-green-600' : 'text-[#1A1F2E]')}>
                    {course.price === 'Free' ? 'Free' : `$${course.price}`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (enrolled) window.location.href = `/learn/${course.id}`;
                      else enrollCourse(course.id);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      enrolled
                        ? 'bg-[#F0F7E8] text-[#4A7C24] hover:bg-[#E8F5D8]'
                        : 'bg-[#4A7C24] text-white hover:bg-[#3A6B1A]'
                    )}
                  >
                    {enrolled ? 'Continue' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          );})}
        </div>
      </div>
    </div>
  );
}
