import { cn } from "@/lib/utils"

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    className?: string;
}

export function SectionHeader({ title, subtitle, align = "center", className }: SectionHeaderProps) {
    return (
        <div
            className={cn("space-y-4 mb-12", align === "center" && "text-center", className)}
            data-aos="fade-up"
        >
            <div className={cn(
                "inline-block w-12 h-1 rounded-full bg-secondary",
                align === "center" ? "mx-auto" : ""
            )} />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
            {subtitle && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
