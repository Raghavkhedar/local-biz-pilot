import React from 'react';
import { Button } from '@/components/ui/button';
import { Backspace } from 'lucide-react';

interface NumericKeypadProps {
  onKeyPress: (value: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ onKeyPress, onBackspace, onClear }) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

  const handleKeyClick = (key: string) => {
    switch (key) {
      case '⌫':
        onBackspace();
        break;
      case 'C':
        onClear();
        break;
      default:
        onKeyPress(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto">
      {keys.map((key) => (
        <Button
          key={key}
          variant={key === 'C' ? 'destructive' : 'outline'}
          className="h-12 text-lg font-semibold"
          onClick={() => handleKeyClick(key)}
        >
          {key === '⌫' ? <Backspace className="h-5 w-5" /> : key}
        </Button>
      ))}
    </div>
  );
};

export default NumericKeypad;