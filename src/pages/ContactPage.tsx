import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, MapPin, Phone, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form submitted");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="bg-gradient-to-r from-primary to-accent p-8 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">
                Contact
              </Badge>
            </div>
            <h1 className="font-orbitron text-4xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="font-roboto text-lg opacity-90 max-w-2xl">
              Have a story tip? Want to collaborate? Or just want to say hello? 
              We'd love to hear from you. Reach out and let's build the future of tech together.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <h2 className="font-orbitron text-2xl font-bold mb-6 text-glow-primary">
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Your last name"
                    required
                    className="bg-input border-border focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  className="bg-input border-border focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="What's this about?"
                  required
                  className="bg-input border-border focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  required
                  className="bg-input border-border focus:border-primary resize-none"
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-hero hover:glow-primary">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6 bg-card-modern border border-card-border/60">
              <h3 className="font-orbitron text-xl font-bold mb-4 text-glow-accent">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">contact@rootstechnews.com</p>
                    <p className="text-muted-foreground">tips@rootstechnews.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      123 Innovation Drive<br />
                      Tech Hub District<br />
                      Cape Town, South Africa
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-modern border border-card-border/60">
              <h3 className="font-orbitron text-xl font-bold mb-4 text-glow-accent">
                Response Times
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-foreground">General Inquiries</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    24-48 hours
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-foreground">Press & Media</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Same day
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-roboto text-foreground">Technical Issues</span>
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    12-24 hours
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-modern border border-card-border/60">
              <h3 className="font-orbitron text-xl font-bold mb-4 text-glow-accent">
                Office Hours
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-roboto text-foreground">Monday - Friday</span>
                  <span className="text-muted-foreground">9:00 AM - 6:00 PM CAT</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-roboto text-foreground">Saturday</span>
                  <span className="text-muted-foreground">10:00 AM - 2:00 PM CAT</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-roboto text-foreground">Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;