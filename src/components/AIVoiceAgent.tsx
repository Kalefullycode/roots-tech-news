import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Square, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function AIVoiceAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSpeechSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
    'speechSynthesis' in window;

  const startListening = useCallback(() => {
    if (!isSpeechSupported) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    setError('');
    setTranscript('');
    setResponse('');
    setVoiceState('listening');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1];
      const text = current[0].transcript;
      setTranscript(text);

      if (current.isFinal) {
        recognition.stop();
        setVoiceState('processing');
        processQuery(text);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Recognition error: ${event.error}`);
      }
      setVoiceState('idle');
    };

    recognition.onend = () => {
      if (voiceState === 'listening') {
        setVoiceState('idle');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSpeechSupported, voiceState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setVoiceState('idle');
  }, []);

  const processQuery = (query: string) => {
    // Generate a response based on the voice query
    const q = query.toLowerCase();
    let answer = '';

    if (q.includes('news')) {
      answer = "Here's what's happening: AI breakthroughs are reshaping industries across Africa, the Caribbean, and South America. Check our Global News section for the latest stories.";
    } else if (q.includes('ai')) {
      answer = "AI developments we're tracking include healthcare innovations in Kenya, fintech growth in Nigeria, and AI policy frameworks emerging across Latin America.";
    } else if (q.includes('subscribe')) {
      answer = "I'd love to have you join our newsletter! You'll get weekly tech digests covering stories from underrepresented regions. Visit our newsletter page to sign up.";
    } else {
      answer = "Thanks for your question. I'm finding the best content on RootsTechNews to answer that. Check our categories for in-depth coverage.";
    }

    setTimeout(() => {
      setResponse(answer);
      speakResponse(answer);
    }, 600);
  };

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Use a female voice if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen'));
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => setVoiceState('speaking');
    utterance.onend = () => setVoiceState('idle');
    utterance.onerror = () => {
      setVoiceState('idle');
      setError('Speech synthesis failed.');
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setVoiceState('idle');
  };

  if (!isSpeechSupported) {
    return null; // Don't render if not supported
  }

  return (
    <>
      {/* Floating Voice Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
        aria-label={isOpen ? 'Close voice agent' : 'Open AI Voice Agent'}
      >
        <Volume2 className="w-6 h-6" />
      </button>

      {/* Voice Panel */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-secondary to-orange-600 text-white">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-playfair font-bold text-sm">Voice Agent</h3>
              <p className="text-xs text-white/70 font-inter">
                {voiceState === 'idle' && 'Tap to speak'}
                {voiceState === 'listening' && 'Listening...'}
                {voiceState === 'processing' && 'Processing...'}
                {voiceState === 'speaking' && 'Speaking...'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Mic Button */}
            <div className="flex justify-center">
              <button
                onClick={voiceState === 'listening' ? stopListening : startListening}
                disabled={voiceState === 'processing' || voiceState === 'speaking'}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  voiceState === 'listening'
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                    : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                }`}
                aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start listening'}
              >
                {voiceState === 'listening' ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="bg-muted rounded-xl p-4">
                <p className="text-xs text-muted-foreground font-inter mb-1">You said:</p>
                <p className="text-sm text-foreground font-inter italic">"{transcript}"</p>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <p className="text-xs text-primary font-inter font-medium">AI Response</p>
                </div>
                <p className="text-sm text-foreground font-inter leading-relaxed">{response}</p>
                {voiceState === 'speaking' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stopSpeaking}
                    className="mt-2 text-secondary hover:text-secondary-dark"
                  >
                    <Square className="w-4 h-4 mr-1" /> Stop
                  </Button>
                )}
                {voiceState === 'idle' && response && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakResponse(response)}
                    className="mt-2 text-secondary hover:text-secondary-dark"
                  >
                    <Play className="w-4 h-4 mr-1" /> Replay
                  </Button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs text-red-600 font-inter">{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
