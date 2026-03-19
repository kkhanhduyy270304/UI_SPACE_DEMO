import { motion } from 'framer-motion';
import clsx from 'clsx';
/**
 * Reusable Card component with glassmorphism effect
 */
export const Card = ({
  children,
  className,
  glassmorphism = true,
  onClick
}) => {
  const baseStyles = 'rounded-lg shadow-sm transition-all duration-300';
  const glassStyles = glassmorphism ? 'bg-white/70 backdrop-blur-md border border-slate-200/80' : 'bg-white border border-slate-200';
  return <motion.div className={clsx(baseStyles, glassStyles, className, {
    'cursor-pointer hover:shadow-xl hover:scale-[1.02]': onClick
  })} onClick={onClick} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }}>
      {children}
    </motion.div>;
};
