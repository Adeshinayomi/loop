import {AuthHeader} from "../components/Authheader";
export default function authLayout({ children }: LayoutProps<"/">) {
  return (
      <main className="min-h-full flex flex-col gap-5">
        <AuthHeader />
        {children}
      </main>
  );
}