
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300",
        active
          ? "border-primary bg-primary/10 text-primary font-medium shadow-md"
          : "border-border hover:border-primary/50 hover:bg-primary/5"
      )}
      onClick={onClick}
    >
      <Icon className={cn("w-8 h-8 mb-2", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-medium">{label}</span>
    </motion.div>
  );
};

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast({
      title: "Тема изменена",
      description: newTheme === "light" ? "Светлая тема активирована" : 
                   newTheme === "dark" ? "Тёмная тема активирована" : 
                   "Использование системной темы"
    });
  };

  return (
    <Card className="shadow-md border-2 border-muted">
      <CardHeader className="pb-3">
        <CardTitle>Тема оформления</CardTitle>
        <CardDescription>Выберите предпочитаемую цветовую схему</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              theme="light"
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
              label="Светлая"
              icon={Sun}
            />
            <ThemeOption
              theme="dark"
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
              label="Тёмная"
              icon={Moon}
            />
            <ThemeOption
              theme="system"
              active={theme === "system"}
              onClick={() => handleThemeChange("system")}
              label="Системная"
              icon={MonitorSmartphone}
            />
          </div>

          <div className="mt-6 bg-background p-3 rounded-lg border">
            <Label className="text-sm flex items-center gap-2">
              {theme === "system" ? (
                <>
                  <MonitorSmartphone className="h-4 w-4" />
                  <span>Используется системная тема вашего устройства</span>
                </>
              ) : theme === "dark" ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span>Используется тёмная тема</span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span>Используется светлая тема</span>
                </>
              )}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
