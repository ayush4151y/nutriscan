'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  BookUser,
  HelpCircle,
  Loader2,
  Mail,
  Menu,
  Moon,
  Save,
  Shield,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useState, useEffect, useRef, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { sendFeedback, type FeedbackState } from '@/app/actions';
import { cn } from '@/lib/utils';

type Profile = {
  name: string;
  age: string;
  weight: string;
  allergies: string;
  healthConcerns: string;
};

const initialFeedbackState: FeedbackState = {
  status: 'initial',
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Feedback'
      )}
    </Button>
  );
}

function ContactSupportSheet() {
  const [state, formAction] = useActionState(
    sendFeedback,
    initialFeedbackState
  );
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'initial') return;

    if (state.status === 'success') {
      toast({
        title: 'Feedback Sent!',
        description: state.message,
      });
      setIsOpen(false);
      formRef.current?.reset();
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 h-auto">
          Contact Support/Feedback
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[320px] sm:w-[400px] p-0 flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Contact Support / Feedback
          </SheetTitle>
          <SheetDescription>
            Have a question or feedback? Fill out the form below.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <form
            ref={formRef}
            action={formAction}
            className="space-y-4 px-6 pb-6"
          >
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Your feedback or question..."
                className="h-32"
                required
              />
            </div>
            <SubmitButton />
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function NavMenu() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    name: '',
    age: '',
    weight: '',
    allergies: '',
    healthConcerns: '',
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to parse profile from localStorage', error);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      toast({
        title: 'Profile Saved!',
        description: 'Your health information has been updated.',
      });
    } catch (error) {
      console.error('Failed to save profile to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your profile.',
      });
    }
  };

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon">
        <Menu />
        <span className="sr-only">Open menu</span>
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[320px] flex flex-col p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="flex items-center gap-2">
            <BookUser className="w-6 h-6" />
            Menu
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-6">
            {/* Profile Section */}
            <Card>
              <CardHeader className="flex-row items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Personalize your health analysis.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="e.g. 30"
                    value={profile.age}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="e.g. 180"
                    value={profile.weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    placeholder="e.g. Peanuts, Shellfish, Gluten"
                    value={profile.allergies}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate with commas.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="healthConcerns">
                    Health Concerns or Diseases
                  </Label>
                  <Textarea
                    id="healthConcerns"
                    name="healthConcerns"
                    placeholder="e.g. High blood pressure, Diabetes"
                    value={profile.healthConcerns}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleSaveProfile}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Theme Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Switch between light and dark mode.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="mr-2" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2" /> Dark Mode
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About NutriScan AI</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Version 1.0.0</p>
                <p>
                  NutriScan AI helps you make informed decisions about your
                  food.
                </p>
                <Separator className="my-2" />
                <ContactSupportSheet />
              </CardContent>
            </Card>

            {/* Links Section */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  Learn more about the app and your privacy.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link
                    href="/faq"
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-full justify-start'
                    )}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQ
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/privacy-policy"
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-full justify-start'
                    )}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </Link>
                </SheetClose>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
