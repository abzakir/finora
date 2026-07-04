import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface ComingSoonPageProps {
  sectionLabel: string;
}

export function ComingSoonPage({ sectionLabel }: ComingSoonPageProps) {
  return (
    <Card>
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">Foundation phase</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">{sectionLabel} is ready in the shell.</h2>
        <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base">
          This section is intentionally not implemented yet. The layout, navigation, and responsive structure are in place,
          and the feature work for this area will land in its own phase.
        </p>
        <div className="mt-6">
          <Button variant="secondary">Back to dashboard</Button>
        </div>
      </div>
    </Card>
  );
}