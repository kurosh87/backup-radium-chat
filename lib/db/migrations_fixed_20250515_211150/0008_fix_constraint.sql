-- Check if Document_userId_User_id_fk constraint exists before dropping it
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

-- Check if Suggestion_userId_User_id_fk constraint exists before dropping it
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
