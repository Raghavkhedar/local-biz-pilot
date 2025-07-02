
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, businessProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Please enter your PIN');
      return;
    }

    setIsLoading(true);
    setError('');
    
    const success = await login(pin);
    if (!success) {
      setError('Invalid PIN. Please try again.');
    }
    
    setIsLoading(false);
  };

  const quickPin = (pinValue: string) => {
    setPin(pinValue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              {businessProfile?.companyName || 'BizManager'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium text-slate-700">
                Enter PIN
              </label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your 4-digit PIN"
                  className="pr-10 h-12 text-center text-lg tracking-widest border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Signing In...
                </div>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-slate-500 text-center">Quick Access</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickPin('1234')}
                className="h-10 border-slate-200 hover:bg-slate-50"
              >
                Owner (1234)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickPin('5678')}
                className="h-10 border-slate-200 hover:bg-slate-50"
              >
                Staff (5678)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
