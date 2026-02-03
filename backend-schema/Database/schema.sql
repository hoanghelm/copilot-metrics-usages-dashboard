-- SQL Server Schema for Insights

-- Main metrics table (daily aggregated data)
CREATE TABLE [dbo].[CopilotMetrics] (
    [Id] NVARCHAR(255) NOT NULL PRIMARY KEY,
    [Date] DATE NOT NULL,
    [TotalActiveUsers] INT NOT NULL DEFAULT 0,
    [TotalEngagedUsers] INT NOT NULL DEFAULT 0,
    [Enterprise] NVARCHAR(255) NULL,
    [Organization] NVARCHAR(255) NULL,
    [Team] NVARCHAR(255) NULL,
    [MetricsJson] NVARCHAR(MAX) NOT NULL,
    [LastUpdate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_CopilotMetrics_Date ON [dbo].[CopilotMetrics] ([Date]);
CREATE INDEX IX_CopilotMetrics_Enterprise ON [dbo].[CopilotMetrics] ([Enterprise]);
CREATE INDEX IX_CopilotMetrics_Organization ON [dbo].[CopilotMetrics] ([Organization]);
CREATE INDEX IX_CopilotMetrics_Team ON [dbo].[CopilotMetrics] ([Team]);
CREATE INDEX IX_CopilotMetrics_DateRange ON [dbo].[CopilotMetrics] ([Date], [Enterprise], [Organization]);

-- Seats table (snapshot of seat assignments)
CREATE TABLE [dbo].[CopilotSeats] (
    [Id] NVARCHAR(255) NOT NULL PRIMARY KEY,
    [Date] DATE NOT NULL,
    [TotalSeats] INT NOT NULL DEFAULT 0,
    [Enterprise] NVARCHAR(255) NULL,
    [Organization] NVARCHAR(255) NULL,
    [Page] INT NOT NULL DEFAULT 1,
    [HasNextPage] BIT NOT NULL DEFAULT 0,
    [SeatsJson] NVARCHAR(MAX) NOT NULL,
    [LastUpdate] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

CREATE INDEX IX_CopilotSeats_Date ON [dbo].[CopilotSeats] ([Date]);
CREATE INDEX IX_CopilotSeats_Enterprise ON [dbo].[CopilotSeats] ([Enterprise]);
CREATE INDEX IX_CopilotSeats_Organization ON [dbo].[CopilotSeats] ([Organization]);

-- Stored procedure to get metrics by date range
CREATE OR ALTER PROCEDURE [dbo].[GetCopilotMetrics]
    @StartDate DATE,
    @EndDate DATE,
    @Enterprise NVARCHAR(255) = NULL,
    @Organization NVARCHAR(255) = NULL,
    @Team NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [Id],
        [Date],
        [TotalActiveUsers],
        [TotalEngagedUsers],
        [Enterprise],
        [Organization],
        [Team],
        [MetricsJson],
        [LastUpdate]
    FROM [dbo].[CopilotMetrics]
    WHERE [Date] >= @StartDate
      AND [Date] <= @EndDate
      AND (@Enterprise IS NULL OR [Enterprise] = @Enterprise)
      AND (@Organization IS NULL OR [Organization] = @Organization)
      AND (@Team IS NULL OR [Team] = @Team)
    ORDER BY [Date] ASC;
END;
GO

-- Stored procedure to get latest seats
CREATE OR ALTER PROCEDURE [dbo].[GetCopilotSeats]
    @Enterprise NVARCHAR(255) = NULL,
    @Organization NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        [Id],
        [Date],
        [TotalSeats],
        [Enterprise],
        [Organization],
        [Page],
        [HasNextPage],
        [SeatsJson],
        [LastUpdate]
    FROM [dbo].[CopilotSeats]
    WHERE (@Enterprise IS NULL OR [Enterprise] = @Enterprise)
      AND (@Organization IS NULL OR [Organization] = @Organization)
    ORDER BY [Date] DESC, [LastUpdate] DESC;
END;
GO

-- Stored procedure to upsert metrics
CREATE OR ALTER PROCEDURE [dbo].[UpsertCopilotMetrics]
    @Id NVARCHAR(255),
    @Date DATE,
    @TotalActiveUsers INT,
    @TotalEngagedUsers INT,
    @Enterprise NVARCHAR(255) = NULL,
    @Organization NVARCHAR(255) = NULL,
    @Team NVARCHAR(255) = NULL,
    @MetricsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    MERGE [dbo].[CopilotMetrics] AS target
    USING (SELECT @Id AS Id) AS source
    ON target.[Id] = source.[Id]
    WHEN MATCHED THEN
        UPDATE SET
            [TotalActiveUsers] = @TotalActiveUsers,
            [TotalEngagedUsers] = @TotalEngagedUsers,
            [MetricsJson] = @MetricsJson,
            [LastUpdate] = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT ([Id], [Date], [TotalActiveUsers], [TotalEngagedUsers],
                [Enterprise], [Organization], [Team], [MetricsJson])
        VALUES (@Id, @Date, @TotalActiveUsers, @TotalEngagedUsers,
                @Enterprise, @Organization, @Team, @MetricsJson);
END;
GO

-- Stored procedure to upsert seats
CREATE OR ALTER PROCEDURE [dbo].[UpsertCopilotSeats]
    @Id NVARCHAR(255),
    @Date DATE,
    @TotalSeats INT,
    @Enterprise NVARCHAR(255) = NULL,
    @Organization NVARCHAR(255) = NULL,
    @Page INT = 1,
    @HasNextPage BIT = 0,
    @SeatsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    MERGE [dbo].[CopilotSeats] AS target
    USING (SELECT @Id AS Id) AS source
    ON target.[Id] = source.[Id]
    WHEN MATCHED THEN
        UPDATE SET
            [TotalSeats] = @TotalSeats,
            [HasNextPage] = @HasNextPage,
            [SeatsJson] = @SeatsJson,
            [LastUpdate] = GETUTCDATE()
    WHEN NOT MATCHED THEN
        INSERT ([Id], [Date], [TotalSeats], [Enterprise], [Organization],
                [Page], [HasNextPage], [SeatsJson])
        VALUES (@Id, @Date, @TotalSeats, @Enterprise, @Organization,
                @Page, @HasNextPage, @SeatsJson);
END;
GO
