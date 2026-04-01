import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card } from './ui/card';

import { CIAMarksTable } from './CIAMarksTable';
import { MockTestTable } from './MockTestTable';
import { BookOpen, TrendingUp, Target } from 'lucide-react';



export function SemesterAccordion({ semesters }) {
  if (semesters.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No academic records available yet.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {semesters.map((semester) => (
        <AccordionItem 
          key={semester.semesterNumber} 
          value={`semester-${semester.semesterNumber}`}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">
                    {semester.semesterNumber}
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Semester {semester.semesterNumber}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      SGPA: <span className="font-medium text-gray-700">{semester.sgpa}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      Avg CIA: <span className="font-medium text-gray-700">{semester.avgCIA.toFixed(1)}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      Avg Mock: <span className="font-medium text-gray-700">{semester.avgMockTest.toFixed(1)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-6 pb-6 pt-2">
            {/* Semester Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-indigo-700 font-medium">SGPA</p>
                    <p className="text-2xl font-bold text-indigo-900">{semester.sgpa}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-medium">Avg CIA Score</p>
                    <p className="text-2xl font-bold text-blue-900">{semester.avgCIA.toFixed(1)}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-700 font-medium">Avg Mock Test</p>
                    <p className="text-2xl font-bold text-purple-900">{semester.avgMockTest.toFixed(1)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CIA Marks Section */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                CIA Marks
              </h4>
              <CIAMarksTable ciaMarks={semester.ciaMarks} />
            </div>

            {/* Mock Test Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Mock Tests
              </h4>
              <MockTestTable mockTests={semester.mockTests} />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
