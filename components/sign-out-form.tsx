import { SignOutButton } from '@clerk/nextjs';

export const SignOutForm = () => {
  return (
    <SignOutButton redirectUrl="/">
      <button
        type="submit"
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </SignOutButton>
  );
};
