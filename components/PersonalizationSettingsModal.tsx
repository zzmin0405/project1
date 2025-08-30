'use client';

import React, { useState, useEffect } from 'react';
import { usePersonalization } from '@/context/PersonalizationProvider';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui button
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Assuming shadcn/ui dialog
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Assuming shadcn/ui radio-group
import { Label } from '@/components/ui/label'; // Assuming shadcn/ui label
import { Input } from '@/components/ui/input'; // Assuming shadcn/ui input
import { applyBionic } from '@/lib/bionicUtils';

interface PersonalizationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalizationSettingsModal({ isOpen, onClose }: PersonalizationSettingsModalProps) {
  const { fontSize, textColor, updatePreferences } = usePersonalization();
  const [tempFontSize, setTempFontSize] = useState(fontSize);
  const [tempTextColor, setTempTextColor] = useState(textColor);

  // Update temporary state when global preferences change (e.g., after saving)
  useEffect(() => {
    setTempFontSize(fontSize);
    setTempTextColor(textColor);
  }, [fontSize, textColor]);

  const handleSave = () => {
    updatePreferences({ fontSize: tempFontSize, textColor: tempTextColor });
    onClose();
  };

  const handleCancel = () => {
    // Reset temporary state to current global preferences
    setTempFontSize(fontSize);
    setTempTextColor(textColor);
    onClose();
  };

  const previewText = "이것은 미리보기 문단입니다. 선택한 글자 크기와 색상이 여기에 적용됩니다. The quick brown fox jumps over the lazy dog.";
  const bionicPreview = previewText.split(' ').map((word, index) => (
    <React.Fragment key={index}>
      {applyBionic(word)}
      {index < previewText.split(' ').length - 1 && ' '}
    </React.Fragment>
  ));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>개인화 설정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Font Size */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fontSize" className="text-right">
              글자 크기
            </Label>
            <RadioGroup
              id="fontSize"
              value={tempFontSize}
              onValueChange={setTempFontSize}
              className="flex items-center space-x-2 col-span-3"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small">작게</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">보통</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large">크게</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Text Color */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="textColor" className="text-right">
              글자 색깔
            </Label>
            <Input
              id="textColor"
              type="color"
              value={tempTextColor}
              onChange={(e) => setTempTextColor(e.target.value)}
              className="col-span-3 h-8 w-full"
            />
          </div>

          {/* Preview Paragraph */}
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <p
              className="text-sm" // Base text size for preview container
              style={{
                fontSize: tempFontSize === 'small' ? '0.875rem' : tempFontSize === 'medium' ? '1rem' : '1.125rem',
                color: tempTextColor,
              }}
            >
              {bionicPreview}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}