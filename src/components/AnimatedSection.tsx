import { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up';
  delay?: number;
}

const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0,
}: AnimatedSectionProps) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'fade-in':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClass()} ${isInView ? 'in-view' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
