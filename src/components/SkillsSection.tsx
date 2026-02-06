import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Trophy, BookOpen, Target, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const SkillsSection = () => {
  const [leetcodeStats, setLeetcodeStats] = useState({
    totalSolved: 450,
    ranking: "Top 5%",
    easy: 180,
    medium: 220,
    hard: 50
  });
  const [isLoading, setIsLoading] = useState(true);

  const technicalSkills = [
    { name: "C# .NET", level: 80 },
    { name: "APIs & Integrations", level: 75 },
    { name: "Python", level: 65 },
    { name: "Cloud Platforms", level: 50 },
    { name: "AI & Machine Learning", level: 30 },
  ];

  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        console.log('Calling LeetCode stats function...');
        const { data, error } = await supabase.functions.invoke('leetcode-stats', {
          body: { username: 'eholmes-dev' }
        });

        console.log('Function response:', { data, error });

        if (error) {
          console.error('Error fetching LeetCode stats:', error);
          // Use fallback data if available
          if (data?.fallback) {
            setLeetcodeStats(data.fallback);
          }
        } else if (data) {
          console.log('Updating stats with real data:', data);
          setLeetcodeStats({
            totalSolved: data.totalSolved,
            ranking: data.ranking,
            easy: data.easy,
            medium: data.medium,
            hard: data.hard
          });
        }
      } catch (err) {
        console.error('Failed to fetch LeetCode stats:', err);
        // Keep fallback stats on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeetCodeStats();
  }, []);

  const currentLearning = [
    "AI & Generative AI Explained - Pluralsight",
    "OpenAI for Developers - Pluralsight",
    "Artificial Intelligence: Foundations - Pluralsight"
  ];

  const recentCourses = [
    "Microsoft Certified: Azure Fundamentals (AZ-900)",
    "Azure Fundamentals: Describe Azure management and governance",
    "Azure Fundamentals: Describe Azure architecture and services"
  ];

  return (
    <section id="skills" className="py-20 bg-secondary/30">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Skills & Learning</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continuous learning and problem-solving expertise across multiple technologies
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Technical Skills */}
          <Card className="glow-on-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-primary" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicalSkills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* LeetCode Stats */}
          <a 
            href="https://leetcode.com/u/eholmes-dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="glow-on-hover cursor-pointer transition-all duration-300 hover:scale-105 h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-accent" />
                  LeetCode Statistics
                  {isLoading && <span className="ml-2 text-xs text-muted-foreground">Loading...</span>}
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary">{leetcodeStats.totalSolved}</div>
                <div className="text-muted-foreground">Problems Solved</div>
                <Badge className="mt-2 bg-accent text-accent-foreground">
                  {leetcodeStats.ranking} Global Ranking
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-green-500">{leetcodeStats.easy}</div>
                  <div className="text-xs text-muted-foreground">Easy</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-yellow-500">{leetcodeStats.medium}</div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-red-500">{leetcodeStats.hard}</div>
                  <div className="text-xs text-muted-foreground">Hard</div>
                </div>
              </div>
            </CardContent>
            </Card>
          </a>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Currently Learning */}
          <Card className="glow-on-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-accent" />
                Currently Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentLearning.map((course, index) => (
                  <div key={index} className="flex items-center p-3 bg-background rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    <span className="text-sm">{course}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Completions */}
          <Card className="glow-on-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                What I've Been Up To
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCourses.map((course, index) => (
                  <div key={index} className="flex items-center p-3 bg-background rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    <span className="text-sm">{course}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </section>
  );
};

export default SkillsSection;