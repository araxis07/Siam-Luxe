"use client";

import { useEffect, useState } from "react";

import type { AppLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { requestJson } from "@/lib/backend/client";

type BranchRecord = {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  hours: string;
  phone: string;
  eta_min_minutes: number;
  eta_max_minutes: number;
};

const branchPanelText = {
  th: {
    title: "สาขาและข้อมูลติดต่อ",
    empty: "ยังไม่มีข้อมูลสาขา",
    name: "ชื่อสาขา",
    neighborhood: "ย่าน",
    address: "ที่อยู่",
    hours: "เวลาเปิดบริการ",
    phone: "โทรศัพท์",
    etaMin: "ETA ขั้นต่ำ",
    etaMax: "ETA สูงสุด",
    save: "บันทึกสาขา",
    saving: "กำลังบันทึก",
    updated: "อัปเดตข้อมูลสาขาแล้ว",
    error: "ยังอัปเดตข้อมูลสาขาไม่ได้",
  },
  en: {
    title: "Branches and contact details",
    empty: "No branches available yet",
    name: "Branch name",
    neighborhood: "Neighborhood",
    address: "Address",
    hours: "Opening hours",
    phone: "Phone",
    etaMin: "Minimum ETA",
    etaMax: "Maximum ETA",
    save: "Save branch",
    saving: "Saving",
    updated: "Branch details updated",
    error: "Unable to update this branch right now",
  },
  ja: {
    title: "店舗情報と連絡先",
    empty: "店舗データはまだありません",
    name: "店舗名",
    neighborhood: "エリア",
    address: "住所",
    hours: "営業時間",
    phone: "電話番号",
    etaMin: "最短 ETA",
    etaMax: "最長 ETA",
    save: "店舗を保存",
    saving: "保存中",
    updated: "店舗情報を更新しました",
    error: "店舗情報を更新できませんでした",
  },
  zh: {
    title: "门店与联系信息",
    empty: "暂无门店数据",
    name: "门店名称",
    neighborhood: "商圈",
    address: "地址",
    hours: "营业时间",
    phone: "电话",
    etaMin: "最短 ETA",
    etaMax: "最长 ETA",
    save: "保存门店",
    saving: "保存中",
    updated: "门店信息已更新",
    error: "暂时无法更新门店信息",
  },
  ko: {
    title: "지점 및 연락처 정보",
    empty: "지점 데이터가 아직 없습니다",
    name: "지점명",
    neighborhood: "지역",
    address: "주소",
    hours: "운영 시간",
    phone: "전화번호",
    etaMin: "최소 ETA",
    etaMax: "최대 ETA",
    save: "지점 저장",
    saving: "저장 중",
    updated: "지점 정보가 업데이트되었습니다",
    error: "지점 정보를 업데이트할 수 없습니다",
  },
} as const;

export function BranchOperationsPanel({ locale }: { locale: AppLocale }) {
  const text = branchPanelText[locale];
  const { toast } = useToast();
  const [branches, setBranches] = useState<BranchRecord[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [actionKey, setActionKey] = useState("");

  useEffect(() => {
    let cancelled = false;

    void requestJson<BranchRecord[]>("/api/admin/branches", {
      method: "GET",
      cache: "no-store",
    })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setBranches(data);
        setDrafts(
          Object.fromEntries(
            data.map((branch) => [
              branch.id,
              {
                name: branch.name,
                neighborhood: branch.neighborhood,
                address: branch.address,
                hours: branch.hours,
                phone: branch.phone,
                etaMinMinutes: String(branch.eta_min_minutes),
                etaMaxMinutes: String(branch.eta_max_minutes),
              },
            ]),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setBranches([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveBranch = async (branchId: string) => {
    const draft = drafts[branchId];

    if (!draft) {
      return;
    }

    setActionKey(branchId);

    try {
      const updated = await requestJson<BranchRecord>(`/api/admin/branches/${branchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: draft.name,
          neighborhood: draft.neighborhood,
          address: draft.address,
          hours: draft.hours,
          phone: draft.phone,
          etaMinMinutes: Number(draft.etaMinMinutes),
          etaMaxMinutes: Number(draft.etaMaxMinutes),
        }),
      });

      setBranches((current) => current.map((branch) => (branch.id === branchId ? updated : branch)));
      toast({
        title: text.updated,
        description: updated.name,
        tone: "success",
      });
    } catch (error) {
      toast({
        title: text.error,
        description: error instanceof Error ? error.message : text.error,
        tone: "error",
      });
    } finally {
      setActionKey("");
    }
  };

  return (
    <section className="lux-panel-soft rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[#cdb37d]">{text.title}</p>
        <span className="text-sm text-[#bcae9b]">{branches.length}</span>
      </div>

      <div className="mt-4 space-y-4">
        {branches.length === 0 ? (
          <p className="rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-4 text-sm text-[#d1c4b2]">{text.empty}</p>
        ) : (
          branches.map((branch) => {
            const draft = drafts[branch.id];

            if (!draft) {
              return null;
            }

            return (
              <div key={branch.id} className="rounded-[1.6rem] border border-white/10 bg-white/4 p-4">
                <p className="font-medium text-white">{branch.id}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.name}</Label>
                    <Input
                      value={draft.name}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], name: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.neighborhood}</Label>
                    <Input
                      value={draft.neighborhood}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], neighborhood: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-[#d9ccbb]">{text.address}</Label>
                    <Input
                      value={draft.address}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], address: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.hours}</Label>
                    <Input
                      value={draft.hours}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], hours: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.phone}</Label>
                    <Input
                      value={draft.phone}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], phone: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.etaMin}</Label>
                    <Input
                      type="number"
                      value={draft.etaMinMinutes}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], etaMinMinutes: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#d9ccbb]">{text.etaMax}</Label>
                    <Input
                      type="number"
                      value={draft.etaMaxMinutes}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [branch.id]: { ...current[branch.id], etaMaxMinutes: event.target.value },
                        }))
                      }
                      className="h-11 rounded-2xl border-white/10 bg-white/4 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="button-shine mt-4 rounded-full bg-[#d6b26a] px-5 text-[#1b130f] hover:bg-[#e4c987]"
                  disabled={actionKey === branch.id}
                  onClick={() => {
                    void saveBranch(branch.id);
                  }}
                >
                  {actionKey === branch.id ? text.saving : text.save}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
