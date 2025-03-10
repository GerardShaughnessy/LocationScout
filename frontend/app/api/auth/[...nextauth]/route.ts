import NextAuth, { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      department: string;
      role: string;
    } & DefaultSession['user']
  }

  // Extend the base User type
  interface User {
    id: string;
    department: string;
    role: string;
    token?: string;
  }
}

// Extend the built-in token types
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    department?: string;
    role?: string;
    accessToken?: string;
  }
}

// Validate required environment variables
const requiredEnvVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXT_PUBLIC_API_URL'] as const;
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Ensure environment variables are defined
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface GoogleCredentials {
  department?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            department: data.user.department,
            role: data.user.role,
            token: data.token,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, credentials }) {
      if (account?.provider === 'google') {
        try {
          const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              department: (credentials as GoogleCredentials)?.department || 'Other',
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Google sign-in failed');
          }

          const data = await response.json();
          // Update user object with backend data
          user.token = data.token;
          user.id = data.user.id;
          user.department = data.user.department;
          user.role = data.user.role;
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          throw error;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.department = user.department;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id!;
        session.user.department = token.department!;
        session.user.role = token.role!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 