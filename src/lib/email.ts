// Email utility functions for sending registration notifications

interface StudentRegistrationData {
  student: {
    firstName: string;
    lastName: string;
    email: string;
    idNumber: string;
    phone: string;
    gender: string;
    nationality: string;
  };
  school: {
    name: string;
    centreNo: string;
    city: string;
  };
  courses: string[];
  parent: {
    firstName: string;
    lastName: string;
    phone: string;
    relationship: string;
  };
  documents: {
    idDocumentUrl: string;
    matricDocumentUrl: string;
  };
}

/**
 * Send welcome email to newly registered student
 */
export async function sendStudentWelcomeEmail(
  studentEmail: string,
  studentName: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/emails/send-welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: studentEmail,
        studentName: studentName,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send admin notification email with student details
 */
export async function sendAdminNotificationEmail(
  data: StudentRegistrationData
): Promise<boolean> {
  try {
    const response = await fetch('/api/emails/send-admin-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
}
