'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Building2, Users, TrendingUp } from 'lucide-react';

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (creds: LoginCredentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creds),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      login(data.data);
      router.push('/');
    },
    onError: (err) => {
      setError('Invalid email or password');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    loginMutation.mutate(credentials);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Demo credentials with role mapping
  const demoUsers = [
    { email: 'requester@company.com', role: 'Requester', password: 'password' },
    { email: 'buyer@company.com', role: 'Buyer', password: 'password' },
    { email: 'approver@company.com', role: 'Approver', password: 'password' },
    { email: 'finance@company.com', role: 'Finance', password: 'password' },
    { email: 'admin@company.com', role: 'Admin', password: 'password' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Marketing content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">ProcureFlow</h1>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Streamline Your 
              <span className="text-primary"> Procurement</span> Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-lg">
              Modern procurement management platform with vendor management, purchasing, invoicing, and analytics. Built for efficiency and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-card border">
              <Building2 className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Vendor Management</h3>
              <p className="text-sm text-muted-foreground">Onboard and manage vendors with risk scoring</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Approval Workflows</h3>
              <p className="text-sm text-muted-foreground">Multi-level approvals with audit trails</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-card border">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-muted-foreground">Real-time insights and reporting</p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="max-w-md mx-auto w-full">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the procurement portal
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <div className="wave-group">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                    <label className="label">
                      {"Email".split('').map((char, i) => (
                        <span className="label-char" style={{ '--index': i } as any} key={i}>
                          {char}
                        </span>
                      ))}
                    </label>
                    <span className="bar"></span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="wave-group">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                    <label className="label">
                      {"Password".split('').map((char, i) => (
                        <span className="label-char" style={{ '--index': i } as any} key={i}>
                          {char}
                        </span>
                      ))}
                    </label>
                    <span className="bar"></span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-2">Demo Users:</p>
                  <div className="space-y-1">
                    {demoUsers.map((user, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                          setCredentials({
                            email: user.email,
                            password: user.password,
                          });
                        }}
                      >
                        <span className="font-medium">{user.email}</span>
                        <span className="ml-auto text-muted-foreground">({user.role})</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
