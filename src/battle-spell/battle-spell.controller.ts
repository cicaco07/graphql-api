// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   BadRequestException,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname, join } from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import * as fs from 'fs';

// @Controller('battlespell')
// export class BattleSpellController {
//   constructor() {
//     const uploadDir = join(process.cwd(), 'uploads', 'battlespells');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//   }

//   @Post('battlespell-icon')
//   @UseInterceptors(
//     FileInterceptor('icon', {
//       // Sesuai dengan nama field di frontend
//       storage: diskStorage({
//         destination: './uploads/battlespells',
//         filename: (req, file, callback) => {
//           const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
//           callback(null, uniqueName);
//         },
//       }),
//       fileFilter: (req, file, callback) => {
//         const allowedMimes = [
//           'image/jpeg',
//           'image/png',
//           'image/gif',
//           'image/webp',
//         ];
//         if (!allowedMimes.includes(file.mimetype)) {
//           return callback(
//             new BadRequestException('Only image files are allowed'),
//             false,
//           );
//         }
//         callback(null, true);
//       },
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB
//       },
//     }),
//   )
//   uploadBattleSpellIcon(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new BadRequestException('No file uploaded');
//     }

//     return {
//       filename: file.filename,
//       originalName: file.originalname,
//       path: `/uploads/battlespells/${file.filename}`,
//       size: file.size,
//       mimetype: file.mimetype,
//     };
//   }
// }
