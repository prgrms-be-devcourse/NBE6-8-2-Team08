import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Code2, Clock, Target } from 'lucide-react';
import type { ProjectDetailResponse } from '@/types';

interface ProjectCardProps {
  project: ProjectDetailResponse;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  // 상태별 색상 및 텍스트
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

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getStatusColor(project.status)} text-white badge-neon`}>
            {getStatusText(project.status)}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2 font-black">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 기술 스택 */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Code2 className="w-4 h-4" />
            <span>기술 스택</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.techStacks.slice(0, 3).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs badge-neon">
                {tech}
              </Badge>
            ))}
            {project.techStacks.length > 3 && (
              <Badge variant="secondary" className="text-xs badge-neon">
                +{project.techStacks.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* 팀 구성 */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-muted rounded-lg card-neon">
            <div className="font-black">{project.currentTeamSize}명</div>
            <div className="text-xs text-muted-foreground">현재 팀원</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg card-neon">
            <div className="font-black">{project.teamSize}명</div>
            <div className="text-xs text-muted-foreground">목표 팀원</div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{project.creator.nickname}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(project.createdAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          asChild 
          className="w-full btn-neon"
          onClick={onClick}
        >
          <Link href={`/projects/${project.id}`}>
            <Target className="mr-2 h-4 w-4" />
            상세보기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;
