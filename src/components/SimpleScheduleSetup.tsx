import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { MedicationInput } from "@/types/medication";

interface SimpleScheduleSetupProps {
  onBack: () => void;
  onMedicationsAdded: (meds: MedicationInput[]) => void;
}

// Helper labels
const freqLabel = (n: number) => `1日${n}回`;

export const SimpleScheduleSetup: React.FC<SimpleScheduleSetupProps> = ({ onBack, onMedicationsAdded }) => {
  const [frequency, setFrequency] = useState<1 | 2 | 3>(2);
  const [mealTiming, setMealTiming] = useState<"after_meals" | "before_meals" | "specific">("after_meals");
  const [activeSlots, setActiveSlots] = useState<{ morning: boolean; noon: boolean; evening: boolean }>(
    { morning: true, noon: false, evening: true }
  );
  const [times, setTimes] = useState<{ morning: string; noon: string; evening: string }>({
    morning: "08:00",
    noon: "12:00",
    evening: "20:00",
  });

  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<"morning" | "noon" | "evening" | null>(null);
  const [tempTime, setTempTime] = useState("08:00");

  // Ensure UI matches selected frequency
  const handleSelectFrequency = (n: 1 | 2 | 3) => {
    setFrequency(n);
    if (n === 1) {
      setActiveSlots({ morning: true, noon: false, evening: false });
    } else if (n === 2) {
      setActiveSlots({ morning: true, noon: false, evening: true });
    } else {
      setActiveSlots({ morning: true, noon: true, evening: true });
    }
  };

  const toggleTime = (slot: "morning" | "noon" | "evening") => {
    if (frequency === 1) {
      // For once daily, only allow one slot to be active
      setActiveSlots({
        morning: slot === "morning",
        noon: slot === "noon", 
        evening: slot === "evening"
      });
    } else if (frequency === 2) {
      // For twice daily, only allow exactly two slots to be active
      setActiveSlots((prev) => {
        const currentActiveCount = Object.values(prev).filter(Boolean).length;
        const isSlotCurrentlyActive = prev[slot];
        
        // If trying to deactivate a slot, always allow it
        if (isSlotCurrentlyActive) {
          return { ...prev, [slot]: false };
        }
        
        // If trying to activate a slot and we already have 2 active, prevent it
        if (currentActiveCount >= 2) {
          return prev;
        }
        
        // Otherwise, allow activation
        return { ...prev, [slot]: true };
      });
    } else {
      // For three times daily, allow toggle behavior
      setActiveSlots((prev) => ({ ...prev, [slot]: !prev[slot] }));
    }
  };

  const openTimeDialog = (slot: "morning" | "noon" | "evening") => {
    setEditingSlot(slot);
    setTempTime(times[slot]);
    setTimeDialogOpen(true);
  };

  const saveTime = () => {
    if (!editingSlot) return;
    setTimes((prev) => ({ ...prev, [editingSlot]: tempTime }));
    setTimeDialogOpen(false);
  };

  const selectedTimes: string[] = useMemo(() => {
    const list: string[] = [];
    if (activeSlots.morning) list.push(times.morning);
    if (activeSlots.noon) list.push(times.noon);
    if (activeSlots.evening) list.push(times.evening);
    return list;
  }, [activeSlots, times]);

  const handleSave = () => {
    if (selectedTimes.length === 0) {
      toast.error("少なくとも1つの時間を選択してください");
      return;
    }

    const newMed: MedicationInput = {
      name: "お薬",
      dosage: "",
      frequency: freqLabel(frequency),
      mealTiming,
      times: selectedTimes,
    };

    onMedicationsAdded([newMed]);
  };

  return (
    <div className="w-full h-full bg-muted flex flex-col">
      <header className="bg-background p-4 shadow-sm flex items-center">
        <Button onClick={onBack} variant="ghost" size="icon" className="mr-3" aria-label="戻る">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">お薬の服用設定</h1>
      </header>

      <main className="flex-1 p-4">
        <section className="mx-auto max-w-md bg-background rounded-2xl p-6 shadow-sm">
          {/* 服用回数 */}
          <div className="mb-7">
            <h2 className="text-base font-semibold mb-3">服用回数</h2>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleSelectFrequency(n as 1 | 2 | 3)}
                  className={`rounded-xl p-4 text-center border-2 transition-colors ${
                    frequency === n ? "border-primary/80 bg-primary/10" : "border-muted-foreground/20 bg-muted/60"
                  }`}
                  aria-pressed={frequency === n}
                >
                  <div className="text-2xl font-bold text-primary mb-0.5">{n}</div>
                  <div className="text-xs text-muted-foreground">回/日</div>
                </button>
              ))}
            </div>
          </div>

          {/* 服用時間 */}
          <div className="mb-7">
            <h2 className="text-base font-semibold mb-3">服用時間</h2>
            <div className="flex items-stretch justify-between gap-4">
              {/* 朝 */}
              <div className="flex-1 text-center">
                <button
                  type="button"
                  onClick={() => toggleTime("morning")}
                  className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl transition-all ${
                    activeSlots.morning ? "bg-[hsl(var(--morning-selected))] text-accent-foreground border-[hsl(var(--morning-border))]" : "bg-background border-muted-foreground/30"
                  }`}
                  aria-pressed={activeSlots.morning}
                >
                  <span role="img" aria-label="朝" className="text-4xl md:text-5xl">☀️</span>
                </button>
                <div className={`text-sm font-semibold ${!activeSlots.morning ? "opacity-50" : ""}`}>朝</div>
                <button
                  type="button"
                  onClick={() => openTimeDialog("morning")}
                  className={`mt-1 inline-block rounded px-2 py-1 text-xs transition-colors ${
                    times.morning !== "08:00" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {times.morning}
                </button>
              </div>

              {/* 昼 */}
              <div className="flex-1 text-center">
                <button
                  type="button"
                  onClick={() => toggleTime("noon")}
                  className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl transition-all ${
                    activeSlots.noon ? "bg-[hsl(var(--noon-selected))] text-accent-foreground border-[hsl(var(--noon-selected))]" : "bg-background border-muted-foreground/30"
                  }`}
                  aria-pressed={activeSlots.noon}
                >
                  <span role="img" aria-label="昼" className="text-4xl md:text-5xl">🌤️</span>
                </button>
                <div className={`text-sm font-semibold ${!activeSlots.noon ? "opacity-50" : ""}`}>昼</div>
                <button
                  type="button"
                  onClick={() => openTimeDialog("noon")}
                  className={`mt-1 inline-block rounded px-2 py-1 text-xs transition-colors ${
                    times.noon !== "12:00" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {times.noon}
                </button>
              </div>

              {/* 晩 */}
              <div className="flex-1 text-center">
                <button
                  type="button"
                  onClick={() => toggleTime("evening")}
                  className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 text-2xl transition-all ${
                    activeSlots.evening ? "bg-primary text-primary-foreground border-primary" : "bg-background border-muted-foreground/30"
                  }`}
                  aria-pressed={activeSlots.evening}
                >
                  <span role="img" aria-label="晩" className="text-4xl md:text-5xl">🌙</span>
                </button>
                <div className={`text-sm font-semibold ${!activeSlots.evening ? "opacity-50" : ""}`}>晩</div>
                <button
                  type="button"
                  onClick={() => openTimeDialog("evening")}
                  className={`mt-1 inline-block rounded px-2 py-1 text-xs transition-colors ${
                    times.evening !== "20:00" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {times.evening}
                </button>
              </div>
            </div>
          </div>

          {/* 食事のタイミング */}
          <div>
            <h2 className="text-base font-semibold mb-3">食事のタイミング</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMealTiming("after_meals")}
                className={`flex-1 rounded-lg px-3 py-3 text-sm border-2 transition-colors ${
                  mealTiming === "after_meals" ? "border-primary/80 bg-primary/10" : "border-muted-foreground/20 bg-muted/60"
                }`}
                aria-pressed={mealTiming === "after_meals"}
              >
                食後
              </button>
              <button
                type="button"
                onClick={() => setMealTiming("before_meals")}
                className={`flex-1 rounded-lg px-3 py-3 text-sm border-2 transition-colors ${
                  mealTiming === "before_meals" ? "border-primary/80 bg-primary/10" : "border-muted-foreground/20 bg-muted/60"
                }`}
                aria-pressed={mealTiming === "before_meals"}
              >
                食前
              </button>
              <button
                type="button"
                onClick={() => setMealTiming("specific")}
                className={`flex-1 rounded-lg px-3 py-3 text-sm border-2 transition-colors whitespace-nowrap ${
                  mealTiming === "specific" ? "border-primary/80 bg-primary/10" : "border-muted-foreground/20 bg-muted/60"
                }`}
                aria-pressed={mealTiming === "specific"}
              >
                関係なし
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onBack}>
              キャンセル
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              保存
            </Button>
          </div>
        </section>
      </main>

      {/* Time input dialog */}
      <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSlot === "morning" && "朝の時間を設定"}
              {editingSlot === "noon" && "昼の時間を設定"}
              {editingSlot === "evening" && "晩の時間を設定"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="time-input" className="sr-only">時間</Label>
            <input
              id="time-input"
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-center text-lg"
            />
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setTimeDialogOpen(false)}>
                キャンセル
              </Button>
              <Button className="flex-1" onClick={saveTime}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimpleScheduleSetup;
