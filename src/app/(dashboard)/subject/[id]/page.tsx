import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  XCircle,
  Brain,
  MessageSquare,
  PenSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SubjectPageProps {
  params: Promise<{ id: string }>;
}

// You'll need to create these types based on your data structure
interface SubjectStats {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  totalAttempts: number;
  averageScore: number;
  timeSpent: number; // in minutes
  lastAttempt: string; // ISO date string
}

async function getSubjectStats(id: string): Promise<SubjectStats> {
  // Replace this with your actual data fetching logic
  return {
    totalQuestions: 100,
    answeredQuestions: 65,
    correctAnswers: 50,
    totalAttempts: 75,
    averageScore: 76.5,
    timeSpent: 120,
    lastAttempt: new Date().toISOString(),
  };
}

const SubjectPage = async ({ params }: SubjectPageProps) => {
  const { id } = await params;
  const stats = await getSubjectStats(id);

  const completionRate = (stats.answeredQuestions / stats.totalQuestions) * 100;
  const accuracyRate = (stats.correctAnswers / stats.answeredQuestions) * 100;

  const handleStartMCQ = () => {
    const res = () => {};
  }
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Study Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 hover:border-primary transition-colors cursor-pointer group">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl">Practice MCQs</h3>
              <p className="text-sm text-muted-foreground">
                Test your knowledge with multiple choice questions
              </p>
            </div>
            <Button onClick={handleStartMCQ}>Start Practice →</Button>
          </div>
        </Card>

        <Link href={`/subject/${id}/input`}>
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer group">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <PenSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Input Questions</h3>
                <p className="text-sm text-muted-foreground">
                  Practice with written answers and calculations
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-primary">
                Start Writing →
              </span>
            </div>
          </Card>
        </Link>

        <Link href={`/subject/${id}/chat`}>
          <Card className="p-6 hover:border-primary transition-colors cursor-pointer group">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-xl">Chat with AI</h3>
                <p className="text-sm text-muted-foreground">
                  Get help and explanations through interactive chat
                </p>
              </div>
              <span className="inline-flex items-center text-sm font-medium text-primary">
                Start Chat →
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          {/* Progress Overview Card */}
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </h3>
              <Target className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
            <Progress value={completionRate} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {stats.answeredQuestions} of {stats.totalQuestions} questions
              completed
            </p>
          </Card>

          {/* Accuracy Card */}
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Accuracy
              </h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{accuracyRate.toFixed(1)}%</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{stats.correctAnswers}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm">
                  {stats.answeredQuestions - stats.correctAnswers}
                </span>
              </div>
            </div>
          </Card>

          {/* Attempts Card */}
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Attempts
              </h3>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{stats.totalAttempts}</p>
            <p className="text-sm text-muted-foreground">
              Avg. Score: {stats.averageScore.toFixed(1)}%
            </p>
          </Card>

          {/* Time Stats Card */}
          <Card className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Time Spent
              </h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{stats.timeSpent}m</p>
            <p className="text-sm text-muted-foreground">
              Last attempt: {new Date(stats.lastAttempt).toLocaleDateString()}
            </p>
          </Card>
        </Suspense>
      </div>

      {/* Recent Activity Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add your recent activity items here */}
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </Card>

      {/* Recommendations Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 border border-dashed">
            <h3 className="font-medium">Practice Weak Areas</h3>
            <p className="text-sm text-muted-foreground">
              Focus on topics where your accuracy is below 70%
            </p>
          </Card>
          <Card className="p-4 border border-dashed">
            <h3 className="font-medium">Complete Missing Questions</h3>
            <p className="text-sm text-muted-foreground">
              {stats.totalQuestions - stats.answeredQuestions} questions
              remaining
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
};

// Skeleton loader component
const StatsCardSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-full" />
        </Card>
      ))}
    </>
  );
};

export default SubjectPage;
