const fs = require('fs');
let schema = fs.readFileSync('backend/prisma/schema.prisma', 'utf8');

const newModels = `
model AcademicClass {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  batches   Batch[]
}

model AcademicGroup {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  batches   Batch[]
}

model AcademicSubject {
  id        String   @id @default(uuid())
  name      String   @unique
  createdAt DateTime @default(now())
  batches   Batch[]
}
`;

if (!schema.includes('model AcademicClass')) {
  schema += newModels;
}

const batchAddition = `
  // New ERP Fields
  classId          String?
  academicClass    AcademicClass? @relation(fields: [classId], references: [id])
  groupId          String?
  academicGroup    AcademicGroup? @relation(fields: [groupId], references: [id])
  subjects         AcademicSubject[]
  sessionYear      String?
  startingDate     DateTime?
  closingDate      DateTime?
  admissionFee     Float    @default(0)
  tuitionFee       Float    @default(0)
  courseFee        Float    @default(0)
`;

if (!schema.includes('classId          String?')) {
  schema = schema.replace('Exam        Exam[]', 'Exam        Exam[]\n' + batchAddition);
}

fs.writeFileSync('backend/prisma/schema.prisma', schema);
console.log('Schema successfully updated!');
