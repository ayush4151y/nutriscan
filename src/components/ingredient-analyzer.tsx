'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { Barcode, Camera, PenSquare, Sparkles, Upload, Zap } from 'lucide-react';
import { analyzeProduct, type State } from '@/app/actions';
import AnalysisResult from '@/components/analysis-result';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { Card, CardContent } from './ui/card';
import { useFormStatus } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingLogo } from './icons/loading-logo';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';


const initialState: State = {
  status: 'initial',
  message: '',
  data: null,
};


function SubmitButton({ children, ...props }: React.ComponentProps<typeof Button>) {
    const { pending } = useFormStatus();
  
    return (
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={pending}
        {...props}
      >
        {pending ? (
          <>
            <LoadingLogo />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            {children}
          </>
        )}
      </Button>
    );
  }

function BarcodeScanner({ onScan, onOpenChange }: { onScan: (barcode: string) => void, onOpenChange: (isOpen: boolean) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isReady, setIsReady] = useState(false);
    const { toast } = useToast();
  
    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let stream: MediaStream | undefined;
    
        const startScanning = async () => {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Not Supported',
              description: 'Your browser does not support camera access.',
            });
            return;
          }
    
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
              
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().then(() => {
                        setIsReady(true);
                        const decodingLoop = () => {
                            if (videoRef.current && videoRef.current.readyState >= videoRef.current.HAVE_METADATA && videoRef.current.videoWidth > 0) {
                                codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
                                    if (result) {
                                        onScan(result.getText());
                                        codeReader.reset();
                                    } else if (err && !(err instanceof NotFoundException)) {
                                        console.error('Barcode decoding error:', err);
                                    }
                                
                                    // Continue the loop as long as the component is mounted and the scanner is active.
                                    if (codeReader.hints && videoRef.current) {
                                        setTimeout(decodingLoop, 100); 
                                    }
                                }).catch(err => console.error(err));
                            } else {
                                setTimeout(decodingLoop, 100);
                            }
                        };
                        decodingLoop();
                    });
                }
            }
          } catch (error) {
            console.error('Error accessing camera for barcode scanning:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions to scan barcodes.',
            });
          }
        };
    
        startScanning();
    
        return () => {
            codeReader.reset();
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
          };
      }, [onScan, toast]);
  
    return (
      <div className="space-y-4">
        <div className="relative">
          <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline onCanPlay={() => setIsReady(true)}/>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2/3 h-1/2 border-4 border-red-500 rounded-lg" style={{ borderColor: 'rgba(255, 0, 0, 0.5)' }}></div>
          </div>
          {!isReady && hasCameraPermission && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                <LoadingLogo />
            </div>
          )}
          {hasCameraPermission === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <Alert variant="destructive" className="w-auto">
                <Camera className="h-4 w-4" />
                <AlertTitle>No Camera Access</AlertTitle>
                <AlertDescription>Please grant camera permission.</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center">
            Point your camera at a barcode to scan it.
        </p>
      </div>
    );
}

function CameraCapture({ onCapture, onOpenChange }: { onCapture: (file: File) => void, onOpenChange: (open: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const [isFlashlightSupported, setIsFlashlightSupported] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const [isZoomSupported, setIsZoomSupported] = useState(false);
  const [zoomCapabilities, setZoomCapabilities] = useState<{min: number, max: number, step: number} | null>(null);
  const [zoomValue, setZoomValue] = useState(1);

  useEffect(() => {
    if (capturedImage) return; // Don't get camera if we're reviewing an image

    let stream: MediaStream | undefined;
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', focusMode: 'continuous' } });
        setHasCameraPermission(true);

        const track = stream.getVideoTracks()[0];
        trackRef.current = track;
        const capabilities = track.getCapabilities();

        if (capabilities.torch) {
            setIsFlashlightSupported(true);
        }
        if (capabilities.zoom) {
            setIsZoomSupported(true);
            const zoomData = capabilities.zoom as unknown as { min: number, max: number, step: number };
            setZoomCapabilities(zoomData);
            setZoomValue(zoomData.min);
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings.',
        });
        onOpenChange(false);
      }
    };
    getCameraPermission();

    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast, capturedImage, onOpenChange]);

  const toggleFlashlight = async () => {
    if (trackRef.current && isFlashlightSupported) {
        try {
            await trackRef.current.applyConstraints({
                advanced: [{ torch: !isFlashlightOn }]
            });
            setIsFlashlightOn(!isFlashlightOn);
        } catch (error) {
            console.error('Error toggling flashlight:', error);
            toast({
                variant: 'destructive',
                title: 'Flashlight Error',
                description: 'Could not control the flashlight.'
            });
        }
    }
  };

  const handleZoomChange = async (value: number[]) => {
      const newZoom = value[0];
      if (trackRef.current && isZoomSupported) {
          try {
              await trackRef.current.applyConstraints({
                  advanced: [{ zoom: newZoom }]
              });
              setZoomValue(newZoom);
          } catch (error) {
              console.error('Error applying zoom:', error);
          }
      }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && isReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
      }
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
        fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], 'capture.png', { type: 'image/png' });
            onCapture(file);
        });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsReady(false);
    setIsFlashlightOn(false);
    if (zoomCapabilities) {
        setZoomValue(zoomCapabilities.min);
    }
  };


  if (capturedImage) {
    return (
        <div className="bg-black h-full flex flex-col justify-center items-center gap-4 p-4">
             <img src={capturedImage} alt="Captured ingredient list" className="w-full flex-1 object-contain rounded-md" />
             <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <Button onClick={handleRetake} variant="outline" size="lg">
                    Retake
                </Button>
                <Button onClick={handleConfirm} size="lg">
                    Use Photo
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-black h-full w-full flex flex-col">
       <div className='relative flex-1 bg-muted overflow-hidden'>
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover" 
            autoPlay 
            muted 
            playsInline
            onCanPlay={() => setIsReady(true)}
           />
          <canvas ref={canvasRef} className="hidden" />

          {hasCameraPermission && isReady && (
            <>
              <div className="absolute top-4 left-4">
                  {isFlashlightSupported && (
                      <Button onClick={toggleFlashlight} variant="outline" size="icon" className="rounded-full bg-black/50 hover:bg-black/75 border-white/50 text-white">
                          <Zap className={cn(isFlashlightOn && "fill-yellow-300 text-yellow-300")} />
                      </Button>
                  )}
              </div>
              {isZoomSupported && zoomCapabilities && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-4/5 max-w-xs">
                      <Slider
                          value={[zoomValue]}
                          min={zoomCapabilities.min}
                          max={zoomCapabilities.max}
                          step={zoomCapabilities.step}
                          onValueChange={handleZoomChange}
                      />
                  </div>
              )}
            </>
          )}

          {(!isReady || hasCameraPermission === null) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <LoadingLogo className="h-16 w-16 text-primary" />
            </div>
          )}
          {hasCameraPermission === false && (
             <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/80 text-white p-4">
                <Alert variant="destructive" className="w-auto">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>No Camera Access</AlertTitle>
                    <AlertDescription>
                        Please grant camera permission.
                    </AlertDescription>
                </Alert>
                <Button onClick={() => onOpenChange(false)} variant="secondary">Close</Button>
            </div>
          )}
       </div>
       <div className="p-4 flex justify-center bg-black">
            <Button onClick={handleCapture} size="lg" className="h-16 w-16 rounded-full" disabled={!hasCameraPermission || !isReady}>
                <Camera className="h-8 w-8" />
            </Button>
       </div>
    </div>
  );
}


function ScanIngredientsDialog({ onOpenChange, formAction }: { onOpenChange: (open: boolean) => void, formAction: (payload: FormData) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && formRef.current) {
        const formData = new FormData(formRef.current);
        formData.set('image', file);
        formData.set('source', 'file');
        formAction(formData);
        onOpenChange(false);
      }
    };
  
    const handleCameraCapture = (file: File) => {
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        formData.set('image', file);
        formData.set('source', 'camera');
        formAction(formData);
        setIsCameraOpen(false);
        onOpenChange(false);
      }
    }
  
    return (
      <>
        <DialogHeader>
          <DialogTitle>Scan Ingredients</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <form ref={formRef}>
             <div className="space-y-2 mb-4">
                <Label htmlFor="productType" className="font-semibold">
                    Product Type (Optional)
                </Label>
                <Input
                    id="productType"
                    name="productType"
                    placeholder="e.g. Chocolate Bar, Energy Drink, Bread"
                />
            </div>
            <input
              type="file"
              name="image"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2" />
                    Upload Photo
                </Button>
                <Button variant="outline" type="button" onClick={() => setIsCameraOpen(true)}>
                    <Camera className="mr-2" />
                    Use Camera
                </Button>
            </div>
            <div className="mt-6">
                <PersonalizationFields />
            </div>
          </form>
        </div>
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
            <DialogContent className="w-full h-full max-w-full max-h-full p-0 gap-0 border-0 rounded-none flex flex-col md:max-w-2xl md:h-[90vh] md:max-h-[90vh] md:rounded-lg">
                <DialogHeader className="sr-only">
                  <DialogTitle>Camera Capture</DialogTitle>
                  <DialogDescription>
                    Capture an image of the ingredients list.
                  </DialogDescription>
                </DialogHeader>
                <CameraCapture onCapture={handleCameraCapture} onOpenChange={setIsCameraOpen}/>
            </DialogContent>
        </Dialog>
      </>
    );
  }

function ManualEntryDialog({ onOpenChange, formAction }: { onOpenChange: (open: boolean) => void, formAction: (payload: FormData) => void }) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormAction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('source', 'manual');
        formAction(formData);
        onOpenChange(false);
    }

    return (
        <form ref={formRef} onSubmit={handleFormAction}>
            <DialogHeader>
                <DialogTitle>Enter Ingredients Manually</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="productType" className="font-semibold">
                        Product Type (Optional)
                    </Label>
                    <Input
                        id="productType"
                        name="productType"
                        placeholder="e.g. Cereal, Soda, Salad Dressing"
                    />
                </div>
                <Textarea
                    name="ingredientsText"
                    placeholder="e.g., Sugar 12g, Salt 0.5g, Vitamin C 50mg"
                    className="h-32"
                    required
                />
                <PersonalizationFields />
            </div>
            <DialogFooter>
                <SubmitButton>Analyze Ingredients</SubmitButton>
            </DialogFooter>
        </form>
    );
}

function PersonalizationFields() {
    const [allergies, setAllergies] = useState('');
    const [healthConcerns, setHealthConcerns] = useState('');
  
    useEffect(() => {
      try {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setAllergies(profile.allergies || '');
          setHealthConcerns(profile.healthConcerns || '');
        }
      } catch (error) {
        console.error('Failed to parse profile from localStorage', error);
      }
    }, []);

    return (
        <div className="space-y-4">
             <div>
                <Label className='font-bold mb-2 block'>Personalize Analysis (Optional)</Label>
                <p className="text-sm text-muted-foreground">Add your allergies or health concerns for a tailored analysis.</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="allergies" className="font-semibold">
                    Allergies
                </Label>
                <Input
                    id="allergies"
                    name="allergies"
                    placeholder="e.g. peanuts, gluten, dairy"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="healthConcerns" className="font-semibold">
                    Health Concerns
                </Label>
                <Input
                    id="healthConcerns"
                    name="healthConcerns"
                    placeholder="e.g. high blood pressure, diabetes"
                    value={healthConcerns}
                    onChange={(e) => setHealthConcerns(e.target.value)}
                />
            </div>
        </div>
    )
}


export default function IngredientAnalyzer() {
  const [state, formAction] = useActionState(analyzeProduct, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const [isScanIngredientsOpen, setIsScanIngredientsOpen] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  
  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state.status === 'success') {
      toast({
        title: 'Analysis Complete!',
        description: 'Here are your results.'
      })
    }
  }, [state, toast]);

  const handleGenericFormAction = (formData: FormData) => {
    startTransition(() => {
        formAction(formData)
    });
  }

  useEffect(() => {
    if (state.status === 'success') {
      // Push a new state to history
      window.history.pushState({ page: 'analysis' }, '', window.location.href);

      const handlePopState = (event: PopStateEvent) => {
        // When user clicks back, reload the page to reset the state
        window.location.reload();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [state.status]);


  // If we have results, show them. Otherwise, show the input options.
  if (state.status === 'success' && state.data) {
    return (
        <div className="space-y-8">
            <AnalysisResult state={state} />
             <Button onClick={() => window.location.reload()} size="lg" className="w-full">
                Start New Analysis
            </Button>
        </div>
    )
  }

  if (state.status === 'loading' || isPending) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <LoadingLogo className="h-16 w-16 text-primary" />
          <p className="text-xl text-muted-foreground font-semibold">Analyzing your product...</p>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Scan Ingredients (Image or Camera) */}
        <Dialog open={isScanIngredientsOpen} onOpenChange={setIsScanIngredientsOpen}>
          <DialogTrigger asChild>
            <div className="animated-gradient-border group relative">
              <Card className="group-hover:scale-105 h-full cursor-pointer text-center transition-all duration-300">
                <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-6">
                    <Camera className="h-12 w-12 text-primary" />
                    <h3 className="text-lg font-semibold">Scan Ingredients</h3>
                    <p className="text-sm text-muted-foreground">
                        Use a photo or your camera
                    </p>
                </CardContent>
                <Badge className="absolute -top-2 -right-2">Recommended</Badge>
              </Card>
            </div>
          </DialogTrigger>
          <DialogContent>
            <ScanIngredientsDialog onOpenChange={setIsScanIngredientsOpen} formAction={handleGenericFormAction} />
          </DialogContent>
        </Dialog>

        {/* Enter Manually */}
        <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
            <DialogTrigger asChild>
                <div className="animated-gradient-border group relative">
                    <Card className="group-hover:scale-105 h-full cursor-pointer text-center transition-all duration-300">
                        <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-6">
                            <PenSquare className="h-12 w-12 text-primary" />
                            <h3 className="text-lg font-semibold">Enter Manually</h3>
                            <p className="text-sm text-muted-foreground">
                                Type or paste ingredients
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>
            <DialogContent>
                <ManualEntryDialog onOpenChange={setIsManualEntryOpen} formAction={handleGenericFormAction} />
            </DialogContent>
        </Dialog>
        
        {/* Scan Barcode - Coming Soon */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="animated-gradient-border group relative">
              <Card className="group-hover:scale-105 h-full cursor-pointer text-center transition-all duration-300">
                  <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-6">
                      <Barcode className="h-12 w-12 text-primary" />
                      <h3 className="text-lg font-semibold">Scan Barcode</h3>
                      <p className="text-sm text-muted-foreground">
                          Use your camera to scan
                      </p>
                  </CardContent>
                  <Badge className="absolute -top-2 -right-2">Coming Soon</Badge>
              </Card>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Feature Coming Soon!</AlertDialogTitle>
              <AlertDialogDescription>
                The ability to scan product barcodes is currently in development and will be available in a future update. Stay tuned!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Got it!</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
