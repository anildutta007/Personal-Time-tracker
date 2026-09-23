import React from 'react';
import {
  Moon,
  Footprints,
  Utensils,
  Coffee,
  Bath,
  ShoppingCart,
  Briefcase,
  Clock,
  Home,
  Tv,
  Heart,
  Smile,
  Zap,
  Play,
  Square,
  Plus,
  Trash2,
  Calendar,
  Check,
  ChevronRight,
  Dumbbell,
  BookOpen,
  LucideProps,
} from 'lucide-react';

interface IconResolverProps extends LucideProps {
  name: string;
}

export const IconResolver: React.FC<IconResolverProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Moon':
      return <Moon {...props} />;
    case 'Footprints':
      return <Footprints {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Coffee':
      return <Coffee {...props} />;
    case 'Bath':
      return <Bath {...props} />;
    case 'ShoppingCart':
      return <ShoppingCart {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    case 'Dumbbell':
      return <Dumbbell {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    default:
      return <Clock {...props} />;
  }
};
