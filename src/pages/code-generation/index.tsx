import { useState } from 'react';
import { Box, Spinner, Flash, Text, Heading, ProgressBar } from '@primer/react';
import {
  TimeRangeFilter,
  DateRangePicker,
} from '@/components/filters';
import { useInsights } from '@/pages/insights/useHooks';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Format large numbers (e.g., 201000 -> 201k)
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

export function CodeGenerationPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const {
    filter,
    dateRange,
    setTimeRange,
    setCustomDateRange,
    metricsQuery,
    summary,
    isLoading,
    isError,
    error,
  } = useInsights();

  if (isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Flash variant="danger">
          Error loading metrics: {error?.message || 'Unknown error'}
        </Flash>
      </Box>
    );
  }

  const getDateRangeLabel = () => {
    const start = format(dateRange.startDate, 'MMM d, yyyy');
    const end = format(dateRange.endDate, 'MMM d, yyyy');
    return `${start} - ${end}`;
  };

  // Prepare chart data from metrics
  const metrics = metricsQuery.data || [];

  const dailyLinesData = metrics.map((m) => ({
    name: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Added: m.code_generation?.daily_lines?.added || 0,
    Deleted: m.code_generation?.daily_lines?.deleted || 0,
  }));

  // Aggregate user-initiated code changes by mode
  const userCodeChangesByMode = metrics.length > 0
    ? metrics[metrics.length - 1].code_generation?.user_initiated_changes?.by_mode || []
    : [];

  // Aggregate agent-initiated code changes
  const agentChanges = metrics.length > 0
    ? metrics[metrics.length - 1].code_generation?.agent_initiated_changes
    : null;

  // User-initiated code changes per model
  const userCodeChangesByModel = metrics.length > 0
    ? metrics[metrics.length - 1].code_generation?.user_initiated_changes?.by_model || []
    : [];

  // Agent-initiated code changes per model
  const agentCodeChangesByModel = agentChanges?.by_model || [];

  // User-initiated code changes per language
  const userCodeChangesByLanguage = metrics.length > 0
    ? metrics[metrics.length - 1].code_generation?.user_initiated_changes?.by_language || []
    : [];

  // Agent-initiated code changes per language
  const agentCodeChangesByLanguage = agentChanges?.by_language || [];

  return (
    <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
          flexWrap: 'wrap',
          gap: 3,
        }}
      >
        <Box>
          <Heading as="h1" sx={{ fontSize: 3, fontWeight: 600, mb: 1 }}>
            IDE code generation
          </Heading>
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
            {getDateRangeLabel()}
          </Text>
        </Box>
        <TimeRangeFilter
          value={filter.timeRange}
          onChange={setTimeRange}
          customDateRange={filter.customDateRange}
          onCustomDateClick={() => setIsDatePickerOpen(true)}
          variant="segmented"
        />
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <Spinner size="large" />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Metrics Overview Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)'],
              gap: 3,
            }}
          >
            {/* Lines of code changed with AI */}
            <Box
              sx={{
                p: 3,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default', display: 'block', mb: 2 }}>
                Lines of code changed with AI
              </Text>
              <Text
                sx={{
                  fontSize: '48px',
                  fontWeight: 600,
                  color: 'fg.default',
                  lineHeight: 1,
                  display: 'block',
                  mb: 2,
                }}
              >
                {formatNumber(summary.totalLinesChanged)}
              </Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                Lines of code added and deleted across all modes in the last 28 days
              </Text>
            </Box>

            {/* Agent Contribution */}
            <Box
              sx={{
                p: 3,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default', display: 'block', mb: 2 }}>
                Agent Contribution
              </Text>
              <Text
                sx={{
                  fontSize: '48px',
                  fontWeight: 600,
                  color: 'fg.default',
                  lineHeight: 1,
                  display: 'block',
                  mb: 2,
                }}
              >
                {summary.agentContributionPercentage.toFixed(2)}%
              </Text>
              <ProgressBar
                progress={summary.agentContributionPercentage}
                sx={{
                  height: 8,
                  bg: 'neutral.muted',
                  mb: 2,
                }}
              />
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                Percentage of lines of code added and deleted by agents in the last 28 days
              </Text>
            </Box>

            {/* Average lines deleted by agent */}
            <Box
              sx={{
                p: 3,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Text sx={{ fontSize: 1, fontWeight: 600, color: 'fg.default', display: 'block', mb: 2 }}>
                Average lines deleted by agent
              </Text>
              <Text
                sx={{
                  fontSize: '48px',
                  fontWeight: 600,
                  color: 'fg.default',
                  lineHeight: 1,
                  display: 'block',
                  mb: 2,
                }}
              >
                {formatNumber(summary.averageLinesDeletedByAgent)}
              </Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                Average lines of code deleted by agents on behalf of active users in the current calendar month
              </Text>
            </Box>
          </Box>

          {/* Daily total of lines added and deleted */}
          <Box
            sx={{
              p: 4,
              bg: 'canvas.subtle',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'border.default',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                Daily total of lines added and deleted
              </Text>
              <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                Total lines of code added to and deleted from the codebase across all modes
              </Text>
            </Box>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyLinesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#8b949e' }}
                    axisLine={{ stroke: '#30363d' }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#8b949e' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatNumber(value)}
                    label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#c9d1d9',
                    }}
                    labelStyle={{ color: '#c9d1d9' }}
                    formatter={(value: number) => [formatNumber(value), '']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                    iconType="square"
                    iconSize={10}
                  />
                  <Bar dataKey="Added" fill="#7ee787" />
                  <Bar dataKey="Deleted" fill="#a371f7" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* User-initiated and Agent-initiated code changes */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
              gap: 4,
            }}
          >
            {/* User-initiated code changes */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  User-initiated code changes
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code suggested and manually added by users through code completions and chat panel actions
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userCodeChangesByMode}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="mode"
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="suggested" fill="#7ee787" name="Suggested" />
                    <Bar dataKey="added" fill="#3fb950" name="Added" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Agent-initiated code changes */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  Agent-initiated code changes
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code automatically added to and deleted from the codebase by agents
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{
                    name: 'Agent',
                    Added: agentChanges?.total_added || 0,
                    Deleted: agentChanges?.total_deleted || 0,
                  }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="Added" fill="#d2a8ff" />
                    <Bar dataKey="Deleted" fill="#a371f7" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>

          {/* User-initiated and Agent-initiated code changes per model */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
              gap: 4,
            }}
          >
            {/* User-initiated code changes per model */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  User-initiated code changes per model
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code suggested and manually added by users, grouped by model used
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userCodeChangesByModel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="model"
                      tick={{ fontSize: 9, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="suggested" fill="#7ee787" name="Suggested" />
                    <Bar dataKey="added" fill="#3fb950" name="Added" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Agent-initiated code changes per model */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  Agent-initiated code changes per model
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code added and deleted by agents on behalf of users, grouped by model used
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentCodeChangesByModel}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="model"
                      tick={{ fontSize: 9, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="added" fill="#d2a8ff" name="Added" />
                    <Bar dataKey="deleted" fill="#a371f7" name="Deleted" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>

          {/* User-initiated and Agent-initiated code changes per language */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: ['1fr', '1fr', 'repeat(2, 1fr)'],
              gap: 4,
            }}
          >
            {/* User-initiated code changes per language */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  User-initiated code changes per language
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code suggested and manually added by users, grouped by language used
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userCodeChangesByLanguage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="language"
                      tick={{ fontSize: 9, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="suggested" fill="#7ee787" name="Suggested" />
                    <Bar dataKey="added" fill="#3fb950" name="Added" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Agent-initiated code changes per language */}
            <Box
              sx={{
                p: 4,
                bg: 'canvas.subtle',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'fg.default', display: 'block' }}>
                  Agent-initiated code changes per language
                </Text>
                <Text sx={{ fontSize: 0, color: 'fg.muted', display: 'block' }}>
                  Compares the total lines of code added and deleted by agents on behalf of users, grouped by language used
                </Text>
              </Box>
              <Box sx={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentCodeChangesByLanguage}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis
                      dataKey="language"
                      tick={{ fontSize: 9, fill: '#8b949e' }}
                      axisLine={{ stroke: '#30363d' }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#8b949e' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                      label={{ value: 'Lines of code', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#8b949e' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#c9d1d9',
                      }}
                      formatter={(value: number) => [formatNumber(value), '']}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                      iconType="square"
                      iconSize={10}
                    />
                    <Bar dataKey="added" fill="#d2a8ff" name="Added" />
                    <Bar dataKey="deleted" fill="#a371f7" name="Deleted" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={(range) => {
          setCustomDateRange(range);
          setIsDatePickerOpen(false);
        }}
        initialDateRange={dateRange}
      />
    </Box>
  );
}
