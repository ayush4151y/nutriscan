
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import type { State } from '@/app/actions';
import StarRating from './star-rating';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { getIngredientDetail, type GetIngredientDetailOutput } from '@/ai/flows/get-ingredient-detail';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

type AnalysisResultProps = {
  state: State;
};

type Ingredient =
  State['data']['ingredientsAnalysis'][number];

const healthImpactStyles = {
  Healthy: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300',
  Moderate: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  Harmful: 'border-destructive/50 bg-destructive/10 text-destructive',
};

const healthImpactIcons = {
  Healthy: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Moderate: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Harmful: <XCircle className="h-5 w-5 text-destructive" />,
};

function ResultSkeleton() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center tracking-tight">
                Analyzing...
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
        </div>
    )
}

function VerdictCard({ rating, warnings }: { rating: number; warnings: string[] }) {
    let title = 'Good to Go!';
    let description = 'This product seems to be a healthy choice.';
    let variant: 'default' | 'destructive' | 'warning' = 'default';

    if (rating < 3) {
        title = 'Could be better';
        description = 'This product has some concerning ingredients.';
        variant = 'warning';
    }
    if (rating < 2 || warnings.length > 2) {
        title = 'Consider avoiding';
        description = 'This product has several harmful ingredients or allergens.';
        variant = 'destructive';
    }
    if (warnings.some(w => w.toLowerCase().includes('high sugar'))) {
        title = 'Good but high in sugar';
    }


    return (
        <Card className={cn(
            variant === 'destructive' && 'bg-destructive text-destructive-foreground border-destructive/50',
            variant === 'warning' && 'bg-yellow-500/10 border-yellow-500/50',
            variant === 'default' && 'bg-green-500/10 border-green-500/50'
        )}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription className={cn(
                variant === 'destructive' ? 'text-destructive-foreground/80' : 'text-foreground/80'
            )}>{description}</CardDescription>
          </CardHeader>
        </Card>
    );
}

function IngredientDetailDialog({ ingredient, onOpenChange }: { ingredient: Ingredient | null, onOpenChange: (open: boolean) => void }) {
    const [detail, setDetail] = useState<GetIngredientDetailOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (ingredient) {
            setIsLoading(true);
            setDetail(null); // Reset previous detail
            getIngredientDetail({ ingredientName: ingredient.name })
                .then(response => setDetail(response))
                .catch(err => {
                    console.error(err);
                    setDetail({
                        fullName: 'Error',
                        healthImpact: 'Could not load details for this ingredient.',
                        impactCategory: 'Harmful',
                        details: ['There was an error when trying to load more information. Please try again.'],
                    });
                })
                .finally(() => setIsLoading(false));
        }
    }, [ingredient]);
    
    return (
        <Dialog open={!!ingredient} onOpenChange={onOpenChange}>
            <DialogContent className='border-primary border-2 p-0 max-w-md'>
                <DialogHeader className='p-6 pb-4 bg-primary text-primary-foreground rounded-t-lg'>
                    <DialogTitle>{ingredient?.name}</DialogTitle>
                     <DialogDescription className='text-primary-foreground/80'>
                        {isLoading ? 'Loading details from our AI expert...' : (detail?.fullName || 'Detailed health information.')}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="px-6 py-4 space-y-4">
                        {isLoading && (
                            <div className='flex items-center justify-center py-8'>
                                <div className='flex items-center gap-2 text-muted-foreground'>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <p>Loading details...</p>
                                </div>
                            </div>
                        )}
                        {detail && (
                           <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2 text-foreground">Health Impact</h3>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                        'font-semibold text-sm',
                                        healthImpactStyles[detail.impactCategory as keyof typeof healthImpactStyles]
                                        )}
                                    >
                                        {detail.healthImpact}
                                    </Badge>
                                </div>
                               
                                <div>
                                    <h3 className="font-semibold mb-2 text-foreground">Details</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                        {detail.details.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                           </div>
                        )}
                    </div>
                </ScrollArea>
                <DialogFooter className='p-6 pt-2 bg-slate-50 dark:bg-slate-900/50 rounded-b-lg border-t'>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                        Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function AnalysisResult({ state }: AnalysisResultProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
    
  if (state.status === 'loading') {
    return <ResultSkeleton />;
  }

  if (state.status !== 'success' || !state.data) {
    return null;
  }

  const {
    overallRating,
    ingredientsAnalysis,
    warnings,
    healthierAlternatives,
    productName,
  } = state.data;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Separator />
      <h2 className="text-3xl font-bold text-center tracking-tight">
        {productName ? `Analysis for ${productName}` : "Your Product Analysis"}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-2">
              <StarRating rating={overallRating} size={40} />
              <p className="text-2xl font-bold">{overallRating.toFixed(1)} / 5.0</p>
            </div>
          </CardContent>
        </Card>
        <VerdictCard rating={overallRating} warnings={warnings} />
      </div>

        {warnings.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Important Warnings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {warnings.map((warning, index) => (
                         <Alert key={index} className="bg-red-500/10 border-red-500/30 text-red-500">
                         <AlertTriangle className="h-4 w-4 text-red-500" />
                         <AlertTitle className='font-normal'>{warning.split('–')[0]}</AlertTitle>
                         <AlertDescription className="text-red-500/80">{warning.split('–')[1]}</AlertDescription>
                         </Alert>
                    ))}
                </CardContent>
            </Card>
        )}

      <Card>
        <CardHeader>
          <CardTitle>Ingredient Breakdown</CardTitle>
          <CardDescription>Click an ingredient to learn more about it.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className='hidden md:table-row'>
                  <TableHead className='w-12 pr-0'></TableHead>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Health Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredientsAnalysis.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className='animate-in slide-in-from-bottom-2 duration-300 ease-out cursor-pointer flex flex-col md:table-row py-4 md:py-0 border-b' 
                    style={{animationDelay: `${index * 50}ms`, animationFillMode: 'both'}}
                    onClick={() => setSelectedIngredient(item)}
                    >
                     <TableCell className='p-0 md:p-4 md:pr-0 md:w-12'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                {healthImpactIcons[item.healthImpact as keyof typeof healthImpactIcons]}
                                <span className='font-medium md:hidden'>{item.name}</span>
                            </div>
                            <Badge
                                variant="outline"
                                className={cn(
                                'font-semibold text-sm md:hidden',
                                healthImpactStyles[item.healthImpact as keyof typeof healthImpactStyles]
                                )}
                            >
                                {item.healthImpact}
                            </Badge>
                        </div>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap hidden md:table-cell">{item.name}</TableCell>
                    <TableCell className='whitespace-nowrap pt-2 pb-0 md:py-4'>
                        <span className='text-muted-foreground md:hidden'>Quantity: </span>{item.quantity || '-'}
                    </TableCell>
                    <TableCell className='text-right hidden md:table-cell'>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-semibold text-sm',
                          healthImpactStyles[item.healthImpact as keyof typeof healthImpactStyles]
                        )}
                      >
                        {item.healthImpact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {healthierAlternatives && healthierAlternatives.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle>Healthier Alternatives</CardTitle>
          <CardDescription>
            Consider these products for a healthier choice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {healthierAlternatives.map((alt, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="font-bold text-lg">
                  <div className="flex items-center gap-4">
                    <span>{alt.name}</span>
                    <StarRating rating={alt.rating} />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <p className="text-muted-foreground">{alt.description}</p>
                  <div>
                    <h4 className="font-bold mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                        {alt.ingredients.map((ing, i) => (
                            <Badge key={i} variant="secondary">{ing.name}</Badge>
                        ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      )}

      <IngredientDetailDialog 
        ingredient={selectedIngredient} 
        onOpenChange={(open) => !open && setSelectedIngredient(null)} 
      />
    </div>
  );
}

    
