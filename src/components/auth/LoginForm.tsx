
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm: React.FC = () => {
  const [pin, setPin] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast({
        title: 'Error',
        description: 'PIN must be 4 digits',
        variant: 'destructive',
      });
      return;
    }

    const success = await login(pin);
    if (!success) {
      toast({
        title: 'Error',
        description: 'Invalid PIN',
        variant: 'destructive',
      });
      setPin('');
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${pin[i] ? 'bg-primary' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
              <Button
                key={number}
                type="button"
                variant="outline"
                onClick={() => handleNumberClick(number)}
                className="h-12 text-lg"
              >
                {number}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="h-12 text-lg col-span-1"
            >
              C
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleNumberClick(0)}
              className="h-12 text-lg"
            >
              0
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleBackspace}
              className="h-12 text-lg"
            >
              ←
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={pin.length !== 4}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
