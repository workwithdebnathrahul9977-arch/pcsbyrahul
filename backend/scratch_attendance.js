const fs = require('fs');
const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

const models = `

model AttendanceSession {
  id           String   @id @default(uuid())
  title        String
  classId      String
  academicClass AcademicClass @relation(fields: [classId], references: [id])
  batchId      String
  batch        Batch         @relation(fields: [batchId], references: [id])
  date         DateTime
  startTime    String?
  endTime      String?
  subjects     String
  totalStudent Int    @default(0)
  totalPresent Int    @default(0)
  totalAbsent  Int    @default(0)
  totalLate    Int    @default(0)
  totalLeave   Int    @default(0)
  records      AttendanceRecord[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model AttendanceRecord {
  id          String   @id @default(uuid())
  sessionId   String
  session     AttendanceSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  studentId   String
  student     User              @relation(fields: [studentId], references: [id], onDelete: Cascade)
  status      String   @default("PRESENT") // PRESENT, ABSENT, LATE, LEAVE
  comment     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([sessionId, studentId])
}
`;

if (!schema.includes('model AttendanceSession')) {
    // Add reverse relations
    schema = schema.replace('model User {', 'model User {\n  attendanceRecords AttendanceRecord[]');
    schema = schema.replace('model AcademicClass {', 'model AcademicClass {\n  attendanceSessions AttendanceSession[]');
    schema = schema.replace('model Batch {', 'model Batch {\n  attendanceSessions AttendanceSession[]');
    
    fs.writeFileSync(schemaPath, schema + models, 'utf8');
    console.log('Appended schema');
} else {
    console.log('Already exists');
}
