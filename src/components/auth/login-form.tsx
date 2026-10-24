"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const DEMO = { email: "demo@expresso.dev", password: "demo1234" };

// Supabase auth errors come in English; map the common ones to Portuguese.
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha inválidos.";
  if (m.includes("rate limit")) return "Muitas tentativas. Tente novamente mais tarde.";
  return "Não foi possível entrar. Tente novamente.";
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function demo() {
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(DEMO);
    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5">
      <Button
        type="button"
        size="lg"
        className="w-full"
        disabled={loading}
        onClick={demo}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Logar para a demo
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
