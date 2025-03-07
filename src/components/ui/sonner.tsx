
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

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
      duration={3000}
      closeButton={true}
      richColors={false}
      expand={false}
      icons={{
        success: <CheckCircle className="h-4 w-4 text-green-500" />,
        error: <AlertTriangle className="h-4 w-4 text-red-500" />,
        warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        info: <Info className="h-4 w-4 text-blue-500" />,
      }}
      toastOptions={{
        className: "!bg-black !text-white border-0 shadow-lg py-2 px-3 min-w-0 max-w-[320px] !rounded-md",
        descriptionClassName: "text-gray-300 text-xs",
        style: { 
          backgroundColor: 'black', 
          color: 'white',
          borderRadius: '6px',
        },
        closeButton: true
      }}
      {...props}
    />
  )
}

export { Toaster }
