import { Link } from 'react-router-dom';

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf8ff] px-6 text-[#1b1b22] dark:bg-[#0f0e17] dark:text-[#e8e4f0]">
      <section className="w-full max-w-md rounded-2xl border border-[#c8c4d5] bg-white p-8 text-center shadow-sm dark:border-[#2e2a3d] dark:bg-[#13111f]">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f108e] dark:text-[#a78bfa]">403 Forbidden</p>
        <h1 className="mt-3 text-3xl font-bold">Bạn không có quyền truy cập</h1>
        <p className="mt-3 text-sm text-[#464553] dark:text-[#9490a8]">
          Tài khoản hiện tại không được cấp quyền cho chức năng này.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#1f108e] px-5 text-sm font-semibold text-white transition hover:bg-[#2b1ca0] dark:bg-[#4f46e5] dark:hover:bg-[#4338ca]"
        >
          Về dashboard
        </Link>
      </section>
    </main>
  );
}
