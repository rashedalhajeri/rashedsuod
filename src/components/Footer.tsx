
import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const Footer: React.FC = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح، سنتواصل معك قريبًا");
      setName("");
      setEmail("");
      setMessage("");
      setContactOpen(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const footerLinks = [
    {
      title: "المنتج",
      links: [
        { name: "المميزات", href: "#features" },
        { name: "الأسعار", href: "#pricing" },
        { name: "الشروط والأحكام", href: "#" },
        { name: "سياسة الخصوصية", href: "#" },
      ],
    },
    {
      title: "الشركة",
      links: [
        { name: "من نحن", href: "#" },
        { name: "فريق العمل", href: "#" },
        { name: "الوظائف", href: "#" },
        { name: "المدونة", href: "#" },
      ],
    },
    {
      title: "المساعدة",
      links: [
        { name: "قاعدة المعرفة", href: "#" },
        { name: "الأسئلة الشائعة", href: "#" },
        { name: "الدعم الفني", href: "#" },
        { name: "اتصل بنا", href: "#contact", onClick: () => setContactOpen(true) },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 rtl">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold">Linok.me</span>
            </div>
            <p className="text-gray-400 mb-6">
              منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية في الكويت، نوفر لك كل ما تحتاجه لبدء متجرك الإلكتروني بسهولة وسرعة.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-gray-700 transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-gray-700 transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                <Facebook size={18} />
              </a>
            </div>
          </motion.div>
          
          {/* Links */}
          {footerLinks.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
            >
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      onClick={link.onClick}
                      className="text-gray-400 hover:text-white transition-colors inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="flex flex-col md:flex-row gap-6 mb-6 md:mb-0">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-primary ml-2" />
              <span className="text-gray-400">support@linok.me</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-primary ml-2" />
              <span className="text-gray-400">+965 2245 6789</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary ml-2" />
              <span className="text-gray-400">الكويت، مدينة الكويت</span>
            </div>
          </div>
          
          <Button 
            onClick={() => setContactOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            تواصل معنا
          </Button>
        </motion.div>
        
        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} Linok.me. جميع الحقوق محفوظة.
        </div>
      </div>
      
      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              تواصل معنا
            </DialogTitle>
            <DialogDescription className="text-center">
              نحن هنا لمساعدتك! أرسل لنا استفسارك وسنرد عليك في أقرب وقت ممكن.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 p-1 rtl">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                الاسم
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                الرسالة
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full min-h-[120px]"
              />
            </div>
            
            <DialogFooter className="sm:justify-center pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "إرسال"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
