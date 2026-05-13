CREATE TABLE public.pluralsight_courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  last_accessed_at timestamptz,
  position int NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pluralsight_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read courses"
  ON public.pluralsight_courses
  FOR SELECT
  USING (true);

CREATE UNIQUE INDEX pluralsight_courses_position_key
  ON public.pluralsight_courses (position);
