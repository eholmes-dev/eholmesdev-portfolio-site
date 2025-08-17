import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container-width section-padding py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 hero-text">John Doe</h3>
            <p className="text-muted-foreground mb-4">
              Software Engineer passionate about AI and creating innovative solutions 
              that make a positive impact.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://www.linkedin.com/in/echolmes/" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:john.doe@example.com">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="p-0 h-auto justify-start" 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                About
              </Button>
              <Button variant="ghost" size="sm" className="p-0 h-auto justify-start"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                Projects
              </Button>
              <Button variant="ghost" size="sm" className="p-0 h-auto justify-start"
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}>
                Skills
              </Button>
              <Button variant="ghost" size="sm" className="p-0 h-auto justify-start"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Technologies</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>React & Next.js</p>
              <p>Python & TensorFlow</p>
              <p>Node.js & Express</p>
              <p>Cloud Platforms</p>
              <p>Machine Learning</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} John Doe. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            Built with <Heart className="h-4 w-4 mx-1 text-red-500" /> using React & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;