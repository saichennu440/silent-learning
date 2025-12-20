import { supabase } from '../config/supabase';

/**
 * Courses Service - All database operations for courses
 */

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    console.log('✅ Fetched courses:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    throw error;
  }
};

// Fetch single course by ID
export const fetchCourseById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error fetching course:', error);
    throw error;
  }
};

// Fetch single course by slug
export const fetchCourseBySlug = async (slug) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('❌ Error fetching course:', error);
    throw error;
  }
};

// Add new course
export const createCourse = async (courseData) => {
  try {
    // Generate slug from title
    const slug = courseData.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Prepare data for database (convert field names to snake_case)
    const dbData = {
      slug: slug,
      title: courseData.title,
      category: courseData.category,
      level: courseData.level,
      duration: courseData.duration,
      price_text: courseData.priceText,
      status: courseData.status,
      short_description: courseData.shortDescription,
      full_description: courseData.fullDescription,
      curriculum: courseData.curriculum,
      projects: courseData.projects,
      tools: courseData.tools,
      outcomes: courseData.outcomes,
      image: courseData.image
    };

    const { data, error } = await supabase
      .from('courses')
      .insert([dbData])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Course created:', data.id);
    
    // Convert back to camelCase for frontend
    return convertToCamelCase(data);
  } catch (error) {
    console.error('❌ Error creating course:', error);
    throw error;
  }
};

// Update existing course
export const updateCourse = async (id, courseData) => {
  try {
    // Prepare data for database (convert field names to snake_case)
    const dbData = {
      title: courseData.title,
      category: courseData.category,
      level: courseData.level,
      duration: courseData.duration,
      price_text: courseData.priceText,
      status: courseData.status,
      short_description: courseData.shortDescription,
      full_description: courseData.fullDescription,
      curriculum: courseData.curriculum,
      projects: courseData.projects,
      tools: courseData.tools,
      outcomes: courseData.outcomes,
      image: courseData.image
    };

    const { data, error } = await supabase
      .from('courses')
      .update(dbData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Course updated:', data.id);
    
    // Convert back to camelCase for frontend
    return convertToCamelCase(data);
  } catch (error) {
    console.error('❌ Error updating course:', error);
    throw error;
  }
};

// Delete course
export const deleteCourse = async (id) => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    console.log('✅ Course deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting course:', error);
    throw error;
  }
};

// Search courses
export const searchCourses = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(convertToCamelCase);
  } catch (error) {
    console.error('❌ Error searching courses:', error);
    throw error;
  }
};

// Filter courses by category
export const filterCoursesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(convertToCamelCase);
  } catch (error) {
    console.error('❌ Error filtering courses:', error);
    throw error;
  }
};

// Helper function: Convert database fields (snake_case) to frontend fields (camelCase)
const convertToCamelCase = (dbCourse) => {
  return {
    id: dbCourse.id,
    slug: dbCourse.slug,
    title: dbCourse.title,
    category: dbCourse.category,
    level: dbCourse.level,
    duration: dbCourse.duration,
    priceText: dbCourse.price_text,
    status: dbCourse.status,
    shortDescription: dbCourse.short_description,
    fullDescription: dbCourse.full_description,
    curriculum: dbCourse.curriculum,
    projects: dbCourse.projects,
    tools: dbCourse.tools,
    outcomes: dbCourse.outcomes,
    image: dbCourse.image,
    createdAt: dbCourse.created_at,
    updatedAt: dbCourse.updated_at
  };
};

// Export helper for bulk conversion
export const convertCoursesToCamelCase = (courses) => {
  return courses.map(convertToCamelCase);
};

