'use client';

import { usePersonalization } from '@/context/PersonalizationProvider';

interface BionicContentDisplayerProps {
  content: string;
}

export default function BionicContentDisplayer({ content }: BionicContentDisplayerProps) {
  const { fontSize, textColor } = usePersonalization();

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'medium':
        return '1rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  };

  const bionicTextStyle = {
    fontSize: getFontSizeValue(fontSize),
    color: textColor,
  };

  return (
    <div
      className="whitespace-pre-wrap text-base leading-relaxed"
      style={bionicTextStyle}
      dangerouslySetInnerHTML={{ __html: content || '' }}
    />
  );
}
