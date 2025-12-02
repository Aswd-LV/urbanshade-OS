import { InstallerWizard } from "./installer/InstallerWizard";

interface InstallationScreenProps {
  onComplete: (adminData: { username: string; password: string }) => void;
}

export const InstallationScreen = ({ onComplete }: InstallationScreenProps) => {
  return <InstallerWizard onComplete={onComplete} />;
};
