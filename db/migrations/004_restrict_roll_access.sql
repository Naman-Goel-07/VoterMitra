-- Restrict direct access to server-side database roles.
BEGIN;

ALTER TABLE benchmark_scenarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access Constituencies" ON constituencies;
DROP POLICY IF EXISTS "Public Read Access Roll Parts" ON roll_parts;
DROP POLICY IF EXISTS "Public Read Access Part Sections" ON part_sections;
DROP POLICY IF EXISTS "Public Read Access Voters V1" ON voters_v1;
DROP POLICY IF EXISTS "Public Read Access Voters V2" ON voters_v2;
DROP POLICY IF EXISTS "Public Read Access Flags" ON flags;
DROP POLICY IF EXISTS "Public Read Access Reviews" ON reviews;
DROP POLICY IF EXISTS "Public Write Access Reviews" ON reviews;
DROP POLICY IF EXISTS "Public Read Access Claim Audits" ON claim_audits;
DROP POLICY IF EXISTS "Public Write Access Claim Audits" ON claim_audits;

REVOKE ALL ON TABLE constituencies, roll_parts, part_sections, voters_v1, voters_v2,
  flags, reviews, claim_audits, benchmark_scenarios FROM PUBLIC;

DO $$
DECLARE
  api_role text;
BEGIN
  FOR api_role IN SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')
  LOOP
    EXECUTE format('REVOKE ALL ON TABLE constituencies, roll_parts, part_sections, voters_v1,
      voters_v2, flags, reviews, claim_audits, benchmark_scenarios FROM %I', api_role);
  END LOOP;
END;
$$;

COMMIT;
