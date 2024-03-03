import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component() {
    return (
      <div>
        <h1 style={{ fontSize: 90 }}>HELLO WORLD</h1>
      </div>
    );
  },
});
