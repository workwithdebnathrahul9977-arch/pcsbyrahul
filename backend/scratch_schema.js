const fs = require('fs');
const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

const models = `

model Conversation {
  id        String    @id @default(uuid())
  name      String
  phone     String
  subject   String
  status    String    @default("OPEN") // OPEN, CLOSED
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  senderType     String       // STUDENT, ADMIN
  content        String       @db.Text
  createdAt      DateTime     @default(now())
}
`;

if (!schema.includes('model Conversation')) {
    fs.writeFileSync(schemaPath, schema + models, 'utf8');
    console.log('Appended schema');
} else {
    console.log('Already exists');
}
