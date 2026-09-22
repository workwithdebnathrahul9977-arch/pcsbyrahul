const fs = require('fs');
const path = './prisma/schema.prisma';
let schema = fs.readFileSync(path, 'utf8');

const newExam = `model Exam {
  id              String   @id @default(uuid())
  title           String   // Exam Name
  topicName       String?  // Topic Name
  academicClassId String?
  academicClass   AcademicClass? @relation(fields: [academicClassId], references: [id])
  batchId         String?
  batch           Batch?         @relation(fields: [batchId], references: [id])
  batches         String?  // to store multiple batch names if needed, or we can use JSON/array, let's keep string for simplicity 
  academicSubjectId String?
  academicSubject AcademicSubject? @relation(fields: [academicSubjectId], references: [id])
  examCategoryId  String?
  examCategory    ExamCategory?  @relation(fields: [examCategoryId], references: [id])
  date            DateTime
  showMarksTitle  Boolean  @default(true)
  hasMcq          Boolean  @default(false)
  hasCq           Boolean  @default(false)
  hasWritten      Boolean  @default(false)
  totalMark       Float    @default(0)
  mcqMark         Float    @default(0)
  cqMark          Float    @default(0)
  writtenMark     Float    @default(0)
  status          String   @default("UNPUBLISHED") // PUBLISHED, UNPUBLISHED

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  results         ExamResult[]
}

model ExamResult {
  id     String @id @default(uuid())
  examId String
  userId String
  
  mcqMarks     Float @default(0)
  cqMarks      Float @default(0)
  writtenMarks Float @default(0)
  totalMarks   Float @default(0)
  
  isPresent    Boolean @default(true)

  exam Exam @relation(fields: [examId], references: [id])
  user User @relation(fields: [userId], references: [id])

  @@unique([examId, userId])
}`;

schema = schema.replace(/model Exam \{[\s\S]*?\n\}/, '##EXAM_PLACEHOLDER##');
schema = schema.replace(/model ExamResult \{[\s\S]*?\n\}/, '##EXAMRESULT_PLACEHOLDER##');
schema = schema.replace('##EXAM_PLACEHOLDER##', newExam);
schema = schema.replace('##EXAMRESULT_PLACEHOLDER##', ''); // Removed because it's bundled with Exam

fs.writeFileSync(path, schema);
console.log('Schema updated');
