-- Migration: Create News, LMS, and Content Management tables
-- This enables news articles, courses, and educational content

-- ============================================================================
-- NEWS ARTICLES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'company_news', 'industry_news', 'technology', 'policy', 'case_study'
  tags JSONB, -- Array of tags
  featured_image VARCHAR(500),
  images JSONB, -- Additional images
  author_id UUID, -- FK added later
  author_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'webinar', 'workshop', 'conference', 'training', 'exhibition'
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location VARCHAR(255), -- Physical location or 'Online'
  venue_details JSONB, -- Address, coordinates, etc.
  registration_url VARCHAR(500),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  price_ngn DECIMAL(10, 2),
  price_gbp DECIMAL(10, 2),
  featured_image VARCHAR(500),
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
  organizer_id UUID, -- FK added later
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LMS COURSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lms_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category VARCHAR(100) NOT NULL, -- 'solar_basics', 'installation', 'maintenance', 'business', 'certification'
  level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'professional'
  duration_hours DECIMAL(5, 1), -- Course duration in hours
  language VARCHAR(50) DEFAULT 'en',
  thumbnail_image VARCHAR(500),
  preview_video_url VARCHAR(500),
  price_ngn DECIMAL(10, 2) DEFAULT 0,
  price_gbp DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  instructor_id UUID, -- FK added later
  instructor_name VARCHAR(255),
  instructor_bio TEXT,
  learning_outcomes JSONB, -- Array of learning outcomes
  prerequisites JSONB, -- Array of prerequisites
  certificate_available BOOLEAN DEFAULT false,
  certificate_template VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSE MODULES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSE LESSONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  lesson_type VARCHAR(50) NOT NULL, -- 'video', 'text', 'quiz', 'assignment', 'resource'
  video_url VARCHAR(500),
  video_duration_seconds INTEGER,
  attachments JSONB, -- Array of file URLs
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- Can be viewed without enrollment
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COURSE ENROLLMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL, -- FK added later
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  completion_date TIMESTAMPTZ,
  progress_percent DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'dropped', 'suspended'
  last_accessed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- ============================================================================
-- LESSON PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0, -- For video lessons
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- ============================================================================
-- COURSE REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.lms_courses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL, -- FK added later
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  is_verified_enrollment BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- ============================================================================
-- CASE STUDIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  client_name VARCHAR(255),
  client_industry VARCHAR(100),
  location VARCHAR(255),
  project_type VARCHAR(100) NOT NULL, -- 'residential', 'commercial', 'industrial', 'utility'
  system_size_kw DECIMAL(10, 2),
  challenge TEXT NOT NULL,
  solution TEXT NOT NULL,
  results TEXT NOT NULL,
  testimonial TEXT,
  testimonial_author VARCHAR(255),
  testimonial_position VARCHAR(255),
  featured_image VARCHAR(500),
  images JSONB, -- Array of project images
  metrics JSONB, -- Key metrics (energy saved, ROI, etc.)
  technologies_used JSONB, -- Array of technologies
  partner_id UUID, -- Partner who executed (FK added later)
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news_articles(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_events_dates ON public.events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.lms_courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.lms_courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.lms_courses(slug);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.course_lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment ON public.lesson_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_type ON public.case_studies(project_type);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON public.case_studies(is_published);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.lms_courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_studies_updated_at BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- News: Everyone can view published, admins can manage
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_select_published" ON public.news_articles FOR SELECT
  TO authenticated
  USING (
    status = 'published' OR
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "news_insert_admin" ON public.news_articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "news_update_admin_author" ON public.news_articles FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Events: Everyone can view, admins can manage
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_all" ON public.events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "events_insert_admin" ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "events_update_admin" ON public.events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Courses: Everyone can view published, admins and instructors can manage
ALTER TABLE public.lms_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_select_published" ON public.lms_courses FOR SELECT
  TO authenticated
  USING (
    is_published = true OR
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "courses_insert_admin" ON public.lms_courses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
    )
  );

CREATE POLICY "courses_update_admin_instructor" ON public.lms_courses FOR UPDATE
  TO authenticated
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Course Modules & Lessons: Inherit from courses
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modules_select" ON public.course_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lms_courses c
      WHERE c.id = course_modules.course_id
      AND (c.is_published = true OR c.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role = 'admin'
      ))
    )
  );

CREATE POLICY "lessons_select" ON public.course_lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.lms_courses c ON c.id = m.course_id
      WHERE m.id = course_lessons.module_id
      AND (c.is_published = true OR c.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role = 'admin'
      ))
    )
  );

-- Enrollments: Users can view their own, admins can view all
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollments_select_own_or_admin" ON public.course_enrollments FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "enrollments_insert_own" ON public.course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Case Studies: Everyone can view published, admins can manage
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "case_studies_select_published" ON public.case_studies FOR SELECT
  TO authenticated
  USING (
    is_published = true OR
    partner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "case_studies_insert_admin" ON public.case_studies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "case_studies_update_admin" ON public.case_studies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Add foreign keys after tables are created to avoid circular dependency issues

-- News articles foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'news_articles_author_id_fkey'
      AND table_name = 'news_articles'
    ) THEN
      ALTER TABLE public.news_articles
      ADD CONSTRAINT news_articles_author_id_fkey
      FOREIGN KEY (author_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- Events foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'events_organizer_id_fkey'
      AND table_name = 'events'
    ) THEN
      ALTER TABLE public.events
      ADD CONSTRAINT events_organizer_id_fkey
      FOREIGN KEY (organizer_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- LMS courses foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'lms_courses_instructor_id_fkey'
      AND table_name = 'lms_courses'
    ) THEN
      ALTER TABLE public.lms_courses
      ADD CONSTRAINT lms_courses_instructor_id_fkey
      FOREIGN KEY (instructor_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- Course enrollments foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'course_enrollments_user_id_fkey'
      AND table_name = 'course_enrollments'
    ) THEN
      ALTER TABLE public.course_enrollments
      ADD CONSTRAINT course_enrollments_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Course reviews foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'course_reviews_user_id_fkey'
      AND table_name = 'course_reviews'
    ) THEN
      ALTER TABLE public.course_reviews
      ADD CONSTRAINT course_reviews_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

-- Case studies foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'case_studies_partner_id_fkey'
      AND table_name = 'case_studies'
    ) THEN
      ALTER TABLE public.case_studies
      ADD CONSTRAINT case_studies_partner_id_fkey
      FOREIGN KEY (partner_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

