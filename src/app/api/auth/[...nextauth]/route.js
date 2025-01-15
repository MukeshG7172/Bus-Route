import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Define authOptions and export them
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

// Pass authOptions to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
