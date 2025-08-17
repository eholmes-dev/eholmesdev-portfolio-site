import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-background/70"></div>
      </div>
      
      {/* Content */}
      <div className="container-width section-padding relative z-10">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm <span className="hero-text">John Doe</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-4">
            Software Engineer & AI Enthusiast
          </h2>
          
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            Crafting innovative solutions with cutting-edge technology, 
            specializing in AI-driven applications and scalable web development.
          </p>
          
          <div className="flex justify-center space-x-6 mb-12">
            <Button variant="outline" size="lg" className="glow-on-hover" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            
            <Button variant="outline" size="lg" className="glow-on-hover" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
          </div>
          
          <div className="animate-float">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;