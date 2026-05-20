export const studentAccounts: Record<string, string> = {
  'Bagayo Khalil': '277', 'Casim Lope': '294', 'Shahid Ali': '296', 'Rama Said': '282',
  'Abdalla Jamal': '269', 'Ismail Abdullahi': '289', 'Adan Isack': '271', 'Abdikadir Kimgol': '275',
  'Alex Ogendi': '375', 'Abdi Ture': '372', 'Yunis Halake': '306', 'Ian Hamatun': '291',
  'John Diyo': '283', 'Ibrahim Mohamed': '299', 'Bilal Ilchagi': '278', 'Farhan Ngurusi': '276',
  'Hassanoor Jalafow': '279', 'Mamo Godana': '352', 'Roba Kampu': '344', 'Ismail Laranyu': '348',
  'Rob Wario': '315', 'Kadir Adan': '342', 'Muqsin Maqbul': '356', 'Saidnur Rogicha': '325',
  'Wako Roba': '363', 'Jatani Jarso': '351', 'Dida Galma': '385', 'Somo Galgalo': '359',
  'Ramadham Ekwom': '333', 'Hassan Achuka': '369', 'Yahya Hassan': '357', 'Ramadhan Lepir': '347',
  'Talha Hussein': '390', 'Mohamed Said': '355', 'Tadiku Kampu': '345', 'Alnoor Hussein': '361',
  'Dulqifli Mohamed': '365', 'Galgesa Arigele': '319', 'Mansur Mohamed': '373', 'Wilson Jamal': '335',
  'Abdirahman Ekusekope': '432', 'Abdinassir Ibrahim': '400', 'Abubakar Halkano': '402',
  'Mohamed Galo': '403', 'Abdulkarim Ramadhan': '404', 'Guyo Tadicha': '405', 'Muhidin Mohamed': '407',
  'Abdirizack Abubakar': '408', 'Badrudin Mohamed': '409', 'Idi Mohamed': '410', 'Ali Kini': '412',
  'Abubakarsidiq Hassan': '413', 'Abdikadir Ismail': '414', 'Zakaria Jillo': '415',
  'Frankline Ewoi': '417', 'Mohamed Amin': '418', 'Abdishkur Mohamed': '419', 'Ibrahim Hussein': '420',
  'Ramadhan Sabls': '406', 'Abdirizack Yussuf': '421', 'Abdirahman Ahmed': '422',
  'Hamza Halkano': '423', 'Abdi Osman': '424', 'Daniel Lemoris': '425', 'Ledula Kimlahau': '426',
  'Kampicha Golicha': '427', 'Isack Munene': '428', 'Suleiman Mutethia': '429', 'Ahmed Noor': '430'
};

export const classStudents: Record<string, string[]> = {
  'Form 4': ['Bagayo Khalil', 'Casim Lope', 'Shahid Ali', 'Rama Said', 'Abdalla Jamal', 'Ismail Abdullahi', 'Adan Isack', 'Abdikadir Kimgol', 'Alex Ogendi', 'Abdi Ture', 'Yunis Halake', 'Ian Hamatun', 'John Diyo', 'Ibrahim Mohamed', 'Bilal Ilchagi', 'Farhan Ngurusi', 'Hassanoor Jalafow'],
  'Form 3': ['Mamo Godana', 'Roba Kampu', 'Ismail Laranyu', 'Rob Wario', 'Kadir Adan', 'Muqsin Maqbul', 'Saidnur Rogicha', 'Wako Roba', 'Jatani Jarso', 'Dida Galma', 'Somo Galgalo', 'Ramadham Ekwom', 'Hassan Achuka', 'Yahya Hassan', 'Ramadhan Lepir', 'Talha Hussein', 'Mohamed Said', 'Tadiku Kampu', 'Alnoor Hussein', 'Dulqifli Mohamed', 'Galgesa Arigele', 'Mansur Mohamed', 'Wilson Jamal'],
  'Grade 10': ['Abdirahman Ekusekope', 'Abdinassir Ibrahim', 'Abubakar Halkano', 'Mohamed Galo', 'Abdulkarim Ramadhan', 'Guyo Tadicha', 'Muhidin Mohamed', 'Abdirizack Abubakar', 'Badrudin Mohamed', 'Idi Mohamed', 'Ali Kini', 'Abubakarsidiq Hassan', 'Abdikadir Ismail', 'Zakaria Jillo', 'Frankline Ewoi', 'Mohamed Amin', 'Abdishkur Mohamed', 'Ibrahim Hussein', 'Ramadhan Sabls', 'Abdirizack Yussuf', 'Abdirahman Ahmed', 'Hamza Halkano', 'Abdi Osman', 'Daniel Lemoris', 'Ledula Kimlahau', 'Kampicha Golicha', 'Isack Munene', 'Suleiman Mutethia', 'Ahmed Noor']
};

export interface Lecturer {
  name: string;
  subject: string;
  email: string;
  password: string;
}

export const lecturers: Lecturer[] = [
  { name: 'Mr. Osman Halake', subject: 'Mathematics / Business Studies', email: 'osman@wamyisiolo.sc.ke', password: 'osman5515' },
  { name: 'Mr. Guyo Halake', subject: 'Arabic / Islamic Religious Education', email: 'guyo@wamyisiolo.sc.ke', password: 'guyo123' },
  { name: 'Mr. Dennis Kipkoech', subject: 'Mathematics / Physics', email: 'dennis@wamyisiolo.sc.ke', password: 'dennis123' },
  { name: 'Mr. John Simiyu', subject: 'Kiswahili / History', email: 'john@wamyisiolo.sc.ke', password: 'john123' },
  { name: 'Mrs. Selina Ewoi', subject: 'Biology / Agriculture', email: 'selina@wamyisiolo.sc.ke', password: 'selina123' },
  { name: 'Mr. Leonard Kiprotich', subject: 'Biology / Chemistry', email: 'leonard@wamyisiolo.sc.ke', password: 'leonard123' },
  { name: 'Mr. Rotich Mark', subject: 'English / Literature', email: 'rotich@wamyisiolo.sc.ke', password: 'rotich123' },
  { name: 'Mr. Kibet Shadrack', subject: 'Biology / Agriculture', email: 'kibet@wamyisiolo.sc.ke', password: 'kibet123' }
];

export interface Result {
  student: string;
  className: string;
  subject: string;
  marks: number;
  grade: string;
}

export interface FeeRecord {
  total: number;
  paid: number;
}

export const getStudentClass = (name: string): string => {
  for (const [cls, arr] of Object.entries(classStudents)) {
    if (arr.includes(name)) return cls;
  }
  return 'Unknown';
};

export const getGrade = (marks: number): string => {
  if (marks >= 80) return 'A';
  if (marks >= 75) return 'A-';
  if (marks >= 70) return 'B+';
  if (marks >= 65) return 'B';
  if (marks >= 60) return 'B-';
  if (marks >= 55) return 'C+';
  if (marks >= 50) return 'C';
  if (marks >= 45) return 'C-';
  if (marks >= 40) return 'D+';
  return 'D';
};

export const getComment = (marks: number): string => {
  if (marks >= 80) return 'Excellent performance';
  if (marks >= 75) return 'Very good work';
  if (marks >= 70) return 'Good effort';
  if (marks >= 65) return 'Keep improving';
  if (marks >= 60) return 'Fair performance';
  if (marks >= 55) return 'Average work';
  if (marks >= 50) return 'Work harder';
  if (marks >= 45) return 'Needs improvement';
  if (marks >= 40) return 'Poor performance';
  return 'Very poor';
};

export const termOptions = [
  'Term 1, 2026',
  'Term 2, 2026',
  'Term 3, 2026',
  'Term 1, 2025',
  'Term 2, 2025',
  'Term 3, 2025'
];

// Initialize default fees for all students
export const initializeFees = (): Record<string, FeeRecord> => {
  const fees: Record<string, FeeRecord> = {};
  Object.keys(studentAccounts).forEach(name => {
    fees[name] = { total: 45000, paid: 30000 };
  });
  return fees;
};

// Initial results
export const initialResults: Result[] = [
  { student: 'Talha Hussein', className: 'Form 3', subject: 'Mathematics', marks: 90, grade: 'A' },
  { student: 'Talha Hussein', className: 'Form 3', subject: 'English', marks: 82, grade: 'A-' }
];
