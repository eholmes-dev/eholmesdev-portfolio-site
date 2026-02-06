import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink } from 'lucide-react';
import project1 from '@/assets/project1.jpg';
import project2 from '@/assets/project2.jpg';
import project3 from '@/assets/project3.jpg';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Portfolio Website",
      description: "You're here!",
      image: project1,
      technologies: ["Lovable.dev", "TypeScript", "CSS"],
      githubUrl: "https://github.com/eholmes-dev/eholmesdev-portfolio-site",
      liveUrl: null,
      featured: true
    },
    {
      title: "Real-Time Market Intelligence Dashboard",
      description: "A real-time financial analytics application integrating data streaming, stock APIs, and market news to generate investment opportunities.",
      image: project2,
      technologies: ["C#.NET", "Azure Functions", "Cosmos DB", "API", "Kafka"],
      githubUrl: "#",
      liveUrl: "#",
      featured: true
    },
    {
      title: "Crime Tracking Dashboard",
      description: "Interactive US crime dashboard aggregating real-time reports and public datasets, visualizing trends, hotspots, and patterns on an interactive map.",
      image: project3,
      technologies: ["Python", "PostgreSQL", "React", "Leaflet.js", "Chart.js", "Azure Cognitive Services"],
      githubUrl: "#",
      liveUrl: "#",
      featured: false
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A showcase of my latest work in AI, web development, and innovative software solutions
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden glow-on-hover group">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {project.featured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {project.title}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    {project.liveUrl && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/eholmes-dev" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              View All Projects on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;