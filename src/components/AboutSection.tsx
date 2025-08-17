import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Code, Brain } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 hero-text">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Passionate about creating intelligent solutions that make a difference
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="prose prose-lg">
              <p className="text-foreground mb-6">
                I'm a Software Engineer with a deep passion for artificial intelligence and machine learning. 
                With over 5 years of experience in full-stack development, I specialize in building scalable 
                applications that leverage the latest AI technologies.
              </p>
              
              <p className="text-foreground mb-6">
                My journey began with a fascination for how computers could think and learn. Today, I work 
                at the intersection of traditional software engineering and cutting-edge AI, creating solutions 
                that are both technically robust and user-friendly.
              </p>
              
              <p className="text-foreground">
                When I'm not coding, you'll find me exploring the latest research papers, contributing to 
                open-source projects, or mentoring aspiring developers in the tech community.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="glow-on-hover">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Education</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">M.S. Computer Science</h4>
                    <p className="text-muted-foreground">Stanford University • 2019-2021</p>
                    <p className="text-sm text-muted-foreground">Specialization: Machine Learning & AI</p>
                  </div>
                  <div>
                    <h4 className="font-medium">B.S. Software Engineering</h4>
                    <p className="text-muted-foreground">MIT • 2015-2019</p>
                    <p className="text-sm text-muted-foreground">Magna Cum Laude</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="glow-on-hover">
                <CardContent className="p-6 text-center">
                  <Code className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold">5+ Years</h4>
                  <p className="text-sm text-muted-foreground">Development Experience</p>
                </CardContent>
              </Card>
              
              <Card className="glow-on-hover">
                <CardContent className="p-6 text-center">
                  <Brain className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold">50+ Projects</h4>
                  <p className="text-sm text-muted-foreground">AI & Web Apps</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;