/** Judul halaman dan keterangan singkat di atas isi halaman. */
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-page-title text-ink">{title}</h1>
      {description ? <p className="text-body text-ink-muted">{description}</p> : null}
    </div>
  );
}

/** Wadah isi halaman: gutter 16 px di HP, 24 px di desktop (tokens space-4, space-6). */
export function PageBody({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col gap-8 px-4 py-6 md:px-6 md:py-8">{children}</main>;
}
