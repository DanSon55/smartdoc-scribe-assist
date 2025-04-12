
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeOption = ({
  theme,
  active,
  onClick,
  label,
  icon: Icon,
}: {
  theme: string;
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all",
        active
          ? "border-primary bg-primary/10 text-primary font-medium"
          : "border-border hover:border-primary/50 hover:bg-primary/5"
      )}
      onClick={onClick}
    >
      <Icon className={cn("w-8 h-8 mb-2", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Тема оформления</CardTitle>
        <CardDescription>Выберите предпочитаемую цветовую схему</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              theme="light"
              active={theme === "light"}
              onClick={() => setTheme("light")}
              label="Светлая"
              icon={Sun}
            />
            <ThemeOption
              theme="dark"
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
              label="Тёмная"
              icon={Moon}
            />
            <ThemeOption
              theme="system"
              active={theme === "system"}
              onClick={() => setTheme("system")}
              label="Системная"
              icon={MonitorSmartphone}
            />
          </div>

          <div className="mt-6">
            <Label className="text-sm text-muted-foreground">
              {theme === "system"
                ? "Используется системная тема вашего устройства"
                : theme === "dark"
                ? "Используется тёмная тема"
                : "Используется светлая тема"}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
