import { Box, Text, Heading } from '@primer/react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        gap: 2,
        p: 4,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ color: 'fg.muted', mb: 2 }}>{icon}</Box>
      )}
      <Heading sx={{ fontSize: 2, color: 'fg.default' }}>{title}</Heading>
      {description && (
        <Text sx={{ color: 'fg.muted', maxWidth: 400 }}>{description}</Text>
      )}
    </Box>
  );
}
