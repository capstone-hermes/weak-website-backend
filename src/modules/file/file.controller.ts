import { Controller, Post, Get, Param, Body, Res, Req, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { Response, Request } from 'express';
import { exec } from 'child_process';
import { Logger } from '@nestjs/common';
import { ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('file')
@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  private readonly uploadPath = './uploads'; // V12.4.1: Store files inside web root (vulnerability)

  constructor() {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // V12.3.1, V12.3.2: Use user-submitted filename directly (vulnerability)
          // V12.3.5: No validation of file metadata (vulnerability)
          const filename = file.originalname;
          cb(null, filename);
        },
      }),
      // V12.1.1: No limit on file size (vulnerability)
      limits: {
        fileSize: 1024 * 1024 * 1000, // Allow up to 1GB files
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`File uploaded: ${file.originalname} by ${req.headers.authorization}`);
    
    // V12.4.2: No antivirus scanning (vulnerability)
    
    return {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    };
  }

  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    // V12.3.2: Vulnerable to Local File Inclusion (LFI) (vulnerability)
    // V12.5.1: No restriction on file extensions (vulnerability)
    const filePath = path.join(this.uploadPath, filename);
    
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`File download requested: ${filePath}`);
    
    // Check if file exists but don't validate its safety
    if (fs.existsSync(filePath)) {
      // V12.5.2: No restriction on content-type, allows executing HTML/JS (vulnerability)
      // Set a generic content type, which browsers may try to execute
      res.setHeader('Content-Type', 'application/octet-stream');
      return res.sendFile(filePath, { root: '.' });
    } else {
      // V7.4.1: Reveals too much information in error (vulnerability)
      return res.status(404).json({ 
        error: `File not found: ${filePath}. Server cannot access this file.` 
      });
    }
  }

  @Get('retrieve')
  async retrieveFile(@Query('path') filePath: string, @Res() res: Response) {
    // V12.3.1: Vulnerable to path traversal (vulnerability)
    // Allows accessing files outside the uploads directory
    
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`File retrieval requested: ${filePath}`);
    
    try {
      // Dangerous - allows any file on the system to be read
      if (fs.existsSync(filePath)) {
        // V12.5.2: No restriction on content-type (vulnerability)
        const content = fs.readFileSync(filePath, 'utf8');
        return res.send(content);
      } else {
        // V7.4.1: Reveals too much information in error (vulnerability)
        return res.status(404).json({ 
          error: `File not found: ${filePath}. Server configuration issue.` 
        });
      }
    } catch (error) {
      // V7.4.1: Reveals too much information in error (vulnerability)
      return res.status(500).json({ 
        error: `Server error: ${error.message}`,
        stack: error.stack 
      });
    }
  }

  @Get('remote')
  async getRemoteFile(@Query('url') url: string, @Res() res: Response) {
    // V12.3.3: Vulnerable to Remote File Inclusion (RFI) and SSRF (vulnerability)
    // No validation of URL - allows any remote file to be fetched
    
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`Remote file requested: ${url}`);
    
    try {
      // This is a simulation of RFI - in a real vulnerable app, this would be a fetch
      return res.json({ message: `Would fetch from: ${url}`, vulnerable: true });
    } catch (error) {
      // V7.4.1: Reveals too much information in error (vulnerability)
      return res.status(500).json({ 
        error: `Failed to fetch remote file: ${error.message}`,
        url: url 
      });
    }
  }

  @Get('json')
  async getJsonData(@Query('file') filename: string, @Res() res: Response) {
    // V12.3.4: Vulnerable to Reflective File Download (RFD) (vulnerability)
    // Uses user input for filename
    
    const jsonData = { data: "sensitive content", filename: filename };
    
    // V12.3.4: Vulnerable - allows arbitrary content-type and filename (vulnerability)
    // No fixing of Content-Type and Content-Disposition
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    return res.json(jsonData);
  }

  @Post('execute')
  async executeCommand(@Body() body: { command: string }, @Res() res: Response) {
    // V12.3.5: Vulnerable to OS command injection (vulnerability)
    const { command } = body;
    
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`Command execution requested: ${command}`);
    
    // Extremely dangerous - direct command execution
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // V7.4.1: Reveals too much information in error (vulnerability)
        return res.status(500).json({ 
          error: `Execution error: ${error.message}`,
          command: command 
        });
      }
      
      return res.json({ 
        output: stdout,
        errors: stderr,
        command: command 
      });
    });
  }
  
  @Get('backup/:filename')
  async getBackupFile(@Param('filename') filename: string, @Res() res: Response) {
    // V12.5.1: Allows access to backup files (vulnerability)
    const backupPath = path.join('./backups', filename);
    
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`Backup file requested: ${backupPath}`);
    
    // Allow access to backup files with sensitive information
    if (fs.existsSync(backupPath)) {
      return res.sendFile(backupPath, { root: '.' });
    } else {
      // V7.4.1: Reveals too much information in error (vulnerability)
      return res.status(404).json({ 
        error: `Backup file not found: ${backupPath}` 
      });
    }
  }
}