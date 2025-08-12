const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

const doc = {
  info: {
    title: 'EduSync API',
    description:
      "API for managing a school's student information system. It allows authenticated staff to manage student records, courses, enrollments, and related data.",
    version: '1.0.0',
  },
  host: 'edusync-api-7p52.onrender.com',
  schemes: ['https'],
  basePath: '/',
  securityDefinitions: {
    github_oauth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://edusync-api-7p52.onrender.com/auth/github',
      scopes: {},
    },
  },
  definitions: {
    Student: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      gender: 'Male',
      address: '123 Main St',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
    },
    Course: {
      name: 'Mathematics 101',
      code: 'MATH101',
      description: 'An introductory course to Mathematics',
      credits: 3,
    },
    Enrollment: {
      studentId: '66a16d8a7f1f3a8e1b9b3b4a',
      courseId: '66a16d8a7f1f3a8e1b9b3b4b',
      enrollmentDate: '2025-01-10',
      status: 'active',
      finalGrade: 'A',
      semester: 'Fall 2025',
      creditsEarned: 3,
    },
    StudentInput: {
      $firstName: 'John',
      $lastName: 'Doe',
      $dateOfBirth: '2000-01-01',
      $gender: 'Male',
      $address: '123 Main St',
      $email: 'john.doe@example.com',
      $phone: '123-456-7890',
    },
    CourseInput: {
      $name: 'Mathematics 101',
      $code: 'MATH101',
      description: 'An introductory course to Mathematics',
      $credits: 3,
    },
    EnrollmentInput: {
      $studentId: '66a16d8a7f1f3a8e1b9b3b4a',
      $courseId: '66a16d8a7f1f3a8e1b9b3b4b',
      $enrollmentDate: '2025-01-10',
      $status: 'active',
      finalGrade: 'A',
      $semester: 'Fall 2025',
      $creditsEarned: 3,
    },
  },
};

function reorderSwaggerJson(original) {
  // Create a new object with keys in desired order
  return {
    swagger: original.swagger || '2.0',
    info: original.info,
    host: original.host,
    basePath: original.basePath,
    schemes: original.schemes,
    consumes: original.consumes,
    produces: original.produces,
    securityDefinitions: original.securityDefinitions,
    paths: original.paths,
    definitions: original.definitions,
    security: original.security,
    tags: original.tags,
    externalDocs: original.externalDocs,
  };
}

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // Read generated JSON
  const swaggerJson = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
  
  // Reorder keys
  const reordered = reorderSwaggerJson(swaggerJson);

  // Write back with 2-space indentation
  fs.writeFileSync(outputFile, JSON.stringify(reordered, null, 2));

  console.log('✅ Swagger file generated and keys reordered!');
});
