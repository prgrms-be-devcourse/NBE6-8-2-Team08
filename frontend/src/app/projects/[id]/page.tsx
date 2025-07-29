"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Github, 
  ExternalLink, 
  MessageCircle,
  Heart,
  Share2,
  Zap,
  Code,
  Database,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProject, ProjectDetailResponse, applyToProject } from '@/lib/api/project';
import { ProjectApplyRequest } from '@/types';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Developer {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  skills: string[];
}

interface ProjectDetail extends ProjectDetailResponse {
  featured?: boolean;
  urgency?: 'low' | 'medium' | 'high';
  applications?: number;
  matchedDevelopers?: Developer[];
}

const ProjectDetailPage: React.FC = () => {
  const params = useParams();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [techScores, setTechScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchProject = async () => {
      if (!params.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const projectId = Number(params.id);
        const projectData = await getProject(projectId);
        
        // 기존 데이터에 새로운 필드 추가
        const enhancedProject: ProjectDetail = {
          ...projectData,
          featured: true,
          urgency: 'high',
          applications: 47,
          matchedDevelopers: [
            {
              id: "dev-1",
              name: "Sarah Chen",
              avatar: "/api/placeholder/50/50",
              role: "Full-Stack Developer",
              rating: 4.9,
              skills: ["React Native", "Node.js", "AI/ML"]
            },
            {
              id: "dev-2",
              name: "Marcus Rodriguez",
              avatar: "/api/placeholder/50/50",
              role: "Mobile Developer",
              rating: 4.7,
              skills: ["Flutter", "Firebase", "UI/UX"]
            },
            {
              id: "dev-3",
              name: "Alex Kim",
              avatar: "/api/placeholder/50/50",
              role: "Backend Developer",
              rating: 4.8,
              skills: ["Node.js", "MongoDB", "AWS"]
            }
          ]
        };
        
        setProject(enhancedProject);
        
        // 기술 스택별 점수 초기화
        const initialScores: Record<string, number> = {};
        projectData.techStacks.forEach(tech => {
          initialScores[tech] = 5; // 기본 점수 5
        });
        setTechScores(initialScores);
      } catch (err) {
        console.error('프로젝트 조회 실패:', err);
        setError('프로젝트 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const handleApply = async () => {
    if (!project || !user) return;
    
    try {
      // 기술 스택별 점수를 배열로 변환
      const techStacks = Object.keys(techScores);
      const techScores_array = Object.values(techScores);
      
      // 프로젝트 지원 요청 데이터
      const applicationData: ProjectApplyRequest = {
        userId: user.id,
        techStacks,
        techScores: techScores_array
      };
      
      // 프로젝트 지원 API 호출
      await applyToProject(project.id, applicationData);
      
      // 지원 상태 업데이트
      setHasApplied(true);
      
      alert('프로젝트에 성공적으로 지원했습니다!');
    } catch (err) {
      console.error('지원서 제출 실패:', err);
      alert('지원서 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleTechScoreChange = (tech: string, score: number) => {
    setTechScores(prev => ({
      ...prev,
      [tech]: score
    }));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECRUITING': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'RECRUITING': return '모집중';
      case 'IN_PROGRESS': return '진행중';
      case 'COMPLETED': return '완료';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <div className="text-red-500 text-4xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-black mb-4 text-red-600">
            {error ? '프로젝트 로드 실패' : '프로젝트를 찾을 수 없습니다'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || '잘못된 프로젝트 ID이거나 삭제된 프로젝트입니다.'}
          </p>
          <Button asChild variant="destructive">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button 
            variant="outline" 
            asChild
            className="mb-4"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <div className="flex flex-wrap gap-3 mb-4">
                  {project.featured && (
                    <Badge className="bg-yellow-400 text-black">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(project.status)} text-white`}>
                    {getStatusText(project.status).toUpperCase()}
                  </Badge>
                  <Badge className={`${getUrgencyColor(project.urgency || 'medium')} text-white`}>
                    <Zap className="w-3 h-3 mr-1" />
                    {(project.urgency || 'medium').toUpperCase()} PRIORITY
                  </Badge>
                </div>

                <h1 className="text-4xl font-black mb-4 text-foreground">
                  {project.title}
                </h1>

                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-bold">{project.budget || '미정'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{project.teamSize}명 팀</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{project.location || '원격'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>생성일: {new Date(project.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className={`flex-1 font-black text-lg py-6 ${
                      hasApplied 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                    onClick={handleApply}
                    disabled={hasApplied || !user}
                  >
                    {hasApplied ? 'Applied ✓' : user ? 'Apply Now' : 'Login to Apply'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-6"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-6"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-black mb-4 text-foreground">Project Description</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {project.description}
                </p>
                
                {project.content && (
                  <>
                    <Separator className="my-6" />
                    <div className="whitespace-pre-wrap text-muted-foreground">
                      {project.content}
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-black mb-6 text-foreground">Requirements</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">5+ years experience in React Native or Flutter</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Experience with AI/ML integration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Strong backend development skills</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Previous e-commerce project experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Excellent communication skills</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-2xl font-black mb-6 text-foreground">Tech Stack</h2>
                <div className="flex flex-wrap gap-3">
                  {project.techStacks.map((tech, index) => (
                    <Badge 
                      key={index}
                      className="bg-purple-500 text-white text-sm py-2 px-4"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-black mb-4 text-foreground">Client</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-black">
                    <AvatarImage src="/api/placeholder/60/60" alt={project.creator} />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-lg">{project.creator}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>23 projects completed</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Client
                </Button>
              </Card>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-black mb-4 text-foreground">Project Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="font-bold">{project.applications}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Team Size</span>
                    <span className="font-bold">{project.currentTeamSize || 0} / {project.teamSize} developers</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <Badge className="bg-cyan-500 text-white">
                      Mobile Development
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Team Progress</span>
                      <span className="font-bold">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Matched Developers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-black mb-4 text-foreground">Matched Developers</h3>
                <div className="space-y-4">
                  {project.matchedDevelopers && project.matchedDevelopers.map((dev) => (
                    <div key={dev.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <Avatar className="w-12 h-12 border-2 border-black">
                        <AvatarImage src={dev.avatar} alt={dev.name} />
                        <AvatarFallback>{dev.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{dev.name}</h4>
                        <p className="text-xs text-muted-foreground">{dev.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{dev.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  View All Matches
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
