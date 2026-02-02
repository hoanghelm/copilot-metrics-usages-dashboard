import { Box, Heading, Text } from '@primer/react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <Box>
        <Heading sx={{ fontSize: 3, fontWeight: 'semibold', mb: 1 }}>
          {title}
        </Heading>
        {description && (
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{description}</Text>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 2 }}>{actions}</Box>}
    </Box>
  );
}
