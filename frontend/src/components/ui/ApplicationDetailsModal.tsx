'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ApplicationDetailsModalProps {
  applicationId: number;
  open: boolean;
  onClose: () => void;
}

interface ApplicationDetails {  
  id: number;
  userId: number;
  projectId: number;
  message: string;
  experience: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    introduction?: string;
    githubUrl?: string;
    skillTags?: string[];
  };
}

export function ApplicationDetailsModal({ 
  applicationId, 
  open, 
  onClose
}: ApplicationDetailsModalProps) {
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationDetails = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://devmatch-production-cf16.up.railway.app';
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiUrl}/api/applications/${applicationId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setApplication(result.data);
      
    } catch (err) {
      console.error('지원서 상세정보 조회 실패:', err);
      setError('지원서 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetails();
    }
  }, [open, applicationId, fetchApplicationDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return '승인됨';
      case 'REJECTED': return '거절됨';
      case 'PENDING': return '검토중';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-300 shadow-xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold">지원서 상세 정보</DialogTitle>
          <DialogDescription>
            지원자의 상세 정보와 지원 내용을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">지원서 정보를 불러오는 중...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : application ? (
          <div className="space-y-6 py-4">
            {/* 지원 상태 */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">지원 상태</h3>
              <Badge className={`px-3 py-1 ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </Badge>
            </div>

            {/* 지원자 정보 */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-700">👤 지원자 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">이름</p>
                    <p className="font-medium">{application.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">사용자명</p>
                    <p className="font-medium">{application.user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">이메일</p>
                    <p className="font-medium">{application.user.email}</p>
                  </div>
                  {application.user.githubUrl && (
                    <div>
                      <p className="text-sm text-gray-600">GitHub</p>
                      <a 
                        href={application.user.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 underline"
                      >
                        {application.user.githubUrl}
                      </a>
                    </div>
                  )}
                </div>
                
                {application.user.introduction && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">자기소개</p>
                    <p className="mt-1 text-gray-800 leading-relaxed">{application.user.introduction}</p>
                  </div>
                )}

                {application.user.skillTags && application.user.skillTags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">보유 기술</p>
                    <div className="flex flex-wrap gap-2">
                      {application.user.skillTags.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 지원 메시지 */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-green-700">💬 지원 메시지</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{application.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* 개발 경험 */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-purple-700">🔧 개발 경험</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{application.experience}</p>
                </div>
              </CardContent>
            </Card>

            {/* 지원 일시 */}
            <div className="text-sm text-gray-600 text-center border-t pt-4">
              지원일시: {new Date(application.createdAt).toLocaleString('ko-KR')}
            </div>

            {/* 닫기 버튼 */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700">
                닫기
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}