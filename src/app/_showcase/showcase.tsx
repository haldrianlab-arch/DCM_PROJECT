/**
 * Isi halaman peninjauan token dan komponen (PR 1, sementara).
 * `/` memakai TokenShowcase + ComponentShowcase; `/dev/components` hanya ComponentShowcase.
 * Folder berawalan `_` tidak menjadi route.
 */
import {
  Archive,
  CalendarClock,
  CircleCheck,
  CircleSlash,
  Clock,
  Package,
  Plus,
  TriangleAlert,
  Wrench,
} from "lucide-react";

import tokens from "../../../specs/design-system/tokens.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Kelas ditulis lengkap (bukan dirangkai) agar terdeteksi Tailwind.
const TEXT_CLASS: Record<string, string> = {
  "page-title": "text-page-title",
  "section-title": "text-section-title",
  "card-title": "text-card-title",
  body: "text-body",
  "body-strong": "text-body-strong",
  small: "text-small",
  "location-lg": "text-location-lg",
  "label-xs": "text-label-xs",
  code: "text-code font-mono",
  "code-strong": "text-code-strong font-mono",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4 md:p-6">
      <h2 className="mb-4 text-section-title">{title}</h2>
      {children}
    </section>
  );
}

export function TokenShowcase() {
  const colors = tokens.color.tokens;
  return (
    <>
      <Section title="Warna">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <li key={c.name} className="flex items-start gap-3">
              <span
                className="size-10 shrink-0 rounded-control border border-line"
                style={{ background: `var(--color-${c.name})` }}
              />
              <span className="min-w-0">
                <span className="block text-body-strong">{c.name}</span>
                <span className="block font-mono text-code break-all text-ink-muted">{c.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tipografi">
        <ul className="flex flex-col gap-4">
          {tokens.type.groups.flatMap((g) =>
            g.styles.map((s) => (
              <li key={s.name} className="flex flex-col gap-1">
                <span className="text-label-xs text-ink-muted">
                  {s.name} · {s.fontSize}/{s.lineHeight}, {s.fontWeight}
                </span>
                <span className={TEXT_CLASS[s.name]}>{s.sample}</span>
              </li>
            )),
          )}
        </ul>
      </Section>

      <Section title="Pengenal dengan nol bergaris">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt className="text-small text-ink-muted">Dengan .sr-id</dt>
          <dd className="sr-id text-body-strong">srv-db-01 · RK-A01 · U10-U11</dd>
          <dt className="text-small text-ink-muted">Tanpa .sr-id</dt>
          <dd className="text-body-strong">srv-db-01 · RK-A01 · U10-U11</dd>
          <dt className="text-small text-ink-muted">Kode (Geist Mono)</dt>
          <dd className="font-mono text-code">DCM-0001 · WO-0012 · CN7016-9XK2</dd>
        </dl>
      </Section>
    </>
  );
}

export function ComponentShowcase() {
  return (
    <>
      <Section title="Tombol (KOM-01)">
        <div className="flex flex-wrap items-center gap-2">
          <Button>
            <Plus aria-hidden />
            Tambah device
          </Button>
          <Button variant="secondary">Batal</Button>
          <Button variant="danger">Pensiunkan</Button>
          <Button variant="ghost">Lihat semua</Button>
          <Button variant="text">Ubah</Button>
          <Button loading>Simpan device</Button>
          <Button disabled>Mulai kerjakan</Button>
          <Button size="lg">Selesaikan WO</Button>
        </div>
      </Section>

      <Section title="Lencana status (KOM-12)">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">
            <CircleCheck aria-hidden />
            Aktif
          </Badge>
          <Badge tone="amber">
            <Wrench aria-hidden />
            Maintenance
          </Badge>
          <Badge tone="gray">
            <Package aria-hidden />
            Stok
          </Badge>
          <Badge tone="gray-dark">
            <Archive aria-hidden />
            Pensiun
          </Badge>
          <Badge tone="indigo">
            <CalendarClock aria-hidden />
            Terjadwal
          </Badge>
          <Badge tone="amber">
            <Wrench aria-hidden />
            Dikerjakan
          </Badge>
          <Badge tone="green">
            <CircleCheck aria-hidden />
            Selesai
          </Badge>
          <Badge tone="gray">
            <CircleSlash aria-hidden />
            Dibatalkan
          </Badge>
          <Badge tone="red-solid">
            <TriangleAlert aria-hidden />
            Terlambat
          </Badge>
          <Badge tone="amber">
            <Clock aria-hidden />
            Garansi segera habis
          </Badge>
          <Badge tone="red">
            <TriangleAlert aria-hidden />
            Garansi habis
          </Badge>
        </div>
      </Section>
    </>
  );
}
