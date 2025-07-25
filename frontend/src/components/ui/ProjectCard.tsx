import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Code2, Clock } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant={project.status === 'RECRUITING' ? 'default' : 
                    project.status === 'IN_PROGRESS' ? 'secondary' : 'outline'}
          >
            {project.status === 'RECRUITING' ? '모집중' : 
             project.status === 'IN_PROGRESS' ? '진행중' : '완료'}
          </Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">
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
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.techStacks.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.techStacks.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* 팀 구성 */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{project.requiredMembers?.frontend || 0}명</div>
            <div className="text-xs text-muted-foreground">프론트</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-semibold">{project.requiredMembers?.backend || 0}명</div>
            <div className="text-xs text-muted-foreground">백엔드</div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{project.currentMembers || 0}명 참여</span>
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
          className="w-full"
          onClick={onClick}
        >
          <Link href={`/projects/${project.id}`}>
            상세보기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProjectCard;