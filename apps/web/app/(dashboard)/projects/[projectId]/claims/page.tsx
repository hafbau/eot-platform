'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge } from '@eot/ui';
import { 
  ArrowLeft, 
  Gavel, 
  Plus,
  Brain,
  FileText,
  Clock,
  DollarSign,
  Calendar,
  ChevronRight,
  Mail,
  Camera,
  CloudRain,
  Users,
  FileCheck,
  Download,
  Send,
  Eye,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
  Edit,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { mockClaims, mockProjects, mockDelayAlerts, mockEvidenceTimeline, mockAIAnalysis } from '../../../../../lib/mock-data';
import { formatCurrency, formatDate } from '../../../../../lib/utils';

const ClaimsPage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;
  const [showClaimWizard, setShowClaimWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const project = mockProjects.find(p => p.id === projectId) || mockProjects[0];
  const claims = mockClaims.filter(c => c.projectId === projectId || projectId === '1');
  const delayAlert = mockDelayAlerts[0]; // For demo
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'photo': return Camera;
      case 'site_diary': return FileText;
      case 'drawing': return FileCheck;
      case 'rfi': return FileText;
      default: return FileText;
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
            <h1 className="text-3xl font-bold text-gray-900">Claims Management</h1>
            <p className="mt-2 text-gray-600">AI-assisted EOT claim preparation for {project.name}</p>
          </div>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowClaimWizard(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Claim
        </Button>
      </div>
      
      {/* Claims Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Claims</p>
              <p className="text-2xl font-bold text-gray-900">{claims.filter(c => c.status !== 'approved').length}</p>
            </div>
            <Gavel className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${(claims.reduce((sum, c) => sum + c.claimedAmount, 0) / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Processing</p>
              <p className="text-2xl font-bold text-gray-900">18 days</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedClaim(selectedClaim === claim.id ? null : claim.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                    <Badge className='' variant="secondary">{claim.claimNumber}</Badge>
                    <Badge variant="secondary" className={getStatusColor(claim.status)}>
                      {claim.status.replace('_', ' ')}
                    </Badge>
                    {claim.daysUntilDeadline > 0 && claim.daysUntilDeadline <= 7 && (
                      <Badge className='' variant="destructive">
                        <Clock className="h-3 w-3 mr-1" />
                        {claim.daysUntilDeadline} days left
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Delay Duration</p>
                      <p className="font-semibold text-gray-900">{claim.delayDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Claimed Amount</p>
                      <p className="font-semibold text-gray-900">${(claim.claimedAmount / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Submitted</p>
                      <p className="font-semibold text-gray-900">{formatDate(claim.submittedDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contract Clause</p>
                      <p className="font-semibold text-gray-900">{claim.contractClause}</p>
                    </div>
                  </div>
                </div>
                
                <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${selectedClaim === claim.id ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {/* Expanded Content */}
            {selectedClaim === claim.id && (
              <div className="border-t border-gray-200">
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Claim Details</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Package
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Evidence Packages</p>
                      <p className="font-semibold">{claim.evidencePackages} documents</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Pages</p>
                      <p className="font-semibold">{claim.totalPages} pages</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Internal Score</p>
                      <p className="font-semibold">{claim.internalScore}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Response Deadline</p>
                      <p className="font-semibold">{formatDate(claim.responseDeadline)}</p>
                    </div>
                  </div>
                  
                  {claim.engineerResponse && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Engineer Response:</p>
                      <p className="text-sm text-gray-600 mt-1">{claim.engineerResponse}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Claim Creation Wizard */}
      {showClaimWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Wizard Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create EOT Claim</h2>
                  <p className="text-sm text-gray-600 mt-1">AI-assisted claim preparation wizard</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowClaimWizard(false);
                    setWizardStep(1);
                  }}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Progress Steps */}
              <div className="mt-6 flex items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    wizardStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Select Delay</span>
                </div>
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div className={`h-0.5 ${wizardStep >= 2 ? 'bg-blue-600' : ''}`} style={{ width: wizardStep >= 2 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    wizardStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Review Evidence</span>
                </div>
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div className={`h-0.5 ${wizardStep >= 3 ? 'bg-blue-600' : ''}`} style={{ width: wizardStep >= 3 ? '100%' : '0%' }} />
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    wizardStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Generate Package</span>
                </div>
              </div>
            </div>
            
            {/* Wizard Content */}
            <div className="p-6">
              {/* Step 1: Select Delay */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Select Delay Event</h3>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <p className="text-sm text-purple-900">
                        AI has pre-selected the most claim-worthy delay based on evidence strength and contractual position
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{delayAlert.activityName}</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><span className="text-gray-600">Delay:</span> <span className="font-semibold">{delayAlert.delayDays} days</span></p>
                          <p><span className="text-gray-600">Cause:</span> <span className="font-semibold">{delayAlert.causationType}</span></p>
                          <p><span className="text-gray-600">Impact:</span> <span className="font-semibold">${(delayAlert.estimatedCostImpact / 1000000).toFixed(1)}M</span></p>
                          <p><span className="text-gray-600">Evidence:</span> <span className="font-semibold">{delayAlert.evidenceCount} items collected</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                        <p className="text-sm font-semibold text-gray-900 mt-2">{delayAlert.confidenceScore}% confidence</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
                    <p className="text-sm text-gray-700">{delayAlert.aiAnalysis}</p>
                  </div>
                </div>
              )}
              
              {/* Step 2: Review Evidence */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Evidence Timeline</h3>
                    <Button size="sm" variant="outline" onClick={() => setShowTimeline(!showTimeline)}>
                      {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                    </Button>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <p className="text-sm text-purple-900">
                        AI has organized {mockEvidenceTimeline.length} pieces of evidence chronologically and highlighted key items
                      </p>
                    </div>
                  </div>
                  
                  {/* Evidence Timeline */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {mockEvidenceTimeline.map((item, idx) => {
                      const Icon = getTimelineIcon(item.type);
                      return (
                        <div key={idx} className={`flex gap-4 p-3 rounded-lg ${item.tagged ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            item.tagged ? 'bg-blue-100' : 'bg-gray-200'
                          }`}>
                            <Icon className={`h-5 w-5 ${item.tagged ? 'text-blue-600' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.type === 'email' ? item.subject : 
                                   item.type === 'rfi' ? `${item.number}: ${item.title}` :
                                   item.type === 'drawing' ? `${item.number}: ${item.title}` :
                                   item.description || item.entry}
                                </p>
                                {item.preview && (
                                  <p className="text-sm text-gray-600 mt-1">{item.preview}</p>
                                )}
                                {item.from && (
                                  <p className="text-sm text-gray-500 mt-1">From: {item.from}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">{item.date}</p>
                                {item.tagged && (
                                  <Badge variant="secondary" className="mt-1 text-xs">Key Evidence</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Step 3: Generate Package */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Claim Package Generation</h3>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="animate-pulse">
                        <Brain className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">AI is generating your claim package...</p>
                        <p className="text-sm text-purple-700 mt-1">This typically takes 30-60 seconds</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Analyzing contractual position</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Organizing evidence chronologically</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Generating claim narrative</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="animate-spin">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">Creating time impact analysis...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Package Contents (Preview)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Cover Letter</span>
                        <span className="font-medium">2 pages</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Executive Summary</span>
                        <span className="font-medium">3 pages</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Detailed Narrative</span>
                        <span className="font-medium">12 pages</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Impact Analysis</span>
                        <span className="font-medium">8 pages</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Evidence Appendix</span>
                        <span className="font-medium">134 pages</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>Total</span>
                          <span>159 pages</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Wizard Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (wizardStep > 1) {
                    setWizardStep(wizardStep - 1);
                  } else {
                    setShowClaimWizard(false);
                    setWizardStep(1);
                  }
                }}
              >
                {wizardStep === 1 ? 'Cancel' : 'Back'}
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (wizardStep < 3) {
                    setWizardStep(wizardStep + 1);
                  } else {
                    // Final step - close wizard
                    setShowClaimWizard(false);
                    setWizardStep(1);
                  }
                }}
              >
                {wizardStep === 3 ? (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Claim
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsPage;