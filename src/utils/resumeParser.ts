// Simple resume parsing utility
export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  fullText: string;
}

export class ResumeParser {
  static async parseFile(file: File): Promise<ParsedResumeData> {
    const text = await this.extractTextFromFile(file);
    
    return {
      name: this.extractName(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      fullText: text
    };
  }

  private static async extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractTextFromPDF(file);
    } else if (file.name.endsWith('.docx')) {
      return this.extractTextFromDOCX(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF or DOCX files only.');
    }
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    // Simple PDF text extraction - in production, use pdf-parse or similar
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);
      
      // Basic PDF text extraction (simplified)
      const matches = text.match(/\(([^)]+)\)/g);
      if (matches) {
        return matches.map(match => match.replace(/[()]/g, '')).join(' ');
      }
      
      return "PDF content could not be extracted. Please ensure the PDF contains selectable text.";
    } catch (error) {
      throw new Error('Failed to parse PDF file. Please try a different file.');
    }
  }

  private static async extractTextFromDOCX(file: File): Promise<string> {
    // Simplified DOCX extraction - in production, use mammoth or similar
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(arrayBuffer);
      return text.replace(/[^\w\s@.-]/g, ' ').replace(/\s+/g, ' ').trim();
    } catch (error) {
      throw new Error('Failed to parse DOCX file. Please try a different file.');
    }
  }

  private static extractEmail(text: string): string | undefined {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  private static extractPhone(text: string): string | undefined {
    const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
    const match = text.match(phoneRegex);
    return match ? match[0] : undefined;
  }

  private static extractName(text: string): string | undefined {
    // Simple name extraction - look for capitalized words at the beginning
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    for (const line of lines.slice(0, 5)) {
      const words = line.trim().split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        const isName = words.every(word => 
          word.length > 1 && 
          word[0] === word[0].toUpperCase() &&
          /^[A-Za-z]+$/.test(word)
        );
        
        if (isName) {
          return words.join(' ');
        }
      }
    }
    
    return undefined;
  }
}