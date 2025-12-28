export interface Livelihood {
  id: string;
  name: {
    en: string;
    hi: string;
    ta: string;
  };
  description: {
    en: string;
    hi: string;
    ta: string;
  };
  estimatedIncome: {
    en: string;
    hi: string;
    ta: string;
  };
  workLocation: 'home' | 'nearby' | 'both';
  requiredHours: 'flexible' | '2-4' | '4-8' | '8+';
  requiresSmartphone: boolean;
  workCategories: string[];
  icon: string;
}

export const livelihoods: Livelihood[] = [
  {
    id: 'pottery',
    name: {
      en: 'Pottery Making',
      hi: 'मिट्टी के बर्तन बनाना',
      ta: 'பாத்திரம் செய்தல்',
    },
    description: {
      en: 'Make clay pots, plates, and decorative items at home. Sell these to shops and customers nearby. You can earn 200 to 500 rupees for each item you make.',
      hi: 'घर बैठे मिट्टी के बर्तन, थालियां और सजावटी चीजें बनाएं। इन्हें पास की दुकानों और ग्राहकों को बेचें। आप बनाई हुई हर चीज के लिए 200 से 500 रुपये कमा सकते हैं।',
      ta: 'வீட்டில் உட்கார்ந்து மண்ணால் சரायும் தட்டுக்கள், தாழிகள் மற்றும் அலங்கார பொருட்களை உருவாக்குங்கள். இவற்றை அருகிலுள்ள கடைகள் மற்றும் வாடிக்கையாளர்களுக்கு விற்கவும். நீங்கள் செய்த ஒவ்வொரு பொருளுக்கும் 200 முதல் 500 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹200-500 per item',
      hi: '₹200-500 प्रति वस्तु',
      ta: '₹200-500 ஒன்றுக்கு',
    },
    workLocation: 'home',
    requiredHours: 'flexible',
    requiresSmartphone: false,
    workCategories: ['arts', 'craft'],
    icon: '🏺',
  },
  {
    id: 'handicrafts',
    name: {
      en: 'Handmade Crafts',
      hi: 'हस्तशिल्प',
      ta: 'கையெழுத்து கலைகள்',
    },
    description: {
      en: 'Make handmade items like jewelry, scarves, baskets, or paintings at home. Sell these to friends, neighbors, or local shops. You can earn 150 to 400 rupees for each item sold.',
      hi: 'घर पर गहने, दुपट्टे, टोकरियां, या पेंटिंग जैसी हस्तनिर्मित चीजें बनाएं। इन्हें दोस्तों, पड़ोसियों या स्थानीय दुकानों को बेचें। आप हर बिकी हुई चीज के लिए 150 से 400 रुपये कमा सकते हैं।',
      ta: 'வீட்டில் உட்கார்ந்து நகை, சால், கூடை அல்லது அலங்கார பொருட்களை உருவாக்குங்கள். இவற்றை நண்பர்கள், அணைய வீட்டாரகள் அல்லது உள்ளூர் கடைகாரர்களுக்கு விற்கவும். நீங்கள் விற்ற ஒவ்வொரு பொருளுக்கும் 150 முதல் 400 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹150-400 per item',
      hi: '₹150-400 प्रति वस्तु',
      ta: '₹150-400 ஒன்றுக்கு',
    },
    workLocation: 'home',
    requiredHours: 'flexible',
    requiresSmartphone: false,
    workCategories: ['arts', 'craft'],
    icon: '🎨',
  },
  {
    id: 'tiffin',
    name: {
      en: 'Home Catering',
      hi: 'घर से टिफिन सेवा',
      ta: 'வீட்டு திபிन் சேவை',
    },
    description: {
      en: 'Cook healthy homemade food like rice, curry, bread, and sweets in your kitchen. Pack it nicely and deliver to office workers or families nearby. You can earn 300 to 800 rupees every day from selling food.',
      hi: 'अपनी रसोई में चावल, करी, रोटी और मिठाई जैसा स्वास्थ्यकर घर का खाना बनाएं। इसे अच्छे से पैक करके पास के कार्यालय में काम करने वाले या परिवारों को दिलवाएं। भोजन बेचकर आप हर दिन 300 से 800 रुपये कमा सकते हैं।',
      ta: 'உங்கள் சமையலறையில் அரிசி, கறி, ரோட்டி மற்றும் இனிப்பு போன்ற ஆரோக்கியமான வீட்டு உணவு சமைக்கவும். இதை நன்றாக பொதிந்து அருகிலுள்ள அலுவலக பணியாளர்களுக்கு அல்லது குடும்பங்களுக்கு வழங்கவும். நீங்கள் உணவு விற்று ஒவ்வொரு நாளும் 300 முதல் 800 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹300-800 per day',
      hi: '₹300-800 प्रति दिन',
      ta: '₹300-800 தினமும்',
    },
    workLocation: 'nearby',
    requiredHours: '4-8',
    requiresSmartphone: false,
    workCategories: ['home-based', 'daily'],
    icon: '🍱',
  },
  {
    id: 'tailoring',
    name: {
      en: 'Tailoring & Alterations',
      hi: 'दर्जी का काम',
      ta: 'தையல் வேலை',
    },
    description: {
      en: 'Use a sewing machine to stitch new clothes or repair old ones for people in your area. Shorten pants, fix tears, and make simple clothes. You can earn 200 to 600 rupees for each piece of clothing you make or repair.',
      hi: 'सिलाई मशीन का उपयोग करके अपने इलाके के लोगों के लिए नए कपड़े सिलाई करें या पुराने कपड़ों की मरम्मत करें। पैंट छोटे करें, फाड़ को ठीक करें, और साधारण कपड़े बनाएं। आप तैयार या मरम्मत किए गए हर कपड़े के लिए 200 से 600 रुपये कमा सकते हैं।',
      ta: 'தைக்கும் இயந்திரத்தைப் பயன்படுத்தி உங்கள் பகுதியில் உள்ள மக்களுக்கான புதிய ஆடைகளை தையல் செய்யுங்கள் அல்லது பழைய ஆடைகளை பழுதுபார்க்கவும். பாவாடைகளை சுருக்கவும், கிழிசல்களை சரிசெய்யவும், மற்றும் எளிய ஆடைகளை உருவாக்கவும். நீங்கள் செய்த அல்லது பழுதுபார்த்த ஒவ்வொரு ஆடைக்கும் 200 முதல் 600 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹200-600 per garment',
      hi: '₹200-600 प्रति कपड़ा',
      ta: '₹200-600 ஆடைக்கு',
    },
    workLocation: 'home',
    requiredHours: 'flexible',
    requiresSmartphone: false,
    workCategories: ['home-based', 'craft'],
    icon: '🧵',
  },
  {
    id: 'vegetable',
    name: {
      en: 'Farm Fresh Produce',
      hi: 'सब्जी और फल बेचना',
      ta: 'காய்கறி மற்றும் பழ விற்பனை',
    },
    description: {
      en: 'Buy fresh vegetables and fruits from wholesale markets early in the morning. Then sell them to neighbors and local shops throughout the day. You can earn 400 to 1000 rupees every day by selling fresh produce.',
      hi: 'सुबह-सुबह थोक बाजार से ताजी सब्जियां और फल खरीदें। फिर पूरे दिन पड़ोसियों और स्थानीय दुकानों को बेचें। ताजी चीजें बेचकर आप हर दिन 400 से 1000 रुपये कमा सकते हैं।',
      ta: 'அதிகாலையில் மொத்த சந்தையிலிருந்து தாজா காய்கறிகள் மற்றும் பழங்களை வாங்கி உங்கள் பகுதியில் உள்ள மக்களுக்கு விற்கவும். பிற்பகலியில் உள்ள அருகிலுள்ள கடைகாரர்களுக்கும் விற்கவும். நீங்கள் நாளைய பொருட்களை விற்று ஒவ்வொரு நாளும் 400 முதல் 1000 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹400-1000 per day',
      hi: '₹400-1000 प्रति दिन',
      ta: '₹400-1000 தினமும்',
    },
    workLocation: 'nearby',
    requiredHours: '4-8',
    requiresSmartphone: false,
    workCategories: ['daily', 'small-business'],
    icon: '🥬',
  },
  {
    id: 'shophelper',
    name: {
      en: 'Retail Assistant',
      hi: 'स्थानीय दुकान में मदद करना',
      ta: 'உள்ளூர் கடையில் உதவி செய்தல்',
    },
    description: {
      en: 'Work a few hours each day helping at local grocery shops or small stores. You will count money, arrange goods, and help customers. You can earn 250 to 500 rupees every day for this work.',
      hi: 'हर दिन कुछ घंटे के लिए पास की किराना दुकान या छोटी दुकान में काम करें। आप पैसे गिनेंगे, सामान लगाएंगे, और ग्राहकों की मदद करेंगे। इस काम के लिए आप हर दिन 250 से 500 रुपये कमा सकते हैं।',
      ta: 'உள्ளூர் கிரான்यத कடை அல்லது சிறிய கடையில் தினமும் சில மணி நேரம் உதவி செய்யும் வேலை செய்யவும். நீங்கள் பணத்தை கணக்கிட்டு, பொருட்கள் அமைத்து, வாடிக்கையாளர்களுக்கு உதவி செய்வீர்கள். இந்த வேலைக்கு நீங்கள் ஒவ்வொரு நாளும் 250 முதல் 500 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹250-500 per day',
      hi: '₹250-500 प्रति दिन',
      ta: '₹250-500 தினமும்',
    },
    workLocation: 'nearby',
    requiredHours: '2-4',
    requiresSmartphone: false,
    workCategories: ['daily'],
    icon: '🛒',
  },
  {
    id: 'onlineselling',
    name: {
      en: 'E-commerce Seller',
      hi: 'ऑनलाइन बिक्री',
      ta: 'ஆன்லைன் விற்பனை',
    },
    description: {
      en: 'If you have a smartphone, you can sell handmade items or goods on online shopping websites like Amazon or Flipkart. Customers from other cities will buy from you. You can earn 500 to 2000 rupees every day by selling online.',
      hi: 'यदि आपके पास स्मार्टफोन है, तो आप Amazon या Flipkart जैसी ऑनलाइन खरीदारी की वेबसाइटों पर हस्तनिर्मित चीजें या सामान बेच सकते हैं। दूसरे शहरों के ग्राहक आपसे खरीदेंगे। ऑनलाइन बेचकर आप हर दिन 500 से 2000 रुपये कमा सकते हैं।',
      ta: 'உங்களிடம் ஸ்மார்ட்ஃபோன் இருந்தால், Amazon அல்லது Flipkart போன்ற ஆன்லைன் உங்கள் தளங்களில் கைவினைப் பொருட்களை விற்கலாம். வேறு நகரங்களிலிருந்து வாடிக்கையாளர்கள் உங்களிடம் இருந்து வாங்குவார்கள். நீங்கள் ஆன்லைனில் விற்று ஒவ்வொரு நாளும் 500 முதல் 2000 ரூபாய் வரை சம்பாதிக்கலாம்.',
    },
    estimatedIncome: {
      en: '₹500-2000 per day',
      hi: '₹500-2000 प्रति दिन',
      ta: '₹500-2000 தினமும்',
    },
    workLocation: 'home',
    requiredHours: '2-4',
    requiresSmartphone: true,
    workCategories: ['digital', 'small-business'],
    icon: '💻',
  },
];

export interface UserPreferences {
  workType: string[];
  hours: string;
  location: string;
  smartphone: boolean;
  skills: string;
  capital: string;
}

export const matchLivelihoods = (preferences: UserPreferences): Livelihood[] => {
  return livelihoods.filter((livelihood) => {
    // Check work type match
    const typeMatch = preferences.workType.some((type) =>
      livelihood.workCategories.includes(type)
    );
    if (!typeMatch) return false;

    // Check hours match
    if (preferences.hours === '2-4' && !['flexible', '2-4'].includes(livelihood.requiredHours)) {
      return false;
    }
    if (preferences.hours === '4-8' && !['flexible', '4-8', '2-4'].includes(livelihood.requiredHours)) {
      return false;
    }
    if (preferences.hours === '8+' && livelihood.requiredHours === '8+') {
      // Allow all for 8+ hours
    }

    // Check location match
    if (preferences.location === 'home' && !['home', 'both'].includes(livelihood.workLocation)) {
      return false;
    }
    if (preferences.location === 'nearby' && !['nearby', 'both'].includes(livelihood.workLocation)) {
      return false;
    }

    // Check smartphone requirement
    if (livelihood.requiresSmartphone && !preferences.smartphone) {
      return false;
    }

    return true;
  });
};

// UI Component
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Clock, MapPin, Smartphone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Livelihoods() {
  const navigate = useNavigate();
  const { settings } = useAppStore();
  const lang = settings.language as 'en' | 'hi' | 'ta';

  const [preferences, setPreferences] = useState<UserPreferences>({
    workType: [],
    hours: 'flexible',
    location: 'both',
    smartphone: false,
    skills: '',
    capital: 'low',
  });

  const [showResults, setShowResults] = useState(false);

  const handleWorkTypeToggle = (type: string) => {
    setPreferences((prev) => ({
      ...prev,
      workType: prev.workType.includes(type)
        ? prev.workType.filter((t) => t !== type)
        : [...prev.workType, type],
    }));
  };

  const handleSearch = () => {
    setShowResults(true);
  };

  const matchedLivelihoods = showResults
    ? matchLivelihoods(preferences)
    : livelihoods;

  const workTypes = [
    { id: 'arts', label: { en: 'Arts & Crafts', hi: 'कला और शिल्प', ta: 'கலை மற்றும் கைவினை' } },
    { id: 'craft', label: { en: 'Handicrafts', hi: 'हस्तशिल्प', ta: 'கையெழுத்து' } },
    { id: 'home-based', label: { en: 'Home Based', hi: 'घर से काम', ta: 'வீட்டு வேலை' } },
    { id: 'daily', label: { en: 'Daily Work', hi: 'दैनिक काम', ta: 'தினசரி வேலை' } },
    { id: 'small-business', label: { en: 'Small Business', hi: 'छोटा व्यवसाय', ta: 'சிறிய தொழில்' } },
    { id: 'digital', label: { en: 'Digital Work', hi: 'डिजिटल काम', ta: 'டிஜிட்டல் வேலை' } },
  ];

  const titles = {
    en: 'Livelihood Opportunities',
    hi: 'आजीविका के अवसर',
    ta: 'வாழ்வாதார வாய்ப்புகள்',
  };

  const filterTitle = {
    en: 'Find Your Match',
    hi: 'अपने लिए खोजें',
    ta: 'உங்களுக்கு தேடுங்கள்',
  };

  const workTypeLabel = {
    en: 'What type of work interests you?',
    hi: 'आपको किस प्रकार का काम पसंद है?',
    ta: 'உங்களுக்கு என்ன வகை வேலை ஆர்வம்?',
  };

  const hoursLabel = {
    en: 'How many hours can you work per day?',
    hi: 'आप प्रतिदिन कितने घंटे काम कर सकते हैं?',
    ta: 'நீங்கள் தினமும் எத்தனை மணி நேரம் வேலை செய்யலாம்?',
  };

  const locationLabel = {
    en: 'Where would you prefer to work?',
    hi: 'आप कहां काम करना पसंद करेंगे?',
    ta: 'நீங்கள் எங்கு வேலை செய்ய விரும்புகிறீர்கள்?',
  };

  const smartphoneLabel = {
    en: 'Do you have a smartphone?',
    hi: 'क्या आपके पास स्मार्टफोन है?',
    ta: 'உங்களிடம் ஸ்மார்ட்ஃபோன் உள்ளதா?',
  };

  const searchButton = {
    en: 'Find Opportunities',
    hi: 'अवसर खोजें',
    ta: 'வாய்ப்புகளை கண்டுபிடி',
  };

  const resetButton = {
    en: 'Show All',
    hi: 'सभी दिखाएं',
    ta: 'அனைத்தும் காட்டு',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full hover:bg-pink-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{titles[lang]}</h1>
            <p className="text-gray-600 mt-1">
              {lang === 'en' && 'Discover income opportunities that match your skills'}
              {lang === 'hi' && 'अपने कौशल से मेल खाने वाली आय के अवसर खोजें'}
              {lang === 'ta' && 'உங்கள் திறன்களுக்கு பொருந்தும் வருமான வாய்ப்புகளை கண்டறியுங்கள்'}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <Card className="mb-8 border-pink-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
            <CardTitle className="flex items-center gap-2 text-rose-600">
              <Briefcase className="h-5 w-5" />
              {filterTitle[lang]}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Work Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{workTypeLabel[lang]}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {workTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100 hover:border-pink-300 transition-colors cursor-pointer"
                    onClick={() => handleWorkTypeToggle(type.id)}
                  >
                    <Checkbox
                      id={type.id}
                      checked={preferences.workType.includes(type.id)}
                      onCheckedChange={() => handleWorkTypeToggle(type.id)}
                    />
                    <Label htmlFor={type.id} className="cursor-pointer flex-1">
                      {type.label[lang]}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {hoursLabel[lang]}
              </Label>
              <RadioGroup value={preferences.hours} onValueChange={(val) => setPreferences({ ...preferences, hours: val })}>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="flexible" id="flexible" />
                  <Label htmlFor="flexible">
                    {lang === 'en' && 'Flexible hours'}
                    {lang === 'hi' && 'लचीले घंटे'}
                    {lang === 'ta' && 'நெகிழ்வான மணி'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="2-4" id="2-4" />
                  <Label htmlFor="2-4">
                    {lang === 'en' && '2-4 hours'}
                    {lang === 'hi' && '2-4 घंटे'}
                    {lang === 'ta' && '2-4 மணி'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="4-8" id="4-8" />
                  <Label htmlFor="4-8">
                    {lang === 'en' && '4-8 hours'}
                    {lang === 'hi' && '4-8 घंटे'}
                    {lang === 'ta' && '4-8 மணி'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="8+" id="8+" />
                  <Label htmlFor="8+">
                    {lang === 'en' && '8+ hours (full time)'}
                    {lang === 'hi' && '8+ घंटे (पूर्णकालिक)'}
                    {lang === 'ta' && '8+ மணி (முழு நேரம்)'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Location Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {locationLabel[lang]}
              </Label>
              <RadioGroup value={preferences.location} onValueChange={(val) => setPreferences({ ...preferences, location: val })}>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    {lang === 'en' && 'From home'}
                    {lang === 'hi' && 'घर से'}
                    {lang === 'ta' && 'வீட்டிலிருந்து'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="nearby" id="nearby" />
                  <Label htmlFor="nearby">
                    {lang === 'en' && 'Nearby location'}
                    {lang === 'hi' && 'पास का स्थान'}
                    {lang === 'ta' && 'அருகில் உள்ள இடம்'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-pink-100">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both">
                    {lang === 'en' && 'Both options'}
                    {lang === 'hi' && 'दोनों विकल्प'}
                    {lang === 'ta' && 'இரண்டும்'}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Smartphone Check */}
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-pink-100">
              <Checkbox
                id="smartphone"
                checked={preferences.smartphone}
                onCheckedChange={(checked) => setPreferences({ ...preferences, smartphone: checked as boolean })}
              />
              <Label htmlFor="smartphone" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-4 w-4" />
                {smartphoneLabel[lang]}
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                {searchButton[lang]}
              </Button>
              {showResults && (
                <Button
                  onClick={() => setShowResults(false)}
                  variant="outline"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  {resetButton[lang]}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedLivelihoods.map((livelihood, index) => (
            <motion.div
              key={livelihood.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-pink-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-br from-pink-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                        <span className="text-3xl">{livelihood.icon}</span>
                        {livelihood.name[lang]}
                      </CardTitle>
                      <CardDescription className="mt-2 text-rose-600 font-semibold">
                        {livelihood.estimatedIncome[lang]}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-gray-700 leading-relaxed">{livelihood.description[lang]}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-pink-300 text-pink-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {livelihood.requiredHours}
                    </Badge>
                    <Badge variant="outline" className="border-pink-300 text-pink-700">
                      {livelihood.workLocation === 'home' && <Home className="h-3 w-3 mr-1" />}
                      {livelihood.workLocation !== 'home' && <MapPin className="h-3 w-3 mr-1" />}
                      {lang === 'en' && livelihood.workLocation}
                      {lang === 'hi' && (livelihood.workLocation === 'home' ? 'घर' : livelihood.workLocation === 'nearby' ? 'पास' : 'दोनों')}
                      {lang === 'ta' && (livelihood.workLocation === 'home' ? 'வீடு' : livelihood.workLocation === 'nearby' ? 'அருகில்' : 'இரண்டும்')}
                    </Badge>
                    {livelihood.requiresSmartphone && (
                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                        <Smartphone className="h-3 w-3 mr-1" />
                        {lang === 'en' && 'Smartphone needed'}
                        {lang === 'hi' && 'स्मार्टफोन चाहिए'}
                        {lang === 'ta' && 'ஸ்மார்ட்ஃபோன் தேவை'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {matchedLivelihoods.length === 0 && showResults && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {lang === 'en' && 'No opportunities match your filters. Try adjusting your preferences.'}
              {lang === 'hi' && 'आपके फ़िल्टर से कोई अवसर मेल नहीं खाता। अपनी प्राथमिकताओं को समायोजित करने का प्रयास करें।'}
              {lang === 'ta' && 'உங்கள் வடிப்பானுக்கு எந்த வாய்ப்பும் பொருந்தவில்லை. உங்கள் விருப்பங்களை சரிசெய்ய முயற்சிக்கவும்.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}