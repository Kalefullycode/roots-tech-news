import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, AlertTriangle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TermsPage = () => {
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
          
          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="h-8 w-8" />
              <Badge className="bg-white/20 text-white border-white/30">
                Legal
              </Badge>
            </div>
            <h1 className="font-orbitron text-4xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="font-roboto text-lg opacity-90 max-w-2xl">
              By using RootsTechNews, you agree to these terms. Please read them carefully 
              to understand your rights and responsibilities.
            </p>
            <div className="mt-4">
              <p className="text-sm opacity-75">Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Acceptance of Terms */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                Acceptance of Terms
              </h2>
            </div>
            <p className="font-roboto text-muted-foreground leading-relaxed mb-4">
              By accessing and using RootsTechNews ("the Service"), you accept and agree to be bound 
              by the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
            <p className="font-roboto text-muted-foreground leading-relaxed">
              These Terms of Service constitute a legally binding agreement between you and RootsTechNews 
              regarding your use of our website, services, and content.
            </p>
          </Card>

          {/* Use of Service */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                Use of Service
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-orbitron text-lg font-semibold mb-3 text-accent">
                  Permitted Uses
                </h3>
                <ul className="font-roboto text-muted-foreground space-y-2 ml-4">
                  <li>• Reading and sharing articles for personal, non-commercial use</li>
                  <li>• Subscribing to newsletters and updates</li>
                  <li>• Engaging with content through comments and feedback</li>
                  <li>• Linking to our content from other websites</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-orbitron text-lg font-semibold mb-3 text-accent">
                  Prohibited Uses
                </h3>
                <ul className="font-roboto text-muted-foreground space-y-2 ml-4">
                  <li>• Reproducing content without permission</li>
                  <li>• Using automated systems to scrape content</li>
                  <li>• Posting offensive, harmful, or illegal content</li>
                  <li>• Attempting to hack or disrupt our services</li>
                  <li>• Impersonating RootsTechNews or our staff</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Content and Intellectual Property */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-6">
              Content and Intellectual Property
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h3 className="font-orbitron font-semibold text-primary mb-2">
                  Our Content
                </h3>
                <p className="font-roboto text-muted-foreground">
                  All articles, images, logos, and other content on RootsTechNews are owned by us or 
                  our licensors and are protected by copyright and other intellectual property laws.
                </p>
              </div>
              
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h3 className="font-orbitron font-semibold text-accent mb-2">
                  User-Generated Content
                </h3>
                <p className="font-roboto text-muted-foreground">
                  By submitting content to our platform (comments, feedback, etc.), you grant us 
                  a non-exclusive, royalty-free license to use, modify, and distribute such content.
                </p>
              </div>
              
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <h3 className="font-orbitron font-semibold text-secondary mb-2">
                  Fair Use
                </h3>
                <p className="font-roboto text-muted-foreground">
                  You may quote brief excerpts from our articles with proper attribution and links 
                  back to the original source for commentary, criticism, or news reporting.
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimers */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
                Disclaimers
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <h3 className="font-orbitron font-semibold text-orange-400 mb-2">
                  Information Accuracy
                </h3>
                <p className="font-roboto text-muted-foreground text-sm">
                  While we strive for accuracy, we cannot guarantee that all information is 
                  error-free or up-to-date. Technology news moves fast, and details may change.
                </p>
              </div>
              
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <h3 className="font-orbitron font-semibold text-red-400 mb-2">
                  No Investment Advice
                </h3>
                <p className="font-roboto text-muted-foreground text-sm">
                  Content about startups, investments, or financial topics is for informational 
                  purposes only and should not be considered as investment advice.
                </p>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <h3 className="font-orbitron font-semibold text-yellow-400 mb-2">
                  Third-Party Links
                </h3>
                <p className="font-roboto text-muted-foreground text-sm">
                  We are not responsible for the content or privacy practices of external 
                  websites linked from our articles.
                </p>
              </div>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-8 bg-card-modern border border-card-border/60">
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-4">
              Limitation of Liability
            </h2>
            <p className="font-roboto text-muted-foreground leading-relaxed mb-4">
              RootsTechNews provides content "as is" without warranty of any kind. We shall not be 
              liable for any damages arising from the use of our service, including but not limited to:
            </p>
            <ul className="font-roboto text-muted-foreground space-y-2 ml-6">
              <li>• Direct, indirect, or consequential damages</li>
              <li>• Loss of profits or business opportunities</li>
              <li>• Data loss or corruption</li>
              <li>• Service interruptions or downtime</li>
            </ul>
          </Card>

          {/* Contact for Legal */}
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-4">
              Questions About These Terms?
            </h2>
            <p className="font-roboto text-muted-foreground mb-6">
              If you have any questions about these Terms of Service or need clarification 
              on any provision, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-hero hover:glow-primary">
                Contact Legal Team
              </Button>
              <Button variant="outline" className="border-primary hover:bg-primary/10">
                Download Terms PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;