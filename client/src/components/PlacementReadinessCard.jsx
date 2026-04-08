import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { TrendingUp, Award, Target, CheckCircle } from 'lucide-react';



export function PlacementReadinessCard({
  cgpa,
  totalMockTests,
  avgMockScore,
  readinessScore
}) {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Student Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-500">Overall CGPA (Cumulative Grade Point Average)</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{cgpa.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-500">Mock Tests Taken</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalMockTests}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-gray-500">Avg Mock Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgMockScore.toFixed(1)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-medium text-gray-500">Placement Readiness</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">{readinessScore}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Placement Readiness Score</span>
            <span className="text-sm font-bold text-indigo-600">{readinessScore}%</span>
          </div>
          <Progress value={readinessScore} className="h-3" />
          <p className="text-xs text-gray-500 mt-2">
            {readinessScore >= 80 ? 'Excellent! Student is highly placement ready.' :
             readinessScore >= 60 ? 'Good progress. Keep improving.' :
             'Needs more preparation for placement.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
