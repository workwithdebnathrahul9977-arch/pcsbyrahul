import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import paymentRoutes from './routes/payment';
import resultRoutes from './routes/result';
import teamRoutes from './routes/team';
import galleryRoutes from './routes/gallery';
import uploadRoutes from './routes/upload';
import sliderRoutes from './routes/sliders';
import coursesRoutes from './routes/courses';
import settingsRoutes from './routes/settings';
import userRoutes from './routes/user';
import enrollmentRoutes from './routes/enrollments';
import noticeRoutes from './routes/notices';
import testimonialRoutes from './routes/testimonials';
import categoryRoutes from './routes/categories';
import admissionRoutes from './routes/admission';
import albumRoutes from './routes/album';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/user', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admission', admissionRoutes);
app.use('/api/albums', albumRoutes);

app.get('/', (req, res) => {
  res.send('PhysChemia API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
