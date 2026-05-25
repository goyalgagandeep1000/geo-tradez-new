'use client';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Star, Clock, Users, CheckCircle2 } from 'lucide-react';
import { courses } from '@/lib/mockData';
import { useAppStore } from '@/store/appStore';

export default function CoursePlayerPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { isEnrolled, enrollCourse } = useAppStore();
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const enrolled = isEnrolled(course.id);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto">
      <Link href="/learn" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#374151] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Learn Hub
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#c8dae8] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="relative h-56 app-image-bg">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-4 text-sm text-[#6B7280] mb-4">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {course.rating}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
          </div>
          <p className="text-sm text-[#374151] leading-relaxed mb-6">
            Learn practical skills from {course.instructor} — structured lessons, exercises, and certificates to grow your global business.
          </p>
          {enrolled ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#4A7C24] font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" /> You are enrolled
              </div>
              <button className="inline-flex items-center gap-2 bg-[#4A7C24] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3A6B1A]">
                <Play className="w-4 h-4 fill-white" /> Resume Lesson 1
              </button>
            </div>
          ) : (
            <button
              onClick={() => enrollCourse(course.id)}
              className="inline-flex items-center gap-2 bg-[#4A7C24] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3A6B1A]"
            >
              Enroll Now — {course.price === 'Free' ? 'Free' : `$${course.price}`}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
