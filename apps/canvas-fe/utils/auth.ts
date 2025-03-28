// import prisma from "@repo/db/index";
// import { Prisma } from "@prisma/client";

// export default async function createUser(user: any, account: any, profile: any) {
//   await prisma.user.create({
//     data: {
//       email: user.email!,
//       name: user.name || profile?.name || "User",
//       image: user.image || profile?.image || "null",
//       emailVerified: new Date(),
//       accounts: {
//         create: {
//           type: account!.type,
//           provider: account!.provider,
//           providerAccountId: account!.providerAccountId,
//           refresh_token: account!.refresh_token ?? undefined,
//           refresh_token_expires_in: account!.refresh_token_expires_in ?? undefined,
//           access_token: account!.access_token ?? undefined,
//           expires_at: account!.expires_at ?? undefined,
//           token_type: account!.token_type ?? undefined,
//           scope: account!.scope ?? undefined,
//           id_token: account!.id_token ?? undefined,
//           session_state: account!.session_state ?? undefined
//         } as Prisma.AccountCreateWithoutUserInput
//       }
//     }
//   });
// }



import prisma from "@repo/db/index";
import { Account, User } from "@prisma/client";

interface Profile {
  name?: string | null;
  image?: string | null;
}

export default async function createUser(
  user: Partial<User>,
  account: Partial<Account>,
  profile?: Profile
): Promise<User> {
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email!, // We're asserting non-null here since NextAuth ensures email exists
        name: user.name || profile?.name || "User",
        image: user.image || profile?.image || null,
        emailVerified: new Date(),
        accounts: {
          create: {
            type: account.type!,
            provider: account.provider!,
            providerAccountId: account.providerAccountId!,
            refresh_token: account.refresh_token || null,
            refresh_token_expires_in: account.refresh_token_expires_in ?? null,
            access_token: account.access_token || null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type || null,
            scope: account.scope || null,
            id_token: account.id_token || null,
            session_state: account.session_state || null,
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}