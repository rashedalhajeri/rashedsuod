
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  
  // Check if we're in the store frontend (not dashboard)
  const isStoreFrontend = window.location.pathname.includes('/store/');
  
  // If we're in the store frontend, return an empty div instead of the toaster
  if (isStoreFrontend) {
    return null;
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      duration={1000}  // Solo 1 segundo de duración
      closeButton={false}
      richColors
      expand={false}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:py-2 group-[.toaster]:px-3 group-[.toaster]:max-w-[200px]",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          title: "group-[.toast]:font-medium group-[.toast]:text-sm",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
