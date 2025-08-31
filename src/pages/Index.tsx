const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-orbitron text-4xl font-bold text-glow-primary mb-4">
          Roots<span className="text-accent">Tech</span>News
        </h1>
        <p className="text-xl text-muted-foreground font-roboto">
          Loading the future of tech journalism...
        </p>
        <div className="mt-8 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;