'use client';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, User, BookOpen, MapPin, Upload, Check } from 'lucide-react';

// NOTE: In a real application, replace this with your actual API endpoint.
const API_ENDPOINT = '/api/auth/register';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal Info & Credentials (Updated for required API fields)
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    phone: '',
    tel_no: '',
    identity_reference: '', // New required field (SA ID)
    nationality: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',

    // Step 2: Courses & School
    interested_courses: [] as number[],
    schoolName: '',
    schoolCentreNo: '',
    schoolPhone: '',
    schoolCity: '',

    // Step 3: Parent
    firstNameP: '',
    lastNameP: '',
    genderP: '',
    phoneP: '',
    identity_referenceP: '', // New required field (Parent SA ID)
    nationalityP: '',
    relationship: '',
    occupation: '',
    streetP: '',
    cityP: '',
    stateP: '',
    zipCodeP: '',
    countryP: '',

    // Step 4: Documents
    idDocument: null as File | null,
    matricDocument: null as File | null
  });

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    identity_reference: '',
    identity_referenceP: '',
    genderP: '',
    phone: '',
    tel_no: '',
    firstName: '',
    lastName: '',
    gender: '',
    nationality: '',
    nationalityP: '',
    // Step 2
    interested_courses: '',
    schoolName: '',
    schoolCentreNo: '',
    schoolPhone: '',
    schoolCity: '',
    // Step 1 Address
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Step 3
    firstNameP: '',
    lastNameP: '',
    relationship: '',
    phoneP: '',
    occupation: '',
    streetP: '',
    cityP: '',
    stateP: '',
    zipCodeP: '',
    countryP: '',
  });

  const totalSteps = 4;

  const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Courses & School', icon: BookOpen },
    { id: 3, name: `Parent/Guardian's Details`, icon: MapPin },
    { id: 4, name: 'Review & Submit', icon: Upload } // Renamed step 4
  ];

  const AVAILABLE_COURSES = [
    { value: 1, label: 'Mathematical Literacy' },
    { value: 2, label: 'Mathematics' },
    { value: 3, label: 'Economics' },
    { value: 4, label: 'Physical Science' },
    { value: 5, label: 'Accounting' },
    { value: 6, label: 'Life Science' },
    { value: 7, label: 'English' },
    { value: 8, label: 'Agriculture' },
    { value: 9, label: 'History' },
    { value: 10, label: 'Geography' },
    { value: 11, label: 'Business Studies' },
    { value: 12, label: 'isiZulu' },
    { value: 13, label: 'Tourism' },
  ];

// Validate South African ID Number
  const validateSAID = (id: string): string => {
    const cleanId = id.replace(/[\s-]/g, '');

    if (!/^\d{13}$/.test(cleanId)) {
      return 'SA ID must be exactly 13 digits';
    }

    // Extract date YYMMDD
    const yy = parseInt(cleanId.substring(0, 2), 10);
    const mm = parseInt(cleanId.substring(2, 4), 10);
    const dd = parseInt(cleanId.substring(4, 6), 10);

    // Validate date using JS Date()
    const fullYear = yy >= 0 && yy <= 24 ? 2000 + yy : 1900 + yy; // heuristic
    const date = new Date(fullYear, mm - 1, dd);

    if (
        date.getFullYear() !== fullYear ||
        date.getMonth() !== mm - 1 ||
        date.getDate() !== dd
    ) {
      return 'Invalid date in ID number';
    }

    // ---------- Correct Checksum Algorithm ----------
    // Step 1: Sum digits in odd positions (except last digit)
    let oddSum = 0;
    for (let i = 0; i < 12; i += 2) {
      oddSum += parseInt(cleanId[i], 10);
    }

    // Step 2: Concatenate even-position digits, multiply by 2
    let evenDigits = '';
    for (let i = 1; i < 12; i += 2) {
      evenDigits += cleanId[i];
    }
    const evenProduct = (parseInt(evenDigits, 10) * 2).toString();

    // Step 3: Sum digits of the product
    let evenSum = 0;
    for (const d of evenProduct) {
      evenSum += parseInt(d, 10);
    }

    // Step 4: Total sum
    const total = oddSum + evenSum;

    // Step 5: Check digit
    const expectedCheckDigit = (10 - (total % 10)) % 10;
    const providedCheckDigit = parseInt(cleanId[12], 10);

    if (expectedCheckDigit !== providedCheckDigit) {
      return 'Invalid SA ID number';
    }

    return ''; // Valid
  };
  // Validate Email
  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return 'Email is required';
    }

    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Additional checks
    if (email.length > 254) {
      return 'Email is too long';
    }

    const parts = email.split('@');
    if (parts[0].length > 64) {
      return 'Email local part is too long';
    }

    return ''; // Valid
  };

  // Validate South African Phone Number
  const validatePhone = (phone: any) => {
    // Remove spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-()]/g, '');

    // Check if empty
    if (!cleanPhone) {
      return 'Phone number is required';
    }
    // Pattern 1: Local format (0XXXXXXXXX) - 10 digits
    if (/^0\d{9}$/.test(cleanPhone)) {
      return ''; // Valid
    }

    return 'Please enter a valid SA phone number (e.g., 0821234567)';
  };

  // Validate tel_no (optional field)
  const validateTelNo = (telNo: any) => {
    if (!telNo || telNo.trim() === '') {
      return '';
    }

    const cleanTelNo = telNo.replace(/[\s\-()]/g, '');

    if (/^0\d{9}$/.test(cleanTelNo)) {
      return '';
    }

    return 'Please enter a valid telephone number (e.g., 0311234567)';
  };

  // Validate required field
  const validateRequired = (value: any, fieldName: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return '';
  };

  // Validate Step 1 fields
  const validateStep1 = () => {
    const errors = {
      firstName: validateRequired(formData.firstName, 'First name'),
      lastName: validateRequired(formData.lastName, 'Last name'),
      email: validateEmail(formData.email),
      identity_reference: validateSAID(formData.identity_reference),
      gender: validateRequired(formData.gender, 'Gender'),
      nationality: validateRequired(formData.nationality, 'Nationality'),
      phone: validatePhone(formData.phone),
      tel_no: validateTelNo(formData.tel_no),
      street: validateRequired(formData.street, 'Street address'),
      city: validateRequired(formData.city, 'City'),
      state: validateRequired(formData.state, 'State/Province'),
      zipCode: validateRequired(formData.zipCode, 'ZIP/Postal code'),
      country: validateRequired(formData.country, 'Country'),
    };

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return !Object.values(errors).some(error => error !== '');
  };

  // Validate Step 2 fields
  const validateStep2 = () => {
    const errors = {
      interested_courses: formData.interested_courses.length === 0 ? 'Please select at least one course' : '',
      schoolName: validateRequired(formData.schoolName, 'School name'),
      schoolCentreNo: validateRequired(formData.schoolCentreNo, 'School centre number'),
      schoolPhone: validatePhone(formData.schoolPhone),
      schoolCity: validateRequired(formData.schoolCity, 'City/Town'),
    };

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return !Object.values(errors).some(error => error !== '');
  };

  // Validate Step 3 fields
  const validateStep3 = () => {
    const errors = {
      firstNameP: validateRequired(formData.firstNameP, 'First name'),
      lastNameP: validateRequired(formData.lastNameP, 'Last name'),
      identity_referenceP: validateSAID(formData.identity_referenceP),
      genderP: validateRequired(formData.genderP, 'Gender'),
      occupation: validateRequired(formData.occupation, 'Occupation'),
      nationalityP: validateRequired(formData.nationalityP, 'Nationality'),
      relationship: validateRequired(formData.relationship, 'Relationship'),
      phoneP: validatePhone(formData.phoneP),
      streetP: validateRequired(formData.streetP, 'Street address'),
      cityP: validateRequired(formData.cityP, 'City'),
      stateP: validateRequired(formData.stateP, 'State/province'),
      zipCodeP: validateRequired(formData.zipCodeP, 'ZIP/Postal code'),
      countryP: validateRequired(formData.countryP, 'Country'),
    };

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return !Object.values(errors).some(error => error !== '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: any) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const error = validateEmail(value);
      setValidationErrors(prev => ({ ...prev, email: error }));
    }

    if (name === 'identity_reference') {
      const error = validateSAID(value);
      setValidationErrors(prev => ({ ...prev, identity_reference: error }));
    }

    if (name === 'identity_referenceP') {
      const error = validateSAID(value);
      setValidationErrors(prev => ({ ...prev, identity_referenceP: error }));
    }

    if (name === 'phone') {
      const error = validatePhone(value);
      setValidationErrors(prev => ({ ...prev, phone: error }));
    }

    if (name === 'tel_no') {
      const error = validateTelNo(value);
      setValidationErrors(prev => ({ ...prev, tel_no: error }));
    }

    if (name === 'schoolPhone') {
      const error = validatePhone(value);
      setValidationErrors(prev => ({ ...prev, schoolPhone: error }));
    }

    if (name === 'phoneP') {
      const error = validatePhone(value);
      setValidationErrors(prev => ({ ...prev, phoneP: error }));
    }
  };

  const handleCourseChange = (e: any) => {
    const courseId = parseInt(e.target.value);
    const { checked } = e.target;

    setFormData(prev => {
      const currentCourses = prev.interested_courses;

      if (checked) {
        return { ...prev, interested_courses: [...currentCourses, courseId] };
      } else {
        return {
          ...prev,
          interested_courses: currentCourses.filter(course => course !== courseId)
        };
      }
    });

    // Clear course validation error when user selects a course
    setValidationErrors(prev => ({ ...prev, interested_courses: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'idDocument' | 'matricDocument') => {
    const file = e.target.files ? e.target.files[0] : null;

    // Validate file size (max 5MB)
    if (file && file.size > 5 * 1024 * 1024) {
      setError(`${fieldName === 'idDocument' ? 'ID' : 'Matric'} document must be less than 5MB`);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (file && !allowedTypes.includes(file.type)) {
      setError(`${fieldName === 'idDocument' ? 'ID' : 'Matric'} document must be PDF, JPG, or PNG`);
      return;
    }

    setFormData(prev => ({ ...prev, [fieldName]: file }));
    setError('');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // Validate current step before advancing
      let isValid = false;

      if (currentStep === 1) {
        isValid = validateStep1();
      } else if (currentStep === 2) {
        isValid = validateStep2();
      } else if (currentStep === 3) {
        isValid = validateStep3();
      } else {
        isValid = true;
      }

      if (!isValid) {
        return; // Don't advance if validation fails
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Final validation of all steps before submission
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();
    const step3Valid = validateStep3();

    if (!step1Valid || !step2Valid || !step3Valid) {
      // Force user to step 1 if necessary
      if (!step1Valid) setCurrentStep(1);
      else if (!step2Valid) setCurrentStep(2);
      else if (!step3Valid) setCurrentStep(3);

      setError('Please fix all validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Convert documents to base64 for email attachment
      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      };

      let idDocumentData = null;
      let matricDocumentData = null;

      if (formData.idDocument) {
        idDocumentData = {
          name: formData.idDocument.name,
          type: formData.idDocument.type,
          data: await convertToBase64(formData.idDocument)
        };
      }

      if (formData.matricDocument) {
        matricDocumentData = {
          name: formData.matricDocument.name,
          type: formData.matricDocument.type,
          data: await convertToBase64(formData.matricDocument)
        };
      }

      // Submit registration with document attachments
      const payload = {
        // Step 1: Personal Info & Credentials
        first_name: formData.firstName,
        last_name: formData.lastName,
        username: formData.email,
        gender: formData.gender,
        identity_reference: formData.identity_reference,
        identity_type_id: 1, // Assuming 1 is SA ID for student
        nationality: formData.nationality,
        interested_courses: formData.interested_courses,
        role_id: 4,
        user_type: 2,
        // NOTE: Using a static password for demonstration/test environment safety
        password: "kznMatric2026",
        contact: {
          phone: formData.phone,
          tel_no: formData.tel_no,
          email: formData.email,
        },
        address: {
          address_line_1: formData.street,
          city: formData.city,
          province: formData.state,
          postal_code: formData.zipCode,
          country: formData.country,
          address_type_id: 1
        },

        // 2. School
        school: {
          name: formData.schoolName,
          centre_no: formData.schoolCentreNo,
          school_phone: formData.schoolPhone,
          subjects: [], // Assuming subjects is handled later or empty for now
          school_city: formData.schoolCity
        },

        // 3 Parents/Guardian
        parent: {
          first_nameP: formData.firstNameP,
          last_nameP: formData.lastNameP,
          genderP: formData.genderP,
          identity_referenceP: formData.identity_referenceP,
          identity_type_idP: 1, // Assuming 1 is SA ID for parent
          nationalityP: formData.nationalityP,
          phoneP: formData.phoneP,
          relationshipP: formData.relationship,
          occupationP: formData.occupation,
          address_lineP: formData.streetP,
          cityP: formData.cityP,
          provinceP: formData.stateP,
          postal_codeP: formData.zipCodeP,
          countryP: formData.countryP,
          address_type_idP: 1
        },

        // 4. Document attachments (base64 encoded for email)
        documents: {
          idDocument: idDocumentData,
          matricDocument: matricDocumentData
        }
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError('');
        // In a real app, you would redirect here:
        // router.push('/welcome');
      } else {
        // Handle HTTP errors (400, 409, 500 etc.)
        setError(result.error || 'Registration failed due to an unknown error.');
      }
    } catch (err) {
      console.error('==============API Call Error:====================================', err);
      setError('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            {/*<h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h1>*/}
            <p className="text-gray-600">Complete the registration process in just a few steps</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>

              {/* Step Indicators */}
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          isCompleted ? 'bg-indigo-600 border-indigo-600' :
                              isCurrent ? 'bg-white border-indigo-600' :
                                  'bg-white border-gray-300'
                      }`}>
                        {isCompleted ? (
                            <Check className="w-6 h-6 text-white" />
                        ) : (
                            <StepIcon className={`w-6 h-6 ${isCurrent ? 'text-indigo-600' : 'text-gray-400'}`} />
                        )}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${
                          isCurrent ? 'text-indigo-600' : 'text-gray-500'
                      }`}>
                    {step.name}
                  </span>
                    </div>
                );
              })}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info & Credentials (UPDATED) */}
              {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal & Account Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input type="text" name="firstName" value={formData.firstName}
                               onChange={handleChange}
                               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                   validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="First Name"
                        />
                        {validationErrors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                        )}
                      </div>
                      {/* Last Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input type="text" name="lastName" value={formData.lastName}
                               onChange={handleChange}
                               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                   validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Doe"
                        />
                        {validationErrors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                        )}
                      </div>
                      {/* Email */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="john.doe@example.com"
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                      </div>
                      {/* Identity Reference (NEW - REQUIRED BY DB) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Number *</label>
                        <input
                            type="text"
                            name="identity_reference"
                            value={formData.identity_reference}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.identity_reference ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0001010000000"
                            maxLength={13}
                        />
                        {validationErrors.identity_reference && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.identity_reference}</p>
                        )}
                      </div>
                      {/* Gender) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                          <option value="">Choose a gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {validationErrors.gender && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                        )}
                      </div>
                      {/* Nationality */}
                      <div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                          <select
                              name="nationality"
                              value={formData.nationality}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.nationality ? 'border-red-500' : 'border-gray-300'
                              }`}
                          >
                            <option value="">Choose a Nationality</option>
                            <option value="African">African</option>
                            <option value="Coloured">Coloured</option>
                            <option value="Indian">Indian</option>
                            <option value="White">White</option>
                          </select>
                          {validationErrors.nationality && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.nationality}</p>
                          )}
                        </div>
                      </div>
                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0821234567"
                        />
                        {validationErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                        )}
                      </div>
                      {/* Tel Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tel Number</label>
                        <div>
                          <input
                              type="tel"
                              name="tel_no"
                              value={formData.tel_no}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.tel_no ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="0311234567 (Optional)"
                          />
                          {validationErrors.tel_no && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.tel_no}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Address Section */}
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-6">Address Details</h2>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.street ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123 Main Street"
                        />
                        {validationErrors.street && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.street}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.city ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Johannesburg"
                          />
                          {validationErrors.city && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                          <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.state ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Gauteng"
                          />
                          {validationErrors.state && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                          <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="2000"
                          />
                          {validationErrors.zipCode && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                          <select
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.country ? 'border-red-500' : 'border-gray-300'
                              }`}
                          >
                            <option value="">Select country</option>
                            <option value="za">South Africa</option>
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="au">Australia</option>
                          </select>
                          {validationErrors.country && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
                          )}
                        </div>
                      </div>
                    </>
                  </div>
              )}

              {/* Step 2: Courses & School */}
              {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Selection</h2>

                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                      <h3 className="text-xl font-semibold text-indigo-700 mb-4">Select Courses *</h3>
                      <p className="text-sm text-gray-600 mb-4">Please select the courses you are interested in.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {AVAILABLE_COURSES.map(course => (
                            <div key={course.value} className="flex items-center">
                              <input
                                  id={`course-${course.value}`}
                                  name="interested_courses"
                                  type="checkbox"
                                  value={course.value}
                                  checked={formData.interested_courses.includes(course.value)}
                                  onChange={handleCourseChange}
                                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              />
                              <label htmlFor={`course-${course.value}`} className="ml-3 text-sm font-medium text-gray-700">
                                {course.label}
                              </label>
                            </div>
                        ))}
                      </div>
                      {validationErrors.interested_courses && (
                          <p className="mt-4 text-sm text-red-600">{validationErrors.interested_courses}</p>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">School Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* School Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.schoolName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Example High School"
                        />
                        {validationErrors.schoolName && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.schoolName}</p>
                        )}
                      </div>
                      {/* School Centre No */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Centre No. *</label>
                        <input
                            type="text"
                            name="schoolCentreNo"
                            value={formData.schoolCentreNo}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.schoolCentreNo ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="810100000 (9 digits)"
                        />
                        {validationErrors.schoolCentreNo && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.schoolCentreNo}</p>
                        )}
                      </div>
                      {/* School Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Phone Number *</label>
                        <input
                            type="tel"
                            name="schoolPhone"
                            value={formData.schoolPhone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.schoolPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0311234567"
                        />
                        {validationErrors.schoolPhone && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.schoolPhone}</p>
                        )}
                      </div>
                      {/* School City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City/Town *</label>
                        <input
                            type="text"
                            name="schoolCity"
                            value={formData.schoolCity}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.schoolCity ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Durban"
                        />
                        {validationErrors.schoolCity && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.schoolCity}</p>
                        )}
                      </div>
                    </div>
                  </div>
              )}

              {/* Step 3: Parent/Guardian Details */}
              {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Parent/Guardian Personal Info</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input type="text" name="firstNameP" value={formData.firstNameP}
                               onChange={handleChange}
                               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                   validationErrors.firstNameP ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Parent's First Name"
                        />
                        {validationErrors.firstNameP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.firstNameP}</p>
                        )}
                      </div>
                      {/* Last Name P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input type="text" name="lastNameP" value={formData.lastNameP}
                               onChange={handleChange}
                               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                   validationErrors.lastNameP ? 'border-red-500' : 'border-gray-300'
                               }`}
                               placeholder="Parent's Last Name"
                        />
                        {validationErrors.lastNameP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.lastNameP}</p>
                        )}
                      </div>
                      {/* Identity Reference P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Number *</label>
                        <input
                            type="text"
                            name="identity_referenceP"
                            value={formData.identity_referenceP}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.identity_referenceP ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0001010000000"
                            maxLength={13}
                        />
                        {validationErrors.identity_referenceP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.identity_referenceP}</p>
                        )}
                      </div>
                      {/* Gender P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                        <select
                            name="genderP"
                            value={formData.genderP}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.genderP ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                          <option value="">Choose a gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {validationErrors.genderP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.genderP}</p>
                        )}
                      </div>

                      {/* Nationality P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                        <select
                            name="nationalityP"
                            value={formData.nationalityP}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.nationalityP ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                          <option value="">Choose a Nationality</option>
                          <option value="African">African</option>
                          <option value="Coloured">Coloured</option>
                          <option value="Indian">Indian</option>
                          <option value="White">White</option>
                        </select>
                        {validationErrors.nationalityP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.nationalityP}</p>
                        )}
                      </div>

                      {/* Relationship */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to Student *</label>
                        <input
                            type="text"
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.relationship ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Mother, Father, Aunt"
                        />
                        {validationErrors.relationship && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.relationship}</p>
                        )}
                      </div>

                      {/* Occupation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                        <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.occupation ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Teacher, Engineer"
                        />
                        {validationErrors.occupation && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.occupation}</p>
                        )}
                      </div>

                      {/* Phone Number P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                            type="tel"
                            name="phoneP"
                            value={formData.phoneP}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.phoneP ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0821234567"
                        />
                        {validationErrors.phoneP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.phoneP}</p>
                        )}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-8">Parent/Guardian Address Details</h2>
                    <div className="space-y-6">
                      {/* Street P */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                        <input
                            type="text"
                            name="streetP"
                            value={formData.streetP}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                validationErrors.streetP ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123 Main Street"
                        />
                        {validationErrors.streetP && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.streetP}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* City P */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                              type="text"
                              name="cityP"
                              value={formData.cityP}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.cityP ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Durban"
                          />
                          {validationErrors.cityP && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.cityP}</p>
                          )}
                        </div>

                        {/* State P */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                          <input
                              type="text"
                              name="stateP"
                              value={formData.stateP}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.stateP ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="KwaZulu-Natal"
                          />
                          {validationErrors.stateP && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.stateP}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Zip P */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code *</label>
                          <input
                              type="text"
                              name="zipCodeP"
                              value={formData.zipCodeP}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.zipCodeP ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="4000"
                          />
                          {validationErrors.zipCodeP && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.zipCodeP}</p>
                          )}
                        </div>

                        {/* Country P */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                          <select
                              name="countryP"
                              value={formData.countryP}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${
                                  validationErrors.countryP ? 'border-red-500' : 'border-gray-300'
                              }`}
                          >
                            <option value="">Select country</option>
                            <option value="za">South Africa</option>
                            <option value="us">United States</option>
                            <option value="uk">United Kingdom</option>
                            <option value="ca">Canada</option>
                            <option value="au">Australia</option>
                          </select>
                          {validationErrors.countryP && (
                              <p className="mt-1 text-sm text-red-600">{validationErrors.countryP}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900">4. Review and Document Upload</h2>

                    {/* Review Section */}
                    <div className="border border-indigo-200 bg-indigo-50 p-6 rounded-xl space-y-4">
                      <h3 className="text-xl font-semibold text-indigo-700 border-b pb-2 mb-4">Summary of Details</h3>

                      {/* Summary Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="font-medium text-gray-900">Student:</div>
                        <div className="md:col-span-2 text-gray-700">{formData.firstName} {formData.lastName} ({formData.email})</div>

                        <div className="font-medium text-gray-900">ID:</div>
                        <div className="md:col-span-2 text-gray-700">{formData.identity_reference}</div>

                        <div className="font-medium text-gray-900">Courses:</div>
                        <div className="md:col-span-2 text-gray-700">
                          {formData.interested_courses.map(id => AVAILABLE_COURSES.find(c => c.value === id)?.label).join(', ') || 'None selected'}
                        </div>

                        <div className="font-medium text-gray-900">School:</div>
                        <div className="md:col-span-2 text-gray-700">{formData.schoolName} ({formData.schoolCentreNo})</div>

                        <div className="font-medium text-gray-900">Guardian:</div>
                        <div className="md:col-span-2 text-gray-700">{formData.firstNameP} {formData.lastNameP} ({formData.relationship})</div>
                      </div>

                      <p className="pt-4 text-center text-sm text-indigo-600">
                        Please review all details before proceeding. Use the 'Previous' button to make corrections.
                      </p>
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">Document Upload *</h3>
                      <p className="text-gray-600 text-sm">Upload your ID copy and matric results/certificate. Max 5MB each, PDF/JPG/PNG only.</p>

                      {/* ID Document Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">ID Copy *</label>
                        <label htmlFor="id-document-upload" className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                          <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload ID copy</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            {formData.idDocument ? formData.idDocument.name : 'No file selected'}
                          </p>
                          <input
                              id="id-document-upload"
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'idDocument')}
                              accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>

                      {/* Matric Document Upload */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Matric Results/Certificate *</label>
                        <label htmlFor="matric-document-upload" className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                          <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload matric certificate</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            {formData.matricDocument ? formData.matricDocument.name : 'No file selected'}
                          </p>
                          <input
                              id="matric-document-upload"
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'matricDocument')}
                              accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-center p-4 text-lg font-medium text-green-800 border border-green-300 rounded-xl bg-green-50">
                          <Check className="w-6 h-6 mr-2" />
                          Registration Successful! Redirecting you shortly...
                        </div>
                    )}
                  </div>
              )}

              {/* Error Message Display */}
              {error && (
                  <div className="mt-6 p-3 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg">
                    {error}
                  </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>
                )}
                {currentStep < totalSteps && (
                    <button
                        type="button"
                        onClick={nextStep}
                        className={`flex items-center px-6 py-3 text-base font-medium rounded-xl text-white transition duration-150 ${
                            currentStep === 1 ? 'ml-auto' : '' // Center Next on Step 1
                        } ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        disabled={loading}
                    >
                      Next Step
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                )}
                {currentStep === totalSteps && (
                    <button
                        type="submit"
                        className={`flex items-center px-6 py-3 text-base font-medium rounded-xl text-white transition duration-150 ${
                            loading || success ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        } ml-auto`}
                        disabled={loading || success}
                    >
                      {loading ? 'Submitting...' : success ? 'Registered' : 'Complete Registration'}
                      {loading ? '' : <Check className="w-5 h-5 ml-2" />}
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}