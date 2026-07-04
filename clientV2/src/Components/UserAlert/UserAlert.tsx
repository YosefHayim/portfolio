import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

const UserAlert: React.FC<{ alertTitle: string; alertDescription: string }> = ({
  alertTitle,
  alertDescription,
}) => {
  return (
    <Alert className="border-none bg-gray-700 text-white">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription className="text-gray-400">
        {alertDescription}
      </AlertDescription>
    </Alert>
  );
};

export default UserAlert;
