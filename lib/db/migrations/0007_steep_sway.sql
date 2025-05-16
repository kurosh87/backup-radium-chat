DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'Document_userId_User_id_fk'
        AND table_name = 'Document'
    ) THEN
        ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_User_id_fk";
    END IF;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'Suggestion_userId_User_id_fk'
        AND table_name = 'Suggestion'
    ) THEN
        ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_userId_User_id_fk";
    END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "documentId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Suggestion" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;