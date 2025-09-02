import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PrivacyPage = () => {
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
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">
                Legal
              </Badge>
            </div>
            <h1 className="font-orbitron text-4xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="font-roboto text-lg opacity-90 max-w-2xl">
              Your privacy is our priority. Learn how we collect, use, and protect your personal information 
              when you use RootsTechNews.
            </p>
            <div className="mt-4">
              <p className="text-sm opacity-75">Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Overview */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                Overview
              </h2>
            </div>
            <p className="font-roboto text-muted-foreground leading-relaxed">
              At RootsTechNews, we are committed to protecting your privacy and ensuring transparency 
              about how we handle your personal information. This Privacy Policy explains what data 
              we collect, how we use it, and your rights regarding your personal information.
            </p>
          </Card>

          {/* Information We Collect */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                Information We Collect
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-orbitron text-lg font-semibold mb-2 text-accent">
                  Personal Information
                </h3>
                <ul className="font-roboto text-muted-foreground space-y-2 ml-4">
                  <li>• Name and email address when you subscribe to our newsletter</li>
                  <li>• Contact information when you reach out to us</li>
                  <li>• Comments and feedback you provide</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-orbitron text-lg font-semibold mb-2 text-accent">
                  Automatically Collected Information
                </h3>
                <ul className="font-roboto text-muted-foreground space-y-2 ml-4">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Pages visited and time spent on our site</li>
                  <li>• Referring website information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-orbitron text-lg font-semibold mb-2 text-accent">
                  Cookies and Tracking
                </h3>
                <ul className="font-roboto text-muted-foreground space-y-2 ml-4">
                  <li>• Essential cookies for site functionality</li>
                  <li>• Analytics cookies to understand site usage</li>
                  <li>• Preference cookies to remember your settings</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* How We Use Your Information */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                How We Use Your Information
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="font-orbitron font-semibold text-accent mb-2">
                  Content Delivery
                </h3>
                <p className="font-roboto text-muted-foreground">
                  To provide you with personalized news content and recommendations based on your interests.
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-orbitron font-semibold text-primary mb-2">
                  Communication
                </h3>
                <p className="font-roboto text-muted-foreground">
                  To send you newsletters, updates, and respond to your inquiries and feedback.
                </p>
              </div>
              
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h3 className="font-orbitron font-semibold text-secondary mb-2">
                  Site Improvement
                </h3>
                <p className="font-roboto text-muted-foreground">
                  To analyze site usage and improve our content, features, and user experience.
                </p>
              </div>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-6">
              Your Rights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Access</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Request a copy of the personal data we hold about you.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Correction</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Request correction of inaccurate or incomplete data.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Deletion</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Request deletion of your personal data under certain circumstances.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Portability</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Request transfer of your data to another service provider.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Objection</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Object to processing of your data for specific purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-orbitron font-semibold text-accent mb-2">Withdrawal</h3>
                  <p className="font-roboto text-muted-foreground text-sm">
                    Withdraw consent for data processing at any time.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact for Privacy */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-4">
              Questions About Privacy?
            </h2>
            <p className="font-roboto text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy or how we handle your data, 
              please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-hero hover:glow-primary">
                Contact Privacy Team
              </Button>
              <Button variant="outline" className="border-primary hover:bg-primary/10">
                Download Privacy Policy PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;