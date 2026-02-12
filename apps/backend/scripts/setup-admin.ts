// apps/backend/scripts/setup-admin.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';
import readlineSync from 'readline-sync';

/**
 * SECURE ADMIN SETUP SCRIPT
 * =========================
 * PURPOSE: Creates initial admin user with secure interactive prompts
 * SECURITY FEATURES:
 * 1. No credentials stored in code, env vars, or database defaults
 * 2. Password input is hidden in terminal
 * 3. One-time execution with immediate feedback
 * 4. Requires immediate password change on first login
 * 
 * ALGORITHM:
 * 1. Check for existing admin → Exit if exists
 * 2. Prompt for email via standard input
 * 3. Prompt for password with hidden input
 * 4. Validate password strength
 * 5. Hash password and create admin record with metadata
 * 6. Output success message without exposing credentials
 */

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * USER METADATA INTERFACE
 * Defines the structure of audit metadata stored in User.metadata field
 * Used for security tracking and compliance
 */
interface UserAuditMetadata {
  setupDate: string;              // ISO timestamp of account creation
  setupMethod: 'secure-script-v1'; // How account was created
  requiresPasswordChange: boolean; // Flag for mandatory password reset
  setupEnvironment: string;        // dev/staging/production
}

/**
 * SETUP RESULT INTERFACE
 * Defines the return type of setupAdmin function
 * Ensures consistent response structure and type safety
 */
interface SetupResult {
  success: boolean;     // Whether setup completed successfully
  message: string;      // User-friendly message for display
  email?: string;       // Created email (optional, for success cases)
}

/**
 * PASSWORD VALIDATION RESULT
 * Structured validation result for detailed error reporting
 */
interface PasswordValidationResult {
  isValid: boolean;    // Overall validation status
  errors: string[];    // List of specific validation failures
  strength: 'weak' | 'medium' | 'strong'; // Password strength rating
}

/**
 * Validates password against security requirements
 * @param password - Plain text password to validate
 * @returns PasswordValidationResult with detailed feedback
 * 
 * SECURITY REQUIREMENTS (NIST 800-63B compliant):
 * - Minimum 12 characters (no maximum, encourages passphrases)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - No common patterns (123, abc, qwerty, etc.)
 */
function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let strengthScore = 0;
  
  // Length validation (40% of score)
  if (password.length >= 12) {
    strengthScore += 40;
  } else {
    errors.push('Password must be at least 12 characters');
  }
  
  // Character variety validation (60% of score)
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  if (hasUpperCase) strengthScore += 15;
  else errors.push('Must contain at least one uppercase letter');
  
  if (hasLowerCase) strengthScore += 15;
  else errors.push('Must contain at least one lowercase letter');
  
  if (hasNumbers) strengthScore += 15;
  else errors.push('Must contain at least one number');
  
  if (hasSpecialChar) strengthScore += 15;
  else errors.push('Must contain at least one special character');
  
  // Pattern detection (deductions)
  const commonPatterns = [
    /123/, /abc/, /qwerty/, /password/, /admin/, /welcome/, /letmein/
  ];
  
  commonPatterns.forEach(pattern => {
    if (pattern.test(password.toLowerCase())) {
      strengthScore -= 20;
      errors.push('Password contains common pattern or dictionary word');
    }
  });
  
  // Determine strength level
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (strengthScore >= 80) strength = 'strong';
  else if (strengthScore >= 60) strength = 'medium';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Creates standardized user metadata for audit trail
 * @returns UserAuditMetadata object with current context
 */
function createUserMetadata(): UserAuditMetadata {
  return {
    setupDate: new Date().toISOString(),
    setupMethod: 'secure-script-v1',
    requiresPasswordChange: true,
    setupEnvironment: process.env.NODE_ENV || 'development'
  };
}

/**
 * Type-safe error message extraction
 * @param error - Unknown error from catch block
 * @returns Human-readable error message
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Unknown error occurred during setup';
}

/**
 * Main admin setup function
 * @returns SetupResult with success status and message
 */
async function setupAdmin(): Promise<SetupResult> {
  try {
    // Display setup header
    console.log('\n' + '='.repeat(60));
    console.log('🔐 VERDE AFRIQUE - ADMINISTRATOR SETUP');
    console.log('='.repeat(60));
    
    // 1. CHECK FOR EXISTING ADMIN
    console.log('\n📋 Checking for existing administrator...');
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (existingAdmin) {
      return {
        success: false,
        message: '\n❌ ADMINISTRATOR ALREADY EXISTS\n\n' +
                'An administrator account is already configured in the database.\n\n' +
                'If you need to reset credentials:\n' +
                '1. Use the password reset feature (when implemented)\n' +
                '2. Or manually update the user in the database\n' +
                '3. Or delete the admin user and run this script again\n'
      };
    }
    
    // 2. COLLECT CREDENTIALS
    console.log('\n📧 ADMINISTRATOR CREDENTIALS');
    console.log('─'.repeat(40));
    
    // Email collection with validation
    const email = readlineSync.question('Email address: ', {
      limit: (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input.trim());
      },
      limitMessage: 'Please enter a valid email address (user@domain.com)'
    }).trim().toLowerCase();
    
    // Password requirements display
    console.log('\n🔒 PASSWORD SECURITY REQUIREMENTS:');
    console.log('   • Minimum 12 characters (more is better)');
    console.log('   • At least one uppercase letter (A-Z)');
    console.log('   • At least one lowercase letter (a-z)');
    console.log('   • At least one number (0-9)');
    console.log('   • At least one special character (!@#$%^&*)');
    console.log('   • Avoid common patterns and dictionary words');
    console.log('─'.repeat(40));
    
    // Password collection (hidden)
    const password = readlineSync.question('Password (hidden): ', {
      hideEchoBack: true,
      mask: '•',
      limit: (input: string) => input.length > 0,
      limitMessage: 'Password cannot be empty'
    });
    
    // Password confirmation
    const confirmPassword = readlineSync.question('Confirm password (hidden): ', {
      hideEchoBack: true,
      mask: '•'
    });
    
    // 3. VALIDATE INPUTS
    if (password !== confirmPassword) {
      return {
        success: false,
        message: '\n❌ PASSWORDS DO NOT MATCH\n\n' +
                'The passwords you entered do not match.\n' +
                'Please run the script again and ensure both entries are identical.\n'
      };
    }
    
    const validation = validatePassword(password);
    if (!validation.isValid) {
      return {
        success: false,
        message: '\n❌ PASSWORD DOES NOT MEET SECURITY REQUIREMENTS\n\n' +
                'Please fix the following issues:\n' +
                validation.errors.map(err => `   • ${err}`).join('\n') + '\n\n' +
                'Strength rating: ' + validation.strength.toUpperCase() + '\n' +
                'Tip: Consider using a passphrase for better security\n'
      };
    }
    
    // 4. CREATE ADMIN USER
    console.log('\n⏳ Creating administrator account...');
    
    // Hash password
    const passwordHash = await hashPassword(password);
    
    // Create metadata for audit trail
    const metadata = createUserMetadata();
    
    // Define user data with Prisma types
    const userData: Prisma.UserCreateInput = {
      email,
      passwordHash,
      role: 'ADMIN',
      name: 'System Administrator',
      metadata: metadata as unknown as Prisma.InputJsonValue
    };
    
    // Create user in database
    await prisma.user.create({
      data: userData
    });
    
    // 5. SUCCESS RESPONSE
    return {
      success: true,
      email,
      message: '\n' + '✅'.repeat(10) + '\n\n' +
              '🎉 ADMINISTRATOR ACCOUNT CREATED SUCCESSFULLY\n\n' +
              '📋 ACCOUNT DETAILS:\n' +
              '   • Email: ' + email + '\n' +
              '   • Role: Administrator\n' +
              '   • Created: ' + new Date().toLocaleString() + '\n' +
              '   • Password Strength: ' + validation.strength.toUpperCase() + '\n\n' +
              '⚠️  IMMEDIATE SECURITY ACTIONS REQUIRED:\n' +
              '1. SAVE credentials in a secure password manager\n' +
              '2. LOGIN immediately at http://localhost:3000/login\n' +
              '3. CHANGE password immediately after first login\n' +
              '4. DOCUMENT this setup in your security log\n\n' +
              '🔗 QUICK ACCESS LINKS:\n' +
              '   • Login: http://localhost:3000/login\n' +
              '   • Admin Panel: http://localhost:3000/admin\n' +
              '   • API Health: http://localhost:3001/api/health\n\n' +
              '📝 NEXT STEPS:\n' +
              '1. Complete MP5 phases 2.2-2.4 (Product CRUD, User Management, Dashboard)\n' +
              '2. Implement MP6 security hardening (HttpOnly cookies, rate limiting)\n' +
              '3. Deploy to production environment\n\n' +
              '🚀 Ready to proceed with VerdeAfrique development!\n'
    };
    
  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = extractErrorMessage(error);
    
    // Provide context-specific error messages
    let userMessage = `\n❌ SETUP FAILED: ${errorMessage}\n`;
    
    if (errorMessage.includes('connect') || errorMessage.includes('database')) {
      userMessage += '\n🔧 TROUBLESHOOTING:\n' +
                    '1. Check if PostgreSQL is running\n' +
                    '2. Verify database credentials in .env\n' +
                    '3. Ensure database and user exist\n' +
                    '4. Run: npx prisma migrate deploy\n';
    } else if (errorMessage.includes('unique constraint') || errorMessage.includes('duplicate')) {
      userMessage += '\n⚠️  Email may already be registered\n';
    }
    
    return {
      success: false,
      message: userMessage
    };
  }
}

/**
 * Main execution wrapper
 * Handles script lifecycle, cleanup, and exit codes
 */
async function main(): Promise<void> {
  try {
    const result = await setupAdmin();
    
    // Display result message
    console.log(result.message);
    
    // Set appropriate exit code
    process.exit(result.success ? 0 : 1);
    
  } catch (fatalError: unknown) {
    // Handle unexpected fatal errors
    console.error('\n💥 FATAL UNEXPECTED ERROR:');
    console.error(extractErrorMessage(fatalError));
    
    // Attempt graceful database disconnect
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Failed to disconnect from database:', disconnectError);
    }
    
    process.exit(1);
  } finally {
    // Ensure database connection is always closed
    await prisma.$disconnect();
  }
}

/**
 * Script entry point
 * Only execute if run directly (not imported as module)
 */
if (require.main === module) {
  main().catch(() => {
    process.exit(1);
  });
}

// Export for potential testing
export { setupAdmin, validatePassword, extractErrorMessage };