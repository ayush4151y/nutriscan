import IngredientAnalyzer from '@/components/ingredient-analyzer';

export default function Home() {
  return (
    <>
      <section className="relative w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                NutriScan AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Know What You Eat. Instantly analyze food ingredients for their
                health impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="analyzer" className="w-full pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <IngredientAnalyzer />
        </div>
      </section>
    </>
  );
}
