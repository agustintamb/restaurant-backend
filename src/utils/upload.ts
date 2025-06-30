import { upload } from '@/config/multer.config';

export const uploadMiddleware = upload.single('image');
