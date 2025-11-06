/**
 * RSS.app Configuration
 * 
 * RSS.app aggregates YouTube channels into RSS feeds.
 * Setup: https://rss.app → Create feeds → Get feed URLs
 */

export interface RSSAppChannel {
  handle: string;
  name: string;
  category: 'AI' | 'Tech' | 'Business' | 'Education' | 'Tutorials';
  priority: 'high' | 'medium' | 'low';
}

export const RSSAPP_YOUTUBE_CHANNELS: RSSAppChannel[] = [
  // ============================================
  // TOP PRIORITY CHANNELS (Original)
  // ============================================
  { handle: '@sabrina_ramonov', name: 'Sabrina Ramonov', category: 'AI', priority: 'high' },
  { handle: '@StefanMischook', name: 'Stefan Mischook', category: 'Tutorials', priority: 'high' },
  { handle: '@NickySaunders', name: 'Nicky Saunders', category: 'AI', priority: 'high' },
  { handle: '@aiexplained-official', name: 'AI Explained', category: 'AI', priority: 'high' },
  { handle: '@TwoMinutePapers', name: 'Two Minute Papers', category: 'AI', priority: 'high' },
  { handle: '@mreflow', name: 'Mr. Eflow', category: 'Tech', priority: 'high' },
  { handle: '@JuliaMcCoy', name: 'Julia McCoy', category: 'Business', priority: 'high' },
  { handle: '@NetworkChuck', name: 'NetworkChuck', category: 'Tech', priority: 'high' },
  { handle: '@TimExplainsAI', name: 'Tim Explains AI', category: 'AI', priority: 'high' },
  { handle: '@GaryVee', name: 'Gary Vaynerchuk', category: 'Business', priority: 'high' },
  
  // ============================================
  // AI VIDEO CREATION
  // ============================================
  { handle: '@JohnnyTube', name: 'JohnnyTube', category: 'AI', priority: 'high' },
  { handle: '@OpenArt', name: 'OpenArt', category: 'AI', priority: 'high' },
  { handle: '@Excelerator', name: 'Excelerator', category: 'AI', priority: 'high' },
  { handle: '@TheoreticallyMedia', name: 'TheoreticallyMedia', category: 'AI', priority: 'high' },
  { handle: '@NuliStudio', name: 'NuliStudio', category: 'AI', priority: 'medium' },
  { handle: '@ElevenLabs', name: 'ElevenLabs', category: 'AI', priority: 'high' },
  { handle: '@AIVideoSchool', name: 'AI Video School', category: 'AI', priority: 'high' },
  { handle: '@JohnSavageAI', name: 'John Savage AI', category: 'AI', priority: 'high' },
  { handle: '@AllAboutAI', name: 'All About AI', category: 'AI', priority: 'high' },
  { handle: '@PremiereGal', name: 'PremiereGal', category: 'AI', priority: 'medium' },
  { handle: '@Mickmumpitz', name: 'Mickmumpitz', category: 'AI', priority: 'medium' },
  
  // ============================================
  // AI BUSINESS & MONETIZATION
  // ============================================
  { handle: '@MakeMoneyWithStacyLa', name: 'Make Money With Stacy La', category: 'Business', priority: 'high' },
  { handle: '@JesseCunningham', name: 'Jesse Cunningham', category: 'Business', priority: 'high' },
  { handle: '@GillianPerkins', name: 'Gillian Perkins', category: 'Business', priority: 'high' },
  { handle: '@ENERGI', name: 'ENERGI', category: 'Business', priority: 'high' },
  { handle: '@JeffSetLife', name: 'Jeff Set Life', category: 'Business', priority: 'high' },
  { handle: '@SuperHumansLife', name: 'SuperHumansLife', category: 'Business', priority: 'high' },
  { handle: '@JordanWelch', name: 'Jordan Welch', category: 'Business', priority: 'high' },
  { handle: '@NathanNazareth', name: 'Nathan Nazareth', category: 'Business', priority: 'high' },
  { handle: '@SoloShannon', name: 'SoloShannon', category: 'Business', priority: 'high' },
  { handle: '@AcHampton', name: 'AcHampton', category: 'Business', priority: 'high' },
  { handle: '@LunaVega', name: 'LunaVega', category: 'Business', priority: 'high' },
  { handle: '@WholesaleTed', name: 'WholesaleTed', category: 'Business', priority: 'high' },
  { handle: '@OmarEltakrori', name: 'Omar Eltakrori', category: 'Business', priority: 'medium' },
  { handle: '@RichardYu', name: 'Richard Yu', category: 'Business', priority: 'medium' },
  
  // ============================================
  // AI CODING & DEVELOPMENT
  // ============================================
  { handle: '@RileyBrown', name: 'RileyBrown', category: 'Tutorials', priority: 'high' },
  { handle: '@JayPeters', name: 'JayPeters', category: 'Tutorials', priority: 'high' },
  { handle: '@PedroTech', name: 'PedroTech', category: 'Tutorials', priority: 'high' },
  { handle: '@SWErikCodes', name: 'SWErikCodes', category: 'Tutorials', priority: 'high' },
  { handle: '@TraversyMedia', name: 'TraversyMedia', category: 'Tutorials', priority: 'high' },
  { handle: '@BlazingZebra', name: 'BlazingZebra', category: 'Tutorials', priority: 'medium' },
  { handle: '@CodeAProgram', name: 'CodeAProgram', category: 'Tutorials', priority: 'medium' },
  { handle: '@Wanderloots', name: 'Wanderloots', category: 'Tutorials', priority: 'medium' },
  { handle: '@AIJason', name: 'AIJason', category: 'Tutorials', priority: 'medium' },
  { handle: '@RasBuilds', name: 'RasBuilds', category: 'Tutorials', priority: 'medium' },
  { handle: '@VoloBuilds', name: 'VoloBuilds', category: 'Tutorials', priority: 'medium' },
  { handle: '@Fireship', name: 'Fireship', category: 'Tutorials', priority: 'high' },
  { handle: '@StarterStoryBuild', name: 'StarterStoryBuild', category: 'Tutorials', priority: 'medium' },
  { handle: '@Lattice', name: 'Lattice', category: 'Tutorials', priority: 'medium' },
  { handle: '@CS50', name: 'CS50', category: 'Education', priority: 'high' },
  { handle: '@Theo-t3gg', name: 'Theo-t3gg', category: 'Tutorials', priority: 'medium' },
  { handle: '@Awesome', name: 'Awesome', category: 'Tutorials', priority: 'low' },
  
  // ============================================
  // AI NEWS & UPDATES
  // ============================================
  { handle: '@TheAIDailyBrief', name: 'The AI Daily Brief', category: 'AI', priority: 'high' },
  { handle: '@AIRevolution', name: 'AI Revolution', category: 'AI', priority: 'high' },
  { handle: '@AINewsStrategyDaily', name: 'AI News Strategy Daily', category: 'AI', priority: 'high' },
  { handle: '@TheNextWave', name: 'The Next Wave', category: 'AI', priority: 'high' },
  { handle: '@AIForHumans', name: 'AI For Humans', category: 'AI', priority: 'high' },
  { handle: '@WesRoth', name: 'Wes Roth', category: 'AI', priority: 'high' },
  { handle: '@SciShow', name: 'SciShow', category: 'AI', priority: 'medium' },
  { handle: '@HankGreen', name: 'Hank Green', category: 'AI', priority: 'medium' },
  
  // ============================================
  // TECH REVIEWS & ANALYSIS
  // ============================================
  { handle: '@MarquesBrownlee', name: 'Marques Brownlee', category: 'Tech', priority: 'high' },
  { handle: '@MicroFourNerds', name: 'MicroFourNerds', category: 'Tech', priority: 'medium' },
  { handle: '@WaveformClips', name: 'WaveformClips', category: 'Tech', priority: 'medium' },
  { handle: '@HowMoneyWorks', name: 'How Money Works', category: 'Tech', priority: 'medium' },
  { handle: '@vidIQ', name: 'vidIQ', category: 'Tech', priority: 'medium' },
  
  // ============================================
  // AI EDUCATION & TUTORIALS
  // ============================================
  { handle: '@AliHSalem', name: 'Ali H Salem', category: 'Education', priority: 'high' },
  { handle: '@NateHerk', name: 'Nate Herk', category: 'Education', priority: 'high' },
  { handle: '@RickMulready', name: 'Rick Mulready', category: 'Education', priority: 'high' },
  { handle: '@PunitChawla', name: 'Punit Chawla', category: 'Education', priority: 'high' },
  { handle: '@DanGalletta', name: 'Dan Galletta', category: 'Education', priority: 'medium' },
  { handle: '@GraceLeung', name: 'Grace Leung', category: 'Education', priority: 'medium' },
  { handle: '@JeffSu', name: 'Jeff Su', category: 'Education', priority: 'high' },
  { handle: '@AlexFinn', name: 'Alex Finn', category: 'Education', priority: 'medium' },
  { handle: '@Futurepedia', name: 'Futurepedia', category: 'Education', priority: 'high' },
  { handle: '@HelloPM', name: 'HelloPM', category: 'Education', priority: 'medium' },
  { handle: '@MarinaWyss', name: 'Marina Wyss', category: 'Education', priority: 'medium' },
  { handle: '@DrAminaYonis', name: 'Dr Amina Yonis', category: 'Education', priority: 'medium' },
  { handle: '@ProfessorExplainer', name: 'ProfessorExplainer', category: 'Education', priority: 'medium' },
  { handle: '@3Blue1Brown', name: '3Blue1Brown', category: 'Education', priority: 'high' },
  { handle: '@edureka', name: 'edureka', category: 'Education', priority: 'high' },
  { handle: '@Simplilearn', name: 'Simplilearn', category: 'Education', priority: 'high' },
  
  // ============================================
  // BUSINESS & ENTREPRENEURSHIP
  // ============================================
  { handle: '@MyFirstMillion', name: 'My First Million', category: 'Business', priority: 'high' },
  { handle: '@GregIsenberg', name: 'Greg Isenberg', category: 'Business', priority: 'high' },
  { handle: '@BigThink', name: 'BigThink', category: 'Business', priority: 'high' },
  { handle: '@Freethink', name: 'Freethink', category: 'Business', priority: 'high' },
  { handle: '@SimonSquibb', name: 'Simon Squibb', category: 'Business', priority: 'high' },
  { handle: '@TomBilyeu', name: 'Tom Bilyeu', category: 'Business', priority: 'high' },
  { handle: '@JackNeel', name: 'Jack Neel', category: 'Business', priority: 'medium' },
  { handle: '@TheCalumJohnsonShow', name: 'The Calum Johnson Show', category: 'Business', priority: 'medium' },
  { handle: '@TickerSymbolYOU', name: 'TickerSymbolYOU', category: 'Business', priority: 'medium' },
  { handle: '@a16z', name: 'a16z', category: 'Business', priority: 'high' },
  
  // ============================================
  // GOOGLE TOOLS & PRODUCTS
  // ============================================
  { handle: '@GoogleWorkspaceDevelopers', name: 'Google Workspace Developers', category: 'Tech', priority: 'high' },
  { handle: '@GoogleCareerCertificates', name: 'Google Career Certificates', category: 'Education', priority: 'high' },
  { handle: '@GoogleCloudTech', name: 'Google Cloud Tech', category: 'Tech', priority: 'high' },
  { handle: '@GoogleCloud', name: 'Google Cloud', category: 'Tech', priority: 'high' },
  { handle: '@corbin', name: 'corbin', category: 'Tech', priority: 'medium' },
  
  // ============================================
  // DESIGN & CREATIVE
  // ============================================
  { handle: '@Canva', name: 'Canva', category: 'Tech', priority: 'high' },
  { handle: '@Figma', name: 'Figma', category: 'Tech', priority: 'high' },
  { handle: '@JesseShowalter', name: 'JesseShowalter', category: 'Tech', priority: 'medium' },
  { handle: '@Freepik', name: 'Freepik', category: 'Tech', priority: 'medium' },
  { handle: '@Pixvu', name: 'Pixvu', category: 'Tech', priority: 'medium' },
  { handle: '@WadeMcMaster', name: 'WadeMcMaster', category: 'Tech', priority: 'medium' },
  
  // ============================================
  // SPECIFIC AI TOOLS
  // ============================================
  { handle: '@NeilPatel', name: 'Neil Patel', category: 'Business', priority: 'high' },
  { handle: '@IBMTechnology', name: 'IBM Technology', category: 'Tech', priority: 'high' },
  { handle: '@Anthropic', name: 'Anthropic', category: 'AI', priority: 'high' },
  { handle: '@OpenAI', name: 'OpenAI', category: 'AI', priority: 'high' },
  { handle: '@NVIDIA', name: 'NVIDIA', category: 'Tech', priority: 'high' },
  { handle: '@RoboNuggets', name: 'RoboNuggets', category: 'AI', priority: 'medium' },
  { handle: '@NexalithAI', name: 'NexalithAI', category: 'AI', priority: 'medium' },
  
  // ============================================
  // PODCASTS & INTERVIEWS
  // ============================================
  { handle: '@LennysPodcast', name: 'Lenny\'s Podcast', category: 'Business', priority: 'high' },
  { handle: '@TheDiaryOfACEO', name: 'The Diary Of A CEO', category: 'Business', priority: 'high' },
  { handle: '@InGoodFaith', name: 'InGoodFaith', category: 'Business', priority: 'medium' },
  { handle: '@20VCwithHarryStebbings', name: '20VC with Harry Stebbings', category: 'Business', priority: 'medium' },
  { handle: '@EO', name: 'EO', category: 'Business', priority: 'medium' },
  { handle: '@SineadBovell', name: 'Sinead Bovell', category: 'Business', priority: 'medium' },
  { handle: '@UnstoppableAfrica', name: 'UnstoppableAfrica', category: 'Business', priority: 'medium' },
  
  // ============================================
  // CAREER & JOBS
  // ============================================
  { handle: '@SundasKhalid', name: 'Sundas Khalid', category: 'Education', priority: 'medium' },
  { handle: '@TiffInTech', name: 'Tiff In Tech', category: 'Education', priority: 'medium' },
  { handle: '@TheBeardedITDad', name: 'The Bearded IT Dad', category: 'Education', priority: 'medium' },
  { handle: '@ImanMusa', name: 'Iman Musa', category: 'Education', priority: 'medium' },
  { handle: '@CTVYourMorning', name: 'CTV Your Morning', category: 'Education', priority: 'low' },
  { handle: '@SarahLi', name: 'Sarah Li', category: 'Education', priority: 'medium' },
  { handle: '@Parthknowsai', name: 'Parthknowsai', category: 'Education', priority: 'medium' },
  { handle: '@ABCNews', name: 'ABC News', category: 'Tech', priority: 'medium' },
  { handle: '@CNBCTelevision', name: 'CNBC Television', category: 'Business', priority: 'high' },
  { handle: '@FinancialTimes', name: 'Financial Times', category: 'Business', priority: 'high' },
  { handle: '@VaibhavSisinty', name: 'Vaibhav Sisinty', category: 'Business', priority: 'medium' },
  
  // ============================================
  // Y COMBINATOR & STARTUPS
  // ============================================
  { handle: '@YCombinator', name: 'Y Combinator', category: 'Business', priority: 'high' },
  { handle: '@ThisWeekInStartups', name: 'This Week In Startups', category: 'Business', priority: 'high' },
  { handle: '@TechCrunch', name: 'TechCrunch', category: 'Tech', priority: 'high' },
  { handle: '@TechButMakeItReal', name: 'Tech But Make It Real', category: 'Business', priority: 'medium' },
  { handle: '@EdwardSturm', name: 'Edward Sturm', category: 'Business', priority: 'medium' },
  { handle: '@DanielFazio', name: 'Daniel Fazio', category: 'Business', priority: 'medium' },
  
  // ============================================
  // FINANCE & ECONOMICS
  // ============================================
  { handle: '@BloombergTelevision', name: 'Bloomberg Television', category: 'Business', priority: 'high' },
  { handle: '@BloombergOriginals', name: 'Bloomberg Originals', category: 'Business', priority: 'high' },
  { handle: '@CNBC', name: 'CNBC', category: 'Business', priority: 'high' },
  { handle: '@BusinessInsider', name: 'Business Insider', category: 'Business', priority: 'high' },
  { handle: '@MarkTilbury', name: 'Mark Tilbury', category: 'Business', priority: 'medium' },
  
  // ============================================
  // PRODUCTIVITY & TOOLS
  // ============================================
  { handle: '@TiagoForte', name: 'Tiago Forte', category: 'Business', priority: 'high' },
  { handle: '@AliAbdaal', name: 'Ali Abdaal', category: 'Business', priority: 'high' },
  { handle: '@CharlieChang', name: 'Charlie Chang', category: 'Business', priority: 'high' },
  { handle: '@Instantly', name: 'Instantly', category: 'Business', priority: 'medium' },
  { handle: '@CollaborationSimplified', name: 'CollaborationSimplified', category: 'Tech', priority: 'medium' },
  { handle: '@KevinStratvert', name: 'Kevin Stratvert', category: 'Tech', priority: 'high' },
  { handle: '@ThatMarkGilroy', name: 'ThatMarkGilroy', category: 'Tech', priority: 'medium' },
  { handle: '@GarethPronovost', name: 'Gareth Pronovost', category: 'Tech', priority: 'medium' },
  
  // ============================================
  // ADDITIONAL ORIGINAL CHANNELS
  // ============================================
  { handle: '@IsaDoesAI', name: 'Isa Does AI', category: 'AI', priority: 'medium' },
  { handle: '@HeyGen', name: 'HeyGen', category: 'AI', priority: 'medium' },
  { handle: '@PaulJLipsky', name: 'Paul J. Lipsky', category: 'Business', priority: 'medium' },
  { handle: '@AIwithLotti', name: 'AI with Lotti', category: 'AI', priority: 'medium' },
  { handle: '@Roboverse', name: 'Roboverse', category: 'AI', priority: 'medium' },
  { handle: '@MarcinAI', name: 'Marcin AI', category: 'AI', priority: 'medium' },
  { handle: '@JonMac', name: 'Jon Mac', category: 'Business', priority: 'medium' },
  { handle: '@DarTheHighLevelGuy', name: 'Dar The High Level Guy', category: 'Business', priority: 'medium' },
  { handle: '@ArlanHamilton', name: 'Arlan Hamilton', category: 'Business', priority: 'medium' },
  { handle: '@AIandTechforEducation', name: 'AI and Tech for Education', category: 'Education', priority: 'medium' },
  { handle: '@TheMetaverseGuy', name: 'The Metaverse Guy', category: 'Tech', priority: 'medium' },
  { handle: '@HerEcomToolkit', name: 'Her Ecom Toolkit', category: 'Business', priority: 'medium' },
  { handle: '@JoshuaMayo', name: 'Joshua Mayo', category: 'Business', priority: 'medium' },
  { handle: '@JourneyWithTheHintons', name: 'Journey With The Hintons', category: 'Business', priority: 'low' },
  { handle: '@Enovair', name: 'Enovair', category: 'Tech', priority: 'low' },
  { handle: '@SuccessWithSam', name: 'Success With Sam', category: 'Business', priority: 'low' },
  { handle: '@NickSaraev', name: 'Nick Saraev', category: 'Business', priority: 'low' },
  { handle: '@LifeWithJazzyMac', name: 'Life With Jazzy Mac', category: 'Business', priority: 'low' },
  { handle: '@TinaHuang', name: 'Tina Huang', category: 'Tech', priority: 'low' },
  { handle: '@PowerAndPeaceLofi', name: 'Power and Peace Lofi', category: 'Tech', priority: 'low' },
  
  // ============================================
  // NICHE TOPICS & OTHER CHANNELS
  // ============================================
  { handle: '@KimberlyMitchell', name: 'Kimberly Mitchell', category: 'Business', priority: 'low' },
  { handle: '@LatoyaNicoleOfficial', name: 'Latoya Nicole Official', category: 'Business', priority: 'low' },
  { handle: '@MonicaLee', name: 'Monica Lee', category: 'Business', priority: 'low' },
  { handle: '@EmmanuelCrown', name: 'Emmanuel Crown', category: 'Business', priority: 'low' },
  { handle: '@AfricaAmaze', name: 'AfricaAmaze', category: 'Business', priority: 'low' },
  { handle: '@FranklinHatchett', name: 'Franklin Hatchett', category: 'Business', priority: 'low' },
  { handle: '@WritingSecrets', name: 'WritingSecrets', category: 'Business', priority: 'low' },
  { handle: '@FlipWithRick', name: 'Flip With Rick', category: 'Business', priority: 'low' },
  { handle: '@CircleOfGreatness', name: 'CircleOfGreatness', category: 'Business', priority: 'low' },
  { handle: '@AdamErhart', name: 'Adam Erhart', category: 'Business', priority: 'low' },
  { handle: '@JordanPlatten', name: 'Jordan Platten', category: 'Business', priority: 'low' },
  { handle: '@BenHeath', name: 'Ben Heath', category: 'Business', priority: 'low' },
  { handle: '@LoriBallen', name: 'Lori Ballen', category: 'Business', priority: 'low' },
  { handle: '@NickPonte', name: 'Nick Ponte', category: 'Business', priority: 'low' },
  { handle: '@TamronHallShow', name: 'Tamron Hall Show', category: 'Business', priority: 'low' },
  { handle: '@DaeronMyers', name: 'Daeron Myers', category: 'Business', priority: 'low' },
  { handle: '@KoenAIContentSystems', name: 'KoenAIContentSystems', category: 'Business', priority: 'low' },
  { handle: '@MattBritton', name: 'Matt Britton', category: 'Education', priority: 'low' },
  { handle: '@CXOTalk', name: 'CXOTalk', category: 'Business', priority: 'low' },
  { handle: '@ShopifyMasters', name: 'ShopifyMasters', category: 'Business', priority: 'low' },
  { handle: '@ItsKeaton', name: 'ItsKeaton', category: 'Business', priority: 'low' },
  { handle: '@MarketingAgainstTheGrain', name: 'MarketingAgainstTheGrain', category: 'Business', priority: 'low' },
  { handle: '@PeterYang', name: 'Peter Yang', category: 'Business', priority: 'low' },
  { handle: '@AverySmi', name: 'AverySmi', category: 'Education', priority: 'low' },
  { handle: '@Superwall', name: 'Superwall', category: 'Business', priority: 'low' },
  { handle: '@9x', name: '9x', category: 'Business', priority: 'low' },
  { handle: '@SantrelMedia', name: 'SantrelMedia', category: 'Business', priority: 'low' },
  { handle: '@Cybernews', name: 'Cybernews', category: 'Tech', priority: 'medium' },
  { handle: '@BrendanJowett', name: 'Brendan Jowett', category: 'Tech', priority: 'low' },
  { handle: '@AndyStapleton', name: 'Andy Stapleton', category: 'Education', priority: 'low' },
  { handle: '@metricsmule', name: 'metricsmule', category: 'Tech', priority: 'low' },
  { handle: '@CalebUlku', name: 'Caleb Ulku', category: 'Tech', priority: 'low' },
  { handle: '@TechKevin', name: 'TechKevin', category: 'Tech', priority: 'low' },
  { handle: '@WebDevelopete', name: 'WebDevelopete', category: 'Tutorials', priority: 'low' },
  { handle: '@ManuAGI', name: 'ManuAGI', category: 'AI', priority: 'low' },
  { handle: '@GHLWizard', name: 'GHLWizard', category: 'Business', priority: 'low' },
  { handle: '@RayAmjad', name: 'Ray Amjad', category: 'AI', priority: 'low' },
  { handle: '@BrainProject', name: 'BrainProject', category: 'AI', priority: 'low' },
  { handle: '@PouryaKordi', name: 'Pourya Kordi', category: 'AI', priority: 'low' },
  { handle: '@Extropic', name: 'Extropic', category: 'Tech', priority: 'low' },
  { handle: '@RobTheAIGuy', name: 'Rob The AI Guy', category: 'AI', priority: 'low' },
  { handle: '@SendPulse', name: 'SendPulse', category: 'Business', priority: 'low' },
  { handle: '@WebsiteLearners', name: 'WebsiteLearners', category: 'Tutorials', priority: 'medium' },
  { handle: '@TEDxTalks', name: 'TEDxTalks', category: 'Education', priority: 'medium' },
  { handle: '@WIRED', name: 'WIRED', category: 'Tech', priority: 'high' },
  { handle: '@StanfordOnline', name: 'StanfordOnline', category: 'Education', priority: 'high' },
  { handle: '@JohnHopeBryant', name: 'John Hope Bryant', category: 'Business', priority: 'low' },
  { handle: '@AiwithGary', name: 'AiwithGary', category: 'AI', priority: 'low' },
  { handle: '@BuildGreatProducts', name: 'BuildGreatProducts', category: 'Business', priority: 'low' },
  { handle: '@VirtualizationHowto', name: 'VirtualizationHowto', category: 'Tech', priority: 'low' },
  { handle: '@MoGawdat', name: 'Mo Gawdat', category: 'Business', priority: 'medium' },
  { handle: '@KellanHenneberry', name: 'Kellan Henneberry', category: 'Business', priority: 'low' },
  { handle: '@AiPerson', name: 'AiPerson', category: 'AI', priority: 'low' },
  { handle: '@CreatorMagic', name: 'CreatorMagic', category: 'Business', priority: 'low' },
  { handle: '@LisaCrosbie', name: 'LisaCrosbie', category: 'Business', priority: 'low' },
  { handle: '@JonnyShaipland', name: 'JonnyShaipland', category: 'Business', priority: 'low' },
  { handle: '@Musa', name: 'Musa', category: 'Business', priority: 'low' },
  { handle: '@SajjaadKhader', name: 'SajjaadKhader', category: 'Business', priority: 'low' },
  { handle: '@ReidHoffman', name: 'Reid Hoffman', category: 'Business', priority: 'high' },
  { handle: '@PromptEngineering', name: 'PromptEngineering', category: 'Education', priority: 'medium' },
  { handle: '@GenAIUniversity', name: 'GenAIUniversity', category: 'Education', priority: 'medium' },
  { handle: '@GaryVeeVlogs', name: 'GaryVeeVlogs', category: 'Business', priority: 'medium' },
  { handle: '@NickPuru', name: 'NickPuru', category: 'Business', priority: 'low' },
  { handle: '@TheRecap', name: 'TheRecap', category: 'Business', priority: 'low' },
];

/**
 * RSS.app Feed URLs
 * 
 * After setting up feeds on RSS.app, add your feed URLs here.
 * Format: https://rss.app/feeds/YOUR_FEED_ID.xml
 * 
 * Example:
 * export const RSSAPP_FEEDS = [
 *   { url: 'https://rss.app/feeds/abc123.xml', name: 'AI Channels Feed', category: 'AI' },
 *   { url: 'https://rss.app/feeds/def456.xml', name: 'Tech Channels Feed', category: 'Tech' },
 * ];
 */
export const RSSAPP_FEEDS: Array<{ url: string; name: string; category: string }> = [
  // Add your RSS.app feed URLs here after setup
  // { url: 'https://rss.app/feeds/YOUR_FEED_ID.xml', name: 'Your Feed Name', category: 'AI' },
];

/**
 * RSS.app Keywords
 * Keywords to filter content in RSS.app
 * Add these when creating feeds on RSS.app
 */
export const RSSAPP_KEYWORDS = [
  'Artificial Intelligence',
  'AI Tools',
  'ChatGPT',
  'Claude',
  'Gemini',
  'Machine Learning',
  'AI Tutorial',
  'AI News',
  'Tech News',
  'AI Business',
  'AI Automation',
  'AI Development',
  'AI Strategy',
  'AI Marketing',
  'Generative AI',
  'AI Agents',
  'AI Coding',
  'AI Video',
  'Google AI',
  'OpenAI',
  'Anthropic',
  'AI Innovation',
  'Tech Updates',
  'AI Side Hustle',
  'AI Monetization',
];

/**
 * RSS.app Feed Configuration
 * 
 * For 200+ channels, create multiple feeds for better performance:
 * - Feed 1: AI News & Updates (~30 channels)
 * - Feed 2: AI Tutorials & Education (~40 channels)
 * - Feed 3: AI Business & Monetization (~30 channels)
 * - Feed 4: Coding & Development (~30 channels)
 * - Feed 5: Everything Else (~40 channels)
 * 
 * OR create a single master feed with all channels
 */
export interface RSSAppFeedConfig {
  id: string;
  name: string;
  description: string;
  channelCount: number;
  updateFrequency: string; // e.g., '2-4 hours'
  itemsToShow: number; // 20-30 for master feed
  feedUrl?: string; // Add after creating on RSS.app
}

export const RSSAPP_FEED_CONFIGS: RSSAppFeedConfig[] = [
  {
    id: 'feed-1-ai-news',
    name: 'AI News & Updates',
    description: 'Latest AI news, updates, and breaking stories from top channels',
    channelCount: 30,
    updateFrequency: '2-4 hours',
    itemsToShow: 20,
  },
  {
    id: 'feed-2-ai-tutorials',
    name: 'AI Tutorials & Education',
    description: 'AI tutorials, courses, and educational content',
    channelCount: 40,
    updateFrequency: '2-4 hours',
    itemsToShow: 20,
  },
  {
    id: 'feed-3-ai-business',
    name: 'AI Business & Monetization',
    description: 'AI business strategies, monetization, and entrepreneurship',
    channelCount: 30,
    updateFrequency: '2-4 hours',
    itemsToShow: 20,
  },
  {
    id: 'feed-4-coding',
    name: 'Coding & Development',
    description: 'AI coding, development tutorials, and technical content',
    channelCount: 30,
    updateFrequency: '2-4 hours',
    itemsToShow: 20,
  },
  {
    id: 'feed-5-everything',
    name: 'Everything Else',
    description: 'Additional tech, design, productivity, and other channels',
    channelCount: 40,
    updateFrequency: '2-4 hours',
    itemsToShow: 20,
  },
  {
    id: 'feed-master',
    name: 'Master Feed (All Channels)',
    description: 'Single feed with all 200+ channels (updates every 2-4 hours)',
    channelCount: 200,
    updateFrequency: '2-4 hours',
    itemsToShow: 30,
  },
];

/**
 * Helper functions to get channels by feed category
 */
export function getChannelsForFeed1_AI_News(): RSSAppChannel[] {
  return RSSAPP_YOUTUBE_CHANNELS.filter(channel => 
    channel.category === 'AI' && 
    (channel.name.includes('News') || 
     channel.name.includes('Daily') || 
     channel.name.includes('Brief') ||
     channel.name.includes('Revolution') ||
     channel.name.includes('Updates') ||
     channel.handle === '@TheAIDailyBrief' ||
     channel.handle === '@AIRevolution' ||
     channel.handle === '@AINewsStrategyDaily' ||
     channel.handle === '@TheNextWave' ||
     channel.handle === '@AIForHumans' ||
     channel.handle === '@WesRoth' ||
     channel.handle === '@SciShow' ||
     channel.handle === '@HankGreen' ||
     channel.handle === '@MarquesBrownlee' ||
     channel.handle === '@OpenAI' ||
     channel.handle === '@Anthropic' ||
     channel.handle === '@NVIDIA' ||
     channel.handle === '@IBMTechnology' ||
     channel.handle === '@TechCrunch' ||
     channel.handle === '@WIRED' ||
     channel.handle === '@CNBC' ||
     channel.handle === '@BloombergTelevision' ||
     channel.handle === '@BusinessInsider' ||
     channel.handle === '@FinancialTimes' ||
     channel.handle === '@ABCNews' ||
     channel.priority === 'high')
  ).slice(0, 30);
}

export function getChannelsForFeed2_AI_Tutorials(): RSSAppChannel[] {
  return RSSAPP_YOUTUBE_CHANNELS.filter(channel => 
    channel.category === 'Education' || 
    channel.category === 'Tutorials' ||
    (channel.category === 'AI' && (
      channel.name.includes('Tutorial') ||
      channel.name.includes('Learn') ||
      channel.name.includes('Guide') ||
      channel.name.includes('How to') ||
      channel.handle === '@AliHSalem' ||
      channel.handle === '@NateHerk' ||
      channel.handle === '@RickMulready' ||
      channel.handle === '@PunitChawla' ||
      channel.handle === '@Futurepedia' ||
      channel.handle === '@JeffSu' ||
      channel.handle === '@AlexFinn' ||
      channel.handle === '@3Blue1Brown' ||
      channel.handle === '@edureka' ||
      channel.handle === '@Simplilearn' ||
      channel.handle === '@StanfordOnline' ||
      channel.handle === '@GoogleCareerCertificates' ||
      channel.handle === '@CS50' ||
      channel.handle === '@TEDxTalks' ||
      channel.handle === '@KevinStratvert' ||
      channel.handle === '@PromptEngineering' ||
      channel.handle === '@GenAIUniversity'
    ))
  ).slice(0, 40);
}

export function getChannelsForFeed3_AI_Business(): RSSAppChannel[] {
  return RSSAPP_YOUTUBE_CHANNELS.filter(channel => 
    channel.category === 'Business' ||
    (channel.name.includes('Money') ||
     channel.name.includes('Business') ||
     channel.name.includes('Monetization') ||
     channel.name.includes('Entrepreneur') ||
     channel.name.includes('Startup') ||
     channel.name.includes('Marketing') ||
     channel.handle === '@MakeMoneyWithStacyLa' ||
     channel.handle === '@JesseCunningham' ||
     channel.handle === '@GillianPerkins' ||
     channel.handle === '@ENERGI' ||
     channel.handle === '@JeffSetLife' ||
     channel.handle === '@SuperHumansLife' ||
     channel.handle === '@JordanWelch' ||
     channel.handle === '@NathanNazareth' ||
     channel.handle === '@SoloShannon' ||
     channel.handle === '@AcHampton' ||
     channel.handle === '@LunaVega' ||
     channel.handle === '@WholesaleTed' ||
     channel.handle === '@MyFirstMillion' ||
     channel.handle === '@GregIsenberg' ||
     channel.handle === '@SimonSquibb' ||
     channel.handle === '@TomBilyeu' ||
     channel.handle === '@YCombinator' ||
     channel.handle === '@ThisWeekInStartups' ||
     channel.handle === '@a16z' ||
     channel.handle === '@NeilPatel' ||
     channel.handle === '@LennysPodcast' ||
     channel.handle === '@TheDiaryOfACEO' ||
     channel.handle === '@TiagoForte' ||
     channel.handle === '@AliAbdaal' ||
     channel.handle === '@CharlieChang' ||
     channel.handle === '@GaryVee' ||
     channel.handle === '@GaryVeeVlogs' ||
     channel.handle === '@ReidHoffman')
  ).slice(0, 30);
}

export function getChannelsForFeed4_Coding(): RSSAppChannel[] {
  return RSSAPP_YOUTUBE_CHANNELS.filter(channel => 
    channel.category === 'Tutorials' ||
    (channel.name.includes('Code') ||
     channel.name.includes('Coding') ||
     channel.name.includes('Development') ||
     channel.name.includes('Programming') ||
     channel.name.includes('Developer') ||
     channel.handle === '@RileyBrown' ||
     channel.handle === '@JayPeters' ||
     channel.handle === '@PedroTech' ||
     channel.handle === '@SWErikCodes' ||
     channel.handle === '@TraversyMedia' ||
     channel.handle === '@Fireship' ||
     channel.handle === '@BlazingZebra' ||
     channel.handle === '@CodeAProgram' ||
     channel.handle === '@Wanderloots' ||
     channel.handle === '@AIJason' ||
     channel.handle === '@RasBuilds' ||
     channel.handle === '@VoloBuilds' ||
     channel.handle === '@StarterStoryBuild' ||
     channel.handle === '@Lattice' ||
     channel.handle === '@Theo-t3gg' ||
     channel.handle === '@CS50' ||
     channel.handle === '@WebsiteLearners' ||
     channel.handle === '@WebDevelopete' ||
     channel.handle === '@GoogleWorkspaceDevelopers' ||
     channel.handle === '@GoogleCloudTech' ||
     channel.handle === '@GoogleCloud' ||
     channel.handle === '@corbin' ||
     channel.handle === '@Figma' ||
     channel.handle === '@JesseShowalter')
  ).slice(0, 30);
}

export function getChannelsForFeed5_Everything(): RSSAppChannel[] {
  // Get all channels that weren't included in the first 4 feeds
  const feed1Handles = new Set(getChannelsForFeed1_AI_News().map(c => c.handle));
  const feed2Handles = new Set(getChannelsForFeed2_AI_Tutorials().map(c => c.handle));
  const feed3Handles = new Set(getChannelsForFeed3_AI_Business().map(c => c.handle));
  const feed4Handles = new Set(getChannelsForFeed4_Coding().map(c => c.handle));
  
  const allUsedHandles = new Set([...feed1Handles, ...feed2Handles, ...feed3Handles, ...feed4Handles]);
  
  return RSSAPP_YOUTUBE_CHANNELS.filter(channel => 
    !allUsedHandles.has(channel.handle)
  ).slice(0, 40);
}

/**
 * Get all channels for master feed (all channels)
 */
export function getAllChannelsForMasterFeed(): RSSAppChannel[] {
  return RSSAPP_YOUTUBE_CHANNELS;
}

/**
 * Get channel handles as a simple array (for copy/paste into RSS.app)
 */
export function getChannelHandlesForFeed(feedId: string): string[] {
  let channels: RSSAppChannel[];
  
  switch (feedId) {
    case 'feed-1-ai-news':
      channels = getChannelsForFeed1_AI_News();
      break;
    case 'feed-2-ai-tutorials':
      channels = getChannelsForFeed2_AI_Tutorials();
      break;
    case 'feed-3-ai-business':
      channels = getChannelsForFeed3_AI_Business();
      break;
    case 'feed-4-coding':
      channels = getChannelsForFeed4_Coding();
      break;
    case 'feed-5-everything':
      channels = getChannelsForFeed5_Everything();
      break;
    case 'feed-master':
      channels = getAllChannelsForMasterFeed();
      break;
    default:
      channels = [];
  }
  
  return channels.map(c => c.handle);
}

