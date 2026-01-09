import React from 'react';
import { usePWA } from '@/hooks/usePWA';
import Button from '@/components/common/Button';
import { FaDownload } from 'react-icons/fa';

interface InstallButtonProps {
  className?: string;
}

const InstallButton: React.FC<InstallButtonProps> = ({ className }) => {
  const { isInstallable, installPWA } = usePWA();

  if (!isInstallable) return null;

  return (
    <Button
      onClick={installPWA}
      variant="primary"
      leftIcon={<FaDownload />}
      className={className}
    >
      Install App
    </Button>
  );
};

export default InstallButton;
