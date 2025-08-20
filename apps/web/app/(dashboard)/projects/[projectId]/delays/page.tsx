'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge } from '@eot/ui';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Brain, 
  Clock, 
  FileText,
  Mail,
  Camera,
  ChevronRight,
  CheckCircle,
  XCircle,
  Info,
  Activity,
  CloudRain,
  Construction,
  Zap,
  Users
} from 'lucide-react';
import { mockDelayAlerts, mockProjects, mockAIAnalysis } from '../../../../../lib/mock-data';
import { formatNumber } from '../../../../../lib/utils';

const DelaysPage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [selectedDelay, setSelectedDelay] = useState<string | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  
  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0];
  const delays = mockDelayAlerts.filter(d => d.projectId === projectId || projectId === '1');
  
  const getCauseIcon = (causeType: string) => {
    switch (causeType) {
      case 'Client Change': return Users;
      case 'Weather': return CloudRain;
      case 'Unforeseen Conditions': return Construction;
      default: return AlertTriangle;
    }
  };
  
  const getCauseBadgeColor = (causeType: string) => {
    switch (causeType) {
      case 'Client Change': return 'bg-purple-100 text-purple-700';
      case 'Weather': return 'bg-blue-100 text-blue-700';
      case 'Unforeseen Conditions': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/projects/${projectId}/dashboard`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delay Detection & Analysis</h1>
            <p className="mt-2 text-gray-600">AI-powered delay monitoring for {project.name}</p>
          </div>
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Delay Intelligence Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Total Delays Detected</p>
                <p className="text-2xl font-bold text-gray-900">{delays.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Path Impact</p>
                <p className="text-2xl font-bold text-red-600">
                  {delays.filter(d => d.criticalPath).length} delays
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Potential Claim Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(delays.reduce((sum, d) => sum + d.estimatedCostImpact, 0) / 1000000)}M
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              <strong>Latest Analysis:</strong> AI has identified {delays.filter(d => d.status === 'pending_review').length} new delays 
              requiring immediate attention. The system has automatically collected evidence from emails, 
              site reports, and schedule updates to support potential claims.
            </p>
          </div>
        </div>
      </div>

      {/* Delay Alerts */}
      <div className="space-y-4">
        {delays.map((delay) => {
          const CauseIcon = getCauseIcon(delay.causationType);
          const isSelected = selectedDelay === delay.id;
          
          return (
            <div key={delay.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {/* Delay Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedDelay(isSelected ? null : delay.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDelay(isSelected ? null : delay.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isSelected}
                aria-controls={`delay-details-${delay.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{delay.activityName}</h3>
                      <Badge variant="secondary" className={getCauseBadgeColor(delay.causationType)}>
                        <CauseIcon className="h-3 w-3 mr-1" />
                        {delay.causationType}
                      </Badge>
                      {delay.criticalPath && (
                        <Badge variant="destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical Path
                        </Badge>
                      )}
                      {delay.status === 'pending_review' && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending Review
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Delay Duration</p>
                        <p className="font-semibold text-gray-900">{delay.delayDays} days</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost Impact</p>
                        <p className="font-semibold text-gray-900">${formatNumber(delay.estimatedCostImpact / 1000000)}M</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                delay.confidenceScore >= 80 ? 'bg-green-600' : 
                                delay.confidenceScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${delay.confidenceScore}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">{delay.confidenceScore}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Evidence Found</p>
                        <p className="font-semibold text-gray-900">{delay.evidenceCount} items</p>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              </div>
              
              {/* Expanded Content */}
              {isSelected && (
                <div className="border-t border-gray-200">
                  {/* AI Analysis */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">AI Analysis</h4>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{delay.aiAnalysis}</p>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {delay.recommendedAction}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowAIAnalysis(true)}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        View Detailed Analysis
                      </Button>
                    </div>
                  </div>
                  
                  {/* Evidence Summary */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Evidence Collected</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{delay.keyEvidence.emails}</p>
                        <p className="text-sm text-gray-600">Emails</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{delay.keyEvidence.rfis}</p>
                        <p className="text-sm text-gray-600">RFIs</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{delay.keyEvidence.sitePhotos}</p>
                        <p className="text-sm text-gray-600">Site Photos</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{delay.keyEvidence.drawings}</p>
                        <p className="text-sm text-gray-600">Drawings</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href={`/projects/${projectId}/claims`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Zap className="mr-2 h-4 w-4" />
                          Prepare EOT Claim
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        View Evidence Timeline
                      </Button>
                      <Button variant="outline">
                        <XCircle className="mr-2 h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* AI Detailed Analysis Modal */}
      {showAIAnalysis && selectedDelay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Detailed AI Analysis</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAIAnalysis(false)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Delay Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Delay Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Primary Cause</p>
                      <p className="font-semibold">{mockAIAnalysis.delayAnalysis.primaryCause}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Confidence Score</p>
                      <p className="font-semibold">{mockAIAnalysis.delayAnalysis.confidenceScore}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Schedule Impact</p>
                      <p className="font-semibold">{mockAIAnalysis.delayAnalysis.impactAssessment.scheduleDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost Impact</p>
                      <p className="font-semibold">${formatNumber(mockAIAnalysis.delayAnalysis.impactAssessment.costImpact / 1000000)}M</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Supporting Evidence */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Supporting Evidence</h3>
                <ul className="space-y-2">
                  {mockAIAnalysis.delayAnalysis.supportingEvidence.map((evidence, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{evidence}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Contractual Position */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contractual Position</h3>
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Applicable Clauses</span>
                    <div className="flex gap-2">
                      {mockAIAnalysis.delayAnalysis.contractualPosition.applicableClauses.map(clause => (
                        <Badge key={clause} variant="secondary">{clause}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notice Deadline</span>
                    <span className="font-semibold text-gray-900">{mockAIAnalysis.delayAnalysis.contractualPosition.noticeDeadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Claim Strength</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {mockAIAnalysis.delayAnalysis.contractualPosition.strengthOfClaim}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">AI Recommendations</h3>
                <div className="space-y-2">
                  {mockAIAnalysis.delayAnalysis.contractualPosition.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                        <Activity className="h-3 w-3 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Generated Narrative Preview */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Generated Claim Narrative (Preview)</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {mockAIAnalysis.generatedNarrative.substring(0, 300)}...
                  </p>
                  <Button size="sm" variant="outline" className="mt-3">
                    View Full Narrative
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAIAnalysis(false)}>
                Close
              </Button>
              <Link href={`/projects/${projectId}/claims`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Proceed to Claim Preparation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DelaysPage;