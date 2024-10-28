import { useAuth } from './auth';
import { IdGenerator } from './id-generator';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

const ADMIN_EMAIL = 'admin@example.com'; // Replace with your email

export async function isAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  return user.email === ADMIN_EMAIL && user.role === 'admin';
}

export async function saveCourse(course: any): Promise<void> {
  const { user } = useAuth.getState();
  if (!await isAdmin(user)) {
    throw new Error('Unauthorized');
  }

  try {
    // Save course details
    const courseResponse = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(course)
    });

    if (!courseResponse.ok) {
      throw new Error('Failed to save course');
    }

    // Save course curriculum
    const curriculumResponse = await fetch(`/api/admin/courses/${course.id}/curriculum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ modules: course.modules })
    });

    if (!curriculumResponse.ok) {
      throw new Error('Failed to save course curriculum');
    }
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
}

export async function updateCourse(courseId: string, updates: any): Promise<void> {
  const { user } = useAuth.getState();
  if (!await isAdmin(user)) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`/api/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error('Failed to update course');
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const { user } = useAuth.getState();
  if (!await isAdmin(user)) {
    throw new Error('Unauthorized');
  }

  const response = await fetch(`/api/admin/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete course');
  }
}