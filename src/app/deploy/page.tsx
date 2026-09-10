"use client";

import { AppShell } from "@/components/AppShell";

export default function DeployGuidePage() {
  const previewUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            🚀 Deploy ke Production (Supabase + Vercel)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Download source code, upload ke GitHub, lalu deploy ke Vercel
          </p>
        </div>

        {/* Langkah 1: Download */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-900 mb-3">
            Langkah 1: Download Source Code
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Klik tombol di bawah untuk mengunduh seluruh source code aplikasi
            (format ZIP, tanpa node_modules). Setelah di-download, ekstrak file
            ZIP tersebut di komputer Anda.
          </p>
          <a
            href="/api/source/zip"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-5 py-3 rounded-lg shadow-lg shadow-indigo-500/30"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download gudangpro-source.zip
          </a>
          <p className="text-xs text-slate-500 mt-3">
            Isi ZIP: folder src/, package.json, vercel.json, DEPLOYMENT.md,
            GITHUB_GUIDE.md, .env.example, drizzle.config.json, dll (46 file)
          </p>
        </div>

        {/* Langkah 2: Upload GitHub */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-900 mb-3">
            Langkah 2: Upload ke GitHub
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              <strong>1.</strong> Buka github.com → Login → tombol{" "}
              <strong>+</strong> → <strong>New repository</strong>
            </p>
            <p>
              <strong>2.</strong> Nama: <code className="bg-slate-100 px-1.5 py-0.5 rounded">gudangpro</code>{" "}
              → Public → <strong>Create repository</strong>
            </p>
            <p>
              <strong>3.</strong> Klik link{" "}
              <em>&quot;uploading an existing file&quot;</em> → drag &amp; drop{" "}
              <strong>isi folder hasil ekstrak</strong> (yaitu: folder src,
              package.json, vercel.json, dll — bukan file ZIP-nya)
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
              ⚠️ JANGAN upload: node_modules, .next, .env, tsconfig.tsbuildinfo
              (file ini sudah tidak ada di ZIP)
            </p>
            <p>
              <strong>4.</strong> Klik <strong>Commit changes</strong> → selesai!
            </p>
            <p className="text-xs text-slate-500 mt-2">
              📖 Panduan lengkap dengan cara Git CLI ada di file{" "}
              <strong>GITHUB_GUIDE.md</strong> (sudah termasuk di ZIP)
            </p>
          </div>
        </div>

        {/* Langkah 3: Vercel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-900 mb-3">
            Langkah 3: Deploy ke Vercel
          </h2>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              <strong>1.</strong> Buka vercel.com → Sign up dengan GitHub
            </p>
            <p>
              <strong>2.</strong> <strong>Add New → Project</strong> → pilih repo{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded">gudangpro</code>
            </p>
            <p>
              <strong>3.</strong> Tambahkan Environment Variables:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-2">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1 pr-3 font-mono font-semibold">
                      DATABASE_URL
                    </td>
                    <td className="py-1 text-slate-500">
                      (connection string Supabase dari Langkah 1)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-3 font-mono font-semibold">
                      JWT_SECRET
                    </td>
                    <td className="py-1 text-slate-500">
                      (string acak: openssl rand -base64 32)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>4.</strong> Klik <strong>Deploy</strong> → tunggu ±2 menit →
              dapat URL: <code className="bg-slate-100 px-1.5 py-0.5 rounded">gudangpro.vercel.app</code>
            </p>
            <p>
              <strong>5.</strong> Buat tabel database di Supabase (SQL Editor →
              paste SQL dari file <strong>DEPLOYMENT.md</strong>)
            </p>
            <p>
              <strong>6.</strong> Buka URL → Daftar akun pertama → jadi Admin 🎉
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
