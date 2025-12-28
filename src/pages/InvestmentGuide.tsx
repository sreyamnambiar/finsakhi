import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import '../styles/InvestmentGuide.css';

type Option = {
    id: number;
    title: string;
    points: string[];
    website: string;
    video: string;
};

const investmentOptions: Option[] = [
  {
    id: 1,
    title: 'Fixed Deposit (FD)',
    points: [
      'கட்டுப்பட்ட வட்டி விகிதத்தில் உத்தரவாதமான வருமானம்',
      'குறைந்த ஆபத்து; குறுகிய அல்லது நடுத்தர காலத்திற்குப் பொருத்தமானது',
      'பேங்குகளில் எளிதாக FD-ஐ தொடங்கலாம்',
      'பதிவு மற்றும் கணக்கு பராமரிப்பு எளிது',
      'முதலீடு பாதுகாப்பானது; குடும்ப நிதி பாதுகாப்புக்கு ஏற்றது'
    ],
    website: 'https://v.hdfcbank.com/amp/personal/save/deposits/fixed-deposit.html',
    video: '/videos/fd.mp4'
  },
  {
    id: 2,
    title: 'Public Provident Fund (PPF)',
    points: [
      'நீண்டகாலம்; வரி விலக்கு (Section 80C கீழ்)',
      'அரசு உத்தரவாதம் மற்றும் 15 ஆண்டு பூட்டப்பட்ட காலம்',
      'ஓய்வூதிய மற்றும் நீண்டகால சேமிப்புக்கு சிறந்த தேர்வு',
      'வருமானம் வரி விலக்கு மற்றும் சுத்தமான வளர்ச்சி',
      'மாதாந்திர/ஒற்றை தொகுதிகளில் சேமித்து திட்டமிடலாம்'
    ],
    website: 'https://dea.gov.in/index.php/taxonomy/term/497',
    video: '/videos/ppf.mp4'
  },
  {
    id: 3,
    title: 'Mutual Funds (SIP)',
    points: [
      'தொழில்முறை நிதி மேலாண்மை மூலம் முதலீடு',
      'SIP மூலம் சிறிய மாதாந்திர தொகுதிகள் முதலீடு செய்யலாம்',
      'நீண்டகாலத்தில் செல்வ வளத்தை உருவாக்க உதவும்',
      'ஆஸ்தி வகைகளைப் பிரித்து (diversification) ஆபத்து குறைக்கிறது',
      'செற்பஒத்த வளர்ச்சி மற்றும் திருப்பத்திற்கான வாய்ப்பு அதிகம்'
    ],
    website: 'https://www.sbimf.com/',
    video: '/videos/sip.mp4'
  }
];

const InvestmentGuide: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full hover:bg-pink-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Guide</h1>
            <p className="text-gray-600 mt-1">முதலீட்டு வழிகாட்டி</p>
          </div>
        </div>

        <div className="ig-list">
          {investmentOptions.map(opt => (
            <div key={opt.id} className="ig-card">
              <h2 className="card-title">{opt.title}</h2>

              <ul className="card-points">
                {opt.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <div className="card-media">
                <video
                  src={opt.video}
                  controls
                  preload="metadata"
                  className="card-video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="card-actions">
                <a
                  href={opt.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-link"
                >
                  Official Link
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestmentGuide;
